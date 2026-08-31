import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import AdminPanel from "./AdminPanel";
import BackButton from "@/components/BackButton";
import AdminShell from "@/components/page-shells/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("access_level, status")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.access_level !== 1 || profile.status !== "approved") {
    return (
      <AdminShell>
        <div className="admin-denied">
          <h1>Access denied</h1>
          <p>This page is for the site owner only.</p>
          <Link className="btn btn-primary" href="/">
            Back to home
          </Link>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <BackButton href="/" />
      <AdminPanel />
    </AdminShell>
  );
}
