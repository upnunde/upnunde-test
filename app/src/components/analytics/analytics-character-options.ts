/**
 * 분석 캐릭터 필터 — 내 작품에 등록된 캐릭터와 동일한 id·이름을 사용한다.
 */
import { MY_WORKS_CHARACTERS_MOCK } from "@/lib/myWorksCharactersMock";

export const ANALYTICS_CHARACTER_OPTIONS = MY_WORKS_CHARACTERS_MOCK.map((character) => ({
  id: character.id,
  label: character.title,
}));

export type AnalyticsCharacterId = (typeof MY_WORKS_CHARACTERS_MOCK)[number]["id"];

export const DEFAULT_ANALYTICS_CHARACTER_ID: AnalyticsCharacterId = MY_WORKS_CHARACTERS_MOCK[0]!.id;

export function getAnalyticsCharacterLabel(id: AnalyticsCharacterId): string {
  return ANALYTICS_CHARACTER_OPTIONS.find((o) => o.id === id)?.label ?? "";
}
