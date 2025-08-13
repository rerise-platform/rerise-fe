import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { login, clearError } from '../loginSlice';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import { validators } from '../../../shared/utils/validators';

const LoginForm = () => {
  // Redux 디스패치 함수
  const dispatch = useDispatch();
  // Redux 스토어에서 로그인 상태 가져오기
  const { isLoading, error } = useSelector((state) => state.login);
  
  // 폼 데이터 상태 관리
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  // 폼 유효성 검사 에러 상태 관리
  const [formErrors, setFormErrors] = useState({});

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    // 폼 데이터 업데이트
    setFormData(prev => ({ ...prev, [name]: value }));
    // 이전 에러 메시지가 있다면 초기화
    if (error) dispatch(clearError());
    
    // 실시간 유효성 검사 수행
    const validationError = validators[name]?.(value) || '';
    setFormErrors(prev => ({
      ...prev,
      [name]: validationError
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 전체 폼 유효성 검사 수행
    const errors = {
      email: validators.email(formData.email),
      password: validators.password(formData.password),
    };

    // 유효성 검사 실패 시 에러 표시
    if (Object.values(errors).some(error => error)) {
      setFormErrors(errors);
      return;
    }

    // 로그인 액션 디스패치
    dispatch(login(formData));
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="이메일"
        error={formErrors.email}
      />
      <Input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="비밀번호"
        error={formErrors.password}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Button 
        type="submit" 
        disabled={isLoading}
        fullWidth
      >
        {isLoading ? '로그인 중...' : '로그인'}
      </Button>
    </FormContainer>
  );
};

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
`;

const ErrorMessage = styled.div`
  color: var(--error-color);
  font-size: 0.875rem;
  margin-top: -0.5rem;
`;

export default LoginForm;
