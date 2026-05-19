/** id/seed 기반 결정적 더미 길이 — SSR·CSR 동일 (3:00~5:00) */
export function deterministicBgmDuration(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const totalSeconds = 180 + (Math.abs(hash) % 121);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
