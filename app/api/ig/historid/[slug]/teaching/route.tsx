import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

import { HISTORID_CATEGORY_LABELS, getHistoridEntry } from "@/lib/historid/registry";

export const runtime = "nodejs";

const SIZE = 1080;

function buildFallbackFacts(
  entry: Awaited<ReturnType<typeof getHistoridEntry>>,
  category: string
) {
  return [
    entry?.historicalDateLabel ? `This story is anchored in ${entry.historicalDateLabel}.` : null,
    category && category !== "HistorID" ? `It sits at the intersection of ${category.toLowerCase()} and clinical history.` : null,
    entry?.tags?.[0] ? `A key term in this story is ${entry.tags[0]}.` : null,
    entry?.takeaway ?? null,
  ].filter(Boolean);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const entry = await getHistoridEntry(slug);

  const title = entry?.socialHeadline ?? entry?.title ?? "HistorID";
  const category = entry?.categories[0] ? HISTORID_CATEGORY_LABELS[entry.categories[0]] : "HistorID";
  const facts = (entry?.socialFacts?.length ? entry.socialFacts : buildFallbackFacts(entry, category)).slice(0, 5);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(160deg, #f3f7f6 0%, #e7efeb 50%, #dbe8e3 100%)",
          padding: "72px",
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
            borderRadius: "28px",
            border: "1px solid rgba(18,53,41,0.12)",
            boxShadow: "0 22px 54px rgba(13,30,24,0.10)",
            padding: "48px 52px 46px",
          }}
        >
          <div style={{ display: "flex", fontSize: 12, fontWeight: 700, letterSpacing: "0.16em", color: "#145c47", textTransform: "uppercase", marginBottom: "16px" }}>
            Fun Facts · {entry?.historicalDateLabel ?? "Historical"} · {category}
          </div>

          <div style={{ display: "flex", fontSize: 34, fontWeight: 740, color: "#102019", lineHeight: 1.12, letterSpacing: "-0.02em", marginBottom: "22px" }}>
            {title}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              justifyContent: "space-between",
              padding: "30px 32px",
              borderRadius: "24px",
              background: "linear-gradient(180deg, rgba(234,241,239,0.92), rgba(244,249,247,0.94))",
              border: "1px solid rgba(18,53,41,0.10)",
            }}
          >
            {facts.map((fact, index) => (
              <div
                key={fact}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  paddingTop: index === 0 ? "0" : "12px",
                  paddingBottom: index < facts.length - 1 ? "12px" : "0",
                  borderBottom: index < facts.length - 1 ? "1px solid rgba(18,53,41,0.08)" : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: "28px",
                    height: "28px",
                    borderRadius: "999px",
                    background: "#145c47",
                    color: "#ffffff",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    marginRight: "16px",
                    marginTop: "2px",
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </div>
                <div style={{ display: "flex", fontSize: 22, fontWeight: 560, color: "#102019", lineHeight: 1.45 }}>
                  {fact}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", marginTop: "28px", alignItems: "center" }}>
            <div style={{ display: "flex", fontSize: 18, fontWeight: 700, color: "#145c47" }}>HistorID</div>
          </div>
        </div>
      </div>
    ),
    { width: SIZE, height: SIZE }
  );
}
