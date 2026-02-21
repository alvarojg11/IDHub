import "server-only";

import Parser from "rss-parser";

import { CASES } from "@/lib/cases/registry";

export type ContentUpdate = {
  id: string;
  kind: "case" | "blog";
  title: string;
  url: string;
  publishedAt: string | null;
};

const BLOG_FEED_URL = "https://alvaroayala1.substack.com/feed";

function appBaseUrl() {
  return (
    process.env.APP_BASE_URL ??
    process.env.NEXT_PUBLIC_APP_BASE_URL ??
    "http://localhost:3000"
  );
}

export async function collectContentUpdates(): Promise<ContentUpdate[]> {
  const baseUrl = appBaseUrl();
  const caseUpdates: ContentUpdate[] = CASES.map((c) => ({
    id: `case:${c.slug}`,
    kind: "case",
    title: c.title,
    url: `${baseUrl}/cases/${c.slug}`,
    publishedAt: null,
  }));

  const parser = new Parser();
  let blogUpdates: ContentUpdate[] = [];
  try {
    const feed = await parser.parseURL(BLOG_FEED_URL);
    blogUpdates = (feed.items ?? [])
      .filter((item) => Boolean(item.link))
      .map((item) => ({
        id: `blog:${item.link}`,
        kind: "blog" as const,
        title: item.title ?? "Untitled",
        url: item.link as string,
        publishedAt: item.isoDate ?? item.pubDate ?? null,
      }));
  } catch {
    blogUpdates = [];
  }

  return [...caseUpdates, ...blogUpdates];
}
