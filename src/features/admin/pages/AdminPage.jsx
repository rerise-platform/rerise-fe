import React, { useEffect, useMemo, useState } from "react";
import "../pages/AdminPage.css";

/** 날짜 포맷 */
const fmtDate = (iso) => {
  try {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  } catch {
    return iso ?? "";
  }
};

/** 더미 데이터 (API 실패 시 사용) */
const DUMMY = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: `사용자${i + 1}명`,
  email: `user${i + 1}@example.com`,
  submittedAt: new Date(Date.now() - i * 86400000).toISOString(),
}));

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [detailUser, setDetailUser] = useState(null); // 모달 대상

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/users");
        if (!res.ok) throw new Error("failed");
        const data = await res.json();
        // 기대 포맷: [{id, name, email, submittedAt}, ...]
        if (mounted) setUsers(data || []);
      } catch (e) {
        if (mounted) setUsers(DUMMY);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return users;
    const keyword = q.trim().toLowerCase();
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(keyword) ||
        u.email?.toLowerCase().includes(keyword)
    );
  }, [users, q]);

  const allChecked =
    filtered.length > 0 && filtered.every((u) => selected.has(u.id));

  const toggleAll = () => {
    const next = new Set(selected);
    if (allChecked) {
      filtered.forEach((u) => next.delete(u.id));
    } else {
      filtered.forEach((u) => next.add(u.id));
    }
    setSelected(next);
  };

  const toggleOne = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const openDetail = (u) => setDetailUser(u);
  const closeDetail = () => setDetailUser(null);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1 className="admin-title">사용자 관리</h1>
        <button className="btn-logout" onClick={() => alert("로그아웃 처리")}>
          로그아웃
        </button>
      </header>

      <div className="admin-search">
        <input
          type="text"
          placeholder="검색"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="사용자 검색"
        />
        <button className="icon-btn" aria-label="검색">
          {/* 돋보기 아이콘 (SVG) */}
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              d="M10.5 3a7.5 7.5 0 015.93 12.12l4.22 4.22-1.42 1.42-4.22-4.22A7.5 7.5 0 1110.5 3zm0 2a5.5 5.5 0 100 11 5.5 5.5 0 000-11z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      <section className="user-table">
        <div className="user-head">
          <label className="th name">
            <input
              type="checkbox"
              checked={allChecked}
              onChange={toggleAll}
              aria-label="전체 선택"
            />
            <span>사용자명</span>
          </label>
          <div className="th email">이메일</div>
          <div className="th date">제출일</div>
          <div className="th action" />
        </div>

        {loading ? (
          <div className="user-row skeleton">불러오는 중…</div>
        ) : filtered.length === 0 ? (
          <div className="user-row empty">검색 결과가 없습니다</div>
        ) : (
          filtered.map((u, idx) => (
            <div className="user-row" key={u.id}>
              <label className="td name">
                <input
                  type="checkbox"
                  checked={selected.has(u.id)}
                  onChange={() => toggleOne(u.id)}
                  aria-label={`${u.name} 선택`}
                />
                <span className="ellipsis">{u.name || "사용자명"}</span>
              </label>
              <div className="td email ellipsis">{u.email || "이메일"}</div>
              <div className="td date">
                {fmtDate(u.submittedAt) || "제출일"}
              </div>
              <div className="td action">
                <button className="btn-detail" onClick={() => openDetail(u)}>
                  상세보기
                </button>
              </div>

              {/* 구분선 */}
              {idx < filtered.length - 1 && <div className="row-divider" />}
            </div>
          ))
        )}
      </section>

      {/* 상세보기 모달 */}
      {detailUser && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-header">
              사용자 상세
              <button
                className="modal-close"
                aria-label="닫기"
                onClick={closeDetail}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-item">
                <span className="label">이름</span>
                <span className="value">{detailUser.name}</span>
              </div>
              <div className="detail-item">
                <span className="label">이메일</span>
                <span className="value">{detailUser.email}</span>
              </div>
              <div className="detail-item">
                <span className="label">제출일</span>
                <span className="value">{fmtDate(detailUser.submittedAt)}</span>
              </div>

              <div className="detail-sub">
                ※ 여기에는 해당 사용자의 미션 제출/후기/승인현황 등을 이어서
                붙이면 됩니다.
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-btn" onClick={closeDetail}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminPage;
