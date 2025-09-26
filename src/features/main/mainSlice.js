import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMainPageData } from './api/mainAPI';

/**
 * 메인 페이지 데이터를 가져오는 비동기 액션
 */
export const getMainPageData = createAsyncThunk(
  'main/getMainPageData',
  async (_, { rejectWithValue }) => {
    try {
      // API 호출을 통해 메인 페이지 데이터 가져오기
      const data = await fetchMainPageData();
      return data;
    } catch (error) {
      // 에러 처리
      return rejectWithValue(error.message || '메인 데이터를 불러오는데 실패했습니다.');
    }
  }
);

// 초기 상태 정의
const initialState = {
  data: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

// 메인 슬라이스 생성
const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    // 상태를 초기화하는 리듀서
    resetMainState: (state) => {
      state.data = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 메인 데이터 로딩 시작
      .addCase(getMainPageData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      // 메인 데이터 로딩 성공
      .addCase(getMainPageData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      // 메인 데이터 로딩 실패
      .addCase(getMainPageData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || '알 수 없는 오류가 발생했습니다.';
      });
  },
});

// 액션 및 리듀서 내보내기
export const { resetMainState } = mainSlice.actions;

// 선택자 함수들 내보내기
export const selectMainData = (state) => state.main.data;
export const selectMainStatus = (state) => state.main.status;
export const selectMainError = (state) => state.main.error;
export const selectIsMainLoading = (state) => state.main.status === 'loading';

export default mainSlice.reducer;