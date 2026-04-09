import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

import { CASES } from "@/lib/cases/registry";

export const runtime = "edge";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const caseEntry = CASES.find((c) => c.slug === slug);

  const title = caseEntry?.title ?? slug;
  const description = caseEntry?.description ?? "";
  const syndromes = caseEntry?.tags?.syndromes?.slice(0, 3) ?? [];
  const kicker = syndromes.join(" · ");

  const ogImage = caseEntry?.ogImage;
  const imageUrl = ogImage
    ? `https://infectiousdiseasehub.com${ogImage}`
    : null;

  const hasImage = Boolean(imageUrl);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #f3f7f6 0%, #eaf1ef 40%, #d9ebe5 100%)",
          padding: "48px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: "100%",
            background: "rgba(255,255,255,0.92)",
            borderRadius: "24px",
            border: "1px solid rgba(18,53,41,0.12)",
            boxShadow: "0 28px 80px rgba(13,30,24,0.12)",
            overflow: "hidden",
          }}
        >
          {/* Left: text */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              flex: 1,
              padding: "52px 56px",
            }}
          >
            {/* Top: kicker + title + description */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {kicker ? (
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase" as const,
                    color: "#145c47",
                    marginBottom: "20px",
                  }}
                >
                  {kicker}
                </div>
              ) : null}

              <div
                style={{
                  fontSize: title.length > 30 ? 48 : 58,
                  fontWeight: 700,
                  color: "#102019",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  maxWidth: hasImage ? "560px" : "860px",
                }}
              >
                {title}
              </div>

              {description ? (
                <div
                  style={{
                    fontSize: 20,
                    color: "#53675f",
                    marginTop: "20px",
                    lineHeight: 1.5,
                    maxWidth: hasImage ? "520px" : "780px",
                  }}
                >
                  {description}
                </div>
              ) : null}
            </div>

            {/* Bottom: IDHub branding */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              <div style={{ fontSize: 26, fontWeight: 700, color: "#102019" }}>
                IDHub
              </div>
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

          {/* Right: case image */}
          {hasImage ? (
            <div
              style={{
                display: "flex",
                width: "340px",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              <img
                src={imageUrl!}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          ) : null}
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
