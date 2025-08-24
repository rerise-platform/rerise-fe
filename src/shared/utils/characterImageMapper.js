// 캐릭터 이미지 매핑 유틸리티
import koko1 from '../assets/images/koko1.svg';
import koko2 from '../assets/images/koko2.svg';
import koko3 from '../assets/images/koko3.svg';
import tory1 from '../assets/images/tory1.svg';
import tory2 from '../assets/images/tory2.svg';
import tory3 from '../assets/images/tory3.svg';
import mony1 from '../assets/images/mony1.svg';
import mony2 from '../assets/images/mony2.svg';
import mony3 from '../assets/images/mony3.svg';
import pory1 from '../assets/images/pory1.svg';
import pory2 from '../assets/images/pory2.svg';
import pory3 from '../assets/images/pory3.svg';

/**
 * 캐릭터 타입과 단계에 따른 이미지 매핑 객체
 * characterType과 characterStage를 키로 하는 2차원 구조
 */
export const CHARACTER_IMAGES = {
  koko: {
    1: koko1,
    2: koko2,
    3: koko3
  },
  tory: {
    1: tory1,
    2: tory2,
    3: tory3
  },
  mony: {
    1: mony1,
    2: mony2,
    3: mony3
  },
  pory: {
    1: pory1,
    2: pory2,
    3: pory3
  }
};

/**
 * 캐릭터 타입과 단계에 따른 이미지를 반환하는 함수
 * 
 * @param {string} characterType - 캐릭터 타입 (koko, tory, mony, pory)
 * @param {number} characterStage - 캐릭터 단계 (1, 2, 3)
 * @returns {string|null} 이미지 경로 또는 null (매핑되지 않은 경우)
 */
export const getCharacterImage = (characterType, characterStage) => {
  if (!characterType || !characterStage) {
    return null;
  }
  
  return CHARACTER_IMAGES[characterType]?.[characterStage] || null;
};

/**
 * 사용 가능한 캐릭터 타입 목록
 */
export const AVAILABLE_CHARACTER_TYPES = ['koko', 'tory', 'mony', 'pory'];

/**
 * 사용 가능한 캐릭터 단계 목록
 */
export const AVAILABLE_CHARACTER_STAGES = [1, 2, 3];