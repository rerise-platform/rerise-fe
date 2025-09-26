import styled from 'styled-components';
import EmotionIcon from '../../../shared/assets/images/emotion3.svg';

const RecommendationPage = () => {
  // 새로고침을 위한 useState가 필요 없음

  const handleRefresh = () => {
    // 페이지 새로고침
    window.location.reload();
  };

  const handleProgramRefresh = () => {
    // 페이지 새로고침
    window.location.reload();
  };

  const handleDetailClick = () => {
    window.open('https://map.naver.com/p/search/용인시%20기흥구%20구갈동%20카페거리', '_blank');
  };

  const handleProgramVisit = (url) => {
    window.open(url, '_blank');
  };

  return (
    <Screen>
      <MainContainer>
        <Container>
          {/* Header */}
          <Header>
            <HeaderTitle>추천</HeaderTitle>
          </Header>

      {/* Recommendation Card */}
      <RecommendationCard>
        <CardHeader onClick={handleRefresh}>
          <RefreshIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </RefreshIcon>
          <HeaderText>다시 추천받기</HeaderText>
        </CardHeader>
        
        <EmojiSection>
          <Emoji>
            <EmotionImage src={EmotionIcon} alt="감정 아이콘" />
          </Emoji>
          <EmojiText>그냥 평소 같았어요!</EmojiText>
        </EmojiSection>
        
        <MainText>오늘의 감정 상태를 반영한</MainText>
        <MainText>추천장소는</MainText>
        <SubText><LocationHighlight>경기 용인시 기흥구 구갈동</LocationHighlight>입니다!</SubText>
        
        <Description>
          오늘은 기분이 가볍고 즐거운 날이네요!<br/>
          활기찬 기운을 이어가려면<br/>
          <Highlight>구갈동의 카페거리</Highlight>에서 산책하며<br/>
          새로운 공간을 탐험해보는 건 어때요?
        </Description>
        
        <ActionButton onClick={handleDetailClick}>추천 장소 자세하게 보기</ActionButton>
      </RecommendationCard>

      {/* Programs Section */}
      <ProgramsSection>
        <ProgramsHeader>
          <ProgramsTitle>추천 프로그램</ProgramsTitle>
          <ProgramsRefresh onClick={handleProgramRefresh}>
            <span>다시 추천받기</span>
            <ProgramsRefreshIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M3 21v-5h5" />
            </ProgramsRefreshIcon>
          </ProgramsRefresh>
        </ProgramsHeader>
        
        <ProgramCard>
          <VisitButton onClick={() => handleProgramVisit('https://www.gg.go.kr')}>사이트 방문하기</VisitButton>
          <ProgramTitle>경기도 '나와, 볼만한 세상'</ProgramTitle>
          <ProgramTarget>대상: 경기도에 거주하는 만 19~39세 고립·은둔 청년</ProgramTarget>
          <ProgramContent>
            <ContentLabel>내용:</ContentLabel>
            <ContentList>
              <ContentItem>1:1 심리상담 및 맞춤형 회복 프로그램</ContentItem>
              <ContentItem>일상 회복 챌린지, 운동 챌린지, 반려식물 키우기, 문화예술 체험 등</ContentItem>
              <ContentItem>힐링 명상, 자조 모임(산책·점심 등), 진로 탐색 프로그램</ContentItem>
              <ContentItem>사회 적응력 훈련, 멘토링, 진로 컨설팅 등 포함</ContentItem>
            </ContentList>
          </ProgramContent>
        </ProgramCard>
        
        <ProgramCard>
          <VisitButton onClick={() => handleProgramVisit('https://www.lh.or.kr')}>사이트 방문하기</VisitButton>
          <ProgramTitle>LH 사회공헌 프로그램 '움직이는 ...</ProgramTitle>
          <ProgramTarget>대상: 은둔형 외톨이 청년(6개월 이상 사회 단절 상태)</ProgramTarget>
          <ProgramContent>
            <ContentLabel>내용:</ContentLabel>
            <ContentList>
              <ContentItem>목공 교육, 심리상담, 예술치유, 치유캠프 운영</ContentItem>
              <ContentItem>관계 형성 및 사회적 복귀를 위한 실질적 지원을 제공</ContentItem>
            </ContentList>
          </ProgramContent>
        </ProgramCard>
      </ProgramsSection>
        </Container>
      </MainContainer>
    </Screen>
  );
};

const Screen = styled.div`
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff; /* 바깥쪽 배경색을 흰색으로 설정 */
  min-height: 100vh;
  font-family: 'Pretendard', sans-serif;
  -webkit-font-smoothing: antialiased;
`;

const MainContainer = styled.div`
  background-color: #fefff5;
  width: 430px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  position: relative;
  overflow-y: auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  padding-bottom: 20px; /* 하단에 추가 여백 */
`;

const Container = styled.div`
  font-family: 'Pretendard', sans-serif;
  color: #333;
  line-height: 1.4;
  padding: 20px 16px 80px; /* 하단 여백을 40px에서 80px로 증가 */
  letter-spacing: -0.3px;
  width: 100%;
  max-width: 390px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
  padding-top: 16px;
`;

const HeaderTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: #1a201c;
  letter-spacing: -0.4px;
  margin: 0;
`;

const ProgramsSection = styled.div`
  margin-top: 8px;
  width: 100%;
`;

const ProgramsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
`;

const ProgramsTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #41604c;
  letter-spacing: -0.4px;
  margin: 0;
`;

const ProgramsRefresh = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #40ea87;
  cursor: pointer;
  font-weight: 500;
  letter-spacing: -0.2px;
`;

const ProgramsRefreshIcon = styled.svg`
  width: 13px;
  height: 13px;
`;

const RefreshIcon = styled.svg`
  width: 14px;
  height: 14px;
  color: #40ea87;
`;

const RecommendationCard = styled.div`
  background: #fefff5;
  border-radius: 20px;
  padding: 22px 20px 24px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);
  margin-bottom: 32px;
  border: 1px solid #e8f4ea;
  position: relative;
  width: 100%;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
  cursor: pointer;
`;

const HeaderText = styled.span`
  font-size: 11px;
  color: #40ea87;
  font-weight: 500;
  letter-spacing: -0.2px;
`;

const EmojiSection = styled.div`
  position: absolute;
  top: 40px;
  right: 22px;
  text-align: center;
`;

const Emoji = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmotionImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
`;

const EmojiText = styled.div`
  display: none;
`;

const MainText = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #1a201c;
  margin-bottom: 2px;
  line-height: 1.35;
  letter-spacing: -0.3px;
  padding-right: 95px;
`;

const SubText = styled.div`
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 20px;
  line-height: 1.35;
  letter-spacing: -0.3px;
  padding-right: 95px;
  color: #1a201c;
`;

const LocationHighlight = styled.span`
  color: #40ea87;
`;

const Description = styled.div`
  font-size: 11px;
  color: #5a605b;
  line-height: 1.5;
  margin-bottom: 20px;
  letter-spacing: -0.1px;
  padding-right: 95px;
`;

const Highlight = styled.span`
  color: #40ea87;
  font-weight: 500;
`;

const ActionButton = styled.button`
  background-color: #daf7e6;
  border: 1px solid #40ea87;
  border-radius: 14px;
  padding: 10px 18px;
  font-size: 11px;
  color: #41604c;
  font-weight: 500;
  cursor: pointer;
  letter-spacing: -0.2px;
  display: inline-block;

  &:hover {
    background-color: #c8f0d4;
  }
`;

const ProgramCard = styled.div`
  background: #fefff5;
  border: 1.5px solid #40ea87;
  border-radius: 20px;
  padding: 20px 18px;
  margin-bottom: 12px;
  position: relative;
  box-shadow: 0 2px 12px rgba(64, 234, 135, 0.08);
  width: 100%;
  
  &:last-child {
    margin-bottom: 30px; /* 마지막 카드에 추가 하단 여백 */
  }
`;

const VisitButton = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  background-color: #40ea87;
  border: none;
  border-radius: 12px;
  padding: 6px 14px;
  font-size: 10px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  letter-spacing: -0.1px;
  box-shadow: 0 2px 6px rgba(64, 234, 135, 0.25);

  &:hover {
    background-color: #36d678;
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(64, 234, 135, 0.35);
  }
`;

const ProgramTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #1a201c;
  margin-bottom: 12px;
  line-height: 1.3;
  letter-spacing: -0.3px;
  padding-right: 85px;
`;

const ProgramTarget = styled.div`
  font-size: 10px;
  color: #5a605b;
  margin-bottom: 8px;
  letter-spacing: -0.1px;
  line-height: 1.4;
`;

const ProgramContent = styled.div`
  font-size: 10px;
  color: #5a605b;
  line-height: 1.5;
  letter-spacing: -0.1px;
`;

const ContentLabel = styled.div`
  margin-bottom: 4px;
`;

const ContentList = styled.ul`
  margin: 0;
  padding-left: 12px;
`;

const ContentItem = styled.li`
  margin-bottom: 2px;
  line-height: 1.55;
`;

export default RecommendationPage;