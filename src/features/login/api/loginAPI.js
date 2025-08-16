import axios from 'axios';

/**
 * 로그인 API 호출 함수
 * 서버에 사용자 인증 정보를 전송하여 로그인을 처리
 * 
 * @param {string} email - 사용자 이메일
 * @param {string} password - 사용자 비밀번호
 * @returns {Promise<Object>} 로그인 성공 시 사용자 정보와 토큰을 포함한 응답 데이터
 * @throws {Error} 로그인 실패 시 에러 객체
 */
export const loginAPI = async (email, password) => {
  try {
    // POST 요청으로 로그인 API 엔드포인트 호출
    const response = await axios.post('/api/v1/users/login', {
      email,
      password
    });
    
    // 성공적인 응답 데이터 반환
    return response.data;
  } catch (error) {
    // 에러 발생 시 서버 응답의 에러 데이터 또는 기본 에러 메시지 전달
    throw error.response?.data || error.message;
  }
};
