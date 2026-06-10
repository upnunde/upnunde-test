"use client";

import { useEffect, useState } from "react";

/** `matchMedia` 구독 — SSR 시 `defaultMatches` 사용 */
export function useMediaQuery(query: string, defaultMatches = false): boolean {
  const [matches, setMatches] = useState(defaultMatches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Tailwind `lg` (1024px) 이상 */
export function useIsLgUp(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}
