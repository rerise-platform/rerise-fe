import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  GAUGE_LABELS,
  KEY_BY_NAME,
  CHAR_NAME_BY_KEY,
  CHARACTER_KEYWORDS,
} from "../data/question";
import { getCharacterById } from "../api/testAPI";
import "./test.css";

const CHAR_IMG = {
  모니: "/images/char1.png",
  토리: "/images/tory.png",
  포리: "/images/pory.png",
  코코: "/images/koko.png",
};

const gaugeOrder = ["energylevel", "adaptability", "resilience"];
const toWidth = (v) =>
  v == null ? 20 : v <= 5 ? v * 20 : Math.max(20, Math.min(100, v));

export default function TestResultPage() {
  const nav = useNavigate();
  const { state } = useLocation();
  const initial = state?.result;

  const [result, setResult] = useState(initial);
  const [loading, setLoading] = useState(!initial);

  useEffect(() => {
    // state 없으면 저장된 characterId로 복구 시도
    if (initial) {
      setLoading(false);
      return;
    }
    const id = localStorage.getItem("characterId");
    const clientKey = localStorage.getItem("characterKey");
    const clientName = localStorage.getItem("characterName");

    if (!id) {
      setLoading(false);
      return; // 테스트부터 다시
    }

    (async () => {
      try {
        const api = await getCharacterById(id);
        // 서버가 한글 type을 줄 수도 있음 → 키 매핑
        const key = KEY_BY_NAME[api.type] || clientKey || "MONY";
        const name =
          CHAR_NAME_BY_KEY[key] || api.type || clientName || "캐릭터";
        const toPercent = (v) => (v <= 5 ? v * 20 : v);

        const normalized = {
          character: { name, key },
          bars: {
            energylevel: toPercent(api.energylevel ?? 3),
            adaptability: toPercent(api.adaptability ?? 3),
            resilience: toPercent(api.resilience ?? 3),
          },
          tags: [api.keyword1, api.keyword2, api.keyword3].filter(Boolean)
            .length
            ? [api.keyword1, api.keyword2, api.keyword3].filter(Boolean)
            : CHARACTER_KEYWORDS[key] || [],
          blurb: api.description || "",
          character_id: api.character_id,
          clientKey: key,
          clientName: name,
        };

        // 메인 연동 값 갱신
        localStorage.setItem("characterKey", normalized.clientKey);
        localStorage.setItem("characterName", normalized.clientName);
        if (normalized.character_id) {
          localStorage.setItem("characterId", String(normalized.character_id));
        }

        setResult(normalized);
      } catch {
        // 실패 시 테스트로 이동
        // nav("/test", { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [initial]);

  if (loading) {
    return (
      <div className="test-shell">
        <main className="test-wrap">
          <div className="loading-wrap">
            <div className="loading-font">결과를 불러오는 중…</div>
          </div>
        </main>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="test-shell">
        <main className="test-wrap">
          <div className="result-text" style={{ textAlign: "center" }}>
            결과가 없어요. 테스트를 먼저 진행해주세요.
          </div>
          <div className="sticky-bottom" style={{ marginTop: 16 }}>
            <button className="primary-btn" onClick={() => nav("/test")}>
              테스트 하러 가기
            </button>
          </div>
        </main>
      </div>
    );
  }

  const { character, bars, tags, blurb } = result;

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
          {(tags || []).slice(0, 3).map((p, i) => (
            <span className="pill" key={i}>
              {p}
            </span>
          ))}
        </div>

        <div style={{ marginTop: "clamp(6px, 1vw, 20px)" }}>
          {gaugeOrder.map((axis) => (
            <div
              key={axis}
              style={{ marginTop: axis === "energylevel" ? 0 : 8 }}
            >
              <div className="barName" style={{ color: "#6b756e" }}>
                {GAUGE_LABELS[axis]}
              </div>
              <div className="meter">
                <div
                  className="fill"
                  style={{ width: `${toWidth(bars?.[axis])}%` }}
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
          {blurb && (
            <>
              <b>당신은 👋</b>
              <br />
            </>
          )}
          {blurb || "당신만의 리듬으로 충분히 괜찮아요."}
        </div>

        <div className="sticky-bottom" style={{ marginTop: 0 }}>
          <button
            className="primary-btn"
            onClick={() => {
              // 테스트 완료 상태 저장
              localStorage.setItem("testCompleted", "true");
              // 메인 페이지로 이동
              nav("/tutorial", {
                replace: true,
                state: { from: "testResult" },
              });
            }}
          >
            다음
          </button>
        </div>
      </main>
    </div>
  );
}
