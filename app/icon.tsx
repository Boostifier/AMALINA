import { ImageResponse } from "next/og";

// Browser-tab icon: an "A" monogram in the Amalina rose-gold palette.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 24,
          fontWeight: 700,
          fontFamily: "Georgia, 'Times New Roman', serif",
          borderRadius: 6,
        }}
      >
        A
      </div>
    ),
    { ...size },
  );
}
