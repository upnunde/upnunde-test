import {
  SERIES_PERSONA_MAX,
  SERIES_PROMPT_MAX,
  SERIES_SUMMARY_MAX,
  SERIES_TITLE_MAX,
  SERIES_KEYWORD_MAX_COUNT,
  SERIES_KEYWORD_MAX_LEN,
  SERIES_WORLDVIEW_MAX,
  type SeriesAiDraft,
} from "@/lib/series-ai-draft-types";

function clampText(value: unknown, maxLen: number): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (!trimmed) return "";
  return trimmed.length > maxLen ? `${trimmed.slice(0, maxLen - 1)}…` : trimmed;
}

function normalizeKeywords(value: unknown): string[] {
  const raw: string[] = Array.isArray(value)
    ? value.map((item) => (typeof item === "string" ? item : ""))
    : typeof value === "string"
      ? value.split(/[,，、\n]/)
      : [];

  const unique: string[] = [];
  for (const item of raw) {
    const tag = item.trim().replace(/^#+/, "").slice(0, SERIES_KEYWORD_MAX_LEN);
    if (tag.length < 2) continue;
    if (unique.includes(tag)) continue;
    unique.push(tag);
    if (unique.length >= SERIES_KEYWORD_MAX_COUNT) break;
  }
  return unique;
}

export function normalizeSeriesAiDraft(input: unknown): SeriesAiDraft {
  const record =
    input && typeof input === "object" ? (input as Record<string, unknown>) : {};

  return {
    title: clampText(record.title, SERIES_TITLE_MAX),
    summary: clampText(record.summary, SERIES_SUMMARY_MAX),
    keywords: normalizeKeywords(record.keywords),
    worldview: clampText(record.worldview, SERIES_WORLDVIEW_MAX),
    prompt: clampText(record.prompt, SERIES_PROMPT_MAX),
    persona: clampText(record.persona, SERIES_PERSONA_MAX),
  };
}

export function isSeriesAiDraftUsable(draft: SeriesAiDraft): boolean {
  return (
    draft.title.length > 0 &&
    draft.summary.length > 0 &&
    draft.keywords.length > 0 &&
    draft.worldview.length > 0 &&
    draft.prompt.length > 0 &&
    draft.persona.length > 0
  );
}
