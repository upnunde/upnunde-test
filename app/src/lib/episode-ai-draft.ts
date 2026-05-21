import { DUMMY_DEFAULT_THUMBNAIL } from "@/lib/dummy-thumbnail-images";
import { initialBackgrounds } from "@/lib/resourceMockData";

export interface EpisodeAiDraft {
  title: string;
  summary: string;
  history: string;
  script: string;
  thumbnailUrl: string;
}

const DEFAULT_THUMBNAIL =
  initialBackgrounds[0]?.imageUrl ?? DUMMY_DEFAULT_THUMBNAIL;

export const AI_DRAFT_DELAY_MS = 3200;
/** 필드별 순차 채우기 간격 */
export const AI_DRAFT_FIELD_STAGGER_MS = 380;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function firstSentence(text: string, maxLen: number): string {
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (!trimmed) return "";
  const sentence = trimmed.split(/[.!?。\n]/)[0]?.trim() ?? trimmed;
  return sentence.length > maxLen ? `${sentence.slice(0, maxLen - 1)}…` : sentence;
}

function buildScriptFromBrief(brief: string): string {
  const lines = brief
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const sceneLine = firstSentence(brief, 40) || "이번 화의 시작";
  const blocks: string[] = [
    `[scene] ${sceneLine}`,
    `[top_desc] ${brief.slice(0, 120)}`,
  ];

  if (lines.length > 0) {
    blocks.push(`[text speaker="나레이션"] ${lines[0]}`);
    for (const line of lines.slice(1, 4)) {
      blocks.push(`[text speaker="나레이션"] ${line}`);
    }
  } else {
    blocks.push(`[text speaker="나레이션"] ${brief.slice(0, 200)}`);
  }

  return blocks.join("\n");
}

/** API 연동 전 프로토타입 — 간략 입력만으로 필드 초안 생성 (샘플 대본 혼입 없음) */
export async function generateEpisodeDraftFromBrief(
  brief: string,
): Promise<EpisodeAiDraft> {
  const normalized = brief.trim();
  await delay(AI_DRAFT_DELAY_MS);

  if (!normalized) {
    return {
      title: "",
      summary: "",
      history: "",
      script: "",
      thumbnailUrl: "",
    };
  }

  const compact = normalized.replace(/\s+/g, " ");
  const titleBase = firstSentence(compact, 24) || "새 에피소드";
  const title =
    titleBase.length <= 50 ? titleBase : `${titleBase.slice(0, 49)}…`;
  const summaryRaw = firstSentence(compact, 96) || compact.slice(0, 100);
  const summary =
    summaryRaw.length > 100 ? `${summaryRaw.slice(0, 99)}…` : summaryRaw;
  const history =
    normalized.length > 5000 ? `${normalized.slice(0, 4999)}…` : normalized;
  const script = buildScriptFromBrief(normalized);

  return {
    title,
    summary,
    history,
    script: script.length > 5000 ? `${script.slice(0, 4999)}…` : script,
    thumbnailUrl: DEFAULT_THUMBNAIL,
  };
}
