import axios from 'axios';

/**
 * 회원가입 API 호출 함수
 * 서버에 사용자 정보를 전송하여 회원가입을 처리
 * 
 * @param {Object} userData - 사용자 회원가입 정보
 * @param {string} userData.email - 사용자 이메일
 * @param {string} userData.password - 사용자 비밀번호
 * @param {string} userData.passwordCheck - 비밀번호 확인
 * @param {string} userData.nickname - 사용자 닉네임
 * @param {string} userData.birth - 사용자 생년월일 (YYYY-MM-DD)
 * @returns {Promise<string>} 회원가입 성공 시 "회원가입 성공" 메시지
 * @throws {Error} 회원가입 실패 시 에러 객체
 */
export const signupAPI = async (userData) => {
  try {
    // POST 요청으로 회원가입 API 엔드포인트 호출
    const response = await axios.post('/api/v1/signup', {
      email: userData.email,
      password: userData.password,
      passwordCheck: userData.passwordCheck,
      nickname: userData.nickname,
      birth: userData.birth
    });
    
    // 성공적인 응답 데이터 반환 (text/plain 응답)
    return response.data;
  } catch (error) {
    // 에러 발생 시 서버 응답의 에러 데이터 또는 기본 에러 메시지 전달
    throw error.response?.data || error.message;
  }
};

