import api from "../../../lib/apiClient";

/** ① 테스트 제출 */
export async function submitCharacterTest(answerValues /* number[]: 1~4 */) {
  const payload = {
    answers: answerValues.map((answer_value, idx) => ({
      questionNumber: idx + 1,
      selectedOption: answer_value,
    })),
  };
  // 디버깅: 로컬에 저장된 토큰 및 디코딩된 페이로드 출력
  try {
    const token = localStorage.getItem('accessToken');
    console.log('🔐 [TEST API] local accessToken:', token ? `${token.substring(0,20)}...` : '없음');
    if (token) {
      try {
        const payloadPart = JSON.parse(atob(token.split('.')[1]));
        console.log('🔍 [TEST API] 토큰 페이로드:', payloadPart);
      } catch (e) {
        console.warn('⚠️ [TEST API] 토큰 디코딩 실패:', e.message);
      }
    }
  } catch (e) {
    console.warn('⚠️ [TEST API] 토큰 로그 중 오류:', e.message);
  }

  // POST /api/v1/test/complete (API 명세서에 맞게 수정)
  const { data } = await api.post("/api/v1/test/complete", payload);
  return data;
}

/** ② 캐릭터 상세 조회 (온보딩 완료 시 반환된 데이터 사용) */
export async function getCharacterById(characterId) {
  if (!characterId) throw new Error("characterId required");

  // API 명세서에 캐릭터 상세 조회 API가 없으므로
  // 온보딩 완료 시 반환된 데이터를 사용하거나
  // 메인 API에서 캐릭터 정보를 조회
  try {
    const { data } = await api.get("/api/v1/main");
    return {
      characterId: characterId,
      characterType: data.characterType,
      characterName: data.characterType === 'mony' ? '모니' : 
                    data.characterType === 'tory' ? '토리' :
                    data.characterType === 'pory' ? '포리' :
                    data.characterType === 'koko' ? '코코' : '모니',
      level: data.level,
      stage: data.characterStage,
      description: "캐릭터 설명",
      keywords: []
    };
  } catch (error) {
    throw new Error("캐릭터 정보를 조회할 수 없습니다.");
  }
}
