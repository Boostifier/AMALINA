import { ImageResponse } from "next/og";

// Home-screen icon (iOS) — larger "A" monogram on the brand rose-gold.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #b76e79 0%, #9c5862 100%)",
          color: "#fbf6f3",
          fontSize: 120,
          fontWeight: 700,
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        A
      </div>
    ),
    { ...size },
  );
}
