import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// ===== Styled Components =====
// 전체 화면을 감싸는 컨테이너
const Screen = styled.div`
  width: 100vw;
  display: grid;
  justify-items: center;
  align-items: start;
  background-color: #FEFFF5;
  min-height: 100vh;
  font-family: 'Pretendard', sans-serif;
  -webkit-font-smoothing: antialiased;
`;

// 회원가입 페이지의 메인 컨테이너
const SignupContainer = styled.div`
  background-color: #FEFFF5;
  width: 360px;
  height: 800px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;
`;

// 제목 스타일
const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #31B066;
  margin-bottom: 40px;
`;

// 로그인 페이지로 돌아가는 링크
const LoginPrompt = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 40px;
  
  span {
    font-size: 14px;
    color: #9EA3B2;
  }
  
  a {
    font-size: 14px;
    font-weight: 600;
    color: #31B066;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

/**
 * 회원가입 페이지 컴포넌트
 * 현재는 기본 구조만 구현되어 있으며, 나중에 회원가입 기능을 추가할 예정
 */
const SignupPage = () => {
  return (
    <Screen>
      <SignupContainer>
        <Title>회원가입</Title>
        <p>회원가입 기능은 아직 구현 중입니다.</p>
        
        {/* 로그인 페이지로 돌아가는 링크 */}
        <LoginPrompt>
          <span>이미 계정이 있으신가요?</span>
          <Link to="/login">로그인</Link>
        </LoginPrompt>
      </SignupContainer>
    </Screen>
  );
};

export default SignupPage;
