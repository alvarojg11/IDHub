import { ImageResponse } from "next/og";

export const runtime = "edge";

const SIZE = 1080;

const FEATURES = [
  { label: "Cases", detail: "Board-style interactive clinical reasoning" },
  { label: "Tools", detail: "ProbID · MechID · ImmunoID · DoseID" },
  { label: "Blog", detail: "An ID perspective on clinical topics" },
  { label: "Research", detail: "Interested in EUT in Infectious Diseases" },
  { label: "Collaborate", detail: "Open to ideas and partnerships" },
];

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(160deg, #0d2b20 0%, #145c47 65%, #1a7a5e 100%)",
          fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          padding: "90px",
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
            padding: "68px 76px",
          }}
        >
          {/* Wordmark — sits at the top */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 60, fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "6px" }}>
              IDHub
            </div>
            <div style={{ display: "flex", fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.45)", letterSpacing: "0.14em" }}>
              INFECTIOUSDISEASEHUB.COM
            </div>
          </div>

          {/* Headline + list — grouped at the bottom */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.14em", marginBottom: "18px" }}>
              INFECTIOUS DISEASES · EDUCATION · RESEARCH
            </div>
            <div style={{ display: "flex", fontSize: 52, fontWeight: 800, color: "#ffffff", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "16px" }}>
              Where ID education, research, and collaboration come together.
            </div>
            <div style={{ display: "flex", fontSize: 22, color: "rgba(255,255,255,0.6)", lineHeight: 1.55, marginBottom: "80px" }}>
              A platform for clinicians, trainees, and educators.
            </div>

            {/* Feature list */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {FEATURES.map((f, i) => (
                <div
                  key={f.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    paddingTop: i === 0 ? "0" : "13px",
                    paddingBottom: "13px",
                    borderBottom: i < FEATURES.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
                  }}
                >
                  <div style={{ display: "flex", width: "6px", height: "6px", borderRadius: "50%", background: "rgba(255,255,255,0.5)", marginRight: "20px", flexShrink: 0 }} />
                  <div style={{ display: "flex", fontSize: 24, fontWeight: 700, color: "#ffffff", width: "160px", flexShrink: 0, marginRight: "16px" }}>
                    {f.label}
                  </div>
                  <div style={{ display: "flex", fontSize: 24, color: "rgba(255,255,255,0.55)", fontWeight: 400 }}>
                    {f.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    { width: SIZE, height: SIZE }
  );
}
