"use client";

import { useIsMdUp } from "@/hooks/useMediaQuery";

/**
 * 페이지 필터 띠(알림·분석·반응·문의·내 작품)의 DS Tabs 크기.
 * DS `size`는 data 속성으로 타이포를 정하므로 미디어쿼리 클래스로는 바꿀 수 없다.
 * 모바일(<768)은 `xl`, 태블릿·데스크톱(`md+`)은 `2xl`(DS48)로 prop을 바꾼다.
 */
export function useFilterTabStripSize(): "xl" | "2xl" {
  return useIsMdUp() ? "2xl" : "xl";
}
