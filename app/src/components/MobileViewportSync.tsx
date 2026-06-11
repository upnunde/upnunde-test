"use client";

import { useEffect } from "react";
import { MOBILE_MEDIA_QUERY } from "@/lib/mobile-viewport";
import {
  readVisualViewportChromeInsets,
  type VisualViewportChromeState,
} from "@/lib/visual-viewport-chrome";

const VIEWPORT_CSS_VARS = [
  "--app-vv-top",
  "--app-vv-bottom",
  "--app-vv-height",
  "--app-vv-offset-top",
  "--app-keyboard-inset",
] as const;

function clearViewportCssVars(root: HTMLElement) {
  for (const name of VIEWPORT_CSS_VARS) {
    root.style.removeProperty(name);
  }
}

/**
 * visualViewport 기준 브라우저 상·하단 크롬 inset을 CSS 변수로 동기화한다.
 * 모바일 문서 스크롤 레이아웃에서 하단 고정 UI(`--app-vv-bottom`) 위치 보정에 사용한다.
 */
export function MobileViewportSync() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia(MOBILE_MEDIA_QUERY);
    let lastChrome: VisualViewportChromeState = { top: 0, bottom: 0, height: 0, offsetTop: 0 };
    let rafId = 0;

    const apply = () => {
      const root = document.documentElement;

      if (!mq.matches) {
        clearViewportCssVars(root);
        return;
      }

      const snapshot = readVisualViewportChromeInsets(lastChrome);
      if (!snapshot.keyboardOpen) {
        lastChrome = {
          top: snapshot.top,
          bottom: snapshot.bottom,
          height: snapshot.height,
          offsetTop: snapshot.offsetTop,
        };
        root.style.removeProperty("--app-keyboard-inset");
      } else {
        root.style.setProperty("--app-keyboard-inset", `${snapshot.liveBottom}px`);
      }

      root.style.setProperty("--app-vv-top", `${lastChrome.top}px`);
      root.style.setProperty("--app-vv-bottom", `${lastChrome.bottom}px`);
      root.style.setProperty("--app-vv-height", `${lastChrome.height}px`);
      root.style.setProperty("--app-vv-offset-top", `${lastChrome.offsetTop}px`);
    };

    const scheduleApply = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(apply);
    };

    apply();

    const viewport = window.visualViewport;
    viewport?.addEventListener("resize", scheduleApply);
    viewport?.addEventListener("scroll", scheduleApply);
    window.addEventListener("resize", scheduleApply);
    window.addEventListener("orientationchange", scheduleApply);
    window.addEventListener("scroll", scheduleApply, { passive: true });
    window.addEventListener("pageshow", scheduleApply);
    mq.addEventListener("change", scheduleApply);

    return () => {
      cancelAnimationFrame(rafId);
      viewport?.removeEventListener("resize", scheduleApply);
      viewport?.removeEventListener("scroll", scheduleApply);
      window.removeEventListener("resize", scheduleApply);
      window.removeEventListener("orientationchange", scheduleApply);
      window.removeEventListener("scroll", scheduleApply);
      window.removeEventListener("pageshow", scheduleApply);
      mq.removeEventListener("change", scheduleApply);
      clearViewportCssVars(document.documentElement);
    };
  }, []);

  return null;
}
