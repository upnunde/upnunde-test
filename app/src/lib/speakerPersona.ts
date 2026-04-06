/**
 * 텍스트 블록 화자: 시리즈에 입력한 페르소나와 동기화할 때 저장하는 토큰.
 * 실제 표시 문구는 `seriesPersona`(에디터 스토어)로 해석합니다.
 */
export const SPEAKER_PERSONA_TOKEN = "__speaker_persona__";

/** 이전 구현에서 저장된 값 — 토큰과 동일하게 취급 */
export const LEGACY_PERSONA_SPEAKER_VALUE = "나 (페르소나 닉네임)";

export function isPersonaSpeakerToken(raw: string | undefined): boolean {
  if (raw === undefined) return false;
  return raw === SPEAKER_PERSONA_TOKEN || raw === LEGACY_PERSONA_SPEAKER_VALUE;
}

/** 시리즈 편집 화면의 페르소나 입력값으로 드롭다운/이름표에 표시 */
export function formatPersonaSpeakerLabel(seriesPersona: string): string {
  const t = seriesPersona.trim();
  return t ? `나 (${t})` : "나 (페르소나 닉네임)";
}

export function resolveSpeakerDisplay(
  raw: string | undefined,
  seriesPersona: string
): string {
  if (raw === "") return "나레이션";
  if (isPersonaSpeakerToken(raw)) return formatPersonaSpeakerLabel(seriesPersona);
  return raw ?? "나레이션";
}
