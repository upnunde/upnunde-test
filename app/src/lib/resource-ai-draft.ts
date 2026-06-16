import { AI_DRAFT_DELAY_MS } from "@/lib/episode-ai-draft";
import { FORM_AI_DRAFT_ERROR_CODES } from "@/lib/ai/openai-json";
import type { ImageResourceKind } from "@/types/resource";
import type { ResourceAiDraft } from "@/lib/resource-ai-draft-types";
import {
  isResourceAiDraftUsable,
  normalizeResourceAiDraft,
} from "@/lib/normalize-resource-ai-draft";

export type { ResourceAiDraft } from "@/lib/resource-ai-draft-types";

export class ResourceAiDraftError extends Error {
  constructor(
    message: string,
    readonly code?: string,
  ) {
    super(message);
    this.name = "ResourceAiDraftError";
  }
}

export interface GenerateResourceDraftResult {
  draft: ResourceAiDraft;
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

async function generateResourceDraftFallback(
  brief: string,
): Promise<ResourceAiDraft> {
  const normalized = brief.trim();
  await delay(AI_DRAFT_DELAY_MS);

  if (!normalized) {
    return { name: "", description: "" };
  }

  const compact = normalized.replace(/\s+/g, " ");
  const name = firstSentence(compact, 40) || compact.slice(0, 40);
  const description =
    compact.length > 200 ? `${compact.slice(0, 199)}…` : compact;

  return normalizeResourceAiDraft({ name, description });
}

async function fetchResourceDraftFromApi(
  brief: string,
  kind: ImageResourceKind,
): Promise<ResourceAiDraft> {
  const response = await fetch("/api/resource-ai-draft", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ brief, kind }),
  });

  const payload = (await response.json().catch(() => ({}))) as {
    code?: string;
    message?: string;
    name?: string;
    description?: string;
  };

  if (response.status === 503 && payload.code === FORM_AI_DRAFT_ERROR_CODES.AI_NOT_CONFIGURED) {
    throw new ResourceAiDraftError(
      payload.message ?? "AI 초안 생성이 설정되지 않았어요.",
      payload.code,
    );
  }

  if (!response.ok) {
    throw new ResourceAiDraftError(
      payload.message ?? "AI 초안 생성에 실패했어요.",
      payload.code,
    );
  }

  const draft = normalizeResourceAiDraft(payload);
  if (!isResourceAiDraftUsable(draft)) {
    throw new ResourceAiDraftError("생성된 초안이 충분하지 않아요.");
  }

  return draft;
}

export async function generateResourceDraftFromBrief(
  brief: string,
  kind: ImageResourceKind,
): Promise<GenerateResourceDraftResult> {
  const normalized = brief.trim();
  if (!normalized) {
    return { draft: { name: "", description: "" }, usedFallback: false };
  }

  try {
    const draft = await fetchResourceDraftFromApi(normalized, kind);
    return { draft, usedFallback: false };
  } catch (error) {
    if (
      error instanceof ResourceAiDraftError &&
      error.code === FORM_AI_DRAFT_ERROR_CODES.AI_NOT_CONFIGURED
    ) {
      const draft = await generateResourceDraftFallback(normalized);
      return { draft, usedFallback: true };
    }
    throw error;
  }
}
