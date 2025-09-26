import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { saveEmotionRecord, fetchEmotionByDate } from '../emotionSlice';
import './EmotionPage.css';

// SVG 아이콘들 import (기본 상태)
import emotion1Default from '../../../shared/assets/images/emotion1.0.svg';
import emotion2Default from '../../../shared/assets/images/emotion2.0.svg';
import emotion3Default from '../../../shared/assets/images/emotion3.0.svg';
import emotion4Default from '../../../shared/assets/images/emotion4.0.svg';
import emotion5Default from '../../../shared/assets/images/emotion5.0.svg';

// SVG 아이콘들 import (선택된 상태)
import emotion1Selected from '../../../shared/assets/images/emotion1.svg';
import emotion2Selected from '../../../shared/assets/images/emotion2.svg';
import emotion3Selected from '../../../shared/assets/images/emotion3.svg';
import emotion4Selected from '../../../shared/assets/images/emotion4.svg';
import emotion5Selected from '../../../shared/assets/images/emotion5.svg';

// 감정 선택 섹션 아이콘들 import
import achievementIcon from '../../../shared/assets/images/achievement.svg';
import anxietyIcon from '../../../shared/assets/images/anxiety.svg';
import curiosityIcon from '../../../shared/assets/images/curiosity.svg';
import frustrationIcon from '../../../shared/assets/images/frustration.svg';
import hopeIcon from '../../../shared/assets/images/hope.svg';
import joyIcon from '../../../shared/assets/images/Joy.svg';
import isolationIcon from '../../../shared/assets/images/isolation.svg';
import pressureIcon from '../../../shared/assets/images/pressure.svg';

const EmotionPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedMood, setSelectedMood] = useState(3);
    const [selectedEmotions, setSelectedEmotions] = useState([]);
    const [diaryText, setDiaryText] = useState('');
    
    // Redux 상태 (필요시 나중에 활용)
    // const loading = useSelector(selectEmotionLoading);
    // const error = useSelector(selectEmotionError);
    
    // 캘린더 관련 상태
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [emotionRecords, setEmotionRecords] = useState({});
    
    // 감정 레벨과 기분 매핑 헬퍼 함수
    const getMoodFromLevel = (level) => {
        const moodMap = { 1: 'terrible', 2: 'bad', 3: 'okay', 4: 'good', 5: 'great' };
        return moodMap[level] || 'okay';
    };
    
    // 현재 표시되는 년/월
    const displayYear = currentDate.getFullYear();
    const displayMonth = currentDate.getMonth();
    
    // 오늘 날짜
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const emotions = [
        { id: 'joy', icon: joyIcon, label: '기쁨', gradient: '#bfffb6' },
        { id: 'frustration', icon: frustrationIcon, label: '좌절', gradient: '#d1dfd4' },
        { id: 'pressure', icon: pressureIcon, label: '압박', gradient: '#d1dfd4' },
        { id: 'curiosity', icon: curiosityIcon, label: '호기심', gradient: '#bca9ee' },
        { id: 'hope', icon: hopeIcon, label: '희망', gradient: '#f9f8a7' },
        { id: 'anxiety', icon: anxietyIcon, label: '불안', gradient: '#d1dfd4' },
        { id: 'achievement', icon: achievementIcon, label: '성취', gradient: '#ffc46a' },
        { id: 'isolation', icon: isolationIcon, label: '고립', gradient: '#d1dfd4' }
    ];

    const handleEmotionSelect = (emotionId) => {
        if (selectedEmotions.includes(emotionId)) {
            setSelectedEmotions(selectedEmotions.filter(id => id !== emotionId));
        } else {
            setSelectedEmotions([...selectedEmotions, emotionId]);
        }
    };

    const handleSaveEmotion = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const emotionData = {
                mood: selectedMood,
                emotions: selectedEmotions,
                diary: diaryText
            };
            
            await recordEmotion(today, emotionData);
            alert('감정이 성공적으로 기록되었습니다!');
            
            // 캘린더 새로고침
            fetchEmotionRecords(displayYear, displayMonth);
        } catch (error) {
            alert('감정 기록에 실패했습니다. 다시 시도해주세요.');
            console.error('감정 저장 실패:', error);
        }
    };

    // 캘린더 내비게이션 함수들
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(displayYear, displayMonth - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(displayYear, displayMonth + 1, 1));
    };

    const goToToday = () => {
        const today = new Date();
        setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
        setSelectedDate(null); // 선택된 날짜 초기화
    };

    const handleDateClick = (day) => {
        const clickedDate = new Date(displayYear, displayMonth, day);
        const dateStr = clickedDate.toISOString().split('T')[0];
        setSelectedDate(dateStr);
        
        // TODO: 선택된 날짜의 감정 기록을 보여주는 모달이나 사이드바 표시
        console.log('Selected date:', dateStr, 'Records:', emotionRecords[dateStr]);
    };

    // API 연동 함수들
    const recordEmotion = async (date, data) => {
        try {
            // 감정 ID를 한국어 텍스트로 변환
            const emotionLabels = data.emotions.map(emotionId => {
                const emotion = emotions.find(e => e.id === emotionId);
                return emotion ? emotion.label : emotionId;
            });
            
            // 백엔드 API 명세에 맞게 데이터 구조화
            const recordData = {
                emotion_level: data.mood, // 직접 숫자로 전송
                keywords: emotionLabels, // 백엔드 명세에 맞게 배열로 전송
                memo: data.diary,
                recordedAt: date
            };
            
            // Redux 액션으로 데이터 저장
            await dispatch(saveEmotionRecord(recordData)).unwrap();
            
            // 로컬 상태 업데이트
            setEmotionRecords(prev => ({
                ...prev,
                [date]: data
            }));
            
            return true;
        } catch (error) {
            console.error('감정 기록 저장 실패:', error);
            throw error;
        }
    };

    // API 호출 함수를 useCallback으로 메모이제이션
    const fetchEmotionRecords = React.useCallback(async (year, month) => {
        try {
            const records = {};
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            // 해당 월의 모든 날짜에 대해 기록 조회
            for (let day = 1; day <= daysInMonth; day++) {
                const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                
                try {
                    // Redux 액션으로 데이터 조회
                    const resultAction = await dispatch(fetchEmotionByDate(date)).unwrap();
                    
                    if (resultAction) {
                        records[date] = {
                            mood: getMoodFromLevel(resultAction.emotion_level),
                            emotions: resultAction.keywords || [],
                            diary: resultAction.memo
                        };
                    }
                } catch (err) {
                    // 해당 날짜에 기록이 없으면 무시 (404 오류는 정상 처리)
                    if (err.message && !err.message.includes('404')) {
                        console.error(`${date} 기록 조회 실패:`, err);
                    }
                }
            }
            
            setEmotionRecords(records);
        } catch (error) {
            console.error('감정 기록 조회 실패:', error);
        }
    }, [dispatch]);

    // 월이 변경될 때마다 해당 월의 감정 기록 불러오기
    useEffect(() => {
        fetchEmotionRecords(displayYear, displayMonth);
    }, [displayYear, displayMonth, fetchEmotionRecords]);

    const generateCalendarDays = () => {
        const days = [];
        const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
        const firstDay = new Date(displayYear, displayMonth, 1).getDay();

        // 달력 헤더 (요일)
        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        weekdays.forEach(day => {
            days.push(
                <div key={`header-${day}`} className="calendar-day header">
                    {day}
                </div>
            );
        });

        // 이전 달의 빈 공간들
        for (let i = 0; i < firstDay; i++) {
            days.push(
                <div key={`empty-${i}`} className="calendar-day empty">
                </div>
            );
        }

        // 현재 달의 날짜들
        for (let i = 1; i <= daysInMonth; i++) {
            const currentDateStr = new Date(displayYear, displayMonth, i).toISOString().split('T')[0];
            const isToday = currentDateStr === todayStr;
            const hasEmotion = emotionRecords[currentDateStr]; // 실제 감정 기록 확인
            const isSelected = selectedDate === currentDateStr;
            
            const classes = [
                'calendar-day',
                isToday ? 'today' : '',
                hasEmotion ? 'has-emotion' : '',
                isSelected ? 'selected' : '',
                (i + firstDay) % 7 === 0 ? 'saturday' : '',
                (i + firstDay) % 7 === 1 ? 'sunday' : ''
            ].filter(Boolean).join(' ');

            days.push(
                <div 
                    key={i} 
                    className={classes}
                    onClick={() => handleDateClick(i)}
                    style={{ cursor: 'pointer' }}
                >
                    {i}
                </div>
            );
        }

        return days;
    };

    return (
        <AppWrapper>
            <MobileContainer>
                <MainContent>
                    <div className="emotion-header fade-in">
                        <button className="back-button" onClick={() => navigate('/main')}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <div className="header-greeting">
                            <div className="greeting-text">
                                멋사님<br/>
                                오늘 하루도 수고 많으셨어요!<br/>
                                <span className="bold-text">좀 더 자세하게 하루를</span><br/>
                                <span className="bold-text">기록해보시겠어요?</span>
                            </div>
                        </div>
                        <div style={{ width: '32px' }}></div>
                    </div>

                    <div className="mood-section slide-in">
                        <div className="section-title">오늘 하루 어떠셨나요?</div>
                        <div className="mood-faces">
                            <div className={`mood-face terrible ${selectedMood === 1 ? 'selected' : ''}`} onClick={() => setSelectedMood(1)}>
                                <img src={selectedMood === 1 ? emotion1Selected : emotion1Default} alt="힘들었어요" />
                            </div>
                            <div className={`mood-face bad ${selectedMood === 2 ? 'selected' : ''}`} onClick={() => setSelectedMood(2)}>
                                <img src={selectedMood === 2 ? emotion2Selected : emotion2Default} alt="별로였어요" />
                            </div>
                            <div className={`mood-face okay ${selectedMood === 3 ? 'selected' : ''}`} onClick={() => setSelectedMood(3)}>
                                <img src={selectedMood === 3 ? emotion3Selected : emotion3Default} alt="평소 같았어요" />
                            </div>
                            <div className={`mood-face good ${selectedMood === 4 ? 'selected' : ''}`} onClick={() => setSelectedMood(4)}>
                                <img src={selectedMood === 4 ? emotion4Selected : emotion4Default} alt="좋았어요" />
                            </div>
                            <div className={`mood-face great ${selectedMood === 5 ? 'selected' : ''}`} onClick={() => setSelectedMood(5)}>
                                <img src={selectedMood === 5 ? emotion5Selected : emotion5Default} alt="최고였어요" />
                            </div>
                        </div>
                        <div className="mood-labels">
                            <div className="mood-label">힘들었어요</div>
                            <div className="mood-label">별로였어요</div>
                            <div className="mood-label">평소 같았어요</div>
                            <div className="mood-label">좋았어요!</div>
                            <div className="mood-label">최고였어요!</div>
                        </div>
                    </div>

                    <div className="mood-section slide-in">
                        <div className="section-title">오늘 자주 느낀 감정은 무엇인가요?</div>
                        <div className="emotion-grid">
                            {emotions.map(emotion => (
                                <div
                                    key={emotion.id}
                                    className={`emotion-item ${emotion.id} ${selectedEmotions.includes(emotion.id) ? 'selected' : ''}`}
                                    onClick={() => handleEmotionSelect(emotion.id)}
                                >
                                    <div className="emotion-icon">
                                        <img src={emotion.icon} alt={emotion.label} />
                                    </div>
                                    <div className="emotion-label">{emotion.label}</div>
                                </div>
                            ))}
                        </div>
                        
                        <textarea 
                            className="diary-input"
                            placeholder="감정을 더 자세히 기록해보세요!"
                            value={diaryText}
                            onChange={(e) => setDiaryText(e.target.value)}
                            rows="3"
                        />
                        
                        <button 
                            className="save-button"
                            onClick={handleSaveEmotion}
                            disabled={!selectedMood}
                        >
                            오늘의 감정 기록하기
                        </button>
                    </div>

                    <div className="calendar-section fade-in">
                        <div className="calendar-header">
                            <h2 style={{fontSize: '18px', fontWeight: '600', color: '#1a201c', marginBottom: '8px', textAlign: 'center'}}>
                                감정 기록 캘린더
                            </h2>
                            <div className="calendar-navigation">
                                <button className="nav-btn" onClick={goToPreviousMonth}>‹</button>
                                <div className="calendar-title">{displayYear}년 {displayMonth + 1}월</div>
                                <button className="nav-btn" onClick={goToNextMonth}>›</button>
                                <button className="today-btn" onClick={goToToday}>오늘</button>
                            </div>
                        </div>
                        
                        <div className="calendar-grid">
                            {generateCalendarDays()}
                        </div>

                        {selectedDate && (
                            <div className="calendar-entry-section">
                                <div className="entry-date">{selectedDate}</div>
                                <div className="entry-preview">
                                    {emotionRecords[selectedDate]?.diary || '아직 기록된 감정이 없습니다.'}
                                </div>
                            </div>
                        )}
                    </div>
                </MainContent>
            </MobileContainer>
        </AppWrapper>
    );
};

// 스타일 컴포넌트 정의

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

export default EmotionPage;
