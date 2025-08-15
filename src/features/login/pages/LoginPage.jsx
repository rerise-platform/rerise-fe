import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { loginStart, loginSuccess, loginFailure } from '../loginSlice';

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

const LoginContainer = styled.div`
  background-color: #FEFFF5;
  width: 360px;
  height: 800px;
  position: relative;
  overflow: hidden;
`;

const HomeIndicatorFrame = styled.div`
  position: absolute;
  width: 390px;
  height: 34px;
  top: 766px;
  left: -15px;
`;

const HomeIndicator = styled.div`
  position: relative;
  width: 134px;
  height: 5px;
  background: #626876;
  top: 21px;
  left: 128px;
  border-radius: 100px;
`;

const SignupGroup = styled.div`
  position: absolute;
  top: 730px;
  left: 72px;
  display: flex;
  gap: 6px;
  align-items: center;
`;

const Text = styled.span`
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.07px;
  white-space: nowrap;
  color: ${props => props.type === 'ask' ? '#9EA3B2' : '#31B066'};
  font-weight: ${props => props.type === 'ask' ? '400' : '600'};
`;

const LoginButton = styled.button`
  position: absolute;
  top: 576px;
  left: 28px;
  width: 304px;
  height: 68px;
  background: #40EA87;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: white;
  font-weight: 600;

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const FindLinks = styled.div`
  position: absolute;
  top: 670px;
  left: 90px;
  display: flex;
  gap: 5px;
  font-size: 13px;
  color: #5A605B;
`;

const InputArea = styled.div`
  position: absolute;
  top: 299px;
  left: 32px;
  width: 296px;
`;

const InputBox = styled.div`
  width: 296px;
  height: 58px;
  border: 1px solid #40EA87;
  background-color: rgba(255,255,255,0.2);
  border-radius: 28px;
  margin-bottom: 20px;
  position: relative;
  backdrop-filter: blur(${props => props.isPassword ? '7.5px' : '12px'});
  -webkit-backdrop-filter: blur(${props => props.isPassword ? '7.5px' : '12px'});

  input {
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
    padding: 19px 20px;
    font-size: 15px;
    color: #3F3F3F;
    outline: none;
    box-sizing: border-box;

    &::placeholder {
      color: #3F3F3F;
    }
  }
`;

const AutoLogin = styled.div`
  position: absolute;
  top: 147px;
  left: 7px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
`;

const Checkbox = styled.div`
  width: 15px;
  height: 15px;
  border: 1px solid #31B066;
  border-radius: 50%;
  background-color: ${props => props.checked ? '#31B066' : '#FEFFF5'};
  cursor: pointer;
`;

const AutoLoginLabel = styled.span`
  color: #31B066;
  line-height: 20px;
  cursor: pointer;
`;

const LoginPage = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [autoLogin, setAutoLogin] = useState(false);
  const { loading: isLoading, error } = useSelector(state => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.password) return;
    
    try {
      dispatch(loginStart());
      const response = await axios.post('/api/v1/users/login', {
        username: formData.username,
        password: formData.password,
        autoLogin
      });

      if (response.data) {
        dispatch(loginSuccess(response.data));
      }
    } catch (error) {
      dispatch(loginFailure(error.response?.data?.message || '로그인에 실패했습니다.'));
    }
  };

  const toggleAutoLogin = () => {
    setAutoLogin(!autoLogin);
  };

  return (
    <Screen>
      <LoginContainer>
        <SignupGroup>
          <Text type="ask">아직 회원이 아니신가요?</Text>
          <Text type="join">회원가입</Text>
        </SignupGroup>

        <LoginButton 
          onClick={handleSubmit}
          disabled={!formData.username || !formData.password || isLoading}
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </LoginButton>

        <FindLinks>
          <span>아이디 찾기</span>
          <span>ㅣ</span>
          <span>비밀번호 찾기</span>
        </FindLinks>

        <InputArea>
          <InputBox>
            <input
              type="text"
              name="username"
              placeholder="아이디"
              value={formData.username}
              onChange={handleChange}
            />
          </InputBox>
          <InputBox isPassword>
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={handleChange}
            />
          </InputBox>
        </InputArea>
      </LoginContainer>
    </Screen>
  );
};

export default LoginPage;
