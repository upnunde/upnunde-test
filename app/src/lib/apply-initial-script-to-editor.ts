import { parseScriptToBlocks } from "@/utils/scriptParser";
import { INITIAL_SCRIPT } from "@/lib/initialScript";
import { createBlock, useEditorStore } from "@/store/useEditorStore";

/** 에피소드 생성기「생성하기」— 에디터 반영 전 오버레이 표시 시간 */
export const EPISODE_APPLY_TO_EDITOR_DELAY_MS = 2000;

export const EPISODE_APPLY_TO_EDITOR_LOADING_STEPS = [
  "대본을 에디터 블록으로 변환하고 있어요",
  "장면과 대사를 배치하고 있어요",
  "에디터에 반영하고 있어요",
] as const;

/** 에피소드 생성기「생성하기」— 샘플 대본(INITIAL_SCRIPT)을 에디터 블록에 반영 */
export function applyInitialScriptToEditor(): void {
  const parsed = parseScriptToBlocks(INITIAL_SCRIPT);
  const nextBlocks =
    parsed.length > 0 ? parsed : [createBlock("text", "")];

  useEditorStore.setState({
    blocks: nextBlocks,
    rawScript: INITIAL_SCRIPT,
    scriptHistory: [],
    undoStack: [],
    redoStack: [],
    focusBlockId: null,
    mobileKeyboardEditBlockId: null,
    mobileContentEditPromptBlockId: null,
    mobileFocusChoiceIndex: null,
    issueFocus: null,
  });
}
