"use client";

import { EditorMobileIssueFloatingButton } from "@/components/editor/EditorMobileIssueFloatingButton";
import { EditorMobilePanelToggleFab } from "@/components/editor/EditorMobilePanelToggleFab";
import {
  EDITOR_MOBILE_FAB_BOTTOM_ABOVE_BLOCK_TOOLBAR_CLASS,
  EDITOR_MOBILE_FAB_BOTTOM_BASE_CLASS,
  EDITOR_MOBILE_FAB_RIGHT_CLASS,
  EDITOR_MOBILE_FAB_STACK_GAP_CLASS,
  isEditorMobileBlockToolbarVisible,
  type EditorMobilePanel,
} from "@/components/editor/editor-mobile-floating-layout";
import { useVisualKeyboardInset } from "@/hooks/useVisualKeyboardInset";
import { useClientMounted } from "@/hooks/useClientMounted";
import { useEditorStore } from "@/store/useEditorStore";
import { cn } from "@/lib/utils";

export interface EditorMobileFloatingActionsProps {
  active: EditorMobilePanel;
  onChange: (panel: EditorMobilePanel) => void;
  /** 미리보기 → 편집 전환 라벨. 기본 「편집」 */
  editTargetLabel?: string;
  /** 편집 모드 오류/누락 FAB 노출 */
  showIssueFab?: boolean;
  /** false면 블록 추가 툴바 없음 — FAB를 하단 우측에 고정 */
  hasBlockToolbar?: boolean;
}

/**
 * lg 미만 에디터 우측 하단 FAB 스택.
 * - 전환 FAB: 하단 고정
 * - 오류 FAB: 전환 FAB 위 gap-my-8(8px)
 */
export function EditorMobileFloatingActions({
  active,
  onChange,
  editTargetLabel = "편집",
  showIssueFab = false,
  hasBlockToolbar = true,
}: EditorMobileFloatingActionsProps) {
  const { isKeyboardOpen } = useVisualKeyboardInset();
  const mounted = useClientMounted();
  const isEdit = active === "edit";
  const focusBlockId = useEditorStore((s) => s.focusBlockId);
  const mobileKeyboardEditBlockId = useEditorStore((s) => s.mobileKeyboardEditBlockId);
  const toolbarVisible =
    mounted &&
    hasBlockToolbar &&
    isEdit &&
    isEditorMobileBlockToolbarVisible({
      focusBlockId,
      isKeyboardOpen,
      mobileKeyboardEditBlockId,
    });

  if (isEdit && isKeyboardOpen) {
    return null;
  }

  const bottomClass = toolbarVisible
    ? EDITOR_MOBILE_FAB_BOTTOM_ABOVE_BLOCK_TOOLBAR_CLASS
    : EDITOR_MOBILE_FAB_BOTTOM_BASE_CLASS;

  const handleToggle = () => {
    onChange(isEdit ? "preview" : "edit");
  };

  return (
    <div
      className={cn(
        "pointer-events-none fixed z-40 flex flex-col-reverse items-end lg:hidden",
        EDITOR_MOBILE_FAB_RIGHT_CLASS,
        EDITOR_MOBILE_FAB_STACK_GAP_CLASS,
        bottomClass,
      )}
      aria-hidden={false}
    >
      <EditorMobilePanelToggleFab
        active={active}
        onToggle={handleToggle}
        editTargetLabel={editTargetLabel}
        className="pointer-events-auto"
      />
      {showIssueFab && isEdit ? (
        <EditorMobileIssueFloatingButton className="pointer-events-auto" />
      ) : null}
    </div>
  );
}
