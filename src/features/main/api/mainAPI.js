import axios from 'axios';
import { mockMainData, updateMockMissionStatus, mockEmotionRecord } from './mockData.js';

// 개발 모드 설정 (true: Mock 데이터 사용, false: 실제 API 사용)
const USE_MOCK_DATA = true;

/**
 * 메인 화면 대시보드 데이터 조회 API 호출 함수
 * 캐릭터 상태, 오늘의 미션, 감정 기록 캘린더 데이터를 한 번에 조회
 * 
 * @returns {Promise<Object>} 메인 화면 데이터 (캐릭터 상태, 일일 미션, 감정 기록 날짜)
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
    const token = localStorage.getItem('authToken');
    
    const response = await axios.get('/api/v1/main', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('메인 화면 데이터 조회 실패:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * 일일 미션 완료 상태 업데이트 API (추가로 필요할 수 있는 API)
 * 
 * @param {number} missionId - 미션 ID
 * @returns {Promise<Object>} 미션 완료 처리 결과
 * @throws {Error} API 호출 실패 시 에러 객체
 */
export const completeMission = async (missionId) => {
  try {
    // Mock 데이터 사용 모드
    if (USE_MOCK_DATA) {
      console.log(`🧪 Mock: 미션 ${missionId} 완료 상태 토글 중...`);
      
      // Mock 데이터에서 미션 상태 업데이트
      const mission = updateMockMissionStatus(missionId, true);
      
      // 실제 API 호출처럼 약간의 지연 시간 추가
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (mission) {
        return { 
          success: true, 
          message: `미션 "${mission.title}" 완료!`,
          reward_point: mission.reward_point,
          new_exp: mockMainData.character_status.exp,
          new_level: mockMainData.character_status.level
        };
      }
    }

    // 실제 API 호출 모드
    const token = localStorage.getItem('authToken');
    
    const response = await axios.patch(`/api/v1/missions/${missionId}/complete`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
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
      
      return mockEmotionRecord;
    }

    // 실제 API 호출 모드
    const token = localStorage.getItem('authToken');
    
    const response = await axios.get(`/api/records/${date}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('감정 기록 조회 실패:', error);
    throw error.response?.data || error.message;
  }
};
