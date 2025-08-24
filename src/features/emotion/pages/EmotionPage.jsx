import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrUpdateRecord, getRecordByDate } from '../api/emotionAPI';
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
    const [selectedMood, setSelectedMood] = useState(3);
    const [selectedEmotions, setSelectedEmotions] = useState([]);
    const [diaryText, setDiaryText] = useState('');
    
    // 캘린더 관련 상태
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [emotionRecords, setEmotionRecords] = useState({});
    
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
            
            await saveEmotionRecord(today, emotionData);
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
    const fetchEmotionRecords = async (year, month) => {
        try {
            const records = {};
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            // 해당 월의 모든 날짜에 대해 기록 조회
            for (let day = 1; day <= daysInMonth; day++) {
                const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const record = await getRecordByDate(date);
                
                if (record) {
                    records[date] = {
                        mood: getMoodFromLevel(record.emotion_level),
                        emotions: record.keywords ? record.keywords.split(', ') : [],
                        diary: record.memo
                    };
                }
            }
            
            setEmotionRecords(records);
        } catch (error) {
            console.error('감정 기록 조회 실패:', error);
        }
    };

    const saveEmotionRecord = async (date, data) => {
        try {
            // 감정 ID를 한국어 텍스트로 변환
            const emotionLabels = data.emotions.map(emotionId => {
                const emotion = emotions.find(e => e.id === emotionId);
                return emotion ? emotion.label : emotionId;
            });
            
            const recordData = {
                emotion_level: data.mood, // 직접 숫자로 전송
                keywords: emotionLabels.join(', '), // 한국어 감정 텍스트로 전송
                memo: data.diary,
                recordedAt: date
            };
            
            await createOrUpdateRecord(recordData);
            
            // 로컬 상태 업데이트
            setEmotionRecords(prev => ({
                ...prev,
                [date]: data
            }));
        } catch (error) {
            console.error('감정 기록 저장 실패:', error);
        }
    };

    // 감정 레벨과 기분 매핑 헬퍼 함수들
    const getMoodFromLevel = (level) => {
        const moodMap = { 1: 'terrible', 2: 'bad', 3: 'okay', 4: 'good', 5: 'great' };
        return moodMap[level] || 'okay';
    };

    const getLevelFromMood = (mood) => {
        const levelMap = { 'terrible': 1, 'bad': 2, 'okay': 3, 'good': 4, 'great': 5 };
        return levelMap[mood] || 3;
    };

    // 월이 변경될 때마다 해당 월의 감정 기록 불러오기
    useEffect(() => {
        fetchEmotionRecords(displayYear, displayMonth);
    }, [displayYear, displayMonth]);

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
        <div className="emotion-container">
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
        </div>
    );
};

export default EmotionPage;
