"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PAGE_CARD_SHELL_MOBILE_FLUSH_CLASS, PAGE_CONTENT_PAD_X_CLASS } from "@/lib/page-layout";
import { cn } from "design-system/utils";
import { ResourceSectionHeader } from "./ResourceSectionHeader";

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
  /** 설명 텍스트 색상 커스터마이징 (현재는 미반영, 호환용) */
  descriptionColorClassName?: string;
  /** 섹션 헤더 우측 액션 영역 (예: 캐릭터 가져오기 버튼) */
  headerAction?: React.ReactNode;
}

export function ResourceSection({
  title,
  description,
  emptyMessage,
  addButtonLabel,
  isEmpty,
  children,
  onAddClick,
  descriptionColorClassName: _descriptionColorClassName,
  headerAction,
}: ResourceSectionProps) {
  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col items-stretch justify-start rounded-sm border border-border bg-background",
        PAGE_CARD_SHELL_MOBILE_FLUSH_CLASS,
      )}
    >
      <ResourceSectionHeader title={title} description={description} headerAction={headerAction} />
      {isEmpty ? (
        <div className="self-stretch h-36 p-5 rounded-sm flex flex-col justify-center items-center gap-4">
          <p className="text-foreground-placeholder text-body3_400 font-['Pretendard_JP']">
            {emptyMessage}
          </p>
          <Button
            type="button"
            variant="outline"
            shape="square"
            size="default"
            onClick={onAddClick}
          >
            {addButtonLabel}
          </Button>
        </div>
      ) : (
        <div className={cn("w-full min-w-0 self-stretch py-5", PAGE_CONTENT_PAD_X_CLASS)}>{children}</div>
      )}
    </div>
  );
}
