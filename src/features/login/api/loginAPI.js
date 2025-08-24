import api from '../../../lib/apiClient';

/**
 * 로그인 API 호출 함수
 * 서버에 사용자 인증 정보를 전송하여 로그인을 처리
 * 
 * @param {string} email - 사용자 이메일
 * @param {string} password - 사용자 비밀번호
 * @returns {Promise<Object>} 로그인 성공 시 토큰 또는 실패 메시지
 * @throws {Error} 로그인 실패 시 에러 객체
 */
export const loginAPI = async (email, password) => {
  try {
    // POST 요청으로 로그인 API 엔드포인트 호출
    const response = await api.post('/api/v1/login', {
      email,
      password
    });
    
    // 응답 데이터가 JWT 토큰인지 에러 메시지인지 확인
    const responseData = response.data;
    
    // JWT 토큰 형태인지 확인 (eyJ로 시작하는 토큰)
    if (typeof responseData === 'string' && responseData.startsWith('eyJ')) {
      // 성공: JWT 토큰 반환
      return {
        token: responseData,
        user_id: null // 토큰에서 파싱하거나 별도 API로 가져올 수 있음
      };
    } else {
      // 실패: 에러 메시지
      throw new Error(responseData);
    }
  } catch (error) {
    // 에러 발생 시 서버 응답의 에러 데이터 또는 기본 에러 메시지 전달
    throw error.response?.data || error.message;
  }
};
