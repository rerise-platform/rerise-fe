import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL?.trim() ||
  "https://rerise.store";

const isDev = process.env.NODE_ENV !== "production";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // JWT만 쓰는 경우 false
  headers: { "Content-Type": "application/json" },
});

// 요청 인터셉터: 특정 요청을 제외하고 토큰 자동 첨부
api.interceptors.request.use(
  (config) => {
    // 로그인/회원가입/헬스체크에는 토큰 미첨부
    const url = config.url || "";
    const isAuthRequest =
      url.includes("/login") || url.includes("/signup") || url.includes("/health");

    if (!isAuthRequest) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (isDev) {
      console.log("➡️ [REQ]", config.method?.toUpperCase(), url, {
        baseURL: config.baseURL,
        headers: config.headers,
        data: config.data,
      });
    }
    return config;
  },
  (error) => {
    if (isDev) console.error("❌ [REQ-ERR]", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 공통 로깅/에러 처리
api.interceptors.response.use(
  (res) => {
    if (isDev) {
      console.log("✅ [RES]", res.config.method?.toUpperCase(), res.config.url, {
        status: res.status,
        data: res.data,
      });
    }
    return res;
  },
  (error) => {
    if (isDev) {
      console.error("❌ [RES-ERR]", {
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }

    // 예: 401이면 로그인 화면으로 보내기 등
    // if (error.response?.status === 401) { /* handle */ }

    return Promise.reject(error);
  }
);

export default api;
