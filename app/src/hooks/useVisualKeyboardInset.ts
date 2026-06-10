"use client";

import { useEffect, useState } from "react";

const KEYBOARD_OPEN_THRESHOLD_PX = 80;

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

      const inset = Math.max(0, Math.round(window.innerHeight - vv.offsetTop - vv.height));
      setKeyboardInset(inset);
      setIsKeyboardOpen(inset >= threshold);
    };

    update();

    const vv = window.visualViewport;
    vv?.addEventListener("resize", update);
    vv?.addEventListener("scroll", update);
    window.addEventListener("resize", update);

    return () => {
      vv?.removeEventListener("resize", update);
      vv?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [threshold]);

  return { keyboardInset, isKeyboardOpen };
}
