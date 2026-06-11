"use client";

import { useEffect, useState } from "react";
import {
  KEYBOARD_OPEN_THRESHOLD_PX,
  measureVisualViewportBottomInset,
} from "@/lib/visual-viewport-chrome";

/**
 * visualViewport 기준 키보드(또는 IME)로 가려진 하단 inset.
 * iOS·Android 소프트 키보드 위 액세서리 바 배치에 사용한다.
 */
export function useVisualKeyboardInset(threshold = KEYBOARD_OPEN_THRESHOLD_PX) {
  const [keyboardInset, setKeyboardInset] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => {
      const vv = window.visualViewport;
      if (!vv) {
        setKeyboardInset(0);
        setIsKeyboardOpen(false);
        return;
      }

      const inset = measureVisualViewportBottomInset(vv);
      setKeyboardInset(inset);
      setIsKeyboardOpen(inset >= threshold);
    };

    update();

    const vv = window.visualViewport;
    vv?.addEventListener("resize", update);
    vv?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("orientationchange", update);

    return () => {
      vv?.removeEventListener("resize", update);
      vv?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
      window.removeEventListener("orientationchange", update);
    };
  }, [threshold]);

  return { keyboardInset, isKeyboardOpen };
}
