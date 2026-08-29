/**
 * Migration script: seeds NEB Grade 11 syllabus structure for Physics, Chemistry, Biology.
 *
 * Each unit from the syllabus becomes a chapter under its subject.
 * Each topic within a unit becomes a topic node (sub-chapter is omitted for flat structure).
 * Content items are created with access_level=4 (public) and a placeholder teaser.
 *
 * Usage:
 *   node scripts/migrate-syllabus.mjs
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

// ── Syllabus data ──────────────────────────────────────────────────────────

const SYLLABUS = {
  physics: {
    name: "Physics",
    slug: "physics",
    units: [
      { num: 1, name: "Physical Quantities", hours: 3 },
      { num: 2, name: "Vectors", hours: 4 },
      { num: 3, name: "Kinematics", hours: 5 },
      { num: 4, name: "Dynamics", hours: 6 },
      { num: 5, name: "Work, Energy and Power", hours: 6 },
      { num: 6, name: "Circular Motion", hours: 6 },
      { num: 7, name: "Gravitation", hours: 10 },
      { num: 8, name: "Elasticity", hours: 5 },
      { num: 9, name: "Heat and Temperature", hours: 3 },
      { num: 10, name: "Thermal Expansion", hours: 4 },
      { num: 11, name: "Quantity of Heat", hours: 6 },
      { num: 12, name: "Rate of Heat Flow", hours: 5 },
      { num: 13, name: "Ideal Gas", hours: 8 },
      { num: 14, name: "Reflection at Curved Mirror", hours: 2 },
      { num: 15, name: "Refraction at Plane Surfaces", hours: 4 },
      { num: 16, name: "Refraction through Prisms", hours: 4 },
      { num: 17, name: "Lenses", hours: 3 },
      { num: 18, name: "Dispersion", hours: 3 },
      { num: 19, name: "Electric Charges", hours: 3 },
      { num: 20, name: "Electric Field", hours: 3 },
      { num: 21, name: "Potential, Potential Difference and Potential Energy", hours: 4 },
      { num: 22, name: "Capacitor", hours: 5 },
      { num: 23, name: "DC Circuits", hours: 10 },
      { num: 24, name: "Nuclear Physics", hours: 4 },
      { num: 25, name: "Solids", hours: 3 },
      { num: 26, name: "Recent Trends in Physics", hours: 6 },
    ],
  },
  chemistry: {
    name: "Chemistry",
    slug: "chemistry",
    units: [
      { num: 1, name: "Foundation and Fundamentals", hours: 2 },
      { num: 2, name: "Stoichiometry", hours: 8 },
      { num: 3, name: "Atomic Structure", hours: 8 },
      { num: 4, name: "Classification of Elements and Periodic Table", hours: 5 },
      { num: 5, name: "Chemical Bonding and Shapes of Molecules", hours: 9 },
      { num: 6, name: "Oxidation and Reduction", hours: 5 },
      { num: 7, name: "States of Matter", hours: 8 },
      { num: 8, name: "Chemical Equilibrium", hours: 3 },
      { num: 9, name: "Chemistry of Non-Metals", hours: 27 },
      { num: 10, name: "Chemistry of Metals", hours: 15 },
      { num: 11, name: "Bio-inorganic Chemistry", hours: 3 },
      { num: 12, name: "Basic Concept of Organic Chemistry", hours: 6 },
      { num: 13, name: "Fundamental Principles of Organic Chemistry", hours: 10 },
      { num: 14, name: "Hydrocarbons", hours: 8 },
      { num: 15, name: "Aromatic Hydrocarbons", hours: 6 },
      { num: 16, name: "Fundamentals of Applied Chemistry", hours: 4 },
      { num: 17, name: "Modern Chemical Manufactures", hours: 11 },
    ],
  },
  biology: {
    name: "Biology",
    slug: "biology",
    units: [
      { num: 1, name: "Biomolecules and Cell Biology", hours: 15 },
      { num: 2, name: "Floral Diversity", hours: 30 },
      { num: 3, name: "Introductory Microbiology", hours: 5 },
      { num: 4, name: "Ecology", hours: 11 },
      { num: 5, name: "Vegetation", hours: 3 },
      { num: 6, name: "Introduction to Biology", hours: 2 },
      { num: 7, name: "Evolutionary Biology", hours: 15 },
      { num: 8, name: "Faunal Diversity", hours: 34 },
      { num: 9, name: "Biota and Environment", hours: 10 },
      { num: 10, name: "Conservation Biology", hours: 3 },
    ],
  },
};

const EXAM_GROUP_SLUG = "class-11";

// ── Helpers ────────────────────────────────────────────────────────────────

async function upsertExamGroup(slug, name, description, sortOrder) {
  const { data: existing } = await supabase
    .from("exam_groups")
    .select("id")
    .eq("slug", slug)
    .single();

  if (existing) return existing.id;

  const { data, error } = await supabase
    .from("exam_groups")
    .insert({ id: crypto.randomUUID(), slug, name, description, sort_order: sortOrder })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

async function upsertSubject(examGroupId, slug, name, description, sortOrder) {
  const { data: existing } = await supabase
    .from("subjects")
    .select("id")
    .eq("exam_group_id", examGroupId)
    .eq("slug", slug)
    .single();

  if (existing) return existing.id;

  const { data, error } = await supabase
    .from("subjects")
    .insert({ id: crypto.randomUUID(), exam_group_id: examGroupId, slug, name, description, sort_order: sortOrder })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

async function upsertChapter(subjectId, slug, name, description, sortOrder) {
  const { data: existing } = await supabase
    .from("chapters")
    .select("id")
    .eq("subject_id", subjectId)
    .eq("slug", slug)
    .single();

  if (existing) return existing.id;

  const { data, error } = await supabase
    .from("chapters")
    .insert({ id: crypto.randomUUID(), subject_id: subjectId, slug, name, description, sort_order: sortOrder })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

async function upsertSubChapter(chapterId, slug, name, description, sortOrder) {
  const { data: existing } = await supabase
    .from("sub_chapters")
    .select("id")
    .eq("chapter_id", chapterId)
    .eq("slug", slug)
    .single();

  if (existing) return existing.id;

  const { data, error } = await supabase
    .from("sub_chapters")
    .insert({ id: crypto.randomUUID(), chapter_id: chapterId, slug, name, description, sort_order: sortOrder })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

async function upsertTopic(subChapterId, slug, name, description, sortOrder) {
  const { data: existing } = await supabase
    .from("topics")
    .select("id")
    .eq("sub_chapter_id", subChapterId)
    .eq("slug", slug)
    .single();

  if (existing) return existing.id;

  const { data, error } = await supabase
    .from("topics")
    .insert({ id: crypto.randomUUID(), sub_chapter_id: subChapterId, slug, name, description, sort_order: sortOrder })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

async function upsertContentItem(topicId, title, accessLevel, ownerContact, publicTeaser, lockedPayload) {
  const { data: existing } = await supabase
    .from("content_items")
    .select("id")
    .eq("topic_id", topicId)
    .eq("title", title)
    .single();

  if (existing) return existing.id;

  const { data, error } = await supabase
    .from("content_items")
    .insert({
      id: crypto.randomUUID(),
      topic_id: topicId,
      title,
      access_level: accessLevel,
      owner_contact: ownerContact,
      public_teaser: publicTeaser,
      locked_payload: lockedPayload ?? "",
      variants: [],
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("Seeding NEB Grade 11 syllabus...\n");

  // 1. Ensure exam group exists
  const egId = await upsertExamGroup(
    EXAM_GROUP_SLUG,
    "Class 11",
    "NEB Class 11 science stream — Physics, Chemistry, Biology syllabus (2076)",
    1,
  );
  console.log(`Exam group "${EXAM_GROUP_SLUG}" ready (id: ${egId})`);

  // 2. Seed each subject
  const stats = { subjects: 0, chapters: 0, subChapters: 0, topics: 0, contentItems: 0 };

  for (const [key, subjectData] of Object.entries(SYLLABUS)) {
    console.log(`\n── ${subjectData.name} ──`);

    const subId = await upsertSubject(egId, subjectData.slug, subjectData.name,
      `NEB Grade 11 ${subjectData.name} — ${subjectData.units.length} units, ${subjectData.units.reduce((s, u) => s + u.hours, 0)} teaching hours`,
      Object.keys(SYLLABUS).indexOf(key) + 1,
    );
    stats.subjects++;
    console.log(`  Subject "${subjectData.name}" ready`);

    for (const unit of subjectData.units) {
      const chSlug = `${subjectData.slug}-unit-${String(unit.num).padStart(2, "0")}`;
      const chId = await upsertChapter(subId, chSlug, `Unit ${unit.num}: ${unit.name}`,
        `Teaching hours: ${unit.hours}`,
        unit.num,
      );
      stats.chapters++;

      // Sub-chapter: the unit content area (flat)
      const scSlug = `${chSlug}-content`;
      const scId = await upsertSubChapter(chId, scSlug, unit.name, "", 1);
      stats.subChapters++;

      // Topic: the unit itself as a topic (placeholder content)
      const topSlug = `${chSlug}-topic`;
      const topId = await upsertTopic(scId, topSlug, unit.name, "", 1);
      stats.topics++;

      // Content item: placeholder teaser
      const teaser = `<p>Unit ${unit.num}: ${unit.name} — ${unit.hours} teaching hours. Content under development.</p>`;
      await upsertContentItem(topId, `Unit ${unit.num} — ${unit.name}`, 4, OWNER_CONTACT, teaser, "");
      stats.contentItems++;
    }

    console.log(`  ${subjectData.units.length} units seeded`);
  }

  console.log(`\n✅ Done.`);
  console.log(`  Subjects:    ${stats.subjects}`);
  console.log(`  Chapters:    ${stats.chapters}`);
  console.log(`  Sub-chapters: ${stats.subChapters}`);
  console.log(`  Topics:      ${stats.topics}`);
  console.log(`  Content items: ${stats.contentItems}`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
