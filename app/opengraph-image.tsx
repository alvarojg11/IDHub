import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "IDHub — Infectious Diseases Education";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #f3f7f6 0%, #eaf1ef 40%, #d9ebe5 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "40px 60px",
            borderRadius: "32px",
            background: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(18,53,41,0.12)",
            boxShadow: "0 28px 80px rgba(13,30,24,0.12)",
            maxWidth: "900px",
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase" as const,
              color: "#145c47",
            }}
          >
            Clinical Learning Platform
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#102019",
              marginTop: 12,
            }}
          >
            IDHub
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#53675f",
              marginTop: 16,
              textAlign: "center" as const,
              lineHeight: 1.5,
            }}
          >
            Infectious Diseases cases, diagnostic tools, and teaching content
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: 32,
            fontSize: 15,
            color: "#73877f",
            fontWeight: 600,
          }}
        >
          <span>Cases</span>
          <span style={{ color: "#d9ebe5" }}>·</span>
          <span>Blog</span>
          <span style={{ color: "#d9ebe5" }}>·</span>
          <span>ProbID</span>
          <span style={{ color: "#d9ebe5" }}>·</span>
          <span>MechID</span>
          <span style={{ color: "#d9ebe5" }}>·</span>
          <span>DoseID</span>
          <span style={{ color: "#d9ebe5" }}>·</span>
          <span>ImmunoID</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
