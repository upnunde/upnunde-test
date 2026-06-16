import {
  buildCharacterDraftUserPrompt,
  CHARACTER_DRAFT_SYSTEM_PROMPT,
} from "@/lib/ai/character-draft-prompt";
import type { CharacterAiDraft } from "@/lib/character-ai-draft-types";
import { CHARACTER_AI_DRAFT_ERROR_CODES } from "@/lib/character-ai-draft-types";
import {
  isCharacterAiDraftUsable,
  normalizeCharacterAiDraft,
} from "@/lib/normalize-character-ai-draft";

const DEFAULT_OPENAI_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";

export class CharacterAiDraftServerError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly status = 500,
  ) {
    super(message);
    this.name = "CharacterAiDraftServerError";
  }
}

function getOpenAiConfig() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new CharacterAiDraftServerError(
      "AI 초안 생성이 설정되지 않았어요.",
      CHARACTER_AI_DRAFT_ERROR_CODES.AI_NOT_CONFIGURED,
      503,
    );
  }

  return {
    apiKey,
    baseUrl: (process.env.OPENAI_BASE_URL?.trim() || DEFAULT_OPENAI_BASE_URL).replace(
      /\/$/,
      "",
    ),
    model: process.env.OPENAI_MODEL?.trim() || DEFAULT_OPENAI_MODEL,
  };
}

function parseJsonContent(content: string): unknown {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const jsonText = fenced?.[1]?.trim() || trimmed;

  try {
    return JSON.parse(jsonText);
  } catch {
    throw new CharacterAiDraftServerError(
      "AI 응답을 해석하지 못했어요.",
      CHARACTER_AI_DRAFT_ERROR_CODES.GENERATION_FAILED,
      502,
    );
  }
}

/** 서버 전용 — OpenAI 호환 Chat Completions로 캐릭터 텍스트 초안 생성 */
export async function generateCharacterDraftWithLlm(
  brief: string,
): Promise<CharacterAiDraft> {
  const { apiKey, baseUrl, model } = getOpenAiConfig();

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.65,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: CHARACTER_DRAFT_SYSTEM_PROMPT },
        { role: "user", content: buildCharacterDraftUserPrompt(brief) },
      ],
    }),
  });

  if (!response.ok) {
    throw new CharacterAiDraftServerError(
      "AI 초안 생성에 실패했어요. 잠시 후 다시 시도해 주세요.",
      CHARACTER_AI_DRAFT_ERROR_CODES.GENERATION_FAILED,
      502,
    );
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    throw new CharacterAiDraftServerError(
      "AI 응답이 비어 있어요.",
      CHARACTER_AI_DRAFT_ERROR_CODES.GENERATION_FAILED,
      502,
    );
  }

  const draft = normalizeCharacterAiDraft(parseJsonContent(content));
  if (!isCharacterAiDraftUsable(draft)) {
    throw new CharacterAiDraftServerError(
      "생성된 초안이 충분하지 않아요. 조금 더 구체적으로 입력해 주세요.",
      CHARACTER_AI_DRAFT_ERROR_CODES.GENERATION_FAILED,
      422,
    );
  }

  return draft;
}
