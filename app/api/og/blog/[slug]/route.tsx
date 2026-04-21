import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";

import { getBlogPosts } from "@/lib/blog/registry";

export const runtime = "edge";

function normalizeText(input: string, max = 260) {
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

async function getOpeningLines(slug: string) {
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
      const text = normalizeText(line);
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
  if (slug === "index") {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #f3f7f6 0%, #edf4f1 42%, #dcece6 100%)",
            padding: "48px",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%",
              height: "100%",
              background: "rgba(255,255,255,0.94)",
              borderRadius: "24px",
              border: "1px solid rgba(18,53,41,0.12)",
              boxShadow: "0 28px 80px rgba(13,30,24,0.12)",
              padding: "56px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#145c47",
                  marginBottom: "22px",
                }}
              >
                IDHub Blog
              </div>

              <div
                style={{
                  fontSize: 58,
                  fontWeight: 700,
                  color: "#102019",
                  lineHeight: 1.08,
                  letterSpacing: "-0.03em",
                  maxWidth: "920px",
                }}
              >
                Infectious Diseases Teaching Essays
              </div>

              <div
                style={{
                  fontSize: 24,
                  color: "#465a53",
                  marginTop: "28px",
                  lineHeight: 1.5,
                  maxWidth: "860px",
                  fontStyle: "italic",
                }}
              >
                Practical reflections on diagnostics, antimicrobials, and clinical reasoning in Infectious Diseases.
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#102019" }}>IDHub</div>
              <div
                style={{
                  fontSize: 12,
                  color: "#73877f",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                }}
              >
                infectiousdiseasehub.com
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "cache-control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
        },
      }
    );
  }

  const posts = await getBlogPosts();
  const post = posts.find((entry) => entry.slug === slug);

  const title = post?.title ?? slug;
  const description =
    (await getOpeningLines(slug)) ??
    post?.description ??
    "Clinical reflections and practical infectious diseases reasoning.";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #f3f7f6 0%, #edf4f1 42%, #dcece6 100%)",
          padding: "48px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            background: "rgba(255,255,255,0.94)",
            borderRadius: "24px",
            border: "1px solid rgba(18,53,41,0.12)",
            boxShadow: "0 28px 80px rgba(13,30,24,0.12)",
            padding: "56px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#145c47",
                marginBottom: "22px",
              }}
            >
              IDHub Blog
            </div>

            <div
              style={{
                fontSize: title.length > 62 ? 48 : 58,
                fontWeight: 700,
                color: "#102019",
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                maxWidth: "920px",
              }}
            >
              {title}
            </div>

            <div
              style={{
                fontSize: 24,
                color: "#465a53",
                marginTop: "28px",
                lineHeight: 1.5,
                maxWidth: "860px",
                fontStyle: "italic",
                textAlign: "center",
                alignSelf: "center",
              }}
            >
              &quot;{description}&quot;
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#102019" }}>IDHub</div>
              <div
                style={{
                  fontSize: 12,
                  color: "#73877f",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                }}
              >
                infectiousdiseasehub.com
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "14px 22px",
                borderRadius: "999px",
                background: "#145c47",
                color: "#ffffff",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Read the full post
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "cache-control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}
