import {
  buildSeriesDraftUserPrompt,
  SERIES_DRAFT_SYSTEM_PROMPT,
} from "@/lib/ai/series-draft-prompt";
import {
  callOpenAiJsonChat,
  FORM_AI_DRAFT_ERROR_CODES,
  FormAiDraftServerError,
} from "@/lib/ai/openai-json";
import type { SeriesAiDraft } from "@/lib/series-ai-draft-types";
import {
  isSeriesAiDraftUsable,
  normalizeSeriesAiDraft,
} from "@/lib/normalize-series-ai-draft";

export async function generateSeriesDraftWithLlm(brief: string): Promise<SeriesAiDraft> {
  const draft = normalizeSeriesAiDraft(
    await callOpenAiJsonChat({
      systemPrompt: SERIES_DRAFT_SYSTEM_PROMPT,
      userPrompt: buildSeriesDraftUserPrompt(brief),
    }),
  );

  if (!isSeriesAiDraftUsable(draft)) {
    throw new FormAiDraftServerError(
      "생성된 초안이 충분하지 않아요. 조금 더 구체적으로 입력해 주세요.",
      FORM_AI_DRAFT_ERROR_CODES.GENERATION_FAILED,
      422,
    );
  }

  return draft;
}
