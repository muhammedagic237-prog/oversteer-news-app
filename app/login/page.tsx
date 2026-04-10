import Link from "next/link";

import { login, signup } from "@/app/login/actions";
import { hasPublicSupabaseConfig } from "@/lib/supabase-config";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;
  const authReady = hasPublicSupabaseConfig();

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <div className="auth-copy">
          <p className="eyebrow">Driver account</p>
          <h1>Sign in to sync your lane, saves, hides, and watchlists across devices.</h1>
          <p className="hero-copy">
            Oversteer stays useful without an account, but signing in turns the app into a proper
            personal briefing room.
          </p>
          <div className="auth-feature-list">
            <span>Sync preferences to Supabase</span>
            <span>Keep your Garage across devices</span>
            <span>Restore your lane after new installs</span>
          </div>
        </div>

        <div className="auth-panel">
          <p className="eyebrow">Account access</p>
          {!authReady ? (
            <div className="auth-message error">
              Supabase auth is not configured yet. Add the public keys in your environment before
              using account features.
            </div>
          ) : null}
          {message ? <div className="auth-message">{message}</div> : null}
          {error ? <div className="auth-message error">{error}</div> : null}

          <form className="auth-form">
            <label className="auth-field">
              <span>Email</span>
              <input type="email" name="email" placeholder="you@garage.club" required />
            </label>
            <label className="auth-field">
              <span>Password</span>
              <input type="password" name="password" placeholder="Minimum 6 characters" required />
            </label>
            <input type="hidden" name="redirectTo" value="/account" />
            <div className="button-row">
              <button className="primary-button" formAction={login} disabled={!authReady}>
                Sign in
              </button>
              <button className="secondary-button" formAction={signup} disabled={!authReady}>
                Create account
              </button>
            </div>
          </form>

          <Link href="/" className="ghost-link">
            Continue without an account
          </Link>
        </div>
      </section>
    </main>
  );
}
