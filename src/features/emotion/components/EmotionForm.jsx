import React, { useState } from 'react';
import styled from 'styled-components';

// 이미지 import
import emotion1 from '../../../shared/assets/images/emotion1.svg';
import emotion2 from '../../../shared/assets/images/emotion2.svg';
import emotion3 from '../../../shared/assets/images/emotion3.svg';
import emotion4 from '../../../shared/assets/images/emotion4.svg';
import emotion5 from '../../../shared/assets/images/emotion5.svg';

const EmotionForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [selectedEmotion, setSelectedEmotion] = useState(initialData?.emotion_level || null);
  const [keywords, setKeywords] = useState(initialData?.keywords?.join(', ') || '');
  const [memo, setMemo] = useState(initialData?.memo || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emotionImages = [
    { level: 1, image: emotion1, label: '매우 나쁨' },
    { level: 2, image: emotion2, label: '나쁨' },
    { level: 3, image: emotion3, label: '보통' },
    { level: 4, image: emotion4, label: '좋음' },
    { level: 5, image: emotion5, label: '매우 좋음' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedEmotion) {
      alert('감정을 선택해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 백엔드 API 명세에 맞는 데이터 형식으로 변환
      const emotionData = {
        emotion_level: selectedEmotion,
        keywords: keywords ? keywords.split(',').map(k => k.trim()).filter(k => k) : [],
        memo,
        recordedAt: new Date().toISOString().split('T')[0] // recordedAt 필드명 사용
      };
      
      console.log('감정 데이터 전송:', emotionData);
      await onSubmit(emotionData);
    } catch (error) {
      console.error('감정 기록 저장 실패:', error);
      alert('감정 기록 저장에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer>
      <FormTitle>{initialData ? '감정 기록 수정' : '오늘의 감정을 기록해보세요'}</FormTitle>
      
      <Form onSubmit={handleSubmit}>
        <Section>
          <SectionTitle>오늘의 기분은 어떠셨나요?</SectionTitle>
          <EmotionSelector>
            {emotionImages.map((emotion) => (
              <EmotionOption
                key={emotion.level}
                $selected={selectedEmotion === emotion.level}
                onClick={() => setSelectedEmotion(emotion.level)}
              >
                <EmotionImage src={emotion.image} alt={emotion.label} />
                <EmotionLabel>{emotion.label}</EmotionLabel>
              </EmotionOption>
            ))}
          </EmotionSelector>
        </Section>

        <Section>
          <SectionTitle>키워드 (선택사항)</SectionTitle>
          <Input
            type="text"
            placeholder="기분을 나타내는 키워드를 쉼표로 구분해서 입력해주세요"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
          <HelpText>예: 행복, 성취감, 만족, 피곤</HelpText>
        </Section>

        <Section>
          <SectionTitle>메모 (선택사항)</SectionTitle>
          <Textarea
            placeholder="오늘 하루는 어떠셨나요? 자유롭게 적어보세요."
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={4}
          />
        </Section>

        <ButtonGroup>
          <CancelButton type="button" onClick={onCancel}>
            취소
          </CancelButton>
          <SubmitButton type="submit" disabled={!selectedEmotion || isSubmitting}>
            {isSubmitting ? '저장 중...' : '저장하기'}
          </SubmitButton>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 24px;
  margin: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const EmotionSelector = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
`;

const EmotionOption = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.$selected ? '#f0f9ff' : 'transparent'};
  border: 2px solid ${props => props.$selected ? '#40ea87' : 'transparent'};
  flex: 1;
  min-width: 60px;

  &:hover {
    background: #f8f9fa;
  }
`;

const EmotionImage = styled.img`
  width: 40px;
  height: 40px;
`;

const EmotionLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #666;
  text-align: center;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #40ea87;
  }
`;

const Textarea = styled.textarea`
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #40ea87;
  }
`;

const HelpText = styled.p`
  font-size: 12px;
  color: #999;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  color: #666;

  &:hover:not(:disabled) {
    background: #e9ecef;
  }
`;

const SubmitButton = styled(Button)`
  background: #40ea87;
  border: 1px solid #40ea87;
  color: white;

  &:hover:not(:disabled) {
    background: #36d674;
  }
`;

export default EmotionForm;
