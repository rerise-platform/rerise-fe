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
    console.log('🚀 [LOGIN API] 로그인 요청 시작');
    console.log('📧 [LOGIN API] 이메일:', email);
    console.log('🔑 [LOGIN API] 비밀번호 길이:', password?.length || 0);
    console.log('🌐 [LOGIN API] 요청 URL:', '/api/v1/login');
    console.log('📡 [LOGIN API] POST 요청 전송 중...');
    
    // POST 요청으로 로그인 API 엔드포인트 호출
    const response = await api.post('/api/v1/login', {
      email,
      password
    });
    
    // 디버깅을 위한 로그 추가
    console.log('✅ [LOGIN API] 서버 응답 수신!');
    console.log('🔍 [LOGIN API] 서버 응답 전체:', response);
    console.log('🔍 [LOGIN API] 응답 데이터:', response.data);
    console.log('🔍 [LOGIN API] 응답 상태:', response.status);
    console.log('🔍 [LOGIN API] 응답 헤더:', response.headers);
    
    // 백엔드 응답은 단순한 JWT 토큰 문자열 (text/plain)
    const token = response.data;
    
    console.log('🔍 받은 토큰:', token);
    
    // JWT 토큰 형태인지 확인 (eyJ로 시작하는 토큰)
    if (typeof token === 'string' && token.startsWith('eyJ')) {
      // 성공: JWT 토큰 반환
      return {
        accessToken: token,
        refreshToken: token, // 백엔드에서 refreshToken을 별도로 제공하지 않으므로 같은 토큰 사용
        userId: null, // 토큰에서 파싱하거나 별도 API로 가져올 수 있음
        hasCompletedTest: null // 온보딩 완료 여부는 별도 API로 확인
      };
    } else {
      // 실패: 에러 메시지
      console.error('❌ 토큰이 아님:', token);
      throw new Error(token || '인증 토큰을 받지 못했습니다.');
    }
  } catch (error) {
    // 에러 발생 시 처리
    if (error.response) {
      // 서버 응답이 있는 경우
      const errorMsg = error.response.data || '로그인에 실패했습니다.';
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
 * 로그아웃 API 호출 함수
 * 서버에 로그아웃 요청을 보내어 토큰을 무효화
 * 
 * @returns {Promise<void>} 로그아웃 성공 시 void
 * @throws {Error} 로그아웃 실패 시 에러 객체
 */
export const logoutAPI = async () => {
  try {
    console.log('🚀 [LOGOUT API] 로그아웃 요청 시작');
    
    // POST 요청으로 로그아웃 API 엔드포인트 호출
    const response = await api.post('/api/v1/logout');
    
    console.log('✅ [LOGOUT API] 로그아웃 성공');
    console.log('📋 [LOGOUT API] 응답 상태:', response.status, response.statusText);
    console.log('📄 [LOGOUT API] 응답 데이터:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('❌ [LOGOUT API] 로그아웃 에러 발생!');
    console.error('🚫 [LOGOUT API] 에러 타입:', error.name);
    console.error('💥 [LOGOUT API] 에러 메시지:', error.message);
    console.error('📡 [LOGOUT API] 응답 상태:', error.response?.status);
    console.error('📄 [LOGOUT API] 응답 데이터:', error.response?.data);
    
    // 에러 발생 시 처리
    if (error.response) {
      // 서버 응답이 있는 경우
      const errorMsg = error.response.data || '로그아웃에 실패했습니다.';
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
