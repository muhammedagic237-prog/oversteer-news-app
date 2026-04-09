"use client";

import Link from "next/link";

import { AppNav } from "@/components/app-nav";
import { useOversteer } from "@/components/oversteer-provider";
import { getClusterById } from "@/lib/mock-feed";
import { getClusterStories } from "@/lib/personalization";

export function PitWallScreen({ clusterId }: { clusterId: string }) {
  const { state, hydrated, catalog, markStoryOpened, followTopic } = useOversteer();
  const cluster = getClusterById(clusterId, catalog);

  if (!cluster) {
    return (
      <main className="page">
        <section className="panel">
          <p className="eyebrow">Missing cluster</p>
          <h1>This Pit Wall cluster does not exist.</h1>
        </section>
      </main>
    );
  }

  const stories = hydrated ? getClusterStories(cluster.id, state, catalog) : [];
  const leadStory = stories[0];

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">Full coverage</p>
          <h1>{cluster.title}</h1>
        </div>
      </header>

      <section className="hero-panel">
        <div>
          <p className="eyebrow">Lead angle</p>
          <h2>{leadStory?.title ?? cluster.description}</h2>
        </div>
        <div className="hero-actions">
          <p className="hero-copy">{cluster.description}</p>
          <div className="button-row">
            <button type="button" className="primary-button" onClick={() => followTopic(cluster.topic)}>
              Follow {cluster.topic}
            </button>
            {leadStory ? (
              <Link href={`/story/${leadStory.id}`} className="secondary-button" onClick={() => markStoryOpened(leadStory.id)}>
                Open lead story
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid-panels">
        <article className="panel">
          <p className="eyebrow">Coverage timeline</p>
          <ul className="timeline-list">
            {cluster.timeline.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <p className="eyebrow">All angles</p>
          <ul className="stack-list">
            {stories.map((story) => (
              <li key={story.id} className="list-card align-start">
                <div>
                  <strong>{story.title}</strong>
                  <p>{story.source}</p>
                </div>
                <Link href={`/story/${story.id}`} className="secondary-button" onClick={() => markStoryOpened(story.id)}>
                  Open
                </Link>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <AppNav current="feed" />
    </main>
  );
}
