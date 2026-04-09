"use client";

import { useMemo, useState } from "react";

import {
  eraTopics,
  interestTopics,
  motorsportTopics,
  regionTopics,
  sourceStyles,
} from "@/lib/taxonomy";

export function OnboardingForm() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Sports Cars",
    "BMW",
    "Oldtimers",
  ]);
  const [selectedEras, setSelectedEras] = useState<string[]>(["90s", "Heritage"]);
  const [selectedMotorsport, setSelectedMotorsport] = useState<string[]>(["WEC"]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["Europe", "Japan"]);
  const [sourceStyle, setSourceStyle] = useState("Balanced");

  const previewReason = useMemo(() => {
    const joinedInterests = selectedInterests.slice(0, 3).join(", ");
    const joinedEras = selectedEras.slice(0, 2).join(" and ");
    const joinedMotorsport = selectedMotorsport.join(", ");
    const joinedRegions = selectedRegions.join(" and ");

    return `The first feed will prioritize ${joinedInterests || "your chosen interests"}, lean into ${joinedEras || "your favorite eras"}, and blend ${joinedMotorsport || "selected motorsport"} coverage from ${joinedRegions || "global"} sources with a ${sourceStyle.toLowerCase()} mix.`;
  }, [selectedEras, selectedInterests, selectedMotorsport, selectedRegions, sourceStyle]);

  function toggleValue(value: string, current: string[], update: (next: string[]) => void) {
    update(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
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
              onClick={() =>
                toggleValue(option, selectedInterests, setSelectedInterests)
              }
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
              onClick={() =>
                toggleValue(option, selectedMotorsport, setSelectedMotorsport)
              }
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
        <h3>Choose source style</h3>
        <div className="chip-row">
          {sourceStyles.map((option) => (
            <button
              key={option}
              type="button"
              className={`chip-button ${sourceStyle === option ? "active" : ""}`}
              onClick={() => setSourceStyle(option)}
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
        <button type="button" className="primary-button">
          Build my feed
        </button>
        <button type="button" className="secondary-button">
          Skip for now
        </button>
      </div>
    </section>
  );
}
