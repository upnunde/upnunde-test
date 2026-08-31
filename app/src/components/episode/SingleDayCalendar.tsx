"use client";

import { useEffect, useMemo, useState } from "react";
import { ICONS } from "@/lib/icons";
import { getSeoulCalendarYmd } from "@/components/analytics/analytics-date";
import { cn } from "design-system/utils";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

function parseYmd(ymd: string): { y: number; m: number; d: number } {
  const [y, m, d] = ymd.split("-").map(Number);
  return { y: y ?? 1970, m: m ?? 1, d: d ?? 1 };
}

function ymdFromParts(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
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

/** 선택 가능 월로 뷰 시드 — value가 min보다 이전이면 min 월을 연다 */
function resolveViewSeed(value: string, floorYmd: string, todayYmd: string): string {
  if (value && value >= floorYmd) return value;
  return floorYmd || todayYmd;
}

export interface SingleDayCalendarProps {
  value: string;
  onChange: (ymd: string) => void;
  /** 선택 가능 하한 (기본: 서울 기준 오늘) */
  minYmd?: string;
  className?: string;
}

/** 한 달 그리드에서 하루를 고르는 캘린더 — 예약 공개 날짜용 */
export function SingleDayCalendar({
  value,
  onChange,
  minYmd,
  className,
}: SingleDayCalendarProps) {
  const todayYmd = getSeoulCalendarYmd(new Date());
  const floorYmd = minYmd ?? todayYmd;
  const seedYmd = resolveViewSeed(value, floorYmd, todayYmd);
  const seedParts = parseYmd(seedYmd);
  const [viewY, setViewY] = useState(seedParts.y);
  const [viewM, setViewM] = useState(seedParts.m);

  // value·하한이 바뀔 때만 월 시드. 월 이동(shiftMonth)은 건드리지 않는다.
  useEffect(() => {
    const next = resolveViewSeed(value, floorYmd, todayYmd);
    const parts = parseYmd(next);
    setViewY(parts.y);
    setViewM(parts.m);
  }, [value, floorYmd, todayYmd]);

  const cells = useMemo(() => buildMonthCells(viewY, viewM), [viewY, viewM]);

  function shiftMonth(delta: number) {
    const next = new Date(Date.UTC(viewY, viewM - 1 + delta, 1));
    setViewY(next.getUTCFullYear());
    setViewM(next.getUTCMonth() + 1);
  }

  const canGoPrev = (() => {
    const prevLast = new Date(Date.UTC(viewY, viewM - 1, 0));
    const prevLastYmd = ymdFromParts(
      prevLast.getUTCFullYear(),
      prevLast.getUTCMonth() + 1,
      prevLast.getUTCDate(),
    );
    return prevLastYmd >= floorYmd;
  })();

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          disabled={!canGoPrev}
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-40"
          aria-label="이전 달"
        >
          <ICONS.chevronLeft className="h-4 w-4" aria-hidden />
        </button>
        <div className="text-body3_700 text-foreground" aria-live="polite">
          {viewY}년 {viewM}월
        </div>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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

      <div className="grid grid-cols-7 gap-0.5" role="grid" aria-label="날짜 선택 캘린더">
        {cells.map((ymd, index) => {
          if (!ymd) {
            return <div key={`empty-${index}`} className="h-9" aria-hidden />;
          }

          const disabled = ymd < floorYmd;
          const selected = value === ymd;
          const isToday = ymd === todayYmd;
          const dayNum = parseYmd(ymd).d;

          return (
            <button
              key={ymd}
              type="button"
              role="gridcell"
              disabled={disabled}
              aria-label={ymd}
              aria-selected={selected}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onChange(ymd);
              }}
              className={cn(
                "relative flex h-9 cursor-pointer items-center justify-center text-caption1_500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-30",
                selected && "bg-primary text-primary-foreground",
                !selected && !disabled && "text-foreground hover:bg-muted",
                isToday && !selected && "font-semibold",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full",
                  isToday && !selected && "ring-1 ring-inset ring-border",
                )}
              >
                {dayNum}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
