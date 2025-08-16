import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './features/login/pages/LoginPage';
import SignupPage from './features/signup/pages/SignupPage';
import './App.css';

/**
 * 메인 App 컴포넌트
 * React Router를 사용하여 페이지 간 라우팅을 담당
 */
function App() {
  return (
    <div className="app">
      {/* 라우팅 설정 */}
      <Routes>
        {/* 기본 경로 - 로그인 페이지로 리다이렉트 */}
        <Route path="/" element={<LoginPage />} />
        
        {/* 로그인 페이지 경로 */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* 회원가입 페이지 경로 */}
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </div>
  );
}

export default App;
