"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type {
  ExamGroupNode,
  SubjectNode,
  ChapterNode,
  SubChapterNode,
  TopicNode,
  ContentItemSummary,
  AccessLevel,
} from "@/lib/types";

interface SimpleHierarchyProps {
  path?: string[];
  accessibleItems?: Array<{
    id: string;
    title: string;
    access_level: AccessLevel;
    public_teaser: string;
    topic_id: string;
  }>;
}

type Node = ExamGroupNode | SubjectNode | ChapterNode | SubChapterNode | TopicNode;

interface FlatItem extends ContentItemSummary {
  fullPath: string[];
}

export default function SimpleHierarchy({
  path = [],
  accessibleItems,
}: SimpleHierarchyProps) {
  const [tree, setTree] = useState<ExamGroupNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/hierarchy");
        const json = await res.json();
        if (!cancelled) setTree(json.data ?? []);
      } catch {
        if (!cancelled) setTree([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="simple-hierarchy" aria-busy="true">
        <div className="card-skeleton" />
        <div className="card-skeleton" />
        <div className="card-skeleton" />
      </div>
    );
  }

  if (tree.length === 0) {
    return (
      <div className="under-development">
        <span className="ud-icon">🔮</span>
        <span>Under development — will be added in future update</span>
      </div>
    );
  }

  const node = resolveNode(tree, path);

  if (!node) {
    return (
      <div className="under-development">
        <span className="ud-icon">🔮</span>
        <span>Under development — will be added in future update</span>
      </div>
    );
  }

  const items = flattenContent(node, path, accessibleItems);

  return (
    <div className="simple-hierarchy">
      <Breadcrumb path={path} />
      <h1 className="simple-hierarchy-title">{node.name}</h1>
      {node.description && (
        <p className="simple-hierarchy-desc">{node.description}</p>
      )}

      {items.length === 0 && (
        <div className="under-development">
          <span className="ud-icon">🔮</span>
          <span>Under development — will be added in future update</span>
        </div>
      )}

      <div className="notes-list">
        {items.map((item) => (
          <article key={item.id} className="note-card">
            <h3 className="note-card-title">{item.title}</h3>
            <div
              className="note-card-teaser"
              dangerouslySetInnerHTML={{
                __html: item.public_teaser ?? "",
              }}
            />
            <div className="note-card-meta">
              <span
                className={`badge ${
                  item.access_level < 4 ? "badge-locked" : "badge-open"
                }`}
              >
                {item.access_level < 4 ? `Tier ${item.access_level}+` : "Open"}
              </span>
              <Link
                href={`/learn/${item.fullPath.join("/")}`}
                className="btn btn-primary btn-sm"
              >
                Read notes
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function resolveNode(
  tree: ExamGroupNode[],
  path: string[]
): Node | null {
  let current: Node[] = tree;
  let node: Node | null = null;

  for (const segment of path) {
    const found = current.find((n) => n.slug === segment);
    if (!found) return null;
    node = found;
    if ("subjects" in found) current = found.subjects ?? [];
    else if ("chapters" in found) current = found.chapters ?? [];
    else if ("sub_chapters" in found)
      current = found.sub_chapters ?? [];
    else if ("topics" in found) current = found.topics ?? [];
    else current = [];
  }

  return node;
}

function flattenContent(
  node: Node,
  basePath: string[],
  accessibleItems?: Array<{
    id: string;
    title: string;
    access_level: AccessLevel;
    public_teaser: string;
    topic_id: string;
  }>
): FlatItem[] {
  const items: FlatItem[] = [];

  // If accessibleItems is provided (server-side filtered), use those
  if (accessibleItems && accessibleItems.length > 0) {
    for (const ci of accessibleItems) {
      items.push({
        id: ci.id,
        topic_id: ci.topic_id,
        title: ci.title,
        access_level: ci.access_level,
        owner_contact: null,
        public_teaser: ci.public_teaser,
        fullPath: [...basePath, ci.id],
      });
    }
    return items;
  }

  // Fallback: use tree-based flattening
  if ("content_items" in node && node.content_items) {
    for (const ci of node.content_items) {
      items.push({ ...ci, fullPath: [...basePath, ci.id] });
    }
    return items;
  }

  if ("topics" in node && node.topics) {
    for (const topic of node.topics) {
      const topicPath = [...basePath, topic.slug];
      for (const ci of topic.content_items ?? []) {
        items.push({ ...ci, fullPath: [...topicPath, ci.id] });
      }
    }
    return items;
  }

  if ("sub_chapters" in node && node.sub_chapters) {
    for (const sub of node.sub_chapters) {
      for (const topic of sub.topics ?? []) {
        const topicPath = [...basePath, sub.slug, topic.slug];
        for (const ci of topic.content_items ?? []) {
          items.push({ ...ci, fullPath: [...topicPath, ci.id] });
        }
      }
    }
    return items;
  }

  if ("chapters" in node && node.chapters) {
    for (const chapter of node.chapters) {
      for (const sub of chapter.sub_chapters ?? []) {
        for (const topic of sub.topics ?? []) {
          const topicPath = [...basePath, chapter.slug, sub.slug, topic.slug];
          for (const ci of topic.content_items ?? []) {
            items.push({ ...ci, fullPath: [...topicPath, ci.id] });
          }
        }
      }
    }
    return items;
  }

  if ("subjects" in node && node.subjects) {
    for (const subject of node.subjects) {
      for (const chapter of subject.chapters ?? []) {
        for (const sub of chapter.sub_chapters ?? []) {
          for (const topic of sub.topics ?? []) {
            const topicPath = [
              ...basePath,
              subject.slug,
              chapter.slug,
              sub.slug,
              topic.slug,
            ];
            for (const ci of topic.content_items ?? []) {
              items.push({ ...ci, fullPath: [...topicPath, ci.id] });
            }
          }
        }
      }
    }
    return items;
  }

  return items;
}

function Breadcrumb({ path }: { path: string[] }) {
  const crumbs = [{ label: "Learn", href: "/learn" }];
  let accumulated = "";
  for (const segment of path) {
    accumulated += "/" + segment;
    crumbs.push({
      label: segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      href: "/learn" + accumulated,
    });
  }

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.href + index}>
              {isLast ? (
                <span
                  aria-current="page"
                  className="breadcrumb-current"
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="breadcrumb-link"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
