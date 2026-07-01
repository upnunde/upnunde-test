"use client";

import React, { Fragment, useCallback, useEffect } from "react";
import { useEditorStore, hydrateSeriesPersonaFromSession } from "@/store/useEditorStore";
import { resolveSpeakerDisplay } from "@/lib/speakerPersona";
import type { ScriptBlock } from "@/types/editor";
import {
  EDITOR_BLOCK_INDEX_COLUMN_CLASS,
  EDITOR_BLOCK_LABEL_COLUMN_CLASS,
  EDITOR_SCENE_TITLE_DISPLAY_CLASS,
  EDITOR_SCENE_TITLE_FIELD_SHELL_CLASS,
  EDITOR_TOP_DESC_DISPLAY_CLASS,
} from "@/lib/editor-block-layout";
import { cn } from "design-system/utils";
import { scrollEditorBlockIntoView } from "@/lib/editor-scroll";
import { LABEL_COLOR_BY_TYPE } from "@/lib/blockLabelColors";
import { BLOCK_LABEL_KO } from "@/lib/blockTypeLabels";
import { ReadonlyChoiceTable } from "./ReadonlyChoiceTable";
import {
  isReadonlyPickerResourceBlock,
  ReadonlyResourceValues,
} from "./ReadonlyResourceValues";

/** EditorBody 줄번호 열과 동일 톤 (포커스 없을 때) */
const INDEX_COL_CLASS = cn(
  "text-body4_500 tabular-nums flex items-center justify-start mt-0 text-foreground-disabled min-h-8 py-1",
  EDITOR_BLOCK_INDEX_COLUMN_CLASS,
);
const READONLY_ROW_LABEL_CELL_CLASS = cn(
  EDITOR_BLOCK_LABEL_COLUMN_CLASS,
  "min-h-8 py-1 flex items-center justify-start",
);
const READONLY_ROW_CONTENT_CELL_CLASS = "min-w-0 flex-1 min-h-8 py-0 flex items-center justify-start";
const READONLY_BODY_TEXT_CLASS =
  "text-body1_400 text-foreground whitespace-pre-wrap break-words align-middle";
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

function buildSceneOptions(blocks: ScriptBlock[]) {
  return blocks
    .filter((b) => b.type === "scene")
    .map((b, i) => ({
      value: b.content?.trim() || `장면_${i + 1}`,
      label: b.content?.trim() || `장면_${i + 1}`,
    }));
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
  const indexColClass = cn(
    INDEX_COL_CLASS,
    isFocused ? "text-primary" : "transition-colors group-hover/preview:text-foreground-muted"
  );

  if (block.type === "text") {
    const speaker = resolveSpeakerDisplay(block.data?.speaker, seriesPersona);
    return (
      <>
        <div className={indexColClass}>{indexLabel}</div>
        <div className={cn(READONLY_ROW_LABEL_CELL_CLASS, "pr-2")}>
          <span className="inline-block w-fit max-w-[76px] truncate text-left text-caption1_500 text-foreground-placeholder">
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
        <div className={indexColClass}>{indexLabel}</div>
        <div className={cn(READONLY_ROW_LABEL_CELL_CLASS, "self-start overflow-hidden pt-0.5")}>
          <span className={cn("text-caption1_500", labelColorClass)}>#선택지</span>
        </div>
        <div className={cn(READONLY_ROW_CONTENT_CELL_CLASS, "items-start py-1")}>
          <ReadonlyChoiceTable
            choices={displayChoices}
            sceneOptions={buildSceneOptions(blocks)}
          />
        </div>
      </>
    );
  }

  if (block.type === "scene") {
    const sceneOrdinal = blocks.slice(0, blockIndex + 1).filter((b) => b.type === "scene").length;
    return (
      <>
        <div className={cn(indexColClass, "mt-0")}>{indexLabel}</div>
        <div className={cn(READONLY_ROW_LABEL_CELL_CLASS, "text-body4_500", labelColorClass)}>
          {`#장면 ${String(sceneOrdinal).padStart(2, "0")}`}
        </div>
        <div className={cn(READONLY_ROW_CONTENT_CELL_CLASS, EDITOR_SCENE_TITLE_FIELD_SHELL_CLASS)}>
          <span className={EDITOR_SCENE_TITLE_DISPLAY_CLASS}>
            {block.content || "—"}
          </span>
        </div>
      </>
    );
  }

  if (block.type === "top_desc") {
    return (
      <>
        <div className={cn(indexColClass, "mt-0")}>{indexLabel}</div>
        <div className={cn(READONLY_ROW_LABEL_CELL_CLASS, "text-body4_500", labelColorClass)}>
          #장면정보
        </div>
        <div className={READONLY_ROW_CONTENT_CELL_CLASS}>
          <span className={cn(EDITOR_TOP_DESC_DISPLAY_CLASS, "h-6")}>
            {renderInlineTagHighlightedText(block.content || "—")}
          </span>
        </div>
      </>
    );
  }

  if (isReadonlyPickerResourceBlock(block.type)) {
    return (
      <>
        <div className={cn(indexColClass, "mt-0")}>{indexLabel}</div>
        <div className={cn(READONLY_ROW_LABEL_CELL_CLASS, "text-body4_500", labelColorClass)}>
          {`#${labelKo}`}
        </div>
        <div className={READONLY_ROW_CONTENT_CELL_CLASS}>
          <ReadonlyResourceValues block={block} />
        </div>
      </>
    );
  }

  return (
    <>
      <div className={cn(indexColClass, "mt-0")}>{indexLabel}</div>
      <div className={cn(READONLY_ROW_LABEL_CELL_CLASS, "text-body4_500", labelColorClass)}>
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
        const el = scrollEditorBlockIntoView(id);
        el?.focus();
      });
    },
    [setFocusBlockId],
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
      <div className="min-h-full w-full flex items-center justify-center text-foreground-placeholder text-body3_400">
        표시할 원고가 없습니다.
      </div>
    );
  }

  return (
    <div className="min-h-full w-full cursor-default select-text">
      <div className="mx-auto flex min-h-full w-full flex-col gap-1 pl-2 pr-0">
        {blocks.map((block, i) => {
          const isScene = block.type === "scene";
          const prevBlock = i > 0 ? blocks[i - 1] : null;
          const showDivider = isScene && prevBlock && prevBlock.type !== "scene";
          return (
            <Fragment key={block.id}>
              {showDivider && (
                <div className="mx-0 my-10 border-t border-border" />
              )}
              <div
                id={`block-${block.id}`}
                data-block-id={block.id}
                aria-label={`원고 블록 ${i + 1}, 클릭하면 미리보기에 반영`}
                tabIndex={0}
                onClick={() => focusBlock(block.id)}
                className={cn(
                  "group/preview w-full rounded bg-background inline-flex items-start justify-start gap-0 px-0 lg:px-5 py-1 text-left outline-none transition-colors hover:bg-muted/50"
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
