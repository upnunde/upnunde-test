"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;
const MAX_VISIBLE_PAGES = 9;

export interface PaginationProps {
  /** 현재 페이지 (1-based) */
  currentPage: number;
  /** 전체 아이템 수 */
  totalItems: number;
  /** 페이지 변경 콜백 (1-based) */
  onPageChange: (page: number) => void;
  /** 한 페이지당 개수 (기본 10, 정책 13) */
  pageSize?: number;
  className?: string;
}

/**
 * 리스트 10개 초과 시 하단 페이지네이션 (정책 13)
 */
export function Pagination({
  currentPage,
  totalItems,
  onPageChange,
  pageSize = PAGE_SIZE,
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;
  const currentGroupStart =
    Math.floor((currentPage - 1) / MAX_VISIBLE_PAGES) * MAX_VISIBLE_PAGES + 1;
  const currentGroupEnd = Math.min(totalPages, currentGroupStart + MAX_VISIBLE_PAGES - 1);
  const visiblePages = Array.from(
    { length: currentGroupEnd - currentGroupStart + 1 },
    (_, i) => currentGroupStart + i
  );

  /** 입력 필드와 현재 페이지 위치값 매칭 */
  const [pageInputValue, setPageInputValue] = useState(String(currentPage));
  useEffect(() => {
    setPageInputValue(String(currentPage));
  }, [currentPage]);

  const handlePrev = () => {
    if (canPrev) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (canNext) onPageChange(currentPage + 1);
  };

  const handleGo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = parseInt(pageInputValue, 10);
    if (!Number.isNaN(value) && value >= 1 && value <= totalPages) {
      onPageChange(value);
    } else {
      setPageInputValue(String(currentPage));
    }
  };

  return (
    <div
      className={
        "flex h-16 items-center justify-center gap-8 border-t border-slate-100 bg-white rounded-b-2xl " +
        (className ?? "")
      }
    >
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handlePrev}
          disabled={!canPrev}
          className="flex h-8 w-8 cursor-pointer items-center justify-center text-on-surface-30 hover:text-on-surface-10 disabled:opacity-50 disabled:pointer-events-none"
          aria-label="이전 페이지"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {visiblePages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={
              "h-8 w-8 rounded-full cursor-pointer text-sm font-medium transition-colors " +
              (page === currentPage
                ? "bg-slate-800 text-white"
                : "text-on-surface-30 hover:bg-surface-20")
            }
            aria-label={`${page}페이지`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          onClick={handleNext}
          disabled={!canNext}
          className="flex h-8 w-8 cursor-pointer items-center justify-center text-on-surface-30 hover:text-on-surface-10 disabled:opacity-50 disabled:pointer-events-none"
          aria-label="다음 페이지"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleGo} className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="page"
            min={1}
            max={totalPages}
            value={pageInputValue}
            onChange={(e) => setPageInputValue(e.target.value)}
            className="h-8 w-12 rounded border border-border-10 text-center text-sm outline-none focus:border-border-20"
            aria-label="페이지 번호"
          />
          <span className="text-sm text-on-surface-30">/ {totalPages}</span>
        </div>
        <button
          type="submit"
          className="h-8 cursor-pointer rounded border border-border-10 px-3 text-sm font-medium text-on-surface-20 transition-colors hover:bg-surface-20"
        >
          Go
        </button>
      </form>
    </div>
  );
}
