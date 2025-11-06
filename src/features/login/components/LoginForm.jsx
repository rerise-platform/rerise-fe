import React, { useState, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { loginThunk } from "../loginSlice";
import mainLogo from "../../../shared/assets/images/mainlogo.svg";

/* 입력 박스 */
const InputBox = styled.div`
  width: 100%;
  max-width: 350px;
  height: 58px;
  border: 1px solid #40ea87;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 28px;
  margin: 10px 0 20px 0;
  position: relative;

  /* 모바일/태블릿에서 blur 성능 이슈 완화 */
  backdrop-filter: ${(p) => (p.$isPassword ? "blur(7.5px)" : "blur(12px)")};
  -webkit-backdrop-filter: ${(p) =>
    p.$isPassword ? "blur(7.5px)" : "blur(12px)"};

  @media (max-width: 1024px) {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    background-color: rgba(255, 255, 255, 0.7);
  }
`;

/* 입력 필드 */
const Input = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  padding: 19px 20px;
  font-size: 15px;
  color: #3f3f3f;
  outline: none;
  box-sizing: border-box;
  font-family: "Pretendard-Regular", Helvetica;
  font-weight: 400;
  letter-spacing: -0.5px;
  line-height: 20px;

  &::placeholder {
    color: #3f3f3f;
  }
`;

/* 버튼 */
const LoginButton = styled.button`
  width: 100%;
  max-width: 350px;
  height: 68px;
  background: #40ea87;
  border: none;
  border-radius: 28px;
  font-family: "Pretendard-SemiBold", Helvetica;
  font-size: 16px;
  color: #41604c;
  font-weight: 600;
  cursor: pointer;
  margin: 25px 0;

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

/* 회원가입 안내 */
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
    color: #9ea3b2;
    font-weight: 400;
  }
  a {
    color: #31b066;
    font-weight: 600;
    text-decoration: none;
  }
`;

/* 에러 메시지 */
const ErrorMessage = styled.div`
  color: #ff4444;
  font-size: 14px;
  text-align: center;
  font-family: "Pretendard-Regular", Helvetica;
  margin: 10px 0;
`;

/* 로고 (초기 레이아웃 안정 위해 치수 명시) */
const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 30px;
`;
const Logo = styled.img.attrs(() => ({
  width: 160,
  height: 160,
}))`
  width: 160px;
  height: auto;
`;

/* 폼 전체 */
const FormContainer = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0;
`;

const OptimizedInput = memo(
  ({ type, name, placeholder, value, onChange, required }) => {
    const handleInputChange = useCallback(
      (e) => {
        onChange?.(e);
      },
      [onChange]
    );

    if (!name || !onChange) return null;

    return (
      <InputBox $isPassword={type === "password"}>
        <Input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          required={required}
          autoComplete={type === "password" ? "current-password" : "username"}
        />
      </InputBox>
    );
  }
);

const LoginForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => {
    if (!state || !state.auth) return { loading: false, error: null };
    return state.auth;
  });

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!formData.email || !formData.password) return;
      dispatch(
        loginThunk({ email: formData.email, password: formData.password })
      );
    },
    [dispatch, formData.email, formData.password]
  );

  return (
    <FormContainer onSubmit={handleSubmit}>
      <LogoContainer>
        <Logo src={mainLogo} alt="ReRise Logo" />
      </LogoContainer>

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

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <LoginButton type="submit" disabled={loading}>
        {loading ? "로그인 중..." : "로그인"}
      </LoginButton>

      <SignupPrompt>
        <span className="ask">아직 회원이 아니신가요?</span>
        <Link to="/signup">회원가입</Link>
      </SignupPrompt>
    </FormContainer>
  );
};

export default LoginForm;
