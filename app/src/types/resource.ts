/** 리소스 관리 페이지에서 사용하는 공통 타입 */

/** 썸네일/미디어 슬롯 비율 타입 (1:1 정사각형, 16:9 가로, 9:16 세로, mov 세로+재생시간) */
export type MediaSlotType = "img1:1" | "img16:9" | "img9:16" | "mov";

export type ResourceCategory =
  | "character"
  | "background"
  | "scene"
  | "media"
  | "gallery"
  | "bgm";

export interface CharacterResource {
  id: string;
  name: string;
  imageUrl: string;
  /** 인물 소개 (상세 페이지) */
  summary?: string;
  /** 해시태그 쉼표 구분 (상세 페이지) */
  tags?: string;
  /** 인물 인사 멘트 (상세 페이지) */
  greeting?: string;
}

export interface ImageResource {
  id: string;
  name: string;
  imageUrl: string;
}

export interface MediaResource {
  id: string;
  name: string;
  thumbnailUrl: string;
  duration: string;
}

export interface BgmResource {
  id: string;
  title: string;
  duration: string;
}
