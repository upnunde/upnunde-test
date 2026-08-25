"use client";

import React, { useState, useEffect } from "react";
import { ICONS } from "@/lib/icons";
import { Button } from "design-system/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "design-system/utils";

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
  const Icon = direction === "prev" ? ICONS.chevronLeft : ICONS.chevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center text-foreground-placeholder hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
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
    "bg-background rounded-b-sm",
    className,
  );

  return (
    <>
      {/* 모바일: 이전 · 현재/전체 · 다음 */}
      <div
        className={cn(
          shellClassName,
          "flex h-14 items-center justify-between gap-3 px-3 sm:hidden",
        )}
      >
        <PageNavButton direction="prev" disabled={!canPrev} onClick={handlePrev} />
        <form onSubmit={handleGo} className="flex min-w-0 items-center justify-center gap-2">
          <Input
            type="number"
            name="page"
            size="sm"
            clearable={false}
            min={1}
            max={totalPages}
            value={pageInputValue}
            onChange={(e) => setPageInputValue(e.target.value)}
            className="w-12 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            aria-label="페이지 번호"
          />
          <span className="shrink-0 text-body3_400 text-foreground-placeholder">/ {totalPages}</span>
        </form>
        <PageNavButton direction="next" disabled={!canNext} onClick={handleNext} />
      </div>

      {/* 데스크톱: 페이지 번호 + Go */}
      <div
        className={cn(
          shellClassName,
          "hidden items-center justify-center gap-8 py-5 sm:flex",
        )}
      >
        <div className="flex items-center gap-1">
          <PageNavButton direction="prev" disabled={!canPrev} onClick={handlePrev} />
          {visiblePages.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={cn(
                "h-8 w-8 cursor-pointer rounded-full text-body3_500 transition-colors",
                page === currentPage
                  ? "bg-inverse text-inverse-foreground"
                  : "text-foreground-placeholder hover:bg-muted",
              )}
              aria-label={`${page}페이지`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          ))}
          <PageNavButton direction="next" disabled={!canNext} onClick={handleNext} />
        </div>

        <form onSubmit={handleGo} className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              name="page"
              size="sm"
              clearable={false}
              min={1}
              max={totalPages}
              value={pageInputValue}
              onChange={(e) => setPageInputValue(e.target.value)}
              className="w-12 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              aria-label="페이지 번호"
            />
            <span className="text-body3_400 text-foreground-placeholder">/ {totalPages}</span>
          </div>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="rounded text-foreground-muted"
          >
            Go
          </Button>
        </form>
      </div>
    </>
  );
}
