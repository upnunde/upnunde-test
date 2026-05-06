"use client";

import { useMemo, useState } from "react";
import { SegmentedTextTabs } from "@/components/ui/segmented-text-tabs";
import { AnalyticsContentTab } from "@/components/analytics/AnalyticsContentTab";
import { AnalyticsUserTab } from "@/components/analytics/AnalyticsUserTab";
import { getAnalyticsDateRangeLabel, type AnalyticsPeriodRange } from "@/components/analytics/analytics-date";

export type { AnalyticsPeriodRange } from "@/components/analytics/analytics-date";

type AnalyticsAreaTabId = "content" | "user";

export function AnalyticsDashboard() {
  const [periodRange, setPeriodRange] = useState<AnalyticsPeriodRange>("7d");
  const [analyticsArea, setAnalyticsArea] = useState<AnalyticsAreaTabId>("content");
  const dateRangeLabel = useMemo(
    () => getAnalyticsDateRangeLabel(periodRange, new Date()),
    [periodRange],
  );

  return (
    <div className="flex w-full flex-col items-stretch">
      <div className="inline-flex flex-col items-start justify-start gap-2.5 self-stretch border-b border-border-10 px-0 pb-2.5 pt-5">
        <SegmentedTextTabs
          aria-label="분석 영역"
          items={[
            { id: "content", label: "콘텐츠" },
            { id: "user", label: "이용자" },
          ]}
          activeId={analyticsArea}
          onSelect={(id) => setAnalyticsArea(id as AnalyticsAreaTabId)}
          size="xl"
          tabListClassName="self-stretch"
        />
      </div>

      {analyticsArea === "content" ? (
        <AnalyticsContentTab
          periodRange={periodRange}
          onPeriodRangeChange={setPeriodRange}
          dateRangeLabel={dateRangeLabel}
        />
      ) : (
        <AnalyticsUserTab
          periodRange={periodRange}
          onPeriodRangeChange={setPeriodRange}
          dateRangeLabel={dateRangeLabel}
        />
      )}
    </div>
  );
}
