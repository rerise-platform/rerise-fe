import React from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import MissionSection from '../components/MissionSection';

// 전체 앱 컨테이너
const AppContainer = styled.div`
  background: linear-gradient(180deg, #f8fffe 0%, #FEFFF5 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

// 메인 콘텐츠
const MainContent = styled.div`
  width: 100vw;
  max-width: 430px;
  min-height: 100vh;
  background-color: #fefff5;
  position: relative;
  overflow-x: hidden;
`;

// 감정 기록 섹션
const EmotionSection = styled.section`
  padding: 20px;
  margin-top: 10px;
  margin-bottom: 100px;
`;

const EmotionContent = styled.div`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(109, 194, 255, 0.2);
  box-shadow: 0 4px 20px rgba(0, 149, 255, 0.1);
`;

const EmotionText = styled.div`
  flex: 1;
`;

const EmotionQuestion = styled.p`
  font-size: 10px;
  color: #666666;
  margin: 0 0 4px 0;
  font-weight: 400;
`;

const EmotionAction = styled.p`
  font-size: 14px;
  color: #1a201c;
  margin: 0;
  font-weight: 600;
`;

const EmotionChart = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChartPlaceholder = styled.div`
  font-size: 30px;
  opacity: 0.8;
`;

// 반응형 디자인
const ResponsiveStyles = styled.div`
  @media (max-width: 375px) {
    .header {
      padding: 15px;
      height: 180px;
    }
    
    .character-circle {
      width: 100px;
      height: 100px;
    }
    
    .character-circle::before {
      font-size: 35px;
    }
    
    .stats-container {
      left: 15px;
    }
    
    .mission-section {
      padding: 15px;
    }
    
    .emotion-section {
      padding: 15px;
    }
  }

  @media (min-width: 431px) {
    ${MainContent} {
      border-radius: 20px;
      margin: 20px 0;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
  }
`;

/**
 * 메인 페이지 컴포넌트
 * combined.html의 전체 레이아웃을 React 컴포넌트로 구현
 */
const MainPage = () => {
  return (
    <AppContainer>
      <MainContent>
        {/* 상단 헤더 (인사말 + 캐릭터 + 상태) */}
        <Header />
        
        {/* 미션 섹션 */}
        <MissionSection />
        
        {/* 감정 기록 섹션 */}
        <EmotionSection>
          <EmotionContent>
            <EmotionText>
              <EmotionQuestion>오늘 하루 어떠셨나요?</EmotionQuestion>
              <EmotionAction>감정을 기록해보세요 ›</EmotionAction>
            </EmotionText>
            <EmotionChart>
              <ChartPlaceholder>📊</ChartPlaceholder>
            </EmotionChart>
          </EmotionContent>
        </EmotionSection>
        
        <ResponsiveStyles />
      </MainContent>
    </AppContainer>
  );
};

export default MainPage;
