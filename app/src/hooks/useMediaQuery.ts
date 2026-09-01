"use client";

import { useSyncExternalStore } from "react";

function subscribeMediaQuery(query: string, onStoreChange: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

/** `matchMedia` 구독 — SSR·hydration 첫 패스는 `defaultMatches`로 통일 */
export function useMediaQuery(query: string, defaultMatches = false): boolean {
  return useSyncExternalStore(
    (onStoreChange) => subscribeMediaQuery(query, onStoreChange),
    () => window.matchMedia(query).matches,
    () => defaultMatches,
  );
}

/**
 * 레이아웃 브레이크포인트 (Tailwind 기본)
 * - 모바일: < 768 (max-md)
 * - 태블릿: 768–1023 (md ~ max-lg)
 * - 데스크톱: ≥ 1024 (lg)
 */
/** Tailwind `md` (768px) 이상 — 태블릿+ */
export function useIsMdUp(): boolean {
  return useMediaQuery("(min-width: 768px)");
}

/** Tailwind `lg` (1024px) 이상 — 데스크톱 */
export function useIsLgUp(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}

/** 태블릿만 (768–1023) */
export function useIsTablet(): boolean {
  const mdUp = useIsMdUp();
  const lgUp = useIsLgUp();
  return mdUp && !lgUp;
}
