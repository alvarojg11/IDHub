import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

import { HISTORID_CATEGORY_LABELS, getHistoridEntry } from "@/lib/historid/registry";

export const runtime = "nodejs";

const SIZE = 1080;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const entry = await getHistoridEntry(slug);

  const title = entry?.socialHeadline ?? entry?.title ?? "HistorID";
  const hook = entry?.socialDek ?? entry?.hook ?? entry?.description ?? "Historical fact";
  const category = entry?.categories[0] ? HISTORID_CATEGORY_LABELS[entry.categories[0]] : "HistorID";
  const heroImageUrl = entry?.heroImage ? `${new URL(req.url).origin}${entry.heroImage}` : null;
  const imageHeight = 690;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(160deg, #0d2b20 0%, #145c47 62%, #1e7d60 100%)",
          padding: "54px",
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
            borderRadius: "34px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "#11362a",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
            <div style={{ display: "flex", width: "100%", height: `${imageHeight}px`, flexShrink: 0 }}>
              {heroImageUrl ? (
                <img src={heroImageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ display: "flex", width: "100%", height: "100%", background: "linear-gradient(160deg, #184d3c 0%, #215f49 100%)" }} />
              )}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                justifyContent: "space-between",
                padding: "30px 38px 34px",
                background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(244,249,247,0.96))",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "#145c47", textTransform: "uppercase", marginBottom: "10px" }}>
                  HistorID · {entry?.historicalDateLabel ?? "Historical"} · {category}
                </div>

                <div
                  style={{
                    display: "flex",
                    fontSize: title.length > 36 ? 40 : 48,
                    fontWeight: 780,
                    color: "#102019",
                    lineHeight: 1.05,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {title}
                </div>

                <div
                  style={{
                    display: "flex",
                    marginTop: "14px",
                    fontSize: 18,
                    color: "#465a53",
                    lineHeight: 1.4,
                  }}
                >
                  {hook}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", fontSize: 16, fontWeight: 700, color: "#145c47" }}>
                  IDHub
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "11px 16px",
                    borderRadius: "999px",
                    background: "#145c47",
                    color: "#ffffff",
                    fontSize: 13,
                    fontWeight: 800,
                  }}
                >
                  Swipe for the facts
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: SIZE, height: SIZE }
  );
}
