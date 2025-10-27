import api from '../../../lib/apiClient';

/**
 * 사용자 경험치 추가 API 호출 함수 (테스트/개발용)
 * 특정 사용자에게 경험치를 추가
 * 
 * @param {number} userId - 사용자 ID
 * @param {number} expAmount - 추가할 경험치 양
 * @returns {Promise<Object>} 경험치 추가 결과 데이터
 * @throws {Error} API 호출 실패 시 에러 객체
 */
export const addUserExpAPI = async (userId, expAmount) => {
  try {
    console.log(`🔍 [ADD EXP API] 사용자 ${userId}에게 경험치 ${expAmount} 추가 요청`);
    
    // POST 요청으로 경험치 추가 API 엔드포인트 호출
    const response = await api.post(`/api/v1/${userId}/addExp`, {
      expAmount: expAmount
    });
    
    console.log('✅ [ADD EXP API] 경험치 추가 성공');
    console.log('📋 [ADD EXP API] 응답 상태:', response.status, response.statusText);
    console.log('📄 [ADD EXP API] 응답 데이터:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('❌ [ADD EXP API] 경험치 추가 에러 발생!');
    console.error('🚫 [ADD EXP API] 에러 타입:', error.name);
    console.error('💥 [ADD EXP API] 에러 메시지:', error.message);
    console.error('📡 [ADD EXP API] 응답 상태:', error.response?.status);
    console.error('📄 [ADD EXP API] 응답 데이터:', error.response?.data);
    
    // 에러 발생 시 처리
    if (error.response) {
      // 서버 응답이 있는 경우
      const errorMsg = error.response.data || `사용자 ${userId}의 경험치 추가에 실패했습니다.`;
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
 * 현재 로그인한 사용자의 경험치 추가 (편의 함수)
 * localStorage에서 사용자 ID를 가져와서 경험치를 추가
 * 
 * @param {number} expAmount - 추가할 경험치 양
 * @returns {Promise<Object>} 경험치 추가 결과 데이터
 * @throws {Error} API 호출 실패 시 에러 객체
 */
export const addCurrentUserExpAPI = async (expAmount) => {
  try {
    // 토큰에서 사용자 ID를 추출하거나 다른 방법으로 현재 사용자 ID를 가져와야 함
    // 현재는 임시로 메인 API를 호출해서 사용자 정보를 가져옴
    const mainResponse = await api.get('/api/v1/main');
    const userId = mainResponse.data.userId || mainResponse.data.id;
    
    if (!userId) {
      throw new Error('사용자 ID를 찾을 수 없습니다. 로그인 상태를 확인하세요.');
    }
    
    return await addUserExpAPI(userId, expAmount);
  } catch (error) {
    console.error('❌ [CURRENT USER ADD EXP API] 현재 사용자 경험치 추가 실패:', error.message);
    throw error;
  }
};