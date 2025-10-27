/**
 * 마이페이지 관련 API 요청 함수들
 */
import api from '../../../lib/apiClient';

/**
 * 사용자 정보를 조회합니다.
 * @returns {Promise} 사용자 정보 API 응답 결과
 */
export const fetchUserInfo = async () => {
  try {
    const response = await api.get('/api/v1/user/profile');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || '사용자 정보를 불러오는데 실패했습니다.');
    } else if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error(error.message || '사용자 정보 요청 중 오류가 발생했습니다.');
    }
  }
};

/**
 * 캐릭터 정보를 조회합니다.
 * @returns {Promise} 캐릭터 정보 API 응답 결과
 */
export const fetchCharacterInfo = async () => {
  try {
    const response = await api.get('/api/v1/character');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || '캐릭터 정보를 불러오는데 실패했습니다.');
    } else if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error(error.message || '캐릭터 정보 요청 중 오류가 발생했습니다.');
    }
  }
};

/**
 * 알림 설정을 업데이트합니다.
 * @param {Object} notificationSettings - 알림 설정 정보
 * @returns {Promise} 알림 설정 업데이트 결과
 */
export const updateNotificationSettings = async (notificationSettings) => {
  try {
    const response = await api.put('/api/v1/user/notifications', notificationSettings);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || '알림 설정 업데이트에 실패했습니다.');
    } else if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error(error.message || '알림 설정 요청 중 오류가 발생했습니다.');
    }
  }
};

/**
 * 사용자 프로필 정보를 업데이트합니다.
 * @param {Object} profileData - 업데이트할 프로필 정보
 * @returns {Promise} 프로필 업데이트 결과
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put('/api/v1/user/profile', profileData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || '프로필 업데이트에 실패했습니다.');
    } else if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error(error.message || '프로필 업데이트 요청 중 오류가 발생했습니다.');
    }
  }
};

/**
 * 마케팅 동의 설정을 업데이트합니다.
 * @param {Object} marketingConsent - 마케팅 동의 설정
 * @returns {Promise} 마케팅 동의 설정 업데이트 결과
 */
export const updateMarketingConsent = async (marketingConsent) => {
  try {
    const response = await api.put('/api/v1/user/marketing-consent', marketingConsent);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || '마케팅 동의 설정 업데이트에 실패했습니다.');
    } else if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error(error.message || '마케팅 동의 설정 요청 중 오류가 발생했습니다.');
    }
  }
};