import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { createAdminClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

const OWNER_EMAIL = "ravikisan1814@gmail.com";

export async function POST(request: NextRequest) {
  let body: { email?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return NextResponse.json(
      { error: error?.message ?? "Sign-in failed" },
      { status: 401 }
    );
  }

  const isOwner = email === OWNER_EMAIL;

  // Auto-approve owner: use service_role client to bypass RLS on profiles table
  // (the anon client can't update profiles until the user is already approved — circular dependency)
  let profile = null;
  if (isOwner) {
    const admin = createAdminClient();
    const { data: existingProfile } = await admin
      .from("profiles")
      .select("id")
      .eq("id", data.user.id)
      .maybeSingle();

    if (existingProfile) {
      await admin
        .from("profiles")
        .update({ access_level: 1, status: "approved", role: "owner" })
        .eq("id", data.user.id);
    } else {
      await admin.from("profiles").insert({
        id: data.user.id,
        email: data.user.email ?? "",
        access_level: 1,
        status: "approved",
        role: "owner",
      });
    }
    // Re-fetch with admin client to get the updated profile
    const { data: freshProfile } = await admin
      .from("profiles")
      .select("id, email, role, access_level, status")
      .eq("id", data.user.id)
      .maybeSingle();
    profile = freshProfile;
  } else {
    // Non-owner: read profile with anon client (RLS allows own-profile select)
    const { data: p } = await supabase
      .from("profiles")
      .select("id, email, role, access_level, status")
      .eq("id", data.user.id)
      .maybeSingle();
    profile = p;
  }

  return NextResponse.json({
    data: {
      user: { id: data.user.id, email: data.user.email },
      profile,
    },
  });
}