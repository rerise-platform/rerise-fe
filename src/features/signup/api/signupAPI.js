// src/features/signup/api/signupAPI.js
import axios from "axios";

const API_BASE_URL = "https://api.yourdomain.com/api/v1";

export async function signUp({ email, password, nickname }) {
  try {
    const response = await axios.post(`${API_BASE_URL}/signup`, {
      email,
      password,
      nickname,
    });
    return response.data; // { user_id, token }
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || "회원가입 실패");
    }
    throw new Error("네트워크 오류");
  }
}
