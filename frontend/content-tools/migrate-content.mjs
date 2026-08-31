/**
 * Migration script: imports JSON content from the ravikishan project
 * (../ravikishan/migrated-content, ../ravikishan/backend/content,
 *  ../ravikishan/backend/prisma/import-data/content,
 *  ../ravikishan/backend-class12-test/content) into this platform's Supabase database.
 *
 * Target: academic-core exam group (pre-seeded by migration 0004).
 *
 * Folder structure -> hierarchy mapping:
 *   class-11|class-11e|class-12  -> source class folders (exam group by class)
 *   physics|chemistry|...        -> subjects (matched to existing subjects)
 *   unit-2-stoichiometry|...     -> chapters
 *   concepts|sets|examples|...   -> sub_chapters (content type)
 *   NN-name.json                 -> topics + content_items
 *
 * Subject-first layouts (import-data/content) are mapped through config/content-map.json
 * (source subject folder -> destination exam group + subject slug). Duplicated class
 * folders (class-12/class-12/...) are normalized automatically.
 *
 * Usage:
 *   node scripts/migrate-content.mjs
 *
 * Requires env vars (set in .env.local or shell):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   MIGRATE_SOURCE_DIRS        (optional, comma-separated paths, defaults to:
 *                              ../ravikishan/migrated-content,
 *                              ../ravikishan/backend/content,
 *                              ../ravikishan/backend/prisma/import-data/content,
 *                              ../ravikishan/backend-class12-test/content)
 *   MIGRATE_TARGET_EXAM_GROUP  (optional; overrides placement when set)
 *   MIGRATE_SOURCE_CLASSES     (optional, comma-separated, default class-11,class-11e,class-12)
 *   MIGRATE_CONTENT_MAP        (optional; path to JSON mapping config, default config/content-map.json)
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const envPath = join(projectRoot, ".env.local");

function loadEnv() {
  const env = { ...process.env };
  if (!existsSync(envPath)) return env;
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const i = line.indexOf("=");
    const k = line.slice(0, i).trim();
    const v = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    if (!(k in env) || !env[k]) env[k] = v;
  }
  return env;
}

const env = loadEnv();

// 1. Environment
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const TARGET_EXAM_GROUP = env.MIGRATE_TARGET_EXAM_GROUP ?? null; // null = auto-detect from source

const CLASS_TO_EXAM_GROUP = {
  "class-11": "class-11",
  "class-11e": "class-11e",
  "class-12": "class-12",
};

// For import-data/content (no class level), map subjects to exam groups
const IMPORT_SUBJECT_TO_EXAM_GROUP = {
  physics: "academic-core",
  chemistry: "class-11",
  mathematics: "class-11",
  biology: "class-11",
  english: "class-11",
  nepali: "class-11",
  "computer-science": "class-11",
  "general-knowledge": "loksewa-gk",
  loksewa: "loksewa-gk",
};
const SOURCE_CLASSES = (env.MIGRATE_SOURCE_CLASSES ?? "class-11,class-11e,class-12")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const defaultSourceDirs = [
  join(projectRoot, "..", "ravikishan", "migrated-content"),
  join(projectRoot, "..", "ravikishan", "backend", "content"),
  join(projectRoot, "..", "ravikishan", "backend", "prisma", "import-data", "content"),
  join(projectRoot, "..", "ravikishan", "backend-class12-test", "content"),
];
const SOURCE_DIR_LIST = (env.MIGRATE_SOURCE_DIRS ?? defaultSourceDirs.join(","))
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const IMPORT_DATA_CONTENT_DIR = join(projectRoot, "..", "ravikishan", "backend", "prisma", "import-data", "content");

const CONTENT_MAP_PATH = env.MIGRATE_CONTENT_MAP
  ? join(projectRoot, env.MIGRATE_CONTENT_MAP)
  : join(projectRoot, "config", "content-map.json");

function loadContentMap() {
  if (existsSync(CONTENT_MAP_PATH)) {
    try {
      return JSON.parse(readFileSync(CONTENT_MAP_PATH, "utf8"));
    } catch (err) {
      console.warn(`  WARNING: Could not parse content map ${CONTENT_MAP_PATH}: ${err.message}`);
    }
  }
  return {};
}

const contentMap = loadContentMap();
const SUBJECT_PLACEMENTS = contentMap.subjectPlacements ?? {};

SOURCE_DIR_LIST.forEach((dir) => {
  if (!existsSync(dir)) {
    console.warn(`  WARNING: Source directory not found: ${dir}`);
  }
});
const anyExists = SOURCE_DIR_LIST.some((d) => existsSync(d));
if (!anyExists) {
  console.error("No source directories found. Set MIGRATE_SOURCE_DIRS env var or check default paths.");
  process.exit(1);
}

const SUBJECT_MAP = {
  physics: "physics",
  chemistry: "chemistry",
  mathematics: "mathematics",
  biology: "biology",
  english: "english",
  nepali: "nepali",
  "computer-science": "computer-science",
  "general-knowledge": "general-knowledge",
  loksewa: "loksewa",
};

const TYPE_LABELS = {
  concepts: "Concepts",
  sets: "Practice Sets",
  examples: "Worked Examples",
  formula: "Formulas",
  mindmap: "Mind Map",
  notes: "Quick Notes",
  pyqs: "Past Year Questions",
  graph: "Graphs",
};

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing required env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// 2. Helpers
function collectJsonFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) results.push(...collectJsonFiles(full));
    else if (entry.endsWith(".json")) results.push(full);
  }
  return results;
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/-{2,}/g, "-");
}

function chapterNameFromSlug(slug) {
  return slug.replace(/^unit-\d+-/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function typeNameFromSlug(slug) {
  const special = {
    concepts: "Concepts",
    sets: "Practice Sets",
    examples: "Worked Examples",
    formula: "Formulas",
    mindmap: "Mind Map",
    notes: "Quick Notes",
    pyqs: "Past Year Questions",
    graph: "Graphs",
    overview: "Overview",
    syllabus: "Syllabus",
    introduction: "Introduction",
    "mcqs": "MCQs",
    "short-answer": "Short Answer Questions",
    "long-answer": "Long Answer Questions",
  };
  return special[slug] ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function notesToHtml(title, notes) {
  const body = (notes ?? []).map((line) => {
    const t = line.trim();
    if (!t) return "";
    if (t.startsWith("### ")) return `<h4>${t.slice(4)}</h4>`;
    if (t.startsWith("## ")) return `<h3>${t.slice(3)}</h3>`;
    if (t.startsWith("# ")) return `<h2>${t.slice(2)}</h2>`;
    if (/^[-*•]\s+/.test(t)) return `<li>${t.replace(/^[-*•]\s+/, "")}</li>`;
    if (/^\d+[.)]\s+/.test(t)) return `<li>${t.replace(/^\d+[.)]\s+/, "")}</li>`;
    const bold = t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    return `<p>${bold.replace(/`(.+?)`/g, "<code>$1</code>")}</p>`;
  }).join("");
  return `<h3>${title}</h3>${body}`;
}

function richFormatToHtml(raw) {
  const sections = [];
  const title = raw.title ?? "Untitled";
  sections.push(`<h3>${title}</h3>`);
  const sectionFields = [
    { key: "summary", label: "Summary" },
    { key: "notes", label: "Notes" },
    { key: "keyPoints", label: "Key Points" },
    { key: "examples", label: "Examples" },
    { key: "practice", label: "Practice" },
    { key: "formulas", label: "Formulas" },
  ];
  for (const f of sectionFields) {
    if (raw[f.key]) {
      const notes = Array.isArray(raw[f.key]) ? raw[f.key] : [String(raw[f.key])];
      sections.push(`<h4>${f.label}</h4>`);
      for (const line of notes) {
        const t = line.trim();
        if (!t) continue;
        if (t.startsWith("### ")) { sections.push(`<h5>${t.slice(4)}</h5>`); continue; }
        if (t.startsWith("## ")) { sections.push(`<h4>${t.slice(3)}</h4>`); continue; }
        if (/^[-*•]\s+/.test(t)) { sections.push(`<li>${t.replace(/^[-*•]\s+/, "")}</li>`); continue; }
        if (/^\d+[.)]\s+/.test(t)) { sections.push(`<li>${t.replace(/^\d+[.)]\s+/, "")}</li>`); continue; }
        const bold = t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
        sections.push(`<p>${bold.replace(/`(.+?)`/g, "<code>$1</code>")}</p>`);
      }
    }
  }
  return sections.join("");
}

function buildTeaser(title, notes) {
  const first = (notes ?? []).find((n) => n.trim().length > 0);
  if (!first) return `<p>Open concept for ${title}: a short, free introduction.</p>`;
  const clean = first.replace(/\*\*(.+?)\*\*/g, "$1").replace(/`(.+?)`/g, "$1").replace(/^[-*•\s]+/, "").replace(/^\d+[.)]\s+/, "").slice(0, 200);
  return `<p>${clean}${clean.length >= 200 ? "…" : ""}</p>`;
}

// 3. Hierarchy lookup helpers
async function getExamGroupId(slug) {
  const { data, error } = await admin.from("exam_groups").select("id").eq("slug", slug).maybeSingle();
  if (error) throw new Error(`Failed to fetch exam group ${slug}: ${error.message}`);
  return data?.id ?? null;
}

async function getSubjectId(examGroupId, slug) {
  const { data, error } = await admin
    .from("subjects")
    .select("id")
    .eq("exam_group_id", examGroupId)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`Failed to fetch subject ${slug}: ${error.message}`);
  return data?.id ?? null;
}

async function getChapterIdBySubject(subjectId, chapterSlug) {
  if (!subjectId) return null;
  const { data, error } = await admin.from("chapters").select("id").eq("subject_id", subjectId).eq("slug", chapterSlug).maybeSingle();
  if (error) throw new Error(`Failed to fetch chapter ${chapterSlug}: ${error.message}`);
  return data?.id ?? null;
}

async function getSubChapterId(chapterId, slug) {
  const { data, error } = await admin.from("sub_chapters").select("id").eq("chapter_id", chapterId).eq("slug", slug).maybeSingle();
  if (error) throw new Error(`Failed to fetch sub-chapter ${slug}: ${error.message}`);
  return data?.id ?? null;
}

async function getTopicId(subChapterId, slug) {
  const { data, error } = await admin.from("topics").select("id").eq("sub_chapter_id", subChapterId).eq("slug", slug).maybeSingle();
  if (error) throw new Error(`Failed to fetch topic ${slug}: ${error.message}`);
  return data?.id ?? null;
}

async function upsert(table, row, conflict) {
  const { data, error } = await admin.from(table).upsert(row, { onConflict: conflict }).select("id").single();
  if (error) throw new Error(`${table} upsert failed: ${error.message}`);
  return data.id;
}

async function main() {
  console.log(`\n=== Content Migration ===`);
  console.log(`Source dirs: ${SOURCE_DIR_LIST.join(", ")}`);
  if (TARGET_EXAM_GROUP) {
    console.log(`Target exam group: ${TARGET_EXAM_GROUP} (override)`);
  } else {
    console.log(`Target exam groups: auto-detected per source`);
  }
  console.log(`Source classes: ${SOURCE_CLASSES.join(", ")}`);
  console.log(`Supabase: ${SUPABASE_URL}\n`);

  // Collect JSON files from all source directories, grouping by target exam group
  const allJsonFiles = [];
  for (const dir of SOURCE_DIR_LIST) {
    if (!existsSync(dir)) {
      console.warn(`  WARNING: Source directory not found: ${dir}`);
      continue;
    }
    const files = collectJsonFiles(dir);
    console.log(`  ${dir}: ${files.length} JSON files`);
    allJsonFiles.push(...files.map((f) => ({ file: f, sourceDir: dir })));
  }
  console.log(`\nTotal JSON files found: ${allJsonFiles.length}\n`);

  const stats = { subjects: 0, chapters: 0, subChapters: 0, topics: 0, contentItems: 0, skipped: 0, errors: [] };
  const seenSubjects = new Set();
  const seenChapters = new Set();
  const seenSubChapters = new Set();

  const SKIP_FILES = new Set([
    "syllabus-topics.json",
    "topic-map.json",
    "syllabus.json",
    "topics-map.json",
    "index.json",
  ]);

  // Group files by hierarchy path + target exam group
  const groups = [];

  for (const { file, sourceDir } of allJsonFiles) {
    const rel = relative(sourceDir, file);
    const basename_file = basename(file);
    if (SKIP_FILES.has(basename_file)) {
      console.warn(`  SKIP (meta file): ${rel}`);
      stats.skipped++;
      continue;
    }
    const parts = rel.split(/[\\/]/);
    const isImportData = sourceDir.startsWith(IMPORT_DATA_CONTENT_DIR);

    // Normalize duplicated class folders (e.g. class-12/class-12/physics/...).
    while (parts.length >= 2 && parts[0] === parts[1] && CLASS_TO_EXAM_GROUP[parts[0]]) {
      parts.splice(1, 1);
    }

    let subjectSlug, chapterSlug, typeSlug, fileName, targetExamGroup;
    let placementUsed = false;

    if (isImportData) {
      // import-data/content structure: subject/unit/[type/]file.json
      if (parts.length >= 3) {
        const rawSubject = parts[0];
        const placement = SUBJECT_PLACEMENTS[rawSubject];
        placementUsed = Boolean(placement?.subject);
        subjectSlug = placement?.subject ?? rawSubject;
        chapterSlug = parts[1];
        typeSlug = parts.length >= 4 ? parts[2] : "concepts";
        fileName = parts[parts.length - 1];
        targetExamGroup =
          TARGET_EXAM_GROUP ??
          placement?.examGroup ??
          IMPORT_SUBJECT_TO_EXAM_GROUP[rawSubject] ??
          rawSubject;
      } else {
        console.warn(`  SKIP (unexpected depth): ${rel}`);
        stats.skipped++;
        continue;
      }
    } else {
      // class-based structure: class/subject/unit/type/file.json
      if (parts.length < 5) {
        console.warn(`  SKIP (unexpected depth): ${rel}`);
        stats.skipped++;
        continue;
      }
      const classSlug = parts[0];
      if (!SOURCE_CLASSES.includes(classSlug)) {
        console.warn(`  SKIP (unknown class): ${rel}`);
        stats.skipped++;
        continue;
      }
      targetExamGroup = TARGET_EXAM_GROUP ?? CLASS_TO_EXAM_GROUP[classSlug] ?? classSlug;
      subjectSlug = parts[1];
      chapterSlug = parts[2];
      typeSlug = parts[3];
      fileName = parts[parts.length - 1];
    }

    if (!placementUsed) {
      const mappedSubject = SUBJECT_MAP[subjectSlug];
      if (!mappedSubject) {
        console.warn(`  SKIP (unknown subject): ${rel}`);
        stats.skipped++;
        continue;
      }
      subjectSlug = mappedSubject;
    }

    groups.push({ file, fileName, rel, sourceDir, isImportData, subjectSlug, chapterSlug, typeSlug, targetExamGroup });
  }

  // Cache for exam groups and subjects
  const examGroupCache = new Map();
  const subjectCache = new Map();
  const chapterCache = new Map();
  const subChapterCache = new Map();
  const topicCache = new Map();

  // Helper: get exam group ID by slug (cached)
  async function getExamGroupIdCached(slug) {
    if (examGroupCache.has(slug)) return examGroupCache.get(slug);
    const id = await getExamGroupId(slug);
    examGroupCache.set(slug, id);
    return id;
  }

  // Helper: get subject ID by exam group + slug (cached)
  async function getSubjectIdCached(examGroupId, subjectSlug) {
    const cacheKey = `${examGroupId}/${subjectSlug}`;
    if (subjectCache.has(cacheKey)) return subjectCache.get(cacheKey);
    const id = await getSubjectId(examGroupId, subjectSlug);
    if (id) subjectCache.set(cacheKey, id);
    return id;
  }

  for (const { file, fileName, rel, subjectSlug, chapterSlug, typeSlug, targetExamGroup } of groups) {
    try {
      const egId = await getExamGroupIdCached(targetExamGroup);
      if (!egId) {
        console.warn(`  SKIP (exam group not found: ${targetExamGroup})`);
        stats.skipped++;
        continue;
      }

      let subjectId = await getSubjectIdCached(egId, subjectSlug);
      if (!subjectId) {
        // Create subject if it doesn't exist
        const subjectName = subjectSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        subjectId = await upsert("subjects", { exam_group_id: egId, slug: subjectSlug, name: subjectName, description: `${subjectName} for ${targetExamGroup}.`, sort_order: 0 }, "exam_group_id,slug");
        subjectCache.set(`${egId}/${subjectSlug}`, subjectId);
        console.log(`  [Created Subject] ${subjectName} in ${targetExamGroup}`);
      }

      if (!seenSubjects.has(`${targetExamGroup}/${subjectSlug}`)) {
        seenSubjects.add(`${targetExamGroup}/${subjectSlug}`);
        stats.subjects++;
        console.log(`\n[Subject] ${subjectSlug} in ${targetExamGroup}`);
      }

      const chapterKey = `${subjectId}/${chapterSlug}`;
      let chapterId = chapterCache.get(chapterKey);
      if (!chapterId) {
        chapterId = await getChapterIdBySubject(subjectId, chapterSlug);
        if (chapterId) {
          chapterCache.set(chapterKey, chapterId);
        } else {
          // Create chapter if it doesn't exist
          const chapterName = chapterNameFromSlug(chapterSlug);
          chapterId = await upsert("chapters", { subject_id: subjectId, slug: chapterSlug, name: chapterName, description: `${chapterName} — ${subjectSlug}.`, sort_order: 0 }, "subject_id,slug");
          chapterCache.set(chapterKey, chapterId);
          console.log(`  [Created Chapter] ${chapterName}`);
        }
        if (!seenChapters.has(chapterKey)) { seenChapters.add(chapterKey); stats.chapters++; }
      }

      const subChapterKey = `${chapterId}/${typeSlug}`;
      let subChapterId = subChapterCache.get(subChapterKey);
      let typeLabel = TYPE_LABELS[typeSlug] ?? typeNameFromSlug(typeSlug);
      if (!subChapterId) {
        subChapterId = await getSubChapterId(chapterId, typeSlug);
        if (subChapterId) {
          subChapterCache.set(subChapterKey, subChapterId);
        } else {
          subChapterId = await upsert("sub_chapters", { chapter_id: chapterId, slug: typeSlug, name: typeLabel, description: `${typeLabel}.`, sort_order: 0 }, "chapter_id,slug");
          subChapterCache.set(subChapterKey, subChapterId);
          console.log(`    [Created Sub-Chapter] ${typeLabel}`);
        }
      }
      if (!seenSubChapters.has(subChapterKey)) { seenSubChapters.add(subChapterKey); stats.subChapters++; }

      const raw = JSON.parse(readFileSync(file, "utf8"));
      const title = raw.title ?? basename(fileName, ".json");
      const topicSlug = slugify(basename(fileName, ".json"));
      const topicName = title.length > 80 ? title.slice(0, 80) + "…" : title;

      const topicKey = `${subChapterId}/${topicSlug}`;
      let topicId = topicCache.get(topicKey);
      if (!topicId) {
        topicId = await getTopicId(subChapterId, topicSlug) || await upsert("topics", { sub_chapter_id: subChapterId, slug: topicSlug, name: topicName, description: null, sort_order: 0 }, "sub_chapter_id,slug");
        topicCache.set(topicKey, topicId);
      }

      // Build payload and teaser
      let payload, teaser, notes;
      if (raw.notes && Array.isArray(raw.notes)) {
        // Standard format: title + notes
        notes = raw.notes;
        payload = notesToHtml(title, notes);
        teaser = buildTeaser(title, notes);
      } else if (raw.summary || raw.keyPoints || raw.examples || raw.formulas || raw.practice) {
        // Rich format from import-data/content
        notes = raw.summary || raw.keyPoints || raw.examples || raw.notes || [];
        if (Array.isArray(notes)) {
          payload = notesToHtml(title, notes);
          teaser = buildTeaser(title, notes);
        } else {
          payload = richFormatToHtml(raw);
          teaser = buildTeaser(title, [title]);
        }
      } else {
        // Fallback: treat any array field as notes
        const arrFields = ["notes", "content", "body", "text"];
        notes = arrFields.find((f) => Array.isArray(raw[f])) ? raw[arrFields.find((f) => Array.isArray(raw[f]))] : [];
        payload = notesToHtml(title, notes);
        teaser = buildTeaser(title, notes);
      }

      const variants = [];
      if (raw.latex) variants.push({ label: "LaTeX", interface: "latex", content: `<h3>${title} — LaTeX</h3>${notes.map((n) => `<p>${n}</p>`).join("")}` });
      if (raw.year || raw.examSource) variants.push({ label: "Exam Info", interface: "exam", content: `<h3>${title} — Exam Info</h3><p>Year: ${raw.year ?? "N/A"}<br/>Source: ${raw.examSource ?? "N/A"}</p>` });
      if (raw.graph) variants.push({ label: "Graph", interface: "graph", content: `<h3>${title} — Graph</h3><pre>${JSON.stringify(raw.graph, null, 2)}</pre>` });

      await upsert("content_items", { topic_id: topicId, title, access_level: 4, owner_contact: "ravikisan1814@gmail.com", public_teaser: teaser, locked_payload: payload, variants }, "topic_id,title");

      stats.topics++;
      stats.contentItems++;
      console.log(`      [Topic] ${topicName}`);
    } catch (err) {
      stats.errors.push(`${rel}: ${err.message}`);
      console.error(`      ERROR ${rel}: ${err.message}`);
    }
  }

  console.log(`\n=== Migration Summary ===`);
  console.log(`Subjects:      ${stats.subjects}`);
  console.log(`Chapters:      ${stats.chapters}`);
  console.log(`Sub-chapters:  ${stats.subChapters}`);
  console.log(`Topics:        ${stats.topics}`);
  console.log(`Content items: ${stats.contentItems}`);
  console.log(`Skipped:       ${stats.skipped}`);
  if (stats.errors.length > 0) {
    console.log(`\nErrors (${stats.errors.length}):`);
    for (const e of stats.errors) console.log(`  - ${e}`);
  }
  console.log(`\nMigration complete!`);
}

main().catch((err) => { console.error("\nFATAL:", err); process.exit(1); });
