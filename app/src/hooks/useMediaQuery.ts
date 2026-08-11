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

/** Tailwind `lg` (1024px) 이상 */
export function useIsLgUp(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}
