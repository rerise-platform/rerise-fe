// Redux Toolkit에서 store를 생성해주는 함수
import { configureStore } from '@reduxjs/toolkit';
// 로그인 관련 상태(slice)를 관리하는 reducer
import loginReducer from '../features/login/loginSlice';

// 전체 애플리케이션에서 사용할 Redux store 생성
export const store = configureStore({
  reducer: {
    // 상태 트리의 auth라는 key에 loginReducer를 연결하겠다는 의미
    // => state.auth 로 접근 가능 (예: const {token} = useSelector(state => state.auth))
    auth: loginReducer
  }
});
