import styled from 'styled-components';

const RecommendationCard = ({ onRefresh }) => {
  return (
    <CardContainer>
      <CardHeader onClick={onRefresh}>
        <RefreshIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M3 21v-5h5" />
        </RefreshIcon>
        <HeaderText>다시 추천받기</HeaderText>
      </CardHeader>
      
      <EmojiSection>
        <Emoji>😊</Emoji>
        <EmojiText>그냥 평소 같았어요!</EmojiText>
      </EmojiSection>
      
      <MainText>
        오늘의 감정 상태를 반영한<br />
        추천장소는<br />
        <LocationHighlight>경기 용인시 기흥구 구갈동</LocationHighlight>입니다!
      </MainText>
      
      <Description>
        오늘은 기분이 가볍고 즐거운 날이네요!<br />
        활기찬 기운을 이어가려면<br />
        <Highlight>구갈동의 카페거리</Highlight>에서 산책하며<br />
        새로운 공간을 탐험해보는 건 어때요?
      </Description>
      
      <ActionButton>추천 장소 자세하게 보기</ActionButton>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  background: #FEFFF5;
  border-radius: 20px;
  padding: 24px 20px;
  margin: 16px;
  border: 1px solid #D9D9D9;
  position: relative;
  max-width: 680px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    margin: 16px;
  }

  @media (min-width: 768px) {
    max-width: 680px;
    margin-left: auto;
    margin-right: auto;
  }

  @media (max-width: 360px) {
    padding: 20px 16px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
  cursor: pointer;
`;

const RefreshIcon = styled.svg`
  width: 14px;
  height: 14px;
  color: #34C759;
  fill: currentColor;
`;

const HeaderText = styled.span`
  font-size: 11px;
  color: #34C759;
  font-weight: 500;
  letter-spacing: -0.2px;
`;

const EmojiSection = styled.div`
  position: absolute;
  top: 24px;
  right: 20px;
  text-align: center;
`;

const Emoji = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD93D 0%, #FFB800 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(255, 184, 0, 0.3);
`;

const EmojiText = styled.div`
  display: none;
`;

const MainText = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 18px;
  line-height: 1.5;
  letter-spacing: -0.3px;
  padding-right: 58px;

  @media (min-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 360px) {
    font-size: 14px;
    padding-right: 48px;
  }
`;

const LocationHighlight = styled.span`
  color: #0AB551;
`;

const Description = styled.div`
  font-size: 11px;
  color: #666;
  line-height: 1.45;
  margin-bottom: 18px;
  letter-spacing: -0.1px;

  @media (min-width: 768px) {
    font-size: 12px;
  }

  @media (max-width: 360px) {
    font-size: 10px;
  }
`;

const Highlight = styled.span`
  color: #34C759;
  font-weight: 500;
`;

const ActionButton = styled.button`
  background-color: #e8f5ec;
  border: 1px solid #34C759;
  border-radius: 12px;
  padding: 10px 16px;
  font-size: 11px;
  color: #1a5a2e;
  font-weight: 500;
  cursor: pointer;
  letter-spacing: -0.2px;
  display: inline-block;

  &:hover {
    background-color: #d4edda;
  }
`;

export default RecommendationCard;