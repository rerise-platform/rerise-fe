import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { loginThunk } from '../loginSlice';

const Group3 = styled.div`
  position: relative;
  width: 296px;
  height: 165px;
  margin: 0 auto;
`;

const InputContainer = styled.div`
  position: relative;
  width: 296px;
  height: 58px;
  margin-bottom: 19px;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 296px;
  height: 58px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 28px;
  border: 1px solid #40EA87;
  backdrop-filter: blur(12.5px);
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
  padding: 19px 20px;
  font-family: "Pretendard-Regular", Helvetica;
  font-weight: 400;
  color: #3F3F3F;
  font-size: 15px;
  letter-spacing: -0.5px;
  line-height: 20px;
  border: none;
  background: transparent;
  &::placeholder {
    color: #3F3F3F;
  }
  &:focus {
    outline: none;
  }
`;

const CheckboxContainer = styled.div`
  position: relative;
  width: 157px;
  height: 17px;
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Checkbox = styled.input`
  appearance: none;
  width: 15px;
  height: 15px;
  background-color: #FEFFF5;
  border-radius: 7.46px;
  border: 1px solid #31B066;
  position: relative;
  cursor: pointer;

  &:checked {
    &::after {
      content: '';
      position: absolute;
      width: 7px;
      height: 6px;
      top: 4px;
      left: 3px;
      background-color: #31B066;
      clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
    }
  }
`;

const CheckboxLabel = styled.label`
  font-family: "Pretendard-Regular", Helvetica;
  font-weight: 400;
  color: #31B066;
  font-size: 12px;
  letter-spacing: -0.5px;
  line-height: 20px;
  cursor: pointer;
`;

const LoginButton = styled.button`
  width: 304px;
  height: 68px;
  margin: 20px auto;
  display: block;
  background: #40EA87;
  border: none;
  border-radius: 28px;
  font-family: "Pretendard-SemiBold", Helvetica;
  font-size: 16px;
  color: #41604C;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const UtilityLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 17px;
  margin-bottom: 42px;
  
  a {
    font-family: "Pretendard-Regular", Helvetica;
    font-weight: 400;
    color: #5A605B;
    font-size: 13px;
    letter-spacing: -0.5px;
    line-height: 20px;
    text-decoration: none;
  }
  
  span {
    color: #5A605B;
  }
`;

const SignupPrompt = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 25px;
  
  span {
    font-family: "Pretendard-Regular", Helvetica;
    font-weight: 400;
    color: #9EA3B2;
    font-size: 14px;
    letter-spacing: 0.07px;
    line-height: 22px;
  }
  
  a {
    font-family: "Pretendard-SemiBold", Helvetica;
    font-weight: 600;
    color: #31B066;
    font-size: 14px;
    letter-spacing: 0.07px;
    line-height: 22px;
    text-decoration: none;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  font-size: 14px;
  text-align: center;
  font-family: "Pretendard-Regular", Helvetica;
  margin: 10px 0;
`;

const LoginForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginThunk({
      username: formData.username,
      password: formData.password
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Group3>
        <InputContainer>
          <InputWrapper>
            <Input
              type="text"
              name="username"
              placeholder="아이디"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </InputWrapper>
        </InputContainer>
        
        <InputContainer>
          <InputWrapper>
            <Input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </InputWrapper>
        </InputContainer>

        <CheckboxContainer>
          <Checkbox
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <CheckboxLabel htmlFor="rememberMe">자동로그인</CheckboxLabel>
        </CheckboxContainer>
      </Group3>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <LoginButton type="submit" disabled={loading}>
        {loading ? '로그인 중...' : '로그인'}
      </LoginButton>

      <UtilityLinks>
        <Link to="/find-id">아이디 찾기</Link>
        <span>ㅣ</span>
        <Link to="/find-password">비밀번호 찾기</Link>
      </UtilityLinks>

      <SignupPrompt>
        <span>아직 회원이 아니신가요?</span>
        <Link to="/signup">회원가입</Link>
      </SignupPrompt>
    </form>
  );
};

export default LoginForm;
