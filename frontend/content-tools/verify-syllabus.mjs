import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const envPath = join(process.cwd(), ".env.local");
const env = { ...process.env };
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const i = line.indexOf("=");
    const k = line.slice(0, i).trim();
    const v = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    if (!(k in env) || !env[k]) env[k] = v;
  }
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const { data: eg, error: egErr } = await supabase.from("exam_groups").select("id, slug, name").eq("slug", "class-11").single();
  console.log("Exam group:", JSON.stringify(eg), "error:", egErr);
  if (!eg) return;

  const { data: subs, error: subErr } = await supabase.from("subjects").select("id, slug, name").eq("exam_group_id", eg.id);
  console.log("Subjects:", JSON.stringify(subs), "error:", subErr);

  for (const sub of (subs ?? [])) {
    const { data: chs } = await supabase.from("chapters").select("id, slug, name").eq("subject_id", sub.id);
    console.log(`  ${sub.slug}: ${chs?.length ?? 0} chapters`);
    if (chs?.[0]) {
      const { data: scs } = await supabase.from("sub_chapters").select("id, slug, name").eq("chapter_id", chs[0].id);
      console.log(`    first chapter has ${scs?.length ?? 0} sub-chapters`);
      if (scs?.[0]) {
        const { data: tops } = await supabase.from("topics").select("id, slug, name").eq("sub_chapter_id", scs[0].id);
        console.log(`    first sub-chapter has ${tops?.length ?? 0} topics`);
      }
    }
  }

  // Overall counts
  const [{ data: chCount }, { data: topicCount }, { data: ciCount }] = await Promise.all([
    supabase.from("chapters").select("*", { count: "exact", head: true }).eq("subject_id", subs?.[0]?.id),
    supabase.from("topics").select("*", { count: "exact", head: true }),
    supabase.from("content_items").select("*", { count: "exact", head: true }),
  ]);
  console.log(`\nTotal chapters (for first subject): ${chCount}`);
  console.log(`Total topics in DB: ${topicCount}`);
  console.log(`Total content_items in DB: ${ciCount}`);
}

main().catch(console.error);
