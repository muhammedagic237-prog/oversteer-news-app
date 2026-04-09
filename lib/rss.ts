import { XMLParser } from "fast-xml-parser";

type RssItem = {
  title?: string;
  link?: string | { href?: string };
  pubDate?: string;
  published?: string;
  updated?: string;
  description?: string;
  "content:encoded"?: string;
  summary?: string;
  enclosure?: { "@_url"?: string };
  "media:content"?: { "@_url"?: string } | Array<{ "@_url"?: string }>;
};

export type ParsedFeedItem = {
  title: string;
  link: string;
  publishedAt: string;
  summary: string;
  imageUrl?: string;
};

const parser = new XMLParser({
  ignoreAttributes: false,
  trimValues: true,
  attributeNamePrefix: "@_",
});

function toArray<T>(value: T | T[] | undefined): T[] {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function stripHtml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveLink(item: RssItem) {
  if (typeof item.link === "string") {
    return item.link.trim();
  }

  return item.link?.href?.trim() ?? "";
}

function resolveImage(item: RssItem) {
  const media = toArray(item["media:content"]);
  const mediaUrl = media.find((entry) => entry?.["@_url"])?.["@_url"];

  return mediaUrl ?? item.enclosure?.["@_url"];
}

export function parseFeedXml(xml: string): ParsedFeedItem[] {
  const parsed = parser.parse(xml);
  const rssItems = toArray<RssItem>(parsed?.rss?.channel?.item);
  const atomItems = toArray<RssItem>(parsed?.feed?.entry);
  const items = rssItems.length > 0 ? rssItems : atomItems;
  const parsedItems = items.map((item): ParsedFeedItem | null => {
    const title = stripHtml(item.title ?? "");
    const link = resolveLink(item);
    const publishedAt = item.pubDate ?? item.published ?? item.updated ?? new Date().toISOString();
    const summary = stripHtml(
      item.description ?? item.summary ?? item["content:encoded"] ?? "",
    );

    if (!title || !link) {
      return null;
    }

    return {
      title,
      link,
      publishedAt,
      summary,
      imageUrl: resolveImage(item),
    };
  });

  return parsedItems.filter((item): item is ParsedFeedItem => item !== null);
}
