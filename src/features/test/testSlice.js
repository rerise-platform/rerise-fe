import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { testAPI } from '../api/testAPI';

export const fetchQuestions = createAsyncThunk(
  'test/fetchQuestions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await testAPI.getQuestions();
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const submitAnswers = createAsyncThunk(
  'test/submitAnswers',
  async (answers, { rejectWithValue }) => {
    try {
      const response = await testAPI.submitAnswers(answers);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchResults = createAsyncThunk(
  'test/fetchResults',
  async (testId, { rejectWithValue }) => {
    try {
      const response = await testAPI.getResults(testId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const testSlice = createSlice({
  name: 'test',
  initialState: {
    questions: [],
    currentQuestionIndex: 0,
    answers: {},
    result: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setCurrentQuestion: (state, action) => {
      state.currentQuestionIndex = action.payload;
    },
    setAnswer: (state, action) => {
      const { questionId, answer } = action.payload;
      state.answers[questionId] = answer;
    },
    resetTest: (state) => {
      state.currentQuestionIndex = 0;
      state.answers = {};
      state.result = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(submitAnswers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitAnswers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.result = action.payload;
      })
      .addCase(submitAnswers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchResults.fulfilled, (state, action) => {
        state.result = action.payload;
      });
  },
});

export const { setCurrentQuestion, setAnswer, resetTest } = testSlice.actions;
export default testSlice.reducer;
