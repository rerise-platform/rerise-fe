import axios from 'axios';

const USE_MOCK_DATA = true;

const mockPlacesResponse = {
  recommendation: "🌟 반포 한강공원\n📍 위치: 서울 서초구 반포동 20-1 (https://map.naver.com/v5/search/서초구%20반포%20한강공원)\n💡 추천 이유: 프로젝트 성공으로 행복과 성취감을 느낀 지금, 넓고 푸른 자연 공간인 반포 한강공원에서 맑은 공기와 강변 산책, 자전거 타기 같은 활동적인 마음챙김을 즐기기에 정말 좋아요. 활기차고 만족스러운 기분에 딱 맞는 힐링 공간이 될 거예요.\n⏰ 방문 팁: 주말 오전이나 늦은 오후에 방문해 한강의 아름다운 경관과 산책을 만끽하세요. 간단한 피크닉도 추천해요.\n\n🌟 예술의전당\n📍 위치: 서울 서초구 서초동 700 (https://map.naver.com/v5/search/서초구%20예술의전당)\n💡 추천 이유: 예술과 문화에 관심 많고 성장을 지향하는 당신에게, 다양한 공연과 전시가 열리는 예술의전당은 감동과 영감을 주는 공간이에요. 마음챙김과 사고 정리에 예술 감상만큼 좋은 것도 없습니다. 멋진 공연을 보며 성취감을 더 높여보세요.\n⏰ 방문 팁: 공연 일정 미리 체크해서 자신에게 꼭 맞는 공연이나 전시에 가보면 큰 만족을 얻을 수 있어요.\n\n🌟 국립중앙도서관\n📍 위치: 서울 서초구 반포대로 201 (https://map.naver.com/v5/search/서초구%20국립중앙도서관)\n💡 추천 이유: 차분히 생각 정리하고 마음챙김에 집중하고 싶을 때 방문하면 좋은 곳이에요. 국내 최대 규모의 도서관이라 다양한 자료를 접하면서 자신이 원하는 공부나 독서를 할 수 있어 만족과 성취를 느끼기에 아주 적격입니다.\n⏰ 방문 팁: 평일 오전이 한적해서 집중하기 좋고, 조용한 공간에서 편하게 시간을 보내세요.\n\n이 세 곳은 당신의 긍정적인 감정과 성취감, 성장 지향적 성향에 딱 맞는 서초구 내에서의 추천 장소랍니다. 친구와 함께 방문하거나 혼자 조용히 자신만의 시간을 보내기에 모두 좋아요!",
  success: true,
  message: "장소 추천이 성공적으로 완료되었습니다."
};

const mockProgramsResponse = {
  programs: [
    {
      programName: "서초구 청년 취업 지원 프로그램",
      category: "청년",
      target: "만 18~39세 청년",
      recruitmentPeriod: "2024-03-01 ~ 2024-03-31",
      location: "서초구 청년센터",
      url: "https://example.com/program1"
    },
    {
      programName: "서초문화원 문화체험 프로그램",
      category: "문화",
      target: "서초구민 누구나",
      recruitmentPeriod: "상시모집",
      location: "서초문화원",
      url: "https://example.com/program2"
    },
    {
      programName: "서초구 심리상담 프로그램",
      category: "청년",
      target: "만 20~35세 청년",
      recruitmentPeriod: "2024-04-01 ~ 2024-04-30",
      location: "서초구 정신건강복지센터",
      url: "https://example.com/program3"
    }
  ],
  recommendationReason: "회원님의 레벨이 높아 취업 및 커리어 관련 청년 프로그램을 우선적으로 추천드렸습니다.",
  success: true,
  message: "프로그램 추천이 성공적으로 완료되었습니다."
};

export const getSeochoPlaceRecommendations = async () => {
  try {
    if (USE_MOCK_DATA) {
      console.log('Mock: Loading Seocho places data...');
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockPlacesResponse;
    }

    const token = localStorage.getItem('token');
    const response = await axios.get('/api/v1/place/recommend/seocho', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to load Seocho places:', error);
    throw error.response?.data || error.message;
  }
};

export const getUserProgramRecommendations = async () => {
  try {
    if (USE_MOCK_DATA) {
      console.log('Mock: Loading user programs data...');
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockProgramsResponse;
    }

    const token = localStorage.getItem('token');
    const response = await axios.get('/api/v1/recommendation/programs', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to load user programs:', error);
    throw error.response?.data || error.message;
  }
};

export const getRecommendationPlaces = async () => {
  return getSeochoPlaceRecommendations();
};

export const getRecommendationPrograms = async () => {
  return getUserProgramRecommendations();
};