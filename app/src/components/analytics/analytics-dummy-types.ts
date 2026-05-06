import type { AnalyticsPrimaryMetric } from "@/components/analytics/AnalyticsTrendLineChart";
import type { AnalyticsUserMetric } from "@/components/analytics/AnalyticsTrendLineChart";
import type { AnalyticsTopFiveRow } from "@/components/analytics/AnalyticsRankParts";

export type DeltaTone = "gain" | "loss" | "neutral";

export type PrimaryStatDummy = {
  id: AnalyticsPrimaryMetric;
  value: string;
  delta: string;
  deltaTone: DeltaTone;
};

export type UserPrimaryStatDummy = {
  id: AnalyticsUserMetric;
  value: string;
  delta: string;
  deltaTone: DeltaTone;
};

type RevisitSegmentId = "once" | "twice" | "threePlus";

export type ContentDummyByScope = {
  primary: PrimaryStatDummy[];
  revisit: Record<RevisitSegmentId, { revisitPct: number; noRevisitPct: number }>;
  top5: AnalyticsTopFiveRow[];
  chartSeries: Record<AnalyticsPrimaryMetric, number[]>;
};

export type ActiveFollowerDummy = { id: string; nick: string };

export type UserDummyByScope = {
  primary: UserPrimaryStatDummy[];
  listA: AnalyticsTopFiveRow[];
  listBCounts: string[];
  chartSeries: Record<AnalyticsUserMetric, number[]>;
  gender: { flex: [number, number, number]; legend: [string, string, string] };
  age: { flex: [number, number, number, number, number]; legend: [string, string, string, string, string] };
  avgTime: { flex: [number, number, number]; legend: [string, string, string] };
  userMix: { flex: [number, number, number]; legend: [string, string, string] };
  timeOfDayHourly: readonly number[];
  activeFollowers: ActiveFollowerDummy[];
};
