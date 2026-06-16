import { NextResponse } from "next/server";
import { generateSeriesDraftWithLlm } from "@/lib/ai/generate-series-draft-server";
import { assertBriefLength, parseBriefFromBody } from "@/lib/ai/validate-brief";
import {
  FORM_AI_DRAFT_ERROR_CODES,
  FormAiDraftServerError,
} from "@/lib/ai/openai-json";
import { SERIES_BRIEF_MAX } from "@/lib/series-ai-draft-types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { code: FORM_AI_DRAFT_ERROR_CODES.INVALID_BRIEF, message: "요청 형식이 올바르지 않아요." },
      { status: 400 },
    );
  }

  const brief = parseBriefFromBody(body);

  try {
    assertBriefLength(brief, SERIES_BRIEF_MAX);
    const draft = await generateSeriesDraftWithLlm(brief);
    return NextResponse.json(draft);
  } catch (error) {
    if (error instanceof FormAiDraftServerError) {
      return NextResponse.json(
        { code: error.code, message: error.message },
        { status: error.status },
      );
    }

    console.error("[series-ai-draft]", error);
    return NextResponse.json(
      {
        code: FORM_AI_DRAFT_ERROR_CODES.GENERATION_FAILED,
        message: "AI 초안 생성 중 오류가 발생했어요.",
      },
      { status: 500 },
    );
  }
}
