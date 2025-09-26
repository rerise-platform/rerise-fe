import api from '../../../lib/apiClient';

/**
 * 일기 기록 생성/수정 API 호출 함수
 * 서버에 감정 일기 정보를 전송하여 기록을 처리
 * 
 * @param {Object} recordData - 일기 기록 데이터
 * @param {number} recordData.emotion_level - 감정 레벨 (1-5)
 * @param {string} recordData.keywords - 감정 키워드들 (쉼표로 구분)
 * @param {string} recordData.memo - 일기 내용
 * @param {string} recordData.recordedAt - 기록 날짜 (YYYY-MM-DD)
 * @returns {Promise<Object>} 생성된 기록 데이터
 * @throws {Error} 기록 실패 시 에러 객체
 */
export const createOrUpdateRecord = async (recordData) => {
  try {
    const response = await api.post('/api/v1/records', {
      emotion_level: recordData.emotion_level,
      keywords: recordData.keywords,
      memo: recordData.memo,
      recordedAt: recordData.recordedAt
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * 특정 날짜 일기 조회 API 호출 함수
 * 
 * @param {string} date - 조회할 날짜 (YYYY-MM-DD)
 * @returns {Promise<Object|null>} 해당 날짜의 기록 데이터, 없으면 null
 * @throws {Error} 조회 실패 시 에러 객체
 */
export const getRecordByDate = async (date) => {
  try {
    const response = await api.get(`/api/v1/records/date/${date}`);
    
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error.response?.data || error.message;
  }
};

/**
 * 월별 캘린더 데이터 조회 API 호출 함수
 * 특정 연도와 월의 감정 기록 데이터를 조회
 * 
 * @param {number} year - 조회할 연도 (YYYY)
 * @param {number} month - 조회할 월 (1-12)
 * @returns {Promise<Object>} 해당 월의 캘린더 데이터
 * @throws {Error} 조회 실패 시 에러 객체
 */
export const getCalendarByMonth = async (year, month) => {
  try {
    console.log(`🔍 [CALENDAR API] ${year}년 ${month}월 캘린더 데이터 조회 요청`);
    
    const response = await api.get(`/api/v1/records/calendar/${year}/${month}`);
    
    console.log('✅ [CALENDAR API] 캘린더 데이터 조회 성공');
    console.log('📋 [CALENDAR API] 응답 상태:', response.status, response.statusText);
    console.log('📄 [CALENDAR API] 응답 데이터:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('❌ [CALENDAR API] 캘린더 데이터 조회 에러 발생!');
    console.error('🚫 [CALENDAR API] 에러 타입:', error.name);
    console.error('💥 [CALENDAR API] 에러 메시지:', error.message);
    console.error('📡 [CALENDAR API] 응답 상태:', error.response?.status);
    console.error('📄 [CALENDAR API] 응답 데이터:', error.response?.data);
    
    // 에러 발생 시 처리
    if (error.response) {
      // 서버 응답이 있는 경우
      const errorMsg = error.response.data || `${year}년 ${month}월 캘린더 데이터 조회에 실패했습니다.`;
      throw new Error(errorMsg);
    } else if (error.request) {
      // 요청이 전송되었지만 응답이 없는 경우
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인하세요.');
    } else {
      // 그 외의 에러
      throw new Error(error.message || '알 수 없는 오류가 발생했습니다.');
    }
  }
};