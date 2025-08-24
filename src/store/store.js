// Redux Toolkit에서 store를 생성해주는 함수
import { configureStore } from '@reduxjs/toolkit';
// 로그인 관련 상태(slice)를 관리하는 reducer
import loginReducer from '../features/login/loginSlice';
import rootReducer from './rootReducer';

/**
 * 전체 애플리케이션에서 사용할 Redux store 생성
 * configureStore는 Redux DevTools와 기본 미들웨어를 자동으로 설정
 */
export const store = configureStore({
  // 애플리케이션의 모든 reducer들을 결합
  reducer: {
    // 상태 트리의 auth라는 key에 loginReducer를 연결
    // => state.auth로 접근 가능 (예: const {token} = useSelector(state => state.auth))
    // => state.auth.isLoggedIn, state.auth.user, state.auth.token 등으로 접근
    auth: loginReducer,
    ...rootReducer
  },
  
  // 개발 환경에서 Redux DevTools 활성화
  devTools: process.env.NODE_ENV !== 'production',
  
  // 기본 미들웨어 설정 (Redux Toolkit이 자동으로 설정)
  // - redux-thunk: 비동기 액션 처리
  // - serializable-state-invariant-middleware: 상태 직렬화 검증
  // - immutability-middleware: 상태 불변성 검증
});
