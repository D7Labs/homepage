import { ImageResponse } from "next/og";

// Default OG image for the site.

export const alt = "D7 Labs — Independent product studio";
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
            "radial-gradient(circle at 25% 30%, rgba(14, 194, 138, 0.20) 0%, transparent 55%), radial-gradient(circle at 80% 75%, rgba(14, 194, 138, 0.10) 0%, transparent 50%)",
          padding: "72px 80px",
          fontFamily: "Space Grotesk",
        }}
      >
        {/* D7 mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 18,
              backgroundColor: "#0EC28A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 700,
              color: "#09090B",
            }}
          >
            D7
          </div>
          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: "#E4E4E7",
              letterSpacing: "-0.01em",
            }}
          >
            D7 Labs
          </div>
        </div>

        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 102,
              fontWeight: 700,
              color: "#FAFAFA",
              lineHeight: 1.02,
              letterSpacing: "-0.045em",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex" }}>We build</div>
            <div style={{ display: "flex", gap: "0.28em" }}>
              <span style={{ color: "#0EC28A" }}>AI-powered</span>
              <span>products.</span>
            </div>
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 700,
              color: "#A1A1AA",
              lineHeight: 1.3,
              maxWidth: 940,
              letterSpacing: "-0.01em",
            }}
          >
            An independent studio that designs, builds, and ships its own software products.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 24,
            borderTop: "1px solid #27272A",
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 700, color: "#D4D4D8" }}>
            Ezra Studio · Chant d&apos;Espérance
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
