import React, { useLayoutEffect, useRef, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import LoginForm from "../components/LoginForm";

/* 전역: 배경 고정 + 기본 여백 제거 */
const GlobalStyle = createGlobalStyle`
  html, body, #root { min-height: 100%; }
  body { margin: 0; background: rgba(254, 255, 245, 1); }
`;

/* 진짜 정중앙 */
const AppWrapper = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: rgba(254, 255, 245, 1);
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
`;

/* 스케일된 실제 크기로 레이아웃 차지 → 항상 중앙에서 균등 여백 */
const Sizer = styled.div`
  overflow: hidden; /* 모바일/태블릿: 스크롤 제거 */
  border-radius: 12px; /* 선택 */
  background: rgba(254, 255, 245, 1);
`;

/* 원본(430px) 프레임: 좌상단 기준으로 스케일 */
const Frame = styled.div`
  width: 430px;
  transform-origin: top left;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* vh 의존을 줄이고, 디바이스 폭에 유연하게 */
  padding: clamp(24px, 5vw, 48px) 20px 40px;
  box-sizing: border-box;
`;

/**
 * useAutoScaleWithBox
 * - 모바일/태블릿: 화면에 '여백을 두고' 확대/축소 (스크롤 없음)
 * - PC(>= 1280px): 업스케일 금지 + 항상 살짝 축소(덜 답답)
 * - 스케일된 실제 width/height를 함께 반환해 Sizer에 적용
 */
function useAutoScaleWithBox(
  contentRef,
  {
    designWidth = 430,
    desktopBreakpoint = 1280, // iPad Pro(1024)는 태블릿으로 취급 → 확대 허용
    marginFactor = 0.92, // 상하좌우 여백 비율(= 8% 여백)
    pcShrink = 0.95, // PC에서 항상 살짝 줄이기
    globalShrink = 0.96, // ✅ PC/모바일 공통으로 "조금만" 더 줄이기
  } = {}
) {
  const [scale, setScale] = useState(1);
  const [boxSize, setBoxSize] = useState({ w: designWidth, h: 0 });

  useLayoutEffect(() => {
    function calc() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isDesktop = vw >= desktopBreakpoint;

      if (!contentRef.current) {
        setScale(1);
        setBoxSize({ w: designWidth, h: 0 });
        document.body.style.overflow = "";
        return;
      }

      // transform 영향을 받지 않는 내부 원본 높이
      const rawWidth = designWidth;
      const rawHeight = contentRef.current.scrollHeight;

      // 화면에 여백을 두고 맞춤
      const targetW = vw * marginFactor;
      const targetH = vh * marginFactor;

      let s = Math.min(targetW / rawWidth, targetH / rawHeight);

      if (isDesktop) {
        // 데스크톱: 확대 금지, 기본 축소 + 전역 축소
        s = Math.min(1, s) * pcShrink * globalShrink;
        document.body.style.overflow = ""; // PC는 스크롤 허용(필요 시)
      } else {
        // 모바일/태블릿: 전역 축소만 얹어주고 페이지 스크롤 제거
        s = s * globalShrink;
        document.body.style.overflow = "hidden";
      }

      setScale(s);
      setBoxSize({ w: rawWidth * s, h: rawHeight * s });
    }

    calc();
    window.addEventListener("resize", calc);
    window.addEventListener("orientationchange", calc);
    return () => {
      window.removeEventListener("resize", calc);
      window.removeEventListener("orientationchange", calc);
      document.body.style.overflow = "";
    };
  }, [
    contentRef,
    designWidth,
    desktopBreakpoint,
    marginFactor,
    pcShrink,
    globalShrink,
  ]);

  return { scale, boxSize };
}

const LoginPage = () => {
  const contentRef = useRef(null);
  const { scale, boxSize } = useAutoScaleWithBox(contentRef);

  return (
    <>
      <GlobalStyle />
      <AppWrapper>
        {/* 스케일된 실제 크기로 중앙 배치 → 위/아래 여백이 항상 균등 */}
        <Sizer style={{ width: `${boxSize.w}px`, height: `${boxSize.h}px` }}>
          <Frame style={{ transform: `scale(${scale})` }}>
            <Content ref={contentRef}>
              <LoginForm />
            </Content>
          </Frame>
        </Sizer>
      </AppWrapper>
    </>
  );
};

export default LoginPage;
