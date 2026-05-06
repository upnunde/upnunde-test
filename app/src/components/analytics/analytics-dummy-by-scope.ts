import type { AnalyticsScopeCategoryId } from "@/components/analytics/analytics-scope-category";
import type { AnalyticsPeriodRange } from "@/components/analytics/analytics-date";
import type { DeltaTone } from "@/components/analytics/analytics-dummy-types";
import {
  generateContentDummy,
  generateUserDummy,
} from "@/components/analytics/analytics-dummy-generator";

export type {
  ActiveFollowerDummy,
  DeltaTone,
  PrimaryStatDummy,
  UserPrimaryStatDummy,
  ContentDummyByScope,
  UserDummyByScope,
} from "@/components/analytics/analytics-dummy-types";

const cacheContent = new Map<string, ReturnType<typeof generateContentDummy>>();
const cacheUser = new Map<string, ReturnType<typeof generateUserDummy>>();

function cacheKey(scope: AnalyticsScopeCategoryId, period: AnalyticsPeriodRange): string {
  return `${scope}:${period}`;
}

/** 콘텐츠 분석 더미 (범위·기간 조합별 시드, 합·순위 일관) */
export function getContentDummy(
  scope: AnalyticsScopeCategoryId,
  period: AnalyticsPeriodRange,
): ReturnType<typeof generateContentDummy> {
  const k = cacheKey(scope, period);
  let v = cacheContent.get(k);
  if (!v) {
    v = generateContentDummy(scope, period);
    cacheContent.set(k, v);
  }
  return v;
}

/** 이용자 분석 더미 */
export function getUserDummy(
  scope: AnalyticsScopeCategoryId,
  period: AnalyticsPeriodRange,
): ReturnType<typeof generateUserDummy> {
  const k = cacheKey(scope, period);
  let v = cacheUser.get(k);
  if (!v) {
    v = generateUserDummy(scope, period);
    cacheUser.set(k, v);
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

function applyAnalyticsPeriodToHourlyShape(
  base: readonly number[],
  period: AnalyticsPeriodRange,
): number[] {
  let v = [...base];
  const passes =
    period === "7d"
      ? 0
      : period === "30d"
        ? 2
        : period === "90d"
          ? 4
          : period === "365d"
            ? 6
            : 9;

  for (let i = 0; i < passes; i++) {
    v = movingAverage3(v);
  }

  if (period === "all") {
    const mean = v.reduce((a, b) => a + b, 0) / v.length;
    v = v.map((x) => mean + (x - mean) * 0.62);
  }

  return v.map((x) => Math.max(0, Math.round(x * 10) / 10));
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
    return Math.max(10, Math.round(next * 10) / 10);
  });
}

/** 이용 시간대 막대용 (기간 보정 + 미세 노이즈) */
export function getUserTimeOfDayHourlyDummy(
  scope: AnalyticsScopeCategoryId,
  period: AnalyticsPeriodRange,
): readonly number[] {
  const base = getUserDummy(scope, period).timeOfDayHourly;
  const shaped = applyAnalyticsPeriodToHourlyShape(base, period);
  return addSeededHourlyDemoNoise(shaped, `tod:${scope}:${period}`);
}

export function deltaClassName(tone: DeltaTone): string {
  if (tone === "loss") return "text-blue-500";
  if (tone === "neutral") return "text-on-surface-30";
  return "text-error-error";
}
