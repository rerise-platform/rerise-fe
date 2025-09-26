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
    console.log('🔍 메인 API 호출 시작: /api/v1/main');
    const response = await api.get('/api/v1/main');
    console.log('✅ 메인 API 응답:', response.data);
    
    // 백엔드 API 응답을 프론트엔드에서 사용하는 구조로 변환
    const data = response.data;
    console.log('🔍 원본 API 데이터:', data);
    console.log('🔍 닉네임 필드:', data.nickname);
    console.log('🔍 캐릭터타입 필드:', data.characterType);
    console.log('🔍 캐릭터단계 필드:', data.characterStage);
    
    // 온보딩 완료 여부 확인 (characterType이 있는지 확인)
    const isOnboardingComplete = data.characterType !== null && 
                                data.characterType !== undefined;
    
    // MainPage.jsx에서 직접 접근할 수 있도록 플랫 구조로 변환
    const transformedData = {
      // 기본 사용자 정보 (MainPage에서 mainData?.nickname으로 접근)
      userId: data.userId || data.id,
      nickname: data.nickname,
      
      // 캐릭터 정보 (MainPage에서 mainData?.characterType으로 접근)  
      characterType: data.characterType || 'mony',
      characterStage: data.characterStage || 1,
      characterName: data.characterName || '모니',
      
      // 레벨/경험치 정보
      level: data.level || 1,
      exp: data.experience || 0,
      exp_to_next_level: 1000,
      
      // 온보딩 상태
      isOnboardingComplete,
      
      // 미션 데이터
      daily_missions: data.todayMissions || data.missions || [],
      
      // 최근 기록
      recent_record: data.recentRecord || null,
      
      // 레거시 지원을 위한 중첩 구조 (기존 코드 호환성)
      character_status: isOnboardingComplete ? {
        nickname: data.nickname,
        level: data.level || 1,
        exp: data.experience || 0,
        exp_to_next_level: 1000,
        character_type: data.characterType || 'mony',
        character_stage: data.characterStage || 1,
        character_image: getCharacterImage(data.characterType || 'mony', data.characterStage || 1),
        character_name: data.characterName || '모니'
      } : null
    };
    
    console.log('✅ 변환된 데이터:', transformedData);
    console.log('✅ 최종 닉네임:', transformedData.nickname);
    
    return transformedData;
  } catch (error) {
    console.error('메인 화면 데이터 조회 실패:', error);
    throw error.response?.data || error.message;
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

    // 실제 API 호출 모드 - 메인 API에서 미션 데이터도 함께 제공됨
    // 별도 미션 API가 필요한 경우에만 사용
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
