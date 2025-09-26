import api from '../../../lib/apiClient';

/**
 * 로그인 API 호출 함수
 * 서버에 사용자 인증 정보를 전송하여 로그인을 처리
 * 
 * @param {string} email - 사용자 이메일
 * @param {string} password - 사용자 비밀번호
 * @returns {Promise<Object>} 로그인 성공 시 토큰 정보(accessToken, refreshToken) 또는 실패 메시지
 * @throws {Error} 로그인 실패 시 에러 객체
 */
export const loginAPI = async (email, password) => {
  try {
    // POST 요청으로 로그인 API 엔드포인트 호출
    const response = await api.post('/api/v1/auth/login', {
      email,
      password
    });
    
    // 응답 데이터 확인
    const { accessToken, refreshToken, userId, hasCompletedTest } = response.data;
    
    // JWT 토큰이 존재하는지 확인
    if (accessToken && refreshToken) {
      // 성공: JWT 토큰 및 테스트 완료 여부 반환
      return {
        accessToken,
        refreshToken,
        userId,
        hasCompletedTest: !!hasCompletedTest // boolean으로 변환
      };
    } else {
      // 토큰이 없으면 에러 발생
      throw new Error('인증 토큰을 받지 못했습니다.');
    }
  } catch (error) {
    // 에러 발생 시 처리
    if (error.response) {
      // 서버 응답이 있는 경우
      const errorMsg = error.response.data.message || '로그인에 실패했습니다.';
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
