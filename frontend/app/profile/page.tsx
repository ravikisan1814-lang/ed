import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import LayoutShell from "@/app/LayoutShell";
import ProfileShell from "@/components/page-shells/ProfileShell";
import { ACCESS_LEVEL_LABELS } from "@/lib/types";
import BackButton from "@/components/BackButton";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("access_level, status, email, created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    return (
      <ProfileShell>
        <div className="profile-page">
          <BackButton href="/" />
          <h1>Profile</h1>
          <p className="profile-error">Could not load your profile. Please sign in again.</p>
          <Link href="/login" className="btn btn-primary">
            Sign in again
          </Link>
        </div>
      </ProfileShell>
    );
  }

  const isOwner = profile.access_level === 1 && profile.status === "approved";
  const tierLabel = ACCESS_LEVEL_LABELS[profile.access_level as 1 | 2 | 3 | 4] ?? "Unknown";
  const statusLabel =
    profile.status === "approved"
      ? "Approved"
      : profile.status === "pending"
      ? "Pending approval"
      : "Rejected";
  const statusClass =
    profile.status === "approved"
      ? "status-approved"
      : profile.status === "pending"
      ? "status-pending"
      : "status-rejected";

  return (
    <ProfileShell>
      <main className="profile-content">
        <div className="profile-page">
          <BackButton href="/" />
          <div className="profile-header">
            <div className="profile-avatar">{(profile.email?.[0] ?? "?").toUpperCase()}</div>
            <div className="profile-info">
              <h1>Your Account</h1>
              <p className="profile-email">{profile.email}</p>
            </div>
            {isOwner && (
              <Link href="/admin" className="btn btn-primary">
                Go to Admin Dashboard
              </Link>
            )}
          </div>

          <div className="profile-cards">
            <div className="profile-card">
              <div className="profile-card-label">Access Tier</div>
              <div className="profile-card-value">
                <span className={`tier-badge tier-${profile.access_level}`}>
                  {tierLabel} (Level {profile.access_level})
                </span>
              </div>
            </div>

            <div className="profile-card">
              <div className="profile-card-label">Account Status</div>
              <div className="profile-card-value">
                <span className={`status-badge ${statusClass}`}>{statusLabel}</span>
              </div>
            </div>

            <div className="profile-card">
              <div className="profile-card-label">Member Since</div>
              <div className="profile-card-value">{new Date(profile.created_at).toLocaleDateString()}</div>
            </div>
          </div>

          {profile.status === "pending" && (
            <div className="profile-notice">
              <p>
                Your account is pending approval. You can browse public content now.
                Contact the owner at{" "}
                <a href="mailto:ravikisan1814@gmail.com">ravikisan1814@gmail.com</a> for access.
              </p>
            </div>
          )}

          {profile.status === "rejected" && (
            <div className="profile-notice profile-notice-danger">
              <p>Your account has been rejected. Contact the owner for more information.</p>
            </div>
          )}

          <div className="profile-actions">
            <Link href="/learn" className="btn btn-secondary">
              Browse Content
            </Link>
            <Link href="/info" className="btn btn-secondary">
              Rules &amp; Notices
            </Link>
          </div>
        </div>
      </main>
    </ProfileShell>
  );
}
