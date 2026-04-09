import type { Article } from "@/lib/types";

export const mockArticles: Article[] = [
  {
    id: "bmw-m2-cs",
    title: "BMW teases a sharper M2 CS aimed at enthusiasts who still want a proper rear-drive coupe",
    summary:
      "The story combines launch detail, tuning speculation, and heritage cues in a format that matters to brand followers instead of casual readers.",
    source: "Top Gear",
    sourceUrl: "https://www.topgear.com/",
    publishedAgo: "12 min ago",
    tags: ["BMW", "Sports Cars", "Europe"],
    regions: ["Europe", "Global"],
    trustScore: 0.9,
    freshnessScore: 0.95,
    sourceStyle: "Magazine-led",
    clusterCount: 4,
    heroGradient: "linear-gradient(135deg, #4d555e 0%, #24282d 42%, #121416 100%)",
  },
  {
    id: "porsche-911-heritage",
    title: "Porsche confirms another heritage-flavored 911 run as collectors chase analog feel",
    summary:
      "A clean example of a premium launch story that overlaps old-school design, collector demand, and sports-car fandom.",
    source: "Road & Track",
    sourceUrl: "https://www.roadandtrack.com/",
    publishedAgo: "38 min ago",
    tags: ["Porsche", "Oldtimers", "Sports Cars"],
    regions: ["Europe", "USA"],
    trustScore: 0.93,
    freshnessScore: 0.88,
    sourceStyle: "Magazine-led",
    clusterCount: 3,
    heroGradient: "linear-gradient(135deg, #83644c 0%, #2a241f 46%, #111315 100%)",
  },
  {
    id: "group-a-restomod",
    title: "A new Group A-inspired restomod proves old touring-car energy still sells",
    summary:
      "This story is less mainstream but highly relevant for users who follow oldtimers, homologation icons, and analog driving culture.",
    source: "Speedhunters",
    sourceUrl: "https://www.speedhunters.com/",
    publishedAgo: "55 min ago",
    tags: ["Oldtimers", "Restomods", "Europe"],
    regions: ["Europe", "Global"],
    trustScore: 0.87,
    freshnessScore: 0.81,
    sourceStyle: "Enthusiast-led",
    clusterCount: 2,
    heroGradient: "linear-gradient(135deg, #5c3c2f 0%, #241c1b 44%, #121315 100%)",
  },
  {
    id: "wec-weekend-briefing",
    title: "WEC weekend briefing: factory teams reshuffle strategy after qualifying surprise",
    summary:
      "A motorsport-heavy card for users who follow endurance racing and want a quicker top-line update before diving into long coverage.",
    source: "Motorsport.com",
    sourceUrl: "https://www.motorsport.com/",
    publishedAgo: "1 h ago",
    tags: ["Motorsport", "WEC", "Factory Teams"],
    regions: ["Europe", "Global"],
    trustScore: 0.91,
    freshnessScore: 0.84,
    sourceStyle: "Magazine-led",
    clusterCount: 5,
    heroGradient: "linear-gradient(135deg, #36404a 0%, #1f242a 45%, #101214 100%)",
  },
  {
    id: "jdm-coupe-revival",
    title: "Japanese tuners keep the compact coupe alive with a new wave of lightweight builds",
    summary:
      "A feature-style story that helps the feed feel enthusiast-first instead of acting like a press-release reader.",
    source: "The Drive",
    sourceUrl: "https://www.thedrive.com/",
    publishedAgo: "2 h ago",
    tags: ["JDM", "Sports Cars", "Japan"],
    regions: ["Japan", "Global"],
    trustScore: 0.82,
    freshnessScore: 0.76,
    sourceStyle: "Magazine-led",
    clusterCount: 1,
    heroGradient: "linear-gradient(135deg, #28485f 0%, #19252d 42%, #0f1215 100%)",
  },
  {
    id: "bmw-e30-auction",
    title: "Clean E30 M3 values climb again as collectors shift back toward usable classics",
    summary:
      "A strong crossover between BMW loyalty, oldtimers, and the collectible side of the market.",
    source: "Hagerty",
    sourceUrl: "https://www.hagerty.com/media/",
    publishedAgo: "3 h ago",
    tags: ["BMW", "Oldtimers", "Auctions"],
    regions: ["Europe", "USA"],
    trustScore: 0.94,
    freshnessScore: 0.73,
    sourceStyle: "Magazine-led",
    clusterCount: 2,
    heroGradient: "linear-gradient(135deg, #67604f 0%, #25211b 42%, #111315 100%)",
  },
];

export const mockSavedStories = [
  {
    id: "saved-bmw-m2",
    title: "BMW engineers hint that future M cars will stay emotionally loud even as regulations tighten",
    source: "Autocar",
    publishedAgo: "Yesterday",
  },
  {
    id: "saved-lancia",
    title: "Why the Lancia Delta Integrale still shapes modern rally nostalgia",
    source: "Hagerty",
    publishedAgo: "2 days ago",
  },
];

export const topicCollections = [
  "BMW M cars",
  "90s homologation cars",
  "Endurance racing",
  "Analog sports coupes",
];

export const preferredSources = [
  "Top Gear",
  "Road & Track",
  "Hagerty",
  "Motorsport.com",
  "Speedhunters",
];
