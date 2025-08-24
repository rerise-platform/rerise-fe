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