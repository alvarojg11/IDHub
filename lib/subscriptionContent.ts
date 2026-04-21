import "server-only";

import { promises as fs } from "fs";
import path from "path";

import { getBlogPosts } from "@/lib/blog/registry";
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

function extractEmbeddedHtml(raw: string) {
  const match = raw.match(/dangerouslySetInnerHTML\s*=\s*\{\{\s*__html:\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/s);
  if (!match) return null;

  const literal = match[1];
  if (literal.startsWith('"')) {
    try {
      return JSON.parse(literal);
    } catch {
      return null;
    }
  }

  return literal
    .slice(1, -1)
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, "\\");
}

function extractFirstParagraphFromHtml(html: string) {
  const paragraphs = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
  for (const [, paragraph] of paragraphs) {
    const text = normalizeText(paragraph, 900);
    if (text.length >= 40 && !/thanks for reading/i.test(text)) return text;
  }
  return null;
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

async function extractBlogEmailPreview(slug: string): Promise<string | null> {
  const file = path.join(process.cwd(), "app", "blog", slug, "page.mdx");
  try {
    const raw = await fs.readFile(file, "utf8");
    const embeddedHtml = extractEmbeddedHtml(raw);
    const embeddedParagraph = embeddedHtml ? extractFirstParagraphFromHtml(embeddedHtml) : null;
    if (embeddedParagraph) return embeddedParagraph;

    const withoutExports = raw
      .replace(/export\s+const\s+\w+\s*=\s*\{[\s\S]*?\}\s*;/g, "")
      .replace(/^import\s+.+$/gm, "")
      .replace(/^<\/?.+>$/gm, "")
      .trim();
    const blocks = withoutExports.split(/\n\s*\n/);

    for (const block of blocks) {
      const line = block.trim();
      if (!line || line.startsWith("#") || line.startsWith("```")) continue;
      if (line.startsWith("import ")) continue;
      if (line.startsWith("<BlogPostShell") || line === "</BlogPostShell>") continue;
      if (line.includes("dangerouslySetInnerHTML")) continue;
      const text = normalizeText(line, 900);
      if (text.length >= 40) return text;
    }
    return null;
  } catch {
    return null;
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

  const blogPosts = await getBlogPosts();
  const blogUpdates: ContentUpdate[] = await Promise.all(
    blogPosts.map(async (post) => ({
      id: `blog:${post.slug}`,
      kind: "blog" as const,
      title: post.title,
      url: `${baseUrl}/blog/${post.slug}`,
      publishedAt: post.publishedAt,
      summary: (await extractBlogEmailPreview(post.slug)) ?? post.description,
      firstQuestion: null,
      imageUrl: null,
    }))
  );

  return [...caseUpdates, ...blogUpdates];
}
