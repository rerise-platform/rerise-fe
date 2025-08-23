import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import LoginPage from "./features/login/pages/LoginPage.jsx";
import SignupPage from "./features/signup/pages/SignupPage.jsx";
import MissionMainPage from "./features/mission/pages/MissionMainPage.jsx";
import AdminPage from "./features/admin/pages/AdminPage.jsx";
import TutorialPage from "./features/mission/pages/TutorialPage.jsx";
import TestIntroPage from "./features/test/pages/TestIntroPage.jsx";
import TestPage from "./features/test/pages/TestPage.jsx";
import TestLoadingPage from "./features/test/pages/TestLoadingPage.jsx";
import TestResultPage from "./features/test/pages/TestResultPage.jsx";
import "./App.css";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        {/* 라우팅 설정 */}
        <Routes>
          {/* 기본 경로 - 로그인 페이지로 리다이렉트 */}
          <Route path="/" element={<LoginPage />} />

          {/* 로그인 페이지 경로 */}
          <Route path="/login" element={<LoginPage />} />

          {/* 회원가입 페이지 경로 */}
          <Route path="/signup" element={<SignupPage />} />

          {/* 튜토리얼 페이지 경로 */}
          <Route path="/tutorial" element={<TutorialPage />} />

          {/* 미션 페이지 경로 */}
          <Route path="/mission" element={<MissionMainPage />} />

          {/* 관리자 페이지 경로 */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/test" element={<TestIntroPage />} />
          <Route path="/test/q" element={<TestPage />} />
          <Route path="/test/loading" element={<TestLoadingPage />} />
          <Route path="/test/result" element={<TestResultPage />} />
          {/* <Route path="/" element={<Navigate to="/test" replace />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
