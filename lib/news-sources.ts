import type { FeedSourceReport, SourceStyle } from "@/lib/types";

export type TrustedFeedSource = {
  id: string;
  label: string;
  publisherName: string;
  siteUrl: string;
  feedUrl: string;
  sourceStyle: Exclude<SourceStyle, "Balanced">;
  trustScore: number;
  defaultTags: string[];
  defaultRegions: string[];
};

export const trustedFeedSources: TrustedFeedSource[] = [
  {
    id: "motor1-all",
    label: "Motor1 main feed",
    publisherName: "Motor1",
    siteUrl: "https://www.motor1.com/",
    feedUrl: "https://www.motor1.com/rss/news/all/",
    sourceStyle: "Magazine-led",
    trustScore: 0.87,
    defaultTags: ["Sports Cars", "Modern"],
    defaultRegions: ["Global", "USA", "Europe"],
  },
  {
    id: "motor1-classics",
    label: "Motor1 classics",
    publisherName: "Motor1",
    siteUrl: "https://www.motor1.com/",
    feedUrl: "https://www.motor1.com/rss/news/classics/",
    sourceStyle: "Magazine-led",
    trustScore: 0.89,
    defaultTags: ["Oldtimers", "Heritage"],
    defaultRegions: ["Global", "Europe", "USA"],
  },
  {
    id: "motor1-supercars",
    label: "Motor1 supercars",
    publisherName: "Motor1",
    siteUrl: "https://www.motor1.com/",
    feedUrl: "https://www.motor1.com/rss/news/supercars/",
    sourceStyle: "Magazine-led",
    trustScore: 0.88,
    defaultTags: ["Sports Cars", "Supercars", "Modern"],
    defaultRegions: ["Global", "Europe", "USA"],
  },
  {
    id: "carscoops-main",
    label: "Carscoops latest",
    publisherName: "Carscoops",
    siteUrl: "https://www.carscoops.com/",
    feedUrl: "https://www.carscoops.com/feed/",
    sourceStyle: "Enthusiast-led",
    trustScore: 0.8,
    defaultTags: ["Modern"],
    defaultRegions: ["Global", "USA"],
  },
  {
    id: "motorsport-f1",
    label: "Motorsport.com Formula 1",
    publisherName: "Motorsport.com",
    siteUrl: "https://www.motorsport.com/f1/",
    feedUrl: "https://www.motorsport.com/rss/f1/news/",
    sourceStyle: "Magazine-led",
    trustScore: 0.92,
    defaultTags: ["F1", "Motorsport"],
    defaultRegions: ["Global", "Europe"],
  },
  {
    id: "motorsport-wec",
    label: "Motorsport.com WEC",
    publisherName: "Motorsport.com",
    siteUrl: "https://www.motorsport.com/wec/",
    feedUrl: "https://www.motorsport.com/rss/wec/news/",
    sourceStyle: "Magazine-led",
    trustScore: 0.93,
    defaultTags: ["WEC", "Motorsport"],
    defaultRegions: ["Global", "Europe"],
  },
  {
    id: "motorsport-rally",
    label: "Motorsport.com Rally",
    publisherName: "Motorsport.com",
    siteUrl: "https://www.motorsport.com/rally/",
    feedUrl: "https://www.motorsport.com/rss/rally/news/",
    sourceStyle: "Magazine-led",
    trustScore: 0.91,
    defaultTags: ["Rally", "Motorsport"],
    defaultRegions: ["Global", "Europe"],
  },
];

export const feedSourceCatalog = Array.from(
  new Set(trustedFeedSources.map((source) => source.publisherName)),
);

export const feedFallbackTopics = [
  "Sports Cars",
  "Oldtimers",
  "BMW",
  "Porsche",
  "JDM",
  "F1",
  "WEC",
  "Rally",
];

export function createOfflineReport(error: string): FeedSourceReport {
  const fetchedAt = new Date().toISOString();

  return {
    id: "seed-fallback",
    name: "Seed catalog",
    ok: false,
    articleCount: 0,
    error,
    fetchedAt,
  };
}
