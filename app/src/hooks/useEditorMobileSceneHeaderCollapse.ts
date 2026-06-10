"use client";

import { useEffect, useState } from "react";
import { EDITOR_SCROLL_ROOT_ATTR } from "@/lib/editor-scroll";

const SCROLL_DELTA_THRESHOLD = 10;
const MIN_SCROLL_TO_HIDE = 32;

/**
 * 모바일 편집 본문 스크롤 — 아래로 내리면 장면 탭 영역 접음, 위로 올리면 다시 노출.
 */
export function useEditorMobileSceneHeaderCollapse(enabled: boolean) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setCollapsed(false);
      return;
    }

    const scrollRoot = document.querySelector(`[${EDITOR_SCROLL_ROOT_ATTR}]`);
    if (!(scrollRoot instanceof HTMLElement)) return;

    let lastScrollTop = scrollRoot.scrollTop;

    const onScroll = () => {
      const scrollTop = scrollRoot.scrollTop;
      const delta = scrollTop - lastScrollTop;

      if (scrollTop <= 0) {
        setCollapsed(false);
      } else if (delta > SCROLL_DELTA_THRESHOLD && scrollTop > MIN_SCROLL_TO_HIDE) {
        setCollapsed(true);
      } else if (delta < -SCROLL_DELTA_THRESHOLD) {
        setCollapsed(false);
      }

      lastScrollTop = scrollTop;
    };

    scrollRoot.addEventListener("scroll", onScroll, { passive: true });
    return () => scrollRoot.removeEventListener("scroll", onScroll);
  }, [enabled]);

  return collapsed;
}
