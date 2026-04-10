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
          <p className="eyebrow">First-run tuning</p>
          <h2>
            Set the lane once on first launch, then come back here only when you want to retune
            the feed.
          </h2>
          <p>
            Pick brands, eras, motorsport interests, and watchlist models so Oversteer can lead
            with the right stories and keep the main feed feeling like a car-only app, not a
            generic news stream.
          </p>
        </div>

        <OnboardingForm />
      </section>
    </main>
  );
}
