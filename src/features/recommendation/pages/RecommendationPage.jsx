import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import RecommendationCard from '../components/RecommendationCard';
import ProgramCard from '../components/ProgramCard';
import { fetchPrograms } from '../recommendationSlice';

const RecommendationPage = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.recommendation);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    dispatch(fetchPrograms());
  }, [dispatch, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleProgramRefresh = () => {
    dispatch(fetchPrograms());
  };

  const handleProgramVisit = (program) => {
    console.log('Visiting program:', program);
  };

  const mockPrograms = [
    {
      id: 1,
      title: "경기도 '나와, 볼만한 세상'",
      target: "경기도에 거주하는 만 19~39세 고립·은둔 청년",
      content: [
        "1:1 심리상담 및 맞춤형 회복 프로그램",
        "일상 회복 챌린지, 운동 챌린지, 반려식물 키우기, 문화예술 체험 등",
        "힐링 명상, 자조 모임(산책·점심 등), 진로 탐색 프로그램",
        "사회 적응력 훈련, 멘토링, 진로 컨설팅 등 포함"
      ]
    },
    {
      id: 2,
      title: "LH 사회공헌 프로그램 '움직이는 ...",
      target: "은둔형 외톨이 청년(6개월 이상 사회 단절 상태)",
      content: [
        "목공 교육, 심리상담, 예술치유, 치유캠프 운영",
        "관계 형성 및 사회적 복귀를 위한 실질적 지원을 제공"
      ]
    }
  ];

  if (loading) {
    return (
      <Container>
        <LoadingMessage>로딩 중...</LoadingMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderTitle>추천</HeaderTitle>
      </Header>

      <RecommendationCard onRefresh={handleRefresh} />

      <ProgramsSection>
        <ProgramsHeader>
          <ProgramsTitle>추천 프로그램</ProgramsTitle>
          <ProgramsRefresh onClick={handleProgramRefresh}>
            <span>다시 추천받기</span>
            <RefreshIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M3 21v-5h5" />
            </RefreshIcon>
          </ProgramsRefresh>
        </ProgramsHeader>
        
        {mockPrograms.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            onVisit={handleProgramVisit}
          />
        ))}
      </ProgramsSection>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #FEFFF5;
  position: relative;
  overflow-y: auto;
  margin: 0;
  padding-top: 58px;
  padding-bottom: 90px;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;

  @media (max-height: 800px) {
    height: auto;
    min-height: 100vh;
  }

  @media (max-width: 375px) {
    padding-bottom: 80px;
  }

  @media (max-width: 320px) {
    padding-bottom: 75px;
  }

  @media (min-width: 431px) {
    padding-bottom: 95px;
  }

  @media (min-width: 768px) {
    padding-bottom: 100px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;
  padding-top: 20px;
`;

const HeaderTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: -0.5px;
  margin: 0;
`;

const ProgramsSection = styled.div`
  margin-top: 8px;
  max-width: 680px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    margin: 8px 16px;
  }
`;

const ProgramsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 40px 16px 20px 16px;
`;

const ProgramsTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: -0.4px;
  padding-left: 8px;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 20px;
  }
`;

const ProgramsRefresh = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #34C759;
  cursor: pointer;
  font-weight: 500;
  letter-spacing: -0.2px;
  padding-right: 8px;
`;

const RefreshIcon = styled.svg`
  width: 13px;
  height: 13px;
  color: #34C759;
`;

const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 16px;
  color: #666;
`;

export default RecommendationPage;