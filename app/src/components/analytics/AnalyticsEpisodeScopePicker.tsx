"use client";

import { useMemo } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { analyticsGhostDropdownChipClassName } from "@/components/analytics/analytics-filter-chips";
import { getSeriesEpisodeOptions } from "@/components/analytics/analytics-dummy-by-scope";
import type { AnalyticsSeriesId } from "@/components/analytics/analytics-series-options";
import { cn } from "@/lib/utils";

/** 주요통계 등 패널 단위 회차 집계 — 페이지 전역 필터가 아님 */
export function AnalyticsEpisodeScopePicker({
  seriesId,
  value,
  onChange,
}: {
  seriesId: AnalyticsSeriesId;
  value: "all" | number;
  onChange: (v: "all" | number) => void;
}) {
  const episodeOptions = useMemo(() => getSeriesEpisodeOptions(seriesId), [seriesId]);

  const label = useMemo(() => {
    if (value === "all") return "작품 전체";
    const found = episodeOptions.find((o) => o.episodeNo === value);
    return found ? `${found.episodeNo}화 ${found.title}` : "작품 전체";
  }, [value, episodeOptions]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(analyticsGhostDropdownChipClassName, "shrink-0")}
          aria-label={`집계 회차 — ${label}`}
          title={label}
        >
          <span className="min-w-0 max-w-[200px] truncate">{label}</span>
          <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[220px]">
        <DropdownMenuRadioGroup
          value={String(value)}
          onValueChange={(v) => onChange(v === "all" ? "all" : Number(v))}
        >
          <DropdownMenuRadioItem value="all">작품 전체</DropdownMenuRadioItem>
          {episodeOptions.map((opt) => (
            <DropdownMenuRadioItem key={opt.episodeNo} value={String(opt.episodeNo)}>
              {opt.episodeNo}화 {opt.title}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
