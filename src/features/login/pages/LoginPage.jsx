import React from 'react';
import styled from 'styled-components';
import LoginForm from '../components/LoginForm';

// ===== Styled Components =====
// 전체 화면을 감싸는 컨테이너
const Screen = styled.div`
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #FEFFF5;
  min-height: 100vh;
  font-family: 'Pretendard', sans-serif;
  -webkit-font-smoothing: antialiased;
`;

// 로그인 페이지의 메인 컨테이너
const LoginContainer = styled.div`
  background-color: #FEFFF5;
  width: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
`;

/**
 * 로그인 페이지 컴포넌트
 * 이미지와 동일한 깔끔한 UI 구현
 */
const LoginPage = () => {
  return (
    <Screen>
      <LoginContainer>
        {/* 로그인 폼 컴포넌트 (모든 UI 요소 포함) */}
        <LoginForm />
      </LoginContainer>
    </Screen>
  );
};

export default LoginPage;
