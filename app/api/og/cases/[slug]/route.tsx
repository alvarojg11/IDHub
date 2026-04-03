import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

import { CASES } from "@/lib/cases/registry";

export const runtime = "edge";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const caseEntry = CASES.find((c) => c.slug === params.slug);

  const title = caseEntry?.title ?? params.slug;
  const description = caseEntry?.description ?? "";
  const organisms = caseEntry?.tags?.organisms ?? [];
  const syndromes = caseEntry?.tags?.syndromes?.slice(0, 3) ?? [];

  const kicker = syndromes.join(" · ");
  const organism = organisms[0] ?? "";

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
            flexDirection: "column",
            width: "100%",
            height: "100%",
            background: "rgba(255,255,255,0.92)",
            borderRadius: "24px",
            border: "1px solid rgba(18,53,41,0.12)",
            boxShadow: "0 28px 80px rgba(13,30,24,0.12)",
            padding: "52px 56px",
            justifyContent: "space-between",
          }}
        >
          {/* Top section: kicker + title + description */}
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
                fontSize: title.length > 30 ? 52 : 62,
                fontWeight: 700,
                color: "#102019",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                maxWidth: "860px",
              }}
            >
              {title}
            </div>

            {description ? (
              <div
                style={{
                  fontSize: 22,
                  color: "#53675f",
                  marginTop: "20px",
                  lineHeight: 1.5,
                  maxWidth: "780px",
                }}
              >
                {description}
              </div>
            ) : null}
          </div>

          {/* Bottom row: organism pill + IDHub branding */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            {organism ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "rgba(20,92,71,0.08)",
                  borderRadius: "100px",
                  padding: "10px 20px",
                }}
              >
                <div
                  style={{
                    fontSize: 16,
                    fontStyle: "italic",
                    color: "#145c47",
                    fontWeight: 600,
                  }}
                >
                  {organism}
                </div>
              </div>
            ) : (
              <div />
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "2px",
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#102019",
                }}
              >
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
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
