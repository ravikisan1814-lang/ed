import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase";
import ContentIngest from "@/components/ContentIngest";
import BackButton from "@/components/BackButton";
import Link from "next/link";
import IngestShell from "@/components/page-shells/IngestShell";

export const metadata = {
  title: "Ingest Notes — Admin",
  description: "Paste and auto-classify educational notes into the syllabus hierarchy.",
};

export default async function IngestPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
      <IngestShell>
        <div className="admin-denied">
          <BackButton href="/" />
          <h1>Access denied</h1>
          <p>This page is for the site owner only.</p>
          <Link className="btn btn-primary" href="/">
            Back to home
          </Link>
        </div>
      </IngestShell>
    );
  }

  return (
    <IngestShell>
      <BackButton href="/admin" />
      <ContentIngest />
    </IngestShell>
  );
}
