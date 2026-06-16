import { NextResponse } from "next/server";
import { generateResourceDraftWithLlm } from "@/lib/ai/generate-resource-draft-server";
import { assertBriefLength, parseBriefFromBody } from "@/lib/ai/validate-brief";
import {
  FORM_AI_DRAFT_ERROR_CODES,
  FormAiDraftServerError,
} from "@/lib/ai/openai-json";
import type { ImageResourceKind } from "@/types/resource";
import { RESOURCE_BRIEF_MAX } from "@/lib/resource-ai-draft-types";

export const runtime = "nodejs";

const RESOURCE_KINDS: ImageResourceKind[] = ["background", "scene", "media", "gallery"];

function parseKind(body: unknown): ImageResourceKind {
  if (!body || typeof body !== "object" || !("kind" in body)) return "background";
  const kind = body.kind;
  return RESOURCE_KINDS.includes(kind as ImageResourceKind)
    ? (kind as ImageResourceKind)
    : "background";
}

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
  const kind = parseKind(body);

  try {
    assertBriefLength(brief, RESOURCE_BRIEF_MAX);
    const draft = await generateResourceDraftWithLlm(brief, kind);
    return NextResponse.json(draft);
  } catch (error) {
    if (error instanceof FormAiDraftServerError) {
      return NextResponse.json(
        { code: error.code, message: error.message },
        { status: error.status },
      );
    }

    console.error("[resource-ai-draft]", error);
    return NextResponse.json(
      {
        code: FORM_AI_DRAFT_ERROR_CODES.GENERATION_FAILED,
        message: "AI 초안 생성 중 오류가 발생했어요.",
      },
      { status: 500 },
    );
  }
}
