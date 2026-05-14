"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import {
  ANALYTICS_PERIOD_PRESETS,
  formatYmdFull,
  getAnalyticsDateRangeLabel,
  getAnalyticsPeriodWindow,
  isCustomPeriod,
  type AnalyticsPeriodPreset,
  type AnalyticsPeriodRange,
} from "@/components/analytics/analytics-date";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * 분석 기간 통합 피커 — 트리거 하나로 프리셋 + 사용자 지정 기간을 모두 다룬다.
 *
 * 디자인 의도:
 * - 트리거: 적용 중인 절대 날짜를 풀 표기(`YYYY.MM.DD ~ YYYY.MM.DD`)로 노출.
 *   "지난 7일" 같은 추상 라벨보다 운영자가 보는 실제 구간을 즉시 인지하게 한다.
 * - 패널: 프리셋(빈도 높음) → 사용자 지정(가끔) 순으로 시각 위계.
 * - 사용자 지정은 `<input type="date">`로 시작 (수익창출 페이지와 동일 폴백).
 *   풀 캘린더는 디자인 시스템 합의 후 별도 트랙.
 */
export interface AnalyticsPeriodPickerProps {
  value: AnalyticsPeriodRange;
  onChange: (next: AnalyticsPeriodRange) => void;
  /** 트리거 className 보강 (정렬 등) */
  triggerClassName?: string;
  /** 트리거에 적용할 추가 aria-label 컨텍스트 */
  ariaLabelPrefix?: string;
}

const TRIGGER_BASE_CLASS = cn(
  "inline-flex h-10 min-w-0 shrink-0 cursor-pointer items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-on-surface-10 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 data-[state=open]:border-slate-300 data-[state=open]:bg-slate-50",
);

export function AnalyticsPeriodPicker({
  value,
  onChange,
  triggerClassName,
  ariaLabelPrefix = "조회 기간",
}: AnalyticsPeriodPickerProps) {
  const [open, setOpen] = useState(false);

  const triggerLabel = useMemo(
    () => getAnalyticsDateRangeLabel(value, new Date()),
    [value],
  );

  const activePreset: AnalyticsPeriodPreset | null = useMemo(
    () => (typeof value === "string" ? value : null),
    [value],
  );

  /**
   * 사용자 지정 입력 임시값 — 패널 안에서만 살아 있다가 "적용"을 눌러야 부모로 반영.
   * 패널 열릴 때 현재 적용 중인 윈도우로 초기화.
   */
  const [pendingFrom, setPendingFrom] = useState<string>("");
  const [pendingTo, setPendingTo] = useState<string>("");

  useEffect(() => {
    if (!open) return;
    const win = getAnalyticsPeriodWindow(value, new Date());
    setPendingFrom(win.fromYmd ?? "");
    setPendingTo(win.toYmd);
  }, [open, value]);

  const customInvalid =
    !pendingFrom || !pendingTo || pendingFrom > pendingTo;

  function applyPreset(preset: AnalyticsPeriodPreset) {
    onChange(preset);
    setOpen(false);
  }

  function applyCustom() {
    if (customInvalid) return;
    onChange({ fromYmd: pendingFrom, toYmd: pendingTo });
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(TRIGGER_BASE_CLASS, triggerClassName)}
          aria-label={`${ariaLabelPrefix} — 현재 ${triggerLabel}`}
        >
          <CalendarDays className="h-4 w-4 shrink-0 text-on-surface-30" aria-hidden />
          <span className="min-w-0 max-w-[260px] truncate">{triggerLabel}</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-on-surface-30" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[320px] rounded-[4px] border border-border-10 bg-white p-0 shadow-lg"
      >
        <div className="border-b border-border-10/50 px-4 py-3">
          <div className="text-sm font-bold leading-5 text-on-surface-10">기간 선택</div>
          <p className="mt-1 text-xs text-on-surface-30">
            프리셋이나 사용자 지정 기간을 선택해 주세요.
          </p>
        </div>

        <div role="radiogroup" aria-label="프리셋 기간" className="flex flex-col py-1">
          {ANALYTICS_PERIOD_PRESETS.map(({ value: preset, label }) => {
            const checked = activePreset === preset;
            return (
              <button
                key={preset}
                type="button"
                role="radio"
                aria-checked={checked}
                onClick={() => applyPreset(preset)}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-20",
                  checked
                    ? "text-on-surface-10"
                    : "text-on-surface-20",
                )}
              >
                <span>{label}</span>
                {checked ? (
                  <span className="text-xs text-primary" aria-hidden>
                    선택됨
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="border-t border-border-10/50 px-4 py-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-on-surface-30">사용자 지정</span>
            {isCustomPeriod(value) ? (
              <span className="text-xs text-primary" aria-hidden>
                선택됨
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={pendingFrom}
              max={pendingTo || undefined}
              onChange={(e) => setPendingFrom(e.target.value)}
              className="h-9 min-w-0 flex-1 rounded-md border border-border-10 bg-white px-2 text-xs text-on-surface-10 focus:border-primary focus:outline-none"
              aria-label="시작 날짜"
            />
            <span className="text-xs text-on-surface-30">~</span>
            <input
              type="date"
              value={pendingTo}
              min={pendingFrom || undefined}
              onChange={(e) => setPendingTo(e.target.value)}
              className="h-9 min-w-0 flex-1 rounded-md border border-border-10 bg-white px-2 text-xs text-on-surface-10 focus:border-primary focus:outline-none"
              aria-label="종료 날짜"
            />
          </div>
          {pendingFrom && pendingTo && !customInvalid ? (
            <p className="mt-2 text-xs text-on-surface-30">
              {formatYmdFull(pendingFrom)} ~ {formatYmdFull(pendingTo)}
            </p>
          ) : (
            <p className="mt-2 text-xs text-error-error">
              {customInvalid && pendingFrom && pendingTo
                ? "시작일이 종료일보다 늦을 수 없어요."
                : "시작·종료일을 선택해 주세요."}
            </p>
          )}
          <div className="mt-3 flex items-center justify-end">
            <Button
              type="button"
              size="sm"
              onClick={applyCustom}
              disabled={customInvalid}
            >
              적용
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
