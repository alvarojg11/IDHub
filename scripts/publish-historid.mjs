import { access } from "node:fs/promises";
import path from "node:path";

import { DEFAULT_BASE_URL, DEFAULT_DRIVE_ROOT, exportAssets } from "./export-social-assets.mjs";

function printUsage() {
  console.log("Usage: npm run publish:historid -- <slug> [--base-url=http://localhost:3000] [--drive-root=\"/path/to/Media\"]");
}

function parseArgs(argv) {
  let slug = null;
  const options = {
    baseUrl: DEFAULT_BASE_URL,
    driveRoot: DEFAULT_DRIVE_ROOT,
  };

  for (const arg of argv) {
    if (!arg.startsWith("--") && !slug) {
      slug = arg;
      continue;
    }

    if (arg.startsWith("--base-url=")) {
      options.baseUrl = arg.slice("--base-url=".length).replace(/\/+$/, "");
      continue;
    }

    if (arg.startsWith("--drive-root=")) {
      options.driveRoot = arg.slice("--drive-root=".length);
    }
  }

  return { slug, options };
}

async function assertFileExists(filePath, label) {
  try {
    await access(filePath);
  } catch {
    throw new Error(`${label} not found: ${filePath}`);
  }
}

async function assertImageResponse(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Route check failed: ${url} (${response.status} ${response.statusText})`);
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/")) {
    throw new Error(`Expected image response from ${url}, received '${contentType || "unknown"}'.`);
  }
}

async function assertPageResponse(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Page check failed: ${url} (${response.status} ${response.statusText})`);
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) {
    throw new Error(`Expected HTML response from ${url}, received '${contentType || "unknown"}'.`);
  }
}

async function verifyHistoridSlug(slug, baseUrl) {
  const mdxPath = path.join(process.cwd(), "app", "historid", slug, "page.mdx");
  const heroImagePath = path.join(process.cwd(), "public", "historid", slug, "hero.jpg");

  await assertFileExists(mdxPath, "HistorID entry");
  await assertFileExists(heroImagePath, "HistorID hero image");

  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  await assertPageResponse(`${normalizedBaseUrl}/historid/${slug}`);
  await Promise.all([
    assertImageResponse(`${normalizedBaseUrl}/api/og/historid/${slug}`),
    assertImageResponse(`${normalizedBaseUrl}/api/ig/historid/${slug}`),
    assertImageResponse(`${normalizedBaseUrl}/api/ig/historid/${slug}/teaching`),
    assertImageResponse(`${normalizedBaseUrl}/api/ig/historid/${slug}/cta`),
    assertImageResponse(`${normalizedBaseUrl}/api/ig/historid/${slug}/story`),
  ]);
}

async function main() {
  const { slug, options } = parseArgs(process.argv.slice(2));

  if (!slug) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  console.log(`Verifying HistorID entry '${slug}'`);
  await verifyHistoridSlug(slug, options.baseUrl);

  console.log("HistorID routes verified. Exporting social assets to Drive.");
  await exportAssets("historid", slug, {
    baseUrl: options.baseUrl,
    driveRoot: options.driveRoot,
    skipOg: false,
    skipInstagram: false,
  });

  console.log("HistorID publish export complete.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
