import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import type { ExamGroupNode } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getSubChapter(groupSlug: string, subjectSlug: string, chapterSlug: string, subChapterSlug: string) {
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
  const sub = chapter.sub_chapters?.find((sc) => sc.slug === subChapterSlug);
  if (!sub) return null;

  return { group, subject, chapter, sub };
}

interface SubChapterPageProps {
  params: Promise<{ group: string; subject: string; chapter: string; subChapter: string }>;
}

export default async function SubChapterPage({ params }: SubChapterPageProps) {
  const { group, subject, chapter, subChapter } = await params;
  const data = await getSubChapter(group, subject, chapter, subChapter);
  if (!data) notFound();

  const { group: gNode, subject: sNode, chapter: cNode, sub: scNode } = data;
  const topics = scNode.topics ?? [];

  const breadcrumbs = [
    { label: "Learn", href: "/learn" },
    { label: gNode.name, href: `/learn/${gNode.slug}` },
    { label: sNode.name, href: `/learn/${gNode.slug}/${sNode.slug}` },
    { label: cNode.name, href: `/learn/${gNode.slug}/${sNode.slug}/${cNode.slug}` },
  ];

  return (
    <div className="topic-list-page">
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
            <li><span aria-current="page" className="breadcrumb-current">{scNode.name}</span></li>
          </ol>
        </nav>

        <section className="topic-list-hero">
          <h1>{scNode.name}</h1>
          {scNode.description && <p className="topic-list-desc">{scNode.description}</p>}
          <div className="topic-list-meta">
            <span>{topics.length} topic{topics.length !== 1 ? "s" : ""}</span>
          </div>
        </section>

        <section className="content-section">
          {topics.length === 0 ? (
            <div className="under-development">
              <span className="ud-icon">🔮</span>
              <span>Under development — will be added in future update</span>
            </div>
          ) : (
            <div className="topic-list">
              {topics.map((topic) => {
                const itemCount = (topic.content_items ?? []).length;
                const firstItem = topic.content_items?.[0];
                return (
                  <div key={topic.id} className="topic-card">
                    <Link href={`/learn/${gNode.slug}/${sNode.slug}/${cNode.slug}/${scNode.slug}/${topic.slug}`}>
                      <h3>{topic.name}</h3>
                      {topic.description && <p className="topic-desc">{topic.description}</p>}
                      {firstItem && (
                        <div className="topic-preview">
                          <div
                            className="topic-teaser"
                            dangerouslySetInnerHTML={{ __html: firstItem.public_teaser }}
                          />
                          <span className={`badge ${firstItem.access_level < 4 ? "badge-locked" : "badge-open"}`}>
                            {firstItem.access_level < 4 ? `Tier ${firstItem.access_level}` : "Open"}
                          </span>
                        </div>
                      )}
                    </Link>
                    <div className="topic-card-footer">
                      <span>{itemCount} note{itemCount !== 1 ? "s" : ""}</span>
                      <Link href={`/learn/${gNode.slug}/${sNode.slug}/${cNode.slug}/${scNode.slug}/${topic.slug}`} className="btn btn-primary btn-sm">
                        Browse →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <nav className="chapter-nav">
          <Link href={`/learn/${gNode.slug}/${sNode.slug}/${cNode.slug}`} className="btn btn-secondary">
            ← Back to {cNode.name}
          </Link>
        </nav>
      </div>
  );
}
