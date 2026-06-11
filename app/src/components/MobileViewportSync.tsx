"use client";

import { useEffect } from "react";
import {
  readVisualViewportChromeInsets,
  type VisualViewportChromeState,
} from "@/lib/visual-viewport-chrome";

const MOBILE_MQ = "(max-width: 1023px)";

function isMobileViewport() {
  return typeof window !== "undefined" && window.matchMedia(MOBILE_MQ).matches;
}

function applyChromeVars(snapshot: VisualViewportChromeState) {
  const root = document.documentElement;
  root.style.setProperty("--app-vv-top", `${snapshot.top}px`);
  root.style.setProperty("--app-vv-bottom", `${snapshot.bottom}px`);
  root.style.setProperty("--app-vv-height", `${snapshot.height}px`);
  root.style.setProperty("--app-vv-offset-top", `${snapshot.offsetTop}px`);
}

function clearChromeVars() {
  const root = document.documentElement;
  root.style.removeProperty("--app-vv-top");
  root.style.removeProperty("--app-vv-bottom");
  root.style.removeProperty("--app-vv-height");
  root.style.removeProperty("--app-vv-offset-top");
}

/**
 * visualViewport 기준 모바일 브라우저 상·하단 크롬 inset을 CSS 변수로 동기화한다.
 * - `--app-vv-top`: URL/상단 UI offset (safe-area는 CSS `env()`로 별도 합산)
 * - `--app-vv-bottom`: 하단 브라우저 바(키보드 제외)
 * - `--app-vv-height` / `--app-vv-offset-top`: 앱 셸 고정 배치용 visual viewport 크기
 * 키보드 열림 시 inset을 고정해 화면이 추가로 눌리지 않게 한다.
 *
 * 모바일에서는 내부 스크롤 시 window를 1px 스크롤해 iOS Safari URL 바 접힘을 유도한다.
 */
export function MobileViewportSync() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let lastChrome: VisualViewportChromeState = { top: 0, bottom: 0, height: 0, offsetTop: 0 };

    const syncMobileMode = () => {
      document.documentElement.classList.toggle("app-mobile-vv-sync", isMobileViewport());
    };

    const apply = () => {
      const snapshot = readVisualViewportChromeInsets(lastChrome);
      if (!snapshot.keyboardOpen) {
        lastChrome = {
          top: snapshot.top,
          bottom: snapshot.bottom,
          height: snapshot.height,
          offsetTop: snapshot.offsetTop,
        };
      }
      applyChromeVars(lastChrome);
    };

    const nudgeWindowScrollForBrowserChrome = (event: Event) => {
      if (!isMobileViewport()) return;

      const target = event.target;
      if (
        target === document ||
        target === document.documentElement ||
        target === document.body
      ) {
        return;
      }
      if (!(target instanceof HTMLElement)) return;

      if (target.scrollTop > 0 && window.scrollY === 0) {
        window.scrollTo(0, 1);
      } else if (target.scrollTop <= 0 && window.scrollY > 0) {
        window.scrollTo(0, 0);
      }
    };

    const onScroll = (event: Event) => {
      apply();
      nudgeWindowScrollForBrowserChrome(event);
    };

    syncMobileMode();
    apply();

    const viewport = window.visualViewport;
    const mq = window.matchMedia(MOBILE_MQ);
    const onMqChange = () => {
      syncMobileMode();
      apply();
    };

    viewport?.addEventListener("resize", apply);
    viewport?.addEventListener("scroll", apply);
    window.addEventListener("resize", apply);
    window.addEventListener("orientationchange", apply);
    mq.addEventListener("change", onMqChange);
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });

    return () => {
      viewport?.removeEventListener("resize", apply);
      viewport?.removeEventListener("scroll", apply);
      window.removeEventListener("resize", apply);
      window.removeEventListener("orientationchange", apply);
      mq.removeEventListener("change", onMqChange);
      document.removeEventListener("scroll", onScroll, { capture: true });
      document.documentElement.classList.remove("app-mobile-vv-sync");
      clearChromeVars();
    };
  }, []);

  return null;
}
