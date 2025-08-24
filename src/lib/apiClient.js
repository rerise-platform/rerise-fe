// 서버랑 통신 도우미(axios)
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080",
  withCredentials: true, // 쿠키 쓰면 유지, JWT만 쓰면 있어도 무방
});

// 관리자 로그인해서 받은 토큰이 있으면 자동 첨부
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
