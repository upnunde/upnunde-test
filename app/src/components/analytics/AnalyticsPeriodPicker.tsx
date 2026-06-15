"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, ChevronDown, X } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { analyticsPeriodInlineTriggerClassName } from "@/components/analytics/analytics-filter-chips";
import { useIsLgUp } from "@/hooks/useMediaQuery";
import { PAGE_GUTTER_X_CLASS } from "@/lib/page-layout";
import { MOBILE_BOTTOM_SHEET_SCRIM_CLASS, MOBILE_BOTTOM_SHEET_SHELL_BASE_CLASS, MOBILE_MODAL_RADIUS_CLASS, mobileBottomSheetMediumMaxHeightClassName } from "@/components/ui/modal/modal-styles";
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
  /** `inline` — 상단 컨텍스트 바용 보더 없는 트리거 */
  variant?: "default" | "inline";
  /** 트리거에 적용할 추가 aria-label 컨텍스트 */
  ariaLabelPrefix?: string;
}

const TRIGGER_BASE_CLASS = cn(
  "inline-flex h-9 min-w-0 shrink-0 cursor-pointer items-center justify-between gap-my-8 rounded-md border border-slate-200 bg-white px-my-12 text-body3_500 text-on-surface-10 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 data-[state=open]:border-slate-300 data-[state=open]:bg-slate-50",
);

const TRIGGER_INLINE_CLASS = analyticsPeriodInlineTriggerClassName;

const PANEL_SHELL_CLASS = cn(
  "w-[320px] border border-border-10 bg-white p-0 shadow-elevation-40 max-lg:w-full max-lg:rounded-none max-lg:border-0 max-lg:shadow-none",
  MOBILE_MODAL_RADIUS_CLASS,
  "lg:rounded-[4px]",
);

interface PeriodPickerPanelProps {
  activePreset: AnalyticsPeriodPreset | null;
  value: AnalyticsPeriodRange;
  pendingFrom: string;
  pendingTo: string;
  customInvalid: boolean;
  onPresetSelect: (preset: AnalyticsPeriodPreset) => void;
  onPendingFromChange: (value: string) => void;
  onPendingToChange: (value: string) => void;
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
  onPresetSelect,
  onPendingFromChange,
  onPendingToChange,
  onApplyCustom,
  showIntro = true,
}: PeriodPickerPanelProps) {
  return (
    <>
      {showIntro ? (
        <div className={cn("border-b border-border-10/50 py-my-12", PAGE_GUTTER_X_CLASS)}>
          <div className="text-body3_700 text-on-surface-10">기간 선택</div>
          <p className="mt-1 text-caption1_400 text-on-surface-30">
            프리셋이나 사용자 지정 기간을 선택해 주세요.
          </p>
        </div>
      ) : null}

      <div role="radiogroup" aria-label="프리셋 기간" className="flex flex-col py-my-4">
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
                "flex w-full cursor-pointer items-center justify-between px-my-16 py-my-8 text-body3_500 transition-colors hover:bg-surface-20",
                checked ? "text-on-surface-10" : "text-on-surface-20",
              )}
            >
              <span>{label}</span>
              {checked ? (
                <span className="text-caption1_400 text-primary" aria-hidden>
                  선택됨
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className={cn("border-t border-border-10/50 py-my-12", PAGE_GUTTER_X_CLASS)}>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-caption1_500 text-on-surface-30">사용자 지정</span>
          {isCustomPeriod(value) ? (
            <span className="text-caption1_400 text-primary" aria-hidden>
              선택됨
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-my-8">
          <input
            type="date"
            value={pendingFrom}
            max={pendingTo || undefined}
            onChange={(e) => onPendingFromChange(e.target.value)}
            className="h-8 min-w-0 flex-1 rounded-md border border-border-10 bg-white px-my-8 text-caption1_400 text-on-surface-10 focus:border-primary focus:outline-none"
            aria-label="시작 날짜"
          />
          <span className="text-caption1_400 text-on-surface-30">~</span>
          <input
            type="date"
            value={pendingTo}
            min={pendingFrom || undefined}
            onChange={(e) => onPendingToChange(e.target.value)}
            className="h-8 min-w-0 flex-1 rounded-md border border-border-10 bg-white px-my-8 text-caption1_400 text-on-surface-10 focus:border-primary focus:outline-none"
            aria-label="종료 날짜"
          />
        </div>
        {pendingFrom && pendingTo && !customInvalid ? (
          <p className="mt-2 text-caption1_400 text-on-surface-30">
            {formatYmdFull(pendingFrom)} ~ {formatYmdFull(pendingTo)}
          </p>
        ) : (
          <p className="mt-2 text-caption1_400 text-error-error">
            {customInvalid && pendingFrom && pendingTo
              ? "시작일이 종료일보다 늦을 수 없어요."
              : "시작·종료일을 선택해 주세요."}
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

function PeriodPickerTrigger({
  variant,
  triggerClassName,
  ariaLabelPrefix,
  triggerLabel,
  triggerCompactLabel,
  open,
  onClick,
}: {
  variant: "default" | "inline";
  triggerClassName?: string;
  ariaLabelPrefix: string;
  triggerLabel: string;
  triggerCompactLabel: string;
  open: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(variant === "inline" ? TRIGGER_INLINE_CLASS : TRIGGER_BASE_CLASS, triggerClassName)}
      aria-label={`${ariaLabelPrefix} — 현재 ${triggerLabel}`}
      aria-expanded={open}
      aria-haspopup="dialog"
      onClick={onClick}
    >
      <CalendarDays
        className="h-5 w-5 shrink-0 text-on-surface-20 max-sm:hidden"
        aria-hidden
      />
      <span className="min-w-0 truncate text-center text-body3_500 sm:hidden">
        {triggerCompactLabel}
      </span>
      <span className="hidden min-w-0 max-w-[280px] truncate text-center text-body3_500 sm:inline">
        {triggerLabel}
      </span>
      <ChevronDown className="h-4 w-4 shrink-0 text-on-surface-20 sm:h-5 sm:w-5" aria-hidden />
    </button>
  );
}

export function AnalyticsPeriodPicker({
  value,
  onChange,
  triggerClassName,
  variant = "default",
  ariaLabelPrefix = "조회 기간",
}: AnalyticsPeriodPickerProps) {
  const isDesktop = useIsLgUp();
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

  useEffect(() => {
    if (!open) return;
    const win = getAnalyticsPeriodWindow(value, new Date());
    setPendingFrom(win.fromYmd ?? "");
    setPendingTo(win.toYmd);
  }, [open, value]);

  const customInvalid = !pendingFrom || !pendingTo || pendingFrom > pendingTo;

  const handleDismiss = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (isDesktop || !open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleDismiss();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleDismiss, isDesktop, open]);

  function applyPreset(preset: AnalyticsPeriodPreset) {
    onChange(preset);
    setOpen(false);
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
      onPresetSelect={applyPreset}
      onPendingFromChange={setPendingFrom}
      onPendingToChange={setPendingTo}
      onApplyCustom={applyCustom}
    />
  );

  const trigger = (
    <PeriodPickerTrigger
      variant={variant}
      triggerClassName={triggerClassName}
      ariaLabelPrefix={ariaLabelPrefix}
      triggerLabel={triggerLabel}
      triggerCompactLabel={triggerCompactLabel}
      open={open}
      onClick={isDesktop ? undefined : () => setOpen(true)}
    />
  );

  if (!isDesktop) {
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
                    "flex w-full shrink-0 flex-col gap-my-4 border-b border-border-10 py-my-16",
                    PAGE_GUTTER_X_CLASS,
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-body1_700 text-on-surface-10">기간 선택</div>
                    <button
                      type="button"
                      aria-label="닫기"
                      onClick={handleDismiss}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-on-surface-30 transition-colors hover:bg-surface-20/60 hover:text-on-surface-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                      style={{ marginRight: -8 }}
                    >
                      <X className="h-5 w-5" aria-hidden />
                    </button>
                  </div>
                  <p className="text-caption1_400 text-on-surface-30">
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
                    onPresetSelect={applyPreset}
                    onPendingFromChange={setPendingFrom}
                    onPendingToChange={setPendingTo}
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
        {trigger}
        {mobileSheet}
      </>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className={PANEL_SHELL_CLASS}>
        {panel}
      </PopoverContent>
    </Popover>
  );
}
