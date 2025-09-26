// 서버랑 통신 도우미(axios)
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://rerise.store",
  withCredentials: false, // 쿠키 쓰면 유지, JWT만 쓰면 있어도 무방
});

// 요청 인터셉터 - 토큰 자동 첨부 (로그인/회원가입 제외)
api.interceptors.request.use(
  (config) => {
    // 로그인과 회원가입 요청에는 토큰을 첨부하지 않음
    const isAuthRequest = config.url?.includes('/login') || config.url?.includes('/signup') || config.url?.includes('/health');
    
    if (!isAuthRequest) {
      const token = localStorage.getItem("accessToken");
      console.log("🔍 API 요청:", config.url, config.method?.toUpperCase());
      console.log(
        "🔑 토큰 상태:",
        token ? "있음" : "없음",
        token ? token.substring(0, 20) + "..." : "undefined"
      );
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("✅ Authorization 헤더 추가됨");
      } else {
        console.log("❌ 토큰이 없어서 Authorization 헤더 추가 안됨");
      }
    } else {
      console.log("🔍 인증 요청 (토큰 첨부 안함):", config.url, config.method?.toUpperCase());
      console.log("📝 요청 데이터:", config.data);
    }
    return config;
  },
  (error) => {
    console.error("❌ 요청 인터셉터 오류:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 오류 처리 개선
api.interceptors.response.use(
  (response) => {
    console.log("✅ [API CLIENT] 응답 성공:", {
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      timestamp: new Date().toISOString()
    });
    return response;
  },
  (error) => {
    console.error("❌ [API CLIENT] 응답 오류:", {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      responseHeaders: error.response?.headers,
      message: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    });
    
    // 401/403 오류 특별 처리
    if (error.response?.status === 401) {
      console.error("🚫 401 Unauthorized: 토큰이 유효하지 않습니다. 다시 로그인해주세요.");
      // 토큰 제거 및 로그인 페이지로 리다이렉트
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      console.error("🚫 403 Forbidden: 접근 권한이 없습니다.");
      console.error("🔍 요청 URL:", error.config?.url);
      console.error("🔍 요청 방법:", error.config?.method);
      console.error("🔍 현재 토큰:", localStorage.getItem('accessToken')?.substring(0, 20) + '...');
    }
    
    // CORS 오류 처리
    if (error.message === 'Network Error' && !error.response) {
      console.error("🚫 CORS 오류 또는 네트워크 연결 문제가 발생했습니다.");
    }
    
    return Promise.reject(error);
  }
);

export default api;
