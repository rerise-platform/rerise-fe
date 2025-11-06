import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QUESTIONS from "../data/question";
import "./test.css";

export default function TestPage() {
  const nav = useNavigate();
  const total = QUESTIONS.length;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // 1~4 저장
  const [selected, setSelected] = useState(null);

  const q = useMemo(() => QUESTIONS[index], [index]);
  const isLast = index === total - 1;

  const allAnswered = useMemo(
    () => Array.from({ length: total }).every((_, i) => answers[i] != null),
    [answers, total]
  );

  // 큰 버튼 제어: 마지막이면 "결과 보기" 활성 조건, 아니면 "이전" 버튼(첫 문항만 비활성)
  const canPrev = index > 0;
  const canFinish = isLast && allAnswered;

  // ▶ 옵션 클릭 시: 저장 + (마지막이 아니면) 자동으로 다음 문항으로 이동
  const choose = (val) => {
    setSelected(val);
    setAnswers((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });

    if (!isLast) {
      // 살짝의 딜레이로 선택 하이라이트가 보이게
      setTimeout(() => {
        setIndex((i) => Math.min(total - 1, i + 1));
      }, 120);
    }
  };

  // ▶ index가 바뀔 때, 해당 문항의 기존 답 복원
  useEffect(() => {
    setSelected(answers[index] ?? null);

    // answers가 아주 자주 바뀌면 [index, answers]로 둬도 OK
  }, [index, answers]);

  // ▶ 상단 화살표
  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => setIndex((i) => Math.min(total - 1, i + 1));

  // ▶ 마지막 페이지: "결과 보기"
  const finish = () => {
    if (!canFinish) return;
    nav("/test/loading", { state: { answers }, replace: true });
  };

  if (!q) return null;

  return (
    <div className="test-shell">
      <main className="test-wrap">
        <div className="test-topbar">
          <div
            className="page-title"
            style={{
              textAlign: "center",
              marginTop: "10px",
              marginBottom: "45px",
            }}
          >
            <b>은둔 성향 테스트</b>
          </div>
        </div>

        <h2 className="q-title">{q.title}</h2>

        <div className="progress">
          <button
            type="button"
            className="nav prev"
            onClick={goPrev}
            disabled={index === 0}
            aria-label="이전"
          >
            ‹
          </button>
          <span>
            {index + 1} / {total}
          </span>
          <button
            type="button"
            className="nav next"
            onClick={goNext}
            disabled={index === total - 1}
            aria-label="다음"
          >
            ›
          </button>
        </div>

        {q.options.map((opt) => (
          <div
            key={opt.answerValue}
            className={`opt ${selected === opt.answerValue ? "selected" : ""}`}
            onClick={() => choose(opt.answerValue)}
          >
            {opt.label}
          </div>
        ))}

        <div
          className="sticky-bottom"
          style={{
            marginTop: "20px",
          }}
        >
          {/* 마지막이면 결과 보기, 아니면 '이전' */}
          {isLast ? (
            <button
              className={`primary-btn ${!canFinish ? "is-disabled" : ""}`}
              onClick={finish}
              disabled={!canFinish}
            >
              결과 보기
            </button>
          ) : (
            <button
              className={`primary-btn ${!canPrev ? "is-disabled" : ""}`}
              onClick={goPrev}
              disabled={!canPrev}
            >
              이전
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
