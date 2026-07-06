/** 비중이 높은 순서대로 적용할 프라이머리 계열 톤 (진함 -> 연함) */
export const ANALYTICS_PRIMARY_DESCENDING_DOT_CLASSES: readonly string[] = [
  "bg-primary",
  "bg-primary/50",
  "bg-primary/25",
  "bg-primary-container",
];

export function getDescendingRankOrder(values: readonly number[]): number[] {
  return values
    .map((value, index) => ({ value, index }))
    .sort((a, b) => (b.value === a.value ? a.index - b.index : b.value - a.value))
    .map((row) => row.index);
}

export function mapPaletteByDescendingRank<T>(values: readonly number[], palette: readonly T[]): T[] {
  const rankedIndices = getDescendingRankOrder(values);
  const fallback = palette[palette.length - 1]!;
  const out = Array(values.length).fill(fallback) as T[];

  rankedIndices.forEach((sourceIndex, rank) => {
    out[sourceIndex] = palette[Math.min(rank, palette.length - 1)]!;
  });

  return out;
}
