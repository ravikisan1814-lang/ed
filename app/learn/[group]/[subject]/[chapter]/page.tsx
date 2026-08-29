import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import type { ExamGroupNode } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getChapter(groupSlug: string, subjectSlug: string, chapterSlug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exam_groups")
    .select(
      `id, slug, name, description, sort_order,
       subjects(id, slug, name, description, sort_order,
         chapters(id, slug, name, description, sort_order,
           sub_chapters(id, slug, name, description, sort_order,
             topics(id, slug, name, description, sort_order,
               content_items(id, title, access_level, owner_contact, public_teaser)
             )
           )
         )
       )`
    )
    .eq("slug", groupSlug)
    .single();

  if (error || !data) return null;

  const group = data as unknown as ExamGroupNode;
  const subject = group.subjects?.find((s) => s.slug === subjectSlug);
  if (!subject) return null;
  const chapter = subject.chapters?.find((c) => c.slug === chapterSlug);
  if (!chapter) return null;

  return { group, subject, chapter };
}

interface ChapterPageProps {
  params: Promise<{ group: string; subject: string; chapter: string }>;
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { group, subject, chapter } = await params;
  const data = await getChapter(group, subject, chapter);
  if (!data) notFound();

  const { group: gNode, subject: sNode, chapter: cNode } = data;

  const allSubChapters = (cNode.sub_chapters ?? []).map((sub) => ({
    ...sub,
    topicCount: (sub.topics ?? []).length,
    itemCount: (sub.topics ?? []).reduce(
      (sum, t) => sum + ((t.content_items ?? []).length),
      0
    ),
  }));

  const breadcrumbs = [
    { label: "Learn", href: "/learn" },
    { label: gNode.name, href: `/learn/${gNode.slug}` },
    { label: sNode.name, href: `/learn/${gNode.slug}/${sNode.slug}` },
  ];

  return (
    <div className="chapter-page">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <ol>
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.href + index}>
                {index === breadcrumbs.length - 1 ? (
                  <span aria-current="page" className="breadcrumb-current">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="breadcrumb-link">{crumb.label}</Link>
                )}
              </li>
            ))}
            <li>
              <span aria-current="page" className="breadcrumb-current">{cNode.name}</span>
            </li>
          </ol>
        </nav>

        <section className="chapter-hero">
          <h1>{cNode.name}</h1>
          {cNode.description && <p className="chapter-desc">{cNode.description}</p>}
          <div className="chapter-meta">
            <span>{gNode.name} / {sNode.name}</span>
            <span>{allSubChapters.length} sub-chapter{allSubChapters.length !== 1 ? "s" : ""}</span>
          </div>
        </section>

        <section className="content-section">
          <h2>Sub-chapters &amp; Topics</h2>
          {allSubChapters.length === 0 ? (
            <div className="under-development">
              <span className="ud-icon">🔮</span>
              <span>Under development — will be added in future update</span>
            </div>
          ) : (
            <div className="subchapter-list">
              {allSubChapters.map((sub) => (
                <div key={sub.id} className="subchapter-card">
                  <Link href={`/learn/${gNode.slug}/${sNode.slug}/${cNode.slug}/${sub.slug}`} className="subchapter-card-link">
                    <h3>{sub.name}</h3>
                    {sub.description && <p className="subchapter-desc">{sub.description}</p>}
                    <div className="subchapter-meta">
                      <span>{sub.topicCount} topic{sub.topicCount !== 1 ? "s" : ""}</span>
                      <span className="arrow">→</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        <nav className="chapter-nav">
          <Link href={`/learn/${gNode.slug}/${sNode.slug}`} className="btn btn-secondary">
            ← Back to subjects
          </Link>
        </nav>
      </div>
  );
}
