import { ImageResponse } from "next/og";

export const runtime = "edge";

const WIDTH = 1080;
const HEIGHT = 1350;

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const title = titleFromSlug(slug);
  const titleSize = title.length > 72 ? 64 : title.length > 42 ? 76 : 86;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(165deg, #081a14 0%, #0d2b20 35%, #145c47 100%)",
          padding: "68px",
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
            border: "1px solid rgba(255,255,255,0.14)",
            padding: "68px 72px",
            boxShadow: "0 30px 80px rgba(0,0,0,0.18)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 18,
                fontWeight: 700,
                color: "rgba(255,255,255,0.55)",
                letterSpacing: "0.18em",
                marginBottom: "16px",
              }}
            >
              IDHUB BLOG
            </div>
            <div
              style={{
                display: "flex",
                fontSize: titleSize,
                fontWeight: 900,
                color: "#ffffff",
                lineHeight: 1.01,
                letterSpacing: "-0.035em",
                marginBottom: "28px",
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                borderTop: "1px solid rgba(255,255,255,0.14)",
                borderBottom: "1px solid rgba(255,255,255,0.14)",
                padding: "28px 0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: "0.14em",
                  marginBottom: "14px",
                }}
              >
                ON MY MIND
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 38,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.96)",
                  lineHeight: 1.42,
                  fontStyle: "italic",
                }}
              >
                Practical reflections on diagnostics, antimicrobials, and clinical reasoning in Infectious Diseases.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.16)",
                borderRadius: "999px",
                padding: "18px 28px",
                fontSize: 24,
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: "22px",
              }}
            >
              Read the full post
            </div>
            <div style={{ display: "flex", fontSize: 30, fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "6px" }}>
              IDHub
            </div>
            <div style={{ display: "flex", fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.56)", letterSpacing: "0.08em" }}>
              infectiousdiseasehub.com/blog/{slug}
            </div>
          </div>
        </div>
      </div>
    ),
    { width: WIDTH, height: HEIGHT }
  );
}
