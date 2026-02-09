"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const QUESTIONS = [
  "What’s one word that best describes how you’re feeling right now?",
  "What has influenced your mood the most today so far?",
  "If you had to describe your current headspace in one short sentence, what would it be?",
  "As you answer this survey, do you feel calm or rushed?",
  "What’s happening around you right now as you answer this survey?",
  "How focused do you feel at this moment?",
  "How are you doing right now, overall?",
  "What feeling best describes where you’re at right now?",
  "How would you describe yourself at this moment in a few words?",
  "How does today compare to a “typical” day for you?",
  "How would you describe yourself at this point in your day?",
  "How are things going for you at this point in the day?",
  "How comfortable do you feel right now?",
];

function pickStableQuestionIndex(seed: string, length: number) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return Math.abs(h) % length;
}

export default function QuestionCard() {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [seed, setSeed] = useState<string | null>(null);
  const glowStyleInjectedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    const key = "qs_seed";
    let existing = sessionStorage.getItem(key);
    if (!existing) {
      existing = crypto.randomUUID();
      sessionStorage.setItem(key, existing);
    }
    setSeed(existing);
  }, []);

  const question = useMemo(() => {
    if (!seed) return "";
    const idx = pickStableQuestionIndex(seed, QUESTIONS.length);
    return QUESTIONS[idx];
  }, [seed]);

  useEffect(() => {
    if (!mounted) return;
    setAnswer("");
    setSubmitted(false);
  }, [question, mounted]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (glowStyleInjectedRef.current) return;
    glowStyleInjectedRef.current = true;

    const style = document.createElement("style");
    style.setAttribute("data-globe-pulse", "true");
    style.textContent = `
      @keyframes globePulse {
        0% { transform: scale(1); opacity: 0.75; }
        50% { transform: scale(1.05); opacity: 0.95; }
        100% { transform: scale(1); opacity: 0.75; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      style.remove();
      glowStyleInjectedRef.current = false;
    };
  }, []);

  const canSubmit = answer.trim().length > 0 && answer.trim().length <= 200;

  if (!mounted) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        padding: "24px",
        pointerEvents: "none",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: 720,
          height: 720,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 30% 30%, rgba(123, 92, 255, 0.20) 0%, transparent 55%), radial-gradient(circle at 70% 60%, rgba(0, 220, 255, 0.12) 0%, transparent 60%)",
          filter: "blur(70px)",
          opacity: 0.85,
          animation: "globePulse 8s ease-in-out infinite",
        }}
      />

      <div
        style={{
          width: "min(720px, 100%)",
          borderRadius: "24px",
          padding: "28px",
          background: "rgba(10, 10, 12, 0.62)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid transparent",
          backgroundImage:
            "linear-gradient(rgba(10,10,12,0.62), rgba(10,10,12,0.62)), linear-gradient(120deg, rgba(123, 92, 255, 0.55), rgba(0, 220, 255, 0.25), rgba(255,255,255,0.08))",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          boxShadow: "0 18px 60px rgba(0,0,0,0.60), 0 0 0 1px rgba(255,255,255,0.06) inset",
          pointerEvents: "auto",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(900px 220px at 20% 0%, rgba(255,255,255,0.08) 0%, transparent 60%)",
            pointerEvents: "none",
            mixBlendMode: "screen",
            opacity: 0.55,
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", position: "relative" }}>
          <div style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)" }}>
            Quick Check-in
          </div>

          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>1 question • ~10 seconds</div>
        </div>

        <h1
          style={{
            marginTop: 14,
            marginBottom: 16,
            fontSize: 28,
            lineHeight: 1.25,
            fontWeight: 650,
            color: "rgba(255,255,255,0.92)",
            position: "relative",
          }}
        >
          {question}
        </h1>

        <div style={{ display: "grid", gap: 10, position: "relative" }}>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your response here…"
            rows={3}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(0, 220, 255, 0.35)";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px rgba(0, 220, 255, 0.14), 0 0 0 1px rgba(123, 92, 255, 0.10) inset";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              e.currentTarget.style.boxShadow = "none";
            }}
            style={{
              width: "100%",
              resize: "none",
              borderRadius: 16,
              padding: "14px 14px",
              fontSize: 16,
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.92)",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              outline: "none",
              transition: "box-shadow 160ms ease, border-color 160ms ease",
            }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>Keep it short and honest.</div>
            <div style={{ fontSize: 12, color: answer.trim().length > 200 ? "rgba(255,120,120,0.95)" : "rgba(255,255,255,0.55)" }}>
              {answer.trim().length}/200
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 6 }}>
            <button
              onClick={() => {
                setAnswer("");
                setSubmitted(false);
              }}
              style={{
                borderRadius: 14,
                padding: "10px 14px",
                fontSize: 14,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.82)",
                cursor: "pointer",
              }}
            >
              Clear
            </button>

            <button
              disabled={!canSubmit || submitted}
              onClick={() => {
                setSubmitted(true);
                console.log({ question, answer: answer.trim(), ts: new Date().toISOString() });
              }}
              style={{
                borderRadius: 14,
                padding: "10px 16px",
                fontSize: 14,
                border: "1px solid rgba(255,255,255,0.12)",
                background: submitted
                  ? "rgba(120, 255, 180, 0.25)"
                  : canSubmit
                  ? "linear-gradient(120deg, rgba(123, 92, 255, 0.22), rgba(0, 220, 255, 0.14))"
                  : "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.92)",
                cursor: canSubmit && !submitted ? "pointer" : "not-allowed",
                boxShadow: canSubmit && !submitted ? "0 10px 30px rgba(0,0,0,0.35)" : "none",
              }}
            >
              {submitted ? "Submitted ✓" : "Submit"}
            </button>
          </div>

          <div style={{ marginTop: 10, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
            wala pa tayong db hehehe so frontend work pa lang talaga
          </div>
        </div>
      </div>
    </div>
  );
}
