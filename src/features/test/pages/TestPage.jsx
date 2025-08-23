import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import QUESTIONS, { CHARACTER_RULES } from "../data/question";
import "./test.css";

export default function TestPage() {
  const nav = useNavigate();
  const total = QUESTIONS.length;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);

  const q = useMemo(() => QUESTIONS[index], [index]);

  const next = () => {
    if (selected === null) return;
    const newAnswers = [...answers];
    newAnswers[index] = selected;

    if (index < total - 1) {
      setAnswers(newAnswers);
      setIndex((v) => v + 1);
      setSelected(newAnswers[index + 1] ?? null);
    } else {
      const result = calcResult(newAnswers);
      nav("/test/loading", { state: { result }, replace: true });
    }
  };

  const isLast = index === total - 1;

  return (
    <div className="test-shell">
      <main className="test-wrap">
        <div className="test-topbar">
          <div
            className="page-title"
            style={{ fontSize: "20px", color: "#1db672" }}
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

        {q.options.map((opt, i) => (
          <div
            key={i}
            className={`opt ${selected === i ? "selected" : ""}`}
            onClick={() => setSelected(i)}
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

/* ===== calcResult는 너의 현재 버전 그대로 사용 ===== */
function calcResult(answerIdxArr) {
  const sums = { energy: 0, adapt: 0, recovery: 0, affinity: 0 };
  answerIdxArr.forEach((optIdx, qIdx) => {
    const sc = QUESTIONS[qIdx].options[optIdx].score;
    sums.energy += sc.energy || 0;
    sums.adapt += sc.adapt || 0;
    sums.recovery += sc.recovery || 0;
    sums.affinity += sc.affinity || 0;
  });
  const pairScore = {
    MONY: sums.recovery + sums.affinity,
    TORY: sums.recovery - sums.energy,
    PORY: sums.affinity + sums.adapt,
    KOKO: sums.energy + sums.adapt,
  };
  const bestKey = Object.keys(pairScore).reduce((a, b) =>
    pairScore[a] >= pairScore[b] ? a : b
  );
  const meta = { MONY: "모니", TORY: "토리", PORY: "포리", KOKO: "코코" }[
    bestKey
  ];

  const norm = (v) => {
    const min = -16,
      max = 16;
    const c = Math.max(min, Math.min(max, v));
    return Math.round(((c - min) / (max - min)) * 100);
  };

  return {
    character: { key: bestKey, name: meta },
    bars: {
      energy: norm(sums.energy),
      adapt: norm(sums.adapt),
      recovery: norm(sums.recovery),
      affinity: norm(sums.affinity),
    },
    tags: [], // 필요 시 채워 사용
    blurb:
      bestKey === "MONY"
        ? "조용한 회복과 안정이 큰 힘이 되는 타입…"
        : bestKey === "TORY"
        ? "에너지 관리가 최우선!…"
        : bestKey === "PORY"
        ? "감정과 경험을 소중히 여기는 공감형…"
        : "목표 지향의 실행가…",
  };
}
