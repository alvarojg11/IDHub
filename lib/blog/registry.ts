import "server-only";

import { promises as fs } from "fs";
import type { Dirent } from "node:fs";
import path from "path";
import { cache } from "react";

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  preview: string;
  publishedAt: string | null;
};

type PostFrontmatter = {
  title: string | null;
  description: string | null;
  publishedAt: string | null;
};

const BLOG_DIR = path.join(process.cwd(), "app", "blog");

function normalizeDate(value: string | null) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function extractPostObject(raw: string) {
  const match = raw.match(/export\s+const\s+post\s*=\s*\{([\s\S]*?)\}\s*;/m);
  return match ? match[1] : null;
}

function parseStringLiteral(literal: string) {
  if (!literal) return null;
  const quote = literal[0];
  if ((quote !== "\"" && quote !== "'") || literal[literal.length - 1] !== quote) {
    return null;
  }
  if (quote === "\"") {
    try {
      return JSON.parse(literal);
    } catch {
      return null;
    }
  }
  const inner = literal
    .slice(1, -1)
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, "\\");
  return inner;
}

function readObjectStringProp(source: string, key: string) {
  const re = new RegExp(`${key}\\s*:\\s*(\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*')`, "m");
  const match = source.match(re);
  return match ? parseStringLiteral(match[1]) : null;
}

function extractHeadingTitle(raw: string) {
  const match = raw.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

function cleanText(input: string) {
  return input
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function clampText(input: string, max: number) {
  if (input.length <= max) return input;
  return `${input.slice(0, max - 3).trimEnd()}...`;
}

function extractFirstSentence(text: string) {
  const normalized = cleanText(text);
  if (!normalized) return null;

  const match = normalized.match(/^(.+?[.!?])(?:\s+|$)/);
  return match ? match[1].trim() : normalized;
}

function extractEmbeddedHtml(raw: string) {
  const match = raw.match(/dangerouslySetInnerHTML[\s\S]*?__html:\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/);
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
    const text = cleanText(paragraph);
    if (text.length >= 30 && !/thanks for reading/i.test(text)) {
      return text.length > 220 ? `${text.slice(0, 219).trim()}...` : text;
    }
  }
  return null;
}

function extractSummary(raw: string) {
  const embeddedHtml = extractEmbeddedHtml(raw);
  const embeddedParagraph = embeddedHtml ? extractFirstParagraphFromHtml(embeddedHtml) : null;
  if (embeddedParagraph) return embeddedParagraph;

  const withoutExports = raw
    .replace(/export\s+const\s+\w+\s*=\s*\{[\s\S]*?\}\s*;/g, "")
    .replace(/^export\s+const\s+.+$/gm, "")
    .replace(/^import\s+.+$/gm, "")
    .replace(/^<\/?.+>$/gm, "")
    .trim();
  const blocks = withoutExports.split(/\n\s*\n/);

  for (const block of blocks) {
    const line = block.trim();
    if (!line) continue;
    if (line.startsWith("#")) continue;
    if (line.startsWith("```")) continue;
    if (line.startsWith("import ")) continue;
    if (line.startsWith("<BlogPostShell") || line === "</BlogPostShell>") continue;
    if (line.includes("dangerouslySetInnerHTML")) continue;

    const text = cleanText(line);
    if (text.length >= 30) {
      return text.length > 220 ? `${text.slice(0, 219).trim()}...` : text;
    }
  }
  return "Clinical reflections and practical infectious diseases reasoning.";
}

function extractLeadBlock(raw: string) {
  const withoutExports = raw
    .replace(/export\s+const\s+\w+\s*=\s*\{[\s\S]*?\}\s*;/g, "")
    .replace(/^export\s+const\s+.+$/gm, "")
    .replace(/^import\s+.+$/gm, "")
    .replace(/^<\/?.+>$/gm, "")
    .trim();
  const blocks = withoutExports.split(/\n\s*\n/);

  for (const block of blocks) {
    const line = block.trim();
    if (!line) continue;
    if (line.startsWith("#")) continue;
    if (line.startsWith("```")) continue;
    if (line.startsWith("import ")) continue;
    if (line.startsWith("<BlogPostShell") || line === "</BlogPostShell>") continue;
    if (line.includes("dangerouslySetInnerHTML")) continue;

    const text = cleanText(line);
    if (text.length >= 30) {
      return text;
    }
  }

  return null;
}

function extractPreview(raw: string, description: string) {
  const leadBlock = extractLeadBlock(raw);
  const firstSentence = leadBlock ? extractFirstSentence(leadBlock) : null;
  return clampText(firstSentence ?? description, 280);
}

function parsePostFrontmatter(raw: string): PostFrontmatter {
  const postObject = extractPostObject(raw);
  if (!postObject) {
    return {
      title: null,
      description: null,
      publishedAt: null,
    };
  }
  return {
    title: readObjectStringProp(postObject, "title"),
    description: readObjectStringProp(postObject, "description"),
    publishedAt: readObjectStringProp(postObject, "publishedAt"),
  };
}

async function readBlogPost(slug: string): Promise<BlogPostMeta | null> {
  const mdxFile = path.join(BLOG_DIR, slug, "page.mdx");
  try {
    const raw = await fs.readFile(mdxFile, "utf8");
    const frontmatter = parsePostFrontmatter(raw);
    const title = frontmatter.title ?? extractHeadingTitle(raw) ?? slug;
    const description = frontmatter.description ?? extractSummary(raw);
    const preview = extractPreview(raw, description);
    const publishedAt = normalizeDate(frontmatter.publishedAt);

    return {
      slug,
      title,
      description,
      preview,
      publishedAt,
    };
  } catch {
    return null;
  }
}

export const getBlogPost = cache(async (slug: string): Promise<BlogPostMeta | null> => readBlogPost(slug));

export const getBlogPosts = cache(async (): Promise<BlogPostMeta[]> => {
  let entries: Dirent[] = [];
  try {
    entries = await fs.readdir(BLOG_DIR, { withFileTypes: true });
  } catch {
    return [];
  }

  const posts = (
    await Promise.all(
        entries
          .filter((entry) => entry.isDirectory())
          .map((entry) => getBlogPost(entry.name))
    )
  ).filter((post): post is BlogPostMeta => Boolean(post));

  return posts.sort((a, b) => {
    const aTs = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const bTs = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    if (aTs !== bTs) return bTs - aTs;
    return a.title.localeCompare(b.title);
  });
});
