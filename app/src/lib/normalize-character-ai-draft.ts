import {
  CHARACTER_GREETING_MAX,
  CHARACTER_NAME_MAX,
  CHARACTER_SUMMARY_MAX,
  CHARACTER_TAG_MAX_COUNT,
  CHARACTER_TAG_MAX_LEN,
  CHARACTER_TAG_MIN_COUNT,
} from "@/lib/character-form-limits";
import type { CharacterAiDraft } from "@/lib/character-ai-draft-types";

function clampText(value: unknown, maxLen: number): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (!trimmed) return "";
  return trimmed.length > maxLen ? `${trimmed.slice(0, maxLen - 1)}…` : trimmed;
}

function normalizeTags(value: unknown): string[] {
  const raw: string[] = Array.isArray(value)
    ? value.map((item) => (typeof item === "string" ? item : ""))
    : typeof value === "string"
      ? value.split(/[,，、\n]/)
      : [];

  const unique: string[] = [];
  for (const item of raw) {
    const tag = item.trim().replace(/^#+/, "").slice(0, CHARACTER_TAG_MAX_LEN);
    if (tag.length < 2) continue;
    if (unique.includes(tag)) continue;
    unique.push(tag);
    if (unique.length >= CHARACTER_TAG_MAX_COUNT) break;
  }

  return unique;
}

/** LLM·폴백 응답을 폼 제약에 맞게 정규화 */
export function normalizeCharacterAiDraft(input: unknown): CharacterAiDraft {
  const record =
    input && typeof input === "object" ? (input as Record<string, unknown>) : {};

  const name = clampText(record.name, CHARACTER_NAME_MAX);
  const summary = clampText(record.summary, CHARACTER_SUMMARY_MAX);
  const greeting = clampText(record.greeting, CHARACTER_GREETING_MAX);
  let tags = normalizeTags(record.tags);

  if (tags.length < CHARACTER_TAG_MIN_COUNT && typeof record.summary === "string") {
    tags = normalizeTags(record.summary.split(/\s+/).slice(0, CHARACTER_TAG_MAX_COUNT));
  }

  return { name, summary, tags, greeting };
}

export function isCharacterAiDraftUsable(draft: CharacterAiDraft): boolean {
  return (
    draft.name.length > 0 &&
    draft.summary.length > 0 &&
    draft.greeting.length > 0 &&
    draft.tags.length >= CHARACTER_TAG_MIN_COUNT
  );
}
