"use client";

import { useCallback, useEffect, type RefObject } from "react";
import { useIsLgUp } from "@/hooks/useMediaQuery";
import { promptMobileBlockContentEdit } from "@/lib/editor-mobile-text-edit";
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
  const mobileKeyboardEditBlockId = useEditorStore((s) => s.mobileKeyboardEditBlockId);

  const isKeyboardEditable = isDesktop || mobileKeyboardEditBlockId === blockId;

  const onContentFocus = useCallback(
    (e: React.FocusEvent<TextInputElement>) => {
      if (isDesktop || mobileKeyboardEditBlockId === blockId) {
        setFocusBlockId(blockId);
        return;
      }
      promptMobileBlockContentEdit(blockId, e.currentTarget);
      e.currentTarget.blur();
    },
    [blockId, isDesktop, mobileKeyboardEditBlockId, setFocusBlockId],
  );

  const onContentPointerDown = useCallback(
    (e: React.PointerEvent<TextInputElement>) => {
      if (isDesktop || mobileKeyboardEditBlockId === blockId) return;
      promptMobileBlockContentEdit(blockId, e.currentTarget);
      e.preventDefault();
    },
    [blockId, isDesktop, mobileKeyboardEditBlockId],
  );

  const onContentAreaPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (isDesktop || mobileKeyboardEditBlockId === blockId) return;
      if (e.target !== e.currentTarget) return;
      promptMobileBlockContentEdit(blockId, inputRef.current);
      e.preventDefault();
    },
    [blockId, isDesktop, mobileKeyboardEditBlockId, inputRef],
  );

  useEffect(() => {
    if (isDesktop || mobileKeyboardEditBlockId !== blockId) return;

    let cancelled = false;
    const focusInput = (attempt = 0) => {
      if (cancelled) return;
      const el = inputRef.current;
      if (!el) {
        if (attempt < 12) requestAnimationFrame(() => focusInput(attempt + 1));
        return;
      }
      if (el.readOnly) {
        if (attempt < 12) requestAnimationFrame(() => focusInput(attempt + 1));
        return;
      }
      el.focus({ preventScroll: false });
      const len = el.value.length;
      try {
        el.setSelectionRange(len, len);
      } catch {
        // setSelectionRange 미지원 input
      }
    };

    requestAnimationFrame(() => requestAnimationFrame(() => focusInput()));

    return () => {
      cancelled = true;
    };
  }, [blockId, isDesktop, mobileKeyboardEditBlockId, inputRef]);

  return {
    readOnly: !isKeyboardEditable,
    onContentFocus,
    onContentPointerDown,
    onContentAreaPointerDown,
  };
}
