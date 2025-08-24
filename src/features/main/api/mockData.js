/**
 * 메인 페이지 Mock 데이터
 * 백엔드 API 응답과 동일한 구조로 작성
 */

export const mockMainData = {
  character_status: {
    character_id: 101,
    type: "김멋사",
    level: 3,
    exp: 85,
    exp_to_next_level: 120,
    active_skin_item_id: 301
  },
  daily_missions: [
    {
      mission_id: 201,
      title: "기분이 좋게끔 간단한 산책 해보기",
      description: "캐릭터와 함께 집 근처를 5분 이상 걸어보세요.",
      reward_point: 25,
      is_completed: true
    },
    {
      mission_id: 202, 
      title: "방/생활 정리 10분",
      description: "10분 동안 주변을 정리정돈 해보세요.",
      reward_point: 15,
      is_completed: true
    },
    {
      mission_id: 203,
      title: "좋아하는 음악과 함께 스트레칭 또는 명상하기",
      description: "좋아하는 음악과 함께 스트레칭이나 명상을 해보세요.",
      reward_point: 30,
      is_completed: false
    },
    {
      mission_id: 204,
      title: "오늘 한 가지 새로운 행동 시도하기",
      description: "평소와 다른 새로운 일을 하나 시도해보세요.",
      reward_point: 20,
      is_completed: false
    },
    {
      mission_id: 205,
      title: "차분한 시간 가지기",
      description: "차나 커피를 마시며 5분간 여유로운 시간을 보내보세요.",
      reward_point: 10,
      is_completed: false
    }
  ],
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
 * Mock 데이터 업데이트 헬퍼 함수들
 */
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
