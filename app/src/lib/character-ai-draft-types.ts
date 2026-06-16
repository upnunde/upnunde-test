export interface CharacterAiDraft {
  name: string;
  summary: string;
  tags: string[];
  greeting: string;
}

export const CHARACTER_AI_DRAFT_ERROR_CODES = {
  AI_NOT_CONFIGURED: "AI_NOT_CONFIGURED",
  INVALID_BRIEF: "INVALID_BRIEF",
  GENERATION_FAILED: "GENERATION_FAILED",
} as const;

export type CharacterAiDraftErrorCode =
  (typeof CHARACTER_AI_DRAFT_ERROR_CODES)[keyof typeof CHARACTER_AI_DRAFT_ERROR_CODES];
