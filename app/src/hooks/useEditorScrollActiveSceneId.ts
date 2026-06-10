"use client";

import { useEffect, useState } from "react";
import {
  EDITOR_SCENE_HEADER_ID,
  EDITOR_SCROLL_ROOT_ATTR,
  resolveActiveSceneBlockIdFromScroll,
} from "@/lib/editor-scroll";

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

    const scrollRoot = document.querySelector(`[${EDITOR_SCROLL_ROOT_ATTR}]`);
    if (!(scrollRoot instanceof HTMLElement)) {
      setActiveSceneId(sceneIds[0] ?? null);
      return;
    }

    const update = () => {
      const next = resolveActiveSceneBlockIdFromScroll(sceneIds, scrollRoot);
      setActiveSceneId((prev) => (prev === next ? prev : next));
    };

    update();

    scrollRoot.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    const viewport = window.visualViewport;
    viewport?.addEventListener("resize", update);
    viewport?.addEventListener("scroll", update);

    const observer = new ResizeObserver(update);
    observer.observe(scrollRoot);
    const sceneHeader = document.getElementById(EDITOR_SCENE_HEADER_ID);
    if (sceneHeader) observer.observe(sceneHeader);
    for (const sceneId of sceneIds) {
      const el = document.getElementById(`block-${sceneId}`);
      if (el) observer.observe(el);
    }

    return () => {
      scrollRoot.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      viewport?.removeEventListener("resize", update);
      viewport?.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [enabled, sceneIds, sceneIdsKey]);

  return activeSceneId;
}
