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

/** 시리즈 회차 옵션 (드롭다운 등) */
export type EpisodeOption = {
  episodeNo: number;
  title: string;
};

/** 회차 단위 주요통계 + 추세 — 시리즈 칩에서 특정 회차를 골랐을 때 */
export type EpisodePrimaryStatsDummy = {
  episodeNo: number;
  title: string;
  primary: PrimaryStatDummy[];
  chartSeries: Record<AnalyticsPrimaryMetric, number[]>;
};

export type MonetizationStatDummy = {
  value: string;
  delta: string;
  deltaTone: DeltaTone;
};

/** 수익 탭 더미 — 범위·기간·하위 탭(작품/캐릭터/회차)에 따라 변함 */
export type MonetizationDummyByScope = {
  stats: {
    expectedRevenue: MonetizationStatDummy;
    purchaseCount: MonetizationStatDummy;
    purchaseRate: MonetizationStatDummy;
  };
  chartSeries: {
    expectedRevenue: number[];
    purchaseCount: number[];
    purchaseRate: number[];
  };
  top5: AnalyticsTopFiveRow[];
  monthlyRevenue: { year: number; month: number; label: string; amount: number; inProgress?: boolean }[];
};
