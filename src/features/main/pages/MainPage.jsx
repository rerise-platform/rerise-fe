import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

// 이미지 import
import mony1 from '../../../shared/assets/images/mony1.svg';
import questionMark from '../../../shared/assets/images/메인물음표.svg';
import graph from '../../../shared/assets/images/graph.svg';

/**
 * 메인 페이지 컴포넌트 - combined.html 완전 재현
 */
const MainPage = () => {
  const [speechBubbleVisible, setSpeechBubbleVisible] = useState(false);
  const [characterPromptVisible, setCharacterPromptVisible] = useState(true);

  const greetCharacter = () => {
    if (speechBubbleVisible) {
      setSpeechBubbleVisible(false);
      setTimeout(() => setCharacterPromptVisible(true), 100);
      return;
    }

    setCharacterPromptVisible(false);
    setSpeechBubbleVisible(true);

    // 3초 후 말풍선 제거
    setTimeout(() => {
      setSpeechBubbleVisible(false);
      setTimeout(() => setCharacterPromptVisible(true), 100);
    }, 3000);
  };

  const messages = [
    '안녕하세요! 😊',
    '오늘도 화이팅! 💪', 
    '미션을 완료해보세요! ⭐',
    '당신은 최고예요! 🎉',
    '계속 성장하고 있어요! 🌱'
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  return (
    <ElementEXP>
      <MainContent>
        <Header>
          <Greeting>
            <GreetingText>
              <Name>김멋사</Name>
              <Message>님, 안녕하세요!</Message>
            </GreetingText>
          </Greeting>
          <Character onClick={greetCharacter}>
            <CharacterCircle onClick={greetCharacter}>
              <CharacterSvg src={mony1} alt="캐릭터" />
            </CharacterCircle>
          </Character>
        </Header>

        <StatsContainer>
          <StatsRow>
            {speechBubbleVisible && (
              <SpeechBubble>
                <svg width="220" height="70" viewBox="0 0 220 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0.5H195.978C201.225 0.5 205.478 4.74875 205.478 9.99512V49.9824C205.478 55.2122 206.532 58.1756 208.219 60.0459C209.884 61.8914 212.119 62.5969 214.165 63.4336C214.378 63.5208 214.56 63.603 214.711 63.6787C214.607 63.6837 214.492 63.6876 214.364 63.6875C194.706 63.6688 53.6036 63.5762 11.89844 63.5488C6.66079 63.5448 2.500087 59.2988 2.5 54.0488V12C2.500001 6.7533 6.7533 2.5 12 2.5Z" fill="#DBFFE8" fillOpacity="0.8" stroke="#43FF92"/>
                  <foreignObject x="18" y="18" width="180" height="32">
                    <BubbleText>{randomMessage}</BubbleText>
                  </foreignObject>
                </svg>
              </SpeechBubble>
            )}
            <StatItem className="growth">
              <StatLabel>성장률</StatLabel>
              <ProgressBar>
                <ProgressFill />
              </ProgressBar>
            </StatItem>
            <StatItem className="points">
              <StatIcon>P</StatIcon>
              <StatValue>28P</StatValue>
            </StatItem>
            <StatItem className="level">
              <StatIcon className="level">LV</StatIcon>
              <StatValue className="level">01</StatValue>
            </StatItem>
          </StatsRow>
          
          <SecondRow>
            <DayCard>
              <DayEmoji>오늘의 감정 상태</DayEmoji>
              <DayText src={questionMark} alt="물음표" />
              <DayDescription>오늘의 감정을<br />기록해 주세요!</DayDescription>
            </DayCard>
            <CharacterPrompt $visible={characterPromptVisible}>
              <PromptText>캐릭터를<br />눌러보세요</PromptText>
            </CharacterPrompt>
          </SecondRow>
        </StatsContainer>

        <MissionSection>
          <SectionTitle>오늘의 미션 목록</SectionTitle>
          <MissionList>
            <MissionItem $delay={0.1}>
              <MissionEmoji>✓</MissionEmoji>
              <MissionText>가족이나 친구에게 간단한 안부 메시지 보내기</MissionText>
              <MissionCheck $completed>✓</MissionCheck>
            </MissionItem>
            <MissionItem $delay={0.2}>
              <MissionEmoji>✓</MissionEmoji>
              <MissionText>방/책상/책 정리 10분</MissionText>
              <MissionCheck $completed>✓</MissionCheck>
            </MissionItem>
            <MissionItem $delay={0.3}>
              <MissionEmoji>✓</MissionEmoji>
              <MissionText>잠들기 5분 전 스트레칭 또는 명상하기</MissionText>
              <MissionCheck />
            </MissionItem>
            <MissionItem $delay={0.4}>
              <MissionEmoji>✓</MissionEmoji>
              <MissionText>오늘 한 가지 새로운 행동 시도하기</MissionText>
              <MissionCheck />
            </MissionItem>
          </MissionList>
        </MissionSection>

        <EmotionSection>
          <EmotionContent>
            <EmotionText>
              <EmotionQuestion>오늘 하루 어떠셨나요?</EmotionQuestion>
              <EmotionAction>감정을 기록해보세요 ›</EmotionAction>
            </EmotionText>
            <EmotionChart>
              <img src={graph} alt="감정차트" width="100" height="90" />
            </EmotionChart>
          </EmotionContent>
        </EmotionSection>
      </MainContent>
    </ElementEXP>
  );
};

// 애니메이션 정의
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// 스타일 컴포넌트들
const ElementEXP = styled.div`
  background-color: #fefff5;
  display: grid;
  justify-items: center;
  align-items: start;
  width: 100vw;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const MainContent = styled.div`
  width: 100vw;
  max-width: 430px;
  min-height: 100vh;
  background-color: #fefff5;
  position: relative;
  overflow-x: hidden;

  @media (min-width: 431px) {
    border-radius: 20px;
    margin: 20px 0;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
`;

const Header = styled.header`
  position: relative;
  padding: 20px;
  height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background: linear-gradient(135deg, #f8fffe 0%, #fefff5 100%);

  @media (max-width: 375px) {
    padding: 15px;
    height: 240px;
  }
`;

const Greeting = styled.div`
  margin-top: 20px;
  z-index: 2;
`;

const GreetingText = styled.h1`
  font-size: 20px;
  font-weight: 400;
  color: #111111;
  line-height: 1.4;
  margin: 0;
`;

const Name = styled.span`
  font-weight: 600;
  color: #2d4a3a;
`;

const Message = styled.span`
  font-weight: 400;
  color: #555555;
`;

const Character = styled.div`
  position: absolute;
  top: 120px;
  right: 20px;
  z-index: 100;
  cursor: pointer;
  width: 150px;
  height: 135.5px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 375px) {
    width: 125px;
    height: 112.9px;
  }
`;

const CharacterCircle = styled.div`
  width: 150px;
  height: 135.5px;
  position: relative;
  transition: transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 101;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 375px) {
    width: 125px;
    height: 112.9px;
  }
`;

const CharacterSvg = styled.img`
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 10px 30px rgba(42, 217, 72, 0.3));
`;

const StatsContainer = styled.div`
  position: absolute;
  top: 80px;
  left: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 2;

  @media (max-width: 375px) {
    left: 15px;
    right: 15px;
    gap: 30px;
  }
`;

const StatsRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  position: relative;
`;

const SecondRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
  justify-content: flex-start;
  position: relative;
`;

const SpeechBubble = styled.div`
  position: absolute;
  top: -2px;
  left: -5px;
  width: 220px;
  height: 70px;
  pointer-events: none;
  z-index: 10;
`;

const BubbleText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #2d4a3a;
  text-align: center;
`;

const StatItem = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #40ea87;
  border-radius: 18px;
  padding: 8px 12px;
  height: 35px;
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(64, 234, 135, 0.1);

  &.growth {
    width: 140px;
  }

  &.points {
    width: 80px;
  }

  &.level {
    width: 70px;
  }
`;

const StatIcon = styled.div`
  width: 22px;
  height: 22px;
  background: #40ea87;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
  font-weight: 900;

  &.level {
    background: #ffcd6a;
  }
`;

const StatValue = styled.span`
  font-size: 12px;
  font-weight: 900;
  color: #40ea87;

  &.level {
    color: #ffcd6a;
  }
`;

const StatLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #2ad948;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 3px;
  background: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  width: 75%;
  height: 100%;
  background: #2ad948;
  border-radius: 2px;
`;

const DayCard = styled.div`
  width: 70px;
  height: 85px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #40ea87;
  border-radius: 8px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(64, 234, 135, 0.1);
  text-align: center;
  margin-top: 20px;
`;

const DayEmoji = styled.div`
  font-size: 8px;
  font-weight: 600;
  color: #2d4a3a;
  margin: 0;
  line-height: 1;
`;

const DayText = styled.img`
  width: 42px;
  height: 42px;
  flex-shrink: 0;
`;

const DayDescription = styled.p`
  font-size: 7px;
  font-weight: 500;
  color: #666666;
  margin: 0;
  line-height: 1.1;
`;

const CharacterPrompt = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #40ea87;
  border-radius: 18px;
  padding: 8px 12px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(64, 234, 135, 0.1);
  width: auto;
  z-index: 10;
  position: absolute;
  left: 148px;
  top: 19px;
  transition: opacity 0.6s ease, transform 0.6s ease;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translateY(${props => props.$visible ? 0 : 20}px);
  pointer-events: ${props => props.$visible ? 'auto' : 'none'};
`;

const PromptText = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #40ea87;
  white-space: nowrap;
  text-align: center;
  line-height: 1.2;
`;

const MissionSection = styled.section`
  padding: 20px;
  margin-top: -25px;
  position: relative;
  z-index: 1;

  @media (max-width: 375px) {
    padding: 15px;
    margin-top: 0px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #41604c;
  margin-bottom: 16px;
  text-align: left;
`;

const MissionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

const MissionItem = styled.div`
  background: white;
  border: 0.5px solid #e0e0e0;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 60px;
  transition: all 0.2s ease;
  animation: ${fadeInUp} 0.6s ease forwards;
  animation-delay: ${props => props.$delay}s;

  &:first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  &:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  &:hover {
    background: #f8f9fa;
  }
`;

const MissionEmoji = styled.div`
  font-size: 18px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MissionText = styled.div`
  flex: 1;
  font-size: 12px;
  font-weight: 500;
  color: #333333;
  line-height: 1.4;
`;

const MissionCheck = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid #e0e0e0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: white;
  transition: all 0.2s ease;
  background: ${props => props.$completed ? '#40ea87' : 'transparent'};
  border-color: ${props => props.$completed ? '#40ea87' : '#e0e0e0'};
`;

const EmotionSection = styled.section`
  padding: 20px;
  margin-top: 10px;
  margin-bottom: 100px;

  @media (max-width: 375px) {
    padding: 15px;
  }
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
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default MainPage;
