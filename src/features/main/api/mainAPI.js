import api from '../../../lib/apiClient';
import { mockMainData, updateMockMissionStatus, mockEmotionRecords, mockEmptyEmotionRecord } from './mockData.js';
import { getCharacterImage } from '../../../shared/utils/characterImageMapper.js';

// 개발 모드 설정 (true: Mock 데이터 사용, false: 실제 API 사용)
const USE_MOCK_DATA = false;

/**
 * 메인 화면 데이터 조회 API 호출 함수
 * 백엔드 API와 통신하여 사용자의 캐릭터 정보를 조회
 * 
 * @returns {Promise<Object>} 메인 화면 데이터 (nickname, characterType, characterStage, level, growthRate)
 * @throws {Error} API 호출 실패 시 에러 객체
 */
export const getMainScreenData = async () => {
  try {
    // Mock 데이터 사용 모드
    if (USE_MOCK_DATA) {
      console.log('🧪 Mock 데이터 사용 중...');
      
      // 실제 API 호출처럼 약간의 지연 시간 추가
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockMainData;
    }

    // 실제 API 호출 모드
    const response = await api.get('/api/v1/main');
    
    // 백엔드 API 응답을 프론트엔드에서 사용하는 구조로 변환
    const data = response.data;
    
    // 온보딩 완료 여부 확인
    const isOnboardingComplete = data.characterType !== null && 
                                data.characterStage !== null && 
                                data.level !== null && 
                                data.growthRate !== null;
    
    return {
      nickname: data.nickname,
      isOnboardingComplete,
      character_status: isOnboardingComplete ? {
        nickname: data.nickname,
        level: data.level,
        exp: Math.floor(data.growthRate * 10), // growthRate를 exp로 변환 (65.5 → 655)
        exp_to_next_level: 1000,
        character_type: data.characterType,
        character_stage: data.characterStage,
        character_image: getCharacterImage(data.characterType, data.characterStage), // 이미지 매핑 추가
        growth_rate: data.growthRate
      } : null,
      daily_missions: [], // 미션 데이터는 별도 API에서 가져올 예정
      emotion_records: [] // 감정 기록도 별도 API에서 가져올 예정
    };
  } catch (error) {
    console.error('메인 화면 데이터 조회 실패:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * 오늘의 일일 미션 조회 API
 * 
 * @returns {Promise<Array>} 오늘의 미션 목록
 * @throws {Error} API 호출 실패 시 에러 객체
 */
export const getTodayMissions = async () => {
  try {
    // Mock 데이터 사용 모드
    if (USE_MOCK_DATA) {
      console.log('🧪 Mock: 오늘의 미션 조회 중...');
      
      // 실제 API 호출처럼 약간의 지연 시간 추가
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock 데이터에서 미션 목록 반환
      return mockMainData.daily_missions || [];
    }

    // 실제 API 호출 모드
    const response = await api.get('/api/missions/today');
    
    // API 응답을 프론트엔드 형식으로 변환
    return response.data.map(mission => ({
      mission_id: mission.userDailyMissionId,
      title: mission.content,
      theme: mission.theme,
      theory: mission.theory,
      reward_exp: mission.rewardExp,
      is_completed: mission.status === 'COMPLETED',
      assigned_date: mission.assignedDate,
      completed_date: mission.completedDate
    }));
  } catch (error) {
    console.error('오늘의 미션 조회 실패:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * 일일 미션 완료 상태 업데이트 API
 * 
 * @param {number} userDailyMissionId - 사용자 일일 미션 ID
 * @returns {Promise<Object>} 미션 완료 처리 결과
 * @throws {Error} API 호출 실패 시 에러 객체
 */
export const completeMission = async (userDailyMissionId) => {
  try {
    // Mock 데이터 사용 모드
    if (USE_MOCK_DATA) {
      console.log(`🧪 Mock: 미션 ${userDailyMissionId} 완료 상태 토글 중...`);
      
      // Mock 데이터에서 미션 상태 업데이트
      const mission = updateMockMissionStatus(userDailyMissionId, true);
      
      // 실제 API 호출처럼 약간의 지연 시간 추가
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (mission) {
        return { 
          success: true, 
          message: `미션 "${mission.title}" 완료!`,
          reward_exp: mission.reward_exp,
          new_exp: mockMainData.character_status.exp,
          new_level: mockMainData.character_status.level
        };
      }
    }

    // 실제 API 호출 모드
    const response = await api.post('/api/missions/complete', {
      userDailyMissionId: userDailyMissionId
    });
    
    // API 응답을 프론트엔드 형식으로 변환
    const mission = response.data;
    return {
      success: true,
      mission_id: mission.userDailyMissionId,
      title: mission.content,
      reward_exp: mission.rewardExp,
      status: mission.status,
      completed_date: mission.completedDate
    };
  } catch (error) {
    console.error('미션 완료 처리 실패:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * 특정 날짜의 감정 기록 조회 API
 * 
 * @param {string} date - 조회할 날짜 (YYYY-MM-DD 형식)
 * @returns {Promise<Object>} 감정 기록 데이터
 * @throws {Error} API 호출 실패 시 에러 객체
 */
export const getEmotionRecord = async (date) => {
  try {
    // Mock 데이터 사용 모드
    if (USE_MOCK_DATA) {
      console.log(`🧪 Mock: 감정 기록 조회 중... (${date})`);
      
      // 실제 API 호출처럼 약간의 지연 시간 추가
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 해당 날짜의 감정 기록이 있으면 반환, 없으면 빈 데이터 반환
      return mockEmotionRecords[date] || mockEmptyEmotionRecord;
    }

    // 실제 API 호출 모드
    const response = await api.get(`/api/v1/records/date/${date}`);
    
    return response.data;
  } catch (error) {
    console.error('감정 기록 조회 실패:', error);
    throw error.response?.data || error.message;
  }
};
