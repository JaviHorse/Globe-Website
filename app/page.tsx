"use client";

import { useEffect, useMemo, useState } from "react";
import PixelSnow from "./component/PixelSnow";
import QuestionCard from "./component/QuestionCard";
import Image from "next/image";

const TARGET = 500;

export default function Home() {
  const [count, setCount] = useState(0);

  async function refreshCount() {
    try {
      const res = await fetch("/api/count", { cache: "no-store" });
      const data = await res.json();
      if (res.ok) setCount(Number(data.count ?? 0));
      else console.error("Count API error:", res.status, data?.error ?? data);
    } catch (e) {
      console.error("Count fetch failed:", e);
    }
  }

  useEffect(() => {
    // Run initial fetch in a callback (avoids react-hooks/set-state-in-effect lint)
    const start = window.setTimeout(() => {
      void refreshCount();
    }, 0);

    const t = window.setInterval(() => {
      void refreshCount();
    }, 2000); // live-ish updates

    return () => {
      window.clearTimeout(start);
      window.clearInterval(t);
    };
  }, []);

  const progress = useMemo(() => {
    if (TARGET <= 0) return 0;
    return Math.max(0, Math.min(1, count / TARGET));
  }, [count]);

  const pctExact = progress * 100;
  const pctRounded = Math.round(pctExact);
  const markerPct = count > 0 ? Math.max(pctExact, 1.5) : 0;

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        background: "#000",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Top-left logo */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 10,
          pointerEvents: "none",
        }}
      >
        <Image
          src="/ICXLogo.png"
          alt="ICX Logo"
          width={110}
          height={40}
          priority
          style={{
            width: "110px",
            height: "auto",
            objectFit: "contain",
            filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.55))",
          }}
        />
      </div>

      <PixelSnow
        color="#ffffff"
        flakeSize={0.01}
        minFlakeSize={1.25}
        pixelResolution={450}
        speed={0.25}
        density={0.3}
        depthFade={8}
        farPlane={20}
        brightness={5.0}
        gamma={0.8}
        variant="square"
        direction={125}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          padding: 24,
        }}
      >
        <div style={{ width: "min(720px, 100%)" }}>
          <QuestionCard />

          {/* progress bar under card */}
          <div style={{ height: 14 }} />

          <div style={{ position: "relative" }}>
            <div
              style={{
                height: 6,
                borderRadius: 999,
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.10)",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${markerPct}%`,
                  borderRadius: 999,
                  background:
                    "linear-gradient(90deg, rgba(123,92,255,0.65), rgba(0,220,255,0.55))",
                  transition: "width 400ms ease",
                }}
              />
            </div>

            {/* 🔥 marker */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: "50%",
                left: `calc(${markerPct}% - 8px)`,
                transform: "translateY(-50%)",
                transition: "left 400ms ease",
                filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.6))",
                fontSize: 14,
                lineHeight: "14px",
                pointerEvents: "auto",
              }}
              title={`${pctExact.toFixed(2)}%`}
            >
              🔥
            </div>
          </div>

          <div
            style={{
              marginTop: 8,
              fontSize: 12,
              color: "rgba(255,255,255,0.55)",
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <span>Participation</span>
            <span>
              {pctRounded}% • {count}/{TARGET}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
