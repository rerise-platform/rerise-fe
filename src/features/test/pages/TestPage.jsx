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

  const canProceed = isLast ? allAnswered : selected != null;

  // ▶ 옵션 클릭 시, 바로 저장(answers) + 현재 선택 상태(selected) 동기화
  const choose = (val) => {
    setSelected(val);
    setAnswers((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  // ▶ index가 바뀔 때, 해당 문항의 기존 답 복원
  useEffect(() => {
    setSelected(answers[index] ?? null);
  }, [index]); // answers가 아주 자주 바뀌면 [index, answers]로 둬도 OK

  // ▶ 화살표 전/후: 선택 여부와 무관하게 이동
  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => setIndex((i) => Math.min(total - 1, i + 1));

  // ▶ 큰 “다음/결과 보기” 버튼: 이전 로직 유지(현재 문항 선택 필요)
  const next = () => {
    // 마지막이 아니면 현재 선택이 있어야 넘어감
    if (!isLast && selected == null) return;

    // 마지막이면 모든 문항이 답변되어야 종료 가능
    if (isLast && !allAnswered) return;

    const newAnswers = [...answers];
    if (selected != null) newAnswers[index] = selected;

    if (!isLast) {
      setAnswers(newAnswers);
      setIndex((v) => v + 1);
    } else {
      nav("/test/loading", { state: { answers: newAnswers }, replace: true });
    }
  };

  // (안전) 질문이 없을 때 가드
  if (!q) return null;

  return (
    <div className="test-shell">
      <main className="test-wrap">
        <div className="test-topbar">
          <div
            className="page-title"
            style={{ fontSize: 20, color: "#1db672" }}
          >
            은둔 성향 테스트
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

        <div className="sticky-bottom">
          <button
            className={`primary-btn ${!canProceed ? "is-disabled" : ""}`}
            onClick={next}
            disabled={!canProceed}
          >
            {isLast ? "결과 보기" : "다음"}
          </button>
        </div>
      </main>
    </div>
  );
}
