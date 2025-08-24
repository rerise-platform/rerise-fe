// 맨 위 import 옆에 추가
import {
  fetchAdminMissions,
  fetchPendingDetail,
  approveOrReject,
} from "../api/admin.service";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/AdminPage.css";

/** 날짜 포맷 */
const fmtDate = (iso) => {
  if (!iso) return "";
  // YYYY-MM-DD 형식이면 그대로 리턴 (시간 파싱 X)
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("PENDING"); // 'PENDING' | 'APPROVED'
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const PAGE_SIZE = 8;
  const [page, setPage] = useState(1);

  const [detail, setDetail] = useState(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  // 중복 방지 (승인/거절 버튼 더블클릭, StrictMode 2회 등)
  const busyRef = useRef(false);

  // ✅ 로그아웃 핸들러: 토큰 제거 후 /login으로 이동
  const handleLogout = async () => {
    const ok = window.confirm("로그아웃 하시겠습니까?");
    if (!ok) return;
    // (선택) 서버 로그아웃 API가 있다면 호출 가능
    // await api.post("/api/v1/auth/logout");
    try {
    } catch (e) {
      console.warn("logout api error:", e);
    } finally {
      localStorage.removeItem("accessToken"); // 토큰 삭제
      navigate("/login", { replace: true }); // 로그인 페이지로 이동(뒤로가기 방지)
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        if (tab === "PENDING") {
          const items = await fetchAdminMissions({
            status: "PENDING",
            q,
          });
          if (mounted) setPending(items);
        } else {
          // 끝난 상자 = APPROVED + REJECTED 둘 다 합쳐서 보여주기
          const [approvedList, rejectedList] = await Promise.all([
            fetchAdminMissions({
              status: "APPROVED",
              q,
            }),
            fetchAdminMissions({
              status: "REJECTED",
              q,
            }),
          ]);
          const merged = [...approvedList, ...rejectedList]
            // 날짜가 최신이 먼저 오게 정렬(선택)
            .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
          if (mounted) setApproved(merged);
        }
        // "APPROVED" 탭은 서버 API가 아직 없으니,
        // 방금 내가 승인/거절한 것들만 로컬 approved 상태로 보여줍니다.
      } catch (e) {
        console.error(e);
        showToast("목록 불러오기 오류");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [tab, q]);

  const openDetail = async (m) => {
    try {
      setLoading(true);
      const dto = await fetchPendingDetail(m.id);
      // proofData에서 이미지 URL 뽑고, 나머지는 후기글로 사용
      const urlRegex = /(https?:\/\/[^\s,]+?\.(?:png|jpg|jpeg|gif|webp))/gi;
      const photos = [...(dto.proofData || "").matchAll(urlRegex)].map(
        (mm) => mm[0]
      );
      const reviewText = (dto.proofData || "").replace(urlRegex, "").trim();

      setDetail({
        ...m,
        userName: dto.userName,
        userEmail: dto.userEmail,
        submittedAt: dto.submittedAt, // 상세는 LocalDateTime
        content: dto.content, // missionContent
        reviewText: reviewText || dto.proofData || "—",
        photos,
        status: "PENDING",
      });
    } catch (e) {
      console.error(e);
      showToast("상세 불러오기 오류");
    } finally {
      setLoading(false);
    }
  };

  // 검색
  const list = tab === "PENDING" ? pending : approved;
  const filtered = useMemo(() => {
    if (!q.trim()) return list;
    const keyword = q.trim().toLowerCase();
    return list.filter(
      (m) =>
        m.userName?.toLowerCase().includes(keyword) ||
        m.userEmail?.toLowerCase().includes(keyword) ||
        m.content?.toLowerCase().includes(keyword) ||
        m.reviewText?.toLowerCase().includes(keyword)
    );
  }, [list, q]);

  useEffect(() => {
    setPage(1);
  }, [q, tab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  const goPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    const listEl = document.querySelector(".user-table");
    if (listEl) listEl.scrollIntoView({ behavior: "instant", block: "start" });
  };

  const closeDetail = () => {
    setDetail(null);
    setRejectOpen(false);
    setRejectReason("");
  };

  const refreshApprovedTab = async () => {
    const [a, r] = await Promise.all([
      fetchAdminMissions({ status: "APPROVED" }),
      fetchAdminMissions({ status: "REJECTED" }),
    ]);
    setApproved(
      [...a, ...r].sort(
        (x, y) => new Date(y.submittedAt) - new Date(x.submittedAt)
      )
    );
  };
  /** ✅ 승인: pending에서 꺼내서 approved로 넣고 탭 이동 */
  const approveMission = async (missionId) => {
    if (busyRef.current) return;
    busyRef.current = true;
    try {
      await approveOrReject(missionId, true); // "수락"
      // 1) pending에서 제거
      setPending((cur) => cur.filter((m) => m.id !== missionId));
      // 2) 이번 세션 동안 approved 탭에 보여주기(로컬 캐시)
      setApproved((cur) => {
        const moved =
          detail && detail.id === missionId
            ? { ...detail, status: "APPROVED" }
            : { id: missionId, status: "APPROVED" };
        return cur.some((x) => x.id === missionId) ? cur : [moved, ...cur];
      });
      closeDetail();
      setTab("APPROVED");
      await refreshApprovedTab();
      showToast("승인 완료");
    } catch (e) {
      console.error(e);
      showToast("승인 중 오류가 발생했어요");
    } finally {
      busyRef.current = false;
    }
  };

  /** ✅ 거절: pending에서 꺼내서 status=REJECTED로 approved에 넣고 탭 이동 */
  const rejectMission = async (missionId, reason) => {
    if (busyRef.current) return;
    if (!reason.trim()) {
      showToast("거절 사유를 입력해 주세요");
      return;
    }
    busyRef.current = true;
    try {
      await approveOrReject(missionId, false); // "거절"
      setPending((cur) => cur.filter((m) => m.id !== missionId));
      setApproved((cur) => {
        const moved =
          detail && detail.id === missionId
            ? { ...detail, status: "REJECTED", rejectReason: reason }
            : { id: missionId, status: "REJECTED", rejectReason: reason };
        return cur.some((x) => x.id === missionId) ? cur : [moved, ...cur];
      });
      closeDetail();
      setTab("APPROVED");
      await refreshApprovedTab();
      showToast("거절 처리 완료");
    } catch (e) {
      console.error(e);
      showToast("거절 중 오류가 발생했어요");
    } finally {
      busyRef.current = false;
    }
  };

  return (
    <div className="admin-shell">
      <div className="scale-viewport">
        <div className="admin-page">
          <header className="admin-header">
            <h1 className="admin-title">사용자 미션 관리</h1>
            <button className="btn-logout" onClick={handleLogout}>
              로그아웃
            </button>
          </header>

          {/* 검색 */}
          <div className="admin-search">
            <input
              type="text"
              placeholder="사용자/이메일/내용/후기 검색"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="검색"
            />
            <button className="icon-btn" aria-label="검색 아이콘">
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                aria-hidden="true"
              >
                <path
                  d="M10.5 3a7.5 7.5 0 015.93 12.12l4.22 4.22-1.42 1.42-4.22-4.22A7.5 7.5 0 1110.5 3zm0 2a5.5 5.5 0 100 11 5.5 5.5 0 000-11z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>

          {/* 탭 */}
          <div className="admin-tabs">
            <button
              className={`tab-btn ${tab === "PENDING" ? "is-active" : ""}`}
              onClick={() => setTab("PENDING")}
            >
              승인 필요 <span className="badge">{pending.length}</span>
            </button>
            <button
              className={`tab-btn ${tab === "APPROVED" ? "is-active" : ""}`}
              onClick={() => setTab("APPROVED")}
            >
              승인 완료 <span className="badge">{approved.length}</span>
            </button>
          </div>

          {/* 표 (4열: 이름/이메일/제출일/액션) */}
          <section className="user-table">
            <div className="user-head">
              <div className="th name">사용자명</div>
              <div className="th email">이메일</div>
              <div className="th date">제출일</div>
              <div className="th action" />
            </div>

            {loading ? (
              <div className="user-row skeleton">불러오는 중…</div>
            ) : pageItems.length === 0 ? (
              <div className="user-row empty">검색 결과가 없습니다</div>
            ) : (
              pageItems.map((m, idx) => (
                <div className="user-row" key={m.id}>
                  <div className="td name ellipsis">{m.userName}</div>
                  <div className="td email ellipsis">{m.userEmail}</div>
                  <div className="td date">{fmtDate(m.submittedAt)}</div>
                  <div className="td action">
                    {tab === "APPROVED" ? (
                      <button className="btn-detail" disabled>
                        완료
                      </button>
                    ) : (
                      <button
                        className="btn-detail"
                        onClick={() => openDetail(m)}
                        disabled={busyRef.current}
                        title={busyRef.current ? "처리 중..." : "확인"}
                      >
                        확인
                      </button>
                    )}
                  </div>
                  {idx < pageItems.length - 1 && (
                    <div className="row-divider" />
                  )}
                </div>
              ))
            )}
          </section>

          {/* 페이지네이션 */}
          {!loading && filtered.length > PAGE_SIZE && (
            <nav
              className="pagination"
              role="navigation"
              aria-label="목록 페이지 이동"
            >
              <button
                className="page-btn"
                onClick={() => goPage(page - 1)}
                disabled={page === 1}
              >
                ‹
              </button>
              {Array.from({ length: totalPages })
                .map((_, i) => i + 1)
                .filter((p) => {
                  const win = 2;
                  return (
                    p === 1 ||
                    p === totalPages ||
                    (p >= page - win && p <= page + win)
                  );
                })
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push("ellipsis");
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === "ellipsis" ? (
                    <span key={`e-${idx}`} className="page-ellipsis">
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      className={`page-btn ${page === item ? "is-active" : ""}`}
                      onClick={() => goPage(item)}
                    >
                      {item}
                    </button>
                  )
                )}
              <button
                className="page-btn"
                onClick={() => goPage(page + 1)}
                disabled={page === totalPages}
              >
                ›
              </button>
            </nav>
          )}

          {/* 상세 모달 */}
          {detail && (
            <div className="modal-overlay" role="dialog" aria-modal="true">
              <div className="modal">
                <div className="modal-header">
                  미션 상세
                  <button className="modal-close" onClick={closeDetail}>
                    ×
                  </button>
                </div>

                <div className="modal-body">
                  <div className="detail-group">
                    <div className="detail-item">
                      <span className="label">이름</span>
                      <span className="value">{detail.userName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">이메일</span>
                      <span className="value">{detail.userEmail}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">제출일</span>
                      <span className="value">
                        {fmtDate(detail.submittedAt)}
                      </span>
                    </div>
                  </div>

                  <div className="detail-block">
                    <div className="detail-label">미션 내용</div>
                    <div className="detail-content-prewrap">
                      {detail.content}
                    </div>
                  </div>

                  <div className="detail-block">
                    <div className="detail-label">후기글</div>
                    <div className="detail-content-prewrap">
                      {detail.reviewText || "—"}
                    </div>
                  </div>

                  {detail.photos?.length > 0 && (
                    <div className="detail-block">
                      <div className="detail-label">사진</div>
                      <div className="photo-grid">
                        {detail.photos.map((src, i) => (
                          <a
                            key={i}
                            href={src}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img src={src} alt={`photo-${i + 1}`} />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {tab === "PENDING" ? (
                    <div className="detail-hint">
                      ※ 승인 또는 거절 처리하세요.
                    </div>
                  ) : (
                    <div className="detail-hint ok">
                      이미 승인 완료된 게시물입니다.
                    </div>
                  )}
                </div>

                <div className="modal-actions">
                  <button className="modal-btn" onClick={closeDetail}>
                    닫기
                  </button>
                  {tab === "PENDING" && (
                    <>
                      <button
                        className="modal-btn danger"
                        onClick={() => setRejectOpen(true)}
                        disabled={busyRef.current}
                      >
                        거절
                      </button>
                      <button
                        className="modal-btn primary"
                        onClick={() => approveMission(detail.id)}
                        disabled={busyRef.current}
                        title={busyRef.current ? "처리 중..." : "승인"}
                      >
                        승인
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 거절 사유 모달 */}
          {detail && rejectOpen && (
            <div className="modal-overlay" role="dialog" aria-modal="true">
              <div className="modal small">
                <div className="modal-header">
                  거절 사유 입력
                  <button
                    className="modal-close"
                    onClick={() => setRejectOpen(false)}
                  >
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  <textarea
                    className="reject-textarea"
                    rows={5}
                    placeholder="거절 사유를 입력해 주세요 (예: 사진이 규정과 다릅니다)"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                </div>
                <div className="modal-actions">
                  <button
                    className="modal-btn"
                    onClick={() => setRejectOpen(false)}
                    disabled={busyRef.current}
                  >
                    취소
                  </button>
                  <button
                    className="modal-btn danger"
                    onClick={() => rejectMission(detail.id, rejectReason)}
                    disabled={busyRef.current}
                  >
                    거절 확정
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 토스트 */}
          {toast && <div className="toast">{toast}</div>}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
