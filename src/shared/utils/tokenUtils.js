/**
 * JWT 토큰 유효성 검사 유틸리티
 */

/**
 * JWT 토큰의 기본적인 형태 검증
 * @param {string} token - 검증할 토큰
 * @returns {boolean} 토큰이 유효한 형태인지 여부
 */
export const isValidJWTFormat = (token) => {
  if (!token || typeof token !== 'string') return false;
  
  // JWT는 3개 부분으로 나뉘어져 있음 (header.payload.signature)
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  try {
    // Base64로 디코딩 시도
    const payload = JSON.parse(atob(parts[1]));
    return payload && typeof payload === 'object';
  } catch (error) {
    return false;
  }
};

/**
 * JWT 토큰의 만료 시간 확인
 * @param {string} token - 확인할 토큰
 * @returns {Object} 토큰 정보 객체
 */
export const getTokenInfo = (token) => {
  if (!isValidJWTFormat(token)) {
    return { valid: false, expired: true, payload: null };
  }
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    const expired = payload.exp ? payload.exp < currentTime : false;
    
    return {
      valid: true,
      expired,
      payload,
      expiresAt: payload.exp ? new Date(payload.exp * 1000) : null,
      issuedAt: payload.iat ? new Date(payload.iat * 1000) : null
    };
  } catch (error) {
    return { valid: false, expired: true, payload: null };
  }
};

/**
 * 현재 저장된 토큰의 상태 확인
 * @returns {Object} 토큰 상태 정보
 */
export const checkCurrentTokenStatus = () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  
  console.log('🔍 [TOKEN CHECK] 토큰 상태 확인');
  console.log('🔑 [TOKEN CHECK] AccessToken 존재:', !!accessToken);
  console.log('🔑 [TOKEN CHECK] RefreshToken 존재:', !!refreshToken);
  
  if (!accessToken) {
    console.log('❌ [TOKEN CHECK] AccessToken이 없음');
    return { hasToken: false, valid: false, expired: true };
  }
  
  const tokenInfo = getTokenInfo(accessToken);
  console.log('🔍 [TOKEN CHECK] 토큰 정보:', tokenInfo);
  
  if (tokenInfo.expired) {
    console.log('⏰ [TOKEN CHECK] 토큰이 만료됨');
  }
  
  return {
    hasToken: true,
    ...tokenInfo
  };
};