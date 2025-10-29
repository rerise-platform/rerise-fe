import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  createOrUpdateRecord,
  getRecordByDate,
  // 서버에 삭제 API가 없어서 import 하지 않음
  // deleteRecordByDate,
} from "../api/emotionAPI";
import { checkCurrentTokenStatus } from "../../../shared/utils/tokenUtils";
import "./EmotionPage.css";
import { fetchMainPageData } from "../../main/api/mainAPI";

// 기본/선택 이모지
import emotion1Default from "../../../shared/assets/images/emotion1.0.svg";
import emotion2Default from "../../../shared/assets/images/emotion2.0.svg";
import emotion3Default from "../../../shared/assets/images/emotion3.0.svg"; // 중립
import emotion4Default from "../../../shared/assets/images/emotion4.0.svg";
import emotion5Default from "../../../shared/assets/images/emotion5.0.svg";

import emotion1Selected from "../../../shared/assets/images/emotion1.svg";
import emotion2Selected from "../../../shared/assets/images/emotion2.svg";
import emotion3Selected from "../../../shared/assets/images/emotion3.svg";
import emotion4Selected from "../../../shared/assets/images/emotion4.svg";
import emotion5Selected from "../../../shared/assets/images/emotion5.svg";

// 감정 키워드 아이콘
import achievementIcon from "../../../shared/assets/images/achievement.svg";
import anxietyIcon from "../../../shared/assets/images/anxiety.svg";
import curiosityIcon from "../../../shared/assets/images/curiosity.svg";
import frustrationIcon from "../../../shared/assets/images/frustration.svg";
import hopeIcon from "../../../shared/assets/images/hope.svg";
import joyIcon from "../../../shared/assets/images/Joy.svg";
import isolationIcon from "../../../shared/assets/images/isolation.svg";
import pressureIcon from "../../../shared/assets/images/pressure.svg";

/* ===== 유틸 ===== */

function toYMD(dateLike = new Date()) {
  const d = dateLike instanceof Date ? dateLike : new Date(dateLike);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function levelToMood(level) {
  const n = Number(level) || 0;
  if (n >= 1 && n <= 5) return n;
  if (n > 5 && n <= 10) return Math.ceil(n / 2);
  return 3;
}

/* 로컬 삭제 날짜 저장소 (서버 삭제 API 없을 때 임시) */
const DELETED_DATES_KEY = "emotion_deleted_dates";
function loadDeletedDates() {
  try {
    const raw = localStorage.getItem(DELETED_DATES_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}
function saveDeletedDates(set) {
  try {
    localStorage.setItem(DELETED_DATES_KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

/* ===== 상수 ===== */

const MOOD_LABEL = {
  1: "힘들었어요",
  2: "별로였어요",
  3: "평소 같았어요",
  4: "좋았어요!",
  5: "최고였어요!",
};
const MOOD_ICON = {
  1: emotion1Selected,
  2: emotion2Selected,
  3: emotion3Selected,
  4: emotion4Selected,
  5: emotion5Selected,
};

const EMOTIONS = [
  { id: "joy", icon: joyIcon, label: "기쁨", gradient: "#BFFFB6" },
  {
    id: "frustration",
    icon: frustrationIcon,
    label: "좌절",
    gradient: "#95AEC0",
  },
  { id: "pressure", icon: pressureIcon, label: "압박", gradient: "#FBB8B9" },
  {
    id: "curiosity",
    icon: curiosityIcon,
    label: "호기심",
    gradient: "#BCA9EE",
  },
  { id: "hope", icon: hopeIcon, label: "희망", gradient: "#F9F8A7" },
  { id: "anxiety", icon: anxietyIcon, label: "불안", gradient: "#85A0FA" },
  {
    id: "achievement",
    icon: achievementIcon,
    label: "성취",
    gradient: "#FFC46A",
  },
  { id: "isolation", icon: isolationIcon, label: "고립", gradient: "#C1C1C1" },
];

const EmotionPage = () => {
  const navigate = useNavigate();

  // 닉네임
  const [nickname, setNickname] = useState("사용자");

  // 입력 폼 상태
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [diaryText, setDiaryText] = useState("");

  // 폼 표시/편집
  const [showForm, setShowForm] = useState(false);
  const [editDate, setEditDate] = useState(null); // 수정 중인 날짜

  // 캘린더 상태
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [emotionRecords, setEmotionRecords] = useState({}); // { 'YYYY-MM-DD': { mood, emotions[], diary } }

  const isInitialLoadRef = useRef(true);

  const displayYear = currentDate.getFullYear();
  const displayMonth = currentDate.getMonth();
  const todayStr = toYMD(new Date());

  const emotionMap = useMemo(() => {
    const map = {};
    EMOTIONS.forEach((e) => (map[e.id] = e));
    return map;
  }, []);

  /* 닉네임 로드 */
  useEffect(() => {
    const cached = localStorage.getItem("nickname");
    if (cached) {
      setNickname(cached);
      return;
    }
    (async () => {
      try {
  const data = await fetchMainPageData();
        const name =
          data?.nickname || data?.character_status?.nickname || "사용자";
        setNickname(name);
        localStorage.setItem("nickname", name);
      } catch (e) {
        console.error("닉네임 로드 실패:", e);
      }
    })();
  }, []);

  /* 월 변경 시 기록 로드 */
  useEffect(() => {
    fetchEmotionRecords(displayYear, displayMonth, isInitialLoadRef.current);
    isInitialLoadRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayYear, displayMonth]);

  const handleEmotionSelect = (emotionId) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotionId)
        ? prev.filter((id) => id !== emotionId)
        : [...prev, emotionId]
    );
  };

  const handleSaveEmotion = async () => {
    try {
      const tokenStatus = checkCurrentTokenStatus();
      if (!tokenStatus.hasToken || !tokenStatus.valid || tokenStatus.expired) {
        alert(
          "로그인이 필요하거나 토큰이 만료되었습니다. 다시 로그인해주세요."
        );
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return;
      }

      const targetDate = editDate || todayStr;
      const payload = {
        mood: selectedMood,
        emotions: selectedEmotions,
        diary: diaryText,
      };

      await saveEmotionRecord(targetDate, payload);
      alert(
        editDate
          ? "기록이 수정되었습니다!"
          : "감정이 성공적으로 기록되었습니다!"
      );

      // 폼 초기화
      setShowForm(false);
      setEditDate(null);
      setSelectedMood(null);
      setSelectedEmotions([]);
      setDiaryText("");

      // 새로고침 & 선택 날짜 유지
      fetchEmotionRecords(displayYear, displayMonth, false);
      setSelectedDate(targetDate);
    } catch (error) {
      console.error("감정 저장 실패:", error);
      if (error?.response?.status === 403) {
        alert("접근 권한이 없습니다. 로그인을 다시 해주세요.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      } else {
        alert("감정 기록에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  /* 오늘 기록 삭제 (서버 삭제 API 없어서: 1) 서버에 비우기 시도 2) 로컬에서 숨김 유지) */
  const handleDeleteToday = async () => {
    if (selectedDate !== todayStr && editDate !== todayStr) return;
    if (!window.confirm("오늘 감정 기록을 삭제할까요?")) return;

    try {
      const tokenStatus = checkCurrentTokenStatus();
      if (!tokenStatus.hasToken || !tokenStatus.valid || tokenStatus.expired) {
        alert(
          "로그인이 필요하거나 토큰이 만료되었습니다. 다시 로그인해주세요."
        );
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return;
      }

      // 1) 서버에 '비우기' 요청 (서버가 무시하더라도 2)단계에서 로컬로 숨김 처리)
      await createOrUpdateRecord({
        recordedAt: todayStr,
        emotion_level: null,
        keywords: [],
        memo: "",
        isDeleted: true, // 백엔드가 지원하면 활용
      });
    } catch (err) {
      console.error("서버 비우기 실패(무시 가능):", err);
      // 계속 진행 (클라이언트 숨김)
    }

    // 2) 로컬에서 '삭제된 날짜'로 등록하여 새로고침 후에도 숨김
    const del = loadDeletedDates();
    del.add(todayStr);
    saveDeletedDates(del);

    // 로컬 상태 업데이트
    setEmotionRecords((prev) => {
      const copy = { ...prev };
      delete copy[todayStr];
      return copy;
    });

    // ‘기록 안 한 상태’로 오늘 폼 열기
    setSelectedDate(todayStr);
    setEditDate(null);
    setSelectedMood(null);
    setSelectedEmotions([]);
    setDiaryText("");
    setShowForm(true);

    alert("오늘 감정 기록이 삭제되었습니다.");
  };

  const startEditSelectedDate = () => {
    if (!selectedDate || !emotionRecords[selectedDate]) return;
    if (selectedDate !== todayStr) return; // 과거 편집 불가

    const rec = emotionRecords[selectedDate];
    setSelectedMood(rec.mood ?? null);
    const ids = (rec.emotions || []).map((labelOrId) => {
      const found = EMOTIONS.find(
        (e) => e.label === labelOrId || e.id === labelOrId
      );
      return found ? found.id : labelOrId;
    });
    setSelectedEmotions(ids);
    setDiaryText(rec.diary || "");
    setEditDate(selectedDate); // 수정 모드 on
    setShowForm(true);

    setTimeout(() => {
      const el = document.getElementById("emotion-form-start");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  /* 이동/클릭 제어: 수정 중 차단, 첫 기록 폼 열림시 전환 시 폼 닫기 */
  const goToPreviousMonth = () => {
    if (editDate) return; // 수정 중이면 금지
    if (showForm && !editDate) {
      setShowForm(false);
      setSelectedMood(null);
      setSelectedEmotions([]);
      setDiaryText("");
    }
    setCurrentDate(new Date(displayYear, displayMonth - 1, 1));
  };

  const goToNextMonth = () => {
    if (editDate) return; // 수정 중이면 금지
    if (showForm && !editDate) {
      setShowForm(false);
      setSelectedMood(null);
      setSelectedEmotions([]);
      setDiaryText("");
    }
    setCurrentDate(new Date(displayYear, displayMonth + 1, 1));
  };

  const goToToday = () => {
    if (editDate) return; // 수정 중이면 금지
    const t = new Date();
    const today = toYMD(t);
    setCurrentDate(new Date(t.getFullYear(), t.getMonth(), 1));
    setSelectedDate(today);
    setShowForm(!emotionRecords[today]); // 오늘 기록 없으면 폼 보이기
  };

  const handleDateClick = (day) => {
    const clicked = toYMD(new Date(displayYear, displayMonth, day));
    if (clicked > todayStr) return; // 미래 차단
    if (editDate) return; // 수정 중이면 날짜 전환 금지

    // 첫 기록 폼이 열려 있고 오늘이 아닌 다른 날짜를 누르면 폼 닫기
    if (showForm && !editDate && clicked !== todayStr) {
      setShowForm(false);
      setSelectedMood(null);
      setSelectedEmotions([]);
      setDiaryText("");
    }

    if (selectedDate === clicked) {
      setSelectedDate(null);
      if (clicked === todayStr) setShowForm(!emotionRecords[todayStr]);
      return;
    }

    setSelectedDate(clicked);
    if (clicked === todayStr) {
      setShowForm(!emotionRecords[todayStr]);
    } else {
      setShowForm(false);
    }
  };

  /* 오늘 선택 중일 때 레코드 변화에 따라 폼 표시 재평가 */
  useEffect(() => {
    if (selectedDate === todayStr) {
      setShowForm(!emotionRecords[todayStr] || !!editDate);
    }
  }, [selectedDate, emotionRecords, todayStr, editDate]);

  /* 월 전체 기록 가져오기 (allowAutoShow: 최초 진입 시에만 오늘 폼 자동 노출) */
  const fetchEmotionRecords = async (year, month, allowAutoShow = false) => {
    try {
      const records = {};
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      const datePromises = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(
          day
        ).padStart(2, "0")}`;
        datePromises.push(
          getRecordByDate(date)
            .then((record) => ({ date, record }))
            .catch(() => ({ date, record: null }))
        );
      }

      const results = await Promise.all(datePromises);
      results.forEach(({ date, record }) => {
        if (record) {
          const emotionKeywords = Array.isArray(record.keywords)
            ? record.keywords
            : typeof record.keywords === "string"
            ? record.keywords.split(", ").filter((k) => k.trim())
            : [];
          records[date] = {
            mood: levelToMood(record.emotion_level),
            emotions: emotionKeywords.map((k) => k.trim()),
            diary: record.memo || "",
          };
        }
      });

      // 🔴 로컬에 '삭제로 표시된 날짜'는 서버가 값을 줘도 숨김 처리
      const deleted = loadDeletedDates();
      deleted.forEach((d) => {
        if (records[d]) {
          delete records[d];
        }
      });

      setEmotionRecords(records);

      // 최초 진입 때만 자동 폼 노출
      if (allowAutoShow && !editDate) {
        const hasToday = !!records[todayStr];
        setShowForm(!hasToday);
        if (hasToday) setSelectedMood(null);
      }
    } catch (error) {
      console.error("❌ 감정 기록 조회 실패:", error);
    }
  };

  /* 저장 API 래퍼 (로컬도 반영) */
  const saveEmotionRecord = async (date, data) => {
    const emotionLabels = (
      Array.isArray(data.emotions) ? data.emotions : []
    ).map((id) => {
      const meta = emotionMap[id];
      return meta ? meta.label : id;
    });

    const recordData = {
      emotion_level: data.mood, // 1~5로 저장
      keywords: emotionLabels,
      memo: data.diary,
      recordedAt: date,
    };

    await createOrUpdateRecord(recordData);

    // 저장하면 '삭제 표시' 해제 (다시 보이게)
    const del = loadDeletedDates();
    if (del.has(date)) {
      del.delete(date);
      saveDeletedDates(del);
    }

    // 로컬 반영
    setEmotionRecords((prev) => ({
      ...prev,
      [date]: { ...data },
    }));
  };

  /* 캘린더 렌더 */
  const generateCalendarDays = () => {
    const days = [];
    const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
    const firstDay = new Date(displayYear, displayMonth, 1).getDay();

    // 요일 헤더
    ["일", "월", "화", "수", "목", "금", "토"].forEach((day) => {
      days.push(
        <div key={`header-${day}`} className="calendar-day header">
          {day}
        </div>
      );
    });

    // 앞쪽 빈칸
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }

    // 날짜
    for (let i = 1; i <= daysInMonth; i++) {
      const dateObj = new Date(displayYear, displayMonth, i);
      const dateStr = toYMD(dateObj);
      const isToday = dateStr === todayStr;
      const isSelected = selectedDate === dateStr;
      const isFuture = dateStr > todayStr;
      const record = emotionRecords[dateStr];

      // 이모지
      let emojiNode = null;
      if (isFuture) {
        emojiNode = <div className="emoji-circle placeholder" />;
      } else if (record?.mood) {
        emojiNode = (
          <img
            className="emoji-img recorded"
            src={MOOD_ICON[record.mood]}
            alt={MOOD_LABEL[record.mood]}
          />
        );
      } else {
        emojiNode = (
          <img
            className="emoji-img neutral"
            src={emotion3Default}
            alt="기록 없음"
          />
        );
      }

      days.push(
        <div
          key={i}
          className={`calendar-day ${isFuture ? "disabled" : ""}`}
          onClick={() => !isFuture && handleDateClick(i)}
          aria-disabled={isFuture}
          style={{ cursor: isFuture ? "not-allowed" : "pointer" }}
        >
          <div className="day-wrapper">
            <div
              className={`day-number ${isSelected ? "is-selected" : ""} ${
                isToday ? "is-today" : ""
              }`}
            >
              {i}
            </div>
            <div className="day-emoji">{emojiNode}</div>
          </div>
        </div>
      );
    }

    return days;
  };

  /* -------------------- JSX -------------------- */
  return (
    <div className="emotion-container">
      {/* 헤더 */}
      <div className="emotion-header fade-in">
        <button className="back-button" onClick={() => navigate("/main")}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="header-greeting">
          <div className="greeting-text">
            {nickname}님,
            <br />
            오늘 하루도 수고 많으셨어요!
            <br />
            <span className="bold-text">좀 더 자세하게 하루를</span>
            <br />
            <span className="bold-text">기록해보시겠어요?</span>
          </div>
        </div>
        <div style={{ width: 32 }} />
      </div>

      {/* 캘린더 */}
      <div className="calendar-section fade-in">
        <div className="calendar-header">
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#1a201c",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            감정 기록 캘린더
          </h2>
        </div>

        <div className="calendar-navigation">
          <button className="nav-btn" onClick={goToPreviousMonth}>
            ‹
          </button>
          <div className="calendar-title">
            {displayYear}년 {displayMonth + 1}월
          </div>
          <button className="nav-btn" onClick={goToNextMonth}>
            ›
          </button>
          <button className="today-btn" onClick={goToToday}>
            오늘
          </button>
        </div>

        <div className="calendar-grid">{generateCalendarDays()}</div>

        {/* 선택 날짜 상세 (수정 중/폼 오픈일 때는 숨김) */}
        <div
          className={`collapsible ${
            selectedDate && !editDate && !showForm ? "open" : ""
          }`}
        >
          {selectedDate && !editDate && !showForm && (
            <div className="calendar-entry-section">
              {/* 날짜 + 수정하기 버튼을 한 줄로 */}
              <div className="entry-header">
                <div className="entry-date">{selectedDate}</div>
                {selectedDate === todayStr && emotionRecords[selectedDate] && (
                  <button className="edit-btn" onClick={startEditSelectedDate}>
                    수정하기
                  </button>
                )}
              </div>

              {emotionRecords[selectedDate] ? (
                <>
                  <div className="entry-detail">
                    <div className="entry-row">
                      <div className="entry-label">오늘의 기분</div>
                      <div className="entry-content">
                        <img
                          className="entry-mood-icon"
                          src={MOOD_ICON[emotionRecords[selectedDate].mood]}
                          alt={MOOD_LABEL[emotionRecords[selectedDate].mood]}
                        />
                        <span>
                          {MOOD_LABEL[emotionRecords[selectedDate].mood]}
                        </span>
                      </div>
                    </div>

                    <div className="entry-row">
                      <div className="entry-label">자주 느낀 감정</div>
                      <div className="entry-content entry-emotions">
                        {(emotionRecords[selectedDate].emotions || []).map(
                          (labelOrId) => {
                            const meta =
                              EMOTIONS.find(
                                (e) =>
                                  e.label === labelOrId || e.id === labelOrId
                              ) || {};
                            const bg = meta.gradient || "#fff";
                            return (
                              <div
                                className="chip"
                                key={`${selectedDate}-${labelOrId}`}
                                style={{
                                  background: bg,
                                  borderColor: "transparent",
                                }}
                              >
                                {meta.icon ? (
                                  <img
                                    src={meta.icon}
                                    alt={meta.label || labelOrId}
                                  />
                                ) : null}
                                <span>{meta.label || labelOrId}</span>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>

                    {emotionRecords[selectedDate].diary ? (
                      <div className="entry-row">
                        <div className="entry-label">메모</div>
                        <div className="entry-content">
                          {emotionRecords[selectedDate].diary}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </>
              ) : (
                <div className="entry-preview">기록된 감정이 없습니다.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 입력 폼 (첫 기록 or 오늘 편집시에만) */}
      {showForm && (
        <>
          <div id="emotion-form-start" className="mood-section slide-in">
            <div className="section-title">오늘 하루 어떠셨나요?</div>
            <div className="mood-faces">
              <div
                className={`mood-face terrible ${
                  selectedMood === 1 ? "selected" : ""
                }`}
                onClick={() => setSelectedMood(1)}
              >
                <img
                  src={selectedMood === 1 ? emotion1Selected : emotion1Default}
                  alt="힘들었어요"
                />
              </div>
              <div
                className={`mood-face bad ${
                  selectedMood === 2 ? "selected" : ""
                }`}
                onClick={() => setSelectedMood(2)}
              >
                <img
                  src={selectedMood === 2 ? emotion2Selected : emotion2Default}
                  alt="별로였어요"
                />
              </div>
              <div
                className={`mood-face okay ${
                  selectedMood === 3 ? "selected" : ""
                }`}
                onClick={() => setSelectedMood(3)}
              >
                <img
                  src={selectedMood === 3 ? emotion3Selected : emotion3Default}
                  alt="평소 같았어요"
                />
              </div>
              <div
                className={`mood-face good ${
                  selectedMood === 4 ? "selected" : ""
                }`}
                onClick={() => setSelectedMood(4)}
              >
                <img
                  src={selectedMood === 4 ? emotion4Selected : emotion4Default}
                  alt="좋았어요"
                />
              </div>
              <div
                className={`mood-face great ${
                  selectedMood === 5 ? "selected" : ""
                }`}
                onClick={() => setSelectedMood(5)}
              >
                <img
                  src={selectedMood === 5 ? emotion5Selected : emotion5Default}
                  alt="최고였어요"
                />
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
            <div className="section-title">
              오늘 자주 느낀 감정은 무엇인가요?
            </div>
            <div className="emotion-grid">
              {EMOTIONS.map((emotion) => (
                <div
                  key={emotion.id}
                  className={`emotion-item ${emotion.id} ${
                    selectedEmotions.includes(emotion.id) ? "selected" : ""
                  }`}
                  onClick={() => handleEmotionSelect(emotion.id)}
                >
                  <div
                    className="emotion-icon"
                    style={{
                      background: selectedEmotions.includes(emotion.id)
                        ? emotion.gradient
                        : undefined,
                    }}
                  >
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

            {/* 기록 수정/삭제 한 줄 */}
            <div className="action-row">
              {editDate === todayStr && (
                <button
                  type="button"
                  className="danger-button"
                  onClick={handleDeleteToday}
                >
                  삭제
                </button>
              )}
              <button
                className="save-button"
                onClick={handleSaveEmotion}
                disabled={selectedMood == null}
              >
                {editDate ? "기록 수정하기" : "오늘의 감정 기록하기"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EmotionPage;
