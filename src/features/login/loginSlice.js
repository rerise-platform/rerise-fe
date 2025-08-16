import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginAPI } from './api/loginAPI';

/**
 * 비동기 로그인 처리 thunk
 * @param {Object} credentials - 사용자 인증 정보
 * @param {string} credentials.email - 사용자 이메일
 * @param {string} credentials.password - 사용자 비밀번호
 * @param {Object} thunkAPI - Redux Toolkit의 thunk API
 * @returns {Promise} API 응답 데이터 또는 에러
 */
export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // loginAPI 함수를 호출하여 서버에 로그인 요청
      const response = await loginAPI(email, password);
      return response;
    } catch (error) {
      // 에러 발생 시 rejectWithValue를 사용하여 에러 정보를 action.payload로 전달
      return rejectWithValue(error);
    }
  }
);

// 초기 상태 정의
const initialState = {
  isLoggedIn: false,    // 로그인 상태
  user_id: null,        // 사용자 ID (백엔드에서 반환)
  token: null,          // 인증 토큰
  error: null,          // 에러 메시지
  loading: false        // 로딩 상태
};

/**
 * 로그인 관련 상태를 관리하는 Redux slice
 * 동기 액션과 비동기 thunk 액션을 모두 처리
 */
export const loginSlice = createSlice({
  name: 'auth', // slice의 이름
  initialState,
  // 동기 액션들을 정의하는 reducers
  reducers: {
    // 로그인 시작 시 호출되는 액션
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // 로그인 성공 시 호출되는 액션
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    // 로그인 실패 시 호출되는 액션
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // 로그아웃 시 호출되는 액션
    logout: (state) => {
      return initialState; // 초기 상태로 리셋
    },
  },
  // 비동기 thunk 액션들을 처리하는 extraReducers
  extraReducers: (builder) => {
    builder
      // loginThunk.pending: 로그인 요청 시작
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // loginThunk.fulfilled: 로그인 요청 성공
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user_id = action.payload.user_id;  // 백엔드 응답에서 user_id 추출
        state.token = action.payload.token;      // 백엔드 응답에서 token 추출
        state.error = null;
      })
      // loginThunk.rejected: 로그인 요청 실패
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// 액션 생성자들을 export
export const { loginStart, loginSuccess, loginFailure, logout } = loginSlice.actions;

// reducer를 export
export default loginSlice.reducer;
