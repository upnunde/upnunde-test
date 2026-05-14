"use client";

import { cn } from "@/lib/utils";

export type MonthlyRevenueRow = {
  year: number;
  month: number;
  label: string;
  amount: number;
  inProgress?: boolean;
};

function formatWon(amount: number): string {
  return `₩${Math.round(amount).toLocaleString("ko-KR")}`;
}

/** 수익 탭 — 최근 6개월 월별 추정 수익 (가로 막대, 최신 월 우선) */
export function AnalyticsMonthlyRevenueBars({
  rows,
  className,
}: {
  rows: readonly MonthlyRevenueRow[];
  className?: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.amount));
  const ordered = [...rows].reverse();

  return (
    <ul className={cn("flex flex-col gap-4", className)}>
      {ordered.map((row) => {
        const pct = Math.max(4, Math.round((row.amount / max) * 100));
        return (
          <li
            key={`${row.year}-${row.month}`}
            className="grid grid-cols-[minmax(56px,72px)_1fr_minmax(88px,auto)] items-center gap-3"
          >
            <div className="min-w-0 text-sm font-medium leading-5 text-on-surface-20">
              <span className="truncate">{row.label}</span>
              {row.inProgress ? (
                <span className="ml-1 text-xs font-normal text-on-surface-30">(진행 중)</span>
              ) : null}
            </div>
            <div className="h-3 min-w-0 rounded-[2px] bg-surface-20">
              <div
                className="h-full rounded-[2px] bg-primary transition-[width]"
                style={{ width: `${pct}%` }}
                role="presentation"
              />
            </div>
            <p className="text-right text-sm font-bold tabular-nums leading-5 text-on-surface-10">
              {formatWon(row.amount)}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
