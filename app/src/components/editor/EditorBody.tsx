"use client";

import React, { useEffect, useCallback, Fragment, useState } from "react";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEditorStore, hydrateSeriesPersonaFromSession } from "@/store/useEditorStore";
import { EDITOR_BLOCK_INDEX_COLUMN_CLASS } from "@/lib/editor-block-layout";
import { scrollMobileEditorInputIntoView } from "@/lib/editor-scroll";
import { isMobileDocumentScrollMode } from "@/lib/mobile-document-scroll";
import { editorLeadingControlsClass, editorRowHoverClass } from "@/lib/editor-control-visibility";
import { useIsLgUp } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ScriptBlock } from "./ScriptBlock";
import { SlashCommandMenu, type SlashSelectPayload } from "./SlashCommandMenu";
import type { BlockType, ScriptBlockData } from "@/types/editor";

const WRAPPER_CLASS_TEXT = cn(
  "group group/row relative flex h-fit w-full min-h-9 items-start justify-start gap-0 rounded bg-white py-my-4 outline-none focus-within:bg-white",
  editorRowHoverClass(),
);
const ROOT_CLASS_TEXT = "min-h-8 min-w-0 flex-1 h-fit";

/** 선택지 블록: 텍스트 행과 동일 래퍼( min-h-9·py-1·bg-white·rounded·group/row ) */
const WRAPPER_CLASS_CHOICE = cn(
  "group group/row relative flex h-fit w-full min-h-9 items-start justify-start gap-0 rounded bg-white py-my-4 outline-none focus-within:bg-white",
  editorRowHoverClass(),
);
const ROOT_CLASS_CHOICE = "min-h-8 min-w-0 flex-1 h-fit";

/** 한 줄 블록 (캐릭터/연출/배경 등): 고정 높이 32px(h-8), px-0 py-1 */
const WRAPPER_CLASS_COMPACT = cn(
  "group flex h-fit min-h-9 items-center justify-start gap-0 rounded-lg py-my-4",
  editorRowHoverClass(),
);
const ROOT_CLASS_COMPACT = "min-w-0 flex-1 min-h-8 h-8";

/** 장면·장면정보 — 긴 제목 줄바꿈 허용 */
const WRAPPER_CLASS_WRAP = cn(
  "group flex h-fit min-h-9 items-start justify-start gap-0 rounded-lg py-my-4 outline-none focus-within:bg-white",
  editorRowHoverClass(),
);
const ROOT_CLASS_WRAP = "min-w-0 flex-1 min-h-8 h-auto self-start";

function isWrapCompactBlock(type: import("@/types/editor").BlockType) {
  return type === "scene" || type === "top_desc";
}

function SortableBlockWrapper({
  block,
  index,
  hasIssue,
  updateBlock,
  addBlock,
  removeBlock,
  focusBlock,
  isDesktop,
}: {
  block: import("@/types/editor").ScriptBlock;
  index: number;
  hasIssue: boolean;
  updateBlock: (id: string, content: string, data?: ScriptBlockData) => void;
  addBlock: (
    index: number,
    type: import("@/types/editor").BlockType,
    content?: string,
    data?: ScriptBlockData,
  ) => string;
  removeBlock: (id: string) => void;
  focusBlock: (id: string) => void;
  isDesktop: boolean;
}) {
  const focusBlockId = useEditorStore((s) => s.focusBlockId);
  const isFocused = focusBlockId === block.id;
  const isSeedDefault = block.data?.isSeedDefault === true;
  const isTextLikeRow = block.type === "text" || block.type === "choice";
  const isWrapRow = isWrapCompactBlock(block.type);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id, disabled: isSeedDefault });

  const mobileIndexDragProps =
    !isDesktop && !isSeedDefault ? { ...attributes, ...listeners } : undefined;
  const desktopHandleDragProps =
    isDesktop && !isSeedDefault ? { ...attributes, ...listeners } : undefined;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [insertMenuPosition, setInsertMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const handleAddButtonClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setInsertMenuPosition({
      top: rect.bottom + 4,
      left: rect.left,
    });
  }, []);

  const handleInsertMenuSelect = useCallback(
    (payload: SlashSelectPayload) => {
      setInsertMenuPosition(null);
      if (typeof payload === "object" && "action" in payload && payload.action === "add_sentence") {
        const newBlockId = addBlock(index, "text");
        if (newBlockId) focusBlock(newBlockId);
        return;
      }
      const hasDefaultPayload = typeof payload === "object" && "content" in payload;
      const shouldKeepAutoOpenedModal =
        hasDefaultPayload && payload.data?.isNew === true;
      const newBlockId = hasDefaultPayload
        ? addBlock(index, payload.type, payload.content, payload.data)
        : addBlock(index, payload as BlockType);
      if (newBlockId && !shouldKeepAutoOpenedModal) {
        focusBlock(newBlockId);
      }
    },
    [addBlock, focusBlock, index],
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      id={`block-${block.id}`}
      data-block-id={block.id}
      className={cn(
        block.type === "text"
          ? WRAPPER_CLASS_TEXT
          : block.type === "choice"
            ? WRAPPER_CLASS_CHOICE
            : isWrapRow
              ? WRAPPER_CLASS_WRAP
              : WRAPPER_CLASS_COMPACT,
        isDragging && "opacity-50",
      )}
    >
      <div className={cn(editorLeadingControlsClass(), isWrapRow && "self-start")}>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-6 shrink-0 rounded-full p-0 text-on-surface-30 hover:bg-surface-20 hover:text-on-surface-30"
          aria-label="Add block below"
          aria-expanded={insertMenuPosition !== null}
          aria-haspopup="listbox"
          onClick={handleAddButtonClick}
        >
          <Plus className="size-5" />
        </Button>
        {!isSeedDefault ? (
          <button
            type="button"
            className="flex h-8 w-6 shrink-0 cursor-grab touch-none items-center justify-center rounded-full p-0 text-on-surface-30 hover:bg-surface-20 hover:text-on-surface-30 active:cursor-grabbing"
            aria-label="Drag to reorder"
            {...desktopHandleDragProps}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <circle cx="8" cy="6" r="2" />
              <circle cx="8" cy="12" r="2" />
              <circle cx="8" cy="18" r="2" />
              <circle cx="16" cy="6" r="2" />
              <circle cx="16" cy="12" r="2" />
              <circle cx="16" cy="18" r="2" />
            </svg>
          </button>
        ) : (
          <div className="h-8 w-6 shrink-0" aria-hidden />
        )}
      </div>
      <span
        {...mobileIndexDragProps}
        className={cn(
          "flex justify-start tabular-nums",
          EDITOR_BLOCK_INDEX_COLUMN_CLASS,
          isTextLikeRow
            ? "min-h-8 items-center text-caption1_500"
            : isWrapRow
              ? "h-8 shrink-0 self-start items-center py-0 text-body4_500"
              : "h-8 items-center py-0 text-body4_500",
          isFocused
            ? "text-primary"
            : hasIssue
              ? "text-rose-600"
              : isTextLikeRow
                ? "text-on-surface-disabled"
                : "text-on-surface-disabled",
          !isDesktop && !isSeedDefault && "max-lg:touch-none",
        )}
        aria-label={!isDesktop && !isSeedDefault ? "길게 눌러 순서 변경" : undefined}
      >
        {String(index).padStart(2, "0")}
      </span>
      <ScriptBlock
        block={block}
        index={index}
        updateBlock={updateBlock}
        addBlock={addBlock}
        removeBlock={removeBlock}
        focusBlock={focusBlock}
        hideIndex
        rootClassName={
          block.type === "text"
            ? ROOT_CLASS_TEXT
            : block.type === "choice"
              ? ROOT_CLASS_CHOICE
              : isWrapRow
                ? ROOT_CLASS_WRAP
                : ROOT_CLASS_COMPACT
        }
      />
      {insertMenuPosition ? (
        <SlashCommandMenu
          position={insertMenuPosition}
          presentation={isDesktop ? "popover" : "sheet"}
          onSelect={handleInsertMenuSelect}
          onClose={() => setInsertMenuPosition(null)}
        />
      ) : null}
    </div>
  );
}

export default function EditorBody() {
  const isDesktop = useIsLgUp();
  const blocks = useEditorStore((s) => s.blocks);
  const setFocusBlockId = useEditorStore((s) => s.setFocusBlockId);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const addBlock = useEditorStore((s) => s.addBlock);
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const removeBlock = useEditorStore((s) => s.removeBlock);
  const reorderBlocks = useEditorStore((s) => s.reorderBlocks);

  useEffect(() => {
    hydrateSeriesPersonaFromSession();
  }, []);

  // Cmd+Z / Ctrl+Z: undo, Shift+Cmd+Z / Ctrl+Y: redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (!isMod || e.key !== "z") {
        if (!isMod || e.key !== "y") return;
        // Ctrl+Y = redo (Windows/Linux)
        e.preventDefault();
        redo();
        return;
      }
      if (e.shiftKey) {
        e.preventDefault();
        redo();
      } else {
        e.preventDefault();
        undo();
      }
    };
    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [undo, redo]);

  const focusBlock = useCallback(
    (id: string) => {
      setFocusBlockId(id);
      const mobileKeyboardEditBlockId = useEditorStore.getState().mobileKeyboardEditBlockId;
      const shouldFocusInput = isDesktop || mobileKeyboardEditBlockId === id;

      // Focus next/previous block: run after state + DOM update so the target block is in the tree.
      // Double rAF ensures React has committed and focus reliably moves (fixes arrow-key focus stuck on previous block).
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = document.getElementById(`block-${id}`);
          if (!el) return;

          // 방향키 이동 시: 포커스된 블록이 "포커스 뷰포트" 밖일 때만 최소한으로 스크롤.
          // - 포커스 뷰포트: 에디터 컨테이너 상/하단에서 10% 안쪽으로 들어온 내부 영역
          // - 위로 갈 때: 이 내부 영역의 상단선을 기준으로 따라감
          // - 아래로 갈 때: 이 내부 영역의 하단선을 기준으로 따라감 (최하단에서 따라가기)
          const editorContainer = el.closest(".overflow-y-auto");
          if (editorContainer && editorContainer instanceof HTMLElement) {
            const containerRect = editorContainer.getBoundingClientRect();
            const elementRect = el.getBoundingClientRect();
            const margin = containerRect.height * 0.1; // 상/하 10% 마진
            const innerTop = containerRect.top + margin;
            const innerBottom = containerRect.bottom - margin;

            const topInView = elementRect.top >= innerTop;
            const bottomInView = elementRect.bottom <= innerBottom;
            if (!topInView) {
              // 요소가 상단 마진 위로 나감 → 스크롤해서 요소 상단이 내부 상단선(innerTop)에 오도록
              const delta = elementRect.top - innerTop;
              editorContainer.scrollTo({ top: Math.max(0, editorContainer.scrollTop + delta), behavior: "auto" });
            } else if (!bottomInView) {
              // 요소가 하단 마진 아래로 나감 → 스크롤해서 요소 하단이 내부 하단선(innerBottom)에 오도록 (최하단 따라가기)
              const delta = elementRect.bottom - innerBottom;
              editorContainer.scrollTo({ top: editorContainer.scrollTop + delta, behavior: "auto" });
            }
            // 이미 뷰포트 안에 있으면 스크롤 위치 변경 없음
          } else if (isMobileDocumentScrollMode() && shouldFocusInput) {
            const input = el.querySelector("textarea, input[type='text']");
            if (input instanceof HTMLElement) {
              scrollMobileEditorInputIntoView(input);
            }
          }

          // Priority: textarea > input > button (for picker) > div with tabIndex (root).
          // Exclude toolbar buttons (Add, Drag, Delete) so we focus the block's real input, not the row toolbar.
          const textarea = el.querySelector("textarea");
          const input = el.querySelector("input");
          const pickerButton = el.querySelector(
            "button[type='button']:not([aria-label='Delete block']):not([aria-label='Drag to reorder']):not([aria-label='Add block below'])"
          );
          // For root div with tabIndex, find div elements (not button) with tabIndex="0"
          const rootDivs = Array.from(el.querySelectorAll<HTMLElement>("div[tabindex='0']"));
          const rootDiv = rootDivs.find(div =>
            div !== el &&
            !div.querySelector("textarea, input") &&
            div.classList.contains("group")
          ) ?? rootDivs[0];

          const focusable = shouldFocusInput
            ? (textarea ?? input ?? pickerButton ?? rootDiv)
            : (rootDiv ?? pickerButton);

          if (focusable && typeof (focusable as HTMLElement).focus === "function") {
            (focusable as HTMLElement).focus();
            if (textarea && textarea instanceof HTMLTextAreaElement && shouldFocusInput) {
              const textLength = textarea.value.length;
              textarea.setSelectionRange(textLength, textLength);
              if (isMobileDocumentScrollMode()) {
                scrollMobileEditorInputIntoView(textarea);
              }
            }
            if (input && input instanceof HTMLInputElement && shouldFocusInput) {
              const textLength = input.value.length;
              input.setSelectionRange(textLength, textLength);
              if (isMobileDocumentScrollMode()) {
                scrollMobileEditorInputIntoView(input);
              }
            }
            setTimeout(() => {
              const focusEvent = new FocusEvent("focus", { bubbles: true, cancelable: true });
              focusable.dispatchEvent(focusEvent);
            }, 0);
          }
        });
      });
    },
    [isDesktop, setFocusBlockId],
  );

  const handleBackgroundClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) return;
      // 빈 줄(블록 사이 갭) 클릭으로는 이동/생성이 일어나지 않도록,
      // 마지막 블록 "아래 영역"을 클릭한 경우에만 기존 동작을 허용한다.
      const lastBlock = blocks[blocks.length - 1];
      if (!lastBlock) return;
      const lastBlockEl = document.getElementById(`block-${lastBlock.id}`);
      if (!lastBlockEl) return;

      const clickY = e.clientY;
      const lastBottom = lastBlockEl.getBoundingClientRect().bottom;
      if (clickY <= lastBottom) return;

      if (lastBlock?.type === "text" && !lastBlock.content.trim()) {
        focusBlock(lastBlock.id);
      } else {
        const newId = addBlock(blocks.length, "text");
        focusBlock(newId);
      }
    },
    [blocks, addBlock, focusBlock]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = blocks.findIndex((b) => b.id === active.id);
        const newIndex = blocks.findIndex((b) => b.id === over.id);
        if (oldIndex >= 0 && newIndex >= 0) reorderBlocks(oldIndex, newIndex);
      }
    },
    [blocks, reorderBlocks]
  );

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 450, tolerance: 8 },
    }),
  );

  const issueBlockIds = React.useMemo(() => {
    const ids = new Set<string>();

    for (const block of blocks) {
      if (["scene", "top_desc", "text", "direction"].includes(block.type)) {
        if (!block.content?.trim()) ids.add(block.id);
      }

      if (block.type === "choice") {
        const choices = Array.isArray(block.data?.choices) ? block.data?.choices : [];
        if (choices.length === 0) {
          ids.add(block.id);
        } else {
          for (const c of choices) {
            const textMissing = !c.isAiMode && !c.text?.trim();
            if (textMissing || !c.nextScene?.trim()) {
              ids.add(block.id);
              break;
            }
          }
        }
      }
    }

    const eventStarts = blocks.filter((b) => b.type === "event").length;
    const eventEnds = blocks.filter((b) => b.type === "event_end").length;
    if (eventStarts !== eventEnds) {
      const firstEvent = blocks.find((b) => b.type === "event") ?? blocks.find((b) => b.type === "event_end");
      if (firstEvent) ids.add(firstEvent.id);
    }

    return ids;
  }, [blocks]);

  return (
    <div className="min-h-full w-full min-w-0 cursor-text">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <div
            className="mx-auto flex min-h-full w-full min-w-0 flex-col gap-my-4 px-my-8"
            onClick={handleBackgroundClick}
          >
            {blocks.map((block, i) => {
              const isScene = block.type === "scene";
              const showDivider = isScene && i > 0;

              return (
                <Fragment key={block.id}>
                  {showDivider && (
                    <div className="mx-0 my-10 border-t border-border-10" />
                  )}
                  <SortableBlockWrapper
                    block={block}
                    index={i + 1}
                    hasIssue={issueBlockIds.has(block.id)}
                    updateBlock={updateBlock}
                    addBlock={addBlock}
                    removeBlock={removeBlock}
                    focusBlock={focusBlock}
                    isDesktop={isDesktop}
                  />
                </Fragment>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
