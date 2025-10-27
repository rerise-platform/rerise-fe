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
    const apiData = response.data;
    
    console.log('✅ [API DEBUG] 원본 API 응답:', JSON.stringify(apiData, null, 2));
    console.log('👤 [API DEBUG] 닉네임 직접 확인:', apiData.nickname);
    console.log('🎭 [API DEBUG] 캐릭터 정보:', {
      type: apiData.characterType,
      stage: apiData.characterStage
    });
    console.log('📊 [API DEBUG] 레벨/성장률:', {
      level: apiData.level,
      growthRate: apiData.growthRate
    });
    console.log('🎯 [API DEBUG] 미션 개수:', apiData.dailyMissions?.length || 0);

    // 실서비스 긴급 디버깅 - API 응답 직접 확인
    if (typeof window !== 'undefined') {
      window.__rawApiResponse = apiData;
      console.log('🔍 [API DEBUG] window.__rawApiResponse에 원본 API 응답 저장됨');
    }

    // API 응답이 이미 올바른 형식이므로 직접 사용
    // 온보딩 완료 여부 확인
    const isOnboardingComplete = apiData.characterType !== null && 
                                apiData.characterType !== undefined;

    // growthRate를 백분율에서 경험치로 변환 (임시 계산)
    const baseExp = 1000; // 기본 경험치
    const calculatedExp = Math.floor((apiData.growthRate || 0) * baseExp / 100);
    const expToNextLevel = baseExp;

    // 미션 데이터 정규화
    const normalizedMissions = Array.isArray(apiData.dailyMissions) 
      ? apiData.dailyMissions.map(mission => {
          console.log('🎯 [MISSION DEBUG] 미션 정규화:', {
            userDailyMissionId: mission.userDailyMissionId,
            content: mission.content,
            status: mission.status,
            isCompleted: mission.status === 'COMPLETED'
          });
          
          return {
            mission_id: mission.userDailyMissionId,
            title: mission.content,
            theme: mission.theme,
            theory: mission.theory,
            is_completed: mission.status === 'COMPLETED'
          };
        })
      : [];

    // API 응답을 MainPage에서 사용하는 형식으로 변환
    const transformedData = {
      // 기본 사용자 정보 - API 응답 그대로 사용
      nickname: apiData.nickname,
      
      // 캐릭터 정보 - API 응답 그대로 사용
      characterType: apiData.characterType || 'mony',
      characterStage: apiData.characterStage || 1,
      characterName: apiData.characterName || '모니',
      
      // 레벨/경험치 정보
      level: apiData.level || 1,
      exp: calculatedExp,
      exp_to_next_level: expToNextLevel,
      growthRate: apiData.growthRate,
      
      // 온보딩 상태
      isOnboardingComplete,
      
      // 미션 데이터
      daily_missions: normalizedMissions,
      
      // 레거시 지원을 위한 중첩 구조 (기존 코드 호환성)
      character_status: isOnboardingComplete ? {
        nickname: apiData.nickname,
        level: apiData.level || 1,
        exp: calculatedExp,
        exp_to_next_level: expToNextLevel,
        character_type: apiData.characterType || 'mony',
        character_stage: apiData.characterStage || 1,
        character_image: getCharacterImage(apiData.characterType || 'mony', apiData.characterStage || 1),
        character_name: apiData.characterName || '모니'
      } : null
    };

    console.log('✅ [TRANSFORM DEBUG] 최종 변환 데이터:', JSON.stringify(transformedData, null, 2));
    console.log('✅ [TRANSFORM DEBUG] 닉네임 매핑 확인:', {
      'API응답 nickname': apiData.nickname,
      '변환후 nickname': transformedData.nickname,
      '변환후 character_status.nickname': transformedData.character_status?.nickname
    });
    
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
    const missions = response.data.dailyMissions || [];
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