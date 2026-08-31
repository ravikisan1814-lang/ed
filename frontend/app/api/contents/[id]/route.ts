import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { canAccessContent, validateAccessLevel } from "@/lib/access";
import type { AccessLevel } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("educational_content")
    .select(
      "id, category_id, title, description, file_url, access_level, owner_contact, created_at, updated_at, categories(slug, name)"
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json(
      { error: "Not found or insufficient access level" },
      { status: 404 }
    );
  }

  const row = data as unknown as {
    id: string;
    category_id: string;
    title: string;
    description: string | null;
    file_url: string | null;
    access_level: number;
    owner_contact: string | null;
    created_at: string;
    updated_at: string;
    categories: { slug: string; name: string } | null;
  };

  const requiredAccessLevel: AccessLevel = validateAccessLevel(row.access_level)
    ? row.access_level
    : 4;

  const { data: { user } } = await supabase.auth.getUser();

  let userAccessLevel: AccessLevel | null = null;
  let approved = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("access_level, status")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.access_level) {
      userAccessLevel = profile.access_level as AccessLevel;
      approved = profile.status === "approved";
    }
  }

  if (!canAccessContent(userAccessLevel, requiredAccessLevel, approved)) {
    return NextResponse.json(
      { error: "Forbidden — insufficient access level" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    data: {
      id: row.id,
      category_id: row.category_id,
      category_slug: row.categories?.slug ?? null,
      category_name: row.categories?.name ?? null,
      title: row.title,
      description: row.description,
      file_url: row.file_url,
      required_access_level: requiredAccessLevel,
      owner_contact: row.owner_contact,
      created_at: row.created_at,
      updated_at: row.updated_at,
    },
  });
}
