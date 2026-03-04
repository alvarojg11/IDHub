import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const KEY_FILE_RE = /^[A-Za-z0-9-]{8,128}\.txt$/;

function getSiteBaseUrl() {
  const envUrl =
    process.env.APP_BASE_URL ??
    process.env.NEXT_PUBLIC_APP_BASE_URL ??
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

async function resolveKeyFromPublicDir(baseUrl: string) {
  const publicDir = path.join(process.cwd(), "public");
  const entries = await fs.readdir(publicDir, { withFileTypes: true }).catch(() => null);
  if (!entries) {
    return null;
  }

  for (const entry of entries) {
    if (!entry.isFile() || !KEY_FILE_RE.test(entry.name)) continue;

    const key = entry.name.slice(0, -4);
    const filePath = path.join(publicDir, entry.name);

    try {
      const contents = (await fs.readFile(filePath, "utf8")).trim();
      if (contents !== key) continue;

      return {
        key,
        keyLocation: `${baseUrl}/${entry.name}`,
      };
    } catch {
      continue;
    }
  }

  return null;
}

async function resolveIndexNowCredentials() {
  const baseUrl = getSiteBaseUrl();
  const configuredKey = process.env.INDEXNOW_KEY?.trim();
  const configuredKeyLocation = process.env.INDEXNOW_KEY_LOCATION?.trim();

  if (configuredKey) {
    return {
      key: configuredKey,
      keyLocation: configuredKeyLocation || `${baseUrl}/${configuredKey}.txt`,
      baseUrl,
    };
  }

  const publicKey = await resolveKeyFromPublicDir(baseUrl);
  if (!publicKey) return null;

  return {
    ...publicKey,
    baseUrl,
  };
}

export async function submitIndexNow(urls: string[]) {
  const uniqueUrls = [...new Set(urls.map((url) => url.trim()).filter(Boolean))];
  if (uniqueUrls.length === 0) {
    return { ok: false as const, reason: "no_urls" as const };
  }

  const credentials = await resolveIndexNowCredentials();
  if (!credentials) {
    return { ok: false as const, reason: "key_not_configured" as const };
  }

  const siteUrl = new URL(credentials.baseUrl);
  if (siteUrl.hostname === "localhost" || siteUrl.hostname.endsWith(".local")) {
    return { ok: false as const, reason: "local_host" as const };
  }

  const matchingUrls = uniqueUrls.filter((url) => {
    try {
      return new URL(url).host === siteUrl.host;
    } catch {
      return false;
    }
  });

  if (matchingUrls.length === 0) {
    return { ok: false as const, reason: "no_matching_host_urls" as const };
  }

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      host: siteUrl.host,
      key: credentials.key,
      keyLocation: credentials.keyLocation,
      urlList: matchingUrls.slice(0, 10_000),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`IndexNow submit failed (${res.status}): ${body}`);
  }

  return {
    ok: true as const,
    submitted: matchingUrls.length,
    keyLocation: credentials.keyLocation,
    endpoint: INDEXNOW_ENDPOINT,
  };
}
