import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import SignupForm from '../components/SignupForm';

const SignupPage = () => {
  return (
    <Container>
      <Title>회원가입</Title>
      <SignupForm />
      <LoginLink>
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
      </LoginLink>
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

const LoginLink = styled.p`
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

export default SignupPage;
