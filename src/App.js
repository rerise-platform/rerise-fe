import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginPage from "./features/login/pages/LoginPage";
import SignupPage from "./features/signup/pages/SignupPage";
import MainPage from "./features/main/pages/MainPage";
import EmotionPage from "./features/emotion/pages/EmotionPage";
import MissionMainPage from "./features/mission/pages/MissionMainPage.jsx";
import AdminPage from "./features/admin/pages/AdminPage.jsx";
import TutorialPage from "./features/mission/pages/TutorialPage.jsx";
import RecommendationPage from "./features/recommendation/pages/RecommendationPage";
import Navbar from "./shared/components/Navbar";
import "./App.css";
import TestPage from "./features/test/pages/TestPage.jsx";
import TestIntroPage from "./features/test/pages/TestIntroPage.jsx";
import TestLoadingPage from "./features/test/pages/TestLoadingPage.jsx";
import TestResultPage from "./features/test/pages/TestResultPage.jsx";

function App() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedTest, setHasCompletedTest] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // 네비게이션 숨길 페이지 확장
  const hideNavbarPages = [
    "/login",
    "/signup",
    "/admin",
    "/tutorial",
    "/emotion",
    "/",
    "/test",
    "/test/q",
    "/test/loading",
    "/test/result",
  ];
  
  const shouldShowNavbar = !hideNavbarPages.includes(location.pathname);
  
  // 컴포넌트 마운트 시 인증 상태와 테스트 완료 여부 확인
  useEffect(() => {
    // localStorage에서 토큰 및 테스트 완료 여부 확인
    const accessToken = localStorage.getItem('accessToken');
    const testCompleted = localStorage.getItem('testCompleted');
    
    setIsAuthenticated(!!accessToken);
    setHasCompletedTest(testCompleted === 'true');
    setLoading(false);
  }, []);
  
  // 인증 필요한 경로에 접근 시 로그인 페이지로 리다이렉트하는 래퍼 컴포넌트
  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };
  
  // 로그인 상태에서 접근하면 리다이렉트하는 래퍼 컴포넌트
  const AuthRoute = ({ children }) => {
    // 로그인 상태이면 테스트 완료 여부에 따라 다른 페이지로 리다이렉트
    if (isAuthenticated) {
      if (hasCompletedTest) {
        return <Navigate to="/main" replace />;
      } else {
        return <Navigate to="/test" replace />;
      }
    }
    // 비로그인 상태면 자식 컴포넌트 렌더링 (로그인/회원가입 페이지)
    return children;
  };
  
  // 테스트 완료 여부에 따라 처리하는 래퍼 컴포넌트
  const TestRoute = ({ children }) => {
    return isAuthenticated ? 
      (hasCompletedTest ? <Navigate to="/main" replace /> : children) :
      <Navigate to="/login" replace />;
  };
  
  if (loading) {
    return <div>로딩 중...</div>;
  }
  
  return (
    <div className="app">
      <Routes>
        {/* 로그인 관련 라우트 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
        <Route path="/signup" element={<AuthRoute><SignupPage /></AuthRoute>} />
        
        {/* 테스트 관련 라우트 */}
        <Route path="/test" element={<TestRoute><TestIntroPage /></TestRoute>} />
        <Route path="/test/q" element={<TestRoute><TestPage /></TestRoute>} />
        <Route path="/test/loading" element={<TestRoute><TestLoadingPage /></TestRoute>} />
        <Route path="/test/result" element={<TestRoute><TestResultPage /></TestRoute>} />
        
        {/* 인증 필요 라우트 */}
        <Route path="/main" element={<PrivateRoute><MainPage /></PrivateRoute>} />
        <Route path="/emotion" element={<PrivateRoute><EmotionPage /></PrivateRoute>} />
        <Route path="/tutorial" element={<PrivateRoute><TutorialPage /></PrivateRoute>} />
        <Route path="/mission" element={<PrivateRoute><MissionMainPage /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
        <Route path="/recommendation" element={<PrivateRoute><RecommendationPage /></PrivateRoute>} />
        <Route path="/mypage" element={<PrivateRoute><div>마이 페이지 (준비중)</div></PrivateRoute>} />
      </Routes>
      
      {shouldShowNavbar && <Navbar />}
    </div>
  );
}

export default App;