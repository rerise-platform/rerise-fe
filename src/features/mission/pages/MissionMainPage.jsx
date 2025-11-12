// src/features/mission/pages/MissionMainPage.jsx
import React, { useEffect, useState } from "react";
import "../pages/MissionMainPage.css";
import {
  fetchWeeklyMissions,
  fetchTodayMissions,
  createDailyMissions,
  completeDailyMission,
} from "../api/missionAPI";

// ✅ 캐릭터 이미지 매핑 추가
const CHAR_IMG = {
  모니: "/images/char1.png",
  토리: "/images/tory.png",
  포리: "/images/pory.png",
  코코: "/images/koko.png",
};

const MissionMainPage = () => {
  // ===== 주간(로드맵) =====
  const [roadmapMissions, setRoadmapMissions] = useState([]);
  const [activeFeedbackId, setActiveFeedbackId] = useState(-1);
  const [feedbackById, setFeedbackById] = useState({});
  const [photoById, setPhotoById] = useState({});
  const [photoPreviewById, setPhotoPreviewById] = useState({});
  const [confirmRoadmapId, setConfirmRoadmapId] = useState(null);

  // 추가: 주간 요약 말풍선용 상태
  const [weeklySummary, setWeeklySummary] = useState("");

  // ✅ 캐릭터 이름: 로컬에서 바로 읽기(경고/에러 방지)
  const characterName =
    typeof window !== "undefined"
      ? localStorage.getItem("characterName")
      : null;

  // ===== 데일리 =====
  const [dailyMissions, setDailyMissions] = useState([]);
  const [confirmId, setConfirmId] = useState(null);

  // ===== 로딩 =====
  const [loading, setLoading] = useState(true);

  // ===== 공통 유틸 =====
  const rewardLabels = ["+ 10", "+ 10", "+ 10", "+ 15"];
  const completedCount = dailyMissions.filter(
    (m) => m.status === "COMPLETED"
  ).length;

  const statusIconSrc = (status) => {
    if (status === "approved") return "/images/missionChecked.png";
    if (status === "pending") return "/images/waiting.png";
    if (status === "rejected") return "/images/rejectedX.svg";
    return "/images/missionUnchecked.png";
  };

  // ===== 업로드 개수 제한 상수 =====
  const MAX_PHOTOS = 3;

  // ===== 최초 로드: 주간(로드맵) + 오늘의 데일리 =====
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        // 1) 주간(로드맵) 조회
        const weekly = await fetchWeeklyMissions();
        setRoadmapMissions(weekly.missions || []);
        setWeeklySummary(weekly.summaryMessage || "");

        // 2) 오늘의 미션 조회 (없으면 생성)
        let today = await fetchTodayMissions();
        if (!today || today.length === 0) {
          today = await createDailyMissions("오늘 컨디션은 평온해요.");
        }
        setDailyMissions(today);
      } catch (e) {
        console.error(e);
        alert(
          "미션 불러오기에 실패했어요. 로그인(토큰)과 서버 상태를 확인해 주세요."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ===== 로드맵: 헤더 클릭 (후기 입력 영역 토글만 유지) =====
  const handleClickMission = (id) => {
    const m = roadmapMissions.find((x) => x.id === id);
    if (!m) return;
    if (m.status !== "none") return;
    setActiveFeedbackId((prev) => (prev === id ? -1 : id));
  };

  // ===== 로드맵: 후기/사진 =====
  const handleTextChange = (id, value) => {
    setFeedbackById((prev) => ({ ...prev, [id]: value }));
  };

  // ✅ 업로드 처리(최대 3장 유지)
  const handlePhotoChange = (id, e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const prevFiles = photoById[id] || [];
    const prevUrls = photoPreviewById[id] || [];

    const remaining = MAX_PHOTOS - prevFiles.length;
    if (remaining <= 0) {
      alert(`사진은 최대 ${MAX_PHOTOS}장까지 업로드할 수 있어요.`);
      e.target.value = "";
      return;
    }

    // 남은 칸만큼만 받기
    const incoming = files.slice(0, remaining);

    const nextFiles = [...prevFiles];
    const nextUrls = [...prevUrls];

    incoming.forEach((f) => {
      nextFiles.push(f);
      nextUrls.push(URL.createObjectURL(f));
    });

    setPhotoById((prev) => ({ ...prev, [id]: nextFiles }));
    setPhotoPreviewById((prev) => ({ ...prev, [id]: nextUrls }));

    // 남는 파일이 있었으면 안내
    if (files.length > remaining) {
      alert(
        `사진은 최대 ${MAX_PHOTOS}장까지 업로드할 수 있어요. (초과분은 제외됐어요)`
      );
    }
    e.target.value = "";
  };

  const handleRemovePhoto = (id, idx) => {
    const files = photoById[id] || [];
    const urls = photoPreviewById[id] || [];
    if (idx < 0 || idx >= urls.length) return;

    const urlToRevoke = urls[idx];
    if (urlToRevoke) URL.revokeObjectURL(urlToRevoke);

    const nextFiles = files.filter((_, i) => i !== idx);
    const nextUrls = urls.filter((_, i) => i !== idx);

    setPhotoById((prev) => ({ ...prev, [id]: nextFiles }));
    setPhotoPreviewById((prev) => ({ ...prev, [id]: nextUrls }));
  };

  // "전송" 클릭 시: 다이얼로그만 오픈(백엔드 전송 엔드포인트 없음)
  const handleSendFeedback = (id) => {
    const text = (feedbackById[id] || "").trim();
    const photos = photoById[id] || [];
    if (text.length < 5 || photos.length < 1) return; // 가드
    setConfirmRoadmapId(id);
  };

  // 로드맵: 다이얼로그 확인 → 화면 상태를 pending으로
  const handleConfirmRoadmap = () => {
    if (!confirmRoadmapId) return;
    setRoadmapMissions((prev) =>
      prev.map((m) =>
        m.id === confirmRoadmapId ? { ...m, status: "pending" } : m
      )
    );
    setActiveFeedbackId(-1);
    setConfirmRoadmapId(null);
  };

  const handleCloseRoadmapDialog = () => setConfirmRoadmapId(null);

  // ===== 데일리: 완료 플로우 =====
  const handleRequestComplete = (id) => {
    const m = dailyMissions.find((dm) => dm.id === id);
    if (!m || m.status === "COMPLETED") return;
    setConfirmId(id);
  };

  const handleConfirmComplete = async () => {
    if (!confirmId) return;
    try {
      const res = await completeDailyMission(confirmId);
      setDailyMissions((prev) =>
        prev.map((m) =>
          m.id === confirmId
            ? { ...m, status: res.status, completedAt: res.completedAt }
            : m
        )
      );
    } catch (e) {
      console.error(e);
      alert("완료 처리에 실패했어요. 다시 시도해 주세요!");
    } finally {
      setConfirmId(null);
    }
  };

  const handleCloseDialog = () => setConfirmId(null);

  // ESC로 두 종류 다이얼로그 닫기
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setConfirmId(null);
        setConfirmRoadmapId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const missionToConfirm =
    dailyMissions.find((m) => m.id === confirmId) || null;
  const roadmapToConfirm =
    roadmapMissions.find((m) => m.id === confirmRoadmapId) || null;

  if (loading) {
    return (
      <div className="mission-page">
        <h2 className="mission-title">미션</h2>
        <p className="mission-desc">불러오는 중…</p>
      </div>
    );
  }

  return (
    <div className="mission-page">
      <h2 className="mission-title">미션</h2>
      <div className="mission-category">데일리 미션</div>

      <p className="mission-desc">
        미션을 완료하면 <br />
        <span className="highlight">EXP +10</span> 을 드려요
      </p>

      <div className="mission-main-icon">
        <img src="/images/mission.png" alt="main mission" />
      </div>

      {/* 리워드: 완료 개수에 따른 반영 */}
      <div className="mission-rewards">
        {rewardLabels.map((label, idx) => {
          const unlocked = idx < completedCount;
          const imgSrc = unlocked
            ? "/images/mission2.png"
            : "/images/mission3.png";
          return (
            <div key={idx} className={`reward ${unlocked ? "unlocked" : ""}`}>
              <img src={imgSrc} alt={unlocked ? "unlocked" : "locked"} />
              <p>{label}</p>
            </div>
          );
        })}
      </div>

      {/* 데일리 미션: 2×2 */}
      <div className="mission-list">
        {dailyMissions.map((m) => {
          const done = m.status === "COMPLETED";
          return (
            <div className="mission-card" key={m.id}>
              <p>{m.title}</p>
              <button
                className={done ? "disabled" : ""}
                disabled={done}
                onClick={() => handleRequestComplete(m.id)}
                style={{ fontSize: "10px" }}
              >
                {done ? "미션 완료" : "미션 완료하기"}
              </button>
            </div>
          );
        })}
      </div>

      {/* ===== 로드맵 섹션 ===== */}
      <div className="roadmap-section">
        <div className="roadmap-badge">로드맵 미션</div>
        <h3>
          <div className="text-wrapper">
            좀 더 어려운 <br /> 미션에 도전해보세요
          </div>
          <div className="text-suv">
            로드맵 미션을 인증하면,
            <br />
            관리자 검토 후 보상이 지급됩니다.
          </div>
        </h3>

        {/* ✅ 요약 말풍선: 항상 표시 (캐릭터 이미지 + 왼쪽 꼬리 말풍선) */}
        {!!weeklySummary && (
          <div className="summary-row">
            {characterName && (
              <img
                className="summary-char"
                src={CHAR_IMG[characterName] || "/images/char1.png"}
                alt={characterName}
              />
            )}
            <div className="summary-bubble" role="status" aria-live="polite">
              {weeklySummary}
            </div>
          </div>
        )}

        <ul className="roadmap-list">
          {roadmapMissions.map((m) => {
            const isActive = activeFeedbackId === m.id && m.status === "none";
            const previews = photoPreviewById[m.id] || [];

            return (
              <React.Fragment key={m.id}>
                <li
                  className={[
                    "roadmap-item",
                    m.status,
                    isActive ? "active" : "",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    className="roadmap-head"
                    onClick={() => handleClickMission(m.id)}
                    title={
                      m.status === "none"
                        ? "후기를 작성하려면 클릭"
                        : m.status === "pending"
                        ? "승인 대기중"
                        : "승인됨"
                    }
                  >
                    <span className="roadmap-title-text">{m.title}</span>

                    {/* ⬇⬇ rewardExp 뱃지 (제목과 상태 아이콘 사이) ⬇⬇ */}
                    {typeof m.rewardExp === "number" && (
                      <span className="reward-exp-badge">+{m.rewardExp}</span>
                    )}

                    <img
                      className="status-icon"
                      src={statusIconSrc(m.status)}
                      alt={m.status}
                    />
                  </button>
                </li>

                {isActive && (
                  <div className="feedback-inline">
                    <div className="feedback-inline-inner">
                      <textarea
                        className="feedback-textarea"
                        rows={5}
                        placeholder="간단한 후기(5자 이상)와 사진(1~3장)을 업로드해주세요!"
                        value={feedbackById[m.id] || ""}
                        onChange={(e) => handleTextChange(m.id, e.target.value)}
                      />

                      <div className="feedback-bottom-row">
                        <div className="upload-wrap">
                          <input
                            type="file"
                            id={`file-${m.id}`}
                            accept="image/*"
                            multiple
                            style={{ display: "none" }}
                            onChange={(e) => handlePhotoChange(m.id, e)}
                          />
                          {/* ✅ 라벨 기본 동작만 사용 + onMouseDown으로 사전 검사/차단 */}
                          <label
                            htmlFor={`file-${m.id}`}
                            className="upload-btn"
                            title="사진 업로드"
                            onMouseDown={(e) => {
                              const count = photoById[m.id]?.length || 0;
                              if (count >= MAX_PHOTOS) {
                                e.preventDefault(); // 파일창 열림 자체를 막음
                                alert(
                                  `사진은 최대 ${MAX_PHOTOS}장까지 업로드할 수 있어요. 기존 사진을 삭제해 주세요.`
                                );
                              }
                            }}
                          >
                            <img src="/images/imageUpload.png" alt="upload" />
                          </label>

                          <span className="upload-counter">
                            {photoById[m.id]?.length || 0} / {MAX_PHOTOS}
                          </span>

                          <div className="preview-list">
                            {previews.map((url, idx) => (
                              <div key={`${url}-${idx}`} className="thumb">
                                <img
                                  className="photo-preview"
                                  src={url}
                                  alt={`preview-${idx}`}
                                />
                                <div
                                  className="thumb-remove-badge"
                                  role="button"
                                  tabIndex={0}
                                  onClick={() => handleRemovePhoto(m.id, idx)}
                                  onKeyDown={(ev) => {
                                    if (ev.key === "Enter" || ev.key === " ") {
                                      handleRemovePhoto(m.id, idx);
                                    }
                                  }}
                                  title="사진 삭제"
                                >
                                  x
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          className="send-btn"
                          disabled={
                            (feedbackById[m.id] || "").trim().length < 5 ||
                            (photoById[m.id]?.length || 0) < 1
                          }
                          onClick={() => handleSendFeedback(m.id)}
                          title={
                            (feedbackById[m.id] || "").trim().length >= 5 &&
                            (photoById[m.id]?.length || 0) >= 1
                              ? "전송"
                              : "사진(1장 이상)과 5자 이상 후기가 필요합니다"
                          }
                        >
                          전송
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </ul>
      </div>

      {/* ===== 데일리 완료 확인 다이얼로그 ===== */}
      {missionToConfirm && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-header">미션 완료 확인</div>
            <div className="modal-body">
              <div>
                <span className="modal-title">“{missionToConfirm.title}”</span>
                <br /> 미션을 완료하셨나요?
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-btn-cancel" onClick={handleCloseDialog}>
                취소
              </button>
              <button
                className="modal-btn-confirm"
                onClick={handleConfirmComplete}
              >
                네, 완료했습니다
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== 로드맵 전송 확인 다이얼로그 ===== */}
      {roadmapToConfirm && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-header">후기 전송 확인</div>
            <div className="modal-body">
              <div>
                <span className="modal-title">“{roadmapToConfirm.title}”</span>
                <br /> 후기 작성을 완료하셨나요?
                <br />
                추후 관리자 승인을 통해 포인트가 지급됩니다.
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="modal-btn-cancel"
                onClick={handleCloseRoadmapDialog}
              >
                취소
              </button>
              <button
                className="modal-btn-confirm"
                onClick={handleConfirmRoadmap}
              >
                네, 완료했습니다
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionMainPage;
