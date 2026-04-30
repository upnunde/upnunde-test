import type { AnalyticsPrimaryMetric } from "@/components/analytics/AnalyticsTrendLineChart";
import type { AnalyticsUserMetric } from "@/components/analytics/AnalyticsTrendLineChart";
import type { AnalyticsTopFiveRow } from "@/components/analytics/AnalyticsRankParts";
import type { AnalyticsScopeCategoryId } from "@/components/analytics/analytics-scope-category";

type RevisitSegmentId = "once" | "twice" | "threePlus";

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

export type ContentDummyByScope = {
  primary: PrimaryStatDummy[];
  revisit: Record<RevisitSegmentId, { revisitPct: number; noRevisitPct: number }>;
  top5: AnalyticsTopFiveRow[];
  chartSeries: Record<AnalyticsPrimaryMetric, number[]>;
};

export type UserDummyByScope = {
  primary: UserPrimaryStatDummy[];
  listA: AnalyticsTopFiveRow[];
  listBCounts: string[];
  chartSeries: Record<AnalyticsUserMetric, number[]>;
  gender: { flex: [number, number, number]; legend: [string, string, string] };
  age: { flex: [number, number, number, number, number]; legend: [string, string, string, string, string] };
  avgTime: { flex: [number, number, number]; legend: [string, string, string] };
  userMix: { flex: [number, number, number]; legend: [string, string, string] };
  timeOfDay: { flex: [number, number, number, number]; legend: [string, string, string, string] };
};

const CHART_ALL: Record<AnalyticsPrimaryMetric, number[]> = {
  views: [820, 910, 1100, 1420, 1680, 1750, 1720, 1600, 1480, 1210, 980],
  watchTime: [118, 125, 132, 140, 155, 160, 158, 150, 145, 130, 122],
  likes: [2100, 2150, 2220, 2280, 2320, 2350, 2340, 2300, 2250, 2200, 2180],
  comments: [280, 295, 310, 322, 335, 340, 338, 330, 318, 305, 292],
  shares: [320, 335, 348, 360, 372, 378, 375, 368, 355, 342, 330],
};

const TOP5_ALL: AnalyticsTopFiveRow[] = [
  { rank: 1, badge: "시리즈", title: "꽃에게는 독이 필요하다", tone: "series" },
  { rank: 2, badge: "캐릭터", title: "강백호", tone: "character" },
  { rank: 3, badge: "시리즈", title: "여름의 기억", tone: "series" },
  { rank: 4, badge: "시리즈", title: "바람이 전하는 이야기", tone: "seriesBlue" },
  { rank: 5, badge: "상황공략", title: "밤하늘의 별들에게", tone: "scenario" },
];

const TOP5_SERIES: AnalyticsTopFiveRow[] = [
  { rank: 1, badge: "시리즈", title: "꽃에게는 독이 필요하다", tone: "series" },
  { rank: 2, badge: "시리즈", title: "사랑의 언어", tone: "series" },
  { rank: 3, badge: "시리즈", title: "여름의 기억", tone: "series" },
  { rank: 4, badge: "시리즈", title: "바람이 전하는 이야기", tone: "seriesBlue" },
  { rank: 5, badge: "시리즈", title: "시간을 건너온 편지", tone: "series" },
];

const TOP5_CHARACTER: AnalyticsTopFiveRow[] = [
  { rank: 1, badge: "캐릭터", title: "강백호", tone: "character" },
  { rank: 2, badge: "캐릭터", title: "서윤하", tone: "character" },
  { rank: 3, badge: "캐릭터", title: "이도현", tone: "character" },
  { rank: 4, badge: "캐릭터", title: "한소희", tone: "character" },
  { rank: 5, badge: "캐릭터", title: "주아린", tone: "character" },
];

const TOP5_SCENARIO: AnalyticsTopFiveRow[] = [
  { rank: 1, badge: "상황공략", title: "밤하늘의 별들에게", tone: "scenario" },
  { rank: 2, badge: "상황공략", title: "비밀 화원으로", tone: "scenario" },
  { rank: 3, badge: "상황공략", title: "마지막 인사", tone: "scenario" },
  { rank: 4, badge: "상황공략", title: "거울 너머", tone: "scenario" },
  { rank: 5, badge: "상황공략", title: "안개 속 산책", tone: "scenario" },
];

function scaleChart(
  base: Record<AnalyticsPrimaryMetric, number[]>,
  factor: number,
  jitter = 0,
): Record<AnalyticsPrimaryMetric, number[]> {
  const out = {} as Record<AnalyticsPrimaryMetric, number[]>;
  (Object.keys(base) as AnalyticsPrimaryMetric[]).forEach((k) => {
    out[k] = base[k].map((v, i) => Math.max(0, Math.round(v * factor + jitter * i)));
  });
  return out;
}

const REVISIT_BASE: ContentDummyByScope["revisit"] = {
  once: { revisitPct: 78.5, noRevisitPct: 21.5 },
  twice: { revisitPct: 72.0, noRevisitPct: 28.0 },
  threePlus: { revisitPct: 65.2, noRevisitPct: 34.8 },
};

function tweakRevisit(
  r: ContentDummyByScope["revisit"],
  delta: number,
): ContentDummyByScope["revisit"] {
  const next = {} as ContentDummyByScope["revisit"];
  (Object.keys(r) as RevisitSegmentId[]).forEach((k) => {
    const rv = Math.min(94, Math.max(52, r[k].revisitPct + delta));
    next[k] = { revisitPct: rv, noRevisitPct: Math.round((100 - rv) * 10) / 10 };
  });
  return next;
}

export const CONTENT_DUMMY_BY_SCOPE: Record<AnalyticsScopeCategoryId, ContentDummyByScope> = {
  all: {
    primary: [
      { id: "views", value: "4,500", delta: "+3,112 (+76%)", deltaTone: "gain" },
      { id: "watchTime", value: "421시간", delta: "+89 (+21%)", deltaTone: "gain" },
      { id: "likes", value: "2,381", delta: "+412 (+21%)", deltaTone: "gain" },
      { id: "comments", value: "381", delta: "+52 (+16%)", deltaTone: "gain" },
      { id: "shares", value: "429", delta: "+31 (+8%)", deltaTone: "gain" },
    ],
    revisit: REVISIT_BASE,
    top5: TOP5_ALL,
    chartSeries: CHART_ALL,
  },
  series: {
    primary: [
      { id: "views", value: "3,180", delta: "+2,010 (+172%)", deltaTone: "gain" },
      { id: "watchTime", value: "305시간", delta: "+64 (+27%)", deltaTone: "gain" },
      { id: "likes", value: "1,902", delta: "+288 (+18%)", deltaTone: "gain" },
      { id: "comments", value: "268", delta: "+41 (+18%)", deltaTone: "gain" },
      { id: "shares", value: "312", delta: "+22 (+8%)", deltaTone: "gain" },
    ],
    revisit: tweakRevisit(REVISIT_BASE, 2.1),
    top5: TOP5_SERIES,
    chartSeries: scaleChart(CHART_ALL, 0.78, 4),
  },
  character: {
    primary: [
      { id: "views", value: "892", delta: "+124 (+16%)", deltaTone: "gain" },
      { id: "watchTime", value: "74시간", delta: "-8 (-10%)", deltaTone: "loss" },
      { id: "likes", value: "612", delta: "+55 (+10%)", deltaTone: "gain" },
      { id: "comments", value: "144", delta: "-12 (-8%)", deltaTone: "loss" },
      { id: "shares", value: "98", delta: "+6 (+7%)", deltaTone: "gain" },
    ],
    revisit: tweakRevisit(REVISIT_BASE, -4.5),
    top5: TOP5_CHARACTER,
    chartSeries: scaleChart(CHART_ALL, 0.34, -2),
  },
  scenario: {
    primary: [
      { id: "views", value: "428", delta: "+52 (+14%)", deltaTone: "gain" },
      { id: "watchTime", value: "42시간", delta: "+11 (+36%)", deltaTone: "gain" },
      { id: "likes", value: "298", delta: "+19 (+7%)", deltaTone: "gain" },
      { id: "comments", value: "88", delta: "+4 (+5%)", deltaTone: "gain" },
      { id: "shares", value: "56", delta: "-3 (-5%)", deltaTone: "loss" },
    ],
    revisit: tweakRevisit(REVISIT_BASE, -7.2),
    top5: TOP5_SCENARIO,
    chartSeries: scaleChart(CHART_ALL, 0.21, 1),
  },
};

const USER_CHART_ALL: Record<AnalyticsUserMetric, number[]> = {
  userCount: [3800, 3950, 4100, 4220, 4180, 4050, 3980, 3850, 3720, 3600, 3520],
  newFollowers: [-120, -80, -200, -140, -160, -180, -210, -190, -175, -150, -130],
  totalFollowers: [42000, 42150, 41920, 41800, 41750, 41880, 41950, 42010, 42100, 42200, 42300],
};

const LIST_A_BASE: AnalyticsTopFiveRow[] = [
  { rank: 1, badge: "시리즈", title: "꽃에게는 독이 필요하다", tone: "series" },
  { rank: 2, badge: "캐릭터", title: "사랑의 언어", tone: "character" },
  { rank: 3, badge: "시리즈", title: "여름의 기억", tone: "series" },
  { rank: 4, badge: "시리즈", title: "바람이 전하는 이야기", tone: "seriesBlue" },
  { rank: 5, badge: "상황공략", title: "밤하늘의 별들에게", tone: "scenario" },
];

export const USER_DUMMY_BY_SCOPE: Record<AnalyticsScopeCategoryId, UserDummyByScope> = {
  all: {
    primary: [
      { id: "userCount", value: "42.2만", delta: "+512 (+62%)", deltaTone: "gain" },
      { id: "newFollowers", value: "-321", delta: "-1.5%", deltaTone: "loss" },
      { id: "totalFollowers", value: "4.5만", delta: "+3,112 (+76%)", deltaTone: "gain" },
    ],
    listA: LIST_A_BASE,
    listBCounts: ["521", "211", "111", "52", "14"],
    chartSeries: USER_CHART_ALL,
    gender: {
      flex: [65, 30, 5],
      legend: ["65%", "30%", "5%"],
    },
    age: {
      flex: [12, 20, 43, 22, 6],
      legend: ["12%", "20%", "43%", "22%", "6%"],
    },
    avgTime: {
      flex: [25, 35, 40],
      legend: ["2분 30초", "4분 12초", "14분 10초"],
    },
    userMix: {
      flex: [77, 11, 12],
      legend: ["77%", "11%", "12%"],
    },
    timeOfDay: {
      flex: [12, 20, 43, 22],
      legend: ["12%", "20%", "43%", "22%"],
    },
  },
  series: {
    primary: [
      { id: "userCount", value: "31.4만", delta: "+388 (+52%)", deltaTone: "gain" },
      { id: "newFollowers", value: "-198", delta: "-0.9%", deltaTone: "loss" },
      { id: "totalFollowers", value: "3.6만", delta: "+2,401 (+68%)", deltaTone: "gain" },
    ],
    listA: TOP5_SERIES,
    listBCounts: ["612", "244", "128", "61", "22"],
    chartSeries: {
      userCount: USER_CHART_ALL.userCount.map((v) => Math.round(v * 0.81)),
      newFollowers: USER_CHART_ALL.newFollowers.map((v) => Math.round(v * 0.85)),
      totalFollowers: USER_CHART_ALL.totalFollowers.map((v) => Math.round(v * 0.79)),
    },
    gender: { flex: [62, 33, 5], legend: ["62%", "33%", "5%"] },
    age: { flex: [10, 24, 41, 20, 5], legend: ["10%", "24%", "41%", "20%", "5%"] },
    avgTime: { flex: [22, 38, 40], legend: ["2분 10초", "4분 28초", "15분 02초"] },
    userMix: { flex: [74, 13, 13], legend: ["74%", "13%", "13%"] },
    timeOfDay: { flex: [14, 22, 40, 22], legend: ["14%", "22%", "40%", "22%"] },
  },
  character: {
    primary: [
      { id: "userCount", value: "9.8만", delta: "+102 (+12%)", deltaTone: "gain" },
      { id: "newFollowers", value: "-84", delta: "-2.8%", deltaTone: "loss" },
      { id: "totalFollowers", value: "1.1만", delta: "+210 (+24%)", deltaTone: "gain" },
    ],
    listA: TOP5_CHARACTER,
    listBCounts: ["188", "92", "54", "31", "9"],
    chartSeries: {
      userCount: USER_CHART_ALL.userCount.map((v) => Math.round(v * 0.28)),
      newFollowers: USER_CHART_ALL.newFollowers.map((v) => Math.round(v * 1.12)),
      totalFollowers: USER_CHART_ALL.totalFollowers.map((v) => Math.round(v * 0.22)),
    },
    gender: { flex: [58, 38, 4], legend: ["58%", "38%", "4%"] },
    age: { flex: [18, 28, 36, 14, 4], legend: ["18%", "28%", "36%", "14%", "4%"] },
    avgTime: { flex: [30, 34, 36], legend: ["3분 05초", "3분 48초", "11분 20초"] },
    userMix: { flex: [81, 9, 10], legend: ["81%", "9%", "10%"] },
    timeOfDay: { flex: [10, 18, 48, 22], legend: ["10%", "18%", "48%", "22%"] },
  },
  scenario: {
    primary: [
      { id: "userCount", value: "4.2만", delta: "+44 (+11%)", deltaTone: "gain" },
      { id: "newFollowers", value: "-39", delta: "-3.2%", deltaTone: "loss" },
      { id: "totalFollowers", value: "5,820", delta: "+88 (+18%)", deltaTone: "gain" },
    ],
    listA: TOP5_SCENARIO,
    listBCounts: ["96", "41", "28", "12", "5"],
    chartSeries: {
      userCount: USER_CHART_ALL.userCount.map((v) => Math.round(v * 0.14)),
      newFollowers: USER_CHART_ALL.newFollowers.map((v) => Math.round(v * 0.95)),
      totalFollowers: USER_CHART_ALL.totalFollowers.map((v) => Math.round(v * 0.11)),
    },
    gender: { flex: [61, 35, 4], legend: ["61%", "35%", "4%"] },
    age: { flex: [14, 22, 38, 22, 4], legend: ["14%", "22%", "38%", "22%", "4%"] },
    avgTime: { flex: [28, 32, 40], legend: ["2분 55초", "5분 01초", "16분 44초"] },
    userMix: { flex: [79, 12, 9], legend: ["79%", "12%", "9%"] },
    timeOfDay: { flex: [16, 24, 38, 20], legend: ["16%", "24%", "38%", "20%"] },
  },
};

export function getContentDummy(scope: AnalyticsScopeCategoryId): ContentDummyByScope {
  return CONTENT_DUMMY_BY_SCOPE[scope];
}

export function getUserDummy(scope: AnalyticsScopeCategoryId): UserDummyByScope {
  return USER_DUMMY_BY_SCOPE[scope];
}

export function deltaClassName(tone: DeltaTone): string {
  if (tone === "loss") return "text-blue-500";
  if (tone === "neutral") return "text-on-surface-30";
  return "text-error-error";
}
