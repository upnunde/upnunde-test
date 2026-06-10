"use client";

import { useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Plus, Trash2 } from "lucide-react";
import { SlashCommandMenu, type SlashSelectPayload } from "@/components/editor/SlashCommandMenu";
import { Button } from "@/components/ui/button";
import { useVisualKeyboardInset } from "@/hooks/useVisualKeyboardInset";
import { useEditorMobileSceneHeaderCollapse } from "@/hooks/useEditorMobileSceneHeaderCollapse";
import { useEditorStore } from "@/store/useEditorStore";
import { useToast } from "@/store/useToastStore";
import type { BlockType } from "@/types/editor";
import { cn } from "@/lib/utils";

/**
 * 모바일 편집 — 하이브리드 블록 액션 바.
 * - 키보드 닫힘: 워크스페이스 하단 도킹 툴바
 * - 키보드 열림: visualViewport 기준 키보드 바로 위 액세서리(Notion식)
 */
export function EditorMobileBlockToolbar({ className }: { className?: string }) {
  const focusBlockId = useEditorStore((s) => s.focusBlockId);
  const blocks = useEditorStore((s) => s.blocks);
  const addBlock = useEditorStore((s) => s.addBlock);
  const removeBlock = useEditorStore((s) => s.removeBlock);
  const setFocusBlockId = useEditorStore((s) => s.setFocusBlockId);
  const undo = useEditorStore((s) => s.undo);

  const { toast } = useToast();
  const { keyboardInset, isKeyboardOpen } = useVisualKeyboardInset();
  const [menuOpen, setMenuOpen] = useState(false);
  // 장면 탭 숨김과 동일한 스크롤 방향 감지 — 아래로 스크롤 시 도킹 툴바 숨김
  const scrollCollapsed = useEditorMobileSceneHeaderCollapse(!isKeyboardOpen);

  const focusedIndex = useMemo(
    () => (focusBlockId ? blocks.findIndex((b) => b.id === focusBlockId) : -1),
    [blocks, focusBlockId],
  );
  const focusedBlock = focusedIndex >= 0 ? blocks[focusedIndex] : null;
  const canDelete = focusedBlock != null && focusedBlock.data?.isSeedDefault !== true;

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

  const keyboardAccessory =
    typeof document !== "undefined"
      ? createPortal(
          <div
            className="fixed inset-x-0 z-40 border-t border-border-10 bg-white px-my-12 py-my-8 lg:hidden"
            style={{ bottom: keyboardInset }}
            role="toolbar"
            aria-label="블록 편집"
          >
            <div className="flex items-center justify-between gap-my-8">{toolbarButtons}</div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      {!isKeyboardOpen ? (
        <div
          className={cn(
            "shrink-0 overflow-hidden transition-[max-height] duration-200 ease-out lg:hidden",
            scrollCollapsed ? "max-h-0" : "max-h-16",
          )}
        >
          <div
            className={cn(
              "border-t border-border-10 bg-white px-my-12 py-my-8 transition-transform duration-200 ease-out",
              scrollCollapsed && "translate-y-full",
              className,
            )}
            role="toolbar"
            aria-label="블록 편집"
          >
            <div className="flex items-center gap-my-8">{toolbarButtons}</div>
          </div>
        </div>
      ) : (
        keyboardAccessory
      )}

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
