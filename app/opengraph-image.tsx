import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Preview image shown when the site link is shared (WhatsApp, Facebook, X, etc.).
export const alt = "Amalina Market — Soins Capillaires";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const heroData = await readFile(join(process.cwd(), "public/hero.png"), "base64");
  const heroSrc = `data:image/png;base64,${heroData}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#2b2422",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroSrc}
          alt=""
          width={1200}
          height={630}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* Dark veil so the wordmark stays legible over the photo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(43,36,34,0.78) 0%, rgba(43,36,34,0.45) 55%, rgba(43,36,34,0.15) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
            padding: "0 80px",
            color: "#fbf6f3",
          }}
        >
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: 14,
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            AMALINA
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 30,
              letterSpacing: 8,
              color: "#ecc7c1",
              textTransform: "uppercase",
            }}
          >
            Market
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 34,
              maxWidth: 620,
              color: "#f7ede9",
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
