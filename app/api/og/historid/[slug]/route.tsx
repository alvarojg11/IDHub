import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

import { HISTORID_CATEGORY_LABELS, getHistoridEntry } from "@/lib/historid/registry";

export const runtime = "nodejs";

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
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
            background: "linear-gradient(135deg, #f2f7f5 0%, #e7f0ec 44%, #d3e4dd 100%)",
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
              padding: "56px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 14, fontWeight: 700, letterSpacing: "0.14em", color: "#145c47", textTransform: "uppercase", marginBottom: "22px" }}>
                HistorID
              </div>
              <div style={{ display: "flex", fontSize: 60, fontWeight: 750, color: "#102019", lineHeight: 1.05, letterSpacing: "-0.03em", maxWidth: "820px" }}>
                The history behind infectious diseases
              </div>
              <div style={{ display: "flex", marginTop: "28px", fontSize: 24, color: "#465a53", maxWidth: "840px", lineHeight: 1.45 }}>
                Short historical teaching briefs on outbreaks, antibiotics, vaccines, organisms, and the people who changed ID.
              </div>
            </div>
            <div style={{ display: "flex", fontSize: 26, fontWeight: 700, color: "#102019" }}>IDHub · infectiousdiseasehub.com</div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const entry = await getHistoridEntry(slug);
  const title = entry?.socialHeadline ?? entry?.title ?? titleFromSlug(slug);
  const description = entry?.socialDek ?? entry?.description ?? "Historical facts related to infectious diseases.";
  const category = entry?.categories[0] ? HISTORID_CATEGORY_LABELS[entry.categories[0]] : "HistorID";
  const heroImageUrl = entry?.heroImage ? `${new URL(req.url).origin}${entry.heroImage}` : null;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #f2f7f5 0%, #e8f1ed 46%, #d4e5de 100%)",
          padding: "40px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            background: "rgba(255,255,255,0.94)",
            borderRadius: "24px",
            border: "1px solid rgba(18,53,41,0.12)",
            overflow: "hidden",
          }}
        >
          {heroImageUrl ? (
            <div style={{ display: "flex", width: "360px", height: "100%", flexShrink: 0 }}>
              <img src={heroImageUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              flex: 1,
              padding: "52px 56px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#145c47", marginBottom: "16px" }}>
                HistorID · {entry?.historicalDateLabel ?? "Historical"} · {category}
              </div>
              <div style={{ display: "flex", fontSize: title.length > 54 ? 44 : 54, fontWeight: 760, color: "#102019", lineHeight: 1.08, letterSpacing: "-0.03em", maxWidth: heroImageUrl ? "640px" : "900px" }}>
                {title}
              </div>
              <div style={{ display: "flex", marginTop: "26px", fontSize: 24, color: "#4c6058", lineHeight: 1.45, maxWidth: heroImageUrl ? "620px" : "860px" }}>
                {description}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", fontSize: 28, fontWeight: 700, color: "#102019" }}>IDHub</div>
                <div style={{ display: "flex", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "#73877f" }}>
                  infectiousdiseasehub.com
                </div>
              </div>
              <div style={{ display: "flex", padding: "14px 22px", borderRadius: "999px", background: "#145c47", color: "#ffffff", fontSize: 16, fontWeight: 700 }}>
                Read on HistorID
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
