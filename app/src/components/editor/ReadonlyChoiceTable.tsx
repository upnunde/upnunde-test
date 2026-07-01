"use client";

import type { ReactNode } from "react";
import type { ChoiceItem } from "@/types/editor";
import { cn } from "design-system/utils";

const INLINE_TAG_TOKEN_REGEX = /(<[^>]+>)/g;

function renderInlineTagHighlightedText(content: string): ReactNode {
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

export interface ReadonlyChoiceSceneOption {
  value: string;
  label: string;
}

export function ReadonlyChoiceTable({
  choices,
  sceneOptions = [],
  className,
}: {
  choices: ChoiceItem[];
  sceneOptions?: ReadonlyChoiceSceneOption[];
  className?: string;
}) {
  if (choices.length === 0) {
    return (
      <div
        className={cn(
          "rounded border border-border bg-background px-3 py-2 text-body3_400 text-foreground-placeholder",
          className
        )}
      >
        선택지 없음
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-w-0 flex-1 overflow-hidden rounded border border-border bg-background",
        className
      )}
    >
      <div className="flex min-h-8 border-b border-border bg-muted/80 text-caption1_500 text-foreground-placeholder">
        <div className="flex w-20 shrink-0 items-center border-r border-border px-3">선택</div>
        <div className="flex min-w-[200px] flex-1 items-center border-r border-border px-3">
          내용
        </div>
        <div className="flex w-[200px] max-w-[200px] min-w-[160px] shrink-0 items-center border-r border-border px-3">
          장면 전환
        </div>
        <div className="flex w-[120px] max-w-[120px] min-w-[100px] shrink-0 items-center px-3">
          유료 전환
        </div>
      </div>
      {choices.map((choice, index) => {
        const isAiMode = choice.isAiMode === true;
        const sceneLabel =
          sceneOptions.find((opt) => opt.value === choice.nextScene)?.label ??
          (choice.nextScene?.trim() || "");
        const sceneEmpty = !choice.nextScene?.trim();
        return (
          <div
            key={choice.id}
            className={cn(
              "flex min-h-9 items-stretch",
              index < choices.length - 1 && "border-b border-border"
            )}
          >
            <div className="flex w-20 shrink-0 items-center self-stretch border-r border-border px-3 text-body3_400 text-foreground-placeholder">
              선택 {index + 1}
            </div>
            <div className="flex min-h-9 min-w-[200px] flex-1 items-center self-stretch border-r border-border px-3 py-1 text-body3_400 text-foreground">
              {isAiMode ? (
                <span className="font-medium text-primary">✨ AI 모드로 직접 대화</span>
              ) : (
                <span className="min-w-0 whitespace-pre-wrap break-words leading-5">
                  {renderInlineTagHighlightedText(choice.text?.trim() || "—")}
                </span>
              )}
            </div>
            <div className="flex w-[200px] max-w-[200px] min-w-[160px] shrink-0 items-center self-stretch border-r border-border px-3 py-1">
              <span
                className={cn(
                  "min-w-0 w-full truncate text-body3_400",
                  sceneEmpty ? "text-foreground-placeholder" : "text-foreground"
                )}
                title={sceneEmpty ? "장면 선택" : sceneLabel || "장면 선택"}
              >
                {sceneEmpty ? "장면 선택" : sceneLabel || "장면 선택"}
              </span>
            </div>
            <div className="flex w-[120px] max-w-[120px] min-w-[100px] shrink-0 items-center self-stretch px-3 py-1">
              {choice.isPaid ? (
                <span className="inline-flex h-5 w-fit shrink-0 items-center justify-center rounded bg-primary/12 px-2 text-caption2_500 whitespace-nowrap text-primary">
                  유료
                </span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
