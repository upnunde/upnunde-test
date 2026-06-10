"use client";

import { useEffect } from "react";
import {
  readVisualViewportChromeInsets,
  type VisualViewportChromeState,
} from "@/lib/visual-viewport-chrome";

/**
 * visualViewport 기준 모바일 브라우저 상·하단 크롬 inset을 CSS 변수로 동기화한다.
 * - `--app-vv-top`: URL/상단 UI offset (safe-area는 CSS `env()`로 별도 합산)
 * - `--app-vv-bottom`: 하단 브라우저 바(키보드 제외)
 * 키보드 열림 시 inset을 고정해 화면이 추가로 눌리지 않게 한다.
 */
export function MobileViewportSync() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let lastChrome: VisualViewportChromeState = { top: 0, bottom: 0 };

    const apply = () => {
      const snapshot = readVisualViewportChromeInsets(lastChrome);
      if (!snapshot.keyboardOpen) {
        lastChrome = { top: snapshot.top, bottom: snapshot.bottom };
      }
      document.documentElement.style.setProperty("--app-vv-top", `${snapshot.top}px`);
      document.documentElement.style.setProperty("--app-vv-bottom", `${snapshot.bottom}px`);
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
