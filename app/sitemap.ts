import { promises as fs } from "node:fs";
import path from "node:path";

import type { MetadataRoute } from "next";

const APP_DIR = path.join(process.cwd(), "app");
const PAGE_FILE_RE = /^page\.(tsx|mdx)$/;

const EXCLUDED_PREFIXES = [
  "/api",
  "/admin",
];

const EXCLUDED_ROUTES = new Set([
  "/contact/thanks",
  "/research/thanks",
  "/subscribe/unsubscribe",
]);

function getBaseUrl() {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL;

  if (!envUrl) {
    return "http://localhost:3000";
  }

  const normalized = envUrl.startsWith("http") ? envUrl : `https://${envUrl}`;
  return normalized.replace(/\/+$/, "");
}

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }

    if (PAGE_FILE_RE.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function filePathToRoute(filePath: string) {
  const rel = path.relative(APP_DIR, filePath);
  const withoutPage = rel.replace(/(^|[/\\])page\.(tsx|mdx)$/, "");
  const segments = withoutPage
    .split(path.sep)
    .filter(Boolean)
    .filter((segment) => !segment.startsWith("("))
    .filter((segment) => !segment.startsWith("@"))
    .filter((segment) => !segment.startsWith("["));

  const route = `/${segments.join("/")}`.replace(/\/+$/, "") || "/";

  return route;
}

function isIncludedRoute(route: string) {
  if (EXCLUDED_ROUTES.has(route)) return false;
  if (EXCLUDED_PREFIXES.some((prefix) => route === prefix || route.startsWith(`${prefix}/`))) {
    return false;
  }
  return true;
}

function getPriority(route: string) {
  if (route === "/") return 1;
  if (["/blog", "/cases", "/tools/immunoid", "/tools/doseid", "/probid", "/mechid"].includes(route)) {
    return 0.9;
  }
  if (route.startsWith("/blog/") || route.startsWith("/cases/")) return 0.8;
  return 0.7;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const pageFiles = await walk(APP_DIR);

  const routes = [...new Set(pageFiles.map(filePathToRoute))]
    .filter(isIncludedRoute)
    .sort((a, b) => a.localeCompare(b));

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route.startsWith("/blog/") ? "monthly" : "weekly",
    priority: getPriority(route),
  }));
}
