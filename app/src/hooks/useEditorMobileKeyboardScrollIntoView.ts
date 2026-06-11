"use client";

import { useEffect } from "react";
import { scrollMobileEditorInputIntoView } from "@/lib/editor-scroll";
import { useVisualKeyboardInset } from "@/hooks/useVisualKeyboardInset";
import { useEditorStore } from "@/store/useEditorStore";

/**
 * 모바일 키보드 편집 시 활성 입력란을 visualViewport 안으로 스크롤한다.
 * 서브헤더 sticky·키보드 inset 변화로 caret이 가려지는 현상을 줄인다.
 */
export function useEditorMobileKeyboardScrollIntoView(enabled: boolean) {
  const mobileKeyboardEditBlockId = useEditorStore((s) => s.mobileKeyboardEditBlockId);
  const { isKeyboardOpen } = useVisualKeyboardInset();

  useEffect(() => {
    if (!enabled || !isKeyboardOpen || !mobileKeyboardEditBlockId) return;

    const scrollActiveInput = () => {
      const block = document.getElementById(`block-${mobileKeyboardEditBlockId}`);
      const input = block?.querySelector("textarea, input[type='text']");
      if (input instanceof HTMLElement) {
        scrollMobileEditorInputIntoView(input);
      }
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(scrollActiveInput);
    });
  }, [enabled, isKeyboardOpen, mobileKeyboardEditBlockId]);
}
