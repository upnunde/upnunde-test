"use client";

import { useMemo, useState } from "react";
import { ICONS } from "@/lib/icons";
import { getSeoulCalendarYmd } from "@/components/analytics/analytics-date";
import { cn } from "design-system/utils";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

function parseYmd(ymd: string): { y: number; m: number; d: number } {
  const [y, m, d] = ymd.split("-").map(Number);
  return { y, m, d };
}

function ymdFromParts(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function monthLabel(y: number, m: number): string {
  return `${y}년 ${m}월`;
}

function buildMonthCells(y: number, m: number): (string | null)[] {
  const firstWeekday = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells: (string | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(ymdFromParts(y, m, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export interface PeriodRangeCalendarProps {
  fromYmd: string;
  toYmd: string;
  onChange: (next: { fromYmd: string; toYmd: string }) => void;
  /** 선택 가능 상한 (기본: 서울 기준 오늘) */
  maxYmd?: string;
  className?: string;
}

/**
 * 한 달 그리드에서 시작·종료일을 클릭으로 고르는 범위 캘린더.
 * 1번째 클릭 = 시작, 2번째 = 종료(역순이면 자동 정렬). 구간이 채워진 뒤 다시 클릭하면 새 시작.
 */
export function PeriodRangeCalendar({
  fromYmd,
  toYmd,
  onChange,
  maxYmd,
  className,
}: PeriodRangeCalendarProps) {
  const todayYmd = getSeoulCalendarYmd(new Date());
  const capYmd = maxYmd ?? todayYmd;

  const initial = fromYmd || toYmd || todayYmd;
  const initialParts = parseYmd(initial);
  const [viewY, setViewY] = useState(initialParts.y);
  const [viewM, setViewM] = useState(initialParts.m);

  const cells = useMemo(() => buildMonthCells(viewY, viewM), [viewY, viewM]);

  const rangeComplete = Boolean(fromYmd && toYmd);

  function shiftMonth(delta: number) {
    const next = new Date(Date.UTC(viewY, viewM - 1 + delta, 1));
    setViewY(next.getUTCFullYear());
    setViewM(next.getUTCMonth() + 1);
  }

  function handleDayClick(ymd: string) {
    if (ymd > capYmd) return;

    if (!fromYmd || rangeComplete) {
      onChange({ fromYmd: ymd, toYmd: "" });
      return;
    }

    if (ymd < fromYmd) {
      onChange({ fromYmd: ymd, toYmd: fromYmd });
      return;
    }

    onChange({ fromYmd, toYmd: ymd });
  }

  const canGoNext = (() => {
    const next = new Date(Date.UTC(viewY, viewM, 1));
    const nextStart = ymdFromParts(next.getUTCFullYear(), next.getUTCMonth() + 1, 1);
    return nextStart <= capYmd;
  })();

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="이전 달"
        >
          <ICONS.chevronLeft className="h-4 w-4" aria-hidden />
        </button>
        <div className="text-body3_700 text-foreground" aria-live="polite">
          {monthLabel(viewY, viewM)}
        </div>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          disabled={!canGoNext}
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-40"
          aria-label="다음 달"
        >
          <ICONS.chevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-0.5" role="row">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="flex h-7 items-center justify-center text-caption1_400 text-foreground-placeholder"
            aria-hidden
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5" role="grid" aria-label="기간 선택 캘린더">
        {cells.map((ymd, index) => {
          if (!ymd) {
            return <div key={`empty-${index}`} className="h-9" aria-hidden />;
          }

          const disabled = ymd > capYmd;
          const isFrom = fromYmd === ymd;
          const isTo = toYmd === ymd;
          const inRange =
            Boolean(fromYmd && toYmd) && ymd > fromYmd && ymd < toYmd;
          const isToday = ymd === todayYmd;
          const isEndpoint = isFrom || isTo;
          const dayNum = parseYmd(ymd).d;

          return (
            <button
              key={ymd}
              type="button"
              role="gridcell"
              disabled={disabled}
              aria-label={ymd}
              aria-selected={isEndpoint || inRange}
              onClick={() => handleDayClick(ymd)}
              className={cn(
                "relative flex h-9 cursor-pointer items-center justify-center text-caption1_500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-30",
                inRange && "bg-primary/10 text-foreground",
                isEndpoint && "bg-primary text-primary-foreground",
                !isEndpoint && !inRange && !disabled && "text-foreground hover:bg-muted",
                isToday && !isEndpoint && "font-semibold",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full",
                  isToday && !isEndpoint && "ring-1 ring-inset ring-border",
                )}
              >
                {dayNum}
              </span>
            </button>
          );
        })}
      </div>

      {!rangeComplete && fromYmd ? (
        <p className="mt-2 text-caption1_400 text-foreground-placeholder">
          종료일을 선택해 주세요.
        </p>
      ) : null}
    </div>
  );
}
