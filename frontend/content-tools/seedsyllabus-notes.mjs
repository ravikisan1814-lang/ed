/**
 * Seeds rich content (formulas, examples, key concepts) into existing syllabus topics.
 * Updates locked_payload for topics that have placeholder content.
 *
 * Usage:
 *   node scripts/seedsyllabus-notes.mjs
 *
 * Requires env vars (set in .env.local or shell):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
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
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const OWNER_CONTACT = "ravikisan1814@gmail.com";

// ── Rich content data per subject/chapter/topic ──────────────────────────────
const SYLLABUS_NOTES = JSON.parse(readFileSync(join(__dirname, "syllabus-notes-data.json"), "utf8"));

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildPayload(topicName, chapterName, subjectName, content) {
  const { key_concepts = [], formulas = [], examples = [] } = content;
  const lines = [];
  if (key_concepts.length) {
    lines.push(`<h3>Key Concepts</h3><ul>`);
    for (const c of key_concepts) lines.push(`<li>${c}</li>`);
    lines.push(`</ul>`);
  }
  if (formulas.length) {
    lines.push(`<h3>Important Formulas</h3><ul>`);
    for (const f of formulas) lines.push(`<li><code>${f}</code></li>`);
    lines.push(`</ul>`);
  }
  if (examples.length) {
    lines.push(`<h3>Worked Examples</h3><ul>`);
    for (const e of examples) lines.push(`<li>${e}</li>`);
    lines.push(`</ul>`);
  }
  lines.push(`<p class="meta">Topic: ${topicName} | Chapter: ${chapterName} | Subject: ${subjectName}</p>`);
  return lines.join("\n");
}

function generateFallbackPayload(topicName, chapterName, subjectName) {
  return `<h3>Overview</h3><p>${topicName} is a topic in ${chapterName} under ${subjectName}.</p>
<h3>Key Concepts</h3><ul><li>Definition and fundamental principles</li><li>Applications in problem-solving</li><li>Connections to other topics</li></ul>
<h3>Important Formulas</h3><ul><li>Standard formulas will be added</li></ul>
<h3>Worked Examples</h3><ul><li>Example problems with step-by-step solutions</li></ul>
<p class="meta">Topic: ${topicName} | Chapter: ${chapterName} | Subject: ${subjectName}</p>`;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Seeding syllabus notes with rich content...\n");

  // 1. Find class-11 exam group
  const { data: eg } = await supabase
    .from("exam_groups")
    .select("id, slug, name")
    .eq("slug", "class-11")
    .single();

  if (!eg) {
    console.error("Exam group 'class-11' not found. Run migrate-syllabus.mjs first.");
    process.exit(1);
  }
  console.log(`Found exam group: ${eg.name} (id: ${eg.id})\n`);

  // 2. Get all subjects
  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, slug, name")
    .eq("exam_group_id", eg.id);

  if (!subjects?.length) {
    console.error("No subjects found for class-11.");
    process.exit(1);
  }
  console.log(`Found ${subjects.length} subjects\n`);

  let updated = 0;
  let skipped = 0;
  const subjectMap = {};
  for (const s of subjects) subjectMap[s.slug] = s;

  // 3. For each subject, get chapters → sub_chapters → topics → content_items
  for (const subject of subjects) {
    const subjectData = SYLLABUS_NOTES[subject.slug];
    console.log(`── ${subject.name} ──`);

    const { data: chapters } = await supabase
      .from("chapters")
      .select("id, slug, name")
      .eq("subject_id", subject.id);

    if (!chapters?.length) continue;

    for (const chapter of chapters) {
      const chapterData = subjectData?.[chapter.slug];

      const { data: subChapters } = await supabase
        .from("sub_chapters")
        .select("id, slug, name")
        .eq("chapter_id", chapter.id);

      if (!subChapters?.length) continue;

      for (const subChapter of subChapters) {
        const subChapterData = chapterData; // flatten: chapter-level content applies to all topics in chapter

        const { data: topics } = await supabase
          .from("topics")
          .select("id, slug, name")
          .eq("sub_chapter_id", subChapter.id);

        if (!topics?.length) continue;

        for (const topic of topics) {
          const topicData = subChapterData?.[topic.slug];
          const payload = topicData
            ? buildPayload(topic.name, chapter.name, subject.name, topicData)
            : generateFallbackPayload(topic.name, chapter.name, subject.name);

          // Find content_items for this topic
          const { data: contentItems } = await supabase
            .from("content_items")
            .select("id, locked_payload")
            .eq("topic_id", topic.id);

          if (!contentItems?.length) continue;

          // Check if payload needs updating (missing rich content or has fallback placeholder)
          const needsUpdate = contentItems.some(
            (ci) => !ci.locked_payload 
              || ci.locked_payload.includes("under development")
              || ci.locked_payload.includes("will be added")
              || (topicData && ci.locked_payload.split("<h3>Key Concepts</h3>").length < 2)
          );

          if (needsUpdate) {
            const { error } = await supabase
              .from("content_items")
              .update({ locked_payload: payload })
              .in("id", contentItems.map((ci) => ci.id));

            if (error) {
              console.error(`  ❌ Error updating ${topic.name}: ${error.message}`);
            } else {
              console.log(`  ✅ ${topic.name} → ${contentItems.length} item(s) updated`);
              updated += contentItems.length;
            }
          } else {
            skipped += contentItems.length;
          }
        }
      }
    }
    console.log();
  }

  console.log("✅ Done.\n");
  console.log(`  Updated: ${updated} content items`);
  console.log(`  Skipped: ${skipped} content items (already have rich content)`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
