import api from '../../../lib/apiClient';

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
  console.log('🚀 [SIGNUP API] 회원가입 요청 시작');
  console.log('� [SIGNUP API] 전송할 데이터:', {
    email: userData.email,
    password: userData.password ? `***${userData.password.length}자리` : 'undefined',
    passwordCheck: userData.passwordCheck ? `***${userData.passwordCheck.length}자리` : 'undefined',
    nickname: userData.nickname,
    birth: userData.birth,
    timestamp: new Date().toISOString()
  });
  
  try {
    console.log('📡 [SIGNUP API] POST 요청 전송 중...');
    
    // POST 요청으로 회원가입 API 엔드포인트 호출
    const response = await api.post('/api/v1/signup', {
      email: userData.email,
      password: userData.password,
      passwordCheck: userData.passwordCheck,
      nickname: userData.nickname,
      birth: userData.birth
    });
    
    console.log('✅ [SIGNUP API] 응답 수신 성공!');
    console.log('📋 [SIGNUP API] 응답 상태:', response.status, response.statusText);
    console.log('📄 [SIGNUP API] 응답 헤더:', response.headers);
    console.log('🎯 [SIGNUP API] 응답 데이터:', response.data);
    console.log('📊 [SIGNUP API] 전체 응답 객체:', response);
    
    return response.data;
  } catch (error) {
    console.error('❌ [SIGNUP API] 에러 발생!');
    console.error('🚫 [SIGNUP API] 에러 타입:', error.name);
    console.error('💥 [SIGNUP API] 에러 메시지:', error.message);
    console.error('📡 [SIGNUP API] 응답 상태:', error.response?.status);
    console.error('📄 [SIGNUP API] 응답 데이터:', error.response?.data);
    console.error('🔧 [SIGNUP API] 요청 설정:', error.config);
    console.error('🔍 [SIGNUP API] 전체 에러 객체:', error);
    
    throw error.response?.data || error.message;
  }
};