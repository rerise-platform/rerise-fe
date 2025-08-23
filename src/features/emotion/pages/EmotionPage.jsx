import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import EmotionForm from '../components/EmotionForm';
import EmotionList from '../components/EmotionList';
import EmotionChart from '../components/EmotionChart';
import { createEmotion, updateEmotion, deleteEmotion, getEmotionsByMonth } from '../api/emotionAPI';

const EmotionPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('record'); // record, list, chart
  const [emotions, setEmotions] = useState([]);
  const [editingEmotion, setEditingEmotion] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEmotions();
  }, []);

  const loadEmotions = async () => {
    try {
      setLoading(true);
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      const data = await getEmotionsByMonth(currentMonth);
      setEmotions(data);
    } catch (error) {
      console.error('감정 목록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (emotionData) => {
    try {
      if (editingEmotion) {
        await updateEmotion(editingEmotion.diary_id, emotionData);
        setEditingEmotion(null);
      } else {
        await createEmotion(emotionData);
      }
      
      await loadEmotions();
      setActiveTab('list');
    } catch (error) {
      console.error('감정 기록 저장 실패:', error);
      throw error;
    }
  };

  const handleEdit = (emotion) => {
    setEditingEmotion(emotion);
    setActiveTab('record');
  };

  const handleDelete = async (diaryId) => {
    if (window.confirm('정말로 이 감정 기록을 삭제하시겠습니까?')) {
      try {
        await deleteEmotion(diaryId);
        await loadEmotions();
      } catch (error) {
        console.error('감정 기록 삭제 실패:', error);
        alert('감정 기록 삭제에 실패했습니다.');
      }
    }
  };

  const handleCancel = () => {
    setEditingEmotion(null);
    if (activeTab === 'record') {
      navigate('/');
    }
  };

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/')}>
          ← 뒤로가기
        </BackButton>
        <PageTitle>감정 기록</PageTitle>
        <div /> {/* 공간 차지용 빈 div */}
      </Header>

      <TabContainer>
        <Tab 
          $active={activeTab === 'record'} 
          onClick={() => setActiveTab('record')}
        >
          기록하기
        </Tab>
        <Tab 
          $active={activeTab === 'list'} 
          onClick={() => setActiveTab('list')}
        >
          목록
        </Tab>
        <Tab 
          $active={activeTab === 'chart'} 
          onClick={() => setActiveTab('chart')}
        >
          차트
        </Tab>
      </TabContainer>

      <Content>
        {loading && (
          <LoadingContainer>
            <LoadingText>로딩 중...</LoadingText>
          </LoadingContainer>
        )}
        
        {!loading && activeTab === 'record' && (
          <EmotionForm 
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialData={editingEmotion}
          />
        )}
        
        {!loading && activeTab === 'list' && (
          <EmotionList 
            emotions={emotions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        
        {!loading && activeTab === 'chart' && (
          <EmotionChart emotions={emotions} />
        )}
      </Content>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  background-color: #fefff5;
  min-height: 100vh;
  max-width: 430px;
  margin: 0 auto;
  position: relative;

  @media (min-width: 431px) {
    border-radius: 20px;
    margin: 20px auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border-bottom: 1px solid #f0f0f0;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  color: #40ea87;
  cursor: pointer;
  font-weight: 600;
`;

const PageTitle = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const TabContainer = styled.div`
  display: flex;
  background: white;
  border-bottom: 1px solid #f0f0f0;
`;

const Tab = styled.button`
  flex: 1;
  padding: 16px;
  border: none;
  background: ${props => props.$active ? '#40ea87' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#666'};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$active ? '#40ea87' : '#f8f9fa'};
  }
`;

const Content = styled.div`
  padding-bottom: 100px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const LoadingText = styled.p`
  font-size: 16px;
  color: #666;
`;

export default EmotionPage;
