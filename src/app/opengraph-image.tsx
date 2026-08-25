import { ImageResponse } from "next/og";

export const alt = "Middle Class Musicians — Recording Studio in New Delhi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const levels = [42, 76, 118, 176, 132, 212, 154, 96, 188, 126, 68, 106, 164, 88];

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#07070a",
          color: "#f5f5f7",
          padding: "72px 82px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ position: "absolute", width: 560, height: 560, borderRadius: 560, right: -120, top: -180, background: "rgba(212,168,87,0.12)" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", fontSize: 30, letterSpacing: 8, fontWeight: 800 }}><span style={{ color: "#d4a857" }}>MCM</span><span style={{ marginLeft: 18 }}>STUDIO</span></div>
            <div style={{ display: "flex", border: "1px solid rgba(212,168,87,0.4)", borderRadius: 999, padding: "10px 18px", color: "#d4a857", fontSize: 16, letterSpacing: 3 }}>NEW DELHI</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 92, lineHeight: 0.9, fontWeight: 900, letterSpacing: -4 }}>RECORD. CREATE.</div>
            <div style={{ display: "flex", fontSize: 112, lineHeight: 0.92, fontWeight: 900, letterSpacing: -5, color: "#d4a857" }}>PERFORM.</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{ display: "flex", maxWidth: 620, color: "#a1a1aa", fontSize: 24, lineHeight: 1.4 }}>Recording · Mixing · Mastering · Beat Production</div>
            <div style={{ display: "flex", height: 108, alignItems: "center", gap: 8 }}>
              {levels.map((height, index) => <div key={index} style={{ display: "flex", width: 7, height: height / 2, borderRadius: 8, background: index % 3 === 0 ? "#f5f5f7" : "#d4a857" }} />)}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
