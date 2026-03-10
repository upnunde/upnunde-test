"use client";

import React from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface Title2Props {
  /** 타이틀 텍스트 */
  text: string;
  /** 상단 타이틀(섹션 헤더) 여부 — true면 공통 래퍼 div로 감싸서 렌더 */
  asSectionHeader?: boolean;
  /** 타이틀 옆 필수 표시용 빨간 점 노출 여부 */
  showDot?: boolean;
  /** 가이드(정보) 아이콘 버튼 노출 여부 */
  showGuide?: boolean;
  /** 보조문구(가이드 문구) 노출 여부 */
  subtitle?: boolean;
  /** 보조문구 내용 (subtitle이 true일 때 사용) */
  subtitleText?: string;
  /** 가이드 아이콘 클릭 시 콜백 */
  onGuideClick?: () => void;
  /** 루트 컨테이너에 적용할 추가 클래스 */
  className?: string;
}

/**
 * 타이틀2 컴포넌트
 * - 타이틀1보다 큰 타이틀(text-lg), 선택적 빨간 점, 선택적 정보 아이콘, 선택적 보조문구를 표시합니다.
 */
export function Title2({
  text,
  asSectionHeader = false,
  showDot = true,
  showGuide = true,
  subtitle = false,
  subtitleText = "필요 없는 보조문구는 삭제",
  onGuideClick,
  className,
}: Title2Props) {
  /** 상단 타이틀: 공통 래퍼 div + 제목(필요 시 보조문구) */
  if (asSectionHeader) {
    return (
      <div
        className={cn(
          "w-full px-5 pt-5 pb-3 border-b border-border-10/5 flex flex-col justify-center items-start",
          className
        )}
        style={{ borderBottomColor: "rgba(0, 0, 0, 0.07)" }}
      >
        <div className="self-stretch justify-start text-on-surface-10 text-lg font-bold font-['Pretendard_JP'] leading-6">
          {text}
        </div>
        {subtitle && (
          <div className="self-stretch justify-start text-on-surface-30 text-[13px] font-normal font-['Pretendard_JP'] leading-4 mt-1">
            {subtitleText}
          </div>
        )}
      </div>
    );
  }

  const titleRow = (
    <div className="inline-flex justify-start items-start gap-0.5">
      <div className="justify-start text-on-surface-10 text-lg font-bold font-['Pretendard_JP'] leading-6">
        {text}
      </div>
      {showDot && (
        <div
          className="w-1 h-1 rounded-full bg-error-error shrink-0 mt-1.5"
          aria-hidden
        />
      )}
      {showGuide && (
        <Button
          type="button"
          variant="secondary"
          size="icon-xs"
          className="h-6 w-6 rounded-[999px] px-0 shrink-0 [&_svg]:size-4 text-secondary-on-secondary hover:bg-surface-20 hover:text-on-surface-10"
          onClick={onGuideClick}
          aria-label="안내 보기"
        >
          <Info aria-hidden />
        </Button>
      )}
    </div>
  );

  return (
    <div
      className={cn(
        "px-5 py-4 rounded-[5px] overflow-hidden inline-flex justify-start items-start gap-12 min-w-0",
        className
      )}
    >
      {/* 왼쪽: 타이틀 + 점 + 가이드 아이콘 */}
      <div className="inline-flex flex-col justify-start items-start gap-1">
        {titleRow}
      </div>
      {/* 오른쪽: subtitle 사용 시 타이틀 + 점 + 가이드 + 보조문구 */}
      {subtitle && (
        <div className="inline-flex flex-col justify-start items-start gap-1 min-w-0 flex-1">
          {titleRow}
          <div className="justify-center text-on-surface-30 text-[13px] font-normal font-['Pretendard_JP'] leading-4">
            {subtitleText}
          </div>
        </div>
      )}
    </div>
  );
}
