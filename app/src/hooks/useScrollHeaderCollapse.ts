"use client";

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { getDocumentScrollTop, isMobileDocumentScrollMode } from "@/lib/mobile-document-scroll";

const SCROLL_DELTA_THRESHOLD = 10;
const MIN_SCROLL_TO_HIDE = 32;

export interface UseScrollHeaderCollapseOptions {
  /**
   * 접힘 시 형제 헤더가 document flow에서 사라질 때 scrollTop을 보정해
   * 본문이 화면에서 갑자기 밀려 올라가는 현상을 방지한다. (데스크톱 내부 스크롤 전용)
   */
  compensateLayout?: boolean;
  /** compensateLayout 시 높이 측정 대상 (접히기 전 형제 헤더 래퍼) */
  headerRef?: RefObject<HTMLElement | null>;
}

function applyCollapseFromScroll(scrollTop: number, lastScrollTop: number, collapsedRef: { current: boolean }) {
  const delta = scrollTop - lastScrollTop;

  if (scrollTop <= 0) {
    return false;
  }
  if (delta > SCROLL_DELTA_THRESHOLD && scrollTop > MIN_SCROLL_TO_HIDE) {
    return true;
  }
  if (delta < -SCROLL_DELTA_THRESHOLD) {
    return false;
  }
  return collapsedRef.current;
}

/** 스크롤 방향 — 아래로 내리면 헤더 접음, 위로 올리면 다시 노출 */
export function useScrollHeaderCollapse(
  scrollRootAttr: string,
  enabled: boolean,
  options?: UseScrollHeaderCollapseOptions,
) {
  const [collapsed, setCollapsed] = useState(false);
  const collapsedRef = useRef(false);
  const headerHeightRef = useRef(0);
  const prevCollapsedRef = useRef(false);
  const compensateLayout = options?.compensateLayout ?? false;
  const headerRef = options?.headerRef;
  const compensateLayoutRef = useRef(compensateLayout);
  const headerRefHolder = useRef(headerRef);
  compensateLayoutRef.current = compensateLayout;
  headerRefHolder.current = headerRef;

  collapsedRef.current = collapsed;

  useLayoutEffect(() => {
    if (!enabled || !compensateLayout || isMobileDocumentScrollMode() || !headerRef?.current) return;

    const el = headerRef.current;

    const measure = () => {
      if (!collapsed) {
        headerHeightRef.current = el.offsetHeight;
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [collapsed, compensateLayout, enabled, headerRef]);

  useLayoutEffect(() => {
    if (!enabled || !compensateLayout || isMobileDocumentScrollMode()) return;

    const scrollRoot = document.querySelector(`[${scrollRootAttr}]`);
    if (!(scrollRoot instanceof HTMLElement)) return;

    const wasCollapsed = prevCollapsedRef.current;
    const height = headerHeightRef.current;

    if (height > 0 && collapsed !== wasCollapsed) {
      if (collapsed) {
        scrollRoot.scrollTop += height;
      } else {
        scrollRoot.scrollTop = Math.max(0, scrollRoot.scrollTop - height);
      }
    }

    prevCollapsedRef.current = collapsed;
  }, [collapsed, compensateLayout, enabled, scrollRootAttr]);

  useEffect(() => {
    if (!enabled) {
      setCollapsed(false);
      prevCollapsedRef.current = false;
      return;
    }

    if (isMobileDocumentScrollMode()) {
      let lastScrollTop = getDocumentScrollTop();

      const onScroll = () => {
        const scrollTop = getDocumentScrollTop();
        const next = applyCollapseFromScroll(scrollTop, lastScrollTop, collapsedRef);
        if (compensateLayoutRef.current && headerRefHolder.current?.current && next && !collapsedRef.current) {
          headerHeightRef.current = headerRefHolder.current.current.offsetHeight;
        }
        setCollapsed(next);
        lastScrollTop = scrollTop;
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const scrollRoot = document.querySelector(`[${scrollRootAttr}]`);
    if (!(scrollRoot instanceof HTMLElement)) return;

    let lastScrollTop = scrollRoot.scrollTop;

    const onScroll = () => {
      const scrollTop = scrollRoot.scrollTop;
      const next = applyCollapseFromScroll(scrollTop, lastScrollTop, collapsedRef);
      if (compensateLayoutRef.current && headerRefHolder.current?.current && next && !collapsedRef.current) {
        headerHeightRef.current = headerRefHolder.current.current.offsetHeight;
      }
      setCollapsed(next);
      lastScrollTop = scrollTop;
    };

    scrollRoot.addEventListener("scroll", onScroll, { passive: true });
    return () => scrollRoot.removeEventListener("scroll", onScroll);
  }, [enabled, scrollRootAttr]);

  return collapsed;
}
