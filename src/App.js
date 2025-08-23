import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import LoginPage from "./features/login/pages/LoginPage";
import SignupPage from "./features/signup/pages/SignupPage";
import MainPage from "./features/main/pages/MainPage";
import EmotionPage from "./features/emotion/pages/EmotionPage";
// ↓ 은서님 작업 컴포넌트들 추가
import MissionMainPage from "./features/mission/pages/MissionMainPage.jsx";
import AdminPage from "./features/admin/pages/AdminPage.jsx";
import TutorialPage from "./features/mission/pages/TutorialPage.jsx";

import Navbar from "./shared/components/Navbar";
import "./App.css";
import TestPage from "./features/test/pages/TestPage.jsx";
import TestIntroPage from "./features/test/pages/TestIntroPage.jsx";
import TestLoadingPage from "./features/test/pages/TestLoadingPage.jsx";
import TestResultPage from "./features/test/pages/TestResultPage.jsx";

function App() {
  const location = useLocation();

  // ↓ 네비게이션 숨길 페이지 확장
  const hideNavbarPages = [
    "/login",
    "/signup",
    "/admin",
    "/tutorial",
    "/emotion",
    "/",
  ];
  const shouldShowNavbar = !hideNavbarPages.includes(location.pathname);

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/emotion" element={<EmotionPage />} />
        {/* ↓ 은서님 작업 페이지들 추가 */}
        <Route path="/tutorial" element={<TutorialPage />} />
        <Route path="/mission" element={<MissionMainPage />} />{" "}
        {/* 실제 컴포넌트로 교체 */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/test" element={<TestIntroPage />} />
        <Route path="/test/q" element={<TestPage />} />
        <Route path="/test/loading" element={<TestLoadingPage />} />
        <Route path="/admin" element={<TestResultPage />} />
        {/* ↓ 박신형 준비중 페이지들 유지 */}
        <Route
          path="/recommendation"
          element={<div>추천 페이지 (준비중)</div>}
        />
        <Route path="/mypage" element={<div>마이 페이지 (준비중)</div>} />
      </Routes>

      {shouldShowNavbar && <Navbar />}
    </div>
  );
}

export default App;
