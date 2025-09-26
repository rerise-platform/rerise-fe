/**
 * 메인 페이지 API 호출용 목업 데이터(Mock Data)
 * Rerise 백엔드 메인 페이지 API 응답 구조와 동일
 */

export const mockMainPageData = {
  userId: 123,
  nickname: "김멋사",
  characterInfo: {
    characterId: 1,
    characterName: "모니",
    characterType: "mony",
    level: 5,
    experience: 170,
    stage: 2
  },
  recentRecord: {
    recordId: 10,
    emotionLevel: 4,
    keywords: ["행복", "성취감"],
    memo: "오늘은 좋은 하루였다",
    recordedAt: "2024-08-24"
  },
  todayMissions: [
    {
      userDailyMissionId: 1,
      missionId: 15,
      content: "5분간 간단한 스트레칭으로 몸 풀어주기",
      theme: "몸돌보기",
      theory: "BEHAVIORAL_ACTIVATION",
      status: "PENDING"
    },
    {
      userDailyMissionId: 2,
      missionId: 22,
      content: "좋아하는 음악 한 곡 들으며 휴식하기",
      theme: "마음챙김",
      theory: "MINDFULNESS",
      status: "COMPLETED"
    },
    {
      userDailyMissionId: 3,
      missionId: 8,
      content: "감사한 일 3가지 떠올려보기",
      theme: "긍정사고",
      theory: "COGNITIVE_RESTRUCTURING",
      status: "PENDING"
    },
    {
      userDailyMissionId: 4,
      missionId: 31,
      content: "주변 정리하기 (10분)",
      theme: "생활관리",
      theory: "BEHAVIORAL_ACTIVATION",
      status: "COMPLETED"
    },
    {
      userDailyMissionId: 5,
      missionId: 19,
      content: "밖으로 나가 짧은 산책하기",
      theme: "활동증진",
      theory: "BEHAVIORAL_ACTIVATION",
      status: "PENDING"
    }
  ]
};

// 기존 호환성을 위한 데이터 (기존 컴포넌트에서 사용 중)
export const mockMainData = {
  character_status: {
    character_id: mockMainPageData.characterInfo.characterId,
    type: mockMainPageData.nickname,
    level: mockMainPageData.characterInfo.level,
    exp: 170,
    exp_to_next_level: 200,
    active_skin_item_id: 301
  },
  daily_missions: mockMainPageData.todayMissions.map(mission => ({
    mission_id: mission.userDailyMissionId,
    title: mission.content,
    description: `${mission.theme} - ${mission.theory}`,
    reward_point: 25,
    is_completed: mission.status === "COMPLETED"
  })),
  recorded_at: [
    "2025-01-20",
    "2025-01-21", 
    "2025-01-22",
    "2025-01-23"
  ]
};

/**
 * 오늘의 감정 상태 Mock 데이터 (추가 기능용)
 */
export const mockTodayEmotion = {
  emotion_id: 1,
  emotion_type: "happy",
  emotion_name: "기쁨",
  emotion_icon: "😊",
  recorded_at: "2025-01-23T10:30:00Z"
};

/**
 * 감정 기록 Mock 데이터 - GET /api/v1/records/date/{date}
 * 날짜별로 다른 감정 기록 데이터를 제공
 */
export const mockEmotionRecords = {
  "2025-09-27": {
    record_id: 125,
    emotion_level: 4,
    keywords: "활기찬, 신나는, 설레는",
    memo: "오늘은 기분이 정말 좋았다! 오랜만에 날씨도 좋고 친구들도 만나고 즐거운 시간을 보냈다.",
    recordedAt: "2025-09-27"
  },
  "2025-01-23": {
    record_id: 123,
    emotion_level: 1,
    keywords: "행복, 성취감, 만족",
    memo: "오늘은 정말 좋은 하루였다. 목표했던 일을 모두 완료했고 기분이 상쾌하다.",
    recordedAt: "2025-01-23"
  },
  "2025-01-22": {
    record_id: 122,
    emotion_level: 3,
    keywords: "평온, 안정감, 여유",
    memo: "차분하고 평온한 하루를 보냈다. 스트레스 없이 일상을 즐겼다.",
    recordedAt: "2025-01-22"
  },
  "2025-01-21": {
    record_id: 121,
    emotion_level: 2,
    keywords: "피곤, 무기력, 조금 우울",
    memo: "오늘은 좀 힘들었다. 에너지가 부족하고 무언가 해내기 어려웠다.",
    recordedAt: "2025-01-21"
  },
  "2025-01-20": {
    record_id: 120,
    emotion_level: 5,
    keywords: "기쁨, 흥미진진, 에너지 충만",
    memo: "완벽한 하루였다! 모든 일이 계획대로 진행되고 새로운 도전도 성공했다.",
    recordedAt: "2025-01-20"
  }
};

// 오늘의 기본 감정 기록 (현재 날짜 기준)
export const mockEmotionRecord = mockEmotionRecords[new Date().toISOString().split('T')[0]] || {
  record_id: null,
  emotion_level: null,
  keywords: "",
  memo: "",
  recordedAt: null
};

// 감정 기록이 없는 경우의 더미 데이터
export const mockEmptyEmotionRecord = {
  record_id: null,
  emotion_level: 2,
  keywords: "",
  memo: "",
  recordedAt: null
};

/**
 * 추가 테스트용 목업 데이터 변형들
 */

// 다른 사용자 데이터 예시
export const mockMainPageDataVariant1 = {
  userId: 456,
  nickname: "힐링왕자",
  characterInfo: {
    characterId: 2,
    characterName: "토리",
    characterType: "tory",
    level: 3,
    experience: 85,
    stage: 1
  },
  recentRecord: {
    recordId: 20,
    emotionLevel: 2,
    keywords: ["피곤", "스트레스"],
    memo: "오늘은 조금 힘든 하루였지만 그래도 버텨냈다",
    recordedAt: "2024-08-23"
  },
  todayMissions: [
    {
      userDailyMissionId: 6,
      missionId: 12,
      content: "깊게 숨쉬기 5분",
      theme: "마음챙김",
      theory: "MINDFULNESS",
      status: "PENDING"
    },
    {
      userDailyMissionId: 7,
      missionId: 25,
      content: "따뜻한 차 한 잔 마시며 휴식",
      theme: "자기돌봄",
      theory: "SELF_CARE",
      status: "COMPLETED"
    }
  ]
};

// 감정 기록이 없는 사용자 데이터 예시
export const mockMainPageDataNoRecord = {
  userId: 789,
  nickname: "새싹이",
  characterInfo: {
    characterId: 3,
    characterName: "코코",
    characterType: "koko",
    level: 1,
    experience: 0,
    stage: 1
  },
  recentRecord: null,
  todayMissions: [
    {
      userDailyMissionId: 8,
      missionId: 1,
      content: "첫 번째 미션: 자기소개하기",
      theme: "시작하기",
      theory: "BEHAVIORAL_ACTIVATION",
      status: "PENDING"
    }
  ]
};

/**
 * Mock 데이터 업데이트 헬퍼 함수들
 */

// 새로운 API 구조용 미션 상태 업데이트
export const updateMockMainPageMissionStatus = (userDailyMissionId, status) => {
  const mission = mockMainPageData.todayMissions.find(m => m.userDailyMissionId === userDailyMissionId);
  if (mission) {
    const wasCompleted = mission.status === "COMPLETED";
    mission.status = status;
    
    // 경험치 업데이트
    const expGain = 25; // 기본 경험치
    if (status === "COMPLETED" && !wasCompleted) {
      // 완료 시 경험치 추가
      mockMainPageData.characterInfo.experience += expGain;
    } else if (status !== "COMPLETED" && wasCompleted) {
      // 미완료 시 경험치 차감
      mockMainPageData.characterInfo.experience = Math.max(0, 
        mockMainPageData.characterInfo.experience - expGain);
    }
    
    // 레벨업 체크 (경험치 200마다 레벨업)
    const expPerLevel = 200;
    const newLevel = Math.floor(mockMainPageData.characterInfo.experience / expPerLevel) + 1;
    if (newLevel > mockMainPageData.characterInfo.level) {
      mockMainPageData.characterInfo.level = newLevel;
      // 스테이지도 함께 업데이트 (레벨 2마다 스테이지 증가)
      mockMainPageData.characterInfo.stage = Math.floor(newLevel / 2) + 1;
    }
    
    return mission;
  }
  return null;
};

// 기존 호환성을 위한 함수
export const updateMockMissionStatus = (missionId, isCompleted) => {
  const mission = mockMainData.daily_missions.find(m => m.mission_id === missionId);
  if (mission) {
    const wasCompleted = mission.is_completed;
    mission.is_completed = isCompleted;
    
    // 경험치 업데이트
    if (isCompleted && !wasCompleted) {
      // 완료 시 경험치 추가
      mockMainData.character_status.exp += mission.reward_point;
    } else if (!isCompleted && wasCompleted) {
      // 미완료 시 경험치 차감
      mockMainData.character_status.exp = Math.max(0, 
        mockMainData.character_status.exp - mission.reward_point);
    }
    
    // 레벨업 체크
    while (mockMainData.character_status.exp >= mockMainData.character_status.exp_to_next_level) {
      mockMainData.character_status.exp -= mockMainData.character_status.exp_to_next_level;
      mockMainData.character_status.level += 1;
      mockMainData.character_status.exp_to_next_level = 100 + (mockMainData.character_status.level * 20);
    }
    
    return mission;
  }
  return null;
};
