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

  const title = entry?.title ?? "HistorID";
  const category = entry?.categories[0] ? HISTORID_CATEGORY_LABELS[entry.categories[0]] : "HistorID";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(160deg, #0d2b20 0%, #145c47 60%, #1a7a5e 100%)",
          padding: "90px",
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
            borderRadius: "28px",
            border: "1px solid rgba(255,255,255,0.15)",
            padding: "64px 68px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 38, fontWeight: 800, color: "#ffffff", letterSpacing: "-0.01em", marginBottom: "4px" }}>
              IDHub
            </div>
            <div style={{ display: "flex", fontSize: 14, color: "rgba(255,255,255,0.55)", fontWeight: 500, letterSpacing: "0.06em" }}>
              HISTORID
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 13, fontWeight: 700, letterSpacing: "0.16em", color: "rgba(255,255,255,0.55)", marginBottom: "16px" }}>
              {entry?.historicalDateLabel ?? "Historical"} · {category.toUpperCase()}
            </div>
            <div style={{ display: "flex", fontSize: title.length > 28 ? 56 : 68, fontWeight: 800, color: "#ffffff", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
              {title}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 24, fontWeight: 600, color: "rgba(255,255,255,0.85)", lineHeight: 1.4, marginBottom: "20px" }}>
              Read the full HistorID brief on IDHub.
            </div>
            <div
              style={{
                display: "flex",
                background: "rgba(255,255,255,0.12)",
                borderRadius: "12px",
                padding: "16px 24px",
                alignItems: "center",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <div style={{ display: "flex", fontSize: 18, fontWeight: 700, color: "#ffffff", letterSpacing: "0.01em" }}>
                infectiousdiseasehub.com/historid/{slug}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: SIZE, height: SIZE }
  );
}
