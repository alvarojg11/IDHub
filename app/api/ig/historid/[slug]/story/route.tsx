import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

import { HISTORID_CATEGORY_LABELS, getHistoridEntry } from "@/lib/historid/registry";

export const runtime = "nodejs";

const W = 1080;
const H = 1920;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const entry = await getHistoridEntry(slug);

  const title = entry?.socialHeadline ?? entry?.title ?? "HistorID";
  const hook = entry?.hook ?? entry?.description ?? "Historical fact";
  const takeaway = entry?.takeaway ?? "Read the full historical brief on IDHub.";
  const category = entry?.categories[0] ? HISTORID_CATEGORY_LABELS[entry.categories[0]] : "HistorID";
  const heroImageUrl = entry?.heroImage ? `${new URL(req.url).origin}${entry.heroImage}` : null;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(180deg, #0d2b20 0%, #145c47 55%, #1a7a5e 100%)",
          padding: "68px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            background: "rgba(255,255,255,0.96)",
            borderRadius: "34px",
            overflow: "hidden",
          }}
        >
          {heroImageUrl ? (
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "760px",
                flexShrink: 0,
                padding: "28px",
                background: "#e7efeb",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "26px",
                  overflow: "hidden",
                  background: "#f8fbf9",
                }}
              >
                <img
                  src={heroImageUrl}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    objectPosition: "center center",
                  }}
                />
              </div>
            </div>
          ) : null}

          <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "48px 56px 52px" }}>
            <div style={{ display: "flex", fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", color: "#145c47", textTransform: "uppercase", marginBottom: "18px" }}>
              HistorID · {entry?.historicalDateLabel ?? "Historical"} · {category}
            </div>
            <div style={{ display: "flex", fontSize: title.length > 38 ? 58 : 72, fontWeight: 780, color: "#102019", lineHeight: 1.03, letterSpacing: "-0.03em" }}>
              {title}
            </div>
            <div style={{ display: "flex", marginTop: "24px", fontSize: 26, color: "#3f544c", lineHeight: 1.5 }}>
              {hook}
            </div>
            <div style={{ display: "flex", marginTop: "22px", padding: "24px 28px", borderRadius: "22px", background: "#f1f6f4", border: "1px solid #dde5e2", fontSize: 24, color: "#102019", lineHeight: 1.5 }}>
              {takeaway}
            </div>

            <div style={{ display: "flex", marginTop: "auto", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", fontSize: 22, fontWeight: 800, color: "#145c47" }}>IDHub</div>
              <div style={{ display: "flex", fontSize: 18, fontWeight: 700, color: "#73877f" }}>
                infectiousdiseasehub.com/historid/{slug}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: W, height: H }
  );
}
