"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Title2 } from "@/components/ui/title2";
import { PAGE_CARD_SHELL_MOBILE_FLUSH_CLASS } from "@/lib/page-layout";
import { cn } from "@/lib/utils";

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
        "mx-auto flex w-full min-w-0 max-w-[1200px] flex-col items-start justify-start rounded-[4px] border border-border-10 bg-surface-10",
        PAGE_CARD_SHELL_MOBILE_FLUSH_CLASS,
      )}
    >
      {headerAction ? (
        <div
          className="w-full h-fit px-my-16 lg:px-my-20 py-my-12 border-b border-border-10/5 flex items-center justify-between gap-my-12"
          style={{ borderBottomColor: "rgba(0, 0, 0, 0.07)" }}
        >
          <div className="min-w-0 flex-1">
            <Title2 text={title} subtitle subtitleText={description} />
          </div>
          {headerAction}
        </div>
      ) : (
        <Title2 text={title} asSectionHeader subtitle subtitleText={description} />
      )}
      {isEmpty ? (
        <div className="self-stretch h-36 p-my-20 rounded-[4px] flex flex-col justify-center items-center gap-my-16">
          <p className="text-on-surface-30 text-body3_400 font-['Pretendard_JP']">
            {emptyMessage}
          </p>
          <Button
            type="button"
            variant="outline"
            className="h-9 min-w-20 px-my-12 rounded-md border border-border-20 text-on-secondary text-body1_500 font-['Pretendard_JP'] hover:bg-surface-20"
            onClick={onAddClick}
          >
            {addButtonLabel}
          </Button>
        </div>
      ) : (
        <div className="self-stretch p-my-20">{children}</div>
      )}
    </div>
  );
}
