import { AppNav } from "@/components/app-nav";
import { rankingModes } from "@/lib/app-shell";

const mutedTopics = ["SUV gossip", "EV startup rumors"];

export default function SettingsPage() {
  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">Control center</p>
          <h1>Settings</h1>
        </div>
      </header>

      <section className="grid-panels">
        <article className="panel">
          <p className="eyebrow">Feed tuning</p>
          <div className="setting-row">
            <span>Freshness vs depth</span>
            <strong>Balanced</strong>
          </div>
          <div className="setting-row">
            <span>Mainstream vs enthusiast sources</span>
            <strong>Enthusiast first</strong>
          </div>
          <div className="setting-row">
            <span>Duplicate stories</span>
            <strong>Clustered</strong>
          </div>
          <div className="chip-grid" style={{ marginTop: 12 }}>
            {rankingModes.map((mode) => (
              <span key={mode} className="pill muted">
                {mode}
              </span>
            ))}
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Notifications</p>
          <div className="setting-row">
            <span>Breaking launches</span>
            <strong>On</strong>
          </div>
          <div className="setting-row">
            <span>Race weekend digest</span>
            <strong>On</strong>
          </div>
          <div className="setting-row">
            <span>Daily summary</span>
            <strong>8:00</strong>
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Muted topics</p>
          <div className="chip-grid">
            {mutedTopics.map((topic) => (
              <span key={topic} className="pill muted">
                {topic}
              </span>
            ))}
          </div>
        </article>
      </section>

      <AppNav current="settings" />
    </main>
  );
}
