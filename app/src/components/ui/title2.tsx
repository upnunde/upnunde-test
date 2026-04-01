"use client";

import React from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * 타이틀2 — 피그마 8가지 케이스
 * 1. title — 타이틀
 * 2. title-subtitle — 타이틀 + 서브타이틀
 * 3. title-dot — 타이틀 + 닷
 * 4. title-dot-subtitle — 타이틀 + 닷 + 서브타이틀
 * 5. title-info — 타이틀 + 인포
 * 6. title-info-subtitle — 타이틀 + 인포 + 서브타이틀
 * 7. title-dot-info — 타이틀 + 닷 + 인포
 * 8. title-dot-info-subtitle — 타이틀 + 닷 + 인포 + 서브타이틀
 */
export type Title2Variant =
  | "title"
  | "title-subtitle"
  | "title-dot"
  | "title-dot-subtitle"
  | "title-info"
  | "title-info-subtitle"
  | "title-dot-info"
  | "title-dot-info-subtitle";

const VARIANT_FLAGS: Record<
  Title2Variant,
  { showDot: boolean; showGuide: boolean; subtitle: boolean }
> = {
  title: { showDot: false, showGuide: false, subtitle: false },
  "title-subtitle": { showDot: false, showGuide: false, subtitle: true },
  "title-dot": { showDot: true, showGuide: false, subtitle: false },
  "title-dot-subtitle": { showDot: true, showGuide: false, subtitle: true },
  "title-info": { showDot: false, showGuide: true, subtitle: false },
  "title-info-subtitle": { showDot: false, showGuide: true, subtitle: true },
  "title-dot-info": { showDot: true, showGuide: true, subtitle: false },
  "title-dot-info-subtitle": { showDot: true, showGuide: true, subtitle: true },
};

export interface Title2Props {
  /** 타이틀 텍스트 */
  text: string;
  /**
   * 8가지 케이스 중 하나. 지정하면 `showDot` / `showGuide` / `subtitle`보다 우선합니다.
   * 미지정 시 아래 세 prop(기본값 false)으로 조합합니다.
   */
  variant?: Title2Variant;
  /** 상단 타이틀(섹션 헤더) 여부 — true면 공통 래퍼(px·border·패딩)로 감싸서 렌더 */
  asSectionHeader?: boolean;
  /** 타이틀 옆 필수 표시용 빨간 점 노출 (`variant` 미사용 시) */
  showDot?: boolean;
  /** 가이드(정보) 아이콘 버튼 노출 (`variant` 미사용 시) */
  showGuide?: boolean;
  /** 보조문구 노출 (`variant` 미사용 시) */
  subtitle?: boolean;
  /** 보조문구 내용 */
  subtitleText?: string;
  /** 가이드 아이콘 클릭 시 콜백 */
  onGuideClick?: () => void;
  /** 루트 컨테이너에 적용할 추가 클래스 */
  className?: string;
}

/**
 * 타이틀2 — text-lg 본문, 선택적 빨간 점·정보 아이콘·서브타이틀(8가지).
 */
export function Title2({
  text,
  variant,
  asSectionHeader = false,
  showDot = false,
  showGuide = false,
  subtitle = false,
  subtitleText = "필요 없는 보조문구는 삭제",
  onGuideClick,
  className,
}: Title2Props) {
  const flags = variant
    ? VARIANT_FLAGS[variant]
    : { showDot, showGuide, subtitle };

  const titleRow = (
    <div className="inline-flex justify-start items-start gap-0.5">
      <div className="justify-start text-on-surface-10 text-lg font-bold font-['Pretendard_JP'] leading-6">
        {text}
      </div>
      {flags.showDot && (
        <div
          className="w-1 h-1 rounded-full bg-error-error shrink-0 mt-1.5"
          aria-hidden
        />
      )}
      {flags.showGuide && (
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

  const body = (
    <div className="self-stretch flex flex-col gap-1">
      {titleRow}
      {flags.subtitle && (
        <div className="self-stretch justify-start text-on-surface-30 text-[13px] font-normal font-['Pretendard_JP'] leading-4">
          {subtitleText}
        </div>
      )}
    </div>
  );

  if (asSectionHeader) {
    return (
      <div
        className={cn(
          "w-full px-5 pt-5 pb-3 border-b border-border-10/5 flex flex-col justify-center items-start",
          className
        )}
        style={{ borderBottomColor: "rgba(0, 0, 0, 0.07)" }}
      >
        {body}
      </div>
    );
  }

  return (
    <div
      className={cn("inline-flex flex-col justify-start items-start", className)}
    >
      {body}
    </div>
  );
}
