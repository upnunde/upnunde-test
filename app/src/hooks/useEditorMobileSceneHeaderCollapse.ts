"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  EDITOR_MOBILE_SUB_HEADER_HEIGHT_PX,
  findEditorScrollRoot,
  usesEditorDocumentScroll,
} from "@/lib/editor-scroll";
import { useVisualKeyboardInset } from "@/hooks/useVisualKeyboardInset";
import { getDocumentScrollTop } from "@/lib/mobile-document-scroll";

export interface EditorMobileSubHeaderScrollHide {
  /** 서브헤더가 위로 숨겨진 픽셀 수 (0 ~ EDITOR_MOBILE_SUB_HEADER_HEIGHT_PX) */
  hiddenPx: number;
  /** 서브헤더가 완전히 숨겨졌는지 */
  isFullyHidden: boolean;
}

/**
 * 모바일 편집 본문 스크롤 — 이동한 픽셀만큼 서브헤더를 점진적으로 숨기거나 다시 노출.
 * 본문은 `[data-editor-scroll-root]` 내부 스크롤(문서 스크롤 아님).
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
  const prevHiddenPxRef = useRef(0);

  hiddenRef.current = hiddenPx;
  isKeyboardOpenRef.current = isKeyboardOpen;

  const getScrollTop = () => {
    const root = findEditorScrollRoot();
    if (root && !usesEditorDocumentScroll()) {
      return root.scrollTop;
    }
    return getDocumentScrollTop();
  };

  // hidePx 변경 → 문서 스크롤(레거시)일 때만 layout shift 보정
  useLayoutEffect(() => {
    if (!enabled) return;

    suppressScrollRef.current = true;

    const prevHidden = prevHiddenPxRef.current;
    const hideDelta = hiddenPx - prevHidden;
    prevHiddenPxRef.current = hiddenPx;

    if (hideDelta !== 0 && usesEditorDocumentScroll()) {
      window.scrollBy({ top: hideDelta, behavior: "auto" });
    }

    const syncScrollBaseline = () => {
      lastScrollTopRef.current = getScrollTop();
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

  // 키보드 열림: 서브헤더 완전 숨김 · 닫힘: 이전 상태 복원
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
    }
  }, [enabled, isKeyboardOpen]);

  useEffect(() => {
    if (!enabled) {
      hiddenRef.current = 0;
      prevHiddenPxRef.current = 0;
      setHiddenPx(0);
      return;
    }

    const maxHide = EDITOR_MOBILE_SUB_HEADER_HEIGHT_PX;

    const bindScroll = (target: HTMLElement | Window) => {
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

      target.addEventListener("scroll", onScroll, { passive: true });
      return () => target.removeEventListener("scroll", onScroll);
    };

    if (usesEditorDocumentScroll()) {
      return bindScroll(window);
    }

    const scrollRoot = findEditorScrollRoot();
    if (!scrollRoot) return;

    return bindScroll(scrollRoot);
  }, [enabled]);

  return {
    hiddenPx,
    isFullyHidden: hiddenPx >= EDITOR_MOBILE_SUB_HEADER_HEIGHT_PX,
  };
}
