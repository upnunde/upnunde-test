import { NextResponse } from "next/server";
import {
  CharacterAiDraftServerError,
  generateCharacterDraftWithLlm,
} from "@/lib/ai/generate-character-draft-server";
import { CHARACTER_AI_DRAFT_ERROR_CODES } from "@/lib/character-ai-draft-types";
import { CHARACTER_BRIEF_MAX } from "@/lib/character-form-limits";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { code: CHARACTER_AI_DRAFT_ERROR_CODES.INVALID_BRIEF, message: "요청 형식이 올바르지 않아요." },
      { status: 400 },
    );
  }

  const brief =
    body && typeof body === "object" && "brief" in body && typeof body.brief === "string"
      ? body.brief.trim()
      : "";

  if (brief.length < 2) {
    return NextResponse.json(
      {
        code: CHARACTER_AI_DRAFT_ERROR_CODES.INVALID_BRIEF,
        message: "캐릭터 설명을 2자 이상 입력해 주세요.",
      },
      { status: 400 },
    );
  }

  if (brief.length > CHARACTER_BRIEF_MAX) {
    return NextResponse.json(
      {
        code: CHARACTER_AI_DRAFT_ERROR_CODES.INVALID_BRIEF,
        message: `캐릭터 설명은 ${CHARACTER_BRIEF_MAX}자 이하로 입력해 주세요.`,
      },
      { status: 400 },
    );
  }

  try {
    const draft = await generateCharacterDraftWithLlm(brief);
    return NextResponse.json(draft);
  } catch (error) {
    if (error instanceof CharacterAiDraftServerError) {
      return NextResponse.json(
        { code: error.code, message: error.message },
        { status: error.status },
      );
    }

    console.error("[character-ai-draft]", error);
    return NextResponse.json(
      {
        code: CHARACTER_AI_DRAFT_ERROR_CODES.GENERATION_FAILED,
        message: "AI 초안 생성 중 오류가 발생했어요.",
      },
      { status: 500 },
    );
  }
}
