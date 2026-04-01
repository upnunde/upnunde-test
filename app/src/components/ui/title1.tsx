"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * 타이틀1 UI 패턴 (피그마 스펙)
 * 1. `title` — 타이틀만
 * 2. `title-dot` — 타이틀 + 필수(빨간 점)
 * 3. `title-subtitle` — 타이틀 + 서브문구
 * 4. `title-subtitle-dot` — 타이틀 + 서브문구 + 필수(빨간 점)
 */
export type Title1Variant =
  | "title"
  | "title-dot"
  | "title-subtitle"
  | "title-subtitle-dot";

export interface Title1Props {
  text: string;
  variant: Title1Variant;
  /** `title-subtitle`, `title-subtitle-dot`에서 사용 (기본 플레이스홀더 문구) */
  subtitleText?: string;
  className?: string;
}

function variantShowsSubtitle(v: Title1Variant): boolean {
  return v === "title-subtitle" || v === "title-subtitle-dot";
}

function variantShowsDot(v: Title1Variant): boolean {
  return v === "title-dot" || v === "title-subtitle-dot";
}

/**
 * 타이틀1 — 15px 볼드(Pretendard JP), 필수는 빨간 점(텍스트 끝 `*`는 표시용으로 제거), 서브는 13px 그레이
 */
export function Title1({
  text,
  variant,
  subtitleText = "필요 없는 보조문구는 삭제",
  className,
}: Title1Props) {
  const showDot = variantShowsDot(variant);
  const subtitle = variantShowsSubtitle(variant);

  const displayText = showDot && text.endsWith("*") ? text.slice(0, -1) : text;
  const titleRow = (
    <div className="inline-flex justify-start items-start gap-0.5">
      <div className="justify-center text-on-surface-10 text-[15px] font-bold font-['Pretendard_JP'] leading-5">
        {displayText}
      </div>
      {showDot && (
        <div
          className="w-1 h-1 rounded-full bg-error-error shrink-0 mt-0.5 mb-0.5 ml-0.5"
          aria-hidden
          role="img"
          aria-label="필수"
        />
      )}
    </div>
  );

  return (
    <div className={cn("relative rounded-[5px] overflow-hidden min-w-0", className)}>
      <div className="inline-flex flex-col justify-start items-start gap-1">
        {titleRow}
        {subtitle && (
          <div className="justify-center text-on-surface-30 text-[13px] font-normal font-['Pretendard_JP'] leading-4">
            {subtitleText}
          </div>
        )}
      </div>
    </div>
  );
}
