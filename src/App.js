import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import LoginPage from "./features/login/pages/LoginPage.jsx";
import SignupPage from "./features/signup/pages/SignupPage.jsx";
import MissionMainPage from "./features/mission/pages/MissionMainPage.jsx";
import AdminPage from "./features/admin/pages/AdminPage.jsx";

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

          {/* 미션 페이지 경로 */}
          <Route path="/mission" element={<MissionMainPage />} />

          {/* 관리자 페이지 경로 */}
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
