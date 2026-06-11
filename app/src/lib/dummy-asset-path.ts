/** `public/dummy-resource/` 정적 더미 에셋 기준 URL (공백 없음 — Turbopack/Tailwind url 스캔 호환) */
export const DUMMY_RESOURCE_PREFIX = "/dummy-resource";

/** 더미 PNG 교체 시 증가 — Next/Image·브라우저 캐시 무효화 */
export const DUMMY_ASSET_CACHE_VERSION = "20250611";

/** 더미 리소스 파일명 → public URL (예: `background-1.png`) */
export function dummyAsset(fileName: string): string {
  const name = fileName.replace(/^\//, "");
  return `${DUMMY_RESOURCE_PREFIX}/${name}?v=${DUMMY_ASSET_CACHE_VERSION}`;
}

/** 리소스 관리 썸네일 — 정적 더미는 최적화 캐시 생략 */
export function isDummyResourceUrl(url: string): boolean {
  const path = url.split("?")[0] ?? url;
  return path.startsWith(DUMMY_RESOURCE_PREFIX);
}
