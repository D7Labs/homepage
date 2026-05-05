import { ImageResponse } from "next/og";

// Next.js convention: this file generates the OG/Twitter image for this route
// at request time. The `<meta property="og:image">` tag is auto-wired by
// Next.js metadata; no manual openGraph.images entry needed.

export const alt = "Sermon to Devotional — turn any sermon into a 3-day devotional PDF · D7 Labs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SPACE_GROTESK_BOLD =
  "https://fonts.gstatic.com/s/spacegrotesk/v22/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj4PVksj.ttf";

export default async function Image() {
  const fontBold = await fetch(SPACE_GROTESK_BOLD).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#09090B",
          backgroundImage:
            "radial-gradient(circle at 22% 28%, rgba(14, 194, 138, 0.18) 0%, transparent 55%), radial-gradient(circle at 82% 76%, rgba(14, 194, 138, 0.10) 0%, transparent 50%)",
          padding: "64px 76px",
          fontFamily: "Space Grotesk",
        }}
      >
        {/* Header — D7 Labs mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              backgroundColor: "#0EC28A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 700,
              color: "#09090B",
            }}
          >
            D7
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: "#E4E4E7",
              letterSpacing: "-0.01em",
            }}
          >
            D7 Labs
          </div>
        </div>

        {/* Title block */}
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              color: "#FAFAFA",
              lineHeight: 1.02,
              letterSpacing: "-0.045em",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div>Sermon to</div>
            <div style={{ color: "#0EC28A" }}>Devotional.</div>
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 700,
              color: "#A1A1AA",
              lineHeight: 1.3,
              maxWidth: 920,
              letterSpacing: "-0.01em",
            }}
          >
            Turn any sermon into a scripture-grounded 3-day devotional PDF.
          </div>
        </div>

        {/* Footer — value props + URL */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 24,
            borderTop: "1px solid #27272A",
          }}
        >
          <div style={{ display: "flex", gap: 20, fontSize: 22, fontWeight: 700, color: "#D4D4D8" }}>
            <span>$2.99 per devotional</span>
            <span style={{ color: "#52525B" }}>·</span>
            <span>No subscription</span>
            <span style={{ color: "#52525B" }}>·</span>
            <span>EN + FR</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#71717A" }}>d7labs.dev</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Space Grotesk", data: fontBold, style: "normal", weight: 700 }],
    },
  );
}
