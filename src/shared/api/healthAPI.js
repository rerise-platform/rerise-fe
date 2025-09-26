import api from '../../../lib/apiClient';

/**
 * 서버 상태 확인 API 호출 함수
 * 인증 없이 서버의 상태를 체크
 * 
 * @returns {Promise<Object>} 서버 상태 정보
 * @throws {Error} API 호출 실패 시 에러 객체
 */
export const healthCheckAPI = async () => {
  try {
    console.log('🔍 [HEALTH API] 서버 상태 체크 요청 시작');
    
    // GET 요청으로 health check API 엔드포인트 호출
    const response = await api.get('/api/v1/health');
    
    console.log('✅ [HEALTH API] 서버 상태 체크 성공');
    console.log('📋 [HEALTH API] 응답 상태:', response.status, response.statusText);
    console.log('📄 [HEALTH API] 응답 데이터:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('❌ [HEALTH API] 서버 상태 체크 에러 발생!');
    console.error('🚫 [HEALTH API] 에러 타입:', error.name);
    console.error('💥 [HEALTH API] 에러 메시지:', error.message);
    console.error('📡 [HEALTH API] 응답 상태:', error.response?.status);
    console.error('📄 [HEALTH API] 응답 데이터:', error.response?.data);
    
    // 에러 발생 시 처리
    if (error.response) {
      // 서버 응답이 있는 경우
      const errorMsg = error.response.data || '서버 상태 확인에 실패했습니다.';
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

/**
 * 추천 서비스 상태 확인 API 호출 함수
 * 인증 없이 추천 서비스의 상태를 체크
 * 
 * @returns {Promise<Object>} 추천 서비스 상태 정보
 * @throws {Error} API 호출 실패 시 에러 객체
 */
export const recommendationHealthCheckAPI = async () => {
  try {
    console.log('🔍 [RECOMMENDATION HEALTH API] 추천 서비스 상태 체크 요청 시작');
    
    // GET 요청으로 추천 서비스 health check API 엔드포인트 호출
    const response = await api.get('/api/v1/recommendation/health');
    
    console.log('✅ [RECOMMENDATION HEALTH API] 추천 서비스 상태 체크 성공');
    console.log('📋 [RECOMMENDATION HEALTH API] 응답 상태:', response.status, response.statusText);
    console.log('📄 [RECOMMENDATION HEALTH API] 응답 데이터:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('❌ [RECOMMENDATION HEALTH API] 추천 서비스 상태 체크 에러 발생!');
    console.error('🚫 [RECOMMENDATION HEALTH API] 에러 타입:', error.name);
    console.error('💥 [RECOMMENDATION HEALTH API] 에러 메시지:', error.message);
    console.error('📡 [RECOMMENDATION HEALTH API] 응답 상태:', error.response?.status);
    console.error('📄 [RECOMMENDATION HEALTH API] 응답 데이터:', error.response?.data);
    
    // 에러 발생 시 처리
    if (error.response) {
      // 서버 응답이 있는 경우
      const errorMsg = error.response.data || '추천 서비스 상태 확인에 실패했습니다.';
      throw new Error(errorMsg);
    } else if (error.request) {
      // 요청이 전송되었지만 응답이 없는 경우
      throw new Error('추천 서비스에 연결할 수 없습니다. 네트워크 연결을 확인하세요.');
    } else {
      // 그 외의 에러
      throw new Error(error.message || '알 수 없는 오류가 발생했습니다.');
    }
  }
};