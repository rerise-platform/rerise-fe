import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmotionPage.css';

const EmotionPage = () => {
    const navigate = useNavigate();
    const [selectedMood, setSelectedMood] = useState('okay');
    const [selectedEmotions, setSelectedEmotions] = useState([]);
    const [diaryText, setDiaryText] = useState('');
    
    // 오늘 날짜 계산
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const emotions = [
        { id: 'joy', icon: '🎉', label: '기쁨', gradient: '#bfffb6' },
        { id: 'frustration', icon: '⚡', label: '좌절', gradient: '#d1dfd4' },
        { id: 'pressure', icon: '⏰', label: '압박', gradient: '#d1dfd4' },
        { id: 'curiosity', icon: '🌙', label: '호기심', gradient: '#bca9ee' },
        { id: 'anxiety', icon: '❄️', label: '불안', gradient: '#d1dfd4' },
        { id: 'achievement', icon: '🏆', label: '성취', gradient: '#ffc46a' },
        { id: 'isolation', icon: '🌍', label: '고립', gradient: '#d1dfd4' },
        { id: 'hope', icon: '☀️', label: '희망', gradient: '#f9f8a7' }
    ];

    const handleEmotionSelect = (emotionId) => {
        if (selectedEmotions.includes(emotionId)) {
            setSelectedEmotions(selectedEmotions.filter(id => id !== emotionId));
        } else {
            setSelectedEmotions([...selectedEmotions, emotionId]);
        }
    };

    const generateCalendarDays = () => {
        const days = [];
        const daysInMonth = new Date(year, today.getMonth() + 1, 0).getDate();
        const firstDay = new Date(year, today.getMonth(), 1).getDay();

        // 달력 헤더 (요일)
        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        weekdays.forEach(day => {
            days.push(
                <div key={`header-${day}`} className="calendar-day header">
                    {day}
                </div>
            );
        });

        // 이전 달의 마지막 날짜들
        for (let i = 0; i < firstDay; i++) {
            days.push(
                <div key={`prev-${i}`} className="calendar-day prev-month">
                    {new Date(year, today.getMonth(), -firstDay + i + 1).getDate()}
                </div>
            );
        }

        // 현재 달의 날짜들
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = i === today.getDate();
            const hasEmotion = Math.random() > 0.5; // 임시로 랜덤하게 감정 기록 표시
            const classes = [
                'calendar-day',
                isToday ? 'today' : '',
                hasEmotion ? 'has-emotion' : '',
                (i + firstDay) % 7 === 0 ? 'saturday' : '',
                (i + firstDay) % 7 === 1 ? 'sunday' : ''
            ].filter(Boolean).join(' ');

            days.push(
                <div key={i} className={classes}>
                    {i}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="emotion-container">
            <div className="emotion-header fade-in">
                <button className="back-button" onClick={() => navigate('/')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <div className="header-title">감정 기록</div>
                <div style={{ width: '32px' }}></div>
            </div>

            <div className="greeting-section slide-in">
                <div className="greeting-text">
                    <div className="greeting-name">멋사님</div>
                    <div className="greeting-message">오늘 하루도 수고하셨어요!</div>
                    <div className="greeting-cta">좀 더 자세하게 하루를<br/>기록해보시겠어요?</div>
                </div>
                <div className="greeting-decoration">
                    <div className="deco-emoji" style={{position: 'absolute', top: '-10px', right: '20px', fontSize: '24px'}}>💚</div>
                    <div className="deco-emoji" style={{position: 'absolute', top: '30px', right: '60px', fontSize: '18px'}}>✨</div>
                    <div className="deco-emoji" style={{position: 'absolute', top: '10px', right: '5px', fontSize: '16px'}}>😊</div>
                </div>
            </div>

            <div className="mood-section slide-in">
                <div className="section-title">오늘 하루 어떠셨나요?</div>
                <div className="mood-faces">
                    <div className={`mood-face terrible ${selectedMood === 'terrible' ? 'selected' : ''}`} onClick={() => setSelectedMood('terrible')}>😭</div>
                    <div className={`mood-face bad ${selectedMood === 'bad' ? 'selected' : ''}`} onClick={() => setSelectedMood('bad')}>😞</div>
                    <div className={`mood-face okay ${selectedMood === 'okay' ? 'selected' : ''}`} onClick={() => setSelectedMood('okay')}>😐</div>
                    <div className={`mood-face good ${selectedMood === 'good' ? 'selected' : ''}`} onClick={() => setSelectedMood('good')}>😊</div>
                    <div className={`mood-face great ${selectedMood === 'great' ? 'selected' : ''}`} onClick={() => setSelectedMood('great')}>😍</div>
                </div>
                <div className="mood-labels">
                    <div className="mood-label">정말 힘들었어요</div>
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
                            <div className="emotion-icon">{emotion.icon}</div>
                            <div className="emotion-label">{emotion.label}</div>
                        </div>
                    ))}
                </div>
                
                <textarea 
                    className="diary-input"
                    placeholder="감정을 더 자세히 표현해보세요..."
                    value={diaryText}
                    onChange={(e) => setDiaryText(e.target.value)}
                    rows="3"
                />
            </div>

            <div className="calendar-section fade-in">
                <div className="calendar-header">
                    <h2 style={{fontSize: '18px', fontWeight: '600', color: '#1a201c', marginBottom: '8px', textAlign: 'center'}}>
                        감정 기록 캘린더
                    </h2>
                    <div className="calendar-title">{year}년 {month}월</div>
                </div>
                
                <div className="calendar-grid">
                    {generateCalendarDays()}
                </div>

                <div className="calendar-entry-section">
                    <div className="entry-date">{year}.{month}.{day}</div>
                    <div className="entry-preview">
                        {diaryText || '아직 기록된 감정이 없습니다.'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmotionPage;
