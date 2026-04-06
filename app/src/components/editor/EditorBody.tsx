"use client";

import React, { useEffect, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  PointerSensor,
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
import { parseScriptToBlocks } from "@/utils/scriptParser";
import { createBlock } from "@/store/useEditorStore";
import { INITIAL_SCRIPT } from "@/lib/initialScript";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ScriptBlock } from "./ScriptBlock";

/** 텍스트(대사) 블록: 행 높이 36px, 세로 가변 확장 가능 */
const WRAPPER_CLASS_TEXT =
  "group flex min-h-[36px] h-fit items-start justify-center gap-0";
const ROOT_CLASS_TEXT = "min-w-0 flex-1 min-h-[36px] h-fit";

/** 선택지 블록: 최소 높이 36px, 내용에 따라 확장 */
const WRAPPER_CLASS_CHOICE =
  "group flex min-h-[36px] h-fit items-start justify-center gap-0";
const ROOT_CLASS_CHOICE = "min-w-0 flex-1 min-h-[36px]";

/** 한 줄 블록 (씬/캐릭터/연출/배경 등): 고정 높이 36px, px-0 py-1 */
const WRAPPER_CLASS_COMPACT =
  "group flex h-full items-center justify-start gap-0";
const ROOT_CLASS_COMPACT = "min-w-0 flex-1 min-h-[36px] h-[36px]";

function SortableBlockWrapper({
  block,
  index,
  hasIssue,
  updateBlock,
  addBlock,
  removeBlock,
  focusBlock,
}: {
  block: import("@/types/editor").ScriptBlock;
  index: number;
  hasIssue: boolean;
  updateBlock: (id: string, content: string, data?: Record<string, any>) => void;
  addBlock: (index: number, type: import("@/types/editor").BlockType, content?: string) => string;
  removeBlock: (id: string) => void;
  focusBlock: (id: string) => void;
}) {
  const focusBlockId = useEditorStore((s) => s.focusBlockId);
  const isFocused = focusBlockId === block.id;
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
            : WRAPPER_CLASS_COMPACT,
        isDragging && "opacity-50"
      )}
    >
      <div className="relative flex items-start justify-center gap-0 opacity-0 transition-opacity group-hover:opacity-100 shrink-0 w-fit h-fit mt-1 mb-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 rounded p-0 text-on-surface-30 hover:bg-slate-100 hover:text-slate-600"
          aria-label="Add block below"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const newBlockId = addBlock(index, "text");
            if (newBlockId) focusBlock(newBlockId);
          }}
        >
          <Plus className="size-5" />
        </Button>
        <button
          type="button"
          className="cursor-grab touch-none rounded px-0 py-0 w-6 h-7 mx-0 flex items-center justify-center text-on-surface-30 hover:bg-slate-100 hover:text-slate-600 active:cursor-grabbing mt-0 mb-0"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
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
      </div>
      <span
        className={cn(
          "shrink-0 text-[13px] font-medium tabular-nums w-10 h-full flex items-center justify-start pt-0 mt-0",
          block.type === "text" && "mt-2",
          block.type === "choice" && "mt-[10px]",
          isFocused
            ? "text-primary"
            : hasIssue
              ? "text-rose-600"
              : "text-[rgba(197,207,221,1)]"
        )}
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
              : ROOT_CLASS_COMPACT
        }
      />
    </div>
  );
}

export default function EditorBody() {
  const blocks = useEditorStore((s) => s.blocks);
  const setBlocks = useEditorStore((s) => s.setBlocks);
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

  useEffect(() => {
    const parsed = parseScriptToBlocks(INITIAL_SCRIPT);
    setBlocks(parsed.length > 0 ? parsed : [createBlock("text", "")]);
  }, [setBlocks]);

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

          const focusable = textarea ?? input ?? pickerButton ?? rootDiv;

          if (focusable && typeof (focusable as HTMLElement).focus === "function") {
            (focusable as HTMLElement).focus();
            if (textarea && textarea instanceof HTMLTextAreaElement) {
              const textLength = textarea.value.length;
              textarea.setSelectionRange(textLength, textLength);
            }
            if (input && input instanceof HTMLInputElement) {
              const textLength = input.value.length;
              input.setSelectionRange(textLength, textLength);
            }
            setTimeout(() => {
              const focusEvent = new FocusEvent("focus", { bubbles: true, cancelable: true });
              focusable.dispatchEvent(focusEvent);
            }, 0);
          }
        });
      });
    },
    [setFocusBlockId]
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
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
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
            if (!c.text?.trim() || !c.nextScene?.trim()) {
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
    <div className="min-h-full w-full cursor-text">
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
            className="ml-2 mr-5 flex min-h-full max-w-[1400px] flex-col gap-2"
            onClick={handleBackgroundClick}
          >
            {blocks.map((block, i) => {
              const isScene = block.type === "scene";
              const prevBlock = i > 0 ? blocks[i - 1] : null;
              const showDivider = isScene && prevBlock && prevBlock.type !== "scene";

              return (
                <div key={block.id}>
                  {showDivider && (
                    <div className="flex items-center gap-2 px-[48px] py-10">
                      <div className="flex-1 border-t border-slate-200"></div>
                    </div>
                  )}
                  <SortableBlockWrapper
                    block={block}
                    index={i + 1}
                    hasIssue={issueBlockIds.has(block.id)}
                    updateBlock={updateBlock}
                    addBlock={addBlock}
                    removeBlock={removeBlock}
                    focusBlock={focusBlock}
                  />
                </div>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
