// src/features/mission/api/missionAPI.js
import api from "../../../lib/apiClient";

// 6.1 주간 미션(로드맵) 조회 + 필요 시 자동 생성
export async function fetchWeeklyMissions() {
  const { data } = await api.get("/api/v1/missions/weekly");
  // 그대로 화면에서 쓰기 편한 모양으로 가공
  return {
    userId: data.userId,
    summaryMessage: data.summaryMessage,
    recommendedTheory: data.recommendedTheory,
    themes: data.themes || [],
    missions: (data.missions || []).map((m) => ({
      id: m.missionId,
      title: m.content,
      theme: m.theme,
      level: m.missionLevel,
      theory: m.theory,
      rewardExp: m.rewardExp,
      // 로드맵은 서버 상태 필드가 없으니 화면에선 처음엔 'none'
      status: "none",
    })),
  };
}

// 4.1 일일 미션 생성
export async function createDailyMissions(userInput) {
  const { data } = await api.post("/api/missions/daily", { userInput });
  return data.map((m) => ({
    id: m.userDailyMissionId,
    title: m.content,
    theme: m.theme,
    theory: m.theory,
    rewardExp: m.rewardExp,
    status: m.status, // PENDING | COMPLETED
    assignedDate: m.assignedDate,
    completedAt: m.completedAt,
  }));
}

// 4.2 오늘의 미션 조회
export async function fetchTodayMissions() {
  const { data } = await api.get("/api/missions/today");
  return (data || []).map((m) => ({
    id: m.userDailyMissionId,
    title: m.content,
    theme: m.theme,
    theory: m.theory,
    rewardExp: m.rewardExp,
    status: m.status,
    assignedDate: m.assignedDate,
    completedAt: m.completedAt,
  }));
}

// 4.3 미션 완료
export async function completeDailyMission(userDailyMissionId) {
  const { data } = await api.post("/api/missions/complete", {
    userDailyMissionId,
  });
  return {
    id: data.userDailyMissionId,
    status: data.status, // COMPLETED
    completedAt: data.completedAt,
  };
}

// 4.4 테스트 (선택)
export async function pingDailyTest() {
  const { data } = await api.get("/api/missions/test");
  return data; // "Daily Mission API is working!"
}
