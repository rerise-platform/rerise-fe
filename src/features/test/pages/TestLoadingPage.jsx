import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QUESTIONS, {
  CHAR_NAME_BY_KEY,
  CHARACTER_KEYWORDS,
  KEY_BY_NAME,
} from "../data/question";
import { submitCharacterTest } from "../api/testAPI";
import "./test.css";

// 선택값(1~4) -> 캐릭터 키
const KEY_BY_ANSWER = { 1: "MONY", 2: "TORY", 3: "PORY", 4: "KOKO" };

// 로컬 계산 (폴백용)
function buildLocalResult(answerValues) {
  const sums = { energylevel: 0, adaptability: 0, resilience: 0 };
  const cnt = { MONY: 0, TORY: 0, PORY: 0, KOKO: 0 };

  answerValues.forEach((v, idx) => {
    const opt = QUESTIONS[idx].options.find((o) => o.answerValue === v);
    if (!opt) return;
    sums.energylevel += opt.gauge.energylevel || 0;
    sums.adaptability += opt.gauge.adaptability || 0;
    sums.resilience += opt.gauge.resilience || 0;
    cnt[KEY_BY_ANSWER[v]] += 1;
  });

  // 최다 선택
  const dominantKey = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0];
  const charName = CHAR_NAME_BY_KEY[dominantKey];

  // 합계(-16~16)를 1~5로 스케일
  const toFive = (sum) => {
    const min = -16,
      max = 16;
    const clamped = Math.max(min, Math.min(max, sum));
    return Math.max(
      1,
      Math.min(5, Math.round(((clamped - min) / (max - min)) * 4 + 1))
    );
  };
  const five = {
    energylevel: toFive(sums.energylevel),
    adaptability: toFive(sums.adaptability),
    resilience: toFive(sums.resilience),
  };
  const toPercent = (v) => v * 20;

  const blurbMap = {
    MONY: `차분한 공간에서 스스로의 리듬을 지킬 때 회복이 빨라지는 타입이에요. 무리한 도약보다 한 걸음의 진전이 더 멀리 데려갑니다. 오늘은 익숙한 루틴 하나만 지켜보며 안정감을 쌓아봐요.`,
    TORY: `에너지의 오르내림을 잘 감지하고 관리할 때 강점을 보이는 타입이에요. 쉬어갈 타이밍을 스스로 정하면 페이스가 안정됩니다. 수면·식사·가벼운 산책 같은 ‘충전 루틴’을 작게라도 꾸준히 이어가요.`,
    PORY: `감정과 경험에서 활력을 얻는 표현형이에요. 마음을 솔직히 나눌수록 에너지가 차오릅니다. 오늘의 느낌을 한 줄 기록하거나, 믿는 사람과 짧게 대화를 나눠보세요.`,
    KOKO: `목표를 세우고 바로 실행할 때 가장 빛나는 추진가예요. 계획이 또렷해질수록 불안은 줄고 자신감은 커집니다. ‘지금 당장 할 수 있는 10분짜리 행동’ 하나를 정해 바로 시작해봐요.`,
  };

  return {
    character: { name: charName, key: dominantKey },
    bars: {
      energylevel: toPercent(five.energylevel),
      adaptability: toPercent(five.adaptability),
      resilience: toPercent(five.resilience),
    },
    tags: CHARACTER_KEYWORDS[dominantKey] || [],
    blurb: blurbMap[dominantKey],
    // 메인 연동 보조 저장용
    clientKey: dominantKey,
    clientName: charName,
  };
}

// 서버 응답을 결과페이지용으로 정규화
function normalizeServerResult(api, clientKey, clientName) {
  const toPercent = (v) => (v <= 5 ? v * 20 : v);
  const serverTags = [api.keyword1, api.keyword2, api.keyword3].filter(Boolean);

  // 서버 type이 한글(예: "모니")이면 키 매핑, 아니면 클라이언트 키 사용
  const key = KEY_BY_NAME[api.type] || clientKey || "MONY";
  const name = CHAR_NAME_BY_KEY[key] || api.type || clientName || "캐릭터";
  const fallbackTags = CHARACTER_KEYWORDS[key] || [];

  return {
    character: { name, key },
    bars: {
      energylevel: toPercent(api.energylevel ?? 3),
      adaptability: toPercent(api.adaptability ?? 3),
      resilience: toPercent(api.resilience ?? 3),
    },
    tags: serverTags.length ? serverTags : fallbackTags,
    blurb: api.description || "",
    character_id: api.character_id,
    clientKey: key,
    clientName: name,
  };
}

export default function TestLoadingPage() {
  const nav = useNavigate();
  const { state } = useLocation();
  const answers = state?.answers;

  useEffect(() => {
    if (!Array.isArray(answers) || answers.length !== QUESTIONS.length) {
      nav("/test", { replace: true });
      return;
    }

    // 클라이언트 기준 캐릭터(이미지/메인 연동용) 미리 계산
    const local = buildLocalResult(answers);

    (async () => {
      try {
        const apiRes = await submitCharacterTest(answers);
        const normalized = normalizeServerResult(
          apiRes,
          local.clientKey,
          local.clientName
        );

        // 메인 페이지 연동 저장 (원하면 character_id도 저장)
        localStorage.setItem("characterKey", normalized.clientKey);
        localStorage.setItem("characterName", normalized.clientName);
        if (normalized.character_id) {
          localStorage.setItem("characterId", String(normalized.character_id));
        }

        nav("/test/result", { state: { result: normalized }, replace: true });
      } catch (e) {
        // 서버 실패 시 폴백
        localStorage.setItem("characterKey", local.clientKey);
        localStorage.setItem("characterName", local.clientName);
        nav("/test/result", { state: { result: local }, replace: true });
      }
    })();
  }, [answers, nav]);

  return (
    <div className="test-shell">
      <main className="test-wrap">
        <div className="loading-wrap">
          <img src="/images/heart.gif" alt="heart" className="heart" />
          <div
            className="loading-font"
            style={{ fontSize: 24, fontWeight: 800 }}
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
