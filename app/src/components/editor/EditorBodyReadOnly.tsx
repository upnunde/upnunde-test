"use client";

import React, { Fragment, useCallback, useEffect } from "react";
import { useEditorStore, hydrateSeriesPersonaFromSession } from "@/store/useEditorStore";
import { resolveSpeakerDisplay } from "@/lib/speakerPersona";
import type { ScriptBlock } from "@/types/editor";
import { cn } from "@/lib/utils";
import { LABEL_COLOR_BY_TYPE } from "@/lib/blockLabelColors";
import { BLOCK_LABEL_KO } from "@/lib/blockTypeLabels";

/** EditorBody 줄번호 열과 동일 톤 (포커스 없을 때) */
const INDEX_COL_CLASS =
  "shrink-0 text-[13px] font-medium tabular-nums w-10 flex items-center justify-start mt-0 text-on-surface-disabled min-h-8 py-1";
const READONLY_ROW_MIN_HEIGHT_CLASS = "min-h-8 py-1";
const READONLY_ROW_LABEL_CELL_CLASS = "w-24 shrink-0 min-h-8 py-1 flex items-center justify-start";
const READONLY_ROW_CONTENT_CELL_CLASS = "min-w-0 flex-1 min-h-8 py-0 flex items-center justify-start";
const READONLY_BODY_TEXT_CLASS =
  "text-sm leading-6 font-normal text-[16px] text-on-surface-10 whitespace-pre-wrap break-words align-middle";
const INLINE_TAG_TOKEN_REGEX = /(<[^>]+>)/g;

function renderInlineTagHighlightedText(content: string): React.ReactNode {
  const segments = content.split(INLINE_TAG_TOKEN_REGEX).filter(Boolean);
  return segments.map((segment, idx) => {
    const isTag = /^<[^>]+>$/.test(segment);
    return (
      <span key={`${idx}-${segment}`} className={isTag ? "text-primary" : undefined}>
        {segment}
      </span>
    );
  });
}

function ReadOnlyBlockRow({
  block,
  lineIndex,
  blockIndex,
  blocks,
  isFocused,
}: {
  block: ScriptBlock;
  lineIndex: number;
  blockIndex: number;
  blocks: ScriptBlock[];
  isFocused: boolean;
}) {
  const indexLabel = String(lineIndex).padStart(2, "0");
  const labelColorClass = LABEL_COLOR_BY_TYPE[block.type];
  const labelKo = BLOCK_LABEL_KO[block.type];
  const seriesPersona = useEditorStore((s) => s.seriesPersona);

  if (block.type === "text") {
    const speaker = resolveSpeakerDisplay(block.data?.speaker, seriesPersona);
    return (
      <>
        <div
          className={cn(
            INDEX_COL_CLASS,
            isFocused ? "text-primary" : "transition-colors group-hover/preview:text-on-surface-20"
          )}
        >
          {indexLabel}
        </div>
        <div className={cn(READONLY_ROW_LABEL_CELL_CLASS, "pr-2")}>
          <span className="inline-block w-fit max-w-[76px] text-left truncate text-[13px] font-medium text-on-surface-30">
            {speaker}
          </span>
        </div>
        <div className={READONLY_ROW_CONTENT_CELL_CLASS}>
          <span className={READONLY_BODY_TEXT_CLASS}>
            {renderInlineTagHighlightedText(block.content || "—")}
          </span>
        </div>
      </>
    );
  }

  if (block.type === "choice") {
    const choices = block.data?.choices ?? [];
    const hasAiChoice = choices.some((c) => c.isAiMode);
    const displayChoices = hasAiChoice
      ? choices
      : [
          ...choices,
          {
            id: `${block.id}-ai-preview`,
            text: "AI 대화창",
            nextScene: "",
            isPaid: false,
            isAiMode: true,
          },
        ];
    return (
      <>
        <div
          className={cn(
            INDEX_COL_CLASS,
            isFocused ? "text-primary" : "text-on-surface-disabled transition-colors group-hover/preview:text-on-surface-20"
          )}
        >
          {indexLabel}
        </div>
        <div className={cn(READONLY_ROW_LABEL_CELL_CLASS, "overflow-hidden")}>
          <span className={cn("text-xs font-medium leading-4", labelColorClass)}>#선택지</span>
        </div>
        <div className={cn(READONLY_ROW_CONTENT_CELL_CLASS, "items-start", "py-0")}>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            {displayChoices.map((c, i) => (
              <span
                key={c.id}
                className={cn("flex justify-start items-center gap-3", READONLY_ROW_MIN_HEIGHT_CLASS)}
              >
                <span className={READONLY_BODY_TEXT_CLASS}>
                  {i + 1}.{" "}
                  {c.isAiMode ? "✨ AI 대화창" : renderInlineTagHighlightedText(c.text || "—")}
                </span>
                {c.isPaid && (
                  <span className="inline-flex h-5 w-fit shrink-0 items-center justify-center rounded bg-primary/12 px-1.5 text-[11px] font-medium leading-none whitespace-nowrap text-primary">
                    유료
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (block.type === "scene") {
    const sceneOrdinal = blocks.slice(0, blockIndex + 1).filter((b) => b.type === "scene").length;
    return (
      <>
        <div
          className={cn(
            INDEX_COL_CLASS,
            "mt-0",
            isFocused ? "text-primary" : "transition-colors group-hover/preview:text-on-surface-20"
          )}
        >
          {indexLabel}
        </div>
        <div className={cn(READONLY_ROW_LABEL_CELL_CLASS, "text-[13px] font-medium", labelColorClass)}>
          {`#장면 ${String(sceneOrdinal).padStart(2, "0")}`}
        </div>
        <div className={READONLY_ROW_CONTENT_CELL_CLASS}>
          <span
            className={cn(
              "min-w-0 flex-1 whitespace-pre-wrap break-words",
              "text-[24px] font-bold leading-8 text-on-surface-10"
            )}
          >
            {block.content || "—"}
          </span>
        </div>
      </>
    );
  }

  if (block.type === "top_desc") {
    return (
      <>
        <div
          className={cn(
            INDEX_COL_CLASS,
            "mt-0",
            isFocused ? "text-primary" : "transition-colors group-hover/preview:text-on-surface-20"
          )}
        >
          {indexLabel}
        </div>
        <div className={cn(READONLY_ROW_LABEL_CELL_CLASS, "text-[13px] font-medium", labelColorClass)}>
          #장면정보
        </div>
        <div className={READONLY_ROW_CONTENT_CELL_CLASS}>
          <span className="min-w-0 flex-1 h-6 text-base font-medium leading-6 text-on-surface-10 whitespace-pre-wrap break-words">
            {renderInlineTagHighlightedText(block.content || "—")}
          </span>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className={cn(
          INDEX_COL_CLASS,
          "mt-0",
          isFocused ? "text-primary" : "transition-colors group-hover/preview:text-on-surface-20"
        )}
      >
        {indexLabel}
      </div>
      <div className={cn(READONLY_ROW_LABEL_CELL_CLASS, "text-[13px] font-medium", labelColorClass)}>
        {`#${labelKo}`}
      </div>
      <div className={READONLY_ROW_CONTENT_CELL_CLASS}>
        <span className={cn("min-w-0 flex-1", READONLY_BODY_TEXT_CLASS)}>
          {renderInlineTagHighlightedText(block.content || "—")}
        </span>
      </div>
    </>
  );
}

/** 수정 불가 잉크 에디터 뷰(미리보기). 스토어의 blocks를 읽기 전용으로 표시 — 에디터와 동일한 한글 `#` 라벨·열 폭 */
export function EditorBodyReadOnly() {
  const blocks = useEditorStore((s) => s.blocks);
  const focusBlockId = useEditorStore((s) => s.focusBlockId);
  const setFocusBlockId = useEditorStore((s) => s.setFocusBlockId);

  const focusBlock = useCallback(
    (id: string) => {
      setFocusBlockId(id);
      requestAnimationFrame(() => {
        const el = document.getElementById(`block-${id}`);
        if (!el) return;
        el.focus();
        el.scrollIntoView({ block: "nearest", behavior: "auto" });
      });
    },
    [setFocusBlockId]
  );

  useEffect(() => {
    hydrateSeriesPersonaFromSession();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
      const target = e.target as HTMLElement | null;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }
      if (!blocks.length) return;
      e.preventDefault();
      const currentIndex = focusBlockId ? blocks.findIndex((b) => b.id === focusBlockId) : -1;
      if (e.key === "ArrowDown") {
        const nextIndex = currentIndex < 0 ? 0 : Math.min(currentIndex + 1, blocks.length - 1);
        focusBlock(blocks[nextIndex].id);
        return;
      }
      const prevIndex = currentIndex < 0 ? blocks.length - 1 : Math.max(currentIndex - 1, 0);
      focusBlock(blocks[prevIndex].id);
    };
    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [blocks, focusBlockId, focusBlock]);

  if (!blocks || blocks.length === 0) {
    return (
      <div className="min-h-full w-full flex items-center justify-center text-on-surface-30 text-sm">
        표시할 원고가 없습니다.
      </div>
    );
  }

  return (
    <div className="min-h-full w-full cursor-default select-text">
      <div className="mx-auto flex min-h-full w-full flex-col gap-1 px-2">
        {blocks.map((block, i) => {
          const isScene = block.type === "scene";
          const prevBlock = i > 0 ? blocks[i - 1] : null;
          const showDivider = isScene && prevBlock && prevBlock.type !== "scene";
          return (
            <Fragment key={block.id}>
              {showDivider && (
                <div className="mx-0 my-10 border-t border-border-10" />
              )}
              <div
                id={`block-${block.id}`}
                data-block-id={block.id}
                aria-label={`원고 블록 ${i + 1}, 클릭하면 미리보기에 반영`}
                tabIndex={0}
                onClick={() => focusBlock(block.id)}
                className={cn(
                  "group/preview w-full rounded bg-white inline-flex items-start justify-start gap-0 px-3 py-1 text-left outline-none transition-colors hover:bg-surface-20/50"
                )}
              >
                <ReadOnlyBlockRow
                  block={block}
                  lineIndex={i + 1}
                  blockIndex={i}
                  blocks={blocks}
                  isFocused={focusBlockId === block.id}
                />
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
