import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

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
          background:
            "radial-gradient(circle at 24% 18%, rgba(227,155,77,0.6), transparent 30%), linear-gradient(160deg, #121922 0%, #080b0f 72%)",
          color: "#f3f1eb",
          fontFamily: "Arial",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 26,
            borderRadius: 120,
            border: "2px solid rgba(255,255,255,0.12)",
            background: "linear-gradient(160deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            position: "relative",
          }}
        >
          <div
            style={{
              fontSize: 196,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.08em",
            }}
          >
            O
          </div>
          <div
            style={{
              fontSize: 44,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#ffc58a",
            }}
          >
            Oversteer
          </div>
        </div>
      </div>
    ),
    size,
  );
}
