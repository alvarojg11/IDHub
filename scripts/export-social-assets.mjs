import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const DEFAULT_BASE_URL = process.env.IDHUB_EXPORT_BASE_URL ?? "http://localhost:3000";
export const DEFAULT_DRIVE_ROOT =
  process.env.IDHUB_MEDIA_DRIVE_ROOT ??
  "/Users/alvaroayala/Library/CloudStorage/GoogleDrive-alvaro.ayala@infectiousdiseasehub.com/My Drive/Media";

const CONTENT_CONFIG = {
  case: {
    aliases: ["case", "cases"],
    instagramDir: (root, slug) => path.join(root, "Instagram", slug),
    ogDir: (root, slug) => path.join(root, "OG", slug),
    instagramAssets: (slug) => [
      { route: `/api/ig/cases/${slug}`, fileName: "hook.png" },
      { route: `/api/ig/cases/${slug}/teaser`, fileName: "teaser.png" },
      { route: `/api/ig/cases/${slug}/story`, fileName: "story.png" },
      { route: `/api/ig/cases/${slug}/teaching`, fileName: "teaching.png" },
      { route: `/api/ig/cases/${slug}/cta`, fileName: "cta.png" },
    ],
    ogAssets: (slug) => [{ route: `/api/og/cases/${slug}`, fileName: "og.png" }],
  },
  historid: {
    aliases: ["historid"],
    instagramDir: (root, slug) => path.join(root, "Instagram", "HistorID", slug),
    ogDir: (root, slug) => path.join(root, "OG", "HistorID", slug),
    instagramAssets: (slug) => [
      { route: `/api/ig/historid/${slug}`, fileName: "hook.png" },
      { route: `/api/ig/historid/${slug}/teaser`, fileName: "teaser.png" },
      { route: `/api/ig/historid/${slug}/teaching`, fileName: "teaching.png" },
      { route: `/api/ig/historid/${slug}/cta`, fileName: "cta.png" },
      { route: `/api/ig/historid/${slug}/story`, fileName: "story.png" },
    ],
    ogAssets: (slug) => [{ route: `/api/og/historid/${slug}`, fileName: "og.png" }],
  },
  blog: {
    aliases: ["blog", "blogs"],
    instagramDir: (root) => path.join(root, "Instagram", "Blog"),
    ogDir: (root) => path.join(root, "OG", "Blog"),
    instagramAssets: (slug) => [{ route: `/api/ig/blog/${slug}`, fileName: `${slug}.png` }],
    ogAssets: (slug) => [{ route: `/api/og/blog/${slug}`, fileName: `${slug}.png` }],
  },
};

function printUsage() {
  console.log(`Usage: npm run export:social -- <case|historid|blog> <slug> [--base-url=http://localhost:3000] [--drive-root="/path/to/Media"] [--skip-og] [--skip-instagram]\n`);
  console.log("Examples:");
  console.log("  npm run export:social -- case ptld-heart-transplant");
  console.log("  npm run export:social -- historid pasteurs-rabies-gamble");
  console.log("  npm run export:social -- blog dont-treat-the-scan");
}

function normalizeKind(input) {
  const normalized = input?.trim().toLowerCase();
  if (!normalized) return null;

  return (
    Object.entries(CONTENT_CONFIG).find(([, config]) => config.aliases.includes(normalized))?.[0] ?? null
  );
}

export function parseArgs(argv) {
  const positionals = [];
  const options = {
    baseUrl: DEFAULT_BASE_URL,
    driveRoot: DEFAULT_DRIVE_ROOT,
    skipOg: false,
    skipInstagram: false,
  };

  for (const arg of argv) {
    if (!arg.startsWith("--")) {
      positionals.push(arg);
      continue;
    }

    if (arg === "--skip-og") {
      options.skipOg = true;
      continue;
    }

    if (arg === "--skip-instagram") {
      options.skipInstagram = true;
      continue;
    }

    if (arg.startsWith("--base-url=")) {
      options.baseUrl = arg.slice("--base-url=".length).replace(/\/+$/, "");
      continue;
    }

    if (arg.startsWith("--drive-root=")) {
      options.driveRoot = arg.slice("--drive-root=".length);
      continue;
    }
  }

  return {
    kind: normalizeKind(positionals[0]),
    slug: positionals[1],
    options,
  };
}

async function downloadImage(url) {
  let response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new Error(`Failed to reach ${url}. Start IDHub locally or pass --base-url.\n${error}`);
  }

  if (!response.ok) {
    throw new Error(`Request failed for ${url} (${response.status} ${response.statusText}).`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/")) {
    throw new Error(`Expected an image from ${url}, received '${contentType || "unknown"}'.`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function exportAsset(baseUrl, outputDir, asset) {
  const url = `${baseUrl}${asset.route}`;
  const destination = path.join(outputDir, asset.fileName);
  const buffer = await downloadImage(url);

  await writeFile(destination, buffer);
  console.log(`Saved ${destination}`);
}

export async function exportAssets(kind, slug, options) {
  const config = CONTENT_CONFIG[kind];
  const baseUrl = options.baseUrl.replace(/\/+$/, "");
  const driveRoot = options.driveRoot ?? DEFAULT_DRIVE_ROOT;

  if (!options.skipInstagram) {
    const instagramDir = config.instagramDir(driveRoot, slug);
    await mkdir(instagramDir, { recursive: true });
    for (const asset of config.instagramAssets(slug)) {
      await exportAsset(baseUrl, instagramDir, asset);
    }
  }

  if (!options.skipOg) {
    const ogDir = config.ogDir(driveRoot, slug);
    await mkdir(ogDir, { recursive: true });
    for (const asset of config.ogAssets(slug)) {
      await exportAsset(baseUrl, ogDir, asset);
    }
  }
}

export async function main(argv = process.argv.slice(2)) {
  const { kind, slug, options } = parseArgs(argv);

  if (!kind || !slug) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  console.log(`Exporting ${kind} assets for '${slug}' from ${options.baseUrl}`);
  console.log(`Drive root: ${options.driveRoot}`);

  await exportAssets(kind, slug, options);

  console.log("Export complete.");
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
