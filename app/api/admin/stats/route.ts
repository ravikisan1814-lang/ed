import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { createAdminClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

async function requireOwner() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  // Use admin client to bypass RLS when checking owner status.
  // The anon client cannot read profiles until access_level=1 is set,
  // creating a circular dependency right after owner approval.
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("access_level, status")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.access_level !== 1 || profile.status !== "approved") {
    return NextResponse.json({ error: "Owner only" }, { status: 403 });
  }

  return { supabase, admin };
}

export async function GET() {
  const ctx = await requireOwner();
  if (ctx instanceof NextResponse) return ctx;

  // Use admin client for reads — bypasses RLS entirely (owner-only route)
  const [{ count: totalUsers }, { count: pendingUsers }, { count: approvedUsers }, { count: totalContent }] =
    await Promise.all([
      ctx.admin.from("profiles").select("*", { count: "exact", head: true }),
      ctx.admin.from("profiles").select("*", { count: "exact", head: true }).eq("status", "pending"),
      ctx.admin.from("profiles").select("*", { count: "exact", head: true }).eq("status", "approved"),
      ctx.admin.from("content_items").select("*", { count: "exact", head: true }),
    ]);

  return NextResponse.json({
    data: {
      users: {
        total: totalUsers ?? 0,
        pending: pendingUsers ?? 0,
        approved: approvedUsers ?? 0,
      },
      content: {
        total: totalContent ?? 0,
      },
    },
  });
}
