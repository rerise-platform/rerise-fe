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
      title: "🚶‍♂️ 기분이 좋게끔 간단한 산책 해보기",
      description: "캐릭터와 함께 집 근처를 5분 이상 걸어보세요.",
      reward_point: 25,
      is_completed: true
    },
    {
      mission_id: 202, 
      title: "🧘 방/생활 정리 10분",
      description: "10분 동안 주변을 정리정돈 해보세요.",
      reward_point: 15,
      is_completed: true
    },
    {
      mission_id: 203,
      title: "🎵 좋아하는 음악과 함께 스트레칭 또는 명상하기",
      description: "좋아하는 음악과 함께 스트레칭이나 명상을 해보세요.",
      reward_point: 30,
      is_completed: false
    },
    {
      mission_id: 204,
      title: "📝 오늘 한 가지 새로운 행동 시도하기",
      description: "평소와 다른 새로운 일을 하나 시도해보세요.",
      reward_point: 20,
      is_completed: false
    },
    {
      mission_id: 205,
      title: "☕ 차분한 시간 가지기",
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
