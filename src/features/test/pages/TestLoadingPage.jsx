import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./test.css";

export default function TestLoadingPage() {
  const nav = useNavigate();
  const { state } = useLocation();
  useEffect(() => {
    const t = setTimeout(
      () => nav("/test/result", { state, replace: true }),
      1400
    );
    return () => clearTimeout(t);
  }, [nav, state]);

  return (
    <div className="test-shell">
      <main className="test-wrap">
        <div className="loading-wrap">
          <img src="/images/heart.gif" alt="heart" className="heart" />
          <div
            className="loading-font"
            style={{ fontSize: "24px", fontWeight: 800 }}
          >
            성향 파악중…
          </div>
          <div className="loading-font" style={{ color: "#6b756e" }}>
            잠시만 기다려주세요!
          </div>
        </div>
      </main>
    </div>
  );
}
