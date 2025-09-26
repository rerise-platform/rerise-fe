import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled, { keyframes } from 'styled-components';

// 이미지 import
import mony1 from '../../../shared/assets/images/mony1.svg';
import questionMark from '../../../shared/assets/images/메인물음표.svg';
import graph from '../../../shared/assets/images/graph.svg';
import Rectangle from '../../../shared/assets/images/Rectangle.svg';
import emotion1 from '../../../shared/assets/images/emotion1.svg';
import emotion2 from '../../../shared/assets/images/emotion2.svg';
import emotion3 from '../../../shared/assets/images/emotion3.svg';
import emotion4 from '../../../shared/assets/images/emotion4.svg';
import emotion5 from '../../../shared/assets/images/emotion5.svg';

// API import
import { getMainScreenData, getTodayMissions, completeMission, getEmotionRecord } from '../api/mainAPI';

// Redux import
import { getMainPageData, selectMainData, selectMainStatus, selectMainError } from '../mainSlice';

// 상수
const EMOTION_IMAGES = {
  1: emotion1,
  2: emotion2,
  3: emotion3,
  4: emotion4,
  5: emotion5
};

const ENCOURAGEMENT_MESSAGES = [
  '괜찮아, 너의 속도대로 천천히 가도 돼. 가장 중요한 건 멈추지 않는 용기야.',
  '세상의 모든 씨앗이 한 번에 싹을 틔우진 않아. 너만의 계절이 곧 올 거야.',
  '큰 변화가 아니어도 괜찮아. 어제보다 딱 한 걸음만 나아갔다면, 그건 정말 대단한 일이야.',
  '오늘도 무사히 하루를 보낸 것만으로도, 너는 충분히 너의 몫을 다한 거야. 정말 고생 많았어.',
  '가끔은 익숙하고 안전한 곳에 머무는 용기도 필요해. 이곳에서 충분히 힘을 얻고 다시 나아가자.',
  '충전 없이 계속 달릴 수 있는 배터리는 없어. 오늘은 잠시 쉬어가도 괜찮아, 아니, 쉬어야만 해.',
  '번아웃은 네가 게으르다는 증거가 아니야. 그만큼 최선을 다해 달려왔다는 증거일 뿐이야.',
  '무리하지 말자. 세상은 우리가 없어도 잘 돌아가. 잠시 나를 위한 시간을 갖는다고 큰일 나지 않아.',
  '너의 모든 감정은 소중해. 어떤 색깔의 감정이든, 그 자체로 아름다운 너의 일부야.',
  '방향을 잃은 것 같을 땐, 잠시 멈춰서 네 안의 나침반이 어디를 가리키는지 귀 기울여 봐.'
];

// 유틸리티 함수
const getRandomEncouragementMessage = () => {
  return ENCOURAGEMENT_MESSAGES[Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)];
};

const getEmotionImageByLevel = (emotionLevel) => {
  if (!emotionLevel) return questionMark;
  return EMOTION_IMAGES[emotionLevel] || questionMark;
};

const calculateProgress = (exp, expToNextLevel) => {
  return exp && expToNextLevel ? (exp / expToNextLevel) * 100 : 75;
};

const renderMissionList = (missions, handleMissionComplete) => {
  if (missions && missions.length > 0) {
    return missions.map((mission, index) => (
      <MissionItem key={mission.mission_id} $delay={0.1 * (index + 1)}>
        <MissionEmoji>✓</MissionEmoji>
        <MissionText>{mission.title}</MissionText>
        <MissionCheck 
          $completed={mission.is_completed}
          onClick={() => !mission.is_completed && handleMissionComplete(mission.mission_id)}
        >
          {mission.is_completed && '✓'}
        </MissionCheck>
      </MissionItem>
    ));
  }
};

/**
 * 메인 페이지 컴포넌트
 */
const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [speechBubbleVisible, setSpeechBubbleVisible] = useState(false);
  const [characterPromptVisible, setCharacterPromptVisible] = useState(true);
  const [statsVisible, setStatsVisible] = useState(true);
  
  // Redux 상태 가져오기
  const mainData = useSelector(selectMainData);
  const mainStatus = useSelector(selectMainStatus);
  const mainError = useSelector(selectMainError);
  const loading = mainStatus === 'loading';
  const error = mainError;
  
  // 로컬 상태
  const [emotionRecord, setEmotionRecord] = useState(null);

  // 컴포넌트 마운트 시 메인 데이터 로드 및 body 배경색 설정
  useEffect(() => {
    // 원래의 배경색 저장
    const originalBackground = document.body.style.backgroundColor;
    
    // body 배경색 제거
    document.body.style.backgroundColor = 'transparent';
    
    // Redux 액션으로 메인 데이터 로드
    dispatch(getMainPageData());
    loadTodayMissions();
    loadTodayEmotion();
    
    // 언마운트 시 원래 배경색 복원
    return () => {
      document.body.style.backgroundColor = originalBackground;
    };
  }, [dispatch]);

  const loadTodayEmotion = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식
      const emotionData = await getEmotionRecord(today);
      setEmotionRecord(emotionData);
    } catch (err) {
      setEmotionRecord(null);
    }
  }

  const loadTodayMissions = async () => {
    try {
      const missions = await getTodayMissions();
      // Redux 상태를 직접 수정하지 않고 API 호출로 데이터를 가져옴
      // mainSlice에 미션 업데이트를 위한 액션을 추가할 수도 있음
    } catch (err) {
      // 에러 처리
    }
  };

  const handleMissionComplete = async (missionId) => {
    try {
      await completeMission(missionId);
      // 미션 완료 후 메인 데이터 새로고침
      dispatch(getMainPageData()); // Redux 액션으로 전체 데이터 다시 로드
    } catch (err) {
      // 에러 처리
    }
  };

  const greetCharacter = () => {
    if (speechBubbleVisible) {
      return; // 말풍선이 보이는 동안 클릭 무시
    }

    setCharacterPromptVisible(false);
    setStatsVisible(false);
    setSpeechBubbleVisible(true);

    // 6초 후 말풍선 제거
    setTimeout(() => {
      setSpeechBubbleVisible(false);
      setTimeout(() => {
        setCharacterPromptVisible(true);
        setStatsVisible(true);
      }, 100);
    }, 6000);
  };

  // 로딩 중일 때
  if (loading) {
    return (
      <AppWrapper>
        <MobileContainer>
          <MainContent>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              로딩 중...
            </div>
          </MainContent>
        </MobileContainer>
      </AppWrapper>
    );
  }

  // 에러 발생 시
  if (error) {
    return (
      <AppWrapper>
        <MobileContainer>
          <MainContent>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              {typeof error === 'string' ? error : '데이터를 불러오는데 실패했습니다.'}
            </div>
          </MainContent>
        </MobileContainer>
      </AppWrapper>
    );
  }

  // 데이터가 없을 때
  if (!mainData) return null;

  // API 응답을 UI 구조에 맞게 변환
  const uiData = {
    nickname: mainData.nickname,
    character_status: mainData.characterInfo ? {
      type: mainData.characterInfo.characterType,
      level: mainData.characterInfo.level,
      exp: mainData.characterInfo.experience,
      exp_to_next_level: 1000 // 임의의 값 설정 또는 API에서 받아와야 함
    } : null,
    daily_missions: mainData.todayMissions?.map(mission => ({
      mission_id: mission.userDailyMissionId,
      title: mission.content,
      theme: mission.theme,
      theory: mission.theory,
      is_completed: mission.status === 'COMPLETED'
    })) || [],
    recent_record: mainData.recentRecord
  };

  return (
    <AppWrapper>
      <MobileContainer>
        <MainContent>
          <Header>
            <Greeting>
              <GreetingText>
                <n>{uiData.nickname || '사용자'}</n>
                <Message>님, 안녕하세요!</Message>
              </GreetingText>
            </Greeting>
            <Character onClick={greetCharacter}>
              <CharacterCircle onClick={greetCharacter}>
                <CharacterSvg src={mony1} alt="캐릭터" />
              </CharacterCircle>
            </Character>
          </Header>                  <StatsContainer>
          <StatsRow>
            {speechBubbleVisible && (
              <SpeechBubble>
                <img src={Rectangle} alt="말풍선" />
                <BubbleText>{getRandomEncouragementMessage()}</BubbleText>
              </SpeechBubble>
            )}
            <StatItem className="growth" $visible={statsVisible}>
              <StatLabel>성장률</StatLabel>
              <ProgressBar>
                <ProgressFill $progress={
                  calculateProgress(
                    uiData?.character_status?.exp,
                    uiData?.character_status?.exp_to_next_level
                  )
                } />
              </ProgressBar>
            </StatItem>
            <StatItem className="points" $visible={statsVisible}>
              <StatIcon>P</StatIcon>
              <StatValue>{uiData?.character_status?.exp || 0}P</StatValue>
            </StatItem>
            <StatItem className="level" $visible={statsVisible}>
              <StatIcon className="level">LV</StatIcon>
              <StatValue className="level">{String(uiData?.character_status?.level || 1).padStart(2, '0')}</StatValue>
            </StatItem>
            <CharacterPrompt $visible={characterPromptVisible}>
              <PromptText>캐릭터를<br />눌러보세요</PromptText>
            </CharacterPrompt>
          </StatsRow>
          
          <SecondRow>
            <DayCard $hasEmotion={!!emotionRecord?.emotion_level}>
              <DayEmoji>오늘의 감정 상태</DayEmoji>
              <DayText src={getEmotionImageByLevel(emotionRecord?.emotion_level)} alt="감정상태" />
              {!emotionRecord?.emotion_level && (
                <DayDescription>오늘의 감정을<br />기록해 주세요!</DayDescription>
              )}
            </DayCard>
          </SecondRow>
        </StatsContainer>

        <MissionSection>
          <SectionTitle>오늘의 미션 목록</SectionTitle>
          <MissionList>
            {renderMissionList(uiData?.daily_missions, handleMissionComplete)}
          </MissionList>
        </MissionSection>

        <EmotionSection>
          <EmotionContent onClick={() => navigate('/emotion')}>
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
      </MobileContainer>
    </AppWrapper>
  );
}

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
// 전체 화면을 감싸는 컨테이너
const AppWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
`;

// 모바일 앱 컨테이너
const MobileContainer = styled.div`
  width: 430px;
  max-width: 430px;
  min-height: 100vh;
  background-color: #FEFFF5;
  position: relative;
  overflow-x: hidden;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  @media (max-width: 430px) {
    width: 100%;
    box-shadow: none;
  }
`;

const MainContent = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #fefff5;
  position: relative;
  overflow-x: hidden;
  padding: 20px 20px 40px;
  box-sizing: border-box;
  
  @media (max-width: 430px) {
    padding: 15px 15px 40px;
  }
`;

const Header = styled.header`
  position: relative;
  padding: 0;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: #fefff5;
  width: 100%;
  margin: 0 auto;
`;

const Greeting = styled.div`
  margin-top: 40px;
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
  top: 80px;
  right: 20px;
  z-index: 100;
  cursor: pointer;
  width: 150px;
  height: 170px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 430px) {
    width: 130px;
    height: 150px;
    right: 10px;
  }
`;

const CharacterCircle = styled.div`
  width: 100%;
  height: 100%;
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
  
  @media (max-width: 430px) {
    left: 15px;
    right: 15px;
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
  top: -4px;
  left: -2px;
  width: 220px;
  height: 70px;
  pointer-events: none;
  z-index: 10;
  
  img {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
  }
`;

const BubbleText = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #1a2e1f;
  text-align: center;
  z-index: 2;
  padding: 10px 15px;
  overflow: hidden;
  word-wrap: break-word;
  word-break: keep-all;
  line-height: 1.3;
`;

const StatItem = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #40ea87;
  border-radius: 18px;
  padding: 8px 6px;
  height: 38px;
  display: flex;
  align-items: center;
  gap: 6px;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(64, 234, 135, 0.1);
  transition: opacity 0.6s ease, transform 0.6s ease;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translateY(${props => props.$visible ? 0 : 20}px);
  pointer-events: ${props => props.$visible ? 'auto' : 'none'};

  &.growth {
    width: 110px;
    gap: 8px;
  }

  &.points {
    width: 70px;
  }

  &.level {
    width: 60px;
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
  font-size: 9px;
  font-weight: 900;
  box-shadow: 0 2px 8px rgba(64, 234, 135, 0.3);
  flex-shrink: 0;

  &.level {
    background: #ffcd6a;
    box-shadow: 0 2px 8px rgba(255, 205, 106, 0.3);
  }
`;

const StatValue = styled.span`
  font-size: 13px;
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
  width: ${props => props.$progress || 75}%;
  height: 100%;
  background: #2ad948;
  border-radius: 2px;
`;

const DayCard = styled.div`
  width: 120px;
  height: 120px; /* 정사각형 유지 */
  background: white;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: ${props => props.$hasEmotion ? 'center' : 'space-between'};
  align-items: center;
  padding: 15px 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const DayEmoji = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
  text-align: center;
  line-height: 1.2;
`;

const DayText = styled.img`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
`;

const DayDescription = styled.p`
  font-size: 10px;
  font-weight: 500;
  color: #666666;
  margin: 0;
  line-height: 1.2;
  text-align: center;
`;

const CharacterPrompt = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #40ea87;
  border-radius: 18px;
  padding: 8px 12px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(64, 234, 135, 0.1);
  width: auto;
  z-index: 10;
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
  padding: 0;
  margin-top: 20px;
  position: relative;
  z-index: 1;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
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
  cursor: ${props => props.$completed ? 'default' : 'pointer'};

  &:hover {
    ${props => !props.$completed && `
      border-color: #40ea87;
      background: rgba(64, 234, 135, 0.1);
    `}
  }
`;

const EmotionSection = styled.section`
  padding: 0;
  margin-top: 20px;
  margin-bottom: 100px;
  position: relative;
  z-index: 1;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
`;

const EmotionContent = styled.div`
  background: white;
  border: 0.5px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 60px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f9fa;
  }
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
