"use client";

import { useEffect, useState } from "react";
import {
  EDITOR_SCENE_HEADER_ID,
  EDITOR_SCROLL_ROOT_ATTR,
  resolveActiveSceneBlockIdFromScroll,
} from "@/lib/editor-scroll";

function findEditorScrollRoot(): HTMLElement | null {
  const root = document.querySelector(`[${EDITOR_SCROLL_ROOT_ATTR}]`);
  return root instanceof HTMLElement ? root : null;
}

/**
 * 에디터 본문 스크롤 위치 기준 활성 장면 id.
 * 장면 탭·사이드바 하이라이트를 현재 뷰포트에 보이는 장면과 동기화한다.
 */
export function useEditorScrollActiveSceneId(sceneIds: string[], enabled = true) {
  const [activeSceneId, setActiveSceneId] = useState<string | null>(() => sceneIds[0] ?? null);
  const sceneIdsKey = sceneIds.join("\0");

  useEffect(() => {
    if (!enabled) {
      setActiveSceneId(sceneIds[0] ?? null);
      return;
    }

    if (sceneIds.length === 0) {
      setActiveSceneId(null);
      return;
    }

    let disposed = false;
    let scrollRoot: HTMLElement | null = null;
    let retryTimer: ReturnType<typeof setInterval> | null = null;
    let cleanup: (() => void) | null = null;

    const update = () => {
      if (!scrollRoot) return;
      const next = resolveActiveSceneBlockIdFromScroll(sceneIds, scrollRoot);
      setActiveSceneId((prev) => (prev === next ? prev : next));
    };

    const setup = (root: HTMLElement) => {
      cleanup?.();
      scrollRoot = root;

      update();

      const onLayoutChange = () => update();
      root.addEventListener("scroll", onLayoutChange, { passive: true });
      window.addEventListener("resize", onLayoutChange);

      const viewport = window.visualViewport;
      viewport?.addEventListener("resize", onLayoutChange);
      viewport?.addEventListener("scroll", onLayoutChange);

      const observer = new ResizeObserver(onLayoutChange);
      observer.observe(root);
      const sceneHeader = document.getElementById(EDITOR_SCENE_HEADER_ID);
      if (sceneHeader) observer.observe(sceneHeader);
      for (const sceneId of sceneIds) {
        const el = document.getElementById(`block-${sceneId}`);
        if (el) observer.observe(el);
      }

      cleanup = () => {
        root.removeEventListener("scroll", onLayoutChange);
        window.removeEventListener("resize", onLayoutChange);
        viewport?.removeEventListener("resize", onLayoutChange);
        viewport?.removeEventListener("scroll", onLayoutChange);
        observer.disconnect();
        scrollRoot = null;
      };
    };

    const root = findEditorScrollRoot();
    if (root) {
      setup(root);
    } else {
      setActiveSceneId(sceneIds[0] ?? null);
      retryTimer = setInterval(() => {
        if (disposed) return;
        const nextRoot = findEditorScrollRoot();
        if (!nextRoot) return;
        if (retryTimer) clearInterval(retryTimer);
        retryTimer = null;
        setup(nextRoot);
      }, 100);
    }

    return () => {
      disposed = true;
      if (retryTimer) clearInterval(retryTimer);
      cleanup?.();
    };
  }, [enabled, sceneIds, sceneIdsKey]);

  return activeSceneId;
}
