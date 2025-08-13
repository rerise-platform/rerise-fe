import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginAPI } from '../api/loginAPI';

// 로그인 비동기 액션 생성
// credentials(이메일, 비밀번호)를 받아 서버에 로그인 요청
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // API 호출하여 로그인 시도
      const response = await loginAPI.login(credentials);
      // 로그인 성공 시 JWT 토큰을 로컬 스토리지에 저장
      localStorage.setItem('token', response.token);
      // 사용자 정보 반환
      return response.user;
    } catch (error) {
      // 로그인 실패 시 에러 처리
      return rejectWithValue(error.response.data);
    }
  }
);

// 현재 로그인된 사용자 정보 조회 액션
// 페이지 새로고침 시에도 로그인 상태 유지를 위해 사용
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await loginAPI.getCurrentUser();
      return user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 로그인 관련 상태 관리를 위한 slice 생성
const loginSlice = createSlice({
  name: 'login',
  // 초기 상태 정의
  initialState: {
    user: null,      // 로그인한 사용자 정보
    isLoading: false, // API 호출 중 여부
    error: null,      // 에러 메시지
  },
  // 동기 액션 정의
  reducers: {
    // 로그아웃: 사용자 정보와 토큰 제거
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('token');
    },
    // 에러 메시지 초기화
    clearError: (state) => {
      state.error = null;
    },
  },
  // 비동기 액션 상태 처리
  extraReducers: (builder) => {
    builder
      // 로그인 요청 시작
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // 로그인 성공
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload; // 사용자 정보 저장
      })
      // 로그인 실패
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // 에러 메시지 저장
      })
      // 현재 사용자 정보 조회 성공
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

// 액션 생성자 내보내기
export const { logout, clearError } = loginSlice.actions;
// 리듀서 내보내기
export default loginSlice.reducer;
