"use client";

import React from "react";
import { useEditorStore } from "@/store/useEditorStore";
import type { ScriptBlock, BlockType } from "@/types/editor";
import { cn } from "@/lib/utils";

const LABEL_COLOR_BY_TYPE: Record<BlockType, string> = {
  scene: "text-emerald-600",
  top_desc: "text-primary",
  text: "text-zinc-600",
  background: "text-blue-600",
  bgm: "text-rose-600",
  sfx: "text-orange-500",
  character: "text-violet-600",
  gallery: "text-amber-600",
  direction: "text-slate-500",
  choice: "text-teal-600",
  event: "text-pink-600",
  event_end: "text-pink-600",
};

const TYPE_LABELS: Record<BlockType, string> = {
  scene: "Scene",
  top_desc: "Situation Info",
  text: "Text",
  background: "Background",
  bgm: "BGM",
  sfx: "SFX",
  character: "Character",
  gallery: "Gallery",
  direction: "Direction",
  choice: "선택지",
  event: "Event",
  event_end: "Event End",
};

function ReadOnlyBlockRow({ block, index }: { block: ScriptBlock; index: number }) {
  const indexLabel = String(index).padStart(2, "0");
  const isText = block.type === "text";
  const isChoice = block.type === "choice";
  const isScene = block.type === "scene";
  const labelColorClass = LABEL_COLOR_BY_TYPE[block.type];
  const labelText = TYPE_LABELS[block.type];

  if (block.type === "text") {
    const speaker = block.data?.speaker ?? "";
    const displayContent = speaker ? `${speaker}: ${block.content}` : block.content;
    return (
      <div className="group flex min-h-[36px] h-fit items-start justify-start gap-0">
        <span className="shrink-0 text-[13px] font-medium text-on-surface-30 tabular-nums w-10 mt-2">
          {indexLabel}
        </span>
        <div className="min-w-0 flex-1 py-1">
          <span className="text-sm leading-5 text-on-surface-10 whitespace-pre-wrap break-words">
            {displayContent || "—"}
          </span>
        </div>
      </div>
    );
  }

  if (block.type === "choice") {
    const choices = block.data?.choices ?? [];
    return (
      <div className="group flex min-h-[36px] h-fit items-start justify-start gap-0">
        <span className="shrink-0 text-[13px] font-medium text-on-surface-30 tabular-nums w-10 mt-[10px]">
          {indexLabel}
        </span>
        <div className="min-w-0 flex-1 flex flex-col gap-1 py-1">
          <span className={cn("text-[13px] font-medium", labelColorClass)}>
            {labelText}
          </span>
          <div className="flex flex-col gap-0.5 pl-0">
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

  if (isScene) {
    return (
      <div className="group flex items-center justify-start gap-0 min-h-[36px] h-[36px]">
        <span className="shrink-0 text-[13px] font-medium text-on-surface-30 tabular-nums w-10">
          {indexLabel}
        </span>
        <div className="min-w-0 flex-1 flex items-center gap-0">
          <span className={cn("shrink-0 text-sm font-medium", labelColorClass)}>
            {labelText}
          </span>
          <span className="min-w-0 flex-1 text-[24px] font-bold text-on-surface-10 truncate ml-2">
            {block.content || "—"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-center justify-start gap-0 min-h-[36px] h-[36px]">
      <span className="shrink-0 text-[13px] font-medium text-on-surface-30 tabular-nums w-10">
        {indexLabel}
      </span>
      <div className="min-w-0 flex-1 flex items-center gap-2">
        <span className={cn("w-24 shrink-0 text-sm font-medium", labelColorClass)}>
          {labelText}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm text-on-surface-10">
          {block.content || "—"}
        </span>
      </div>
    </div>
  );
}

/** 수정 불가 잉크 에디터 뷰(미리보기). 스토어의 blocks를 읽기 전용으로 표시 */
export function EditorBodyReadOnly() {
  const blocks = useEditorStore((s) => s.blocks);

  if (!blocks || blocks.length === 0) {
    return (
      <div className="min-h-full w-full flex items-center justify-center text-on-surface-30 text-sm">
        표시할 원고가 없습니다.
      </div>
    );
  }

  return (
    <div className="min-h-full w-full cursor-default select-text">
      <div className="ml-2 mr-5 flex min-h-full max-w-[1400px] flex-col gap-2">
        {blocks.map((block, i) => {
          const isScene = block.type === "scene";
          const prevBlock = i > 0 ? blocks[i - 1] : null;
          const showDivider = isScene && prevBlock && prevBlock.type !== "scene";

          return (
            <div key={block.id} id={`block-${block.id}`} data-block-id={block.id}>
              {showDivider && (
                <div className="flex items-center gap-2 px-[48px] py-10">
                  <div className="flex-1 border-t border-slate-200" />
                </div>
              )}
              <ReadOnlyBlockRow block={block} index={i + 1} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
