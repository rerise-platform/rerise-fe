import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signupAPI } from '../api/signupAPI';

export const signup = createAsyncThunk(
  'signup/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await signupAPI.signup(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const checkEmail = createAsyncThunk(
  'signup/checkEmail',
  async (email, { rejectWithValue }) => {
    try {
      const response = await signupAPI.checkEmail(email);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const signupSlice = createSlice({
  name: 'signup',
  initialState: {
    isLoading: false,
    error: null,
    emailAvailable: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetEmailAvailable: (state) => {
      state.emailAvailable = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(checkEmail.fulfilled, (state, action) => {
        state.emailAvailable = action.payload.available;
      })
      .addCase(checkEmail.rejected, (state) => {
        state.emailAvailable = false;
      });
  },
});

export const { clearError, resetEmailAvailable } = signupSlice.actions;
export default signupSlice.reducer;
