/**
 * 분석 화면용 시드 결정론 더미 (scope + period 조합마다 다른 값, 합·순위·비율 일관).
 */

import type { AnalyticsPrimaryMetric } from "@/components/analytics/AnalyticsTrendLineChart";
import type { AnalyticsUserMetric } from "@/components/analytics/AnalyticsTrendLineChart";
import type { AnalyticsTopFiveRow } from "@/components/analytics/AnalyticsRankParts";
import type { AnalyticsScopeCategoryId } from "@/components/analytics/analytics-scope-category";
import { getAnalyticsTrendPointCount, type AnalyticsPeriodRange } from "@/components/analytics/analytics-date";
import type {
  ActiveFollowerDummy,
  ContentDummyByScope,
  DeltaTone,
  PrimaryStatDummy,
  UserDummyByScope,
  UserPrimaryStatDummy,
} from "@/components/analytics/analytics-dummy-types";

type RevisitBundle = ContentDummyByScope["revisit"];

const NICK_PREFIX = [
  "달빛",
  "모노",
  "하늘",
  "코코",
  "별빛",
  "루나",
  "토리",
  "밀키",
  "도토리",
  "바닐라",
] as const;
const NICK_SUFFIX = [
  "고양이",
  "토끼",
  "펭귄",
  "여우",
  "곰돌이",
  "나무",
  "파도",
  "구름",
  "냥",
  "별",
] as const;

function generateActiveFollowers(rng: () => number): ActiveFollowerDummy[] {
  const used = new Set<string>();
  const out: ActiveFollowerDummy[] = [];
  let guard = 0;
  while (out.length < 10 && guard++ < 400) {
    const p = NICK_PREFIX[Math.floor(rng() * NICK_PREFIX.length)]!;
    const s = NICK_SUFFIX[Math.floor(rng() * NICK_SUFFIX.length)]!;
    let nick = `${p}${s}`;
    let dup = 0;
    while (used.has(nick) && dup < 20) {
      dup++;
      nick = `${p}${s}${dup}`;
    }
    if (used.has(nick)) continue;
    used.add(nick);
    out.push({ id: `active-follower-${out.length + 1}`, nick });
  }
  return out;
}

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

const LIST_A_MIXED: AnalyticsTopFiveRow[] = [
  { rank: 1, badge: "시리즈", title: "꽃에게는 독이 필요하다", tone: "series" },
  { rank: 2, badge: "캐릭터", title: "사랑의 언어", tone: "character" },
  { rank: 3, badge: "시리즈", title: "여름의 기억", tone: "series" },
  { rank: 4, badge: "시리즈", title: "바람이 전하는 이야기", tone: "seriesBlue" },
  { rank: 5, badge: "상황공략", title: "밤하늘의 별들에게", tone: "scenario" },
];

function top5PoolForScope(scope: AnalyticsScopeCategoryId): AnalyticsTopFiveRow[] {
  switch (scope) {
    case "series":
      return TOP5_SERIES;
    case "character":
      return TOP5_CHARACTER;
    case "scenario":
      return TOP5_SCENARIO;
    default:
      return TOP5_ALL;
  }
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i);
  }
  return h >>> 0;
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFor(scope: AnalyticsScopeCategoryId, period: AnalyticsPeriodRange): number {
  return hashString(`analytics:${scope}:${period}`);
}

function formatInt(n: number): string {
  return Math.round(n).toLocaleString("ko-KR");
}

/** 만 단위(1.2만) 또는 천단위 */
function formatCompactKo(n: number): string {
  if (n >= 10_000) {
    const man = n / 10_000;
    const rounded = Math.round(man * 10) / 10;
    return `${rounded}만`;
  }
  return formatInt(n);
}

function deltaFromPrev(cur: number, prev: number): { text: string; tone: DeltaTone } {
  if (prev <= 0) {
    return { text: "—", tone: "neutral" };
  }
  const diff = cur - prev;
  const pct = Math.round((diff / prev) * 100);
  const sign = diff > 0 ? "+" : "";
  const tone: DeltaTone = diff > 0 ? "gain" : diff < 0 ? "loss" : "neutral";
  return { text: `${sign}${formatInt(diff)} (${sign}${pct}%)`, tone };
}

/** 인원 증감 — 증감분에 `명` 표기 */
function deltaPersonFromPrev(cur: number, prev: number): { text: string; tone: DeltaTone } {
  if (prev <= 0) {
    return { text: "—", tone: "neutral" };
  }
  const diff = cur - prev;
  const pct = Math.round((diff / prev) * 100);
  const sign = diff > 0 ? "+" : "";
  const tone: DeltaTone = diff > 0 ? "gain" : diff < 0 ? "loss" : "neutral";
  return { text: `${sign}${formatInt(diff)}명 (${sign}${pct}%)`, tone };
}

/** n개 정수, 각 최소 minEach, 합 = 100 */
function randomComposition100(rng: () => number, n: number, minEach = 2): number[] {
  const w = Array.from({ length: n }, () => 0.15 + rng() * 0.95);
  const sumW = w.reduce((a, b) => a + b, 0);
  let parts = w.map((x) => Math.max(minEach, Math.round((x / sumW) * 100)));
  let sum = parts.reduce((a, b) => a + b, 0);
  let guard = 0;
  while (sum > 100 && guard++ < 200) {
    const i = parts.indexOf(Math.max(...parts));
    if (parts[i]! > minEach) {
      parts[i]!--;
      sum--;
    }
  }
  guard = 0;
  while (sum < 100 && guard++ < 200) {
    parts[0]!++;
    sum++;
  }
  return parts;
}

function pctLegend(parts: number[]): string[] {
  return parts.map((p) => `${p}%`);
}

function formatDurationKo(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = Math.max(0, Math.round(totalSec % 60));
  return `${m}분 ${s.toString().padStart(2, "0")}초`;
}

/** 추이 시계열 — 포인트 수는 조회 기간에 맞춤 (`getAnalyticsTrendPointCount`) */
function trendPoints(n: number, end: number, rng: () => number, startRatio = 0.82): number[] {
  if (n <= 0) return [];
  if (n === 1) return [Math.round(end)];
  const start = Math.max(0, Math.round(end * (startRatio + (rng() - 0.5) * 0.12)));
  const waveCycles = 1.1 + rng() * 1.6;
  const wavePhase = rng() * Math.PI * 2;
  const waveAmplitude = end * (0.06 + rng() * 0.14);
  const jitterAmplitude = end * (0.03 + rng() * 0.07);
  const pulseCenterA = 0.2 + rng() * 0.25;
  const pulseCenterB = 0.55 + rng() * 0.3;
  const pulseWidthA = 0.08 + rng() * 0.07;
  const pulseWidthB = 0.08 + rng() * 0.07;
  const pulseAmpA = end * (0.06 + rng() * 0.12);
  const pulseAmpB = -end * (0.05 + rng() * 0.11);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const base = start + (end - start) * t;
    const wave = Math.sin((t * waveCycles + wavePhase) * Math.PI * 2) * waveAmplitude;
    const pulseA = Math.exp(-Math.pow((t - pulseCenterA) / pulseWidthA, 2)) * pulseAmpA;
    const pulseB = Math.exp(-Math.pow((t - pulseCenterB) / pulseWidthB, 2)) * pulseAmpB;
    const jitter = (rng() - 0.5) * jitterAmplitude;
    out.push(Math.max(0, Math.round(base + wave + pulseA + pulseB + jitter)));
  }
  out[0] = start;
  out[n - 1] = Math.round(end);
  return out;
}

function scopeVolumeFactor(scope: AnalyticsScopeCategoryId, rng: () => number): number {
  switch (scope) {
    case "all":
      return 0.9 + rng() * 0.22;
    case "series":
      return 0.62 + rng() * 0.22;
    case "character":
      return 0.2 + rng() * 0.14;
    case "scenario":
      return 0.09 + rng() * 0.12;
    default:
      return 1;
  }
}

function periodTrendBias(period: AnalyticsPeriodRange, rng: () => number): number {
  const base =
    period === "7d"
      ? 1
      : period === "30d"
        ? 1.08
        : period === "90d"
          ? 1.15
          : period === "365d"
            ? 1.22
            : 1.28;
  return base * (0.94 + rng() * 0.12);
}

function generateHourly24(rng: () => number): number[] {
  const peak = Math.floor(rng() * 24);
  const secondary = (peak + 8 + Math.floor(rng() * 8)) % 24;
  return Array.from({ length: 24 }, (_, h) => {
    const dPeak = Math.min(Math.abs(h - peak), 24 - Math.abs(h - peak));
    const dSec = Math.min(Math.abs(h - secondary), 24 - Math.abs(h - secondary));
    const base = 100 / (1 + dPeak * 2.2) + 40 / (1 + dSec * 1.4);
    return Math.max(8, Math.round(base + rng() * 22));
  });
}

function shuffleRowsWithRanks(pool: AnalyticsTopFiveRow[], rng: () => number): AnalyticsTopFiveRow[] {
  const ix = [...pool.map((_, i) => i)];
  for (let k = ix.length - 1; k > 0; k--) {
    const j = Math.floor(rng() * (k + 1));
    [ix[k], ix[j]] = [ix[j]!, ix[k]!];
  }
  return ix.slice(0, 5).map((pi, rank) => ({
    ...pool[pi]!,
    rank: rank + 1,
  }));
}

function descendingCountsFromTop(rng: () => number, scope: AnalyticsScopeCategoryId): string[] {
  let top =
    scope === "all"
      ? 400 + Math.floor(rng() * 520)
      : scope === "series"
        ? 280 + Math.floor(rng() * 400)
        : scope === "character"
          ? 80 + Math.floor(rng() * 160)
          : 40 + Math.floor(rng() * 90);
  const out: string[] = [];
  for (let i = 0; i < 5; i++) {
    out.push(String(top));
    top = Math.max(5, Math.floor(top * (0.42 + rng() * 0.28)));
  }
  return out;
}

/** 캐릭터 범위 가설: 등록 캐릭터 콘텐츠가 없어 지표·목록이 비는 상태 */
function emptyContentDummyForCharacterScope(period: AnalyticsPeriodRange): ContentDummyByScope {
  const neutral = { delta: "—", deltaTone: "neutral" as DeltaTone };
  const primary: PrimaryStatDummy[] = [
    { id: "views", value: "0", ...neutral },
    { id: "watchTime", value: "0시간", ...neutral },
    { id: "likes", value: "0", ...neutral },
    { id: "comments", value: "0", ...neutral },
    { id: "shares", value: "0", ...neutral },
  ];
  const zeros = Array.from({ length: getAnalyticsTrendPointCount(period) }, () => 0);
  const chartSeries: Record<AnalyticsPrimaryMetric, number[]> = {
    views: [...zeros],
    watchTime: [...zeros],
    likes: [...zeros],
    comments: [...zeros],
    shares: [...zeros],
  };
  const z = { revisitPct: 0, noRevisitPct: 0 };
  return {
    primary,
    revisit: { once: z, twice: z, threePlus: z },
    top5: [],
    chartSeries,
  };
}

/** 캐릭터 범위 — 이용자 탭도 동일 가설(범위 내 콘텐츠 없음)으로 비어 있는 분포 */
function emptyUserDummyForCharacterScope(period: AnalyticsPeriodRange): UserDummyByScope {
  const neutral = { delta: "—", deltaTone: "neutral" as DeltaTone };
  const zn = getAnalyticsTrendPointCount(period);
  const zerosSeries = Array.from({ length: zn }, () => 0);
  const z3 = [0, 0, 0] as [number, number, number];
  const z5 = [0, 0, 0, 0, 0] as [number, number, number, number, number];
  const pct0 = ["0%", "0%", "0%"] as [string, string, string];
  const pct5 = ["0%", "0%", "0%", "0%", "0%"] as [string, string, string, string, string];
  const zeroDur = "0분 00초";
  return {
    primary: [
      { id: "userCount", value: "0명", ...neutral },
      { id: "totalFollowers", value: "0명", ...neutral },
    ],
    listA: [],
    listBCounts: [],
    chartSeries: {
      userCount: [...zerosSeries],
      totalFollowers: [...zerosSeries],
    },
    gender: { flex: z3, legend: pct0 },
    age: { flex: z5, legend: pct5 },
    avgTime: {
      flex: z3,
      legend: [zeroDur, zeroDur, zeroDur] as [string, string, string],
    },
    userMix: { flex: z3, legend: pct0 },
    timeOfDayHourly: Array.from({ length: 24 }, () => 0),
    activeFollowers: [],
  };
}

function buildRevisit(rng: () => number): RevisitBundle {
  const once = 72 + rng() * 14;
  const twice = Math.max(54, once - 3 - rng() * 12);
  const threePlus = Math.max(48, twice - 2 - rng() * 10);
  const round1 = (x: number) => Math.round(x * 10) / 10;
  const mk = (rv: number) => {
    const revisitPct = round1(rv);
    return { revisitPct, noRevisitPct: round1(Math.max(0, 100 - revisitPct)) };
  };
  return {
    once: mk(once),
    twice: mk(twice),
    threePlus: mk(threePlus),
  };
}

export function generateContentDummy(
  scope: AnalyticsScopeCategoryId,
  period: AnalyticsPeriodRange,
): ContentDummyByScope {
  if (scope === "character") {
    return emptyContentDummyForCharacterScope(period);
  }

  const rng = mulberry32(seedFor(scope, period));
  const vol = scopeVolumeFactor(scope, rng) * periodTrendBias(period, rng);

  const views = Math.max(120, Math.round((800 + rng() * 9200) * vol));
  const likes = Math.max(40, Math.round(views * (0.12 + rng() * 0.22)));
  const comments = Math.max(8, Math.round(views * (0.018 + rng() * 0.045)));
  const shares = Math.max(5, Math.round(views * (0.012 + rng() * 0.028)));
  const watchHours = Math.max(6, Math.round((views / (55 + rng() * 85)) * (0.35 + rng() * 0.4)));

  const metrics: { id: AnalyticsPrimaryMetric; cur: number; fmt: (n: number) => string }[] = [
    { id: "views", cur: views, fmt: formatInt },
    { id: "watchTime", cur: watchHours, fmt: (n) => `${formatInt(n)}시간` },
    { id: "likes", cur: likes, fmt: formatInt },
    { id: "comments", cur: comments, fmt: formatInt },
    { id: "shares", cur: shares, fmt: formatInt },
  ];

  const primary: PrimaryStatDummy[] = metrics.map(({ id, cur, fmt }) => {
    const drift = 0.78 + rng() * 0.2;
    const prev = Math.max(1, Math.round(cur * drift));
    const { text, tone } = deltaFromPrev(cur, prev);
    return {
      id,
      value: fmt(cur),
      delta: text,
      deltaTone: tone,
    };
  });

  const pt = getAnalyticsTrendPointCount(period);
  const chartSeries = {} as Record<AnalyticsPrimaryMetric, number[]>;
  for (const { id, cur } of metrics) {
    const drift = 0.78 + rng() * 0.2;
    const prev = Math.max(1, Math.round(cur * drift));
    chartSeries[id] = trendPoints(pt, cur, rng, prev / cur);
  }

  const top5Rows = shuffleRowsWithRanks(top5PoolForScope(scope), rng).sort((a, b) => a.rank - b.rank);
  const topCounts = descendingCountsFromTop(rng, scope);
  const top5: AnalyticsTopFiveRow[] = top5Rows.map((row, i) => ({
    ...row,
    countLabel: topCounts[i] ?? "0",
  }));

  return {
    primary,
    revisit: buildRevisit(rng),
    top5,
    chartSeries,
  };
}

export function generateUserDummy(scope: AnalyticsScopeCategoryId, period: AnalyticsPeriodRange): UserDummyByScope {
  if (scope === "character") {
    return emptyUserDummyForCharacterScope(period);
  }

  const rng = mulberry32(seedFor(scope, period) ^ 0x9e3779b9);
  const vol = scopeVolumeFactor(scope, rng) * periodTrendBias(period, rng);

  const users = Math.max(800, Math.round((2800 + rng() * 8500) * vol));
  const followers = Math.max(120, Math.round(users * (0.08 + rng() * 0.35)));

  const userMetrics: { id: AnalyticsUserMetric; cur: number; fmt: (n: number) => string }[] = [
    { id: "userCount", cur: users, fmt: (n) => `${formatCompactKo(n)}명` },
    {
      id: "totalFollowers",
      cur: followers,
      fmt: (n) => `${n >= 10_000 ? formatCompactKo(n) : formatInt(n)}명`,
    },
  ];

  const primary: UserPrimaryStatDummy[] = userMetrics.map(({ id, cur, fmt }) => {
    const drift = 0.8 + rng() * 0.18;
    const prev = Math.max(1, Math.round(cur * drift));
    const { text, tone } = deltaPersonFromPrev(cur, prev);
    return { id, value: fmt(cur), delta: text, deltaTone: tone };
  });

  const pt = getAnalyticsTrendPointCount(period);
  const chartSeries = {} as Record<AnalyticsUserMetric, number[]>;
  for (const { id, cur } of userMetrics) {
    const drift = 0.8 + rng() * 0.18;
    const prev = Math.max(1, Math.round(cur * drift));
    chartSeries[id] = trendPoints(pt, cur, rng, prev / cur);
  }

  const listPool = scope === "all" ? LIST_A_MIXED : top5PoolForScope(scope);
  const listA = shuffleRowsWithRanks(listPool, rng).sort((a, b) => a.rank - b.rank);
  const listBCounts = descendingCountsFromTop(rng, scope);

  const gParts = randomComposition100(rng, 3, 3);
  const gender = {
    flex: [gParts[0]!, gParts[1]!, gParts[2]!] as [number, number, number],
    legend: pctLegend(gParts) as [string, string, string],
  };

  const aParts = randomComposition100(rng, 5, 2);
  const age = {
    flex: [aParts[0]!, aParts[1]!, aParts[2]!, aParts[3]!, aParts[4]!] as [number, number, number, number, number],
    legend: pctLegend(aParts) as [string, string, string, string, string],
  };

  const uParts = randomComposition100(rng, 3, 5);
  const userMix = {
    flex: [uParts[0]!, uParts[1]!, uParts[2]!] as [number, number, number],
    legend: pctLegend(uParts) as [string, string, string],
  };

  const t0 = 90 + Math.floor(rng() * 120);
  const t1 = t0 + 45 + Math.floor(rng() * 130);
  const t2 = t1 + 55 + Math.floor(rng() * 300);
  const avgParts = randomComposition100(rng, 3, 8);
  const avgTime = {
    flex: [avgParts[0]!, avgParts[1]!, avgParts[2]!] as [number, number, number],
    legend: [formatDurationKo(t0), formatDurationKo(t1), formatDurationKo(t2)] as [string, string, string],
  };

  const timeOfDayHourly = generateHourly24(rng);
  const activeFollowers = generateActiveFollowers(rng);

  return {
    primary,
    listA,
    listBCounts,
    chartSeries,
    gender,
    age,
    avgTime,
    userMix,
    timeOfDayHourly,
    activeFollowers,
  };
}
