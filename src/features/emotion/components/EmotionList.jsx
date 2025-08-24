import React from 'react';
import styled from 'styled-components';
import { formatDate } from '../../../shared/utils/formatDate';

// 이미지 import
import emotion1 from '../../../shared/assets/images/emotion1.svg';
import emotion2 from '../../../shared/assets/images/emotion2.svg';
import emotion3 from '../../../shared/assets/images/emotion3.svg';
import emotion4 from '../../../shared/assets/images/emotion4.svg';
import emotion5 from '../../../shared/assets/images/emotion5.svg';

const EmotionList = ({ emotions, onEdit, onDelete }) => {
  const emotionImages = {
    1: emotion1,
    2: emotion2,
    3: emotion3,
    4: emotion4,
    5: emotion5
  };

  const getEmotionLabel = (level) => {
    const labels = {
      1: '매우 나쁨',
      2: '나쁨', 
      3: '보통',
      4: '좋음',
      5: '매우 좋음'
    };
    return labels[level] || '알 수 없음';
  };

  if (!emotions || emotions.length === 0) {
    return (
      <EmptyState>
        <EmptyMessage>아직 기록된 감정이 없습니다.</EmptyMessage>
        <EmptySubMessage>오늘의 감정을 기록해보세요!</EmptySubMessage>
      </EmptyState>
    );
  }

  return (
    <ListContainer>
      {emotions.map((emotion) => (
        <EmotionCard key={emotion.diary_id}>
          <CardHeader>
            <DateText>{formatDate(emotion.date)}</DateText>
            <ActionButtons>
              <ActionButton onClick={() => onEdit(emotion)}>수정</ActionButton>
              <ActionButton 
                $danger 
                onClick={() => onDelete(emotion.diary_id)}
              >
                삭제
              </ActionButton>
            </ActionButtons>
          </CardHeader>
          
          <EmotionDisplay>
            <EmotionImage 
              src={emotionImages[emotion.emotion_level]} 
              alt={getEmotionLabel(emotion.emotion_level)}
            />
            <EmotionInfo>
              <EmotionLabel>{getEmotionLabel(emotion.emotion_level)}</EmotionLabel>
              {emotion.keywords && emotion.keywords.length > 0 && (
                <Keywords>
                  {emotion.keywords.map((keyword, index) => (
                    <Keyword key={index}>#{keyword}</Keyword>
                  ))}
                </Keywords>
              )}
            </EmotionInfo>
          </EmotionDisplay>

          {emotion.memo && (
            <Memo>{emotion.memo}</Memo>
          )}
        </EmotionCard>
      ))}
    </ListContainer>
  );
};

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 20px;
`;

const EmotionCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const DateText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #666;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  border: 1px solid ${props => props.$danger ? '#ff6b6b' : '#40ea87'};
  background: transparent;
  color: ${props => props.$danger ? '#ff6b6b' : '#40ea87'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$danger ? '#ff6b6b' : '#40ea87'};
    color: white;
  }
`;

const EmotionDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
`;

const EmotionImage = styled.img`
  width: 48px;
  height: 48px;
  flex-shrink: 0;
`;

const EmotionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const EmotionLabel = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const Keywords = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Keyword = styled.span`
  padding: 4px 8px;
  background: #f0f9ff;
  color: #40ea87;
  font-size: 12px;
  font-weight: 500;
  border-radius: 12px;
`;

const Memo = styled.p`
  margin: 0;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  color: #555;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
`;

const EmptyMessage = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: #666;
  margin: 0 0 8px 0;
`;

const EmptySubMessage = styled.p`
  font-size: 14px;
  color: #999;
  margin: 0;
`;

export default EmotionList;
