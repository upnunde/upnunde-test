"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { ICONS } from "@/lib/icons";
import { formatYmdFull, getSeoulCalendarYmd } from "@/components/analytics/analytics-date";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "design-system/utils";

/** 예약 공개 시간 옵션 간격(분) */
const TIME_STEP_MINUTES = 30;

function formatTimeDisplay(hhmm: string): string {
  if (!hhmm || !/^\d{2}:\d{2}$/.test(hhmm)) return "시간 선택";
  const [hRaw, m] = hhmm.split(":");
  const h24 = Number(hRaw);
  if (Number.isNaN(h24)) return "시간 선택";
  const period = h24 < 12 ? "오전" : "오후";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${period} ${String(h12).padStart(2, "0")}:${m}`;
}

function buildTimeOptions(includeValue?: string): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  for (let total = 0; total < 24 * 60; total += TIME_STEP_MINUTES) {
    const h = Math.floor(total / 60);
    const m = total % 60;
    const value = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    options.push({ value, label: formatTimeDisplay(value) });
  }

  if (includeValue && /^\d{2}:\d{2}$/.test(includeValue)) {
    const exists = options.some((opt) => opt.value === includeValue);
    if (!exists) {
      options.push({ value: includeValue, label: formatTimeDisplay(includeValue) });
      options.sort((a, b) => a.value.localeCompare(b.value));
    }
  }

  return options;
}

const dateDisplayClassName = cn(
  "inline-flex h-9 min-w-0 flex-1 items-center justify-between gap-2 rounded-lg border border-border-emphasis bg-transparent px-2.5 text-left text-body3_400 text-foreground",
);

export interface ScheduledPublishDateTimeFieldsProps {
  date: string;
  time: string;
  onDateChange: (ymd: string) => void;
  onTimeChange: (hhmm: string) => void;
  className?: string;
}

/**
 * 예약 공개 날짜·시간.
 * 날짜는 DS 트리거 + 브라우저/OS 네이티브 date picker.
 * 시간은 DS Select — Dialog 콘텐츠로 포털.
 */
export function ScheduledPublishDateTimeFields({
  date,
  time,
  onDateChange,
  onTimeChange,
  className,
}: ScheduledPublishDateTimeFieldsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const minYmd = getSeoulCalendarYmd(new Date());
  const timeOptions = useMemo(() => buildTimeOptions(time), [time]);

  useLayoutEffect(() => {
    setPortalContainer(
      rootRef.current?.closest<HTMLElement>("[data-slot='dialog-content']") ?? null,
    );
  }, []);

  const openNativeDatePicker = () => {
    const input = dateInputRef.current;
    if (!input) return;
    try {
      if (typeof input.showPicker === "function") {
        input.showPicker();
        return;
      }
    } catch {
      // showPicker는 사용자 제스처·보안 정책에 막힐 수 있음 → focus/click 폴백
    }
    input.focus();
    input.click();
  };

  return (
    <div ref={rootRef} className={cn("space-y-2", className)}>
      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <button
            type="button"
            className={cn(dateDisplayClassName, "w-full cursor-pointer transition-colors hover:bg-muted/50")}
            aria-label="공개 날짜 선택"
            onClick={openNativeDatePicker}
          >
            <span className={cn("truncate", !date && "text-foreground-placeholder")}>
              {date ? formatYmdFull(date) : "날짜 선택"}
            </span>
            <ICONS.calendar className="h-4 w-4 shrink-0 text-foreground-muted" aria-hidden />
          </button>
          {/* 네이티브 피커만 사용. 필드는 시각적으로 숨기고 showPicker로 호출 */}
          <input
            ref={dateInputRef}
            type="date"
            value={date || ""}
            min={minYmd}
            onChange={(event) => {
              const next = event.target.value;
              if (next) onDateChange(next);
            }}
            aria-hidden
            tabIndex={-1}
            className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
          />
        </div>

        <Select
          value={time || null}
          onValueChange={(next) => {
            if (next) onTimeChange(next);
          }}
          items={timeOptions}
        >
          <SelectTrigger
            size="default"
            className="w-[8.75rem] shrink-0"
            aria-label="공개 시간"
          >
            <SelectValue placeholder="시간 선택" />
          </SelectTrigger>
          <SelectContent
            alignItemWithTrigger={false}
            align="end"
            sideOffset={8}
            container={portalContainer}
          >
            {timeOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
