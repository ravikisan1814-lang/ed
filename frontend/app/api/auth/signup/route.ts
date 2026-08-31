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
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const isOwner = email === OWNER_EMAIL;

  if (data.user) {
    // Use service_role client to bypass RLS — a non-approved user's own
    // client cannot write to the profiles table (circular dependency).
    const admin = createAdminClient();
    const patch: { access_level: number; status: string; role: string } = {
      access_level: isOwner ? 1 : 4,
      status: isOwner ? "approved" : "pending",
      role: isOwner ? "owner" : "member",
    };
    await admin.from("profiles").upsert(
      { id: data.user.id, email: data.user.email ?? "", ...patch },
      { onConflict: "id" }
    );
  }

  return NextResponse.json({
    data: {
      user: data.user ? { id: data.user.id, email: data.user.email } : null,
      pendingApproval: !isOwner,
      isOwner,
    },
  });
}