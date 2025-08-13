import { fetchWrapper } from '../../../shared/utils/fetchWrapper';

// 로그인 관련 API 엔드포인트 정의
export const loginAPI = {
  // 로그인 요청
  // @param credentials - { email: string, password: string }
  // @returns Promise<{ token: string, user: Object }>
  login: (credentials) => fetchWrapper.post('/auth/login', credentials),

  // 로그아웃 요청
  // @returns Promise<void>
  logout: () => fetchWrapper.post('/auth/logout'),

  // 현재 로그인된 사용자 정보 조회
  // @returns Promise<User>
  getCurrentUser: () => fetchWrapper.get('/auth/me'),
};
