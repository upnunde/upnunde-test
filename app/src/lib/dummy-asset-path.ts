/** `public/dummy-resource/` 정적 더미 에셋 기준 URL (공백 없음 — Turbopack/Tailwind url 스캔 호환) */
export const DUMMY_RESOURCE_PREFIX = "/dummy-resource";

/** 더미 리소스 파일명 → public URL (예: `background-1.png`) */
export function dummyAsset(fileName: string): string {
  const name = fileName.replace(/^\//, "");
  return `${DUMMY_RESOURCE_PREFIX}/${name}`;
}
