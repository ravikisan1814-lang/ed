import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import type { ExamGroupNode } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getTopic(groupSlug: string, subjectSlug: string, chapterSlug: string, subChapterSlug: string, topicSlug: string) {
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
  const topic = sub.topics?.find((t) => t.slug === topicSlug);
  if (!topic) return null;

  return { group, subject, chapter, sub, topic };
}

interface TopicPageProps {
  params: Promise<{ group: string; subject: string; chapter: string; subChapter: string; topic: string }>;
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { group, subject, chapter, subChapter, topic } = await params;
  const data = await getTopic(group, subject, chapter, subChapter, topic);
  if (!data) notFound();

  const { group: gNode, subject: sNode, chapter: cNode, sub: scNode, topic: tNode } = data;
  const items = tNode.content_items ?? [];

  const breadcrumbs = [
    { label: "Learn", href: "/learn" },
    { label: gNode.name, href: `/learn/${gNode.slug}` },
    { label: sNode.name, href: `/learn/${gNode.slug}/${sNode.slug}` },
    { label: cNode.name, href: `/learn/${gNode.slug}/${sNode.slug}/${cNode.slug}` },
    { label: scNode.name, href: `/learn/${gNode.slug}/${sNode.slug}/${cNode.slug}/${scNode.slug}` },
  ];

  return (
    <div className="topic-page">
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
            <li><span aria-current="page" className="breadcrumb-current">{tNode.name}</span></li>
          </ol>
        </nav>

        <section className="topic-hero">
          <h1>{tNode.name}</h1>
          {tNode.description && <p className="topic-desc">{tNode.description}</p>}
        </section>

        <section className="content-section">
          <h2>Notes &amp; Study Material</h2>
          {items.length === 0 ? (
            <p className="explorer-empty">No notes published for this topic yet.</p>
          ) : (
            <div className="item-list">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/learn/${gNode.slug}/${sNode.slug}/${cNode.slug}/${scNode.slug}/${tNode.slug}/${item.id}`}
                  className="item-card"
                >
                  <div className="item-card-body">
                    <h3>{item.title}</h3>
                    <div
                      className="item-teaser"
                      dangerouslySetInnerHTML={{ __html: item.public_teaser }}
                    />
                  </div>
                  <span className={`badge ${item.access_level < 4 ? "badge-locked" : "badge-open"}`}>
                    {item.access_level < 4 ? `Tier ${item.access_level}` : "Open"}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <nav className="chapter-nav">
          <Link href={`/learn/${gNode.slug}/${sNode.slug}/${cNode.slug}/${scNode.slug}`} className="btn btn-secondary">
            ← Back to {scNode.name}
          </Link>
        </nav>
      </div>
  );
}
