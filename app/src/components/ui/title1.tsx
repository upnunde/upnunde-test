"use client";

import React from "react";
import { cn } from "design-system/utils";

/**
 * 타이틀1 UI 패턴 (피그마 스펙)
 * 1. `title` — 타이틀만
 * 2. `title-dot` — 타이틀 + 필수(빨간 점)
 * 3. `title-subtitle` — 타이틀 + 서브문구
 * 4. `title-subtitle-dot` — 타이틀 + 서브문구 + 필수(빨간 점)
 *
 * 필수 표시: `title-*-dot` variant 또는 `required` prop. `text` 끝 `*`는 UI에서 제거 후 점만 표시.
 * 가이드: `.cursor/rules/ui-tokens-quickref.mdc` · `title1RequiredText()`
 */
export type Title1Variant =
  | "title"
  | "title-dot"
  | "title-subtitle"
  | "title-subtitle-dot";

export interface Title1Props {
  text: string;
  variant: Title1Variant;
  /** `title-subtitle-dot`·`title-dot` 없이도 필수 점을 켤 때. `text` 끝 `*`는 UI에서 제거됨. */
  required?: boolean;
  /** `title-subtitle`, `title-subtitle-dot`에서 사용 (기본 플레이스홀더 문구) */
  subtitleText?: string;
  className?: string;
}

/** Title1 필수 라벨 — `text`에 붙이면 `title-*-dot` variant와 함께 빨간 점만 노출 */
export function title1RequiredText(label: string): string {
  const base = label.replace(/\*+$/, "").trimEnd();
  return `${base}*`;
}

/** 필수 + 부제목 필드용 variant */
export const TITLE1_VARIANT_REQUIRED_WITH_SUBTITLE: Title1Variant = "title-subtitle-dot";

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
  required = false,
  subtitleText = "필요 없는 보조문구는 삭제",
  className,
}: Title1Props) {
  const showDot = variantShowsDot(variant) || required;
  const subtitle = variantShowsSubtitle(variant);

  const displayText = showDot && text.endsWith("*") ? text.slice(0, -1).trimEnd() : text;
  const titleRow = (
    <div className="inline-flex justify-start items-start gap-0.5">
      <div className="justify-center text-foreground text-body2_700 font-['Pretendard_JP']">
        {displayText}
      </div>
      {showDot && (
        <div
          className="w-1 h-1 rounded-full bg-destructive shrink-0 mt-0.5 mb-0.5 ml-0.5"
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
          <div className="justify-center text-foreground-placeholder text-body4_400 font-['Pretendard_JP']">
            {subtitleText}
          </div>
        )}
      </div>
    </div>
  );
}
