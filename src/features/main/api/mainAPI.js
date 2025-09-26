import api from '../../../lib/apiClient';
import { mockMainData, mockMainPageData, updateMockMissionStatus, mockEmotionRecords, mockEmptyEmotionRecord } from './mockData.js';

// 개발 모드 설정 (true: Mock 데이터 사용, false: 실제 API 사용)
const USE_MOCK_DATA = false;

/**
 * 메인 페이지 데이터를 조회합니다. (Redux Toolkit 용)
 * @returns {Promise} API 응답 결과
 * 
 * 응답 형식:
 * {
 *   "userId": 123,
 *   "nickname": "testuser",
 *   "characterInfo": {
 *     "characterId": 1,
 *     "characterName": "모니",
 *     "characterType": "mony",
 *     "level": 5,
 *     "experience": 120,
 *     "stage": 2
 *   },
 *   "recentRecord": {
 *     "recordId": 10,
 *     "emotionLevel": 4,
 *     "keywords": ["행복", "성취감"],
 *     "memo": "오늘은 좋은 하루였다",
 *     "recordedAt": "2024-08-24"
 *   },
 *   "todayMissions": [
 *     {
 *       "userDailyMissionId": 1,
 *       "missionId": 15,
 *       "content": "5분간 간단한 스트레칭으로 몸 풀어주기",
 *       "theme": "몸돌보기",
 *       "theory": "BEHAVIORAL_ACTIVATION",
 *       "status": "PENDING"
 *     }
 *   ]
 * }
 */
export const fetchMainPageData = async () => {
  try {
    // Mock 데이터 사용 모드
    if (USE_MOCK_DATA) {
      console.log('🧪 Mock 데이터 사용 중...');
      
      // 실제 API 호출처럼 약간의 지연 시간 추가
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 데이터 구조 디버깅 로그
      console.log('📊 목데이터 구조:', mockMainPageData);
      
      // 목데이터를 직접 반환 (구조를 유지함)
      return mockMainPageData;
    }
    
    // JWT 토큰 가져오기 (apiClient.js의 interceptors에서 처리)
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('인증 정보가 없습니다. 다시 로그인해주세요.');
    }
    
    // 실제 API 호출
    const response = await api.get('/api/v1/main');
    const responseData = response.data;
    
    // 백엔드 응답을 프론트엔드에서 사용하는 형식으로 변환
    return {
      userId: responseData.userId,
      nickname: responseData.nickname,
      character_status: responseData.characterInfo ? {
        id: responseData.characterInfo.characterId,
        nickname: responseData.nickname,
        type: responseData.characterInfo.characterType,
        level: responseData.characterInfo.level,
        exp: responseData.characterInfo.experience,
        exp_to_next_level: 1000, // 백엔드에서 제공되지 않는 정보는 기본값 설정
        character_type: responseData.characterInfo.characterType,
        character_stage: responseData.characterInfo.stage,
        character_name: responseData.characterInfo.characterName
      } : null,
      daily_missions: responseData.todayMissions ? responseData.todayMissions.map(mission => ({
        mission_id: mission.userDailyMissionId,
        title: mission.content,
        theme: mission.theme,
        theory: mission.theory,
        is_completed: mission.status === 'COMPLETED'
      })) : [],
      recent_record: responseData.recentRecord ? {
        record_id: responseData.recentRecord.recordId,
        emotion_level: responseData.recentRecord.emotionLevel,
        keywords: responseData.recentRecord.keywords,
        memo: responseData.recentRecord.memo,
        recorded_at: responseData.recentRecord.recordedAt
      } : null
    };
  } catch (error) {
    // 에러가 발생하면 예외를 던져 createAsyncThunk에서 처리할 수 있게 합니다.
    if (error.response) {
      // 서버에서 응답을 받았지만 2xx 범위를 벗어난 상태 코드가 반환된 경우
      throw new Error(error.response.data?.message || '서버에서 오류가 발생했습니다.');
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      // 요청 설정 중에 문제가 발생한 경우
      throw new Error(error.message || '요청 설정 중 오류가 발생했습니다.');
    }
  }
};

/**
 * 메인 화면 데이터 조회 API 호출 함수
 * 백엔드 API와 통신하여 사용자의 캐릭터 정보를 조회
 * 
 * @returns {Promise<Object>} 메인 화면 데이터 (nickname, characterType, characterStage, level, growthRate)
 * @throws {Error} API 호출 실패 시 에러 객체
 * 
 * @deprecated getMainScreenData는 더 이상 사용되지 않습니다. fetchMainPageData를 사용하세요.
 */
export const getMainScreenData = async () => {
  console.warn('getMainScreenData는 더 이상 사용되지 않습니다. fetchMainPageData를 사용하세요.');
  try {
    return await fetchMainPageData();
  } catch (error) {
    console.error('메인 화면 데이터 조회 실패:', error);
    throw error;
  }
};

/**
 * 오늘의 일일 미션 조회 API
 * 주의: 메인 API에서 통합 제공하므로 별도 호출은 필요시에만 사용
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
    
    // JWT 토큰 확인 (apiClient.js의 interceptors에서 처리)
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('인증 정보가 없습니다. 다시 로그인해주세요.');
    }

    // 실제 API 호출 모드 - 메인 API에서 미션 데이터도 함께 제공됨
    const response = await api.get('/api/v1/main');
    
    // API 응답에서 미션 데이터만 추출하여 변환
    const missions = response.data.todayMissions || [];
    return missions.map(mission => ({
      mission_id: mission.userDailyMissionId,
      title: mission.content,
      theme: mission.theme,
      theory: mission.theory,
      is_completed: mission.status === 'COMPLETED'
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
    
    // JWT 토큰 확인 (apiClient.js의 interceptors에서 처리)
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('인증 정보가 없습니다. 다시 로그인해주세요.');
    }

    // 실제 API 호출 모드 - 백엔드 API 명세 기준으로 업데이트
    const response = await api.post('/api/v1/missions/complete', {
      userDailyMissionId: userDailyMissionId
    });
    
    // API 응답을 프론트엔드 형식으로 변환
    const mission = response.data;
    return {
      success: true,
      mission_id: mission.userDailyMissionId,
      title: mission.content,
      reward_exp: mission.rewardExp || 0,
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
    
    // JWT 토큰 확인 (apiClient.js의 interceptors에서 처리)
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('인증 정보가 없습니다. 다시 로그인해주세요.');
    }

    // 실제 API 호출 모드
    const response = await api.get(`/api/v1/records/date/${date}`);
    
    return response.data;
  } catch (error) {
    console.error('감정 기록 조회 실패:', error);
    throw error.response?.data || error.message;
  }
};
