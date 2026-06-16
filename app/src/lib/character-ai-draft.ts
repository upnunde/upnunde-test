import { AI_DRAFT_DELAY_MS } from "@/lib/episode-ai-draft";
import { FORM_AI_DRAFT_ERROR_CODES } from "@/lib/ai/openai-json";
import {
  isCharacterAiDraftUsable,
  normalizeCharacterAiDraft,
} from "@/lib/normalize-character-ai-draft";

import type { CharacterAiDraft } from "@/lib/character-ai-draft-types";

export type { CharacterAiDraft };

export class CharacterAiDraftError extends Error {
  constructor(
    message: string,
    readonly code?: string,
  ) {
    super(message);
    this.name = "CharacterAiDraftError";
  }
}

export interface GenerateCharacterDraftResult {
  draft: CharacterAiDraft;
  /** API 키 미설정 등으로 규칙 기반 폴백을 사용했는지 */
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

function extractTags(brief: string, maxTags = 3): string[] {
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

function deriveName(brief: string, maxLen: number): string {
  const compact = brief.trim().replace(/\s+/g, " ");
  if (!compact) return "";

  const quoted = compact.match(/[「『"']([^」』"']{2,12})[」』"']/);
  if (quoted?.[1]) {
    return quoted[1].slice(0, maxLen);
  }

  const firstWord = compact.split(/\s+/)[0] ?? "";
  if (firstWord.length >= 2 && firstWord.length <= maxLen) {
    return firstWord;
  }

  return compact.slice(0, Math.min(maxLen, 6));
}

function buildGreeting(brief: string, name: string, maxLen: number): string {
  const lead = firstSentence(brief, 80);
  if (!lead) return "";

  const subject = name || "나";
  const base = lead.includes(subject) ? lead : `${subject}입니다. ${lead}`;
  return base.length > maxLen ? `${base.slice(0, maxLen - 1)}…` : base;
}

/** API 미연동·오프라인 시 규칙 기반 폴백 */
async function generateCharacterDraftFallback(brief: string): Promise<CharacterAiDraft> {
  const normalized = brief.trim();
  await delay(AI_DRAFT_DELAY_MS);

  if (!normalized) {
    return { name: "", summary: "", tags: [], greeting: "" };
  }

  const compact = normalized.replace(/\s+/g, " ");
  const name = deriveName(normalized, 30);
  const summary = firstSentence(compact, 50) || compact.slice(0, 50);
  const tags = extractTags(normalized);
  const greeting = buildGreeting(normalized, name, 300);

  return normalizeCharacterAiDraft({ name, summary, tags, greeting });
}

async function fetchCharacterDraftFromApi(brief: string): Promise<CharacterAiDraft> {
  const response = await fetch("/api/character-ai-draft", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ brief }),
  });

  const payload = (await response.json().catch(() => ({}))) as {
    code?: string;
    message?: string;
    name?: string;
    summary?: string;
    tags?: string[];
    greeting?: string;
  };

  if (response.status === 503 && payload.code === FORM_AI_DRAFT_ERROR_CODES.AI_NOT_CONFIGURED) {
    throw new CharacterAiDraftError(
      payload.message ?? "AI 초안 생성이 설정되지 않았어요.",
      payload.code,
    );
  }

  if (!response.ok) {
    throw new CharacterAiDraftError(
      payload.message ?? "AI 초안 생성에 실패했어요.",
      payload.code,
    );
  }

  const draft = normalizeCharacterAiDraft(payload);
  if (!isCharacterAiDraftUsable(draft)) {
    throw new CharacterAiDraftError("생성된 초안이 충분하지 않아요.");
  }

  return draft;
}

/**
 * 서술형 입력 → 인물정보 텍스트 필드 초안.
 * LLM API 우선, 미설정 시 규칙 기반 폴백.
 */
export async function generateCharacterDraftFromBrief(
  brief: string,
): Promise<GenerateCharacterDraftResult> {
  const normalized = brief.trim();
  if (!normalized) {
    return {
      draft: { name: "", summary: "", tags: [], greeting: "" },
      usedFallback: false,
    };
  }

  try {
    const draft = await fetchCharacterDraftFromApi(normalized);
    return { draft, usedFallback: false };
  } catch (error) {
    if (
      error instanceof CharacterAiDraftError &&
      error.code === FORM_AI_DRAFT_ERROR_CODES.AI_NOT_CONFIGURED
    ) {
      const draft = await generateCharacterDraftFallback(normalized);
      return { draft, usedFallback: true };
    }
    throw error;
  }
}
