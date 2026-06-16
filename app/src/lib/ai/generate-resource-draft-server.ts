import {
  buildResourceDraftSystemPrompt,
  buildResourceDraftUserPrompt,
} from "@/lib/ai/resource-draft-prompt";
import {
  callOpenAiJsonChat,
  FORM_AI_DRAFT_ERROR_CODES,
  FormAiDraftServerError,
} from "@/lib/ai/openai-json";
import type { ImageResourceKind } from "@/types/resource";
import type { ResourceAiDraft } from "@/lib/resource-ai-draft-types";
import {
  isResourceAiDraftUsable,
  normalizeResourceAiDraft,
} from "@/lib/normalize-resource-ai-draft";

export async function generateResourceDraftWithLlm(
  brief: string,
  kind: ImageResourceKind,
): Promise<ResourceAiDraft> {
  const draft = normalizeResourceAiDraft(
    await callOpenAiJsonChat({
      systemPrompt: buildResourceDraftSystemPrompt(kind),
      userPrompt: buildResourceDraftUserPrompt(brief),
    }),
  );

  if (!isResourceAiDraftUsable(draft)) {
    throw new FormAiDraftServerError(
      "생성된 초안이 충분하지 않아요. 조금 더 구체적으로 입력해 주세요.",
      FORM_AI_DRAFT_ERROR_CODES.GENERATION_FAILED,
      422,
    );
  }

  return draft;
}
