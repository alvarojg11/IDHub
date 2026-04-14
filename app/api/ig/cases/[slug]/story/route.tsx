import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";

import { CASES } from "@/lib/cases/registry";

export const runtime = "nodejs";

const W = 1080;
const H = 1920;

function normalizeText(input: string, max = 500) {
  const text = input
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}...`;
}

async function extractPreview(slug: string) {
  const file = path.join(process.cwd(), "app", "cases", slug, "page.mdx");
  try {
    const raw = await fs.readFile(file, "utf8");
    // Collect all <p> blocks before the first <CaseQuestion
    const beforeQuestions = raw.split(/<CaseQuestion/i)[0];
    const paragraphMatches = [...beforeQuestions.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
    const paragraphs = paragraphMatches
      .map((m) => normalizeText(m[1], 9999))
      .filter((t) => t.length > 20);
    const questionMatch = raw.match(/<CaseQuestion[\s\S]*?prompt="([^"]+)"/i);
    return {
      paragraphs,
      firstQuestion: questionMatch ? normalizeText(questionMatch[1], 180) : null,
    };
  } catch {
    return { paragraphs: [], firstQuestion: null };
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const caseEntry = CASES.find((c) => c.slug === slug);

  const title = caseEntry?.title ?? slug;
  const syndromes = caseEntry?.tags?.syndromes?.slice(0, 3) ?? [];
  const kicker = syndromes.join(" · ");

  const ogImage = caseEntry?.ogImage;
  const imageUrl = ogImage ? `${new URL(req.url).origin}${ogImage}` : null;
  const hasImage = Boolean(imageUrl);

  const { paragraphs, firstQuestion } = await extractPreview(slug);

  // Layout constants
  const OUTER_PAD = 72;
  const IMAGE_H = hasImage ? 680 : 0;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(175deg, #0d2b20 0%, #145c47 55%, #1a7a5e 100%)",
          padding: `${OUTER_PAD}px`,
          fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            background: "#ffffff",
            borderRadius: "36px",
            border: "1px solid rgba(255,255,255,0.15)",
            overflow: "hidden",
          }}
        >
          {/* Clinical image */}
          {hasImage ? (
            <div
              style={{
                display: "flex",
                width: "100%",
                height: `${IMAGE_H}px`,
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              <img
                src={imageUrl!}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ) : null}

          {/* Content panel */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              padding: "52px 60px 48px",
            }}
          >
            {/* Kicker */}
            {kicker ? (
              <div
                style={{
                  display: "flex",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: "#145c47",
                  marginBottom: "16px",
                }}
              >
                {kicker.toUpperCase()}
              </div>
            ) : null}

            {/* Title */}
            <div
              style={{
                display: "flex",
                fontSize: title.length > 22 ? 62 : 76,
                fontWeight: 800,
                color: "#102019",
                lineHeight: 1.05,
                letterSpacing: "-0.022em",
                marginBottom: "36px",
              }}
            >
              {title}
            </div>

            {/* Divider */}
            <div
              style={{
                display: "flex",
                width: "64px",
                height: "4px",
                background: "#145c47",
                borderRadius: "2px",
                marginBottom: "36px",
              }}
            />

            {/* Combined box: full vignette + question */}
            {(paragraphs.length > 0 || firstQuestion) ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "#f3f7f6",
                  borderRadius: "20px",
                  border: "1px solid #dde5e2",
                  padding: "32px 36px",
                  flexGrow: 1,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    color: "#145c47",
                    marginBottom: "20px",
                  }}
                >
                  WHAT'S THE DIAGNOSIS?
                </div>

                {/* All vignette paragraphs */}
                {paragraphs.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      fontSize: 19,
                      color: "#3d5249",
                      lineHeight: 1.6,
                      fontWeight: 400,
                      marginBottom: "16px",
                    }}
                  >
                    {p}
                  </div>
                ))}

                {/* First question */}
                {firstQuestion ? (
                  <div
                    style={{
                      display: "flex",
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#102019",
                      lineHeight: 1.45,
                      marginTop: "8px",
                    }}
                  >
                    {firstQuestion}
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Footer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "36px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#145c47",
                  marginRight: "10px",
                }}
              >
                IDHub
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 15,
                  color: "#73877f",
                  fontWeight: 500,
                }}
              >
                · infectiousdiseasehub.com/cases/{slug}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: W, height: H }
  );
}
