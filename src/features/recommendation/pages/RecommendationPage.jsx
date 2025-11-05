import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import RecommendationCard from '../components/RecommendationCard';
import ProgramCard from '../components/ProgramCard';
import { fetchPrograms, selectPrograms } from '../recommendationSlice';

const RecommendationPage = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.recommendation);
  const programs = useSelector(selectPrograms);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentProgramIndex, setCurrentProgramIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchPrograms());
  }, [dispatch, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleProgramRefresh = () => {
    if (programs && programs.length > 2) {
      setCurrentProgramIndex((prevIndex) => {
        const nextIndex = prevIndex + 2;
        return nextIndex >= programs.length ? 0 : nextIndex;
      });
    } else {
      dispatch(fetchPrograms());
    }
  };

  // 현재 표시할 프로그램들 가져오기 (2개씩)
  const getCurrentPrograms = () => {
    if (!programs || programs.length === 0) return [];
    
    const displayPrograms = [];
    for (let i = 0; i < 2; i++) {
      const index = (currentProgramIndex + i) % programs.length;
      if (programs[index]) {
        displayPrograms.push(programs[index]);
      }
    }
    return displayPrograms;
  };

  const handleProgramVisit = (program) => {
    console.log('Visiting program:', program);
    if (program.url) {
      window.open(program.url, '_blank');
    }
  };

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
        
        
        {getCurrentPrograms().length > 0 ? (
          getCurrentPrograms().map((program, index) => (
            <ProgramCard
              key={`${program.programName || program.title || 'program'}-${currentProgramIndex}-${index}`}
              program={program}
              onVisit={handleProgramVisit}
            />
          ))
        ) : (
          <EmptyMessage>추천 프로그램을 불러오는 중입니다...</EmptyMessage>
        )}
      </ProgramsSection>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  max-width: 430px;
  min-height: 100vh;
  background: #FEFFF5;
  position: relative;
  overflow-y: auto;
  margin: 0 auto;
  padding-top: 58px;
  padding-bottom: 90px;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
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
  width: 100%;
  margin-left: auto;
  margin-right: auto;
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


const EmptyMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  font-size: 14px;
  color: #999;
  margin: 20px;
`;

export default RecommendationPage;