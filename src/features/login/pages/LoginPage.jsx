import React, { useEffect } from 'react';
import styled from 'styled-components';
import LoginForm from '../components/LoginForm';

// ===== Styled Components =====
// 전체 화면을 감싸는 컨테이너
const AppWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
`;

// 모바일 앱 컨테이너
const MobileContainer = styled.div`
  width: 430px;
  max-width: 430px;
  min-height: 100vh;
  background-color: #FEFFF5;
  position: relative;
  overflow-x: hidden;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);

  @media (max-width: 430px) {
    width: 100%;
    box-shadow: none;
  }
`;

// 로그인 페이지의 메인 컨테이너
const LoginContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 200px 20px 40px;
  box-sizing: border-box;
  
  @media (max-width: 430px) {
    padding: 180px 15px 40px;
  }
`;

/**
 * 로그인 페이지 컴포넌트
 * 이미지와 동일한 깔끔한 UI 구현
 */
const LoginPage = () => {
  // 컴포넌트 마운트 시 body 배경색을 제거하고, 언마운트 시 원래대로 복원
  useEffect(() => {
    // 원래의 배경색 저장
    const originalBackground = document.body.style.backgroundColor;
    
    // body 배경색 제거
    document.body.style.backgroundColor = 'transparent';
    
    // 언마운트 시 원래 배경색 복원
    return () => {
      document.body.style.backgroundColor = originalBackground;
    };
  }, []);

  return (
    <AppWrapper>
      <MobileContainer>
        <LoginContainer>
          {/* 로그인 폼 컴포넌트 (모든 UI 요소 포함) */}
          <LoginForm />
        </LoginContainer>
      </MobileContainer>
    </AppWrapper>
  );
};

export default LoginPage;
