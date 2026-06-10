"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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

function PageNavButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center text-on-surface-30 hover:text-on-surface-10 disabled:pointer-events-none disabled:opacity-50"
      aria-label={direction === "prev" ? "이전 페이지" : "다음 페이지"}
    >
      <Icon className="h-4 w-4" aria-hidden />
    </button>
  );
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
    (_, i) => currentGroupStart + i,
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

  const shellClassName = cn(
    "border-t border-divider-10 bg-white rounded-b-[4px]",
    className,
  );

  return (
    <>
      {/* 모바일: 이전 · 현재/전체 · 다음 */}
      <div
        className={cn(
          shellClassName,
          "flex h-14 items-center justify-between gap-my-12 px-my-12 sm:hidden",
        )}
      >
        <PageNavButton direction="prev" disabled={!canPrev} onClick={handlePrev} />
        <form onSubmit={handleGo} className="flex min-w-0 items-center justify-center gap-my-8">
          <input
            type="number"
            name="page"
            min={1}
            max={totalPages}
            value={pageInputValue}
            onChange={(e) => setPageInputValue(e.target.value)}
            className="h-8 w-12 rounded border border-border-10 text-center text-body3_400 outline-none focus:border-border-20"
            aria-label="페이지 번호"
          />
          <span className="shrink-0 text-body3_400 text-on-surface-30">/ {totalPages}</span>
        </form>
        <PageNavButton direction="next" disabled={!canNext} onClick={handleNext} />
      </div>

      {/* 데스크톱: 페이지 번호 + Go */}
      <div
        className={cn(
          shellClassName,
          "hidden h-16 items-center justify-center gap-my-32 sm:flex",
        )}
      >
        <div className="flex items-center gap-my-4">
          <PageNavButton direction="prev" disabled={!canPrev} onClick={handlePrev} />
          {visiblePages.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={cn(
                "h-8 w-8 cursor-pointer rounded-full text-body3_500 transition-colors",
                page === currentPage
                  ? "bg-slate-800 text-white"
                  : "text-on-surface-30 hover:bg-surface-20",
              )}
              aria-label={`${page}페이지`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          ))}
          <PageNavButton direction="next" disabled={!canNext} onClick={handleNext} />
        </div>

        <form onSubmit={handleGo} className="flex items-center gap-my-12">
          <div className="flex items-center gap-my-8">
            <input
              type="number"
              name="page"
              min={1}
              max={totalPages}
              value={pageInputValue}
              onChange={(e) => setPageInputValue(e.target.value)}
              className="h-my-32 w-my-48 rounded border border-border-10 text-center text-body3_400 outline-none focus:border-border-20"
              aria-label="페이지 번호"
            />
            <span className="text-body3_400 text-on-surface-30">/ {totalPages}</span>
          </div>
          <button
            type="submit"
            className="h-8 cursor-pointer rounded border border-border-20 px-my-12 text-body3_500 text-on-surface-20 transition-colors hover:bg-surface-20 disabled:border-border-20"
          >
            Go
          </button>
        </form>
      </div>
    </>
  );
}
