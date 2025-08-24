import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRecommendationPlaces, getRecommendationPrograms } from './api/recommendationAPI';

export const fetchPlaces = createAsyncThunk(
  'recommendation/fetchPlaces',
  async (_, { rejectWithValue }) => {
    try {
      const places = await getRecommendationPlaces();
      return places;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchPrograms = createAsyncThunk(
  'recommendation/fetchPrograms',
  async (_, { rejectWithValue }) => {
    try {
      const programs = await getRecommendationPrograms();
      return programs;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  places: [],
  programs: [],
  loading: false,
  error: null,
  lastFetched: {
    places: null,
    programs: null
  }
};

const recommendationSlice = createSlice({
  name: 'recommendation',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearData: (state) => {
      state.places = [];
      state.programs = [];
      state.lastFetched = {
        places: null,
        programs: null
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaces.fulfilled, (state, action) => {
        state.loading = false;
        state.places = action.payload;
        state.lastFetched.places = Date.now();
      })
      .addCase(fetchPlaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPrograms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrograms.fulfilled, (state, action) => {
        state.loading = false;
        state.programs = action.payload;
        state.lastFetched.programs = Date.now();
      })
      .addCase(fetchPrograms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearData } = recommendationSlice.actions;

export const selectPlaces = (state) => state.recommendation.places;
export const selectPrograms = (state) => state.recommendation.programs;
export const selectRecommendationLoading = (state) => state.recommendation.loading;
export const selectRecommendationError = (state) => state.recommendation.error;

export default recommendationSlice.reducer;