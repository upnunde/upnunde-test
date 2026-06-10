"use client";

import { useCallback, useEffect, type RefObject } from "react";
import { useIsLgUp } from "@/hooks/useMediaQuery";
import { useEditorStore } from "@/store/useEditorStore";

type TextInputElement = HTMLTextAreaElement | HTMLInputElement;

/**
 * 모바일: 블록 선택만 하고 키보드는 「내용수정」으로 연다.
 * 데스크톱: 기존처럼 포커스 시 바로 입력 가능.
 */
export function useMobileBlockTextEdit(
  blockId: string,
  inputRef: RefObject<TextInputElement | null>,
) {
  const isDesktop = useIsLgUp();
  const setFocusBlockId = useEditorStore((s) => s.setFocusBlockId);
  const setMobileContentEditPromptBlockId = useEditorStore((s) => s.setMobileContentEditPromptBlockId);
  const mobileKeyboardEditBlockId = useEditorStore((s) => s.mobileKeyboardEditBlockId);

  const isKeyboardEditable = isDesktop || mobileKeyboardEditBlockId === blockId;

  const onContentFocus = useCallback(
    (e: React.FocusEvent<TextInputElement>) => {
      setFocusBlockId(blockId);
      if (!isDesktop && mobileKeyboardEditBlockId !== blockId) {
        setMobileContentEditPromptBlockId(blockId);
        e.currentTarget.blur();
      }
    },
    [
      blockId,
      isDesktop,
      mobileKeyboardEditBlockId,
      setFocusBlockId,
      setMobileContentEditPromptBlockId,
    ],
  );

  useEffect(() => {
    if (isDesktop || mobileKeyboardEditBlockId !== blockId) return;

    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus({ preventScroll: false });
      const len = el.value.length;
      el.setSelectionRange(len, len);
    });
  }, [blockId, isDesktop, mobileKeyboardEditBlockId, inputRef]);

  return {
    readOnly: !isKeyboardEditable,
    onContentFocus,
  };
}
