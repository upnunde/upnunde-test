import type { AnalyticsScopeCategoryId } from "@/components/analytics/analytics-scope-category";
import { analyticsScopeEntityKey } from "@/components/analytics/analytics-scope-entity";
import {
  getAnalyticsPeriodInclusiveDays,
  periodKey,
  type AnalyticsPeriodRange,
} from "@/components/analytics/analytics-date";
import type { DeltaTone } from "@/components/analytics/analytics-dummy-types";
import type { AnalyticsTopFiveRow } from "@/components/analytics/AnalyticsRankParts";
import type { AnalyticsSeriesId } from "@/components/analytics/analytics-series-options";
import type { AnalyticsCharacterId } from "@/components/analytics/analytics-character-options";
import type { AnalyticsScenarioId } from "@/components/analytics/analytics-scenario-options";
import {
  generateContentDummy,
  generateEpisodePrimaryStats,
  generateEpisodeTop5,
  generateCharacterContentTop5,
  generateScopedTop5Dummy,
  generateMonetizationDummy,
  generateMonetizationMonthlyRevenue,
  generateSeriesEpisodeOptions,
  generateUserDummy,
} from "@/components/analytics/analytics-dummy-generator";

export type {
  ActiveFollowerDummy,
  DeltaTone,
  EpisodeOption,
  EpisodePrimaryStatsDummy,
  PrimaryStatDummy,
  UserPrimaryStatDummy,
  ContentDummyByScope,
  UserDummyByScope,
  MonetizationDummyByScope,
} from "@/components/analytics/analytics-dummy-types";

const cacheContent = new Map<string, ReturnType<typeof generateContentDummy>>();
const cacheUser = new Map<string, ReturnType<typeof generateUserDummy>>();
const cacheEpisodeStats = new Map<string, ReturnType<typeof generateEpisodePrimaryStats>>();
const cacheEpisodeOptions = new Map<string, ReturnType<typeof generateSeriesEpisodeOptions>>();
const cacheEpisodeTop5 = new Map<string, AnalyticsTopFiveRow[]>();
const cacheCharacterTop5 = new Map<string, AnalyticsTopFiveRow[]>();
const cacheScopedTop5 = new Map<string, AnalyticsTopFiveRow[]>();
const cacheMonetization = new Map<string, ReturnType<typeof generateMonetizationDummy>>();
const cacheMonetizationMonthly = new Map<
  string,
  ReturnType<typeof generateMonetizationMonthlyRevenue>
>();

function cacheKey(
  scope: AnalyticsScopeCategoryId,
  period: AnalyticsPeriodRange,
  seriesId: string,
  characterId: string,
  scenarioId: string,
): string {
  return `${scope}:${periodKey(period)}:${analyticsScopeEntityKey(scope, seriesId, characterId, scenarioId)}`;
}

/** 콘텐츠 분석 더미 (시리즈·캐릭터·상황공략일 땐 선택 단위별 캐싱) */
export function getContentDummy(
  scope: AnalyticsScopeCategoryId,
  period: AnalyticsPeriodRange,
  seriesId: string = "noseries",
  characterId: string = "nochar",
  scenarioId: string = "noscenario",
): ReturnType<typeof generateContentDummy> {
  const k = cacheKey(scope, period, seriesId, characterId, scenarioId);
  let v = cacheContent.get(k);
  if (!v) {
    v = generateContentDummy(scope, period, seriesId, characterId, scenarioId);
    cacheContent.set(k, v);
  }
  return v;
}

/** 이용자 분석 더미 */
export function getUserDummy(
  scope: AnalyticsScopeCategoryId,
  period: AnalyticsPeriodRange,
  seriesId: string = "noseries",
  characterId: string = "nochar",
  scenarioId: string = "noscenario",
): ReturnType<typeof generateUserDummy> {
  const k = cacheKey(scope, period, seriesId, characterId, scenarioId);
  let v = cacheUser.get(k);
  if (!v) {
    v = generateUserDummy(scope, period, seriesId, characterId, scenarioId);
    cacheUser.set(k, v);
  }
  return v;
}

/** 시리즈 작품의 회차 옵션 (가로 탭 + 회차 드롭다운에서 사용) */
export function getSeriesEpisodeOptions(seriesId: AnalyticsSeriesId) {
  const k = seriesId;
  let v = cacheEpisodeOptions.get(k);
  if (!v) {
    v = generateSeriesEpisodeOptions(seriesId);
    cacheEpisodeOptions.set(k, v);
  }
  return v;
}

/** 시리즈 회차 단위 주요통계 + 추세 */
export function getEpisodePrimaryStatsDummy(
  seriesId: AnalyticsSeriesId,
  episodeNo: number,
  period: AnalyticsPeriodRange,
) {
  const k = `${seriesId}:${episodeNo}:${periodKey(period)}`;
  let v = cacheEpisodeStats.get(k);
  if (!v) {
    v = generateEpisodePrimaryStats(seriesId, episodeNo, period);
    cacheEpisodeStats.set(k, v);
  }
  return v;
}

/** 시리즈 작품의 인기/주의 에피소드 TOP5 */
export function getEpisodeTop5Dummy(
  seriesId: AnalyticsSeriesId,
  period: AnalyticsPeriodRange,
  mode: "popular" | "attention",
): AnalyticsTopFiveRow[] {
  const k = `${seriesId}:${periodKey(period)}:${mode}`;
  let v = cacheEpisodeTop5.get(k);
  if (!v) {
    v = generateEpisodeTop5(seriesId, period, mode);
    cacheEpisodeTop5.set(k, v);
  }
  return v;
}

/** 캐릭터 범위 — 선택 캐릭터의 하위 콘텐츠 TOP5 */
export function getCharacterContentTop5Dummy(
  characterId: AnalyticsCharacterId,
  period: AnalyticsPeriodRange,
  mode: "popular" | "attention",
): AnalyticsTopFiveRow[] {
  const k = `${characterId}:${periodKey(period)}:${mode}`;
  let v = cacheCharacterTop5.get(k);
  if (!v) {
    v = generateCharacterContentTop5(characterId, period, mode);
    cacheCharacterTop5.set(k, v);
  }
  return v;
}

/**
 * 범위 칩·하위 탭에 맞는 TOP5 — 시리즈는 회차, 캐릭터는 해당 캐릭터 콘텐츠, 상황공략은 시나리오 목록.
 */
export function getScopedTop5Dummy(
  scope: AnalyticsScopeCategoryId,
  period: AnalyticsPeriodRange,
  seriesId: AnalyticsSeriesId,
  characterId: AnalyticsCharacterId,
  scenarioId: AnalyticsScenarioId,
  mode: "popular" | "attention",
): AnalyticsTopFiveRow[] {
  if (scope === "series") return getEpisodeTop5Dummy(seriesId, period, mode);
  if (scope === "character") return getCharacterContentTop5Dummy(characterId, period, mode);
  if (mode === "popular") {
    return getContentDummy(scope, period, seriesId, characterId, scenarioId).top5;
  }
  const k = `${scope}:${periodKey(period)}:${scenarioId}:${mode}`;
  let v = cacheScopedTop5.get(k);
  if (!v) {
    v = generateScopedTop5Dummy(scope, period, seriesId, characterId, scenarioId, mode);
    cacheScopedTop5.set(k, v);
  }
  return v;
}

function monetizationCacheKey(
  scope: AnalyticsScopeCategoryId,
  period: AnalyticsPeriodRange,
  seriesId: string,
  characterId: string,
  scenarioId: string,
  selectedEpisodeNo: "all" | number,
): string {
  const entityKey = analyticsScopeEntityKey(scope, seriesId, characterId, scenarioId);
  return `monetization:${scope}:${periodKey(period)}:${entityKey}:${selectedEpisodeNo}`;
}

/** 수익 탭 더미 */
export function getMonetizationDummy(
  scope: AnalyticsScopeCategoryId,
  period: AnalyticsPeriodRange,
  seriesId: string = "noseries",
  characterId: string = "nochar",
  scenarioId: string = "noscenario",
  selectedEpisodeNo: "all" | number = "all",
): ReturnType<typeof generateMonetizationDummy> {
  const k = monetizationCacheKey(scope, period, seriesId, characterId, scenarioId, selectedEpisodeNo);
  let v = cacheMonetization.get(k);
  if (!v) {
    v = generateMonetizationDummy(
      scope,
      period,
      seriesId as AnalyticsSeriesId,
      characterId as AnalyticsCharacterId,
      scenarioId,
      selectedEpisodeNo,
    );
    cacheMonetization.set(k, v);
  }
  return v;
}

function monetizationMonthlyCacheKey(
  scope: AnalyticsScopeCategoryId,
  seriesId: string,
  characterId: string,
  scenarioId: string,
  monthCount: number,
): string {
  const entityKey = analyticsScopeEntityKey(scope, seriesId, characterId, scenarioId);
  return `monetization-monthly:${scope}:${entityKey}:${monthCount}`;
}

/** 수익 탭 월별 수익 — 기간·회차 필터와 무관 */
export function getMonetizationMonthlyRevenue(
  scope: AnalyticsScopeCategoryId,
  seriesId: string = "noseries",
  characterId: string = "nochar",
  scenarioId: string = "noscenario",
  monthCount = 6,
): ReturnType<typeof generateMonetizationMonthlyRevenue> {
  const k = monetizationMonthlyCacheKey(scope, seriesId, characterId, scenarioId, monthCount);
  let v = cacheMonetizationMonthly.get(k);
  if (!v) {
    v = generateMonetizationMonthlyRevenue(
      scope,
      seriesId as AnalyticsSeriesId,
      characterId as AnalyticsCharacterId,
      scenarioId,
      monthCount,
    );
    cacheMonetizationMonthly.set(k, v);
  }
  return v;
}

/** 3시간 인접 이동평균 */
function movingAverage3(values: readonly number[]): number[] {
  const n = values.length;
  return values.map((_, i) => {
    const a = i > 0 ? values[i - 1]! : values[i]!;
    const b = values[i]!;
    const c = i + 1 < n ? values[i + 1]! : values[i]!;
    return (a + b + c) / 3;
  });
}

/**
 * 기간 길이가 길수록 시간대 분포가 평탄해지는 자연스러움 모사 — 일수 기반으로 정규화.
 * `all`은 일수 null이라 별도로 추가 평탄화.
 */
function applyAnalyticsPeriodToHourlyShape(
  base: readonly number[],
  period: AnalyticsPeriodRange,
): number[] {
  let v = [...base];
  const days = getAnalyticsPeriodInclusiveDays(period);
  let passes: number;
  if (days === null) {
    passes = 9;
  } else if (days <= 7) {
    passes = 0;
  } else if (days <= 30) {
    passes = 2;
  } else if (days <= 90) {
    passes = 4;
  } else if (days <= 365) {
    passes = 6;
  } else {
    passes = 9;
  }

  for (let i = 0; i < passes; i++) {
    v = movingAverage3(v);
  }

  if (days === null) {
    const mean = v.reduce((a, b) => a + b, 0) / v.length;
    v = v.map((x) => mean + (x - mean) * 0.62);
  }

  /* 시간대별 이용자 수 더미 — 정수(명) 스케일만 유지 */
  return v.map((x) => Math.max(0, Math.round(x)));
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function addSeededHourlyDemoNoise(values: readonly number[], seedKey: string): number[] {
  const rnd = mulberry32(hashString(seedKey));
  return values.map((v) => {
    const gain = 0.42 + rnd() * 1.28;
    const jitter = (rnd() - 0.5) * 14;
    const next = v * gain + jitter;
    return Math.max(10, Math.round(next));
  });
}

/** 이용 시간대 막대용 (기간 보정 + 미세 노이즈) */
export function getUserTimeOfDayHourlyDummy(
  scope: AnalyticsScopeCategoryId,
  period: AnalyticsPeriodRange,
  seriesId: string = "noseries",
  characterId: string = "nochar",
  scenarioId: string = "noscenario",
): readonly number[] {
  const base = getUserDummy(scope, period, seriesId, characterId, scenarioId).timeOfDayHourly;
  const shaped = applyAnalyticsPeriodToHourlyShape(base, period);
  const entityKey = analyticsScopeEntityKey(scope, seriesId, characterId, scenarioId);
  return addSeededHourlyDemoNoise(shaped, `tod:${scope}:${periodKey(period)}:${entityKey}`);
}

export function deltaClassName(tone: DeltaTone): string {
  if (tone === "loss") return "text-blue-500";
  if (tone === "neutral") return "text-on-surface-30";
  return "text-error-error";
}
