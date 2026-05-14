/**
 * 분석 조회 기간 모델.
 *
 * - 프리셋 문자열: 오늘 기준 N일/전체
 * - 객체: 사용자 지정 기간 (시작·종료 `YYYY-MM-DD`, 끝 포함)
 *
 * 기존 enum 코드(`period === "7d"`)와 호환되도록 union 분기에 객체를 더했다.
 * 객체는 `typeof period === "string"`으로 자연스럽게 걸러진다.
 */
export type AnalyticsPeriodPreset = "7d" | "30d" | "90d" | "365d" | "all";

export type AnalyticsPeriodRange =
  | AnalyticsPeriodPreset
  | { fromYmd: string; toYmd: string };

export const ANALYTICS_PERIOD_PRESETS: { value: AnalyticsPeriodPreset; label: string }[] = [
  { value: "7d", label: "지난 7일" },
  { value: "30d", label: "지난 30일" },
  { value: "90d", label: "지난 90일" },
  { value: "365d", label: "지난 1년" },
  { value: "all", label: "전체 기간" },
];

/** 호환을 위한 기존 export 별칭 (기존 import 사이트가 있을 수 있어 유지) */
export const ANALYTICS_PERIOD_OPTIONS = ANALYTICS_PERIOD_PRESETS;

export function isCustomPeriod(
  period: AnalyticsPeriodRange,
): period is { fromYmd: string; toYmd: string } {
  return typeof period === "object" && period !== null;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** 서울 기준 달력 날짜 `YYYY-MM-DD` */
export function getSeoulCalendarYmd(now: Date): string {
  return now.toLocaleString("sv-SE", { timeZone: "Asia/Seoul" }).slice(0, 10);
}

/** 그레고리력 `YYYY-MM-DD`에 일수 가감 */
export function addDaysToCalendarYmd(ymd: string, deltaDays: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const utcMs = Date.UTC(y, m - 1, d + deltaDays);
  const dt = new Date(utcMs);
  return `${dt.getUTCFullYear()}-${pad2(dt.getUTCMonth() + 1)}-${pad2(dt.getUTCDate())}`;
}

/** `YYYY-MM-DD` → UI용 `YYYY.MM.DD` (풀 표기) */
export function formatYmdFull(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  return `${y}.${pad2(m)}.${pad2(d)}`;
}

/** `YYYY-MM-DD` → UI용 `M월 D일` (연도 생략) */
export function formatKoreanMonthDayFromYmd(ymd: string): string {
  const parts = ymd.split("-").map(Number);
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  return `${m}월 ${d}일`;
}

/**
 * 두 `YYYY-MM-DD` 사이 포함 일수 (start, end 모두 포함).
 * end < start 이면 1로 보정 (UI에서 잘못 입력했을 때 안전망).
 */
export function inclusiveDaysBetweenYmd(fromYmd: string, toYmd: string): number {
  const [fy, fm, fd] = fromYmd.split("-").map(Number);
  const [ty, tm, td] = toYmd.split("-").map(Number);
  const f = Date.UTC(fy, fm - 1, fd);
  const t = Date.UTC(ty, tm - 1, td);
  const diff = Math.round((t - f) / (24 * 60 * 60 * 1000)) + 1;
  return Math.max(1, diff);
}

/**
 * 분석 기간을 정규화된 윈도우(시작·종료·일수)로 변환한다.
 * 모든 라벨/시계열 헬퍼가 이 결과만 보고 동작하도록 통일한다.
 */
export type AnalyticsPeriodWindow = {
  /** `all`이면 null (시작 미정) */
  fromYmd: string | null;
  /** 항상 채워짐 (오늘 또는 사용자 지정 종료) */
  toYmd: string;
  /** `all`이면 null */
  totalDays: number | null;
  /** `all` 여부 */
  isAll: boolean;
};

export function getAnalyticsPeriodWindow(
  period: AnalyticsPeriodRange,
  now: Date,
): AnalyticsPeriodWindow {
  if (isCustomPeriod(period)) {
    const totalDays = inclusiveDaysBetweenYmd(period.fromYmd, period.toYmd);
    return { fromYmd: period.fromYmd, toYmd: period.toYmd, totalDays, isAll: false };
  }
  if (period === "all") {
    return { fromYmd: null, toYmd: getSeoulCalendarYmd(now), totalDays: null, isAll: true };
  }
  const totalDays = period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : 365;
  const toYmd = getSeoulCalendarYmd(now);
  const fromYmd = addDaysToCalendarYmd(toYmd, -(totalDays - 1));
  return { fromYmd, toYmd, totalDays, isAll: false };
}

/** 분석 기간에 포함되는 일 수. `all`이면 `null` */
export function getAnalyticsPeriodInclusiveDays(period: AnalyticsPeriodRange): number | null {
  if (period === "all") return null;
  if (isCustomPeriod(period)) {
    return inclusiveDaysBetweenYmd(period.fromYmd, period.toYmd);
  }
  return period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : 365;
}

/**
 * 선택 기간에 따른 조회 구간 라벨.
 * 풀 표기(`YYYY.MM.DD ~ YYYY.MM.DD`)로 통일 — 연도가 보여야 운영자가 모호함 없이 인지.
 */
export function getAnalyticsDateRangeLabel(
  period: AnalyticsPeriodRange,
  now: Date,
): string {
  const win = getAnalyticsPeriodWindow(period, now);
  if (win.isAll || !win.fromYmd) return "전체 기간";
  return `${formatYmdFull(win.fromYmd)} ~ ${formatYmdFull(win.toYmd)}`;
}

/**
 * 추이 차트 포인트 수 — 짧은 일수 구간은 일 단위로 제한(축 라벨 중복 방지), 긴 구간은 최대 11.
 * API 연동 시에도 동일 규칙을 맞추면 축·시계열 길이가 일치합니다.
 */
export function getAnalyticsTrendPointCount(period: AnalyticsPeriodRange): number {
  if (period === "all") return 11;
  const days = getAnalyticsPeriodInclusiveDays(period)!;
  return Math.min(11, Math.max(2, days));
}

/** 기간 길이에 맞는 축 라벨 포맷 (일수 기반으로 통일) */
function formatTrendAxisDayLabelByDays(totalDays: number, ymd: string): string {
  const parts = ymd.split("-").map(Number);
  const y = parts[0] ?? 2026;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  if (totalDays <= 30) return `${m}/${d}`;
  return `${String(y).slice(-2)}.${pad2(m)}.${pad2(d)}`;
}

/** `전체` — 최근 bucketCount개월(연월), 좌측이 과거 */
function buildAllPeriodTrendMonthLabels(bucketCount: number, now: Date): string[] {
  const endYmd = getSeoulCalendarYmd(now);
  const [ey, em] = endYmd.split("-").map(Number);
  const labels: string[] = [];
  for (let i = 0; i < bucketCount; i++) {
    const monthsAgo = bucketCount - 1 - i;
    const dt = new Date(Date.UTC(ey, em - 1 - monthsAgo, 1));
    const y = dt.getUTCFullYear();
    const m = dt.getUTCMonth() + 1;
    labels.push(`${String(y).slice(-2)}.${pad2(m)}`);
  }
  return labels;
}

/**
 * 추이 차트 X축 날짜 라벨 — 선택 기간·포인트 수에 맞춤 (좌→우 과거→현재).
 */
export function buildAnalyticsTrendDateLabels(
  period: AnalyticsPeriodRange,
  bucketCount: number,
  now: Date,
): string[] {
  if (bucketCount <= 0) return [];
  const win = getAnalyticsPeriodWindow(period, now);

  if (bucketCount === 1) {
    return win.isAll
      ? buildAllPeriodTrendMonthLabels(1, now)
      : [formatTrendAxisDayLabelByDays(win.totalDays!, win.toYmd)];
  }

  if (win.isAll || !win.fromYmd || !win.totalDays) {
    return buildAllPeriodTrendMonthLabels(bucketCount, now);
  }

  const labels: string[] = [];
  for (let i = 0; i < bucketCount; i++) {
    const t = i / (bucketCount - 1);
    const offset = Math.round(t * (win.totalDays - 1));
    const ymd = addDaysToCalendarYmd(win.fromYmd, offset);
    labels.push(formatTrendAxisDayLabelByDays(win.totalDays, ymd));
  }
  return labels;
}

/**
 * 캐시·시드용 안정 키. 객체 케이스도 결정적 문자열로 직렬화한다.
 */
export function periodKey(period: AnalyticsPeriodRange): string {
  if (isCustomPeriod(period)) return `custom:${period.fromYmd}_${period.toYmd}`;
  return `preset:${period}`;
}
