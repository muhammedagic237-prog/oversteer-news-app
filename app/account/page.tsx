import Link from "next/link";

import { signout } from "@/app/login/actions";
import { AppNav } from "@/components/app-nav";
import { createSupabaseServerClient } from "@/lib/supabase-auth";
import { hasPublicSupabaseConfig, hasServiceSupabaseConfig } from "@/lib/supabase-config";
import { loadUserAppState, loadViewer } from "@/lib/supabase";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;
  const authReady = hasPublicSupabaseConfig();

  if (!authReady) {
    return (
      <main className="auth-page">
        <section className="auth-hero">
          <div className="auth-copy">
            <p className="eyebrow">Driver account</p>
            <h1>Supabase auth is not configured yet.</h1>
            <p className="hero-copy">
              Add your Supabase public keys to unlock sign-in, synced preferences, and multi-device
              Garage state.
            </p>
            <Link href="/" className="primary-button">
              Return to Oversteer
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (!user || !user.email) {
    return (
      <main className="auth-page">
        <section className="auth-hero">
          <div className="auth-copy">
            <p className="eyebrow">Driver account</p>
            <h1>Sign in to make Oversteer yours.</h1>
            <p className="hero-copy">
              Save stories, keep your lane preferences, and recover your feed across devices.
            </p>
            <div className="button-row">
              <Link href="/login" className="primary-button">
                Go to login
              </Link>
              <Link href="/" className="secondary-button">
                Stay local-only
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const viewer =
    (await loadViewer(user.id)) ?? {
      id: user.id,
      email: user.email,
      displayName: (user.user_metadata?.display_name as string | undefined) ?? user.email.split("@")[0],
      avatarUrl: (user.user_metadata?.avatar_url as string | undefined) ?? null,
    };
  const syncedState = hasServiceSupabaseConfig() ? await loadUserAppState(user.id) : null;

  return (
    <main className="auth-page">
      <section className="account-hero">
        <div className="account-lead">
          <p className="eyebrow">Driver account</p>
          <h1>{viewer.displayName ?? viewer.email}</h1>
          <p className="hero-copy">
            {message ?? "Your Oversteer account is ready. This is the control point for synced preferences and saved stories."}
          </p>
          <div className="auth-feature-list">
            <span>{viewer.email}</span>
            <span>{hasServiceSupabaseConfig() ? "Account sync connected" : "Auth ready, sync keys missing"}</span>
          </div>
        </div>

        <div className="auth-panel">
          <p className="eyebrow">State summary</p>
          <div className="account-metrics">
            <div>
              <strong>{syncedState?.savedStoryIds.length ?? 0}</strong>
              <span>Saved stories</span>
            </div>
            <div>
              <strong>{syncedState?.profile.followedTopics.length ?? 0}</strong>
              <span>Followed topics</span>
            </div>
            <div>
              <strong>{syncedState?.profile.watchlistModels.length ?? 0}</strong>
              <span>Watchlist cars</span>
            </div>
          </div>
          <div className="button-row">
            <Link href="/settings" className="primary-button">
              Open settings
            </Link>
            <Link href="/garage" className="secondary-button">
              Open Garage
            </Link>
          </div>
          <form action={signout}>
            <button type="submit" className="ghost-link ghost-button">
              Sign out
            </button>
          </form>
        </div>
      </section>
      <AppNav current="account" />
    </main>
  );
}
