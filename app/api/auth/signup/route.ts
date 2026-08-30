import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

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
    const patch: { access_level: number; status: string; role: string } = {
      access_level: isOwner ? 1 : 4,
      status: isOwner ? "approved" : "pending",
      role: isOwner ? "owner" : "member",
    };
    await supabase
      .from("profiles")
      .update(patch)
      .eq("id", data.user.id);
  }

  return NextResponse.json({
    data: {
      user: data.user ? { id: data.user.id, email: data.user.email } : null,
      pendingApproval: !isOwner,
      isOwner,
    },
  });
}