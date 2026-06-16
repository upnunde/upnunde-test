import {
  buildCharacterDraftUserPrompt,
  CHARACTER_DRAFT_SYSTEM_PROMPT,
} from "@/lib/ai/character-draft-prompt";
import {
  callOpenAiJsonChat,
  FORM_AI_DRAFT_ERROR_CODES,
  FormAiDraftServerError,
} from "@/lib/ai/openai-json";
import type { CharacterAiDraft } from "@/lib/character-ai-draft-types";
import {
  isCharacterAiDraftUsable,
  normalizeCharacterAiDraft,
} from "@/lib/normalize-character-ai-draft";

/** @deprecated FormAiDraftServerError 사용 */
export class CharacterAiDraftServerError extends FormAiDraftServerError {}

export async function generateCharacterDraftWithLlm(
  brief: string,
): Promise<CharacterAiDraft> {
  const draft = normalizeCharacterAiDraft(
    await callOpenAiJsonChat({
      systemPrompt: CHARACTER_DRAFT_SYSTEM_PROMPT,
      userPrompt: buildCharacterDraftUserPrompt(brief),
    }),
  );

  if (!isCharacterAiDraftUsable(draft)) {
    throw new FormAiDraftServerError(
      "생성된 초안이 충분하지 않아요. 조금 더 구체적으로 입력해 주세요.",
      FORM_AI_DRAFT_ERROR_CODES.GENERATION_FAILED,
      422,
    );
  }

  return draft;
}
