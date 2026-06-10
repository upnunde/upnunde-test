"use client";

import { useEffect, useState } from "react";

const SCROLL_DELTA_THRESHOLD = 10;
const MIN_SCROLL_TO_HIDE = 32;

/** 스크롤 방향 — 아래로 내리면 헤더 접음, 위로 올리면 다시 노출 */
export function useScrollHeaderCollapse(scrollRootAttr: string, enabled: boolean) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setCollapsed(false);
      return;
    }

    const scrollRoot = document.querySelector(`[${scrollRootAttr}]`);
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
  }, [enabled, scrollRootAttr]);

  return collapsed;
}
