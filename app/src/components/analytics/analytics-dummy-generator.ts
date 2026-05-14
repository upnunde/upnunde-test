/**
 * 분석 화면용 시드 결정론 더미 (scope + period 조합마다 다른 값, 합·순위·비율 일관).
 */

import type { AnalyticsPrimaryMetric } from "@/components/analytics/AnalyticsTrendLineChart";
import type { AnalyticsUserMetric } from "@/components/analytics/AnalyticsTrendLineChart";
import type { AnalyticsTopFiveRow, ContentTone } from "@/components/analytics/AnalyticsRankParts";
import type { AnalyticsScopeCategoryId } from "@/components/analytics/analytics-scope-category";
import {
  getAnalyticsPeriodInclusiveDays,
  getAnalyticsTrendPointCount,
  periodKey,
  type AnalyticsPeriodRange,
} from "@/components/analytics/analytics-date";
import type {
  ActiveFollowerDummy,
  ContentDummyByScope,
  DeltaTone,
  EpisodeOption,
  EpisodePrimaryStatsDummy,
  MonetizationDummyByScope,
  PrimaryStatDummy,
  UserDummyByScope,
  UserPrimaryStatDummy,
} from "@/components/analytics/analytics-dummy-types";
import type { AnalyticsSeriesId } from "@/components/analytics/analytics-series-options";
import type { AnalyticsCharacterId } from "@/components/analytics/analytics-character-options";

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

function top5PoolForScope(scope: AnalyticsScopeCategoryId): AnalyticsTopFiveRow[] {
  switch (scope) {
    case "series":
      return TOP5_SERIES;
    case "character":
      return TOP5_CHARACTER;
    case "scenario":
      return TOP5_SCENARIO;
    default:
      return TOP5_SERIES;
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

function seedFor(
  scope: AnalyticsScopeCategoryId,
  period: AnalyticsPeriodRange,
  seriesId: string,
  characterId: string,
): number {
  const entityKey =
    scope === "series" ? seriesId : scope === "character" ? characterId : "noscenario";
  return hashString(`analytics:${scope}:${periodKey(period)}:${entityKey}`);
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

/**
 * 기간 길이에 따른 추세 가중치 — 길수록 누적 효과가 커지는 자연스러움 보정.
 * 사용자 지정 기간(custom)도 일수만 보고 같은 곡선 위에 매핑한다.
 */
function periodTrendBias(period: AnalyticsPeriodRange, rng: () => number): number {
  const days = getAnalyticsPeriodInclusiveDays(period);
  let base: number;
  if (days === null) {
    base = 1.28;
  } else if (days <= 7) {
    base = 1;
  } else if (days <= 30) {
    base = 1.08;
  } else if (days <= 90) {
    base = 1.15;
  } else if (days <= 365) {
    base = 1.22;
  } else {
    base = 1.28;
  }
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
    scope === "series"
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

/** 캐릭터 범위 — 캐릭터별 단일 분석 (시리즈 단일 작품과 동일 스케일) */
function singleCharacterScale(rng: () => number): number {
  return 0.28 + rng() * 0.22;
}

export function generateContentDummy(
  scope: AnalyticsScopeCategoryId,
  period: AnalyticsPeriodRange,
  seriesId: string = "noseries",
  characterId: string = "nochar",
): ContentDummyByScope {
  const rng = mulberry32(seedFor(scope, period, seriesId, characterId));
  /** 시리즈·캐릭터 단일 선택은 합산 대비 30~55% 정도 */
  const isSingleEntity = scope === "series" || scope === "character";
  const singleEntityScale = isSingleEntity
    ? scope === "series"
      ? 0.3 + rng() * 0.25
      : singleCharacterScale(rng)
    : 1;
  const vol = scopeVolumeFactor(scope, rng) * periodTrendBias(period, rng) * singleEntityScale;

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

  const top5 = scopedTop5Rows(scope, period, seriesId, characterId, "popular", rng);

  return {
    primary,
    revisit: buildRevisit(rng),
    top5,
    chartSeries,
  };
}

export function generateUserDummy(
  scope: AnalyticsScopeCategoryId,
  period: AnalyticsPeriodRange,
  seriesId: string = "noseries",
  characterId: string = "nochar",
): UserDummyByScope {
  const rng = mulberry32(seedFor(scope, period, seriesId, characterId) ^ 0x9e3779b9);
  const isSingleEntity = scope === "series" || scope === "character";
  const singleEntityScale = isSingleEntity
    ? scope === "series"
      ? 0.3 + rng() * 0.25
      : singleCharacterScale(rng)
    : 1;
  const vol = scopeVolumeFactor(scope, rng) * periodTrendBias(period, rng) * singleEntityScale;

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

  const listA = scopedTop5Rows(scope, period, seriesId, characterId, "popular", rng);
  const listBCounts = scopedTop5Rows(scope, period, seriesId, characterId, "attention", rng).map(
    (row) => row.countLabel ?? "0",
  );

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

/* ============================================================
 *  시리즈 회차 단위 — 가로 탭 + 회차 드롭다운에서 사용
 * ============================================================ */

const EPISODE_TITLE_PARTS: readonly string[] = [
  "첫 만남",
  "어둠의 그림자 속으로",
  "비 오는 거리",
  "너 정말!?",
  "밤하늘 아래",
  "비밀의 화원",
  "거짓말 같은 진실",
  "마주친 마음",
  "잊을 수 없는 약속",
  "다시 시작",
  "마지막 인사",
  "운명의 갈림길",
] as const;

const SERIES_EPISODE_COUNT: Record<AnalyticsSeriesId, number> = {
  "guy-date": 8,
  "her-heart": 10,
  "rich-youngest": 6,
  "romance-hysterie": 7,
};

/** 작품별 회차 옵션 생성 — 시드 결정론으로 회차 제목 일관 유지 */
export function generateSeriesEpisodeOptions(seriesId: AnalyticsSeriesId): EpisodeOption[] {
  const total = SERIES_EPISODE_COUNT[seriesId] ?? 6;
  const rng = mulberry32(hashString(`episode-options:${seriesId}`));
  const titles: string[] = [];
  const used = new Set<string>();
  const pool = [...EPISODE_TITLE_PARTS];
  for (let i = 0; i < total; i++) {
    let idx = Math.floor(rng() * pool.length);
    let title = pool[idx] ?? "장면";
    let guard = 0;
    while (used.has(title) && guard++ < 24) {
      idx = (idx + 1) % pool.length;
      title = pool[idx] ?? "장면";
    }
    used.add(title);
    titles.push(title);
  }
  return titles.map((title, i) => ({ episodeNo: i + 1, title }));
}

/**
 * 특정 회차의 주요통계 + 추세 더미.
 * 시리즈 합산에서 해당 회차 가중치(decay)를 곱해 분배 → 시리즈 합 = 회차 합과 대략 맞도록.
 */
export function generateEpisodePrimaryStats(
  seriesId: AnalyticsSeriesId,
  episodeNo: number,
  period: AnalyticsPeriodRange,
): EpisodePrimaryStatsDummy {
  const options = generateSeriesEpisodeOptions(seriesId);
  const episode = options.find((o) => o.episodeNo === episodeNo) ?? options[0]!;
  const seriesDummy = generateContentDummy("series", period, seriesId);

  /** 회차 가중치: 첫 화가 가장 높고 점진 하락 + 시드 노이즈 */
  const rng = mulberry32(hashString(`episode-stats:${seriesId}:${episodeNo}:${period}`));
  const total = options.length;
  const weights = Array.from({ length: total }, (_, i) => Math.pow(0.88, i) * (0.85 + rng() * 0.3));
  const sumW = weights.reduce((a, b) => a + b, 0);
  const ratio = (weights[episodeNo - 1] ?? weights[0]!) / sumW;

  function parseNumericValue(formatted: string): number {
    const m = formatted.replace(/[^\d.-]/g, "");
    return Number(m) || 0;
  }

  const primary: PrimaryStatDummy[] = seriesDummy.primary.map((stat) => {
    const seriesNumeric = parseNumericValue(stat.value);
    const episodeNumeric = Math.max(0, Math.round(seriesNumeric * ratio));
    const drift = 0.7 + rng() * 0.4;
    const prev = Math.max(1, Math.round(episodeNumeric * drift));
    const delta = deltaFromPrev(episodeNumeric, prev);
    const isWatchTime = stat.id === "watchTime";
    const value = isWatchTime ? `${formatInt(episodeNumeric)}시간` : formatInt(episodeNumeric);
    return {
      id: stat.id,
      value,
      delta: delta.text,
      deltaTone: delta.tone,
    };
  });

  const pt = getAnalyticsTrendPointCount(period);
  const chartSeries = {} as Record<AnalyticsPrimaryMetric, number[]>;
  for (const stat of seriesDummy.primary) {
    const seriesNumeric = parseNumericValue(stat.value);
    const episodeNumeric = Math.max(0, Math.round(seriesNumeric * ratio));
    const drift = 0.7 + rng() * 0.4;
    const prev = Math.max(1, Math.round(episodeNumeric * drift));
    chartSeries[stat.id] = trendPoints(pt, episodeNumeric, rng, prev / Math.max(1, episodeNumeric));
  }

  return {
    episodeNo: episode.episodeNo,
    title: episode.title,
    primary,
    chartSeries,
  };
}

/** 시리즈 작품 단위 인기/주의 에피소드 TOP5 — 회차들을 row로 변환 */
export function generateEpisodeTop5(
  seriesId: AnalyticsSeriesId,
  period: AnalyticsPeriodRange,
  mode: "popular" | "attention",
): AnalyticsTopFiveRow[] {
  const options = generateSeriesEpisodeOptions(seriesId);
  const rng = mulberry32(hashString(`episode-top5:${seriesId}:${period}:${mode}`));
  const weights = options.map((_, i) =>
    mode === "popular"
      ? Math.pow(0.85, i) * (0.85 + rng() * 0.3)
      : Math.pow(0.7, options.length - 1 - i) * (0.6 + rng() * 0.4),
  );

  const sorted = options
    .map((opt, i) => ({ opt, w: weights[i]! }))
    .sort((a, b) => b.w - a.w)
    .slice(0, 5);

  /** 1위 카운트 베이스 (회차 단위 합리적인 스케일) */
  const baseTop = mode === "popular" ? 4500 + Math.floor(rng() * 3000) : 80 + Math.floor(rng() * 200);

  return sorted.map((entry, rank) => {
    const decay = Math.pow(0.78, rank);
    const count = Math.max(1, Math.round(baseTop * decay + (rng() - 0.5) * baseTop * 0.08));
    return {
      rank: rank + 1,
      badge: `${entry.opt.episodeNo}화`,
      title: entry.opt.title,
      tone: "series",
      countLabel: formatInt(count),
    };
  });
}

const CHARACTER_CONTENT_ITEMS: { badge: string; title: string; tone: ContentTone }[] = [
  { badge: "상황공략", title: "첫 대화 · 카페에서", tone: "scenario" },
  { badge: "상황공략", title: "비 오는 날 재회", tone: "scenario" },
  { badge: "캐릭터", title: "심층 프로필", tone: "character" },
  { badge: "상황공략", title: "밤하늘 산책", tone: "scenario" },
  { badge: "상황공략", title: "오해와 화해", tone: "scenario" },
  { badge: "캐릭터", title: "서브 스토리", tone: "character" },
  { badge: "상황공략", title: "생일 이벤트", tone: "scenario" },
  { badge: "상황공략", title: "마지막 편지", tone: "scenario" },
];

/** 캐릭터 범위 — 선택 캐릭터의 상황공략·설정 등 하위 콘텐츠 TOP5 (다른 캐릭터 나열 금지) */
export function generateCharacterContentTop5(
  characterId: AnalyticsCharacterId,
  period: AnalyticsPeriodRange,
  mode: "popular" | "attention",
): AnalyticsTopFiveRow[] {
  const rng = mulberry32(hashString(`character-top5:${characterId}:${periodKey(period)}:${mode}`));
  const weights = CHARACTER_CONTENT_ITEMS.map((_, i) =>
    mode === "popular"
      ? Math.pow(0.82, i) * (0.8 + rng() * 0.35)
      : Math.pow(0.68, CHARACTER_CONTENT_ITEMS.length - 1 - i) * (0.55 + rng() * 0.4),
  );
  const sorted = CHARACTER_CONTENT_ITEMS.map((item, i) => ({ item, w: weights[i]! }))
    .sort((a, b) => b.w - a.w)
    .slice(0, 5);
  const baseTop = mode === "popular" ? 3200 + Math.floor(rng() * 2400) : 60 + Math.floor(rng() * 160);
  return sorted.map((entry, rank) => {
    const decay = Math.pow(0.76, rank);
    const count = Math.max(1, Math.round(baseTop * decay + (rng() - 0.5) * baseTop * 0.1));
    return {
      rank: rank + 1,
      badge: entry.item.badge,
      title: entry.item.title,
      tone: entry.item.tone,
      countLabel: formatInt(count),
    };
  });
}

function scopedTop5Rows(
  scope: AnalyticsScopeCategoryId,
  period: AnalyticsPeriodRange,
  seriesId: string,
  characterId: string,
  mode: "popular" | "attention",
  rng: () => number,
): AnalyticsTopFiveRow[] {
  if (scope === "series") {
    return generateEpisodeTop5(seriesId as AnalyticsSeriesId, period, mode);
  }
  if (scope === "character") {
    return generateCharacterContentTop5(characterId as AnalyticsCharacterId, period, mode);
  }
  const top5Rows = shuffleRowsWithRanks(top5PoolForScope(scope), rng).sort((a, b) => a.rank - b.rank);
  const topCounts = descendingCountsFromTop(rng, scope);
  return top5Rows.map((row, i) => ({
    ...row,
    countLabel: topCounts[i] ?? "0",
  }));
}

/** 범위·기간·엔티티·모드에 맞는 TOP5 (캐시는 by-scope에서) */
export function generateScopedTop5Dummy(
  scope: AnalyticsScopeCategoryId,
  period: AnalyticsPeriodRange,
  seriesId: AnalyticsSeriesId,
  characterId: AnalyticsCharacterId,
  mode: "popular" | "attention",
): AnalyticsTopFiveRow[] {
  const rng = mulberry32(
    hashString(`scoped-top5:${scope}:${periodKey(period)}:${seriesId}:${characterId}:${mode}`),
  );
  return scopedTop5Rows(scope, period, seriesId, characterId, mode, rng);
}

function episodeRevenueShareRatio(
  seriesId: AnalyticsSeriesId,
  episodeNo: number,
  period: AnalyticsPeriodRange,
  totalEpisodes: number,
): number {
  const rng = mulberry32(hashString(`monetization-ep-ratio:${seriesId}:${episodeNo}:${periodKey(period)}`));
  const weights = Array.from({ length: totalEpisodes }, (_, i) => Math.pow(0.88, i) * (0.85 + rng() * 0.3));
  const sumW = weights.reduce((a, b) => a + b, 0);
  return (weights[episodeNo - 1] ?? weights[0]!) / sumW;
}

function monetizationDelta(
  statId: "expectedRevenue" | "purchaseCount" | "purchaseRate",
  current: number,
  prev: number | null,
): { delta: string; deltaTone: DeltaTone } {
  if (prev == null || prev <= 0) return { delta: "—", deltaTone: "neutral" };
  const diff = current - prev;
  if (Math.abs(diff) < 0.0001) return { delta: "0", deltaTone: "neutral" };
  const sign = diff > 0 ? "+" : "";
  if (statId === "purchaseRate") {
    const pctPoint = `${sign}${diff.toFixed(1)}%p`;
    const relative = `${sign}${Math.round((diff / prev) * 100)}%`;
    return { delta: `${pctPoint} (${relative})`, deltaTone: diff > 0 ? "gain" : "loss" };
  }
  const formattedDiff = `${sign}${Math.round(diff).toLocaleString("ko-KR")}`;
  const relative = `${sign}${Math.round((diff / prev) * 100)}%`;
  return { delta: `${formattedDiff} (${relative})`, deltaTone: diff > 0 ? "gain" : "loss" };
}

function formatMonetizationValue(
  statId: "expectedRevenue" | "purchaseCount" | "purchaseRate",
  value: number,
): string {
  if (statId === "expectedRevenue") return `₩${Math.round(value).toLocaleString("ko-KR")}`;
  if (statId === "purchaseCount") return Math.round(value).toLocaleString("ko-KR");
  return `${value.toFixed(1)}%`;
}

function revenueTop5FromPool(
  pool: AnalyticsTopFiveRow[],
  rng: () => number,
  scope: AnalyticsScopeCategoryId,
): AnalyticsTopFiveRow[] {
  const rows = shuffleRowsWithRanks(pool, rng).sort((a, b) => a.rank - b.rank);
  const amounts = descendingCountsFromTop(rng, scope).map((c) => Number(c) * (4200 + rng() * 1800));
  return rows.map((row, i) => ({
    ...row,
    countLabel: Math.round(amounts[i] ?? 0).toLocaleString("ko-KR"),
    countSuffix: "원",
  }));
}

/** 수익 탭 — 범위 칩·하위 탭·기간·회차에 따라 더미가 달라진다 */
export function generateMonetizationDummy(
  scope: AnalyticsScopeCategoryId,
  period: AnalyticsPeriodRange,
  seriesId: AnalyticsSeriesId,
  characterId: AnalyticsCharacterId,
  selectedEpisodeNo: "all" | number = "all",
): MonetizationDummyByScope {
  const rng = mulberry32(
    hashString(
      `monetization:${scope}:${periodKey(period)}:${seriesId}:${characterId}:${selectedEpisodeNo}`,
    ),
  );
  const isSingleEntity = scope === "series" || scope === "character";
  const entityScale = isSingleEntity
    ? scope === "series"
      ? 0.3 + rng() * 0.25
      : 0.28 + rng() * 0.22
    : 1;
  const vol = scopeVolumeFactor(scope, rng) * periodTrendBias(period, rng) * entityScale;

  let episodeScale = 1;
  if (scope === "series" && selectedEpisodeNo !== "all") {
    const options = generateSeriesEpisodeOptions(seriesId);
    const ep = options.find((o) => o.episodeNo === selectedEpisodeNo) ?? options[0]!;
    episodeScale = episodeRevenueShareRatio(seriesId, ep.episodeNo, period, options.length);
  }

  const baseRevenue = Math.max(120_000, Math.round((486_000 + rng() * 920_000) * vol * episodeScale));
  const prevRevenue = Math.max(1, Math.round(baseRevenue * (0.78 + rng() * 0.18)));
  const purchaseCount = Math.max(40, Math.round((1842 + rng() * 1200) * vol * episodeScale));
  const prevPurchaseCount = Math.max(1, Math.round(purchaseCount * (0.8 + rng() * 0.15)));
  const purchaseRate = Math.max(3, Math.round((27.4 + rng() * 8) * (0.85 + vol * 0.12) * 10) / 10);
  const prevPurchaseRate = Math.max(0.1, purchaseRate - (0.8 + rng() * 2.4));

  const pt = getAnalyticsTrendPointCount(period);
  const chartSeries = {
    expectedRevenue: trendPoints(pt, baseRevenue, rng, prevRevenue / baseRevenue),
    purchaseCount: trendPoints(pt, purchaseCount, rng, prevPurchaseCount / purchaseCount),
    purchaseRate: trendPoints(pt, purchaseRate, rng, prevPurchaseRate / purchaseRate),
  };

  const stats = {
    expectedRevenue: {
      value: formatMonetizationValue("expectedRevenue", baseRevenue),
      ...monetizationDelta("expectedRevenue", baseRevenue, prevRevenue),
    },
    purchaseCount: {
      value: formatMonetizationValue("purchaseCount", purchaseCount),
      ...monetizationDelta("purchaseCount", purchaseCount, prevPurchaseCount),
    },
    purchaseRate: {
      value: formatMonetizationValue("purchaseRate", purchaseRate),
      ...monetizationDelta("purchaseRate", purchaseRate, prevPurchaseRate),
    },
  };

  let top5: AnalyticsTopFiveRow[];
  let low5: AnalyticsTopFiveRow[];
  if (scope === "series") {
    top5 = generateEpisodeTop5(seriesId, period, "popular").map((row) => ({
      ...row,
      countSuffix: "원",
      countLabel: String(Math.round(Number((row.countLabel ?? "0").replace(/,/g, "")) * (180 + rng() * 120))),
    }));
    low5 = generateEpisodeTop5(seriesId, period, "attention").map((row) => ({
      ...row,
      countSuffix: "원",
      countLabel: String(Math.round(Number((row.countLabel ?? "0").replace(/,/g, "")) * (180 + rng() * 120))),
    }));
  } else if (scope === "character") {
    top5 = generateCharacterContentTop5(characterId, period, "popular").map((row) => ({
      ...row,
      countSuffix: "원",
      countLabel: Math.round(Number((row.countLabel ?? "0").replace(/,/g, "")) * (4200 + rng() * 1800)).toLocaleString("ko-KR"),
    }));
    const lowRng = mulberry32(hashString(`monetization-low-char:${characterId}:${periodKey(period)}`));
    low5 = generateCharacterContentTop5(characterId, period, "attention").map((row) => ({
      ...row,
      countSuffix: "원",
      countLabel: String(Math.round(Number((row.countLabel ?? "0").replace(/,/g, "")) * (0.04 + lowRng() * 0.06))),
    }));
  } else {
    const pool = top5PoolForScope(scope);
    top5 = revenueTop5FromPool(pool, rng, scope);
    const lowRng = mulberry32(hashString(`monetization-low:${scope}:${periodKey(period)}:${seriesId}:${characterId}`));
    low5 = revenueTop5FromPool([...pool].reverse(), lowRng, scope).map((row) => ({
      ...row,
      countLabel: String(Math.round(Number((row.countLabel ?? "0").replace(/,/g, "")) * (0.04 + lowRng() * 0.06))),
    }));
  }

  return {
    stats,
    chartSeries,
    top5,
    low5,
  };
}
