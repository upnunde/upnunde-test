"use client";

import React, { useState } from "react";
import { InquiryHistoryItem } from "./InquiryHistoryItem";
import type { InquiryHistoryItem as InquiryHistoryItemType } from "@/types/inquiry";
import { cn } from "design-system/utils";

export interface InquiryHistoryListProps {
  items: InquiryHistoryItemType[];
  className?: string;
}

/** 문의내역 목록 본문 — 카드 셸은 페이지 `PageCard`가 담당 */
export function InquiryHistoryList({ items, className }: InquiryHistoryListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className={cn("flex h-fit w-full shrink-0 flex-col", className)}>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-body3_400 text-foreground-placeholder">등록된 문의내역이 없습니다.</p>
          <p className="mt-1 text-caption1_400 text-foreground-placeholder">문의 탭에서 새 문의를 등록해 주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex h-fit w-full shrink-0 flex-col", className)}>
      <ul className="flex flex-col" role="list">
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 ? (
              <li aria-hidden className="list-none">
                <div className="my-0 h-px w-full bg-muted" role="separator" />
              </li>
            ) : null}
            <li>
              <InquiryHistoryItem
                item={item}
                isOpen={expandedId === item.id}
                onToggle={() =>
                  setExpandedId((prev) => (prev === item.id ? null : item.id))
                }
              />
            </li>
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}
