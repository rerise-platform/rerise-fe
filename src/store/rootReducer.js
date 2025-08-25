import { combineReducers } from '@reduxjs/toolkit';
import emotionReducer from '../features/emotion/emotionSlice';
import recommendationReducer from '../features/recommendation/recommendationSlice';

const rootReducer = combineReducers({
  emotion: emotionReducer,
  recommendation: recommendationReducer,
});

export default rootReducer;
