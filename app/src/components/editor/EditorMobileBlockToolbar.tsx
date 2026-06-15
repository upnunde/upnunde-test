"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { SlashCommandMenu, type SlashSelectPayload } from "@/components/editor/SlashCommandMenu";
import { Button } from "@/components/ui/button";
import {
  EDITOR_MOBILE_DOCKED_TOOLBAR_SHELL_CLASS,
  EDITOR_MOBILE_KEYBOARD_TOOLBAR_SHELL_CLASS,
  isEditorMobileBlockToolbarVisible,
} from "@/components/editor/editor-mobile-floating-layout";
import { useVisualKeyboardInset } from "@/hooks/useVisualKeyboardInset";
import { useClientMounted } from "@/hooks/useClientMounted";
import {
  isMobileKeyboardEditableBlock,
  requestMobileBlockContentEdit,
} from "@/lib/editor-mobile-text-edit";
import { useEditorStore } from "@/store/useEditorStore";
import { useToast } from "@/store/useToastStore";
import type { BlockType } from "@/types/editor";
import { cn } from "@/lib/utils";

/**
 * 모바일 편집 — 하이브리드 블록 액션 바.
 * - 키보드 닫힘: 뷰포트 하단 고정 도킹 툴바
 * - 키보드 열림: visualViewport 기준 키보드 바로 위 액세서리(Notion식)
 */
export function EditorMobileBlockToolbar({ className }: { className?: string }) {
  const focusBlockId = useEditorStore((s) => s.focusBlockId);
  const mobileKeyboardEditBlockId = useEditorStore((s) => s.mobileKeyboardEditBlockId);
  const setMobileKeyboardEditBlockId = useEditorStore((s) => s.setMobileKeyboardEditBlockId);
  const mobileContentEditPromptBlockId = useEditorStore((s) => s.mobileContentEditPromptBlockId);
  const setMobileContentEditPromptBlockId = useEditorStore((s) => s.setMobileContentEditPromptBlockId);
  const blocks = useEditorStore((s) => s.blocks);
  const addBlock = useEditorStore((s) => s.addBlock);
  const removeBlock = useEditorStore((s) => s.removeBlock);
  const setFocusBlockId = useEditorStore((s) => s.setFocusBlockId);
  const undo = useEditorStore((s) => s.undo);

  const { toast } = useToast();
  const { isKeyboardOpen } = useVisualKeyboardInset();
  const [menuOpen, setMenuOpen] = useState(false);
  const mounted = useClientMounted();

  const focusedIndex = useMemo(
    () => (focusBlockId ? blocks.findIndex((b) => b.id === focusBlockId) : -1),
    [blocks, focusBlockId],
  );
  const focusedBlock = focusedIndex >= 0 ? blocks[focusedIndex] : null;
  const canDelete = focusedBlock != null && focusedBlock.data?.isSeedDefault !== true;
  const canEditContent =
    focusedBlock != null && isMobileKeyboardEditableBlock(focusedBlock.type);
  const isEditingContent = mobileKeyboardEditBlockId === focusBlockId;
  const showContentEditButton =
    !isKeyboardOpen && canEditContent && focusBlockId != null && !isEditingContent;
  const showToolbar = isEditorMobileBlockToolbarVisible({
    focusBlockId,
    isKeyboardOpen,
    mobileKeyboardEditBlockId,
  });

  const wasKeyboardOpenRef = useRef(isKeyboardOpen);
  useEffect(() => {
    const wasOpen = wasKeyboardOpenRef.current;
    wasKeyboardOpenRef.current = isKeyboardOpen;

    // 키보드가 닫힐 때만 편집 모드 해제 (열리기 전에는 mobileKeyboardEditBlockId 유지)
    if (wasOpen && !isKeyboardOpen && mobileKeyboardEditBlockId) {
      setMobileKeyboardEditBlockId(null);
      setMobileContentEditPromptBlockId(null);
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  }, [isKeyboardOpen, mobileKeyboardEditBlockId, setMobileContentEditPromptBlockId, setMobileKeyboardEditBlockId]);

  const handleInsert = useCallback(
    (payload: SlashSelectPayload) => {
      setMenuOpen(false);
      if (focusedIndex < 0) return;

      const insertAt = focusedIndex + 1;

      if (typeof payload === "object" && "action" in payload && payload.action === "add_sentence") {
        const newId = addBlock(insertAt, "text");
        if (newId) setFocusBlockId(newId);
        return;
      }

      const hasDefaultPayload = typeof payload === "object" && "content" in payload;
      const shouldKeepAutoOpenedModal =
        hasDefaultPayload && payload.data?.isNew === true;
      const newId = hasDefaultPayload
        ? addBlock(insertAt, payload.type, payload.content, payload.data)
        : addBlock(insertAt, payload as BlockType);
      if (newId && !shouldKeepAutoOpenedModal) {
        setFocusBlockId(newId);
      }
    },
    [addBlock, focusedIndex, setFocusBlockId],
  );

  const handleDelete = useCallback(() => {
    if (!focusBlockId || !canDelete) return;
    removeBlock(focusBlockId);
    toast({
      message: "블록을 삭제했어요",
      variant: "withAction",
      actionLabel: "실행 취소",
      onAction: () => undo(),
    });
  }, [canDelete, focusBlockId, removeBlock, toast, undo]);

  const handleContentEdit = useCallback(() => {
    if (!focusBlockId || !canEditContent || isEditingContent) return;
    requestMobileBlockContentEdit(focusBlockId);
  }, [canEditContent, focusBlockId, isEditingContent]);

  const toolbarButtons = (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn(
          "gap-my-8 bg-white shadow-none",
          isKeyboardOpen ? "h-11 w-11 shrink-0 p-0" : "h-10 flex-1",
        )}
        disabled={focusedIndex < 0}
        onClick={() => setMenuOpen(true)}
        aria-label="블록 추가"
      >
        <Plus className="h-4 w-4 shrink-0" aria-hidden />
        {!isKeyboardOpen ? "블록 추가" : null}
      </Button>
      {!isKeyboardOpen && showContentEditButton ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-10 flex-1 gap-my-8 bg-white shadow-none"
          onClick={handleContentEdit}
          aria-label="내용 수정"
        >
          <Pencil className="h-4 w-4 shrink-0" aria-hidden />
          내용수정
        </Button>
      ) : null}
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-10 w-10 shrink-0 bg-white shadow-none text-on-surface-30 lg:hover:bg-red-50 lg:hover:text-red-600 disabled:border-border-20"
        disabled={!canDelete}
        onClick={handleDelete}
        aria-label="블록 삭제"
      >
        <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
      </Button>
    </>
  );

  const toolbarLayer =
    mounted && showToolbar && typeof document !== "undefined"
      ? createPortal(
          <div
            className={cn(
              isKeyboardOpen
                ? EDITOR_MOBILE_KEYBOARD_TOOLBAR_SHELL_CLASS
                : EDITOR_MOBILE_DOCKED_TOOLBAR_SHELL_CLASS,
              className,
            )}
            role="toolbar"
            aria-label="블록 편집"
          >
            <div
              className={cn(
                "flex items-center gap-my-8",
                isKeyboardOpen && "justify-between",
              )}
            >
              {toolbarButtons}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      {toolbarLayer}

      {menuOpen ? (
        <SlashCommandMenu
          position={{ top: 0, left: 0 }}
          presentation="sheet"
          onSelect={handleInsert}
          onClose={() => setMenuOpen(false)}
        />
      ) : null}
    </>
  );
}
