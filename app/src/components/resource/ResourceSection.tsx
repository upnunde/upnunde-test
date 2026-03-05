"use client";

import React from "react";
import { Button } from "@/components/ui/button";

/** 시각 자원(등장인물, 배경, 연출장면, 미디어, 갤러리) 섹션 래퍼. 공통 그리드 레이아웃. */
export interface ResourceSectionProps {
  title: string;
  description: string;
  emptyMessage: string;
  addButtonLabel: string;
  isEmpty: boolean;
  children: React.ReactNode;
  /** [정책 5] 신규 등록 버튼 클릭 시 호출 (카테고리별 신규 등록 페이지로 라우팅) */
  onAddClick: () => void;
  /** BGM은 헤더를 inline-flex로 표시 */
  headerInline?: boolean;
}

export function ResourceSection({
  title,
  description,
  emptyMessage,
  addButtonLabel,
  isEmpty,
  children,
  onAddClick,
  headerInline = false,
}: ResourceSectionProps) {
  return (
    <div className="w-full max-w-[1400px] min-w-[800px] bg-surface-10 rounded-2xl border border-border-10 flex flex-col justify-start items-start">
      <div
        className={
          headerInline
            ? "self-stretch px-5 pt-5 pb-3 border-b border-border-10 inline-flex justify-start items-center"
            : "self-stretch px-5 pt-5 pb-3 border-b border-border-10 flex flex-col justify-center items-start gap-1"
        }
      >
        <div className="flex flex-col justify-start items-start gap-1">
          <div className="inline-flex justify-start items-start gap-0.5">
            <h2 className="text-on-surface-10 text-base font-bold font-['Pretendard_JP'] leading-6">
              {title}
            </h2>
          </div>
          <p className="text-on-surface-30 text-xs font-normal font-['Pretendard_JP'] leading-4">
            {description}
          </p>
        </div>
      </div>
      {isEmpty ? (
        <div className="self-stretch h-36 p-5 rounded-2xl flex flex-col justify-center items-center gap-4">
          <p className="text-on-surface-30 text-sm font-normal font-['Pretendard_JP'] leading-5">
            {emptyMessage}
          </p>
          <Button
            type="button"
            variant="outline"
            className="h-10 min-w-20 px-3 rounded-md border border-border-20 text-secondary-on-secondary text-base font-medium font-['Pretendard_JP'] leading-5 hover:bg-slate-50"
            onClick={onAddClick}
          >
            {addButtonLabel}
          </Button>
        </div>
      ) : (
        <div className="self-stretch p-5">{children}</div>
      )}
    </div>
  );
}
