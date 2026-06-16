import { FORM_AI_DRAFT_ERROR_CODES, FormAiDraftServerError } from "@/lib/ai/openai-json";

export function parseBriefFromBody(body: unknown): string {
  if (!body || typeof body !== "object" || !("brief" in body)) return "";
  return typeof body.brief === "string" ? body.brief.trim() : "";
}

export function assertBriefLength(brief: string, maxLen: number): void {
  if (brief.length < 2) {
    throw new FormAiDraftServerError(
      "설명을 2자 이상 입력해 주세요.",
      FORM_AI_DRAFT_ERROR_CODES.INVALID_BRIEF,
      400,
    );
  }
  if (brief.length > maxLen) {
    throw new FormAiDraftServerError(
      `입력은 ${maxLen}자 이하로 작성해 주세요.`,
      FORM_AI_DRAFT_ERROR_CODES.INVALID_BRIEF,
      400,
    );
  }
}
