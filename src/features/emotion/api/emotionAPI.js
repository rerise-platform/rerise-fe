import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const USE_MOCK_DATA = true; // 개발용 플래그

// Mock 데이터
const mockEmotionData = {
  emotions: [
    {
      diary_id: 1,
      date: '2025-01-23',
      emotion_level: 3,
      keywords: ['행복', '성취감', '만족'],
      memo: '오늘은 정말 좋은 하루였다. 미션도 완료하고 기분이 상쾌하다.',
      created_at: '2025-01-23T10:30:00Z'
    },
    {
      diary_id: 2,
      date: '2025-01-22',
      emotion_level: 4,
      keywords: ['기쁨', '감사', '평온'],
      memo: '친구와 좋은 시간을 보냈다. 감사한 하루였다.',
      created_at: '2025-01-22T18:45:00Z'
    }
  ]
};

// API 헤더 설정
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * 특정 날짜의 감정 기록 조회
 * @param {string} date - YYYY-MM-DD 형식
 */
export const getEmotionByDate = async (date) => {
  if (USE_MOCK_DATA) {
    // Mock 데이터에서 해당 날짜의 감정 찾기
    const emotion = mockEmotionData.emotions.find(e => e.date === date);
    return emotion || null;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/api/records/${date}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('감정 기록 조회 실패:', error);
    throw error;
  }
};

/**
 * 감정 기록 생성
 * @param {Object} emotionData - 감정 기록 데이터
 */
export const createEmotion = async (emotionData) => {
  if (USE_MOCK_DATA) {
    // Mock 데이터에 새 감정 기록 추가
    const newEmotion = {
      diary_id: Date.now(),
      ...emotionData,
      created_at: new Date().toISOString()
    };
    mockEmotionData.emotions.push(newEmotion);
    return newEmotion;
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/api/records`, emotionData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('감정 기록 생성 실패:', error);
    throw error;
  }
};

/**
 * 감정 기록 수정
 * @param {number} diaryId - 일기 ID
 * @param {Object} emotionData - 수정할 감정 기록 데이터
 */
export const updateEmotion = async (diaryId, emotionData) => {
  if (USE_MOCK_DATA) {
    const index = mockEmotionData.emotions.findIndex(e => e.diary_id === diaryId);
    if (index !== -1) {
      mockEmotionData.emotions[index] = {
        ...mockEmotionData.emotions[index],
        ...emotionData,
        updated_at: new Date().toISOString()
      };
      return mockEmotionData.emotions[index];
    }
    throw new Error('감정 기록을 찾을 수 없습니다.');
  }

  try {
    const response = await axios.put(`${API_BASE_URL}/api/records/${diaryId}`, emotionData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('감정 기록 수정 실패:', error);
    throw error;
  }
};

/**
 * 감정 기록 삭제
 * @param {number} diaryId - 일기 ID
 */
export const deleteEmotion = async (diaryId) => {
  if (USE_MOCK_DATA) {
    const index = mockEmotionData.emotions.findIndex(e => e.diary_id === diaryId);
    if (index !== -1) {
      mockEmotionData.emotions.splice(index, 1);
      return { message: '삭제되었습니다.' };
    }
    throw new Error('감정 기록을 찾을 수 없습니다.');
  }

  try {
    const response = await axios.delete(`${API_BASE_URL}/api/records/${diaryId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('감정 기록 삭제 실패:', error);
    throw error;
  }
};

/**
 * 월별 감정 기록 조회
 * @param {string} month - YYYY-MM 형식
 */
export const getEmotionsByMonth = async (month) => {
  if (USE_MOCK_DATA) {
    // Mock 데이터에서 해당 월의 감정들 필터링
    const emotions = mockEmotionData.emotions.filter(e => e.date.startsWith(month));
    return emotions;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/api/records/month/${month}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('월별 감정 기록 조회 실패:', error);
    throw error;
  }
};
