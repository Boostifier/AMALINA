import { ImageResponse } from "next/og";

// Preview image shown when the site link is shared (WhatsApp, Facebook, X, etc.).
// Gradient + wordmark only (no photo) so the file stays tiny and unfurls everywhere.
export const alt = "Amalina Market — Soins Capillaires";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background:
            "linear-gradient(120deg, #f7ede9 0%, #f4ddd8 30%, #e9b9b5 58%, #d99ca0 100%)",
        }}
      >
        {/* Soft rose-gold glow, top-right */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -160,
            width: 560,
            height: 560,
            borderRadius: "9999px",
            background: "rgba(156,88,98,0.28)",
          }}
        />
        {/* Soft glow, bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: -140,
            width: 520,
            height: 520,
            borderRadius: "9999px",
            background: "rgba(217,156,160,0.30)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
            padding: "0 90px",
            color: "#3b2f2c",
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 24,
              letterSpacing: 10,
              textTransform: "uppercase",
              color: "#9c5862",
              fontWeight: 600,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "9999px",
                background: "#9c5862",
                marginRight: 18,
              }}
            />
            Soins authentiques
          </div>

          {/* Wordmark */}
          <div
            style={{
              marginTop: 26,
              fontSize: 132,
              fontWeight: 700,
              letterSpacing: 10,
              lineHeight: 1,
              fontFamily: "Georgia, 'Times New Roman', serif",
              color: "#7d3f48",
            }}
          >
            AMALINA
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 40,
              letterSpacing: 18,
              textTransform: "uppercase",
              color: "#9c5862",
            }}
          >
            Market
          </div>

          {/* Tagline */}
          <div
            style={{
              marginTop: 36,
              fontSize: 34,
              maxWidth: 720,
              lineHeight: 1.35,
              color: "#5a4a45",
            }}
          >
            Soins capillaires raffinés — masques, huiles & accessoires
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
