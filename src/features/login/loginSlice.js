import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginAPI, logoutAPI } from './api/loginAPI';

/**
 * 비동기 로그인 처리 thunk
 * @param {Object} credentials - 사용자 인증 정보
 * @param {string} credentials.email - 사용자 이메일
 * @param {string} credentials.password - 사용자 비밀번호
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
      // 에러 발생 시 Error 객체의 message를 문자열로 변환하여 전달
      const errorMessage = error?.message || '로그인에 실패했습니다.';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * 비동기 로그아웃 처리 thunk
 * @returns {Promise} API 응답 데이터 또는 에러
 */
export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // logoutAPI 함수를 호출하여 서버에 로그아웃 요청
      const response = await logoutAPI();
      return response;
    } catch (error) {
      // 에러가 발생해도 로컬에서는 로그아웃 처리를 진행
      console.warn('서버 로그아웃 실패했지만 로컬 로그아웃은 진행:', error?.message);
      return null; // 에러가 있어도 성공으로 처리
    }
  }
);

// 초기 상태 정의
const initialState = {
  isLoggedIn: false,     // 로그인 상태
  userId: null,          // 사용자 ID
  accessToken: null,     // 액세스 토큰
  refreshToken: null,    // 리프레시 토큰
  error: null,           // 에러 메시지
  loading: false         // 로딩 상태
};

/**
 * 로그인 관련 상태를 관리하는 Redux slice
 */
export const loginSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 로그아웃 액션
    logout: (state) => {
      // localStorage에서 토큰 제거
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return initialState; // 초기 상태로 리셋
    },
    // 토큰 갱신 액션
    refreshTokenSuccess: (state, action) => {
      state.accessToken = action.payload.accessToken;
      localStorage.setItem('accessToken', action.payload.accessToken);
    },
  },
  // 비동기 thunk 액션들을 처리하는 extraReducers
  extraReducers: (builder) => {
    builder
      // 로그인 요청 시작
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // 로그인 요청 성공
      .addCase(loginThunk.fulfilled, (state, action) => {
        console.log('🎉 [LOGIN SLICE] 로그인 성공!');
        console.log('📄 [LOGIN SLICE] 받은 페이로드:', action.payload);
        
        state.loading = false;
        state.isLoggedIn = true;
        state.userId = action.payload.userId;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
        
        // JWT 토큰을 localStorage에 저장
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        console.log('💾 [LOGIN SLICE] 토큰 localStorage에 저장 완료');
        
        // 테스트 완료 여부 확인 (서버로부터 받은 정보로 설정)
        const testCompleted = action.payload.hasCompletedTest;
        localStorage.setItem('testCompleted', String(testCompleted));
        console.log('🧪 [LOGIN SLICE] 테스트 완료 여부:', testCompleted);
        
        // 리다이렉트 전 현재 상태 로그
        console.log('🔄 [LOGIN SLICE] 리다이렉트 준비 중...');
        console.log('📍 [LOGIN SLICE] 현재 URL:', window.location.href);
        
        // 테스트 완료 여부에 따라 다른 페이지로 리다이렉트
        if (testCompleted) {
          console.log('➡️ [LOGIN SLICE] 메인 페이지로 이동');
          // 테스트를 완료한 사용자는 메인 페이지로 이동
          window.location.href = '/main';
        } else {
          console.log('➡️ [LOGIN SLICE] 테스트 페이지로 이동');
          // 테스트를 완료하지 않은 사용자는 테스트 페이지로 이동
          window.location.href = '/test';
        }
      })
      // 로그인 요청 실패
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        // 이미 문자열로 변환된 에러 메시지를 저장
        state.error = action.payload || '로그인에 실패했습니다.';
      })
      // 로그아웃 요청 시작
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // 로그아웃 요청 성공
      .addCase(logoutThunk.fulfilled, (state) => {
        // localStorage에서 토큰 제거
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('testCompleted');
        
        // 상태 초기화
        Object.assign(state, initialState);
        
        // 로그인 페이지로 리다이렉트
        window.location.href = '/login';
      })
      // 로그아웃 요청 실패 (서버 에러여도 로컬 로그아웃은 진행)
      .addCase(logoutThunk.rejected, (state) => {
        // localStorage에서 토큰 제거
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('testCompleted');
        
        // 상태 초기화
        Object.assign(state, initialState);
        
        // 로그인 페이지로 리다이렉트
        window.location.href = '/login';
      });
  },
});

// 액션 생성자 export
export const { logout, refreshTokenSuccess } = loginSlice.actions;

// reducer export
export default loginSlice.reducer;
