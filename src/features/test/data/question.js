// ===== 은둔 성향 테스트: 문항 데이터 & 특성/캐릭터 메타 =====

export const GAUGE_LABELS = {
  energy: "에너지력",
  adapt: "적응력",
  recovery: "정서 회복력",
  affinity: "관계력",
};

export const CHARACTER_RULES = [
  {
    key: "MONY",
    name: "모니",
    descTags: ["내향·안정", "섬세함", "점진적 변화"],
    dominant: (s) => s.recovery >= s.energy && s.affinity >= s.adapt,
  },
  {
    key: "TORY",
    name: "토리",
    descTags: ["에너지 관리", "휴식 필요", "자기돌봄"],
    dominant: (s) => s.recovery >= s.affinity && s.energy <= 0,
  },
  {
    key: "PORY",
    name: "포리",
    descTags: ["감정·경험", "관계 지향", "표현력"],
    dominant: (s) => s.affinity >= s.energy && s.adapt >= s.recovery,
  },
  {
    key: "KOKO",
    name: "코코",
    descTags: ["목표 지향", "도전·탐색", "계획 실행"],
    dominant: (s) => s.energy >= s.recovery && s.adapt >= s.affinity,
  },
];

// 8문항 (각 선택지 점수는 -2 ~ +2)
const QUESTIONS = [
  // 1
  {
    id: 1,
    title: "지금 당신의 '마음 에너지'는 어떤 상태에 가장 가까운가요?",
    options: [
      {
        label: "막 땅에서 돋아난 작은 새싹 같아요.",
        score: { energy: -1, adapt: 0, recovery: 2, affinity: 0 },
      },
      {
        label: "충전이 필요한 방전 직전의 배터리 같아요.",
        score: { energy: -2, adapt: 0, recovery: 2, affinity: 0 },
      },
      {
        label: "알록달록, 어떤 색이 될지 모르는 물감 팔레트 같아요.",
        score: { energy: 0, adapt: 2, recovery: 0, affinity: 1 },
      },
      {
        label: "목표를 향해 나아갈 준비가 된 가만히 놓인 나침반 같아요.",
        score: { energy: 2, adapt: 1, recovery: 0, affinity: 0 },
      },
    ],
  },
  // 2
  {
    id: 2,
    title: "아무 방해 없는 하루가 주어진다면, 어떻게 에너지를 채우고 싶나요?",
    options: [
      {
        label: "가장 편한 공간에서 조용히 혼자만의 시간을 보낸다.",
        score: { energy: -1, adapt: 0, recovery: 2, affinity: 0 },
      },
      {
        label: "새로운 장소를 탐색하거나 흥미로운 정보를 찾아본다.",
        score: { energy: 1, adapt: 2, recovery: 0, affinity: 0 },
      },
      {
        label: "좋아하는 사람과 소소하지만 즐거운 경험을 함께한다.",
        score: { energy: 1, adapt: 1, recovery: 0, affinity: 2 },
      },
      {
        label: "미뤄둔 것들을 정리하며 생각을 비워낸다.",
        score: { energy: 0, adapt: 0, recovery: 2, affinity: 0 },
      },
    ],
  },
  // 3
  {
    id: 3,
    title: "어떤 상황에서 '마음 에너지'가 가장 빨리 닳나요?",
    options: [
      {
        label: "낯선 사람이나 별로 친하지 않은 사람과 소통해야 할 때",
        score: { energy: -1, adapt: -1, recovery: 1, affinity: -1 },
      },
      {
        label: "사람이 많고 시끄러운 공간에 있을 때",
        score: { energy: -2, adapt: 0, recovery: 1, affinity: -1 },
      },
      {
        label: "계획에 없던 예상치 못한 일이 생겼을 때",
        score: { energy: -1, adapt: -2, recovery: 1, affinity: 0 },
      },
      {
        label: "혼자 있는 시간이 너무 길어져 고립감이 느껴질 때",
        score: { energy: -1, adapt: 0, recovery: -1, affinity: 2 },
      },
    ],
  },
  // 4
  {
    id: 4,
    title: "작은 성공을 이뤘을 때, 가장 기분 좋은 칭찬은 무엇인가요?",
    options: [
      {
        label: "“괜찮아, 너의 속도대로 나아가면 돼.”",
        score: { energy: 0, adapt: 0, recovery: 2, affinity: 1 },
      },
      {
        label: "“정말 대단하다! 다음 목표는 뭐야?”",
        score: { energy: 2, adapt: 1, recovery: 0, affinity: 0 },
      },
      {
        label: "“네가 즐거웠다니 나도 기뻐!”",
        score: { energy: 1, adapt: 1, recovery: 0, affinity: 2 },
      },
      {
        label: "“수고했어. 이제 푹 쉬어도 돼.”",
        score: { energy: -1, adapt: 0, recovery: 2, affinity: 0 },
      },
    ],
  },
  // 5
  {
    id: 5,
    title: "외출할 때, 어떤 분위기의 장소가 그나마 편안해요?",
    options: [
      {
        label: "목적이 분명한 곳(서점, 영화관 등)",
        score: { energy: 0, adapt: 1, recovery: 1, affinity: 0 },
      },
      {
        label: "자연을 느끼는 탁 트인 곳(공원, 산책로 등)",
        score: { energy: 1, adapt: 1, recovery: 1, affinity: 0 },
      },
      {
        label: "아늑하고 조용한 곳(동네 카페, 도서관 등)",
        score: { energy: -1, adapt: 0, recovery: 2, affinity: 0 },
      },
      {
        label: "활기차고 볼거리가 많은 곳(쇼핑몰, 번화가 등)",
        score: { energy: 2, adapt: 2, recovery: -1, affinity: 1 },
      },
    ],
  },
  // 6
  {
    id: 6,
    title: "‘리라이즈’와 함께 가장 먼저 경험하고 싶은 변화는?",
    options: [
      {
        label: "소소한 성취감을 느끼며 일상의 활력 되찾기",
        score: { energy: 1, adapt: 1, recovery: 0, affinity: 0 },
      },
      {
        label: "나에게 맞는 새로운 장소/취미 발견",
        score: { energy: 1, adapt: 2, recovery: 0, affinity: 0 },
      },
      {
        label: "감정을 꾸준히 기록하며 나를 이해하기",
        score: { energy: 0, adapt: 0, recovery: 1, affinity: 2 },
      },
      {
        label: "하루에 한 번은 웃을 일 만들기",
        score: { energy: 0, adapt: 1, recovery: 1, affinity: 2 },
      },
    ],
  },
  // 7
  {
    id: 7,
    title: "지금 당장, 가장 시도해 볼 만한 외출은 어느 정도인가요?",
    options: [
      {
        label: "집 현관문 열고 1분간 바깥 공기 쐬기",
        score: { energy: -1, adapt: 0, recovery: 2, affinity: 0 },
      },
      {
        label: "집 앞 편의점/카페에 5분 다녀오기",
        score: { energy: 0, adapt: 1, recovery: 1, affinity: 0 },
      },
      {
        label: "익숙한 동네 한 바퀴 산책하기",
        score: { energy: 1, adapt: 1, recovery: 1, affinity: 0 },
      },
      {
        label: "대중교통으로 1~2 정거장 이동하기",
        score: { energy: 2, adapt: 2, recovery: 0, affinity: 0 },
      },
      {
        label: "상관없음! (외출 거부감 없음)",
        score: { energy: 2, adapt: 2, recovery: 0, affinity: 1 },
      },
    ],
  },
  // 8
  {
    id: 8,
    title: "새로운 시작을 앞둔 지금, 가장 큰 걱정거리는 무엇인가요?",
    options: [
      {
        label: "작심삼일: 금방 포기할까 봐",
        score: { energy: -1, adapt: 0, recovery: 1, affinity: 0 },
      },
      {
        label: "타인 의식: 다른 사람들의 시선이 신경 쓰여서",
        score: { energy: -1, adapt: 0, recovery: 0, affinity: 2 },
      },
      {
        label: "방향성 부재: 무엇을 해야 할지 몰라 막막해서",
        score: { energy: 0, adapt: -1, recovery: 0, affinity: 0 },
      },
      {
        label: "효과 의심: 기대만큼 변화가 없을까 봐",
        score: { energy: 0, adapt: 0, recovery: -1, affinity: 0 },
      },
    ],
  },
];

export default QUESTIONS;
