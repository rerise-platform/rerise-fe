import React, { useEffect, useState } from "react";
import "../pages/MissionMainPage.css";

const MissionMainPage = () => {
  // ===== 로드맵(기존) =====
  const [roadmapMissions, setRoadmapMissions] = useState([
    { id: 1, title: "30분 산책하기!", status: "none" },
    { id: 2, title: "그림, 글, 음악 등 5분 창작 활동하기!", status: "none" },
    { id: 3, title: "오늘 겪은 감정과 행동을 분석해 보기!", status: "none" },
  ]);

  const [activeFeedbackId, setActiveFeedbackId] = useState(-1);
  const [feedbackById, setFeedbackById] = useState({});
  const [photoById, setPhotoById] = useState({});
  const [photoPreviewById, setPhotoPreviewById] = useState({});

  const statusIconSrc = (status) => {
    if (status === "approved") return "/images/missionChecked.png";
    if (status === "pending") return "/images/waiting.png";
    return "/images/missionUnchecked.png";
  };

  const handleClickMission = (id) => {
    const m = roadmapMissions.find((x) => x.id === id);
    if (!m || m.status !== "none") return;
    setActiveFeedbackId((prev) => (prev === id ? -1 : id));
  };

  const handleTextChange = (id, value) => {
    setFeedbackById((prev) => ({ ...prev, [id]: value }));
  };

  const handlePhotoChange = (id, e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const prevFiles = photoById[id] || [];
    const prevUrls = photoPreviewById[id] || [];

    const nextFiles = [...prevFiles];
    const nextUrls = [...prevUrls];

    files.forEach((f) => {
      nextFiles.push(f);
      nextUrls.push(URL.createObjectURL(f));
    });

    setPhotoById((prev) => ({ ...prev, [id]: nextFiles }));
    setPhotoPreviewById((prev) => ({ ...prev, [id]: nextUrls }));
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

  const handleSendFeedback = (id) => {
    const text = (feedbackById[id] || "").trim();
    const photos = photoById[id] || [];
    if (text.length < 5 || photos.length < 1) return;

    setRoadmapMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "pending" } : m))
    );
    setActiveFeedbackId(-1);
  };

  const handleAdminApprove = (id) => {
    setRoadmapMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "approved" } : m))
    );
  };

  // ===== 데일리 미션 =====
  const [dailyMissions, setDailyMissions] = useState([
    {
      id: "d1",
      title: "가족이나 친구에게 간단한 안부 메시지 보내기",
      completed: false,
    },
    { id: "d2", title: "밤/저녁/새벽 명상 10분", completed: false },
    {
      id: "d3",
      title: "잠들기 전 5분 스트레칭 또는 명상하기",
      completed: false,
    },
    { id: "d4", title: "오늘 할 가지 새로운 행동 시도하기", completed: false },
  ]);

  // 다이얼로그로 확인할 미션 id (null이면 닫힘)
  const [confirmId, setConfirmId] = useState(null);
  const missionToConfirm =
    dailyMissions.find((m) => m.id === confirmId) || null;

  const completedCount = dailyMissions.filter((m) => m.completed).length;
  const rewardLabels = ["+ 10", "+ 10", "+ 10", "+ 15"];

  // [변경] 버튼 클릭 시 -> 완료 요청(다이얼로그 오픈)
  const handleRequestComplete = (id) => {
    const m = dailyMissions.find((dm) => dm.id === id);
    if (!m || m.completed) return;
    setConfirmId(id);
  };

  // 다이얼로그: 확인
  const handleConfirmComplete = () => {
    if (!confirmId) return;
    setDailyMissions((prev) =>
      prev.map((m) => (m.id === confirmId ? { ...m, completed: true } : m))
    );
    setConfirmId(null);
  };

  // 다이얼로그: 닫기(취소 또는 X)
  const handleCloseDialog = () => setConfirmId(null);

  // ESC로 닫기
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setConfirmId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
          const done = m.completed;
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

      {/* ===== 완료 확인 다이얼로그 ===== */}
      {missionToConfirm && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-header">미션 완료 확인</div>
            <div className="modal-body">
              <div>
                <span className="modal-title">“{missionToConfirm.title}”</span>
                <br></br> 미션을 완료하셨나요?
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

      {/* ===== 로드맵 섹션 (기존) ===== */}
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
                        placeholder="간단한 후기(5자 이상)와 사진을 업로드해주세요!"
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
                          <label
                            htmlFor={`file-${m.id}`}
                            className="upload-btn"
                            title="사진 업로드"
                          >
                            <img src="/images/imageUpload.png" alt="upload" />
                          </label>

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
    </div>
  );
};

export default MissionMainPage;
