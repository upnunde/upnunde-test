"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Title2 } from "@/components/ui/title2";

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
  /** 설명 텍스트 색상 커스터마이징 */
  descriptionColorClassName?: string;
}

export function ResourceSection({
  title,
  description,
  emptyMessage,
  addButtonLabel,
  isEmpty,
  children,
  onAddClick,
  descriptionColorClassName,
  headerInline = false,
}: ResourceSectionProps) {
  return (
    <div className="w-full max-w-[1200px] min-w-[640px] bg-surface-10 rounded-2xl border border-border-10 flex flex-col justify-start items-start">
      <Title2
        text={title}
        asSectionHeader
        subtitle
        subtitleText={description}
      />
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
