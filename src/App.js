import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './features/login/pages/LoginPage';
import SignupPage from './features/signup/pages/SignupPage';
import MainPage from './features/main/pages/MainPage';
import Navbar from './shared/components/Navbar';
import './App.css';

/**
 * 메인 App 컴포넌트
 * React Router를 사용하여 페이지 간 라우팅을 담당
 */
function App() {
  const location = useLocation();
  
  // 네비게이션을 표시하지 않을 페이지들
  const hideNavbarPages = ['/login', '/signup'];
  const shouldShowNavbar = !hideNavbarPages.includes(location.pathname);

  return (
    <div className="app">
      {/* 라우팅 설정 */}
      <Routes>
        {/* 기본 경로 - MainPage로 변경 */}
        <Route path="/" element={<MainPage />} />
        
        {/* 메인 페이지 경로 */}
        <Route path="/main" element={<MainPage />} />
        
        {/* 미션 페이지 경로 (나중에 구현) */}
        <Route path="/mission" element={<div>미션 페이지 (준비중)</div>} />
        
        {/* 추천 페이지 경로 (나중에 구현) */}
        <Route path="/recommendation" element={<div>추천 페이지 (준비중)</div>} />
        
        {/* 마이 페이지 경로 (나중에 구현) */}
        <Route path="/mypage" element={<div>마이 페이지 (준비중)</div>} />
        
        {/* 로그인 페이지 경로 */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* 회원가입 페이지 경로 */}
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
      
      {/* 조건부 네비게이션 바 표시 */}
      {shouldShowNavbar && <Navbar />}
    </div>
  );
}

export default App;
