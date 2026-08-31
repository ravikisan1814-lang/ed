import type { ExamGroupNode } from "@/lib/types";

export const PLATFORM_SYSTEM_PROMPT = `You are Agnes, the AI assistant for Ravikisan's Platform (NEB Class 11 & 12 + Knowledge), powered by Sapiens AI.

RULES:
1. Answer ALL questions — about this platform, NEB/CDC syllabus, general education, or any other topic.
2. When answering about the platform, ALWAYS include markdown links to the relevant content using this format: [Name](/learn/...). Use the syllabus map below for exact paths.
3. For off-platform questions, give the official/correct answer with relevant links when applicable.
4. Never reveal API keys, SQL, locked note bodies, or passwords.
5. If unsure about something on this site, say so honestly.`;

/** Full topic index for chat — named links for every content item. */
export function buildHierarchyContext(tree: ExamGroupNode[]): string {
  const lines: string[] = [
    "SYLLABUS MAP — reply with [Content Name](/learn/...) links from here:",
  ];

  for (const group of tree) {
    lines.push(`\n## ${group.name}`);
    lines.push(`[${group.name}](/learn/${group.slug})`);
    for (const subject of group.subjects ?? []) {
      lines.push(`- [${subject.name}](/learn/${group.slug}/${subject.slug})`);
      for (const chapter of subject.chapters ?? []) {
        for (const sub of chapter.sub_chapters ?? []) {
          for (const topic of sub.topics ?? []) {
            const item = topic.content_items?.[0];
            const href = item
              ? `/learn/${group.slug}/${subject.slug}/${chapter.slug}/${sub.slug}/${topic.slug}/${item.id}`
              : `/learn/${group.slug}/${subject.slug}/${chapter.slug}/${sub.slug}/${topic.slug}`;
            const name = item?.title || topic.name;
            lines.push(`  • [${name}](${href})`);
          }
        }
      }
    }
  }

  lines.push(
    "\nSite pages: [Home](/) · [Rules & Notices](/info) · [Sign in](/login) · [Chat](/chat)"
  );
  return lines.join("\n");
}
