import api from '../../../lib/apiClient';

/**
 * 일기 기록 생성/수정 API 호출 함수
 * 서버에 감정 일기 정보를 전송하여 기록을 처리
 * 
 * @param {Object} recordData - 일기 기록 데이터
 * @param {number} recordData.emotion_level - 감정 레벨 (1-5)
 * @param {Array<string>} recordData.keywords - 감정 키워드들 배열
 * @param {string} recordData.memo - 일기 내용
 * @param {string} recordData.recordedAt - 기록 날짜 (YYYY-MM-DD)
 * @returns {Promise<Object>} 생성된 기록 데이터
 * @throws {Error} 기록 실패 시 에러 객체
 */
export const createOrUpdateRecord = async (recordData) => {
  try {
    // 토큰 검증
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('인증 정보가 없습니다. 다시 로그인해주세요.');
    }
    
    console.log('감정 기록 전송:', recordData);
    
    // 백엔드 명세에 맞게 데이터 형식 확인
    const requestData = {
      emotion_level: recordData.emotion_level,
      keywords: Array.isArray(recordData.keywords) ? recordData.keywords : [],
      memo: recordData.memo || '',
      recordedAt: recordData.recordedAt || new Date().toISOString().split('T')[0]
    };
    
    // API 요청 전 데이터 확인
    console.log('API 요청 데이터:', requestData);
    
    // API 요청 - 백엔드 명세에 맞춰 키와 값을 정확히 전송
    const response = await api.post('/api/v1/records', requestData);
    
    console.log('감정 기록 응답:', response.data);
    
    // API 응답을 그대로 반환
    return response.data;
  } catch (error) {
    console.error('감정 기록 저장 실패:', error);
    
    if (error.response) {
      // 서버에서 응답을 받았지만 2xx 범위를 벗어난 상태 코드가 반환된 경우
      throw new Error(error.response.data?.message || '서버에서 오류가 발생했습니다.');
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      // 요청 설정 중에 문제가 발생한 경우
      throw new Error(error.message || '감정 기록 저장에 실패했습니다.');
    }
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
    // 입력 날짜 형식 확인
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error(`유효하지 않은 날짜 형식입니다: ${date}`);
    }
    
    // 토큰 검증
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('인증 정보가 없습니다. 다시 로그인해주세요.');
    }
    
    console.log(`특정 날짜(${date}) 감정 기록 조회 시도`);
    
    // API 요청 - 백엔드 명세에 맞춰 정확한 URL 형식 사용
    const response = await api.get(`/api/v1/records/date/${date}`);
    
    console.log('감정 기록 조회 응답:', response.data);
    
    // API 응답을 그대로 반환
    return response.data;
  } catch (error) {
    console.error(`${date} 감정 기록 조회 실패:`, error);
    
    // 404 에러는 기록이 없는 경우로 처리
    if (error.response?.status === 404) {
      console.log('해당 날짜의 기록이 없습니다.');
      return null;
    }
    
    if (error.response) {
      // 서버에서 응답을 받았지만 2xx 범위를 벗어난 상태 코드가 반환된 경우
      throw new Error(error.response.data?.message || '서버에서 오류가 발생했습니다.');
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      // 요청 설정 중에 문제가 발생한 경우
      throw new Error(error.message || '감정 기록 조회에 실패했습니다.');
    }
  }
};

/**
 * 테스트 함수: 감정 기록 API 동작 테스트
 * 실제 API와 통신하여 감정 기록 추가 및 조회
 */
export const testEmotionAPI = async () => {
  try {
    console.log('==== 감정 기록 API 테스트 시작 ====');
    
    // 현재 날짜
    const today = new Date().toISOString().split('T')[0];
    
    // 1. 오늘 날짜 기록 추가
    const recordData = {
      emotion_level: 4,
      keywords: ['행복', '성취감', '만족'],
      memo: '오늘은 프로젝트를 성공적으로 완료해서 기분이 좋았다.',
      recordedAt: today
    };
    
    console.log('저장할 감정 기록:', recordData);
    
    const savedRecord = await createOrUpdateRecord(recordData);
    console.log('저장된 감정 기록:', savedRecord);
    
    // 2. 추가한 기록 조회
    console.log(`${today} 날짜의 기록 조회 중...`);
    const fetchedRecord = await getRecordByDate(today);
    console.log('조회된 감정 기록:', fetchedRecord);
    
    console.log('==== 감정 기록 API 테스트 완료 ====');
    return true;
  } catch (error) {
    console.error('감정 기록 API 테스트 실패:', error);
    throw error;
  }
};