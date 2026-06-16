import { AI_DRAFT_DELAY_MS } from "@/lib/episode-ai-draft";

export interface CharacterAiDraft {
  name: string;
  summary: string;
  tags: string[];
  greeting: string;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function firstSentence(text: string, maxLen: number): string {
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (!trimmed) return "";
  const sentence = trimmed.split(/[.!?。\n]/)[0]?.trim() ?? trimmed;
  return sentence.length > maxLen ? `${sentence.slice(0, maxLen - 1)}…` : sentence;
}

function extractTags(brief: string, maxTags = 3): string[] {
  const tokens = brief
    .replace(/[#,.!?。]/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);

  const unique: string[] = [];
  for (const token of tokens) {
    if (unique.includes(token)) continue;
    unique.push(token.slice(0, 12));
    if (unique.length >= maxTags) break;
  }
  return unique;
}

function deriveName(brief: string, maxLen: number): string {
  const compact = brief.trim().replace(/\s+/g, " ");
  if (!compact) return "";

  const quoted = compact.match(/[「『"']([^」』"']{2,12})[」』"']/);
  if (quoted?.[1]) {
    return quoted[1].slice(0, maxLen);
  }

  const firstWord = compact.split(/\s+/)[0] ?? "";
  if (firstWord.length >= 2 && firstWord.length <= maxLen) {
    return firstWord;
  }

  return compact.slice(0, Math.min(maxLen, 6));
}

function buildGreeting(brief: string, name: string, maxLen: number): string {
  const lead = firstSentence(brief, 80);
  if (!lead) return "";

  const subject = name || "나";
  const base = lead.includes(subject)
    ? lead
    : `${subject}입니다. ${lead}`;
  return base.length > maxLen ? `${base.slice(0, maxLen - 1)}…` : base;
}

/** API 연동 전 프로토타입 — 간략 입력으로 캐릭터 텍스트 필드 초안 생성 */
export async function generateCharacterDraftFromBrief(
  brief: string,
): Promise<CharacterAiDraft> {
  const normalized = brief.trim();
  await delay(AI_DRAFT_DELAY_MS);

  if (!normalized) {
    return { name: "", summary: "", tags: [], greeting: "" };
  }

  const compact = normalized.replace(/\s+/g, " ");
  const name = deriveName(normalized, 30);
  const summary = firstSentence(compact, 50) || compact.slice(0, 50);
  const tags = extractTags(normalized);
  const greeting = buildGreeting(normalized, name, 300);

  return { name, summary, tags, greeting };
}
