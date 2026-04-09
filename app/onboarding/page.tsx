import { OnboardingForm } from "@/components/onboarding-form";

export default function OnboardingPage() {
  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">First run</p>
          <h1>Tune your lane</h1>
        </div>
      </header>

      <section className="stacked-layout">
        <div className="info-panel">
          <p className="eyebrow">Why this matters</p>
          <h2>
            The onboarding flow should build a useful feed in under a minute and explain
            why stories appear.
          </h2>
          <p>
            Users should pick their favorite brands, eras, and motorsport topics once and
            immediately feel that the feed understands them.
          </p>
        </div>

        <OnboardingForm />
      </section>
    </main>
  );
}
