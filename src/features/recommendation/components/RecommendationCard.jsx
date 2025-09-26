import { useState, useEffect } from 'react';
import styled from 'styled-components';
import QuestionMarkIcon from '../../../shared/assets/images/메인물음표.svg';
import Emotion1 from '../../../shared/assets/images/emotion1.svg';
import Emotion2 from '../../../shared/assets/images/emotion2.svg';
import Emotion3 from '../../../shared/assets/images/emotion3.svg';
import Emotion4 from '../../../shared/assets/images/emotion4.svg';
import Emotion5 from '../../../shared/assets/images/emotion5.svg';
import { getSeochoPlaceRecommendations } from '../api/recommendationAPI';

const RecommendationCard = ({ onRefresh }) => {
  const [emotionLevel, setEmotionLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allPlaces, setAllPlaces] = useState([]);
  const [currentPlaceIndex, setCurrentPlaceIndex] = useState(0);

  // 장소 추천 API 호출
  const fetchPlaceRecommendations = async () => {
    try {
      const response = await getSeochoPlaceRecommendations();
      if (response.success && response.recommendation) {
        // 🌟으로 장소들을 분할하고 빈 문자열 제거
        const places = response.recommendation.split('🌟').filter(place => place.trim());
        setAllPlaces(places);
        setCurrentPlaceIndex(0);
      }
    } catch (error) {
      console.error('장소 추천 조회 중 오류 발생:', error);
    }
  };

  // 오늘 날짜의 일기 조회 API 호출
  const fetchTodayRecord = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식
      const token = localStorage.getItem('token'); // JWT 토큰 가져오기
      
      const response = await fetch(`/api/v1/records/date/${today}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEmotionLevel(data.emotion_level);
      } else {
        // 일기가 없는 경우 기본값 설정
        setEmotionLevel(3);
      }
    } catch (error) {
      console.error('일기 조회 중 오류 발생:', error);
      setEmotionLevel(3); // 에러 시 기본값
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 API 호출
  useEffect(() => {
    fetchTodayRecord();
    fetchPlaceRecommendations();
  }, []);

  // 다음 장소로 새로고침
  const handleRefresh = () => {
    if (allPlaces.length > 0) {
      setCurrentPlaceIndex((prevIndex) => (prevIndex + 1) % allPlaces.length);
    }
    if (onRefresh) onRefresh();
  };

  // emotion_level에 따른 이모지 SVG 매핑
  const getEmotionEmoji = (level) => {
    switch (level) {
      case 1: return Emotion1; // emotion1 - 매우 나쁨
      case 2: return Emotion2; // emotion2 - 나쁨
      case 3: return Emotion3; // emotion3 - 보통
      case 4: return Emotion4; // emotion4 - 좋음
      case 5: return Emotion5; // emotion5 - 매우 좋음
      default: return Emotion3; // 기본값
    }
  };

  // 현재 표시할 장소 가져오기
  const getCurrentPlace = () => {
    if (allPlaces.length === 0) return '추천장소를 불러오는 중입니다...';
    return allPlaces[currentPlaceIndex] || '추천장소를 불러오는 중입니다...';
  };

  // 장소 URL 추출하기
  const getCurrentPlaceUrl = () => {
    const currentPlace = getCurrentPlace();
    const urlMatch = currentPlace.match(/\(https:\/\/[^)]+\)/);
    return urlMatch ? urlMatch[0].slice(1, -1) : null; // 괄호 제거
  };

  // 자세히 보기 버튼 클릭
  const handleDetailClick = () => {
    const url = getCurrentPlaceUrl();
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <CardContainer>
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
          {loading ? (
            <EmotionImg src={QuestionMarkIcon} alt="로딩 중" />
          ) : (
            <EmotionImg src={getEmotionEmoji(emotionLevel)} alt={`감정 레벨 ${emotionLevel}`} />
          )}
        </Emoji>
      </EmojiSection>
      
      <MainText>
        오늘의 감정 상태를 반영한<br />
        <LocationHighlight>서초구 추천장소</LocationHighlight>입니다!
      </MainText>
      
      <Description>
        {getCurrentPlace().split('\n').map((line, index) => (
          <span key={index}>
            {index === 0 ? `🌟${line}` : line}
            {index < getCurrentPlace().split('\n').length - 1 && <br />}
          </span>
        ))}
      </Description>
      
      <ActionButton onClick={handleDetailClick}>추천 장소 자세하게 보기</ActionButton>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  background: #FEFFF5;
  border-radius: 20px;
  padding: 24px 20px;
  margin: 0 0 16px 0;
  border: 1px solid #D9D9D9;
  position: relative;
  width: 100%;
  max-width: 340px;
  box-sizing: border-box;

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
  width: 13px;
  height: 13px;
  color: #34C759;
`;

const EmotionImg = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
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
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 8px;
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