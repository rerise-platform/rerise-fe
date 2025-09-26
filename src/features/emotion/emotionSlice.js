import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createOrUpdateRecord, getRecordByDate } from './api/emotionAPI';

/**
 * 감정 기록 생성/수정 비동기 액션
 */
export const saveEmotionRecord = createAsyncThunk(
  'emotion/saveEmotionRecord',
  async (recordData, { rejectWithValue }) => {
    try {
      console.log('saveEmotionRecord 액션 시작:', recordData);
      
      // 키워드가 문자열로 전달된 경우 배열로 변환
      if (recordData.keywords && typeof recordData.keywords === 'string') {
        recordData = {
          ...recordData,
          keywords: recordData.keywords.split(',').map(k => k.trim()).filter(k => k)
        };
      }
      
      // API 호출
      const result = await createOrUpdateRecord(recordData);
      console.log('감정 기록 저장 성공:', result);
      return result;
    } catch (error) {
      console.error('감정 기록 저장 실패:', error);
      return rejectWithValue(error.message || '감정 기록 저장에 실패했습니다.');
    }
  }
);

/**
 * 특정 날짜 감정 기록 조회 비동기 액션
 */
export const fetchEmotionByDate = createAsyncThunk(
  'emotion/fetchEmotionByDate',
  async (date, { rejectWithValue }) => {
    try {
      console.log('fetchEmotionByDate 액션 시작:', date);
      
      // API 호출
      const result = await getRecordByDate(date);
      
      if (!result) {
        console.log(`${date} 날짜에 기록된 감정이 없습니다.`);
        return null;
      }
      
      console.log('감정 기록 조회 성공:', result);
      return result;
    } catch (error) {
      console.error('감정 기록 조회 실패:', error);
      return rejectWithValue(error.message || '감정 기록 조회에 실패했습니다.');
    }
  }
);

const initialState = {
  currentRecord: null,
  records: [],
  loading: false,
  error: null
};

const emotionSlice = createSlice({
  name: 'emotion',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentRecord: (state) => {
      state.currentRecord = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // saveEmotionRecord 처리
      .addCase(saveEmotionRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveEmotionRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRecord = action.payload;
        
        // 동일한 날짜의 기록이 있으면 업데이트, 없으면 추가
        const index = state.records.findIndex(
          record => record.recordedAt === action.payload.recordedAt
        );
        
        if (index !== -1) {
          state.records[index] = action.payload;
        } else {
          state.records.push(action.payload);
        }
      })
      .addCase(saveEmotionRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // fetchEmotionByDate 처리
      .addCase(fetchEmotionByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmotionByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRecord = action.payload;
      })
      .addCase(fetchEmotionByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearCurrentRecord } = emotionSlice.actions;

// 선택자 (Selectors)
export const selectCurrentRecord = (state) => state.emotion.currentRecord;
export const selectEmotionRecords = (state) => state.emotion.records;
export const selectEmotionLoading = (state) => state.emotion.loading;
export const selectEmotionError = (state) => state.emotion.error;

export default emotionSlice.reducer;