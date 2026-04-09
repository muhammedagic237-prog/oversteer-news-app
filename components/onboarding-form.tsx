"use client";

import { useMemo, useState } from "react";

const interestOptions = [
  "Sports Cars",
  "Oldtimers",
  "BMW",
  "Porsche",
  "JDM",
  "Hot Hatches",
  "F1",
  "Rally",
  "Restomods",
  "V8s",
];

const regionOptions = ["Europe", "Japan", "USA", "Global"];
const sourceStyles = ["Magazine-led", "Enthusiast-led", "Balanced"];

export function OnboardingForm() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Sports Cars",
    "BMW",
    "Oldtimers",
  ]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["Europe", "Japan"]);
  const [sourceStyle, setSourceStyle] = useState("Balanced");

  const previewReason = useMemo(() => {
    const joinedInterests = selectedInterests.slice(0, 3).join(", ");
    const joinedRegions = selectedRegions.join(" and ");

    return `The first feed will prioritize ${joinedInterests || "your chosen interests"} from ${joinedRegions || "global"} sources with a ${sourceStyle.toLowerCase()} mix.`;
  }, [selectedInterests, selectedRegions, sourceStyle]);

  function toggleValue(value: string, current: string[], update: (next: string[]) => void) {
    update(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  return (
    <section className="onboarding-panel" aria-label="Interest selection">
      <div className="form-section">
        <p className="eyebrow">Step 1</p>
        <h3>Pick what belongs in your lane</h3>
        <div className="chip-row">
          {interestOptions.map((option) => (
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
        <h3>Choose regions</h3>
        <div className="chip-row">
          {regionOptions.map((option) => (
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
        <p className="eyebrow">Step 3</p>
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
