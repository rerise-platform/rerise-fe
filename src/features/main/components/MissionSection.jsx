import React from 'react';
import styled, { keyframes } from 'styled-components';

// 애니메이션 효과
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

// 미션 섹션
const MissionSectionContainer = styled.section`
  padding: 20px;
  margin-top: 20px;
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

  &:first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    animation-delay: 0.1s;
  }

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.3s;
  }

  &:nth-child(4) {
    animation-delay: 0.4s;
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

  &.completed {
    background: #40ea87;
    border-color: #40ea87;
  }
`;

/**
 * 미션 섹션 컴포넌트 (오늘의 미션 목록)
 */
const MissionSection = () => {
  // 미션 데이터 (임시)
  const missions = [
    {
      id: 1,
      emoji: "👋",
      text: "가족이나 친구에게 간단한 안부 메시지 보내기",
      completed: true
    },
    {
      id: 2,
      emoji: "🤗",
      text: "방/책상/책 정리 10분",
      completed: true
    },
    {
      id: 3,
      emoji: "😌",
      text: "잠들기 5분 전 스트레칭 또는 명상하기",
      completed: false
    },
    {
      id: 4,
      emoji: "🤟",
      text: "오늘 한 가지 새로운 행동 시도하기",
      completed: false
    }
  ];

  return (
    <MissionSectionContainer>
      <SectionTitle>오늘의 미션 목록</SectionTitle>
      <MissionList>
        {missions.map((mission) => (
          <MissionItem key={mission.id}>
            <MissionEmoji>{mission.emoji}</MissionEmoji>
            <MissionText>{mission.text}</MissionText>
            <MissionCheck className={mission.completed ? 'completed' : ''}>
              {mission.completed ? '✓' : ''}
            </MissionCheck>
          </MissionItem>
        ))}
      </MissionList>
    </MissionSectionContainer>
  );
};

export default MissionSection;
