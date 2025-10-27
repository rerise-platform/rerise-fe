import api from "../../../lib/apiClient";

/** ② 승인대기 상세 */
export async function fetchPendingDetail(id) {
  const { data } = await api.get(`/api/v1/admin/missions/submissions/${id}`);
  // 서버: { userId, nickname, email, userProofMissionId, missionContent, proofData, submissionDate }
  // proofData는 문자열(후기/사진URL 묶음) → 그대로 넘기고, 화면에서 그냥 보여도 OK
  return {
    id: data.userProofMissionId,
    userId: data.userId,
    userName: data.nickname,
    userEmail: data.email,
    submittedAt: data.submissionDate, // LocalDateTime
    content: data.missionContent,
    proofData: data.proofData, // 문자열
    status: "PENDING",
  };
}

/** ③ 승인/거절 */
export async function approveOrReject(id, isApprove /* true | false */) {
  const approved = isApprove ? "수락" : "거절";
  const { data } = await api.post(`/api/v1/admin/missions/approve`, {
    userProofMissionId: id,
    approved,
  });
  // 서버 응답: "미션이 성공적으로 완료되었습니다!" 또는 "미션이 거절되었습니다."
  return String(data || "");
}

export async function fetchAdminMissions({ status, q = "" }) {
  const { data } = await api.get("/api/v1/admin/missions/submissions", {
    params: { status, q },
  });
  const items = Array.isArray(data) ? data : data.items || [];
  return items.map((row) => ({
    id: row.userProofMissionId,
    userName: row.nickname,
    userEmail: row.email,
    submittedAt: row.submissionDate,
    status: row.status,
  }));
}
