import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
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

  const { data: profile } = await supabase
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
    { keyword: /vector/i, subjectSlug: "physics", chapterSlug: "vectors", topicSlug: "vector-addition" },
    { keyword: /mirror|concave|convex|spherical/i, subjectSlug: "physics", chapterSlug: "reflection-curved-mirrors", topicSlug: "mirror-formula" },
    { keyword: /heat|thermodynamic|calorimet/i, subjectSlug: "physics", chapterSlug: "heat-thermodynamics", topicSlug: "thermo-topic2" },
    { keyword: /mole|stoichiometr|avogadro/i, subjectSlug: "chemistry", chapterSlug: "stoichiometry", topicSlug: "mole-topic" },
    { keyword: /atom|quantum|electron|orbital/i, subjectSlug: "chemistry", chapterSlug: "atomic-structure", topicSlug: "quantum-topics" },
    { keyword: /bond|vsepr|hybridiz/i, subjectSlug: "chemistry", chapterSlug: "chemical-bonding", topicSlug: "vsepr-shapes" },
    { keyword: /gas law|boyle|charles|ideal gas/i, subjectSlug: "chemistry", chapterSlug: "states-of-matter", topicSlug: "gas-laws-topic" },
    { keyword: /set|venn|subset|cardinality/i, subjectSlug: "mathematics", chapterSlug: "set-theory", topicSlug: "set-theory-topic" },
    { keyword: /matrix|determinant|transpose/i, subjectSlug: "mathematics", chapterSlug: "matrices", topicSlug: "matrices-topic" },
    { keyword: /binomial|expansion|coefficient/i, subjectSlug: "mathematics", chapterSlug: "binomial-theorem", topicSlug: "binomial-topic" },
    { keyword: /trigonometr|sin|cos|tan|inverse trig/i, subjectSlug: "mathematics", chapterSlug: "trigonometry", topicSlug: "trigonometry-topic" },
    { keyword: /logarithm|log|exponential/i, subjectSlug: "mathematics", chapterSlug: "logarithm", topicSlug: "logarithm-topic" },
    { keyword: /line|slope|equation of line/i, subjectSlug: "mathematics", chapterSlug: "straight-line", topicSlug: "straight-line-topic" },
    { keyword: /limit|continuity|derivative/i, subjectSlug: "mathematics", chapterSlug: "limits", topicSlug: "limits-topic" },
    { keyword: /differentiation|chain rule|implicit/i, subjectSlug: "mathematics", chapterSlug: "differentiation", topicSlug: "differentiation-topic" },
    { keyword: /statistics|mean|median|mode|variance/i, subjectSlug: "mathematics", chapterSlug: "statistics", topicSlug: "statistics-topic" },
    { keyword: /cell|mitosis|meiosis|division/i, subjectSlug: "biology", chapterSlug: "biomolecules-cell-biology", topicSlug: "cell-division-topic" },
    { keyword: /fungi|lichen|algae|moss|fern/i, subjectSlug: "biology", chapterSlug: "floral-diversity", topicSlug: "plant-diversity-topic" },
    { keyword: /virus|bacteria|microbe/i, subjectSlug: "biology", chapterSlug: "introductory-microbiology", topicSlug: "monera-bacteria" },
    { keyword: /ecosystem|food chain|cycle|pollution/i, subjectSlug: "biology", chapterSlug: "ecology", topicSlug: "ecosystem-topic" },
    { keyword: /evolution|darwin|origin life/i, subjectSlug: "biology", chapterSlug: "evolutionary-biology", topicSlug: "evolution-topic" },
    { keyword: /animal|worm|frog|phylum/i, subjectSlug: "biology", chapterSlug: "faunal-diversity", topicSlug: "animal-diversity-topic" },
    { keyword: /conservation|biodiversity|national park/i, subjectSlug: "biology", chapterSlug: "conservation-biology", topicSlug: "conservation-topic" },
  ];

  const rule = KEYWORD_RULES.find((r) => r.keyword.test(searchable));

  if (rule && groups) {
    const anyGroups = groups as any[];
    const subject = anyGroups
      .flatMap((g) => g.subjects ?? [])
      .find((s: any) => s.slug === rule.subjectSlug);
    const chapter = (subject?.chapters ?? []).find((c: any) => c.slug === rule.chapterSlug);
    const topic = (chapter?.topics ?? []).find((t: any) => t.slug === rule.topicSlug);

    if (subject && chapter) {
      return NextResponse.json({
        examGroup: null,
        subject: { id: subject.id, name: subject.name, slug: subject.slug },
        chapter: { id: chapter.id, name: chapter.name, slug: chapter.slug },
        subChapter: null,
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
    topic: { id: string; name: string; slug: string } | null;
    score: number;
  } | null = null;

  for (const group of groups ?? []) {
    const anyGroup = group as any;
    for (const subject of anyGroup.subjects ?? []) {
      const subjectScore = scoreMatch(subject.name, tokens);
      for (const chapter of subject.chapters ?? []) {
        const chapterScore = scoreMatch(chapter.name, tokens);
        let bestTopic: { id: string; name: string; slug: string } | null = null;
        let bestTopicScore = 0;
        for (const topic of chapter.topics ?? []) {
          const topicScore = scoreMatch(topic.name, tokens);
          if (topicScore > bestTopicScore) {
            bestTopicScore = topicScore;
            bestTopic = { id: topic.id, name: topic.name, slug: topic.slug };
          }
        }
        const total = subjectScore + chapterScore + bestTopicScore;
        if (best === null || total > best.score) {
          best = {
            group: { id: group.id, name: group.name, slug: group.slug },
            subject: { id: subject.id, name: subject.name, slug: subject.slug },
            chapter: { id: chapter.id, name: chapter.name, slug: chapter.slug },
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
    subChapter: null,
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
