import React from "react";
import { useNavigate } from "react-router-dom";
import "./test.css";

export default function TestIntroPage() {
  const nav = useNavigate();

  return (
    <div className="test-shell">
      <main className="test-wrap">
        <div className="test-topbar">
          <div className="page-title">나의 은둔 성향은?</div>
        </div>

        <section className="test-intro-hero">
          <div className="test-intro-sub">
            당신의 은둔 성향은 어떤 유형일까요?
          </div>
          <div className="test-intro-desc">
            은둔 성향을 이해하고,<br></br> <b>나에게 맞는 성장 방법</b>을
            찾아보세요.
          </div>
          <img
            className="hero-illust"
            src="/images/test1.png"
            alt="test hero"
          />
        </section>

        <div className="sticky-bottom">
          <button
            className="primary-btn"
            onClick={() => nav("/test/q", { replace: true })}
          >
            테스트 시작하기
          </button>
        </div>
      </main>
    </div>
  );
}
