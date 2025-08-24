import React, { useMemo, useState } from "react";
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

  const next = () => {
    if (selected == null) return;
    const newAnswers = [...answers];
    newAnswers[index] = selected;

    if (index < total - 1) {
      setAnswers(newAnswers);
      setIndex((v) => v + 1);
      setSelected(newAnswers[index + 1] ?? null);
    } else {
      nav("/test/loading", { state: { answers: newAnswers }, replace: true });
    }
  };

  const isLast = index === total - 1;

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
          <span>‹</span>
          <span>
            {index + 1} / {total}
          </span>
          <span>›</span>
        </div>

        {q.options.map((opt) => (
          <div
            key={opt.answerValue}
            className={`opt ${selected === opt.answerValue ? "selected" : ""}`}
            onClick={() => setSelected(opt.answerValue)}
          >
            {opt.label}
          </div>
        ))}

        <div className="sticky-bottom">
          <button className="primary-btn" onClick={next}>
            {isLast ? "결과 보기" : "다음"}
          </button>
        </div>
      </main>
    </div>
  );
}
