export const FORM_AI_DRAFT_ERROR_CODES = {
  AI_NOT_CONFIGURED: "AI_NOT_CONFIGURED",
  INVALID_BRIEF: "INVALID_BRIEF",
  GENERATION_FAILED: "GENERATION_FAILED",
} as const;

export type FormAiDraftErrorCode =
  (typeof FORM_AI_DRAFT_ERROR_CODES)[keyof typeof FORM_AI_DRAFT_ERROR_CODES];

const DEFAULT_OPENAI_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";

export class FormAiDraftServerError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly status = 500,
  ) {
    super(message);
    this.name = "FormAiDraftServerError";
  }
}

export function getOpenAiConfig() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new FormAiDraftServerError(
      "AI 초안 생성이 설정되지 않았어요.",
      FORM_AI_DRAFT_ERROR_CODES.AI_NOT_CONFIGURED,
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

export function parseJsonContent(content: string): unknown {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const jsonText = fenced?.[1]?.trim() || trimmed;

  try {
    return JSON.parse(jsonText);
  } catch {
    throw new FormAiDraftServerError(
      "AI 응답을 해석하지 못했어요.",
      FORM_AI_DRAFT_ERROR_CODES.GENERATION_FAILED,
      502,
    );
  }
}

export async function callOpenAiJsonChat(options: {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
}): Promise<unknown> {
  const { apiKey, baseUrl, model } = getOpenAiConfig();

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: options.temperature ?? 0.65,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: options.systemPrompt },
        { role: "user", content: options.userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    throw new FormAiDraftServerError(
      "AI 초안 생성에 실패했어요. 잠시 후 다시 시도해 주세요.",
      FORM_AI_DRAFT_ERROR_CODES.GENERATION_FAILED,
      502,
    );
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    throw new FormAiDraftServerError(
      "AI 응답이 비어 있어요.",
      FORM_AI_DRAFT_ERROR_CODES.GENERATION_FAILED,
      502,
    );
  }

  return parseJsonContent(content);
}
