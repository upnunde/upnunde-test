"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { filterInquiryFaqItems } from "@/lib/inquiry-faq";
import { PAGE_FLUSH_CONTENT_PAD_X_CLASS } from "@/lib/page-layout";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { InquiryFaqItem } from "./InquiryFaqItem";

export interface InquiryFaqListProps {
  className?: string;
  onGoToInquiry?: () => void;
}

/** 자주 받는 질문 — 검색 + 아코디언 목록 */
export function InquiryFaqList({ className, onGoToInquiry }: InquiryFaqListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(
    () => filterInquiryFaqItems(searchQuery),
    [searchQuery],
  );

  const hasSearchQuery = searchQuery.trim().length > 0;

  return (
    <div className={cn("flex h-fit w-full shrink-0 flex-col", className)}>
      <div className={cn("py-my-20", PAGE_FLUSH_CONTENT_PAD_X_CLASS)}>
        <label htmlFor="inquiry-faq-search" className="sr-only">
          자주 받는 질문 검색
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-my-12 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-30"
            aria-hidden
          />
          <Input
            id="inquiry-faq-search"
            type="text"
            role="searchbox"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="질문·답변 검색"
            className={cn("pl-my-36", hasSearchQuery && "pr-my-36")}
            autoComplete="off"
            enterKeyHint="search"
          />
          {hasSearchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-my-8 top-1/2 flex h-my-32 w-my-32 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-on-surface-30 transition-colors hover:bg-surface-20 hover:text-on-surface-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="검색어 지우기"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          ) : null}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div
          className={cn(
            "flex flex-col items-center justify-center py-my-64 text-center",
            PAGE_FLUSH_CONTENT_PAD_X_CLASS,
          )}
        >
          <p className="text-body3_400 text-on-surface-30">
            {hasSearchQuery
              ? "검색 결과가 없습니다. 다른 키워드로 다시 검색해 주세요."
              : "등록된 질문이 없습니다."}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col" role="list">
          {filteredItems.map((item, index) => (
            <React.Fragment key={item.id}>
              {index > 0 ? (
                <li aria-hidden className="list-none">
                  <div className="my-0 h-px w-full bg-surface-20" role="separator" />
                </li>
              ) : null}
              <li>
                <InquiryFaqItem
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
      )}

      {onGoToInquiry ? (
        <div
          className={cn(
            "mt-my-8 flex flex-col items-stretch gap-my-12 border-t border-border-10 py-my-20 sm:flex-row sm:items-center sm:justify-between",
            PAGE_FLUSH_CONTENT_PAD_X_CLASS,
          )}
        >
          <p className="text-body3_400 text-on-surface-30">원하는 답변을 찾지 못하셨나요?</p>
          <Button
            type="button"
            variant="outline"
            onClick={onGoToInquiry}
            className="max-lg:h-my-36 max-lg:min-h-my-36 shrink-0"
          >
            1:1 문의하기
          </Button>
        </div>
      ) : null}
    </div>
  );
}
