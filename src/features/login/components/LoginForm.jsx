import React, { useState, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { loginThunk } from '../loginSlice';
import mainLogo from '../../../shared/assets/images/mainlogo.svg';

// ===== Styled Components =====
// 입력 박스 스타일
const InputBox = styled.div`
  width: 100%;
  max-width: 350px;
  height: 58px;
  border: 1px solid #40EA87;
  background-color: rgba(255,255,255,0.2);
  border-radius: 28px;
  margin-bottom: 20px;
  position: relative;
  backdrop-filter: ${props => props.$isPassword ? 'blur(7.5px)' : 'blur(12px)'};
  -webkit-backdrop-filter: ${props => props.$isPassword ? 'blur(7.5px)' : 'blur(12px)'};
`;

// 입력 필드 스타일
const Input = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  padding: 19px 20px;
  font-size: 15px;
  color: #3F3F3F;
  outline: none;
  box-sizing: border-box;
  font-family: "Pretendard-Regular", Helvetica;
  font-weight: 400;
  letter-spacing: -0.5px;
  line-height: 20px;

  &::placeholder {
    color: #3F3F3F;
  }
`;

// 로그인 버튼
const LoginButton = styled.button`
  width: 100%;
  max-width: 350px;
  height: 68px;
  background: #40EA87;
  border: none;
  border-radius: 28px;
  font-family: "Pretendard-SemiBold", Helvetica;
  font-size: 16px;
  color: #41604C;
  font-weight: 600;
  cursor: pointer;
  margin: 20px 0;

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

// 회원가입 안내 섹션
const SignupPrompt = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 20px;
  
  span {
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0.07px;
    white-space: nowrap;
  }
  
  .ask {
    color: #9EA3B2;
    font-weight: 400;
  }
  
  a {
    color: #31B066;
    font-weight: 600;
    text-decoration: none;
  }
`;

// 에러 메시지 스타일
const ErrorMessage = styled.div`
  color: #ff4444;
  font-size: 14px;
  text-align: center;
  font-family: "Pretendard-Regular", Helvetica;
  margin: 10px 0;
`;

// 로고 컨테이너 스타일
const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 30px;
`;

const Logo = styled.img`
  width: 180px;
  height: auto;
`;

const FormContainer = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0; // 상단 여백 제거
`;

// 최적화된 입력 필드 컴포넌트 
// React.memo를 사용하여 불필요한 리렌더링 방지
const OptimizedInput = memo(({ type, name, placeholder, value, onChange, required }) => {
  // 디버깅 코드는 나중에 제거
  // console.log(`Input rendering: ${name}`);
  
  // 이벤트 핸들러도 메모이제이션
  const handleInputChange = useCallback((e) => {
    onChange(e);
  }, [onChange]);
  
  return (
  <InputBox $isPassword={type === 'password'}>
      <Input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        required={required}
        autoComplete={type === 'password' ? 'current-password' : 'username'}
      />
    </InputBox>
  );
});

/**
 * 로그인 폼 컴포넌트
 * 사용자 인증 정보를 입력받고 Redux를 통해 로그인 처리를 담당
 */
const LoginForm = () => {
  // Redux hooks
  const dispatch = useDispatch(); // 액션을 dispatch하기 위한 함수
  const { loading, error } = useSelector(state => state.auth); // Redux store에서 상태 가져오기
  
  // 폼 데이터 상태 관리
  const [formData, setFormData] = useState({
    email: '',         // 사용자 이메일
    password: ''       // 사용자 비밀번호
  });

  /**
   * 입력 필드 값 변경 핸들러 - 메모이제이션 적용
   * @param {Event} e - 이벤트 객체
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  /**
   * 폼 제출 핸들러
   * @param {Event} e - 이벤트 객체
   */
  const handleSubmit = useCallback((e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    
    // Redux thunk를 통해 로그인 액션 dispatch
    dispatch(loginThunk({
      email: formData.email,
      password: formData.password
    }));
  }, [dispatch, formData.email, formData.password]);

    // 이벤트 핸들러들은 함수 내부에 유지

return (
    <FormContainer onSubmit={handleSubmit}>
      {/* 로고 */}
      <LogoContainer>
        <Logo src={mainLogo} alt="ReRise Logo" />
      </LogoContainer>

      {/* 최적화된 입력 필드들 */}
      <OptimizedInput 
        type="email"
        name="email"
        placeholder="이메일"
        value={formData.email}
        onChange={handleChange}
        required
      />
      
      <OptimizedInput
        type="password"
        name="password"
        placeholder="비밀번호"
        value={formData.password}
        onChange={handleChange}
        required
      />

      {/* 에러 메시지 표시 */}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {/* 로그인 버튼 */}
      <LoginButton type="submit" disabled={loading}>
        {loading ? '로그인 중...' : '로그인'}
      </LoginButton>

      {/* 회원가입 안내 */}
      <SignupPrompt>
        <span className="ask">아직 회원이 아니신가요?</span>
        <Link to="/signup">회원가입</Link>
      </SignupPrompt>
    </FormContainer>
  );
};

export default LoginForm;
