import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { createAdminClient } from "@/lib/supabase-admin";
import { validateAccessLevel } from "@/lib/access";

export const dynamic = "force-dynamic";

interface PreviewBody {
  text: string;
  hint?: string;
}

/**
 * POST /api/admin/ingest/preview
 *
 * Owner-only. Returns where the note would be placed WITHOUT inserting it.
 * Use this to show the user a preview before they commit.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  // Use admin client to bypass RLS when checking owner status.
  // The anon client cannot read profiles until access_level=1 is set,
  // creating a circular dependency right after owner approval.
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("access_level, status")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile || profile.access_level !== 1 || profile.status !== "approved") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return NextResponse.json({ error: "Body must be a JSON object" }, { status: 400 });
  }
  const record = raw as Record<string, unknown>;
  const text = record.text;
  if (typeof text !== "string" || text.trim().length === 0) {
    return NextResponse.json({ error: "text is required and must be non-empty" }, { status: 400 });
  }
  const hint = typeof record.hint === "string" ? record.hint : undefined;

  // Load full hierarchy
  const { data: groups } = await supabase
    .from("exam_groups")
    .select(`id, slug, name,
      subjects(id, slug, name,
        chapters(id, slug, name,
          sub_chapters(id, slug, name,
            topics(id, slug, name))))`);

  const searchable = `${text} ${hint ?? ""}`.toLowerCase();

  // Keyword rules (mirrors lib/ingestion.ts KEYWORD_RULES)
  const KEYWORD_RULES = [
    { keyword: /vector/i, subjectSlug: "physics", chapterSlug: "mechanics", subChapterSlug: "vectors", topicSlug: "vector-addition" },
    { keyword: /mirror|concave|convex|spherical/i, subjectSlug: "physics", chapterSlug: "optics", subChapterSlug: "reflection-curved-surfaces", topicSlug: "mirror-formula" },
    { keyword: /heat|thermodynamic|calorimet/i, subjectSlug: "physics", chapterSlug: "heat", subChapterSlug: "thermodynamics" },
    { keyword: /constitution|fundamental right|article 18|article18/i, subjectSlug: "governance-public-admin", chapterSlug: "constitutional-law", subChapterSlug: "fundamental-rights", topicSlug: "right-to-equality" },
    { keyword: /koshi|karnali|gandaki|saptakoshi|river system/i, subjectSlug: "nepal-geography", chapterSlug: "physical-geography", subChapterSlug: "rivers-of-nepal" },
    { keyword: /gandaki|narayani|trishuli/i, subjectSlug: "nepal-geography", chapterSlug: "physical-geography", subChapterSlug: "rivers-of-nepal", topicSlug: "gandaki-river-system" },
  ];

  const rule = KEYWORD_RULES.find((r) => r.keyword.test(searchable));

  if (rule && groups) {
    const anyGroups = groups as any[];
    const subject = anyGroups
      .flatMap((g) => g.subjects ?? [])
      .find((s: any) => s.slug === rule.subjectSlug);
    const chapter = (subject?.chapters ?? []).find((c: any) => c.slug === rule.chapterSlug);
    const subChapter = rule.subChapterSlug
      ? (chapter?.sub_chapters ?? []).find((sc: any) => sc.slug === rule.subChapterSlug)
      : null;
    const topic = subChapter
      ? (subChapter?.topics ?? []).find((t: any) => t.slug === rule.topicSlug)
      : (chapter?.topics ?? []).find((t: any) => t.slug === rule.topicSlug);

    if (subject && chapter) {
      return NextResponse.json({
        examGroup: null,
        subject: { id: subject.id, name: subject.name, slug: subject.slug },
        chapter: { id: chapter.id, name: chapter.name, slug: chapter.slug },
        subChapter: subChapter ? { id: subChapter.id, name: subChapter.name, slug: subChapter.slug } : null,
        topic: topic ? { id: topic.id, name: topic.name, slug: topic.slug } : null,
        score: 0.9,
        method: "keyword",
      });
    }
  }

  // Fuzzy token matching as fallback
  const tokens = searchable.split(/\W+/).filter((w) => w.length >= 3);
  let best: {
    group: { id: string; name: string; slug: string } | null;
    subject: { id: string; name: string; slug: string } | null;
    chapter: { id: string; name: string; slug: string } | null;
    subChapter: { id: string; name: string; slug: string } | null;
    topic: { id: string; name: string; slug: string } | null;
    score: number;
  } | null = null;

  for (const group of groups ?? []) {
    const anyGroup = group as any;
    for (const subject of anyGroup.subjects ?? []) {
      const subjectScore = scoreMatch(subject.name, tokens);
      for (const chapter of subject.chapters ?? []) {
        const chapterScore = scoreMatch(chapter.name, tokens);
        let bestSubChapter: { id: string; name: string; slug: string } | null = null;
        let bestTopic: { id: string; name: string; slug: string } | null = null;
        let bestTopicScore = 0;
        for (const sub of chapter.sub_chapters ?? []) {
          const subScore = scoreMatch(sub.name, tokens);
          for (const topic of sub.topics ?? []) {
            const topicScore = scoreMatch(topic.name, tokens);
            const combined = subScore + topicScore;
            if (combined > bestTopicScore) {
              bestTopicScore = combined;
              bestSubChapter = { id: sub.id, name: sub.name, slug: sub.slug };
              bestTopic = { id: topic.id, name: topic.name, slug: topic.slug };
            }
          }
        }
        const total = subjectScore + chapterScore + bestTopicScore;
        if (best === null || total > best.score) {
          best = {
            group: { id: group.id, name: group.name, slug: group.slug },
            subject: { id: subject.id, name: subject.name, slug: subject.slug },
            chapter: { id: chapter.id, name: chapter.name, slug: chapter.slug },
            subChapter: bestSubChapter,
            topic: bestTopic,
            score: total,
          };
        }
      }
    }
  }

  if (!best || best.score < 1) {
    return NextResponse.json({
      examGroup: null,
      subject: null,
      chapter: null,
      subChapter: null,
      topic: null,
      score: 0,
      method: "none",
      message: "Could not auto-classify. Please select a topic manually.",
    });
  }

  return NextResponse.json({
    examGroup: best.group,
    subject: best.subject,
    chapter: best.chapter,
    subChapter: best.subChapter,
    topic: best.topic,
    score: Math.min(best.score / 10, 1.0),
    method: "fuzzy",
  });
}

function scoreMatch(name: string, tokens: string[]): number {
  const words = name.toLowerCase().split(/\W+/).filter((w) => w.length >= 3);
  let score = 0;
  for (const token of tokens) {
    if (words.some((w) => w.includes(token) || token.includes(w))) score += 1;
  }
  return score;
}
