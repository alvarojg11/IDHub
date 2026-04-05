import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

import { CASES } from "@/lib/cases/registry";

export const runtime = "edge";

const SIZE = 1080;

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
    ? `${new URL(req.url).origin}${ogImage}`
    : null;

  const hasImage = Boolean(imageUrl);
  const imageHeight = Math.round(SIZE * 0.42);
  const textHeight = SIZE - imageHeight - 120; // 120 = outer padding * 2

  const textPanelStyle = hasImage
    ? { height: `${textHeight}px`, flexGrow: 0, flexShrink: 0, padding: "44px 56px 36px" }
    : { flexGrow: 1, flexShrink: 1, padding: "72px 64px" };

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(160deg, #f3f7f6 0%, #eaf1ef 50%, #d9ebe5 100%)",
          padding: "90px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            background: "rgba(255,255,255,0.93)",
            borderRadius: "28px",
            border: "1px solid rgba(18,53,41,0.12)",
            boxShadow: "0 32px 80px rgba(13,30,24,0.14)",
            overflow: "hidden",
          }}
        >
          {/* Text panel */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              ...textPanelStyle,
            }}
          >
            {kicker ? (
              <div
                style={{
                  display: "flex",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: "#145c47",
                  marginBottom: "20px",
                }}
              >
                {kicker.toUpperCase()}
              </div>
            ) : null}

            <div
              style={{
                display: "flex",
                fontSize: title.length > 28 ? (hasImage ? 54 : 68) : (hasImage ? 64 : 84),
                fontWeight: 700,
                color: "#102019",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </div>

            {/* Description — only shown when no image */}
            {!hasImage && description ? (
              <div
                style={{
                  display: "flex",
                  fontSize: 28,
                  color: "#53675f",
                  lineHeight: 1.55,
                  marginTop: "28px",
                  fontWeight: 400,
                }}
              >
                {description}
              </div>
            ) : null}

            {/* IDHub branding */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "32px",
              }}
            >
              <div style={{ display: "flex", fontSize: 18, fontWeight: 700, color: "#145c47", marginRight: "8px" }}>
                IDHub
              </div>
              <div style={{ display: "flex", fontSize: 14, color: "#73877f", fontWeight: 500 }}>
                · infectiousdiseasehub.com
              </div>
            </div>
          </div>

          {/* Clinical image — bottom */}
          {hasImage ? (
            <div
              style={{
                display: "flex",
                width: "100%",
                height: `${imageHeight}px`,
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
    { width: SIZE, height: SIZE }
  );
}
