"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  EDITOR_MOBILE_SUB_HEADER_HEIGHT_PX,
  EDITOR_SCROLL_ROOT_ATTR,
} from "@/lib/editor-scroll";
import { useVisualKeyboardInset } from "@/hooks/useVisualKeyboardInset";
import { getDocumentScrollTop, isMobileDocumentScrollMode } from "@/lib/mobile-document-scroll";

export interface EditorMobileSubHeaderScrollHide {
  /** 서브헤더가 위로 숨겨진 픽셀 수 (0 ~ EDITOR_MOBILE_SUB_HEADER_HEIGHT_PX) */
  hiddenPx: number;
  /** 서브헤더가 완전히 숨겨졌는지 */
  isFullyHidden: boolean;
}

/**
 * 모바일 편집 본문 스크롤 — 이동한 픽셀만큼 서브헤더를 점진적으로 숨기거나 다시 노출.
 */
export function useEditorMobileSceneHeaderCollapse(enabled: boolean): EditorMobileSubHeaderScrollHide {
  const { isKeyboardOpen } = useVisualKeyboardInset();
  const [hiddenPx, setHiddenPx] = useState(0);
  const hiddenRef = useRef(0);
  const lastScrollTopRef = useRef(0);
  const suppressScrollRef = useRef(false);
  const preKeyboardHiddenRef = useRef(0);
  const wasKeyboardOpenRef = useRef(false);
  const isKeyboardOpenRef = useRef(isKeyboardOpen);

  hiddenRef.current = hiddenPx;
  isKeyboardOpenRef.current = isKeyboardOpen;

  // hidePx 변경 → 레이아웃 reflow → spurious scroll delta 방지
  useLayoutEffect(() => {
    if (!enabled) return;

    suppressScrollRef.current = true;

    const syncScrollBaseline = () => {
      lastScrollTopRef.current = isMobileDocumentScrollMode()
        ? getDocumentScrollTop()
        : (document.querySelector(`[${EDITOR_SCROLL_ROOT_ATTR}]`) as HTMLElement | null)?.scrollTop ?? 0;
    };

    syncScrollBaseline();
    const rafId = requestAnimationFrame(() => {
      syncScrollBaseline();
      suppressScrollRef.current = false;
    });

    return () => {
      cancelAnimationFrame(rafId);
      suppressScrollRef.current = false;
    };
  }, [enabled, hiddenPx]);

  // 키보드 열림: 서브헤더 완전 숨김(레이아웃 고정) · 닫힘: 이전 상태 복원
  useEffect(() => {
    if (!enabled) return;

    const wasOpen = wasKeyboardOpenRef.current;
    wasKeyboardOpenRef.current = isKeyboardOpen;

    if (isKeyboardOpen && !wasOpen) {
      preKeyboardHiddenRef.current = hiddenRef.current;
      hiddenRef.current = EDITOR_MOBILE_SUB_HEADER_HEIGHT_PX;
      setHiddenPx(EDITOR_MOBILE_SUB_HEADER_HEIGHT_PX);
      return;
    }

    if (!isKeyboardOpen && wasOpen) {
      hiddenRef.current = preKeyboardHiddenRef.current;
      setHiddenPx(preKeyboardHiddenRef.current);
      lastScrollTopRef.current = isMobileDocumentScrollMode()
        ? getDocumentScrollTop()
        : (document.querySelector(`[${EDITOR_SCROLL_ROOT_ATTR}]`) as HTMLElement | null)?.scrollTop ?? 0;
    }
  }, [enabled, isKeyboardOpen]);

  useEffect(() => {
    if (!enabled) {
      hiddenRef.current = 0;
      setHiddenPx(0);
      return;
    }

    const maxHide = EDITOR_MOBILE_SUB_HEADER_HEIGHT_PX;

    const getScrollTop = () =>
      isMobileDocumentScrollMode()
        ? getDocumentScrollTop()
        : (document.querySelector(`[${EDITOR_SCROLL_ROOT_ATTR}]`) as HTMLElement | null)?.scrollTop ?? 0;

    lastScrollTopRef.current = getScrollTop();

    const onScroll = () => {
      if (suppressScrollRef.current || isKeyboardOpenRef.current) return;

      const scrollTop = getScrollTop();
      const delta = scrollTop - lastScrollTopRef.current;

      if (scrollTop <= 0) {
        hiddenRef.current = 0;
      } else {
        hiddenRef.current = Math.max(0, Math.min(maxHide, hiddenRef.current + delta));
      }

      setHiddenPx(hiddenRef.current);
      lastScrollTopRef.current = scrollTop;
    };

    if (isMobileDocumentScrollMode()) {
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const scrollRoot = document.querySelector(`[${EDITOR_SCROLL_ROOT_ATTR}]`);
    if (!(scrollRoot instanceof HTMLElement)) return;

    scrollRoot.addEventListener("scroll", onScroll, { passive: true });
    return () => scrollRoot.removeEventListener("scroll", onScroll);
  }, [enabled]);

  return {
    hiddenPx,
    isFullyHidden: hiddenPx >= EDITOR_MOBILE_SUB_HEADER_HEIGHT_PX,
  };
}
