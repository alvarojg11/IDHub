import { ImageResponse } from "next/og";

export const runtime = "edge";

function titleFromSlug(slug: string) {
  if (slug === "index") return "Infectious Diseases Teaching Essays";

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

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #f3f7f6 0%, #edf4f1 42%, #dcece6 100%)",
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
            boxShadow: "0 28px 80px rgba(13,30,24,0.12)",
            padding: "56px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#145c47",
                marginBottom: "22px",
              }}
            >
              IDHub Blog
            </div>

            <div
              style={{
                display: "flex",
                fontSize: title.length > 62 ? 48 : 58,
                fontWeight: 700,
                color: "#102019",
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                maxWidth: "920px",
              }}
            >
              {title}
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 24,
                color: "#465a53",
                marginTop: "28px",
                lineHeight: 1.5,
                maxWidth: "860px",
                fontStyle: "italic",
              }}
            >
              Practical reflections on diagnostics, antimicrobials, and clinical reasoning in Infectious Diseases.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 28, fontWeight: 700, color: "#102019" }}>IDHub</div>
              <div
                style={{
                  display: "flex",
                  fontSize: 12,
                  color: "#73877f",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                }}
              >
                infectiousdiseasehub.com
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "14px 22px",
                borderRadius: "999px",
                background: "#145c47",
                color: "#ffffff",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Read the full post
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "cache-control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}
