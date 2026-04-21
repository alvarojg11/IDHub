import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";

import { getBlogPosts } from "@/lib/blog/registry";

export const runtime = "nodejs";

const WIDTH = 1080;
const HEIGHT = 1350;

function normalizeText(input: string, max = 440) {
  const text = input
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}...`;
}

async function extractOpeningLines(slug: string) {
  const file = path.join(process.cwd(), "app", "blog", slug, "page.mdx");
  try {
    const raw = await fs.readFile(file, "utf8");
    const withoutExports = raw
      .replace(/export\s+const\s+\w+\s*=\s*\{[\s\S]*?\}\s*;/g, "")
      .trim();
    const blocks = withoutExports.split(/\n\s*\n/);

    for (const block of blocks) {
      const line = block.trim();
      if (line.startsWith("import ")) continue;
      if (line.startsWith("export ")) continue;
      if (line.startsWith("<")) continue;
      if (!line || line.startsWith("#") || line.startsWith("```")) continue;
      if (line.includes("dangerouslySetInnerHTML")) continue;
      const text = normalizeText(line, 360);
      if (text.length >= 40) return text;
    }
  } catch {
    return null;
  }

  return null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const posts = await getBlogPosts();
  const post = posts.find((entry) => entry.slug === slug);

  const title = post?.title ?? slug;
  const openingLines =
    (await extractOpeningLines(slug)) ??
    post?.description ??
    "Clinical reflections and practical infectious diseases reasoning.";

  const titleSize = title.length > 72 ? 64 : title.length > 42 ? 76 : 86;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(165deg, #081a14 0%, #0d2b20 35%, #145c47 100%)",
          padding: "68px",
          fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            borderRadius: "34px",
            border: "1px solid rgba(255,255,255,0.14)",
            padding: "68px 72px",
            boxShadow: "0 30px 80px rgba(0,0,0,0.18)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 18, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.18em", marginBottom: "16px" }}>
              IDHUB BLOG
            </div>
            <div style={{ display: "flex", fontSize: titleSize, fontWeight: 900, color: "#ffffff", lineHeight: 1.01, letterSpacing: "-0.035em", marginBottom: "28px", textShadow: "0 10px 26px rgba(0,0,0,0.18)" }}>
              {title}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                borderTop: "1px solid rgba(255,255,255,0.14)",
                borderBottom: "1px solid rgba(255,255,255,0.14)",
                padding: "28px 0",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.14em", marginBottom: "14px" }}>
                ON MY MIND
              </div>
              <div style={{ display: "flex", fontSize: 38, fontWeight: 500, color: "rgba(255,255,255,0.96)", lineHeight: 1.42, fontStyle: "italic", textAlign: "center", maxWidth: "100%" }}>
                &quot;{openingLines}&quot;
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.16)",
                borderRadius: "999px",
                padding: "18px 28px",
                fontSize: 24,
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: "22px",
              }}
            >
              Read the full post
            </div>
            <div style={{ display: "flex", fontSize: 30, fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "6px" }}>
              IDHub
            </div>
            <div style={{ display: "flex", fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.56)", letterSpacing: "0.08em" }}>
              infectiousdiseasehub.com/blog/{slug}
            </div>
          </div>
        </div>
      </div>
    ),
    { width: WIDTH, height: HEIGHT }
  );
}
