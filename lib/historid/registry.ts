import "server-only";

import { promises as fs } from "fs";
import type { Dirent } from "node:fs";
import path from "path";
import { cache } from "react";

export const HISTORID_CATEGORY_LABELS = {
  organisms: "Organisms",
  antibiotics: "Antibiotics",
  "wars-outbreaks": "Wars + Outbreaks",
  "people-illness": "People + Illness",
  "diagnostics-vaccines": "Diagnostics + Vaccines",
} as const;

export type HistorIDCategory = keyof typeof HISTORID_CATEGORY_LABELS;

export type HistorIDMeta = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  historicalDateLabel: string;
  historicalYearSort?: number;
  categories: HistorIDCategory[];
  tags: string[];
  hook: string;
  takeaway: string;
  heroImage: string;
  heroImageAlt: string;
  heroImageCredit?: string;
  heroImageSourceUrl?: string;
  heroImageLicense?: string;
  socialHeadline?: string;
  socialDek?: string;
  socialFacts?: string[];
  featured?: boolean;
};

export type HistorIDEntry = Omit<HistorIDMeta, "publishedAt"> & {
  publishedAt: string | null;
  url: string;
};

const HISTORID_DIR = path.join(process.cwd(), "app", "historid");

function normalizeDate(value: string | null) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

function extractFactObject(raw: string) {
  const match = raw.match(/export\s+const\s+fact\s*=\s*\{([\s\S]*?)\}\s*;/m);
  return match ? match[1] : null;
}

function parseStringLiteral(literal: string) {
  if (!literal) return null;
  const quote = literal[0];
  if ((quote !== '"' && quote !== "'") || literal[literal.length - 1] !== quote) {
    return null;
  }
  if (quote === '"') {
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

function readObjectStringProp(source: string, key: string) {
  const re = new RegExp(`${key}\\s*:\\s*(\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*')`, "m");
  const match = source.match(re);
  return match ? parseStringLiteral(match[1]) : null;
}

function readObjectStringArrayProp(source: string, key: string) {
  const re = new RegExp(`${key}\\s*:\\s*\\[([\\s\\S]*?)\\]`, "m");
  const match = source.match(re);
  if (!match) return [];

  const literals = match[1].match(/\"(?:[^\"\\]|\\.)*\"|'(?:[^'\\]|\\.)*'/g) ?? [];
  return literals.map((literal) => parseStringLiteral(literal)).filter((value): value is string => Boolean(value));
}

function readObjectNumberProp(source: string, key: string) {
  const re = new RegExp(`${key}\\s*:\\s*(-?\\d+(?:\\.\\d+)?)`, "m");
  const match = source.match(re);
  if (!match) return undefined;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function readObjectBooleanProp(source: string, key: string) {
  const re = new RegExp(`${key}\\s*:\\s*(true|false)`, "m");
  const match = source.match(re);
  if (!match) return undefined;
  return match[1] === "true";
}

function sanitizeCategories(categories: string[]) {
  return categories.filter((category): category is HistorIDCategory => category in HISTORID_CATEGORY_LABELS);
}

async function readHistoridEntry(slug: string): Promise<HistorIDEntry | null> {
  const filePath = path.join(HISTORID_DIR, slug, "page.mdx");

  try {
    const raw = await fs.readFile(filePath, "utf8");
    const factObject = extractFactObject(raw);
    if (!factObject) return null;

    const categories = sanitizeCategories(readObjectStringArrayProp(factObject, "categories"));

    return {
      slug,
      title: readObjectStringProp(factObject, "title") ?? slug,
      description: readObjectStringProp(factObject, "description") ?? "Historical moments that still shape infectious diseases.",
      publishedAt: normalizeDate(readObjectStringProp(factObject, "publishedAt")),
      historicalDateLabel: readObjectStringProp(factObject, "historicalDateLabel") ?? "Historical",
      historicalYearSort: readObjectNumberProp(factObject, "historicalYearSort"),
      categories,
      tags: readObjectStringArrayProp(factObject, "tags"),
      hook: readObjectStringProp(factObject, "hook") ?? "",
      takeaway: readObjectStringProp(factObject, "takeaway") ?? "",
      heroImage: readObjectStringProp(factObject, "heroImage") ?? "",
      heroImageAlt: readObjectStringProp(factObject, "heroImageAlt") ?? "",
      heroImageCredit: readObjectStringProp(factObject, "heroImageCredit") ?? undefined,
      heroImageSourceUrl: readObjectStringProp(factObject, "heroImageSourceUrl") ?? undefined,
      heroImageLicense: readObjectStringProp(factObject, "heroImageLicense") ?? undefined,
      socialHeadline: readObjectStringProp(factObject, "socialHeadline") ?? undefined,
      socialDek: readObjectStringProp(factObject, "socialDek") ?? undefined,
      socialFacts: readObjectStringArrayProp(factObject, "socialFacts"),
      featured: readObjectBooleanProp(factObject, "featured") ?? false,
      url: `/historid/${slug}`,
    };
  } catch {
    return null;
  }
}

export const getHistoridEntries = cache(async (): Promise<HistorIDEntry[]> => {
  let entries: Dirent[] = [];
  try {
    entries = await fs.readdir(HISTORID_DIR, { withFileTypes: true });
  } catch {
    return [];
  }

  const posts = (
    await Promise.all(
      entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => readHistoridEntry(entry.name))
    )
  ).filter((entry): entry is HistorIDEntry => Boolean(entry));

  return posts.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;

    const aTs = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const bTs = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    if (aTs !== bTs) return bTs - aTs;

    const aYear = a.historicalYearSort ?? Number.MIN_SAFE_INTEGER;
    const bYear = b.historicalYearSort ?? Number.MIN_SAFE_INTEGER;
    if (aYear !== bYear) return bYear - aYear;

    return a.title.localeCompare(b.title);
  });
});

export async function getHistoridEntry(slug: string) {
  const entries = await getHistoridEntries();
  return entries.find((entry) => entry.slug === slug) ?? null;
}

export async function getFeaturedHistoridEntries() {
  const entries = await getHistoridEntries();
  return entries.filter((entry) => entry.featured);
}

export async function getHistoridCategories() {
  const entries = await getHistoridEntries();
  const counts = new Map<HistorIDCategory, number>();

  for (const entry of entries) {
    for (const category of entry.categories) {
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
  }

  return Object.entries(HISTORID_CATEGORY_LABELS)
    .map(([key, label]) => ({
      key: key as HistorIDCategory,
      label,
      count: counts.get(key as HistorIDCategory) ?? 0,
    }))
    .filter((item) => item.count > 0);
}
