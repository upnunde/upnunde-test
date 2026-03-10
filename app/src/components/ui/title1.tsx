"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface Title1Props {
  /** 타이틀 텍스트 */
  text: string;
  /** 타이틀 옆 필수 표시용 빨간 점 노출 여부 */
  showDot?: boolean;
  /** 보조문구(서브타이틀) 노출 여부 */
  subtitle?: boolean;
  /** 보조문구 내용 (subtitle이 true일 때 사용, 기본값: "필요 없는 보조문구는 삭제") */
  subtitleText?: string;
  /** 루트 컨테이너에 적용할 추가 클래스 */
  className?: string;
}

/**
 * 타이틀1 컴포넌트
 * - 타이틀 텍스트(15px), 필수 표시는 빨간 점으로 따로 표시, 선택적 보조문구를 표시합니다.
 */
export function Title1({
  text,
  showDot = true,
  subtitle = false,
  subtitleText = "필요 없는 보조문구는 삭제",
  className,
}: Title1Props) {
  /** 필수 표시는 빨간 점만 사용. text 끝의 '*'는 제거하여 표시 */
  const displayText = showDot && text.endsWith("*") ? text.slice(0, -1) : text;
  const titleRow = (
    <div className="inline-flex justify-start items-start gap-0.5">
      <div className="justify-center text-on-surface-10 text-[15px] font-bold font-['Pretendard_JP'] leading-5">
        {displayText}
      </div>
      {showDot && (
        <div
          className="w-1 h-1 rounded-full bg-error-error shrink-0 mt-1.5"
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
