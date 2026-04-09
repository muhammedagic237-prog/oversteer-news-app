"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useOversteer } from "@/components/oversteer-provider";
import {
  eraTopics,
  interestTopics,
  motorsportTopics,
  regionTopics,
  sourceStyles,
  watchlistModels,
} from "@/lib/taxonomy";

export function OnboardingForm() {
  const router = useRouter();
  const { state, hydrated, completeOnboarding } = useOversteer();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedEras, setSelectedEras] = useState<string[]>([]);
  const [selectedMotorsport, setSelectedMotorsport] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedWatchlist, setSelectedWatchlist] = useState<string[]>([]);
  const [selectedSourceStyle, setSelectedSourceStyle] = useState<(typeof sourceStyles)[number]>(
    "Balanced",
  );

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    setSelectedInterests(state.profile.interests);
    setSelectedEras(state.profile.eras);
    setSelectedMotorsport(state.profile.motorsport);
    setSelectedRegions(state.profile.regions);
    setSelectedWatchlist(state.profile.watchlistModels);
    setSelectedSourceStyle(state.profile.sourceStyle);
  }, [hydrated, state.profile]);

  const previewReason = useMemo(() => {
    const joinedInterests = selectedInterests.slice(0, 3).join(", ");
    const joinedEras = selectedEras.slice(0, 2).join(" and ");
    const joinedMotorsport = selectedMotorsport.join(", ");
    const joinedRegions = selectedRegions.join(" and ");

    return `Your lane will prioritize ${joinedInterests || "your chosen interests"}, lean into ${joinedEras || "your favorite eras"}, and blend ${joinedMotorsport || "selected motorsport"} coverage from ${joinedRegions || "global"} sources with a ${selectedSourceStyle.toLowerCase()} mix.`;
  }, [selectedEras, selectedInterests, selectedMotorsport, selectedRegions, selectedSourceStyle]);

  function toggleValue(value: string, current: string[], update: (next: string[]) => void) {
    update(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  function handleComplete() {
    completeOnboarding({
      ...state.profile,
      interests: selectedInterests,
      eras: selectedEras,
      motorsport: selectedMotorsport,
      regions: selectedRegions,
      watchlistModels: selectedWatchlist,
      sourceStyle: selectedSourceStyle,
      followedTopics: Array.from(
        new Set([...selectedInterests, ...selectedMotorsport, ...state.profile.followedTopics]),
      ),
    });

    router.push("/");
  }

  if (!hydrated) {
    return null;
  }

  return (
    <section className="onboarding-panel" aria-label="Interest selection">
      <div className="form-section">
        <p className="eyebrow">Step 1</p>
        <h3>Pick what belongs in your lane</h3>
        <div className="chip-row">
          {interestTopics.map((option) => (
            <button
              key={option}
              type="button"
              className={`chip-button ${selectedInterests.includes(option) ? "active" : ""}`}
              onClick={() => toggleValue(option, selectedInterests, setSelectedInterests)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="form-section">
        <p className="eyebrow">Step 2</p>
        <h3>Choose the eras you care about</h3>
        <div className="chip-row">
          {eraTopics.map((option) => (
            <button
              key={option}
              type="button"
              className={`chip-button ${selectedEras.includes(option) ? "active" : ""}`}
              onClick={() => toggleValue(option, selectedEras, setSelectedEras)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="form-section">
        <p className="eyebrow">Step 3</p>
        <h3>Dial in your motorsport mix</h3>
        <div className="chip-row">
          {motorsportTopics.map((option) => (
            <button
              key={option}
              type="button"
              className={`chip-button ${selectedMotorsport.includes(option) ? "active" : ""}`}
              onClick={() => toggleValue(option, selectedMotorsport, setSelectedMotorsport)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="form-section">
        <p className="eyebrow">Step 4</p>
        <h3>Choose regions</h3>
        <div className="chip-row">
          {regionTopics.map((option) => (
            <button
              key={option}
              type="button"
              className={`chip-button ${selectedRegions.includes(option) ? "active" : ""}`}
              onClick={() => toggleValue(option, selectedRegions, setSelectedRegions)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="form-section">
        <p className="eyebrow">Step 5</p>
        <h3>Start a watchlist</h3>
        <div className="chip-row">
          {watchlistModels.map((option) => (
            <button
              key={option}
              type="button"
              className={`chip-button ${selectedWatchlist.includes(option) ? "active" : ""}`}
              onClick={() => toggleValue(option, selectedWatchlist, setSelectedWatchlist)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="form-section">
        <p className="eyebrow">Step 6</p>
        <h3>Choose source style</h3>
        <div className="chip-row">
          {sourceStyles.map((option) => (
            <button
              key={option}
              type="button"
              className={`chip-button ${selectedSourceStyle === option ? "active" : ""}`}
              onClick={() => setSelectedSourceStyle(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="preview-panel">
        <p className="eyebrow">Feed preview</p>
        <h4>BMW teases lighter M2 CS with heritage-inspired tuning details</h4>
        <p className="onboarding-copy">{previewReason}</p>
      </div>

      <div className="button-row">
        <button type="button" className="primary-button" onClick={handleComplete}>
          Build my feed
        </button>
        <button type="button" className="secondary-button" onClick={() => router.push("/")}>
          Skip for now
        </button>
      </div>
    </section>
  );
}
