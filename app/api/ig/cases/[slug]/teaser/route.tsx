import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";

import { CASES } from "@/lib/cases/registry";

export const runtime = "nodejs";

const SIZE = 1080;

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
    const firstParagraphMatch = raw.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const firstQuestionMatch = raw.match(/<CaseQuestion[\s\S]*?prompt="([^"]+)"/i);
    return {
      summary: firstParagraphMatch ? normalizeText(firstParagraphMatch[1], 400) : null,
      firstQuestion: firstQuestionMatch ? normalizeText(firstQuestionMatch[1], 200) : null,
    };
  } catch {
    return { summary: null, firstQuestion: null };
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

  const { summary, firstQuestion } = await extractPreview(slug);

  // When image is present, tighten text to leave room for it
  const headerPadding = hasImage ? "32px 52px 20px" : "48px 52px 28px";
  const bodyPadding = hasImage ? "20px 52px 20px" : "28px 52px 32px";
  const titleSize = title.length > 28 ? (hasImage ? 44 : 52) : (hasImage ? 52 : 62);
  const textSize = hasImage ? 19 : 22;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#f3f7f6",
          padding: "90px",
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
            borderRadius: "24px",
            border: "1px solid #dde5e2",
            boxShadow: "0 18px 40px rgba(13,30,24,0.08)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: headerPadding,
              borderBottom: "1px solid #f0f4f2",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 11,
                fontWeight: 700,
                color: "#145c47",
                letterSpacing: "0.12em",
                marginBottom: "12px",
              }}
            >
              {kicker ? `NEW CASE · ${kicker.toUpperCase()}` : "NEW CASE"}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: titleSize,
                fontWeight: 800,
                color: "#102019",
                lineHeight: 1.08,
                letterSpacing: "-0.022em",
              }}
            >
              {title}
            </div>
          </div>

          {/* Body */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: hasImage ? 0 : 1,
              flexShrink: 0,
              padding: bodyPadding,
            }}
          >
            {summary ? (
              <div
                style={{
                  display: "flex",
                  fontSize: textSize,
                  lineHeight: 1.65,
                  color: "#102019",
                  marginBottom: "16px",
                }}
              >
                {summary}
              </div>
            ) : null}

            {firstQuestion ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid #dde5e2",
                  borderRadius: "14px",
                  background: "#f3f7f6",
                  padding: "16px 20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#145c47",
                    letterSpacing: "0.12em",
                    marginBottom: "6px",
                  }}
                >
                  FIRST QUESTION
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: textSize,
                    fontWeight: 600,
                    color: "#102019",
                    lineHeight: 1.5,
                  }}
                >
                  {firstQuestion}
                </div>
              </div>
            ) : null}
          </div>

          {/* Clinical image */}
          {hasImage ? (
            <div
              style={{
                display: "flex",
                width: "100%",
                flexGrow: 1,
                flexShrink: 1,
                overflow: "hidden",
              }}
            >
              <img
                src={imageUrl!}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ) : null}

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "16px 52px",
              borderTop: "1px solid #f0f4f2",
            }}
          >
            <div style={{ display: "flex", fontSize: 16, fontWeight: 700, color: "#145c47", marginRight: "8px" }}>
              IDHub
            </div>
            <div style={{ display: "flex", fontSize: 13, color: "#73877f", fontWeight: 500 }}>
              · infectiousdiseasehub.com
            </div>
          </div>
        </div>
      </div>
    ),
    { width: SIZE, height: SIZE }
  );
}
