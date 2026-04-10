import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

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
          background: "linear-gradient(160deg, #121922 0%, #080b0f 72%)",
          color: "#f3f1eb",
          fontFamily: "Arial",
          borderRadius: 42,
          border: "4px solid rgba(255,255,255,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 92,
            fontWeight: 800,
            letterSpacing: "-0.08em",
            lineHeight: 1,
          }}
        >
          O
        </div>
      </div>
    ),
    size,
  );
}
