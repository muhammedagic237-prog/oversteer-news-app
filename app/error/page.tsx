import Link from "next/link";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <div className="auth-copy">
          <p className="eyebrow">Auth error</p>
          <h1>We could not complete that sign-in step.</h1>
          <p className="hero-copy">
            {error ?? "Try the login flow again. If the problem continues, verify your Supabase redirect URL and public auth keys."}
          </p>
          <div className="button-row">
            <Link href="/login" className="primary-button">
              Back to login
            </Link>
            <Link href="/" className="secondary-button">
              Return home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
