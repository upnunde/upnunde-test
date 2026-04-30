/** 분석 기간 필터 값 (API·차트 연동 시 재사용) */
export type AnalyticsPeriodRange = "7d" | "30d" | "90d" | "365d" | "all";

export const ANALYTICS_PERIOD_OPTIONS: { value: AnalyticsPeriodRange; label: string }[] = [
  { value: "7d", label: "7일 전" },
  { value: "30d", label: "30일 전" },
  { value: "90d", label: "90일 전" },
  { value: "365d", label: "365일 전" },
  { value: "all", label: "전체" },
];

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** 서울 기준 달력 날짜 `YYYY-MM-DD` */
function getSeoulYMD(now: Date): string {
  return now.toLocaleString("sv-SE", { timeZone: "Asia/Seoul" }).slice(0, 10);
}

/** 그레고리력 `YYYY-MM-DD`에 일수 가감 */
function addDaysToCalendarYMD(ymd: string, deltaDays: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const utcMs = Date.UTC(y, m - 1, d + deltaDays);
  const dt = new Date(utcMs);
  return `${dt.getUTCFullYear()}-${pad2(dt.getUTCMonth() + 1)}-${pad2(dt.getUTCDate())}`;
}

/** `YYYY-MM-DD` → UI용 `YY. MM. DD` */
function formatYmdShort(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  return `${String(y).slice(-2)}. ${pad2(m)}. ${pad2(d)}`;
}

/** 선택 기간에 따른 조회 구간 라벨 */
export function getAnalyticsDateRangeLabel(period: AnalyticsPeriodRange, now: Date): string {
  if (period === "all") {
    return "전체 기간";
  }
  const dayCount =
    period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : 365;
  const endYmd = getSeoulYMD(now);
  const startYmd = addDaysToCalendarYMD(endYmd, -(dayCount - 1));
  return `${formatYmdShort(startYmd)} ~ ${formatYmdShort(endYmd)}`;
}
