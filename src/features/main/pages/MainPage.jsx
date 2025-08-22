import React from 'react';
import styled from 'styled-components';

/**
 * 메인 페이지 컴포넌트
 * 간단한 빈 화면
 */
const MainPage = () => {
  return (
    <Container>
      <Content>
        <h1>메인 페이지</h1>
        <p>네비게이션 바 테스트</p>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  max-width: 430px;
  min-height: 100vh;
  margin: 0 auto;
  background: #f5f7ff;
  position: relative;
  padding: 20px;
  box-sizing: border-box;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
  
  h1 {
    color: #333;
    margin-bottom: 16px;
  }
  
  p {
    color: #666;
    font-size: 14px;
  }
`;

export default MainPage;
