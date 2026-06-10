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

/** 하단 「내용수정」 — 키보드 편집 모드 진입 */
export function requestMobileBlockContentEdit(blockId: string) {
  const { setFocusBlockId, setMobileKeyboardEditBlockId } = useEditorStore.getState();
  setFocusBlockId(blockId);
  setMobileKeyboardEditBlockId(blockId);
}
