import { combineReducers } from '@reduxjs/toolkit';
import emotionReducer from '../features/emotion/emotionSlice';

const rootReducer = combineReducers({
  emotion: emotionReducer,
});

export default rootReducer;
