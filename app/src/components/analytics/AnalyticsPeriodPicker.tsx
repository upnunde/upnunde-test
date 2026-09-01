"use client";

import { forwardRef, useCallback, useEffect, useMemo, useState, type ComponentPropsWithoutRef } from "react";
import { createPortal } from "react-dom";
import { ICONS } from "@/lib/icons";
import {
  ANALYTICS_PERIOD_PRESETS,
  formatYmdFull,
  getAnalyticsDateRangeCompactLabel,
  getAnalyticsDateRangeLabel,
  getAnalyticsPeriodWindow,
  isCustomPeriod,
  type AnalyticsPeriodPreset,
  type AnalyticsPeriodRange,
} from "@/components/analytics/analytics-date";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button, buttonVariants } from "design-system/ui/button";
import { PeriodRangeCalendar } from "@/components/analytics/PeriodRangeCalendar";
import { analyticsPeriodInlineTriggerClassName } from "@/components/analytics/analytics-filter-chips";
import { useIsMdUp } from "@/hooks/useMediaQuery";
import { PAGE_GUTTER_X_CLASS } from "@/lib/page-layout";
import { chipVariants, filterChipVariantProps, chipGroupGapClass } from "@/lib/chip-styles";
import {
  MOBILE_BOTTOM_SHEET_SCRIM_CLASS,
  MOBILE_BOTTOM_SHEET_SHELL_BASE_CLASS,
  MOBILE_MODAL_TOP_RADIUS_CLASS,
  MOBILE_BOTTOM_SHEET_BOTTOM_RADIUS_CLASS,
  mobileBottomSheetMediumMaxHeightClassName,
} from "@/components/ui/modal/modal-styles";
import { cn } from "design-system/utils";

/**
 * 분석 기간 통합 피커 — 트리거 하나로 프리셋 + 사용자 지정 기간을 모두 다룬다.
 *
 * 디자인 의도:
 * - 트리거: 적용 중인 절대 날짜를 풀 표기(`YYYY.MM.DD ~ YYYY.MM.DD`)로 노출.
 *   "지난 7일" 같은 추상 라벨보다 운영자가 보는 실제 구간을 즉시 인지하게 한다.
 * - 패널: 프리셋(빈도 높음) → 사용자 지정(가끔) 순으로 시각 위계.
 * - 사용자 지정은 한 달 그리드에서 시작·종료를 연속 클릭으로 고른다.
 */
export interface AnalyticsPeriodPickerProps {
  value: AnalyticsPeriodRange;
  onChange: (next: AnalyticsPeriodRange) => void;
  /** 트리거 className 보강 (정렬 등) */
  triggerClassName?: string;
  /** `inline` — 상단 필터 바용 아웃라인 트리거 */
  variant?: "default" | "inline";
  /** 트리거에 적용할 추가 aria-label 컨텍스트 */
  ariaLabelPrefix?: string;
}

/**
 * 트리거는 radix `PopoverTrigger asChild`가 ref·data-state를 주입하므로 forwardRef `<button>` 구조를 유지하되,
 * 표면은 DS `buttonVariants(outline·neutral)`로 생성해 DS 버튼과 동일한 토큰·상태 스타일을 갖게 한다.
 */
const TRIGGER_BASE_CLASS = cn(
  buttonVariants({ variant: "outline", tone: "neutral", size: "default", shape: "square" }),
  "min-w-0 justify-between gap-2 text-body3_500 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
);

const TRIGGER_INLINE_CLASS = analyticsPeriodInlineTriggerClassName;

const PANEL_SHELL_CLASS = cn(
  "w-[320px] border border-border bg-background p-0 shadow-elevation-40 max-lg:w-full max-lg:rounded-none max-lg:border-0 max-lg:shadow-none",
  MOBILE_MODAL_TOP_RADIUS_CLASS,
  MOBILE_BOTTOM_SHEET_BOTTOM_RADIUS_CLASS,
  "lg:rounded-sm",
);

interface PeriodPickerPanelProps {
  activePreset: AnalyticsPeriodPreset | null;
  value: AnalyticsPeriodRange;
  pendingFrom: string;
  pendingTo: string;
  customInvalid: boolean;
  /** 패널을 열 때마다 올려 캘린더 표시 월을 선택 구간에 맞춤 */
  calendarEpoch: number;
  onPresetSelect: (preset: AnalyticsPeriodPreset) => void;
  onPendingRangeChange: (next: { fromYmd: string; toYmd: string }) => void;
  onApplyCustom: () => void;
  /** false — 바텀 시트 헤더와 중복 제거 (모바일) */
  showIntro?: boolean;
}

function PeriodPickerPanel({
  activePreset,
  value,
  pendingFrom,
  pendingTo,
  customInvalid,
  calendarEpoch,
  onPresetSelect,
  onPendingRangeChange,
  onApplyCustom,
  showIntro = true,
}: PeriodPickerPanelProps) {
  return (
    <>
      {showIntro ? (
        <div className={cn("border-b border-border/50 py-3", PAGE_GUTTER_X_CLASS)}>
          <div className="text-body3_700 text-foreground">기간 선택</div>
          <p className="mt-1 text-caption1_400 text-foreground-placeholder">
            프리셋이나 사용자 지정 기간을 선택해 주세요.
          </p>
        </div>
      ) : null}

      <div
        role="radiogroup"
        aria-label="프리셋 기간"
        className={cn("flex flex-wrap py-3", PAGE_GUTTER_X_CLASS, chipGroupGapClass("m"))}
      >
        {ANALYTICS_PERIOD_PRESETS.map(({ value: preset, label }) => {
          const checked = activePreset === preset;
          return (
            <button
              key={preset}
              type="button"
              role="radio"
              aria-checked={checked}
              onClick={() => onPresetSelect(preset)}
              className={cn(
                chipVariants(filterChipVariantProps(checked, "m", "circle")),
                "cursor-pointer",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className={cn("border-t border-border/50 py-3", PAGE_GUTTER_X_CLASS)}>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-caption1_500 text-foreground-placeholder">사용자 지정</span>
          {isCustomPeriod(value) ? (
            <span className="text-caption1_400 text-primary" aria-hidden>
              선택됨
            </span>
          ) : null}
        </div>
        <PeriodRangeCalendar
          key={calendarEpoch}
          fromYmd={pendingFrom}
          toYmd={pendingTo}
          onChange={onPendingRangeChange}
        />
        {pendingFrom && pendingTo && !customInvalid ? (
          <p className="mt-2 text-caption1_400 text-foreground-placeholder">
            {formatYmdFull(pendingFrom)} ~ {formatYmdFull(pendingTo)}
          </p>
        ) : pendingFrom && !pendingTo ? null : (
          <p className="mt-2 text-caption1_400 text-destructive">
            시작일과 종료일을 캘린더에서 선택해 주세요.
          </p>
        )}
        <div className="mt-3 flex items-center justify-end">
          <Button type="button" size="sm" onClick={onApplyCustom} disabled={customInvalid}>
            적용
          </Button>
        </div>
      </div>
    </>
  );
}

type PeriodPickerTriggerProps = Omit<ComponentPropsWithoutRef<"button">, "children"> & {
  variant: "default" | "inline";
  triggerClassName?: string;
  ariaLabelPrefix: string;
  triggerLabel: string;
  triggerCompactLabel: string;
  /** 모바일 단독 트리거 — Popover 미사용 시 aria-expanded 수동 제어 */
  managedOpen?: boolean;
};

const PeriodPickerTrigger = forwardRef<HTMLButtonElement, PeriodPickerTriggerProps>(
  function PeriodPickerTrigger(
    {
      variant,
      triggerClassName,
      ariaLabelPrefix,
      triggerLabel,
      triggerCompactLabel,
      managedOpen,
      className,
      type = "button",
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          variant === "inline" ? TRIGGER_INLINE_CLASS : TRIGGER_BASE_CLASS,
          triggerClassName,
          className,
        )}
        aria-label={`${ariaLabelPrefix} — 현재 ${triggerLabel}`}
        aria-haspopup="dialog"
        {...(managedOpen !== undefined ? { "aria-expanded": managedOpen } : {})}
        {...props}
      >
        <ICONS.calendarDays
          className="hidden h-5 w-5 shrink-0 text-foreground-muted md:block"
          aria-hidden
        />
        {/* 모바일·태블릿: 축약 라벨 / 데스크톱(lg+): 풀 표기 */}
        <span className="min-w-0 truncate text-body2_500 md:text-center md:text-body3_500 lg:hidden">
          {triggerCompactLabel}
        </span>
        <span className="hidden min-w-0 max-w-[280px] truncate text-center text-body3_500 lg:inline">
          {triggerLabel}
        </span>
        <ICONS.chevronDown className="h-4 w-4 shrink-0 text-foreground-muted md:h-5 md:w-5" aria-hidden />
      </button>
    );
  },
);

export function AnalyticsPeriodPicker({
  value,
  onChange,
  triggerClassName,
  variant = "default",
  ariaLabelPrefix = "조회 기간",
}: AnalyticsPeriodPickerProps) {
  const isWideLayout = useIsMdUp();
  const [open, setOpen] = useState(false);

  const triggerLabel = useMemo(
    () => getAnalyticsDateRangeLabel(value, new Date()),
    [value],
  );

  const triggerCompactLabel = useMemo(
    () => getAnalyticsDateRangeCompactLabel(value, new Date()),
    [value],
  );

  const activePreset: AnalyticsPeriodPreset | null = useMemo(
    () => (typeof value === "string" ? value : null),
    [value],
  );

  const [pendingFrom, setPendingFrom] = useState<string>("");
  const [pendingTo, setPendingTo] = useState<string>("");
  const [calendarEpoch, setCalendarEpoch] = useState(0);

  useEffect(() => {
    if (!open) return;
    const win = getAnalyticsPeriodWindow(value, new Date());
    setPendingFrom(win.fromYmd ?? "");
    setPendingTo(win.toYmd);
    setCalendarEpoch((n) => n + 1);
  }, [open, value]);

  const customInvalid = !pendingFrom || !pendingTo || pendingFrom > pendingTo;

  const handlePendingRangeChange = useCallback((next: { fromYmd: string; toYmd: string }) => {
    setPendingFrom(next.fromYmd);
    setPendingTo(next.toYmd);
  }, []);

  const handleDismiss = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (isWideLayout || !open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleDismiss();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleDismiss, isWideLayout, open]);

  function applyPreset(preset: AnalyticsPeriodPreset) {
    // 프리셋 선택 시 패널을 닫지 않는다 — 사용자가 여러 기간을 비교·전환하도록 열린 상태 유지.
    // 닫기는 스크림/닫기 버튼(모바일)·외부 클릭(데스크톱)으로만.
    onChange(preset);
  }

  function applyCustom() {
    if (customInvalid) return;
    onChange({ fromYmd: pendingFrom, toYmd: pendingTo });
    setOpen(false);
  }

  const panel = (
    <PeriodPickerPanel
      activePreset={activePreset}
      value={value}
      pendingFrom={pendingFrom}
      pendingTo={pendingTo}
      customInvalid={customInvalid}
      calendarEpoch={calendarEpoch}
      onPresetSelect={applyPreset}
      onPendingRangeChange={handlePendingRangeChange}
      onApplyCustom={applyCustom}
    />
  );

  const triggerProps = {
    variant,
    triggerClassName,
    ariaLabelPrefix,
    triggerLabel,
    triggerCompactLabel,
  } as const;

  if (!isWideLayout) {
    const mobileSheet =
      open && typeof document !== "undefined"
        ? createPortal(
            <>
              <div className={MOBILE_BOTTOM_SHEET_SCRIM_CLASS} aria-hidden onClick={handleDismiss} />
              <div
                className={cn(
                  MOBILE_BOTTOM_SHEET_SHELL_BASE_CLASS,
                  mobileBottomSheetMediumMaxHeightClassName,
                )}
                role="dialog"
                aria-modal="true"
                aria-label="기간 선택"
              >
                <div
                  className={cn(
                    "flex w-full shrink-0 flex-col gap-1 border-b border-border py-4",
                    PAGE_GUTTER_X_CLASS,
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-body1_700 text-foreground">기간 선택</div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="닫기"
                      onClick={handleDismiss}
                      className="rounded-full text-foreground-placeholder -mr-2"
                    >
                      <ICONS.close className="h-5 w-5" aria-hidden />
                    </Button>
                  </div>
                  <p className="text-caption1_400 text-foreground-placeholder">
                    프리셋이나 사용자 지정 기간을 선택해 주세요.
                  </p>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <PeriodPickerPanel
                    activePreset={activePreset}
                    value={value}
                    pendingFrom={pendingFrom}
                    pendingTo={pendingTo}
                    customInvalid={customInvalid}
                    calendarEpoch={calendarEpoch}
                    onPresetSelect={applyPreset}
                    onPendingRangeChange={handlePendingRangeChange}
                    onApplyCustom={applyCustom}
                    showIntro={false}
                  />
                </div>
              </div>
            </>,
            document.body,
          )
        : null;

    return (
      <>
        <PeriodPickerTrigger
          {...triggerProps}
          managedOpen={open}
          onClick={() => setOpen(true)}
        />
        {mobileSheet}
      </>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <PeriodPickerTrigger {...triggerProps} />
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className={cn(PANEL_SHELL_CLASS, "z-overlay")}>
        {panel}
      </PopoverContent>
    </Popover>
  );
}
