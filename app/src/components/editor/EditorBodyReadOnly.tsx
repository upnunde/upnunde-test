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
  "shrink-0 text-[13px] font-medium tabular-nums w-10 h-8 flex items-center justify-start pt-0 mt-0 text-[rgba(197,207,221,1)]";

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
      <div className="group/row relative flex h-fit w-full min-h-10 items-start justify-start gap-0 rounded bg-white py-1 transition-colors group-hover/preview:bg-slate-50/50">
        <span
          className={cn(
            INDEX_COL_CLASS,
            isFocused ? "text-primary" : "transition-colors group-hover/preview:text-on-surface-20"
          )}
        >
          {indexLabel}
        </span>
        <div className="min-w-0 flex-1 flex items-start">
          <div className="flex h-8 items-center justify-start gap-0 shrink-0 pt-0 w-[100px] mt-0 pr-2">
            <span className="inline-block w-fit max-w-[76px] text-left truncate text-[13px] font-medium text-on-surface-30">
              {speaker}
            </span>
          </div>
          <div className="min-w-0 flex flex-1 items-center justify-start h-8 py-0">
            <span className="text-sm leading-5 font-medium text-[16px] text-on-surface-10 whitespace-pre-wrap break-words align-middle">
              {block.content || "—"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (block.type === "choice") {
    const choices = block.data?.choices ?? [];
    return (
      <div className="group/row flex h-fit w-full min-h-10 items-start justify-start gap-0 rounded bg-white py-1 transition-colors group-hover/preview:bg-slate-50/50">
        <span
          className={cn(
            "flex h-fit min-h-8 w-10 shrink-0 items-center justify-start font-medium tabular-nums text-xs leading-4",
            isFocused ? "text-primary" : "text-on-surface-disabled transition-colors group-hover/preview:text-on-surface-20"
          )}
        >
          {indexLabel}
        </span>
        <div className="flex min-w-0 flex-1 items-start gap-0">
          <div className="flex w-24 min-w-14 shrink-0 items-center justify-start overflow-hidden pt-0.5 min-h-8">
            <span className={cn("text-xs font-medium leading-4", labelColorClass)}>#선택지</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5 py-1">
            {choices.map((c, i) => (
              <span key={c.id} className="text-sm text-on-surface-10">
                {i + 1}. {c.text || "—"}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (block.type === "scene") {
    const sceneOrdinal = blocks.slice(0, blockIndex + 1).filter((b) => b.type === "scene").length;
    return (
      <div className="group/row flex h-[36px] items-center justify-start gap-0 rounded-lg transition-colors group-hover/preview:bg-slate-50/50">
        <span
          className={cn(
            INDEX_COL_CLASS,
            "mt-0 h-full",
            isFocused ? "text-primary" : "transition-colors group-hover/preview:text-on-surface-20"
          )}
        >
          {indexLabel}
        </span>
        <div className="flex min-w-0 flex-1 items-center gap-0">
          <div className="w-[100px] shrink-0">
            <span className={cn("text-[13px] font-medium", labelColorClass)}>
              {`#장면 ${String(sceneOrdinal).padStart(2, "0")}`}
            </span>
          </div>
          <span className="min-w-0 flex-1 text-[24px] font-bold text-on-surface-10 truncate">{block.content || "—"}</span>
        </div>
      </div>
    );
  }

  if (block.type === "top_desc") {
    return (
      <div className="group/row flex h-[36px] items-center justify-start gap-0 rounded-lg transition-colors group-hover/preview:bg-slate-50/50">
        <span
          className={cn(
            INDEX_COL_CLASS,
            "mt-0 h-full",
            isFocused ? "text-primary" : "transition-colors group-hover/preview:text-on-surface-20"
          )}
        >
          {indexLabel}
        </span>
        <div className="flex min-w-0 flex-1 items-center gap-0">
          <div className="w-[100px] shrink-0">
            <span className={cn("text-[13px] font-medium", labelColorClass)}>#장면정보</span>
          </div>
          <span className="min-w-0 flex-1 text-base font-medium leading-relaxed text-on-surface-10 truncate">
            {block.content || "—"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="group/row flex h-[36px] items-center justify-start gap-0 rounded-lg transition-colors group-hover/preview:bg-slate-50/50">
      <span
        className={cn(
          INDEX_COL_CLASS,
          "mt-0 h-full",
          isFocused ? "text-primary" : "transition-colors group-hover/preview:text-on-surface-20"
        )}
      >
        {indexLabel}
      </span>
      <div className="flex min-w-0 flex-1 items-center gap-0">
        <div className="w-[100px] shrink-0 flex items-center">
          <span className={cn("w-fit font-medium text-[13px]", labelColorClass)}>{`#${labelKo}`}</span>
        </div>
        <span className="min-w-0 flex-1 truncate text-sm text-on-surface-10">{block.content || "—"}</span>
      </div>
    </div>
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
      <div className="mx-auto flex min-h-full w-full max-w-[1400px] flex-col gap-1 px-2">
        {blocks.map((block, i) => {
          const isScene = block.type === "scene";
          const prevBlock = i > 0 ? blocks[i - 1] : null;
          const showDivider = isScene && prevBlock && prevBlock.type !== "scene";
          return (
            <Fragment key={block.id}>
              {showDivider && (
                <div className="mx-0 my-10 border-t border-slate-200" />
              )}
              <div
                id={`block-${block.id}`}
                data-block-id={block.id}
                aria-label={`원고 블록 ${i + 1}, 클릭하면 미리보기에 반영`}
                tabIndex={0}
                onClick={() => focusBlock(block.id)}
                className={cn(
                  "group/preview rounded-lg px-3 text-left outline-none transition-colors hover:bg-slate-50/50"
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
