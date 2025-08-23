import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GAUGE_LABELS } from "../data/question";
import "./test.css";

const CHAR_IMG = {
  모니: "/images/char1.png",
  토리: "/images/tory.png",
  포리: "/images/pory.png",
  코코: "/images/koko.png",
};

export default function TestResultPage() {
  const nav = useNavigate();
  const { state } = useLocation();
  const result = state?.result;

  useEffect(() => {
    if (!result) nav("/test", { replace: true });
  }, [result, nav]);

  if (!result) return null;

  const { character, bars, tags, blurb } = result;
  const gaugeOrder = ["energy", "adapt", "recovery", "affinity"];
  const displayWidth = (v) => Math.max(20, Math.min(100, v ?? 0));

  return (
    <div className="test-shell">
      <main className="test-wrap">
        <div className="test-topbar">
          <div className="page-title">테스트 결과</div>
        </div>

        <div className="result-avatar">
          <img
            src={CHAR_IMG[character?.name] || "/images/char1.png"}
            alt={character?.name || "캐릭터"}
          />
        </div>

        <h2 className="q-title" style={{ textAlign: "center" }}>
          {character?.name || "성향 캐릭터"}
        </h2>

        <div className="pillset">
          {(tags || []).map((p, i) => (
            <span className="pill" key={i}>
              {p}
            </span>
          ))}
        </div>

        <div style={{ marginTop: 6 }}>
          {gaugeOrder.map((axis) => (
            <div key={axis} style={{ marginTop: axis === "energy" ? 0 : 8 }}>
              <div style={{ fontSize: 13, color: "#6b756e" }}>
                {GAUGE_LABELS[axis]}
              </div>
              <div className="meter">
                <div
                  className="fill"
                  style={{ width: `${displayWidth(bars?.[axis])}%` }}
                />
                <div className="segments">
                  {[0, 1, 2, 3, 4].map((_, i) => (
                    <i key={i} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="result-text">
          <b>당신은 👋</b>
          <br />
          {blurb}
        </div>

        <div className="sticky-bottom" style={{ marginTop: 16 }}>
          <button className="primary-btn" onClick={() => nav("/")}>
            다음
          </button>
        </div>
      </main>
    </div>
  );
}
