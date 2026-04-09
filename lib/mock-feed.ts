import type { Article, FeedCatalog, StoryCluster } from "@/lib/types";

export const sourceCatalog = [
  "Top Gear",
  "Road & Track",
  "Hagerty",
  "Motorsport.com",
  "Speedhunters",
  "The Drive",
  "Autocar",
  "Car and Driver",
] as const;

export const storyClusters: StoryCluster[] = [
  {
    id: "bmw-m2-cs-cluster",
    title: "BMW M2 CS launch coverage",
    description:
      "Trusted launch coverage, analysis, and enthusiast reaction around BMW's next harder-edge coupe.",
    topic: "BMW",
    leadStoryId: "bmw-m2-cs",
    storyIds: ["bmw-m2-cs", "bmw-m2-cs-track", "bmw-m2-cs-analysis"],
    timeline: [
      "Official teaser drops with lighter bodywork and track-focused setup.",
      "Magazine previews emphasize retained rear-drive balance and shorter gearing.",
      "Enthusiast outlets compare it to M2 Competition and older compact M icons.",
    ],
  },
  {
    id: "heritage-911-cluster",
    title: "Heritage-era 911 wave",
    description:
      "Collector-focused coverage around Porsche heritage editions, analog demand, and auction pressure.",
    topic: "Porsche",
    leadStoryId: "porsche-911-heritage",
    storyIds: ["porsche-911-heritage", "porsche-collector-note", "gt3-touring-watch"],
    timeline: [
      "Porsche confirms another heritage-flavored special run.",
      "Collector coverage ties demand to analog interior details and limited production.",
      "Watchlists heat up for GT3 Touring and 997-era halo cars.",
    ],
  },
  {
    id: "wec-cluster",
    title: "WEC weekend briefing",
    description:
      "Factory strategy, paddock fallout, and overnight reactions before the race settles into rhythm.",
    topic: "WEC",
    leadStoryId: "wec-weekend-briefing",
    storyIds: ["wec-weekend-briefing", "wec-pit-wall", "wec-garage-56"],
    timeline: [
      "Qualifying upset shuffles the expected running order.",
      "Pit strategy stories emerge around tire wear and late safety-car odds.",
      "Factory team reaction and Garage 56 comparisons dominate fan discussion.",
    ],
  },
  {
    id: "classic-market-cluster",
    title: "Classic market pulse",
    description:
      "Auction and collector stories focused on usable classics, homologation nostalgia, and price movement.",
    topic: "Oldtimers",
    leadStoryId: "bmw-e30-auction",
    storyIds: ["bmw-e30-auction", "group-a-restomod", "delta-integrale-feature"],
    timeline: [
      "Clean E30 M3 prices step upward again in Europe and the US.",
      "Group A-flavored builds push interest back toward period-correct icons.",
      "Delta Integrale coverage reinforces the rally-homologation collector cycle.",
    ],
  },
];

export const mockArticles: Article[] = [
  {
    id: "bmw-m2-cs",
    title: "BMW teases a sharper M2 CS aimed at enthusiasts who still want a proper rear-drive coupe",
    summary:
      "Launch coverage with meaningful tuning detail, direct enthusiast relevance, and enough source trust to lead the day.",
    deck:
      "This is the kind of story the app should surface immediately for users who follow compact performance cars and BMW.",
    source: "Top Gear",
    sourceUrl: "https://www.topgear.com/",
    publishedAgo: "12 min ago",
    publishedAt: "2026-04-09T19:12:00.000Z",
    tags: ["BMW", "Sports Cars", "Modern", "Europe"],
    regions: ["Europe", "Global"],
    sourceStyle: "Magazine-led",
    trustScore: 0.92,
    freshnessScore: 0.97,
    clusterId: "bmw-m2-cs-cluster",
    eventType: "Launch",
    heroGradient: "linear-gradient(135deg, #4d555e 0%, #24282d 42%, #121416 100%)",
  },
  {
    id: "bmw-m2-cs-track",
    title: "Early circuit notes suggest the M2 CS has been tuned to feel lighter than the numbers imply",
    summary:
      "Magazine testing angles focus on balance, front-end bite, and how the new setup compares to the M2 Competition.",
    deck:
      "A strong second card inside the cluster because it adds perspective instead of repeating the same headline.",
    source: "Car and Driver",
    sourceUrl: "https://www.caranddriver.com/",
    publishedAgo: "27 min ago",
    publishedAt: "2026-04-09T18:57:00.000Z",
    tags: ["BMW", "Sports Cars", "Track", "Modern"],
    regions: ["USA", "Global"],
    sourceStyle: "Magazine-led",
    trustScore: 0.89,
    freshnessScore: 0.92,
    clusterId: "bmw-m2-cs-cluster",
    eventType: "Feature",
    heroGradient: "linear-gradient(135deg, #5d666f 0%, #20242a 46%, #121416 100%)",
  },
  {
    id: "bmw-m2-cs-analysis",
    title: "Why the M2 CS matters more than another spec bump for BMW loyalists chasing analog energy",
    summary:
      "Enthusiast analysis ties the new car back to the compact M lineage and why loyalists still care deeply about this segment.",
    deck:
      "This adds context and culture, which helps Oversteer feel like a real enthusiast briefing rather than a press-release reader.",
    source: "The Drive",
    sourceUrl: "https://www.thedrive.com/",
    publishedAgo: "46 min ago",
    publishedAt: "2026-04-09T18:38:00.000Z",
    tags: ["BMW", "Sports Cars", "Feature", "Modern"],
    regions: ["Global"],
    sourceStyle: "Enthusiast-led",
    trustScore: 0.82,
    freshnessScore: 0.88,
    clusterId: "bmw-m2-cs-cluster",
    eventType: "Feature",
    heroGradient: "linear-gradient(135deg, #39424a 0%, #171b20 44%, #101214 100%)",
  },
  {
    id: "porsche-911-heritage",
    title: "Porsche confirms another heritage-flavored 911 run as collectors chase analog feel",
    summary:
      "A premium launch and collector crossover that lines up perfectly with oldtimer-adjacent Porsche followers.",
    deck:
      "This is the exact kind of story that wins retention with enthusiasts who want elegant, high-trust curation.",
    source: "Road & Track",
    sourceUrl: "https://www.roadandtrack.com/",
    publishedAgo: "38 min ago",
    publishedAt: "2026-04-09T18:46:00.000Z",
    tags: ["Porsche", "Oldtimers", "Sports Cars", "Heritage"],
    regions: ["Europe", "USA"],
    sourceStyle: "Magazine-led",
    trustScore: 0.93,
    freshnessScore: 0.9,
    clusterId: "heritage-911-cluster",
    eventType: "Launch",
    heroGradient: "linear-gradient(135deg, #83644c 0%, #2a241f 46%, #111315 100%)",
  },
  {
    id: "porsche-collector-note",
    title: "Collectors are treating new heritage 911s as bridges to air-cooled nostalgia rather than simple special editions",
    summary:
      "Market analysis and collector sentiment deepen the Porsche story instead of just echoing the launch copy.",
    deck:
      "A good cluster companion because it adds a financial and collector angle without turning the app into market spam.",
    source: "Hagerty",
    sourceUrl: "https://www.hagerty.com/media/",
    publishedAgo: "1 h ago",
    publishedAt: "2026-04-09T18:21:00.000Z",
    tags: ["Porsche", "Oldtimers", "Auctions", "Heritage"],
    regions: ["Europe", "USA"],
    sourceStyle: "Magazine-led",
    trustScore: 0.95,
    freshnessScore: 0.81,
    clusterId: "heritage-911-cluster",
    eventType: "Auction",
    heroGradient: "linear-gradient(135deg, #78614f 0%, #2b231d 42%, #111315 100%)",
  },
  {
    id: "gt3-touring-watch",
    title: "GT3 Touring demand stays stubbornly strong as buyers chase discreet halo cars with usable road manners",
    summary:
      "A watchlist-style feature that would matter to users following premium driver-focused models rather than broad luxury content.",
    deck:
      "This is where Oversteer can feel special: nuanced model-level coverage instead of endless generic supercar noise.",
    source: "Autocar",
    sourceUrl: "https://www.autocar.co.uk/",
    publishedAgo: "2 h ago",
    publishedAt: "2026-04-09T17:34:00.000Z",
    tags: ["Porsche", "Sports Cars", "Collector mode", "Europe"],
    regions: ["Europe", "Global"],
    sourceStyle: "Magazine-led",
    trustScore: 0.88,
    freshnessScore: 0.74,
    clusterId: "heritage-911-cluster",
    eventType: "Feature",
    heroGradient: "linear-gradient(135deg, #66615c 0%, #23201f 44%, #111315 100%)",
  },
  {
    id: "wec-weekend-briefing",
    title: "WEC weekend briefing: factory teams reshuffle strategy after qualifying surprise",
    summary:
      "A motorsport headline strong enough for Pole Position because it has urgency, context, and clear fan value.",
    deck:
      "This is a blueprint for race-weekend coverage: fast, trusted, and compact without becoming a live-blog clone.",
    source: "Motorsport.com",
    sourceUrl: "https://www.motorsport.com/",
    publishedAgo: "1 h ago",
    publishedAt: "2026-04-09T18:03:00.000Z",
    tags: ["WEC", "Motorsport", "Factory Teams", "Europe"],
    regions: ["Europe", "Global"],
    sourceStyle: "Magazine-led",
    trustScore: 0.91,
    freshnessScore: 0.86,
    clusterId: "wec-cluster",
    eventType: "Race",
    heroGradient: "linear-gradient(135deg, #36404a 0%, #1f242a 45%, #101214 100%)",
  },
  {
    id: "wec-pit-wall",
    title: "Pit wall tension grows as tire strategy and traffic windows threaten to flip the expected WEC order",
    summary:
      "A strategic follow-up piece that enriches the cluster with real racing texture instead of duplicate headlines.",
    deck:
      "This is where the Pit Wall surface becomes useful: multiple angles around one meaningful motorsport event.",
    source: "Road & Track",
    sourceUrl: "https://www.roadandtrack.com/",
    publishedAgo: "1 h ago",
    publishedAt: "2026-04-09T17:48:00.000Z",
    tags: ["WEC", "Motorsport", "Strategy"],
    regions: ["Europe", "Global"],
    sourceStyle: "Magazine-led",
    trustScore: 0.85,
    freshnessScore: 0.8,
    clusterId: "wec-cluster",
    eventType: "Race",
    heroGradient: "linear-gradient(135deg, #29485e 0%, #18232d 44%, #0f1215 100%)",
  },
  {
    id: "wec-garage-56",
    title: "Garage 56 comparisons are back as fans debate what makes a modern endurance wildcard memorable",
    summary:
      "An enthusiast-led side angle that helps motorsport fans dig deeper without cluttering the main lane.",
    deck:
      "Good for the Deep Cuts mode because it rewards users who want context and culture, not just the result sheet.",
    source: "The Drive",
    sourceUrl: "https://www.thedrive.com/",
    publishedAgo: "3 h ago",
    publishedAt: "2026-04-09T16:22:00.000Z",
    tags: ["WEC", "Motorsport", "Feature", "Garage 56"],
    regions: ["USA", "Global"],
    sourceStyle: "Enthusiast-led",
    trustScore: 0.79,
    freshnessScore: 0.63,
    clusterId: "wec-cluster",
    eventType: "Feature",
    heroGradient: "linear-gradient(135deg, #31556b 0%, #18222a 42%, #101214 100%)",
  },
  {
    id: "bmw-e30-auction",
    title: "Clean E30 M3 values climb again as collectors shift back toward usable classics",
    summary:
      "A high-trust classic-market story that pairs perfectly with oldtimer and BMW followers.",
    deck:
      "These stories deepen the product by making classics and collector culture feel first-class, not secondary.",
    source: "Hagerty",
    sourceUrl: "https://www.hagerty.com/media/",
    publishedAgo: "3 h ago",
    publishedAt: "2026-04-09T16:41:00.000Z",
    tags: ["BMW", "Oldtimers", "Auctions", "90s"],
    regions: ["Europe", "USA"],
    sourceStyle: "Magazine-led",
    trustScore: 0.94,
    freshnessScore: 0.73,
    clusterId: "classic-market-cluster",
    eventType: "Auction",
    heroGradient: "linear-gradient(135deg, #67604f 0%, #25211b 42%, #111315 100%)",
  },
  {
    id: "group-a-restomod",
    title: "A new Group A-inspired restomod proves old touring-car energy still sells",
    summary:
      "An enthusiast feature with strong oldtimer energy and very clear alignment to homologation fans.",
    deck:
      "This is a classic Deep Cuts card: not the broadest story, but highly sticky for the right lane.",
    source: "Speedhunters",
    sourceUrl: "https://www.speedhunters.com/",
    publishedAgo: "55 min ago",
    publishedAt: "2026-04-09T18:29:00.000Z",
    tags: ["Oldtimers", "Restomods", "90s", "Europe"],
    regions: ["Europe", "Global"],
    sourceStyle: "Enthusiast-led",
    trustScore: 0.87,
    freshnessScore: 0.82,
    clusterId: "classic-market-cluster",
    eventType: "Feature",
    heroGradient: "linear-gradient(135deg, #5c3c2f 0%, #241c1b 44%, #121315 100%)",
  },
  {
    id: "delta-integrale-feature",
    title: "The Delta Integrale keeps dragging a new generation into rally-era collector obsession",
    summary:
      "An emotional classic-car feature with strong watchlist potential and good fit for heritage-heavy users.",
    deck:
      "This is exactly the kind of story a watchlist-driven Garage can turn into daily habit-forming behavior.",
    source: "Top Gear",
    sourceUrl: "https://www.topgear.com/",
    publishedAgo: "4 h ago",
    publishedAt: "2026-04-09T15:45:00.000Z",
    tags: ["Oldtimers", "Rally", "Heritage", "Lancia"],
    regions: ["Europe", "Global"],
    sourceStyle: "Magazine-led",
    trustScore: 0.86,
    freshnessScore: 0.61,
    clusterId: "classic-market-cluster",
    eventType: "Feature",
    heroGradient: "linear-gradient(135deg, #6a534d 0%, #29211f 42%, #111315 100%)",
  },
];

export const topicCollections = [
  "BMW compact M cars",
  "90s homologation icons",
  "Endurance racing",
  "Analog sports coupes",
];

export const seedFeedCatalog: FeedCatalog = {
  articles: mockArticles,
  storyClusters,
  sourceCatalog: [...sourceCatalog],
  topicCollections,
  syncedAt: "2026-04-09T19:12:00.000Z",
  mode: "seed",
};

export function getArticleById(id: string, catalog: FeedCatalog = seedFeedCatalog) {
  return catalog.articles.find((entry) => entry.id === id);
}

export function getClusterById(id: string, catalog: FeedCatalog = seedFeedCatalog) {
  return catalog.storyClusters.find((entry) => entry.id === id);
}

export function getStoriesForCluster(
  clusterId: string,
  catalog: FeedCatalog = seedFeedCatalog,
) {
  return catalog.articles.filter((article) => article.clusterId === clusterId);
}
