import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { store } from "./store/store";
import reportWebVitals from "./reportWebVitals";

// React 18의 새로운 createRoot API 사용
const root = ReactDOM.createRoot(document.getElementById("root"));

// 앱을 렌더링하고 필요한 Provider들을 설정
root.render(
  <React.StrictMode>
    {/* Redux store를 전체 앱에 제공 */}
    <Provider store={store}>
      {/* React Router를 사용하여 클라이언트 사이드 라우팅 활성화 */}
      <BrowserRouter>
        {/* 메인 App 컴포넌트 */}
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// 웹 성능 측정 (선택사항)
reportWebVitals();
