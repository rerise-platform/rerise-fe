import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  emotions: [],
  currentEmotion: null,
  loading: false,
  error: null,
  selectedDate: new Date().toISOString().split('T')[0],
};

const emotionSlice = createSlice({
  name: 'emotion',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setEmotions: (state, action) => {
      state.emotions = action.payload;
    },
    setCurrentEmotion: (state, action) => {
      state.currentEmotion = action.payload;
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    addEmotion: (state, action) => {
      state.emotions.push(action.payload);
    },
    updateEmotion: (state, action) => {
      const index = state.emotions.findIndex(emotion => emotion.diary_id === action.payload.diary_id);
      if (index !== -1) {
        state.emotions[index] = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
});

export const {
  setLoading,
  setError,
  setEmotions,
  setCurrentEmotion,
  setSelectedDate,
  addEmotion,
  updateEmotion,
  clearError
} = emotionSlice.actions;

export default emotionSlice.reducer;
