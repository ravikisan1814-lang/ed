import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { createAdminClient } from "@/lib/supabase-admin";
import type { AccessLevel } from "@/lib/types";

export const dynamic = "force-dynamic";

const VALID_STATUS = ["pending", "approved", "rejected"] as const;
type UserStatus = (typeof VALID_STATUS)[number];

interface AdminUser {
  id: string;
  email: string | null;
  role: string;
  access_level: number;
  status: string;
  created_at: string;
}

/**
 * Owner-only helpers. Uses the service_role admin client to bypass RLS on
 * profiles — this avoids the circular dependency where current_access_level()
 * can't read profiles until the user is already approved.
 */
async function requireOwner(): Promise<
  { supabase: Awaited<ReturnType<typeof createClient>>; admin: Awaited<ReturnType<typeof createAdminClient>>; user: { id: string } } | NextResponse
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("access_level, status")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.access_level !== 1 || profile.status !== "approved") {
    return NextResponse.json({ error: "Owner only" }, { status: 403 });
  }
  return { supabase, admin, user };
}

export async function GET() {
  const ctx = await requireOwner();
  if (ctx instanceof NextResponse) return ctx;

  const { data, error } = await ctx.admin
    .from("profiles")
    .select("id, email, role, access_level, status, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: (data as AdminUser[] | null) ?? [] });
}

export async function PATCH(request: NextRequest) {
  const ctx = await requireOwner();
  if (ctx instanceof NextResponse) return ctx;

  let body: { id?: string; access_level?: unknown; status?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.id || typeof body.id !== "string") {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  }

  const patch: { access_level?: number; status?: string } = {};
  if (body.access_level !== undefined) {
    const level = Number(body.access_level);
    if (!Number.isInteger(level) || level < 1 || level > 4) {
      return NextResponse.json({ error: "access_level must be 1-4" }, { status: 400 });
    }
    patch.access_level = level;
  }
  if (body.status !== undefined) {
    if (!VALID_STATUS.includes(body.status as UserStatus)) {
      return NextResponse.json({ error: "status must be pending/approved/rejected" }, { status: 400 });
    }
    patch.status = body.status as string;
  }
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const { data, error } = await ctx.admin
    .from("profiles")
    .update(patch)
    .eq("id", body.id)
    .select("id, email, role, access_level, status, created_at")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ data });
}

export type { AdminUser, UserStatus };