#!/usr/bin/env node

import { promises as fs } from "fs";
import path from "path";

import Parser from "rss-parser";

const FEED_URL = process.env.SUBSTACK_FEED_URL ?? "https://alvaroayala1.substack.com/feed";
const BLOG_ROOT = path.join(process.cwd(), "app", "blog");

function parseArgs(argv) {
  const flags = new Set(argv);
  const limitArg = argv.find((arg) => arg.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.split("=")[1]) : null;

  return {
    overwrite: flags.has("--overwrite"),
    dryRun: flags.has("--dry-run"),
    limit: Number.isFinite(limit) && limit && limit > 0 ? limit : null,
  };
}

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function slugFromLink(link, title) {
  if (!link) return slugify(title || "post");
  try {
    const url = new URL(link);
    const segments = url.pathname.split("/").filter(Boolean);
    const pIdx = segments.indexOf("p");
    if (pIdx >= 0 && segments[pIdx + 1]) return slugify(segments[pIdx + 1]);
    if (segments.length > 0) return slugify(segments[segments.length - 1]);
  } catch {
    // fall through
  }
  return slugify(title || "post");
}

function stripHtml(input) {
  return input.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function summarize(input, max = 220) {
  const text = stripHtml(input);
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}...`;
}

function sanitizeHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
    .trim();
}

function toIsoDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

function buildMdx({ title, description, publishedAt, htmlBody }) {
  const titleLiteral = JSON.stringify(title);
  const descLiteral = JSON.stringify(description);
  const dateLiteral = JSON.stringify(publishedAt);
  const htmlLiteral = JSON.stringify(htmlBody);

  return `export const post = {
  title: ${titleLiteral},
  description: ${descLiteral},
  publishedAt: ${dateLiteral},
};

# ${title}

<div dangerouslySetInnerHTML={{ __html: ${htmlLiteral} }} />
`;
}

async function main() {
  const { overwrite, dryRun, limit } = parseArgs(process.argv.slice(2));
  const parser = new Parser({
    customFields: {
      item: [["content:encoded", "contentEncoded"]],
    },
  });

  console.log(`Fetching feed: ${FEED_URL}`);
  const feed = await parser.parseURL(FEED_URL);
  const items = (feed.items ?? []).slice(0, limit ?? undefined);

  let created = 0;
  let skipped = 0;

  for (const item of items) {
    const title = (item.title ?? "Untitled").trim();
    const slug = slugFromLink(item.link, title);
    const dir = path.join(BLOG_ROOT, slug);
    const file = path.join(dir, "page.mdx");
    const alreadyExists = await exists(file);

    if (alreadyExists && !overwrite) {
      skipped += 1;
      console.log(`Skip existing: ${slug}`);
      continue;
    }

    const publishedAt = toIsoDate(item.isoDate ?? item.pubDate);
    const rawHtml = (item.contentEncoded ?? item.content ?? item.contentSnippet ?? "").trim();
    const sanitizedHtml = sanitizeHtml(rawHtml);
    const description = summarize(item.contentSnippet || sanitizedHtml || title);
    const htmlBody = sanitizedHtml || `<p>${description}</p>`;
    const mdx = buildMdx({ title, description, publishedAt, htmlBody });

    if (dryRun) {
      console.log(`[dry-run] Would write: app/blog/${slug}/page.mdx`);
      continue;
    }

    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(file, mdx, "utf8");
    created += 1;
    console.log(`Wrote: app/blog/${slug}/page.mdx`);
  }

  console.log("");
  console.log(`Done. Created: ${created}, skipped existing: ${skipped}, total scanned: ${items.length}`);
  console.log("Review generated posts and adjust formatting where needed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
