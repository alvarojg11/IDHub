import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";

import { CASES } from "@/lib/cases/registry";

export const runtime = "nodejs";

const SIZE = 1080;

function stripHtml(input: string) {
  return input
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

async function extractTeachingPoints(slug: string): Promise<string[]> {
  const file = path.join(process.cwd(), "app", "cases", slug, "page.mdx");
  try {
    const raw = await fs.readFile(file, "utf8");

    const sectionHeadings = [/Teaching Points/i, /Pathogen Notes/i];

    for (const heading of sectionHeadings) {
      const sectionIdx = raw.search(heading);
      if (sectionIdx === -1) continue;

      // Limit extraction to the current reveal block so we only pull the
      // intended bullets for this card.
      const sectionEndIdx = raw.indexOf("</CaseReveal>", sectionIdx);
      const section = raw.slice(
        sectionIdx,
        sectionEndIdx === -1 ? raw.length : sectionEndIdx
      );

      const liMatches = [...section.matchAll(/<li>([\s\S]*?)<\/li>/gi)];
      const points = liMatches
        .map((m) => stripHtml(m[1]))
        .filter((t) => t.length > 10)
        .slice(0, 4);

      if (points.length > 0) return points;
    }

    return [];
  } catch {
    return [];
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

  const points = await extractTeachingPoints(slug);

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
              padding: "40px 52px 24px",
              borderBottom: "1px solid #f0f4f2",
            }}
          >
            <div style={{ display: "flex", fontSize: 11, fontWeight: 700, color: "#145c47", letterSpacing: "0.12em", marginBottom: "12px" }}>
              {kicker ? `TEACHING POINTS · ${kicker.toUpperCase()}` : "TEACHING POINTS"}
            </div>
            <div style={{ display: "flex", fontSize: title.length > 28 ? 44 : 52, fontWeight: 800, color: "#102019", lineHeight: 1.08, letterSpacing: "-0.022em" }}>
              {title}
            </div>
          </div>

          {/* Teaching points list */}
          <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, flexShrink: 1, padding: "24px 52px 28px" }}>
            {points.map((point, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  paddingTop: i === 0 ? "0" : "16px",
                  paddingBottom: "16px",
                  borderBottom: i < points.length - 1 ? "1px solid #f0f4f2" : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    background: "#145c47",
                    flexShrink: 0,
                    marginRight: "18px",
                    marginTop: "2px",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#ffffff",
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ display: "flex", fontSize: 19, color: "#102019", lineHeight: 1.55, fontWeight: 400 }}>
                  {point}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ display: "flex", alignItems: "center", padding: "16px 52px", borderTop: "1px solid #f0f4f2" }}>
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
