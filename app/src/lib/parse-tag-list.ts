/** 쉼표 구분 태그 문자열 → 중복 제거된 토큰 목록 */
export function parseTagList(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((t) => t.trim().replace(/^#+/, ""))
    .filter((t, idx, arr) => t.length > 0 && arr.indexOf(t) === idx);
}
