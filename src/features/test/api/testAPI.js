import apiFetch from "../../../lib/apiClient";

/** ① 테스트 제출 */
export async function submitCharacterTest(answerValues /* number[]: 1~4 */) {
  const payload = {
    answers: answerValues.map((answer_value, idx) => ({
      question_id: idx + 1,
      answer_value,
    })),
  };
  // POST /api/v1/characters/test
  return await apiFetch("/api/v1/characters/test", {
    method: "POST",
    body: payload,
  });
}

/** ② 캐릭터 상세 조회 (스펙이 path 파라미터인데 경로가 애매해서 둘 다 시도) */
export async function getCharacterById(characterId) {
  if (!characterId) throw new Error("characterId required");

  // 1) /complete/{id}
  try {
    return await apiFetch(`/api/v1/characters/test/complete/${characterId}`);
  } catch (e1) {
    // 2) /complete?character_id=...
    try {
      return await apiFetch(
        `/api/v1/characters/test/complete?character_id=${characterId}`
      );
    } catch (e2) {
      // 3) /complete (body 또는 헤더 기준 서버 구현일 수도 있으나 보통 아님)
      throw e2;
    }
  }
}
