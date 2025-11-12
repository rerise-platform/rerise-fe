import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

// 이미지 import (폴백)
import mony1 from "../../../shared/assets/images/mony1.svg";

// ✅ 메인 페이지에서 사용하는 동일 API 사용 (경로 확인해서 필요시 수정)
import { getMainScreenData } from "../../main/api/mainAPI";
// ✅ 캐릭터 이미지 매퍼 (캐릭터 타입/단계 → 이미지)
import { getCharacterImage } from "../../../shared/utils/characterImageMapper";

/** 결과(캐릭터 타입)별 업그레이드 썸네일 매핑 */
const UPGRADE_IMAGES = {
  mony: ["/images/upgrade1.png"],
  tory: ["/images/upgrade1.png"],
  pory: ["/images/upgrade1.png"],
  koko: ["/images/upgrade1.png"],
  default: ["/images/upgrade1.png"],
};

/** 퍼센트 보정 */
const toPercent = (v) => {
  const n = Number(v);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, n));
};

/**
 * 마이페이지 컴포넌트
 * 사용자 정보, 캐릭터 정보, 알림 설정, 정보 관리 등을 포함
 */
const MyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [userInfo, setUserInfo] = useState({
    name: "사용자",
    nickname: "끝내주조",
    level: 1,
    points: 28,
    growthRate: 79.4,
    characterType: "mony",
    characterStage: 1,
  });
  const [loading, setLoading] = useState(false);

  // ✅ 알림 스위치 상태 (기본값은 보기 좋게 임의 세팅)
  const [noti, setNoti] = useState({
    activity: true,
    progress: true,
    mood: false,
  });

  // 컴포넌트 마운트 시 body 배경색 설정
  useEffect(() => {
    const originalBackground = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "transparent";

    return () => {
      document.body.style.backgroundColor = originalBackground;
    };
  }, []);

  // ✅ 메인과 동일 데이터로 동기화 (인삿말/성장률/포인트/레벨/닉네임/캐릭터)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getMainScreenData();
        if (!mounted) return;

        const displayName =
          data?.realName || data?.name || data?.nickname || "사용자";

        setUserInfo((prev) => ({
          ...prev,
          name: displayName,
          nickname: data?.nickname ?? prev.nickname,
          level: data?.level ?? prev.level,
          points: data?.exp ?? prev.points,
          growthRate: data?.growthRate ?? prev.growthRate,
          characterType: data?.characterType ?? prev.characterType,
          characterStage: data?.characterStage ?? prev.characterStage,
        }));
      } catch (e) {
        console.error("마이페이지 데이터 로드 실패:", e);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // ✅ (옵션) 테스트 결과로 캐릭터 즉시 변경: navigate 시 state로 전달받음
  // 예) navigate('/mypage', { state: { characterResult: { type: 'tory', stage: 2 } } })
  useEffect(() => {
    const result = location.state?.characterResult;
    if (result?.type) {
      setUserInfo((prev) => ({
        ...prev,
        characterType: result.type,
        characterStage: Number(result.stage ?? prev.characterStage) || 1,
      }));
      // 필요시 백엔드 PATCH 저장 가능
      // navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleCharacterCustomize = () => {
    console.log("캐릭터 꾸미기 클릭");
  };

  const handleNotificationSetting = (type) => {
    console.log(`${type} 알림 설정 클릭`);
  };

  const handleInfoManagement = (type) => {
    console.log(`${type} 정보 관리 클릭`);
  };

  // ✅ 캐릭터 이미지 동적 계산 (없으면 폴백)
  const characterImg =
    getCharacterImage(userInfo.characterType, userInfo.characterStage) || mony1;

  // 결과 타입에 따른 업그레이드 썸네일
  const [thumb1] =
    UPGRADE_IMAGES[userInfo.characterType] || UPGRADE_IMAGES.default;

  // ✅ 공통 토글 핸들러
  const toggle = (key) => setNoti((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <AppWrapper>
      <MobileContainer>
        <Container>
          {/* Header */}
          <Header>
            <BackButton onClick={handleBack}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="15,18 9,12 15,6"></polyline>
              </svg>
            </BackButton>
            <HeaderTitle>마이페이지</HeaderTitle>
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
                      {/* ✅ 게이지 퍼센트 보정 및 채움 */}
                      <ProgressFill
                        $progress={toPercent(userInfo.growthRate)}
                      />
                    </ProgressBar>
                  </ProgressContainer>
                </GrowthBadge>

                <StatBadge>
                  <StatIcon className="points">P</StatIcon>
                  <StatText className="points">
                    {userInfo.points ?? 0}P
                  </StatText>
                </StatBadge>

                <StatBadge>
                  <StatIcon className="level">LV</StatIcon>
                  <StatText className="level">
                    {String(userInfo.level ?? 1).padStart(2, "0")}
                  </StatText>
                </StatBadge>
              </CharacterStatsInline>
            </CharacterHeader>

            <CharacterMain>
              <CharacterAvatar>
                <CharacterImage src={characterImg} alt="캐릭터" />
              </CharacterAvatar>

              <CharacterInfo>
                <NicknameDisplay>
                  <NicknameLabel>닉네임</NicknameLabel>
                  <Nickname>{userInfo.nickname}</Nickname>
                </NicknameDisplay>
              </CharacterInfo>
            </CharacterMain>

            {/* ✅ 업그레이드 썸네일 (요청: 없애지 말고 주석 처리)
            <UpgradeThumbs>
              <img src={thumb1} alt="업그레이드 미리보기 1" />
            </UpgradeThumbs>
            */}

            <CustomizeButton onClick={handleCharacterCustomize}>
              캐릭터 꾸미기
            </CustomizeButton>
          </CharacterCard>

          {/* Notification Service */}
          <NotificationSection>
            <SectionTitle>알림 서비스</SectionTitle>

            <NotificationItems>
              <NotificationItem
                onClick={() => handleNotificationSetting("activity")}
              >
                <NotificationLeft>
                  <NotificationDot />
                  <NotificationTitle>활동·미션 알림</NotificationTitle>
                </NotificationLeft>
                <NotificationRight>
                  {/* <NotificationStatus>앱푸시</NotificationStatus> */}
                  <ToggleSwitch
                    role="switch"
                    aria-checked={noti.activity}
                    $on={noti.activity}
                    onClick={() => toggle("activity")}
                  />
                </NotificationRight>
              </NotificationItem>

              <NotificationItem
                onClick={() => handleNotificationSetting("progress")}
              >
                <NotificationLeft>
                  <NotificationDot />
                  <NotificationTitle>누적 진행 상황 알림</NotificationTitle>
                </NotificationLeft>
                <NotificationRight>
                  {/* <NotificationStatus>앱푸시</NotificationStatus> */}
                  <ToggleSwitch
                    role="switch"
                    aria-checked={noti.progress}
                    $on={noti.progress}
                    onClick={() => toggle("progress")}
                  />
                </NotificationRight>
              </NotificationItem>

              <NotificationItem
                onClick={() => handleNotificationSetting("mood")}
              >
                <NotificationLeft>
                  <NotificationDot />
                  <NotificationTitle>마음 상태 체크 알림</NotificationTitle>
                </NotificationLeft>
                <NotificationRight>
                  {/* <NotificationStatus>이용안함</NotificationStatus> */}
                  <ToggleSwitch
                    role="switch"
                    aria-checked={noti.mood}
                    $on={noti.mood}
                    onClick={() => toggle("mood")}
                  />
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
              <InfoItem onClick={() => handleInfoManagement("profile")}>
                <InfoTitle>내 정보 변경</InfoTitle>
                <InfoArrow>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="9,18 15,12 9,6"></polyline>
                  </svg>
                </InfoArrow>
              </InfoItem>

              <InfoItem onClick={() => handleInfoManagement("marketing")}>
                <InfoTitle>마케팅 동의 설정</InfoTitle>
                <InfoArrow>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
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
  background-color: rgba(254, 255, 245, 1);
`;

const MobileContainer = styled.div`
  width: 430px;
  max-width: 430px;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;

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
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, sans-serif;
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
  margin-top: 25px;
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
  margin-left: 5px;
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
  margin-right: 5px;
`;

/* Character Card */
const CharacterCard = styled.div`
  margin: 0px 20px 54px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid #40ea87;
  border-radius: 21px;
  padding: 20px;
  padding-bottom: 10px;
  position: relative;
  backdrop-filter: blur(10px);
`;

const CharacterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 31px;
  width: 100%;
`;

const CharacterTitle = styled.div`
  font-size: clamp(16px, 2vw, 17px);
  font-weight: 600;
  color: #1a201c;
  letter-spacing: -0.02em;
  line-height: 140%;
  flex-shrink: 0;
`;

const CharacterStatsInline = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex: 0.85;
  justify-content: flex-end;
`;

const CharacterMain = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0px;
  gap: 25px;
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
  margin-bottom: 90px;
`;

const NicknameLabel = styled.div`
  font-size: clamp(12px, 2vw, 14px);
  color: #7f7f7f;
  font-weight: 500;
  margin-bottom: 4px;
  letter-spacing: -0.02em;
  line-height: 140%;
`;

const Nickname = styled.div`
  font-size: clamp(18px, 2vw, 20px);
  font-weight: 600;
  color: #1a201c;
  letter-spacing: -0.02em;
  line-height: 140%;
`;

const StatBadge = styled.div`
  background-color: #fefff5;
  border: 0.3px solid #40ea87;
  border-radius: 10.41px;
  padding: 10px 10px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 8px;
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
  font-size: clamp(8px, 2vw, 10px);

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
  font-size: clamp(8px, 2vw, 10px);
  color: #2ad948;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 140%;
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 60px;
  height: 25px;
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
  height: 4px;
  background-color: #d9d9d9;
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #2ad948;
  /* ❗️버그 수정: 쉼표 제거 + 퍼센트 문자열 명시 */
  width: ${({ $progress }) => `${$progress}%`};
  border-radius: 2.46px;
`;

/* ✅ 업그레이드 썸네일 컨테이너 (요청: 유지하지만 현재 미사용)
const UpgradeThumbs = styled.div`
  position: absolute;
  right: 10px;
  bottom: 45px;
  display: flex;
  gap: 8px;
  align-items: flex-end;
  background-color: rgba(255, 255, 255, 0.5);

  img {
    width: 130px;
    height: 60px;
    object-fit: contain;
  }
`;
*/

const CustomizeButton = styled.button`
  position: absolute;
  bottom: 40px;
  right: 15px;
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
  margin-top: 0;

  &::after {
    content: "";
    width: 20px;
    height: 20px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%235a605b' stroke-width='2'%3E%3Cpolyline points='9,18 15,12 9,6'%3E%3C/polyline%3E%3C/svg%3E")
      no-repeat center;
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

/* 기존 텍스트 뱃지 유지(미사용) */
const NotificationStatus = styled.div`
  font-size: 11px;
  font-weight: 300;
  color: #5a605b;
  text-align: right;
  letter-spacing: -0.02em;
  line-height: 140%;
`;

/* ▶︎ 새 토글 스위치 (알약 UI) */
const ToggleSwitch = styled.button`
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: 999px;
  border: 1px solid ${({ $on }) => ($on ? "#2acb6f" : "#d1d5db")};
  background: ${({ $on }) => ($on ? "#40ea87" : "#e5e7eb")};
  transition: background 160ms ease, border-color 160ms ease;
  cursor: pointer;
  padding: 0;
  outline: none;

  &:after {
    content: "";
    position: absolute;
    top: 50%;
    left: ${({ $on }) => ($on ? "22px" : "2px")};
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    transition: left 160ms ease;
  }
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
  margin: 0 20px 100px;
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
