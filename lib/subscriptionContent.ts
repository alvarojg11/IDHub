import "server-only";

import { promises as fs } from "fs";
import path from "path";
import Parser from "rss-parser";

import { CASES } from "@/lib/cases/registry";

export type ContentUpdate = {
  id: string;
  kind: "case" | "blog";
  title: string;
  url: string;
  publishedAt: string | null;
  summary?: string | null;
  firstQuestion?: string | null;
  imageUrl?: string | null;
};

const BLOG_FEED_URL = "https://alvaroayala1.substack.com/feed";

function appBaseUrl() {
  return (
    process.env.APP_BASE_URL ??
    process.env.NEXT_PUBLIC_APP_BASE_URL ??
    "http://localhost:3000"
  );
}

function decodeEntities(input: string) {
  return input
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function normalizeText(input: string, max = 700) {
  const text = decodeEntities(input.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}...`;
}

async function extractCaseEmailPreview(slug: string): Promise<{
  summary: string | null;
  firstQuestion: string | null;
  imageSrc: string | null;
}> {
  const file = path.join(process.cwd(), "app", "cases", slug, "page.mdx");
  try {
    const raw = await fs.readFile(file, "utf8");

    const firstParagraphMatch = raw.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const firstQuestionMatch = raw.match(/<CaseQuestion[\s\S]*?prompt="([^"]+)"/i);
    const firstImageMatch = raw.match(/<Image[\s\S]*?src="([^"]+)"/i);

    return {
      summary: firstParagraphMatch ? normalizeText(firstParagraphMatch[1], 900) : null,
      firstQuestion: firstQuestionMatch ? normalizeText(firstQuestionMatch[1], 300) : null,
      imageSrc: firstImageMatch ? firstImageMatch[1] : null,
    };
  } catch {
    return {
      summary: null,
      firstQuestion: null,
      imageSrc: null,
    };
  }
}

export async function collectContentUpdates(): Promise<ContentUpdate[]> {
  const baseUrl = appBaseUrl();
  const caseUpdates: ContentUpdate[] = await Promise.all(
    CASES.map(async (c) => {
      const preview = await extractCaseEmailPreview(c.slug);
      const imageUrl = preview.imageSrc
        ? preview.imageSrc.startsWith("http")
          ? preview.imageSrc
          : `${baseUrl}${preview.imageSrc.startsWith("/") ? "" : "/"}${preview.imageSrc}`
        : null;
      return {
        id: `case:${c.slug}`,
        kind: "case" as const,
        title: c.title,
        url: `${baseUrl}/cases/${c.slug}`,
        publishedAt: null,
        summary: preview.summary,
        firstQuestion: preview.firstQuestion,
        imageUrl,
      };
    })
  );

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
        summary: item.contentSnippet ?? null,
        firstQuestion: null,
        imageUrl: null,
      }));
  } catch {
    blogUpdates = [];
  }

  return [...caseUpdates, ...blogUpdates];
}
