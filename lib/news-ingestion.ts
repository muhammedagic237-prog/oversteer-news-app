import { parseFeedXml } from "@/lib/rss";
import { seedFeedCatalog } from "@/lib/mock-feed";
import {
  createOfflineReport,
  feedFallbackTopics,
  feedSourceCatalog,
  trustedFeedSources,
  type TrustedFeedSource,
} from "@/lib/news-sources";
import { loadFeedPayload, saveFeedPayload } from "@/lib/supabase";
import type {
  Article,
  FeedCatalog,
  FeedPayload,
  FeedSourceReport,
  StoryCluster,
  StoryEventType,
} from "@/lib/types";

const HERO_GRADIENTS = [
  "linear-gradient(135deg, #5f6d7d 0%, #1d232b 42%, #0c1014 100%)",
  "linear-gradient(135deg, #8a6548 0%, #2b211a 42%, #101215 100%)",
  "linear-gradient(135deg, #495d6f 0%, #1c262f 42%, #0d1114 100%)",
  "linear-gradient(135deg, #5d4a43 0%, #231b18 42%, #0f1114 100%)",
  "linear-gradient(135deg, #5f616b 0%, #22242a 42%, #101214 100%)",
];

const FEED_REVALIDATE_SECONDS = Number(process.env.OVERSTEER_FEED_REVALIDATE_SECONDS ?? 900);
const MAX_ITEMS_PER_SOURCE = 10;
const MAX_ARTICLES = 28;
const MIN_QUALITY_SCORE = 0.58;
const AUXILIARY_TAGS = new Set([
  "Modern",
  "Heritage",
  "Feature",
  "Track",
  "Strategy",
  "Global",
  "Europe",
  "USA",
  "Japan",
  "2000s",
  "90s",
  "80s",
  "70s",
  "Motorsport",
]);
const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "into",
  "from",
  "that",
  "this",
  "after",
  "amid",
  "over",
  "under",
  "still",
  "just",
  "will",
  "have",
  "has",
  "new",
  "its",
  "their",
  "your",
  "why",
  "how",
  "what",
  "more",
  "than",
  "when",
]);
const NOISE_TOKENS = new Set([
  "news",
  "review",
  "feature",
  "first",
  "drive",
  "drives",
  "latest",
  "explained",
  "video",
  "photos",
  "gallery",
  "watch",
  "details",
  "preview",
  "briefing",
]);
const LOW_SIGNAL_PATTERNS = [
  /top\s+\d+/i,
  /best .* to buy/i,
  /rendered by/i,
  /photo gallery/i,
  /spy photographer/i,
  /opinion:/i,
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}

function normalizeTitle(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeTitle(value: string) {
  return normalizeTitle(value)
    .split(" ")
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function normalizePublishedAt(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.valueOf())) {
    return new Date().toISOString();
  }

  return parsed.toISOString();
}

function formatPublishedAgo(value: string) {
  const publishedAt = new Date(value);
  const minutes = Math.max(1, Math.round((Date.now() - publishedAt.valueOf()) / 60000));

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.round(minutes / 60);

  if (hours < 24) {
    return `${hours} h ago`;
  }

  const days = Math.round(hours / 24);

  return `${days} d ago`;
}

function computeFreshnessScore(value: string) {
  const ageHours = Math.max(0, (Date.now() - new Date(value).valueOf()) / 3600000);

  return Number(clamp(1 - ageHours / 120, 0.2, 0.99).toFixed(2));
}

function trimSentence(value: string, maxLength: number) {
  const compact = value.replace(/\s+/g, " ").trim();

  if (compact.length <= maxLength) {
    return compact;
  }

  return `${compact.slice(0, maxLength - 3).trimEnd()}...`;
}

function deriveSummary(summary: string, title: string) {
  if (!summary) {
    return trimSentence(title, 150);
  }

  return trimSentence(summary, 180);
}

function deriveDeck(summary: string, source: string) {
  if (!summary) {
    return `Trusted coverage from ${source} pulled into your lane because it fits your car interests.`;
  }

  return trimSentence(summary, 220);
}

function deriveEventType(text: string): StoryEventType {
  const normalized = text.toLowerCase();

  if (/(race|qualifying|grand prix|gp|wec|rally|wrc|gt3|le mans|hypercar|podium)/.test(normalized)) {
    return "Race";
  }

  if (/(rumor|rumour|spied|spy shots|render|reportedly|might|could|expected)/.test(normalized)) {
    return "Rumor";
  }

  if (/(auction|sold for|collector|values|price guide|barn find)/.test(normalized)) {
    return "Auction";
  }

  if (/(revealed|debut|launch|teases|teaser|unveils|confirms|announces)/.test(normalized)) {
    return "Launch";
  }

  return "Feature";
}

function deriveRegions(text: string, source: TrustedFeedSource) {
  const tags = new Set(source.defaultRegions);
  const normalized = text.toLowerCase();

  if (/(japan|tokyo|nissan|toyota|honda|subaru|mazda|lexus)/.test(normalized)) {
    tags.add("Japan");
  }

  if (/(europe|germany|italy|france|britain|uk|porsche|bmw|mercedes|audi|ferrari|lancia)/.test(normalized)) {
    tags.add("Europe");
  }

  if (/(usa|u\.s\.|american|detroit|ford|chevrolet|corvette|mustang|nascar)/.test(normalized)) {
    tags.add("USA");
  }

  if (tags.size === 0) {
    tags.add("Global");
  }

  return Array.from(tags);
}

function deriveEraTags(text: string) {
  const normalized = text.toLowerCase();
  const tags = new Set<string>();

  if (/(heritage|retro|classic|vintage|air-cooled|analog)/.test(normalized)) {
    tags.add("Heritage");
  }

  if (/\b(2000|2001|2002|2003|2004|2005|2006|2007|2008|2009)\b/.test(normalized)) {
    tags.add("2000s");
  }

  if (/\b199\d\b/.test(normalized)) {
    tags.add("90s");
  }

  if (/\b198\d\b/.test(normalized)) {
    tags.add("80s");
  }

  if (/\b197\d\b/.test(normalized)) {
    tags.add("70s");
  }

  if (tags.size === 0 && !/(classic|heritage|retro)/.test(normalized)) {
    tags.add("Modern");
  }

  return Array.from(tags);
}

function deriveInterestTags(text: string, source: TrustedFeedSource) {
  const normalized = text.toLowerCase();
  const tags = new Set<string>(source.defaultTags);

  const topicRules: Array<[RegExp, string[]]> = [
    [/\bbmw\b|\bm[23458]\b/, ["BMW", "Sports Cars"]],
    [/\bporsche\b|gt3|gt2|carrera|turbo s|911/, ["Porsche", "Sports Cars"]],
    [/\btoyota\b|\bnissan\b|\bhonda\b|\bsubaru\b|\bmazda\b|\blexus\b|skyline|supra|nsx|integra/, ["JDM"]],
    [/\brestomod\b|continuation/, ["Restomods", "Oldtimers"]],
    [/\bauction\b|collector|price guide|barn find|sold for/, ["Auctions"]],
    [/\bferrari\b|\blamborghini\b|\bmclaren\b|\bbugatti\b|\bpagani\b/, ["Supercars", "Sports Cars"]],
    [/\bhot hatch\b|civic type r|golf r|gti|yaris gr|focus rs|mini jcworks/, ["Hot Hatches"]],
    [/\boff-road\b|land cruiser|bronco|defender|wrangler/, ["Off-road"]],
    [/\bf1\b|formula 1|grand prix/, ["F1", "Motorsport"]],
    [/\bwec\b|le mans|hypercar|endurance/, ["WEC", "Motorsport"]],
    [/\brally\b|\bwrc\b|integrale|group a/, ["Rally", "Motorsport"]],
    [/\bgt3\b/, ["GT3", "Motorsport"]],
    [/\bclassic\b|vintage|oldtimer|air-cooled|heritage/, ["Oldtimers"]],
    [/\bcoupe\b|roadster|track pack|sports car|supercar/, ["Sports Cars"]],
  ];

  for (const [pattern, mappedTags] of topicRules) {
    if (pattern.test(normalized)) {
      for (const mappedTag of mappedTags) {
        tags.add(mappedTag);
      }
    }
  }

  return Array.from(tags);
}

function pickHeroGradient(seed: string) {
  return HERO_GRADIENTS[hashString(seed) % HERO_GRADIENTS.length];
}

function toTopicCollectionLabel(topic: string) {
  switch (topic) {
    case "BMW":
      return "BMW performance pulse";
    case "Porsche":
      return "Porsche driver stories";
    case "Oldtimers":
      return "Oldtimer market watch";
    case "WEC":
      return "WEC weekend briefing";
    case "Rally":
      return "Rally-era deep cuts";
    default:
      return `${topic} briefing`;
  }
}

function getPrimaryTopic(article: Article) {
  return article.primaryTopic ?? article.tags.find((tag) => !AUXILIARY_TAGS.has(tag)) ?? article.tags[0] ?? "Cars";
}

function deriveClusterDescriptor(title: string, primaryTopic: string) {
  const normalizedTopic = slugify(primaryTopic);

  return tokenizeTitle(title)
    .filter((token) => !NOISE_TOKENS.has(token) && slugify(token) !== normalizedTopic)
    .slice(0, 2)
    .join("-");
}

function computeQualityScore(article: Pick<Article, "trustScore" | "freshnessScore" | "summary" | "primaryTopic" | "imageUrl">) {
  const summaryBonus = article.summary.length >= 100 ? 0.12 : article.summary.length >= 60 ? 0.07 : 0.02;
  const entityBonus = article.primaryTopic && article.primaryTopic !== "Cars" ? 0.1 : 0;
  const imageBonus = article.imageUrl ? 0.04 : 0;

  return Number(
    clamp(article.trustScore * 0.5 + article.freshnessScore * 0.24 + summaryBonus + entityBonus + imageBonus, 0, 0.99).toFixed(2),
  );
}

function isRelevantAutomotiveStory(article: Article) {
  const combinedText = `${article.title} ${article.summary}`.toLowerCase();

  if (LOW_SIGNAL_PATTERNS.some((pattern) => pattern.test(combinedText))) {
    return false;
  }

  const specificTopicCount = article.tags.filter((tag) => !AUXILIARY_TAGS.has(tag)).length;

  return specificTopicCount > 0 && (article.qualityScore ?? computeQualityScore(article)) >= MIN_QUALITY_SCORE;
}

function isDuplicateStory(candidate: Article, accepted: Article[]) {
  const candidateTitle = normalizeTitle(candidate.title);
  const candidateTokens = tokenizeTitle(candidate.title);
  const candidateTopic = getPrimaryTopic(candidate);

  return accepted.some((existing) => {
    if (candidate.sourceUrl === existing.sourceUrl || candidateTitle === normalizeTitle(existing.title)) {
      return true;
    }

    const existingTopic = getPrimaryTopic(existing);

    if (candidateTopic !== existingTopic && candidate.eventType !== existing.eventType) {
      return false;
    }

    const existingTokens = tokenizeTitle(existing.title);
    const overlap = candidateTokens.filter((token) => existingTokens.includes(token)).length;
    const similarity = overlap / Math.max(1, Math.min(candidateTokens.length, existingTokens.length));

    return similarity >= 0.76;
  });
}

function buildClusters(articles: Article[]): { articles: Article[]; storyClusters: StoryCluster[] } {
  const grouped = new Map<string, Article[]>();

  for (const article of articles) {
    const topic = getPrimaryTopic(article);
    const descriptor = deriveClusterDescriptor(article.title, topic);
    const key = `${slugify(topic || article.id)}-${slugify(article.eventType)}-${descriptor || "main"}`;
    const existing = grouped.get(key) ?? [];

    existing.push(article);
    grouped.set(key, existing);
  }

  const storyClusters: StoryCluster[] = [];
  const clusterIdByStoryId = new Map<string, string>();

  for (const [key, group] of grouped.entries()) {
    const sortedGroup = [...group].sort(
      (left, right) => new Date(right.publishedAt).valueOf() - new Date(left.publishedAt).valueOf(),
    );
    const leadStory = sortedGroup[0];
    const topic = getPrimaryTopic(leadStory);
    const clusterId = `${key}-cluster`;
    const descriptor = deriveClusterDescriptor(leadStory.title, topic);
    const clusterLabel = descriptor
      .split("-")
      .filter(Boolean)
      .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
      .join(" ");

    storyClusters.push({
      id: clusterId,
      title:
        sortedGroup.length > 1
          ? `${topic}${clusterLabel ? `: ${clusterLabel}` : ""}`
          : `${topic} story brief`,
      description:
        sortedGroup.length > 1
          ? `${sortedGroup.length} relevant stories grouped around ${topic.toLowerCase()}${clusterLabel ? ` and ${clusterLabel.toLowerCase()}` : ""} so users can scan the main angle and the sharper follow-ups together.`
          : `Single-story briefing for ${topic.toLowerCase()} until more viewpoints land in the lane.`,
      topic,
      leadStoryId: leadStory.id,
      storyIds: sortedGroup.map((story) => story.id),
      timeline: sortedGroup.slice(0, 3).map((story) => `${story.publishedAgo}: ${story.title}`),
      storyCount: sortedGroup.length,
      sourceNames: Array.from(new Set(sortedGroup.map((story) => story.source))),
    });

    for (const story of sortedGroup) {
      clusterIdByStoryId.set(story.id, clusterId);
    }
  }

  const clusterMap = new Map(storyClusters.map((cluster) => [cluster.id, cluster]));

  return {
    articles: articles.map((article) => {
      const clusterId = clusterIdByStoryId.get(article.id) ?? article.clusterId;
      const cluster = clusterMap.get(clusterId);

      return {
        ...article,
        clusterId,
        clusterLabel: cluster?.title ?? article.clusterLabel,
      };
    }),
    storyClusters: storyClusters.sort((left, right) => left.title.localeCompare(right.title)),
  };
}

async function fetchSource(source: TrustedFeedSource) {
  const fetchedAt = new Date().toISOString();

  try {
    const response = await fetch(source.feedUrl, {
      headers: {
        "user-agent": "OversteerBot/0.2 (+https://github.com/muhammedagic237-prog/oversteer-news-app)",
      },
      next: { revalidate: FEED_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      throw new Error(`Feed returned ${response.status}`);
    }

    const xml = await response.text();
    const parsedItems = parseFeedXml(xml).slice(0, MAX_ITEMS_PER_SOURCE);

    return {
      source,
      items: parsedItems,
      report: {
        id: source.id,
        name: source.label,
        ok: true,
        articleCount: parsedItems.length,
        fetchedAt,
      } satisfies FeedSourceReport,
    };
  } catch (error) {
    return {
      source,
      items: [],
      report: {
        id: source.id,
        name: source.label,
        ok: false,
        articleCount: 0,
        error: error instanceof Error ? error.message : "Unknown fetch error",
        fetchedAt,
      } satisfies FeedSourceReport,
    };
  }
}

function buildArticleFromFeed(
  source: TrustedFeedSource,
  item: Awaited<ReturnType<typeof fetchSource>>["items"][number],
) {
  const publishedAt = normalizePublishedAt(item.publishedAt);
  const summary = deriveSummary(item.summary, item.title);
  const tags = Array.from(
    new Set([
      ...deriveInterestTags(`${item.title} ${item.summary}`, source),
      ...deriveEraTags(`${item.title} ${item.summary}`),
    ]),
  );
  const primaryTopic =
    tags.find((tag) => !AUXILIARY_TAGS.has(tag)) ?? tags[0] ?? source.defaultTags[0] ?? "Cars";
  const eventType = deriveEventType(`${item.title} ${item.summary}`);
  const articleSeed = `${source.publisherName}-${item.title}-${item.link}`;
  const article = {
    id: slugify(articleSeed).slice(0, 64) || `story-${hashString(articleSeed)}`,
    title: item.title,
    summary,
    deck: deriveDeck(item.summary, source.publisherName),
    source: source.publisherName,
    sourceUrl: item.link,
    publishedAgo: formatPublishedAgo(publishedAt),
    publishedAt,
    tags,
    regions: deriveRegions(`${item.title} ${item.summary}`, source),
    sourceStyle: source.sourceStyle,
    trustScore: source.trustScore,
    freshnessScore: computeFreshnessScore(publishedAt),
    clusterId: "pending-cluster",
    eventType,
    heroGradient: pickHeroGradient(`${source.id}-${primaryTopic}`),
    imageUrl: item.imageUrl,
    primaryTopic,
    qualityScore: 0,
  } satisfies Article;

  return {
    ...article,
    qualityScore: computeQualityScore(article),
  } satisfies Article;
}

function buildCatalog(articles: Article[]): FeedCatalog {
  const deduped: Article[] = [];

  for (const article of articles) {
    if (isRelevantAutomotiveStory(article) && !isDuplicateStory(article, deduped)) {
      deduped.push(article);
    }
  }

  const trimmed = deduped
    .sort((left, right) => {
      const freshnessDelta = new Date(right.publishedAt).valueOf() - new Date(left.publishedAt).valueOf();

      if (freshnessDelta !== 0) {
        return freshnessDelta;
      }

      return (right.qualityScore ?? 0) - (left.qualityScore ?? 0);
    })
    .slice(0, MAX_ARTICLES);
  const clustered = buildClusters(trimmed);
  const topicCollections = Array.from(
    new Set(clustered.articles.map((article) => toTopicCollectionLabel(getPrimaryTopic(article)))),
  ).slice(0, 8);

  return {
    articles: clustered.articles,
    storyClusters: clustered.storyClusters,
    sourceCatalog: feedSourceCatalog,
    topicCollections: topicCollections.length > 0 ? topicCollections : feedFallbackTopics,
    syncedAt: new Date().toISOString(),
    mode: "live",
  };
}

function buildSeedPayload(reason: string): FeedPayload {
  return {
    catalog: {
      ...seedFeedCatalog,
      syncedAt: new Date().toISOString(),
    },
    reports: [createOfflineReport(reason)],
  };
}

export async function getFeedPayload(): Promise<FeedPayload> {
  const results = await Promise.all(trustedFeedSources.map((source) => fetchSource(source)));
  const liveArticles = results.flatMap(({ source, items }) =>
    items.map((item) => buildArticleFromFeed(source, item)),
  );
  const reports = results.map((result) => result.report);

  if (liveArticles.length === 0) {
    const cached = await loadFeedPayload();

    if (cached) {
      return {
        catalog: {
          ...cached.catalog,
          mode: "cached",
        },
        reports:
          cached.reports.length > 0
            ? cached.reports
            : [createOfflineReport("Using cached Supabase feed snapshot.")],
      };
    }

    return buildSeedPayload("Live feeds unavailable. Falling back to seeded editorial stories.");
  }

  const payload = {
    catalog: buildCatalog(liveArticles),
    reports,
  } satisfies FeedPayload;

  await saveFeedPayload(payload);

  return payload;
}
