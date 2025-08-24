// src/features/test/data/question.js
// ===== 은둔 성향 테스트: 문항 데이터 (백엔드 API 스펙 맞춤) =====

/** 결과 게이지 라벨 (결과 페이지에서 사용) */
export const GAUGE_LABELS = {
  energylevel: "에너지력",
  adaptability: "적응력",
  resilience: "회복력",
};

/** 캐릭터 키 -> 한글 이름 */
export const CHAR_NAME_BY_KEY = {
  MONY: "모니", // 1번 다수: 내향·안정·점진
  TORY: "토리", // 2번 다수: 에너지 관리·휴식·자기돌봄
  PORY: "포리", // 3번 다수: 감정표현·공감·경험
  KOKO: "코코", // 4번 다수: 목표·도전·실행
};

/** 캐릭터별 고정 키워드 3개 (결과에서만 표시) */
export const CHARACTER_KEYWORDS = {
  MONY: ["내향·안정", "섬세함", "점진적 변화"],
  TORY: ["에너지 관리", "휴식 필요", "자기돌봄"],
  PORY: ["감정표현", "공감", "경험몰입"],
  KOKO: ["목표설정", "실행력", "도전"],
};

/** (서버가 한글 type을 줄 때 역매핑이 필요할 수 있어요) */
export const KEY_BY_NAME = {
  모니: "MONY",
  토리: "TORY",
  포리: "PORY",
  코코: "KOKO",
};

/**
 * QUESTIONS
 * - answerValue = 1|2|3|4 고정 매핑
 *   -> 1=모니(MONY), 2=토리(TORY), 3=포리(PORY), 4=코코(KOKO)
 * - gauge: 선택이 게이지(energylevel/adaptability/resilience)에 주는 영향 합산값
 * - affinity는 사용하지 않음
 */
const QUESTIONS = [
  // 1
  {
    id: 1,
    title: "지금 당신의 '마음 에너지'는 어떤 상태에 가장 가까운가요?",
    options: [
      {
        answerValue: 1, // MONY
        label: "막 땅에서 돋아난 작은 새싹 같아요.",
        gauge: { energylevel: -1, adaptability: 0, resilience: 2 },
      },
      {
        answerValue: 2, // TORY
        label: "충전이 필요한 방전 직전의 배터리 같아요.",
        gauge: { energylevel: -2, adaptability: 0, resilience: 2 },
      },
      {
        answerValue: 3, // PORY
        label: "알록달록, 어떤 색이 될지 모르는 물감 팔레트 같아요.",
        gauge: { energylevel: 0, adaptability: 2, resilience: 0 },
      },
      {
        answerValue: 4, // KOKO
        label: "목표를 향해 나아갈 준비가 된 가만히 놓인 나침반 같아요.",
        gauge: { energylevel: 2, adaptability: 1, resilience: 0 },
      },
    ],
  },

  // 2
  {
    id: 2,
    title: "아무 방해 없는 하루가 주어진다면, 어떻게 에너지를 채우고 싶나요?",
    options: [
      {
        answerValue: 1, // MONY
        label: "가장 편한 공간에서 조용히 혼자만의 시간을 보낸다.",
        gauge: { energylevel: -1, adaptability: 0, resilience: 2 },
      },
      {
        answerValue: 2, // TORY
        label: "몸과 마음을 쉬게 하는 루틴(가벼운 산책, 낮잠, 명상 등)을 한다.",
        gauge: { energylevel: 0, adaptability: 1, resilience: 2 },
      },
      {
        answerValue: 3, // PORY
        label: "좋아하는 사람과 소소하지만 즐거운 경험을 함께한다.",
        gauge: { energylevel: 1, adaptability: 1, resilience: 0 },
      },
      {
        answerValue: 4, // KOKO
        label: "미뤄둔 일들을 정리하고 작은 계획을 실행한다.",
        gauge: { energylevel: 2, adaptability: 1, resilience: 0 },
      },
    ],
  },

  // 3
  {
    id: 3,
    title: "어떤 상황에서 '마음 에너지'가 가장 빨리 닳나요?",
    options: [
      {
        answerValue: 1, // MONY
        label: "낯선 사람이나 별로 친하지 않은 사람과 소통해야 할 때",
        gauge: { energylevel: -1, adaptability: -1, resilience: 1 },
      },
      {
        answerValue: 2, // TORY
        label: "사람이 많고 시끄러운 공간에 있을 때",
        gauge: { energylevel: -2, adaptability: 0, resilience: 1 },
      },
      {
        answerValue: 3, // PORY
        label: "혼자 있는 시간이 너무 길어져 고립감이 느껴질 때",
        gauge: { energylevel: -1, adaptability: 0, resilience: -1 },
      },
      {
        answerValue: 4, // KOKO
        label: "계획이 틀어져 목표를 미루거나 바꿔야 할 때",
        gauge: { energylevel: -1, adaptability: -2, resilience: 0 },
      },
    ],
  },

  // 4
  {
    id: 4,
    title: "작은 성공을 이뤘을 때, 가장 기분 좋은 칭찬은 무엇인가요?",
    options: [
      {
        answerValue: 1, // MONY
        label: "“괜찮아, 너의 속도대로 나아가면 돼.”",
        gauge: { energylevel: 0, adaptability: 0, resilience: 2 },
      },
      {
        answerValue: 2, // TORY
        label: "“오늘 페이스 조절 잘했어! 충분히 쉬어가도 좋아.”",
        gauge: { energylevel: 0, adaptability: 1, resilience: 1 },
      },
      {
        answerValue: 3, // PORY
        label: "“네가 즐거웠다니 나도 기뻐!”",
        gauge: { energylevel: 1, adaptability: 1, resilience: 0 },
      },
      {
        answerValue: 4, // KOKO
        label: "“정말 대단하다! 다음 목표는 뭐야?”",
        gauge: { energylevel: 2, adaptability: 1, resilience: 0 },
      },
    ],
  },

  // 5
  {
    id: 5,
    title: "외출할 때, 어떤 분위기의 장소가 그나마 편안해요?",
    options: [
      {
        answerValue: 1, // MONY
        label: "아늑하고 조용한 곳(동네 카페, 도서관 등)",
        gauge: { energylevel: -1, adaptability: 0, resilience: 2 },
      },
      {
        answerValue: 2, // TORY
        label: "자연을 느끼는 탁 트인 곳(공원, 산책로 등)",
        gauge: { energylevel: 1, adaptability: 1, resilience: 1 },
      },
      {
        answerValue: 3, // PORY
        label: "친한 사람과 대화하기 좋은 곳(작은 모임, 카페 등)",
        gauge: { energylevel: 1, adaptability: 1, resilience: 0 },
      },
      {
        answerValue: 4, // KOKO
        label: "활기차고 볼거리가 많은 곳(쇼핑몰, 번화가 등)",
        gauge: { energylevel: 2, adaptability: 2, resilience: -1 },
      },
    ],
  },

  // 6
  {
    id: 6,
    title: "‘리라이즈’와 함께 가장 먼저 경험하고 싶은 변화는?",
    options: [
      {
        answerValue: 1, // MONY
        label: "소소한 성취를 느끼며 일상 루틴을 회복하기",
        gauge: { energylevel: 1, adaptability: 1, resilience: 0 },
      },
      {
        answerValue: 2, // TORY
        label: "충전 루틴 만들기(수면·산책·명상 등)로 컨디션 회복",
        gauge: { energylevel: 0, adaptability: 1, resilience: 2 },
      },
      {
        answerValue: 3, // PORY
        label: "감정을 꾸준히 기록하며 나를 이해하기",
        gauge: { energylevel: 0, adaptability: 0, resilience: 1 },
      },
      {
        answerValue: 4, // KOKO
        label: "작은 목표를 정하고 바로 실행해보기",
        gauge: { energylevel: 2, adaptability: 1, resilience: 0 },
      },
    ],
  },

  // 7
  {
    id: 7,
    title: "지금 당장, 가장 시도해 볼 만한 외출은 어느 정도인가요?",
    options: [
      {
        answerValue: 1, // MONY
        label: "집 현관문 열고 1분간 바깥 공기 쐬기",
        gauge: { energylevel: -1, adaptability: 0, resilience: 2 },
      },
      {
        answerValue: 2, // TORY
        label: "익숙한 동네 한 바퀴 산책하기",
        gauge: { energylevel: 1, adaptability: 1, resilience: 1 },
      },
      {
        answerValue: 3, // PORY
        label: "친한 사람을 만나 30분 정도 대화 나누기",
        gauge: { energylevel: 1, adaptability: 1, resilience: 0 },
      },
      {
        answerValue: 4, // KOKO
        label: "상관없음! (외출 거부감 없음)",
        gauge: { energylevel: 2, adaptability: 2, resilience: 0 },
      },
    ],
  },

  // 8
  {
    id: 8,
    title: "새로운 시작을 앞둔 지금, 가장 큰 걱정거리는 무엇인가요?",
    options: [
      {
        answerValue: 1, // MONY
        label: "작심삼일: 꾸준히 못 이어갈까 봐",
        gauge: { energylevel: -1, adaptability: 0, resilience: 1 },
      },
      {
        answerValue: 2, // TORY
        label: "금방 지쳐서 페이스를 못 지킬까 봐",
        gauge: { energylevel: -1, adaptability: 0, resilience: 0 },
      },
      {
        answerValue: 3, // PORY
        label: "타인 의식: 다른 사람들의 시선이 신경 쓰여서",
        gauge: { energylevel: -1, adaptability: 0, resilience: 0 },
      },
      {
        answerValue: 4, // KOKO
        label: "방향성 부재: 무엇을 해야 할지 몰라 막막해서",
        gauge: { energylevel: 0, adaptability: -1, resilience: 0 },
      },
    ],
  },
];

export default QUESTIONS;
