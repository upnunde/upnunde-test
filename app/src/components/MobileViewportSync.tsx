"use client";

import { useEffect } from "react";

/** `useVisualKeyboardInset`과 동일 — 키보드·브라우저 크롬 구분 임계값 */
const KEYBOARD_OPEN_THRESHOLD_PX = 80;

function readVisualViewportInsets(lastChromeBottom: number) {
  const vv = window.visualViewport;
  if (!vv) {
    return { top: 0, bottom: lastChromeBottom };
  }

  const rawBottom = Math.max(0, Math.round(window.innerHeight - vv.offsetTop - vv.height));
  const top = Math.max(0, Math.round(vv.offsetTop));

  if (rawBottom >= KEYBOARD_OPEN_THRESHOLD_PX) {
    return { top, bottom: lastChromeBottom };
  }

  return { top, bottom: rawBottom };
}

/**
 * visualViewport 기준 모바일 브라우저 상·하단 크롬 inset을 CSS 변수로 동기화한다.
 * - `--app-vv-top`: URL/상단 UI offset (safe-area는 CSS `env()`로 별도 합산)
 * - `--app-vv-bottom`: 하단 브라우저 바(키보드 제외)
 */
export function MobileViewportSync() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let lastChromeBottom = 0;

    const apply = () => {
      const { top, bottom } = readVisualViewportInsets(lastChromeBottom);
      lastChromeBottom = bottom;
      document.documentElement.style.setProperty("--app-vv-top", `${top}px`);
      document.documentElement.style.setProperty("--app-vv-bottom", `${bottom}px`);
    };

    apply();

    const viewport = window.visualViewport;
    viewport?.addEventListener("resize", apply);
    viewport?.addEventListener("scroll", apply);
    window.addEventListener("resize", apply);
    window.addEventListener("orientationchange", apply);

    return () => {
      viewport?.removeEventListener("resize", apply);
      viewport?.removeEventListener("scroll", apply);
      window.removeEventListener("resize", apply);
      window.removeEventListener("orientationchange", apply);
      document.documentElement.style.removeProperty("--app-vv-top");
      document.documentElement.style.removeProperty("--app-vv-bottom");
    };
  }, []);

  return null;
}
