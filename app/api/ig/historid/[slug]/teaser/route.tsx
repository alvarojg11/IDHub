import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

import { HISTORID_CATEGORY_LABELS, getHistoridEntry } from "@/lib/historid/registry";

export const runtime = "nodejs";

const SIZE = 1080;

function firstSentence(input: string) {
  const match = input.match(/^.*?[.!?](?:\s|$)/);
  return match ? match[0].trim() : input;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const entry = await getHistoridEntry(slug);

  const title = entry?.socialHeadline ?? entry?.title ?? "HistorID";
  const hook = firstSentence(entry?.socialDek ?? entry?.hook ?? entry?.description ?? "Historical fact");
  const category = entry?.categories[0] ? HISTORID_CATEGORY_LABELS[entry.categories[0]] : "HistorID";
  const heroImageUrl = entry?.heroImage ? `${new URL(req.url).origin}${entry.heroImage}` : null;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(160deg, #f2f7f5 0%, #e7f0ec 48%, #d5e4dd 100%)",
          padding: "58px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            background: "rgba(255,255,255,0.95)",
            borderRadius: "30px",
            border: "1px solid rgba(18,53,41,0.12)",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", minHeight: "560px", width: "100%" }}>
            {heroImageUrl ? (
              <img src={heroImageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ display: "flex", width: "100%", height: "100%", background: "#dbe8e3" }} />
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "34px 44px 40px" }}>
            <div style={{ display: "flex", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: "#145c47", textTransform: "uppercase", marginBottom: "14px" }}>
              Image Card · {entry?.historicalDateLabel ?? "Historical"} · {category}
            </div>
            <div style={{ display: "flex", fontSize: title.length > 42 ? 44 : 54, fontWeight: 760, color: "#102019", lineHeight: 1.06, letterSpacing: "-0.03em" }}>
              {title}
            </div>
            <div style={{ display: "flex", marginTop: "16px", fontSize: 24, color: "#102019", lineHeight: 1.45, fontWeight: 600 }}>
              {hook}
            </div>

            <div style={{ display: "flex", marginTop: "auto", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", fontSize: 18, fontWeight: 700, color: "#145c47" }}>HistorID</div>
              <div style={{ display: "flex", padding: "12px 18px", borderRadius: "999px", background: "#145c47", color: "#ffffff", fontSize: 15, fontWeight: 700 }}>
                Read on IDHub
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: SIZE, height: SIZE }
  );
}
