// 서버랑 통신 도우미(axios)
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://rerise.store",
  withCredentials: false, // 쿠키 쓰면 유지, JWT만 쓰면 있어도 무방
});

// 관리자 로그인해서 받은 토큰이 있으면 자동 첨부
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  console.log("🔍 API 요청:", config.url);
  console.log(
    "🔑 토큰 상태:",
    token ? "있음" : "없음",
    token?.substring(0, 20) + "..."
  );
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("✅ Authorization 헤더 추가됨");
  } else {
    console.log("❌ 토큰이 없어서 Authorization 헤더 추가 안됨");
  }
  return config;
});

export default api;
