import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// 이미지 import
import mony1 from '../../../shared/assets/images/mony1.svg';

/**
 * 마이페이지 컴포넌트
 * 사용자 정보, 캐릭터 정보, 알림 설정, 정보 관리 등을 포함
 */
const MyPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    name: '김멋사',
    nickname: '끝내주조',
    level: 1,
    points: 28,
    growthRate: 79.4
  });

  // 컴포넌트 마운트 시 body 배경색 설정
  useEffect(() => {
    const originalBackground = document.body.style.backgroundColor;
    document.body.style.backgroundColor = 'transparent';
    
    return () => {
      document.body.style.backgroundColor = originalBackground;
    };
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleMenuClick = () => {
    // 메뉴 클릭 로직
    console.log('메뉴 버튼 클릭');
  };

  const handleCharacterCustomize = () => {
    // 캐릭터 꾸미기 로직
    console.log('캐릭터 꾸미기 클릭');
  };

  const handleNotificationSetting = (type) => {
    // 알림 설정 로직
    console.log(`${type} 알림 설정 클릭`);
  };

  const handleInfoManagement = (type) => {
    // 정보 관리 로직
    console.log(`${type} 정보 관리 클릭`);
  };

  return (
    <AppWrapper>
      <MobileContainer>
        <Container>
          {/* Header */}
          <Header>
            <BackButton onClick={handleBack}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15,18 9,12 15,6"></polyline>
              </svg>
            </BackButton>
            <HeaderTitle>마이페이지</HeaderTitle>
            <MenuButton onClick={handleMenuClick}>
              <MenuLine />
              <MenuLine />
              <MenuLine />
            </MenuButton>
          </Header>

          {/* User Info */}
          <UserInfo>
            <Greeting>
              <UserName>{userInfo.name}</UserName>님, 안녕하세요!
            </Greeting>
            <InfoBadge>내정보</InfoBadge>
          </UserInfo>

          {/* Character Card */}
          <CharacterCard>
            <CharacterHeader>
              <CharacterTitle>내 캐릭터</CharacterTitle>
              <CharacterStatsInline>
                <GrowthBadge>
                  성장률
                  <ProgressContainer>
                    <ProgressBar>
                      <ProgressFill $progress={userInfo.growthRate} />
                    </ProgressBar>
                  </ProgressContainer>
                </GrowthBadge>
                
                <StatBadge>
                  <StatIcon className="points">P</StatIcon>
                  <StatText className="points">{userInfo.points}P</StatText>
                </StatBadge>
                
                <StatBadge>
                  <StatIcon className="level">LV</StatIcon>
                  <StatText className="level">{String(userInfo.level).padStart(2, '0')}</StatText>
                </StatBadge>
              </CharacterStatsInline>
            </CharacterHeader>
            
            <CharacterMain>
              <CharacterAvatar>
                <CharacterImage src={mony1} alt="캐릭터" />
              </CharacterAvatar>

              <CharacterInfo>
                <NicknameDisplay>
                  <NicknameLabel>닉네임</NicknameLabel>
                  <Nickname>{userInfo.nickname}</Nickname>
                </NicknameDisplay>
              </CharacterInfo>
            </CharacterMain>

            <CustomizeButton onClick={handleCharacterCustomize}>
              캐릭터 꾸미기
            </CustomizeButton>
          </CharacterCard>

          {/* Notification Service */}
          <NotificationSection>
            <SectionTitle>알림 서비스</SectionTitle>
            
            <NotificationItems>
              <NotificationItem onClick={() => handleNotificationSetting('activity')}>
                <NotificationLeft>
                  <NotificationDot />
                  <NotificationTitle>활동·미션 알림</NotificationTitle>
                </NotificationLeft>
                <NotificationRight>
                  <NotificationStatus>앱푸시</NotificationStatus>
                  <NotificationArrow>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9,18 15,12 9,6"></polyline>
                    </svg>
                  </NotificationArrow>
                </NotificationRight>
              </NotificationItem>

              <NotificationItem onClick={() => handleNotificationSetting('progress')}>
                <NotificationLeft>
                  <NotificationDot />
                  <NotificationTitle>누적 진행 상황 알림</NotificationTitle>
                </NotificationLeft>
                <NotificationRight>
                  <NotificationStatus>알림톡(SMS)</NotificationStatus>
                  <NotificationArrow>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9,18 15,12 9,6"></polyline>
                    </svg>
                  </NotificationArrow>
                </NotificationRight>
              </NotificationItem>

              <NotificationItem onClick={() => handleNotificationSetting('mood')}>
                <NotificationLeft>
                  <NotificationDot />
                  <NotificationTitle>마음 상태 체크 알림</NotificationTitle>
                </NotificationLeft>
                <NotificationRight>
                  <NotificationStatus>이용안함</NotificationStatus>
                  <NotificationArrow>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9,18 15,12 9,6"></polyline>
                    </svg>
                  </NotificationArrow>
                </NotificationRight>
              </NotificationItem>
            </NotificationItems>
          </NotificationSection>

          {/* Divider */}
          <Divider />

          {/* Info Management */}
          <InfoSection>
            <SectionTitle>정보관리</SectionTitle>
            
            <InfoItems>
              <InfoItem onClick={() => handleInfoManagement('profile')}>
                <InfoTitle>내 정보 변경</InfoTitle>
                <InfoArrow>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9,18 15,12 9,6"></polyline>
                  </svg>
                </InfoArrow>
              </InfoItem>

              <InfoItem onClick={() => handleInfoManagement('marketing')}>
                <InfoTitle>마케팅 동의 설정</InfoTitle>
                <InfoArrow>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9,18 15,12 9,6"></polyline>
                  </svg>
                </InfoArrow>
              </InfoItem>
            </InfoItems>
          </InfoSection>
        </Container>
      </MobileContainer>
    </AppWrapper>
  );
};

// Styled Components
const AppWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
`;

const MobileContainer = styled.div`
  width: 430px;
  max-width: 430px;
  min-height: 100vh;
  background-color: #FEFFF5;
  position: relative;
  overflow-x: hidden;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);

  @media (max-width: 430px) {
    width: 100%;
    box-shadow: none;
  }
`;

const Container = styled.div`
  width: 100%;
  background-color: #fefff5;
  min-height: 100vh;
  position: relative;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #1a201c;
  line-height: 1.4;
  font-size: 14px;
`;

/* Header */
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px;
  background-color: #fefff5;
  position: relative;
  height: 60px;
  margin-top: 58px;
`;

const BackButton = styled.button`
  width: 24px;
  height: 24px;
  cursor: pointer;
  color: #000;
  background: none;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    opacity: 0.7;
  }
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const HeaderTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #111;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const MenuButton = styled.button`
  width: 24px;
  height: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  padding: 2px 0;
  background: none;
  border: none;
  
  &:hover {
    opacity: 0.7;
  }
`;

const MenuLine = styled.div`
  width: 100%;
  height: 2px;
  background-color: #000;
  border-radius: 1px;
`;

/* User Info */
const UserInfo = styled.div`
  padding: 20px;
  background-color: #fefff5;
  position: relative;
`;

const Greeting = styled.div`
  font-size: 20px;
  color: #111;
  margin-bottom: 16px;
  line-height: 1.4;
  letter-spacing: -0.02em;
`;

const UserName = styled.span`
  font-weight: 600;
  color: #111;
`;

const InfoBadge = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: transparent;
  border: 0.5px solid #9c9c9c;
  border-radius: 21px;
  padding: 8px 12px;
  font-size: 10px;
  color: #4b4b4b;
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 140%;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.04);
`;

/* Character Card */
const CharacterCard = styled.div`
  margin: 24px 20px 64px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid #40ea87;
  border-radius: 21px;
  padding: 20px;
  position: relative;
  backdrop-filter: blur(10px);
`;

const CharacterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  width: 100%;
`;

const CharacterTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1a201c;
  letter-spacing: -0.02em;
  line-height: 140%;
  flex-shrink: 0;
`;

const CharacterStatsInline = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  flex: 0.85;
  justify-content: flex-end;
`;

const CharacterMain = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  gap: 20px;
`;

const CharacterAvatar = styled.div`
  width: 180px;
  height: 180px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const CharacterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const CharacterInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
`;

const NicknameDisplay = styled.div`
  margin-bottom: 16px;
`;

const NicknameLabel = styled.div`
  font-size: 11px;
  color: #7f7f7f;
  font-weight: 500;
  margin-bottom: 4px;
  letter-spacing: -0.02em;
  line-height: 140%;
`;

const Nickname = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #1a201c;
  letter-spacing: -0.02em;
  line-height: 140%;
`;

const StatBadge = styled.div`
  background-color: #fefff5;
  border: 0.3px solid #40ea87;
  border-radius: 10.41px;
  padding: 8px 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 7.21px;
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 140%;
  white-space: nowrap;
  height: 21.4px;
  box-sizing: border-box;
`;

const StatIcon = styled.div`
  width: 13.2px;
  height: 13.2px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 6px;
  color: white;
  font-weight: 900;
  flex-shrink: 0;
  
  &.points {
    background-color: #40ea87;
  }
  
  &.level {
    background-color: #ffce6b;
  }
`;

const StatText = styled.span`
  font-size: 7.2px;
  
  &.points {
    color: #40ea87;
  }
  
  &.level {
    color: #ffce6b;
  }
`;

const GrowthBadge = styled.div`
  background-color: #fefff5;
  border: 0.3px solid #40ea87;
  border-radius: 10.41px;
  padding: 8px 6px;
  font-size: 7.21px;
  color: #2ad948;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 140%;
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 60px;
  height: 21.4px;
  box-sizing: border-box;
`;

const ProgressContainer = styled.div`
  flex: 1;
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
`;

const ProgressBar = styled.div`
  position: relative;
  width: 100%;
  height: 1.5px;
  background-color: #d9d9d9;
  border-radius: 2.46px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #2ad948;
  width: ${props => props.$progress}%;
  border-radius: 2.46px;
`;

const CustomizeButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  color: #5a605b;
  font-size: 11px;
  font-weight: 300;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  letter-spacing: -0.02em;
  line-height: 140%;
  background: none;
  border: none;
  
  &::after {
    content: '';
    width: 20px;
    height: 20px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%235a605b' stroke-width='2'%3E%3Cpolyline points='9,18 15,12 9,6'%3E%3C/polyline%3E%3C/svg%3E") no-repeat center;
    background-size: contain;
  }
  
  &:hover {
    background-color: rgba(64, 234, 135, 0.05);
  }
`;

/* Notification Service */
const NotificationSection = styled.div`
  margin: -24px 20px 40px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #41604c;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
  line-height: 140%;
`;

const NotificationItems = styled.div`
  background-color: #fff;
  border: 0.5px solid #9c9c9c;
  border-radius: 21px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.04);
  overflow: hidden;
`;

const NotificationItem = styled.div`
  padding: 24px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: rgba(64, 234, 135, 0.05);
  }
`;

const NotificationLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const NotificationDot = styled.div`
  width: 4px;
  height: 4px;
  background-color: #40ea87;
  border-radius: 50%;
  flex-shrink: 0;
`;

const NotificationTitle = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #3f3f3f;
  letter-spacing: -0.02em;
  line-height: 140%;
`;

const NotificationRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const NotificationStatus = styled.div`
  font-size: 11px;
  font-weight: 300;
  color: #5a605b;
  text-align: right;
  letter-spacing: -0.02em;
  line-height: 140%;
`;

const NotificationArrow = styled.div`
  width: 20px;
  height: 20px;
  color: #ccc;
  flex-shrink: 0;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

/* Divider */
const Divider = styled.div`
  height: 1.7px;
  background-color: #e0e0e0;
  margin: 40px 0;
  width: 100%;
`;

/* Info Management */
const InfoSection = styled.div`
  margin: 0 20px 64px;
`;

const InfoItems = styled.div`
  background-color: transparent;
`;

const InfoItem = styled.div`
  padding: 16px 20px 16px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  background-color: transparent;
  
  &:hover {
    background-color: rgba(64, 234, 135, 0.05);
  }
`;

const InfoTitle = styled.div`
  font-size: 12px;
  font-weight: 300;
  color: #000;
  letter-spacing: -0.02em;
  line-height: 140%;
`;

const InfoArrow = styled.div`
  width: 20px;
  height: 20px;
  color: #ccc;
  flex-shrink: 0;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

export default MyPage;