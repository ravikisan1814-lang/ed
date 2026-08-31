/**
 * Post-migration verification — prints table counts and a per-exam-group
 * breakdown. Reads NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 * from .env.local (same pattern as the other migration scripts).
 *
 * Usage:
 *   node scripts/verify-migration.mjs
 *   npm run verify:migration
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env.local");

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
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function count(table) {
  const { count, error } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true });
  if (error) return `ERROR ${error.message}`;
  return count;
}

async function main() {
  console.log(`Supabase: ${env.NEXT_PUBLIC_SUPABASE_URL}\n`);

  const tables = [
    "exam_groups",
    "subjects",
    "chapters",
    "sub_chapters",
    "topics",
    "content_items",
    "categories",
    "educational_content",
    "profiles",
  ];
  console.log("=== Row counts ===");
  for (const t of tables) {
    const n = await count(t);
    console.log(`  ${t.padEnd(20)} ${n}`);
  }

  console.log("\n=== Content status ===");
  const { data: payloads, error: payloadErr } = await supabase
    .from("content_items")
    .select("locked_payload, variants");
  if (payloadErr) {
    console.log(`  content_items read: ERROR ${payloadErr.message}`);
  } else {
    const withPayload = payloads.filter(
      (p) => typeof p.locked_payload === "string" && p.locked_payload.trim() !== "" && p.locked_payload !== "{}" && p.locked_payload !== "null"
    ).length;
    const withVariants = payloads.filter(
      (p) => Array.isArray(p.variants) && p.variants.length > 0
    ).length;
    console.log(`  total content_items:            ${payloads.length}`);
    console.log(`  with real payload:             ${withPayload}`);
    console.log(`  with variants:                 ${withVariants}`);
  }

  console.log("\n=== Exam group breakdown ===");
  const { data: groups } = await supabase.from("exam_groups").select("id, slug, name").order("sort_order");
  const { data: allSubjects } = await supabase.from("subjects").select("exam_group_id");
  const byGroup = new Map();
  for (const s of allSubjects ?? []) {
    byGroup.set(s.exam_group_id, (byGroup.get(s.exam_group_id) ?? 0) + 1);
  }
  for (const g of groups ?? []) {
    console.log(`  ${g.slug.padEnd(16)} ${String(byGroup.get(g.id) ?? 0).padStart(6)} subject(s)`);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});