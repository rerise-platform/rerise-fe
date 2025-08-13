import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <Container>
      <Title>로그인</Title>
      <LoginForm />
      <SignupLink>
        계정이 없으신가요? <Link to="/signup">회원가입</Link>
      </SignupLink>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
`;

const SignupLink = styled.p`
  margin-top: 1rem;
  color: var(--text-secondary);
  
  a {
    color: var(--primary-color);
    text-decoration: underline;
    
    &:hover {
      opacity: 0.8;
    }
  }
`;

export default LoginPage;
