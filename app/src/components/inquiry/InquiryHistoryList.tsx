"use client";

import React, { useState } from "react";
import { InquiryHistoryItem } from "./InquiryHistoryItem";
import type { InquiryHistoryItem as InquiryHistoryItemType } from "@/types/inquiry";

export interface InquiryHistoryListProps {
  items: InquiryHistoryItemType[];
}

export function InquiryHistoryList({ items }: InquiryHistoryListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-on-surface-30 text-sm">등록된 문의내역이 없습니다.</p>
          <p className="text-on-surface-30 text-xs mt-1">문의 탭에서 새 문의를 등록해 주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <ul className="flex flex-col">
      {items.map((item, index) => (
        <li key={item.id}>
          <InquiryHistoryItem
            item={item}
            isLast={index === items.length - 1}
            isOpen={expandedId === item.id}
            onToggle={() =>
              setExpandedId((prev) => (prev === item.id ? null : item.id))
            }
          />
        </li>
      ))}
    </ul>
  );
}
