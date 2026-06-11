"use client";

import { useEffect, useRef, useState } from "react";
import {
  EDITOR_MOBILE_SUB_HEADER_HEIGHT_PX,
  EDITOR_SCROLL_ROOT_ATTR,
} from "@/lib/editor-scroll";
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
  const [hiddenPx, setHiddenPx] = useState(0);
  const hiddenRef = useRef(0);

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

    let lastScrollTop = getScrollTop();

    const onScroll = () => {
      const scrollTop = getScrollTop();
      const delta = scrollTop - lastScrollTop;

      if (scrollTop <= 0) {
        hiddenRef.current = 0;
      } else {
        hiddenRef.current = Math.max(0, Math.min(maxHide, hiddenRef.current + delta));
      }

      setHiddenPx(hiddenRef.current);
      lastScrollTop = scrollTop;
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
