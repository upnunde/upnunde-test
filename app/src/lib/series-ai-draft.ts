import { AI_DRAFT_DELAY_MS } from "@/lib/episode-ai-draft";
import { FORM_AI_DRAFT_ERROR_CODES } from "@/lib/ai/openai-json";
import type { SeriesAiDraft } from "@/lib/series-ai-draft-types";
import {
  isSeriesAiDraftUsable,
  normalizeSeriesAiDraft,
} from "@/lib/normalize-series-ai-draft";

export type { SeriesAiDraft } from "@/lib/series-ai-draft-types";

export class SeriesAiDraftError extends Error {
  constructor(
    message: string,
    readonly code?: string,
  ) {
    super(message);
    this.name = "SeriesAiDraftError";
  }
}

export interface GenerateSeriesDraftResult {
  draft: SeriesAiDraft;
  usedFallback: boolean;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function firstSentence(text: string, maxLen: number): string {
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (!trimmed) return "";
  const sentence = trimmed.split(/[.!?。\n]/)[0]?.trim() ?? trimmed;
  return sentence.length > maxLen ? `${sentence.slice(0, maxLen - 1)}…` : sentence;
}

function extractKeywords(brief: string, maxTags = 4): string[] {
  const tokens = brief
    .replace(/[#,.!?。]/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);

  const unique: string[] = [];
  for (const token of tokens) {
    if (unique.includes(token)) continue;
    unique.push(token.slice(0, 12));
    if (unique.length >= maxTags) break;
  }
  return unique;
}

async function generateSeriesDraftFallback(brief: string): Promise<SeriesAiDraft> {
  const normalized = brief.trim();
  await delay(AI_DRAFT_DELAY_MS);

  if (!normalized) {
    return {
      title: "",
      summary: "",
      keywords: [],
      worldview: "",
      prompt: "",
      persona: "",
    };
  }

  const compact = normalized.replace(/\s+/g, " ");
  const title = firstSentence(compact, 30) || compact.slice(0, 30);
  const summary = firstSentence(compact, 80) || compact.slice(0, 80);
  const keywords = extractKeywords(normalized);
  const worldview =
    compact.length > 400 ? `${compact.slice(0, 399)}…` : compact;
  const prompt = worldview;
  const persona = firstSentence(compact, 40) || "서정적 1인칭";

  return normalizeSeriesAiDraft({
    title,
    summary,
    keywords,
    worldview,
    prompt,
    persona,
  });
}

async function fetchSeriesDraftFromApi(brief: string): Promise<SeriesAiDraft> {
  const response = await fetch("/api/series-ai-draft", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ brief }),
  });

  const payload = (await response.json().catch(() => ({}))) as {
    code?: string;
    message?: string;
  } & Partial<SeriesAiDraft>;

  if (response.status === 503 && payload.code === FORM_AI_DRAFT_ERROR_CODES.AI_NOT_CONFIGURED) {
    throw new SeriesAiDraftError(
      payload.message ?? "AI 초안 생성이 설정되지 않았어요.",
      payload.code,
    );
  }

  if (!response.ok) {
    throw new SeriesAiDraftError(
      payload.message ?? "AI 초안 생성에 실패했어요.",
      payload.code,
    );
  }

  const draft = normalizeSeriesAiDraft(payload);
  if (!isSeriesAiDraftUsable(draft)) {
    throw new SeriesAiDraftError("생성된 초안이 충분하지 않아요.");
  }

  return draft;
}

export async function generateSeriesDraftFromBrief(
  brief: string,
): Promise<GenerateSeriesDraftResult> {
  const normalized = brief.trim();
  if (!normalized) {
    return {
      draft: {
        title: "",
        summary: "",
        keywords: [],
        worldview: "",
        prompt: "",
        persona: "",
      },
      usedFallback: false,
    };
  }

  try {
    const draft = await fetchSeriesDraftFromApi(normalized);
    return { draft, usedFallback: false };
  } catch (error) {
    if (
      error instanceof SeriesAiDraftError &&
      error.code === FORM_AI_DRAFT_ERROR_CODES.AI_NOT_CONFIGURED
    ) {
      const draft = await generateSeriesDraftFallback(normalized);
      return { draft, usedFallback: true };
    }
    throw error;
  }
}
