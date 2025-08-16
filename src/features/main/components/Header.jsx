import React from 'react';
import styled from 'styled-components';

// 상단 헤더
const HeaderContainer = styled.header`
  position: relative;
  padding: 20px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background: linear-gradient(135deg, #f8fffe 0%, #fefff5 100%);
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

// 녹색 캐릭터
const Character = styled.div`
  position: absolute;
  top: 80px;
  right: 20px;
  z-index: 1;
`;

const CharacterCircle = styled.div`
  width: 120px;
  height: 120px;
  background: radial-gradient(circle at 30% 30%, #7ef7a8, #4ae882, #2ad948);
  border-radius: 50%;
  position: relative;
  box-shadow: 0 10px 30px rgba(42, 217, 72, 0.3);

  &::before {
    content: "👋";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 40px;
  }

  &::after {
    content: "";
    position: absolute;
    top: -10px;
    right: -5px;
    width: 30px;
    height: 20px;
    background: #4ae882;
    border-radius: 50px 10px 50px 50px;
    transform: rotate(25deg);
  }
`;

// 상태 정보
const StatsContainer = styled.div`
  position: absolute;
  top: 80px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 2;
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

/**
 * 헤더 컴포넌트 (상단 인사말과 캐릭터, 상태 정보)
 */
const Header = () => {
  return (
    <HeaderContainer>
      <Greeting>
        <GreetingText>
          <Name>김멋사</Name>
          <Message>님, 안녕하세요!</Message>
        </GreetingText>
      </Greeting>
      
      <Character>
        <CharacterCircle />
      </Character>
      
      <StatsContainer>
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
      </StatsContainer>
    </HeaderContainer>
  );
};

export default Header;
