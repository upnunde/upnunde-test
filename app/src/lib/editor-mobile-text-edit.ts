"use client";

import { flushSync } from "react-dom";
import type { BlockType } from "@/types/editor";
import { useEditorStore } from "@/store/useEditorStore";

/** 모바일에서 「내용수정」 버튼으로만 키보드를 여는 블록 타입 */
export const MOBILE_KEYBOARD_EDITABLE_BLOCK_TYPES = [
  "text",
  "scene",
  "top_desc",
  "choice",
] as const satisfies readonly BlockType[];

export function isMobileKeyboardEditableBlock(type: BlockType): boolean {
  return (MOBILE_KEYBOARD_EDITABLE_BLOCK_TYPES as readonly BlockType[]).includes(type);
}

/** 「내용수정」 시 포커스할 입력란 (본문 탭 시 기억) */
let pendingMobileContentEditInput: HTMLElement | null = null;

function resolveTextInput(
  blockId: string,
  preferredInput?: HTMLElement | null,
): HTMLTextAreaElement | HTMLInputElement | null {
  const candidate =
    preferredInput ??
    pendingMobileContentEditInput ??
    document.getElementById(`block-${blockId}`)?.querySelector("textarea, input[type='text']");
  if (candidate instanceof HTMLTextAreaElement || candidate instanceof HTMLInputElement) {
    return candidate;
  }
  return null;
}

function applyTextInputFocus(input: HTMLTextAreaElement | HTMLInputElement) {
  input.focus({ preventScroll: false });
  const len = input.value.length;
  try {
    input.setSelectionRange(len, len);
  } catch {
    // type=text 외 input은 setSelectionRange 미지원
  }
}

/** 사용자 제스처 직후 동기 포커스 — 모바일 키보드 활성화용 */
function focusBlockTextInputSync(
  blockId: string,
  preferredInput?: HTMLElement | null,
): boolean {
  const input = resolveTextInput(blockId, preferredInput);
  if (!input || input.readOnly) return false;
  applyTextInputFocus(input);
  return document.activeElement === input;
}

function focusBlockTextInput(
  blockId: string,
  preferredInput?: HTMLElement | null,
  attempt = 0,
) {
  const input = resolveTextInput(blockId, preferredInput);
  if (!input) return;

  if (input.readOnly) {
    if (attempt < 24) {
      requestAnimationFrame(() => focusBlockTextInput(blockId, preferredInput, attempt + 1));
    }
    return;
  }

  applyTextInputFocus(input);
}

/** 본문 탭 — 「내용수정」 버튼만 노출 (키보드는 열지 않음) */
export function promptMobileBlockContentEdit(
  blockId: string,
  preferredInput?: HTMLElement | null,
) {
  const { setFocusBlockId, setMobileContentEditPromptBlockId, mobileKeyboardEditBlockId } =
    useEditorStore.getState();
  if (mobileKeyboardEditBlockId === blockId) return;
  if (preferredInput) pendingMobileContentEditInput = preferredInput;
  setFocusBlockId(blockId);
  setMobileContentEditPromptBlockId(blockId);
}

/** 하단 「내용수정」 — 키보드 편집 모드 진입 */
export function requestMobileBlockContentEdit(blockId: string) {
  const preferred = pendingMobileContentEditInput;
  pendingMobileContentEditInput = null;
  const {
    setFocusBlockId,
    setMobileKeyboardEditBlockId,
    setMobileContentEditPromptBlockId,
  } = useEditorStore.getState();

  const input = resolveTextInput(blockId, preferred);

  // 모바일 Safari: focus()는 사용자 제스처와 같은 턴에서 호출해야 키보드가 열림
  if (input) {
    input.readOnly = false;
  }

  flushSync(() => {
    setFocusBlockId(blockId);
    setMobileContentEditPromptBlockId(null);
    setMobileKeyboardEditBlockId(blockId);
  });

  if (input) {
    applyTextInputFocus(input);
  } else if (!focusBlockTextInputSync(blockId, preferred)) {
    requestAnimationFrame(() => focusBlockTextInput(blockId, preferred));
  }
}
