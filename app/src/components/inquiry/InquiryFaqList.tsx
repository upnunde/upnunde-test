"use client";

import React, { useMemo, useState } from "react";
import { Button } from "design-system/ui/button";
import { Input } from "@/components/ui/input";
import { filterInquiryFaqItems } from "@/lib/inquiry-faq";
import { PAGE_FLUSH_CONTENT_PAD_X_CLASS } from "@/lib/page-layout";
import { cn } from "design-system/utils";
import { ICONS } from "@/lib/icons";
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
      <div className={cn("py-5", PAGE_FLUSH_CONTENT_PAD_X_CLASS)}>
        <label htmlFor="inquiry-faq-search" className="sr-only">
          자주 받는 질문 검색
        </label>
        <div className="relative">
          <ICONS.search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-placeholder"
            aria-hidden
          />
          <Input
            id="inquiry-faq-search"
            type="text"
            size="default"
            role="searchbox"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="질문·답변 검색"
            className={cn("pl-10", hasSearchQuery && "pr-10")}
            autoComplete="off"
            enterKeyHint="search"
          />
          {hasSearchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-foreground-placeholder transition-colors hover:bg-muted hover:text-foreground-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="검색어 지우기"
            >
              <ICONS.close className="h-4 w-4" aria-hidden />
            </button>
          ) : null}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div
          className={cn(
            "flex flex-col items-center justify-center py-16 text-center",
            PAGE_FLUSH_CONTENT_PAD_X_CLASS,
          )}
        >
          <p className="text-body3_400 text-foreground-placeholder">
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
                  <div className="my-0 h-px w-full bg-background-muted" role="separator" />
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
            "mt-2 flex flex-col items-stretch gap-3 border-t border-border py-5 sm:flex-row sm:items-center sm:justify-between",
            PAGE_FLUSH_CONTENT_PAD_X_CLASS,
          )}
        >
          <p className="text-body3_400 text-foreground-placeholder">원하는 답변을 찾지 못하셨나요?</p>
          <Button
            type="button"
            variant="outline"
            onClick={onGoToInquiry}
            className="max-lg:h-9 max-lg:min-h-9 shrink-0"
          >
            1:1 문의하기
          </Button>
        </div>
      ) : null}
    </div>
  );
}
