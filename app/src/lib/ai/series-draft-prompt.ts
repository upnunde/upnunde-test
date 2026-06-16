import {
  SERIES_KEYWORD_MAX_COUNT,
  SERIES_KEYWORD_MAX_LEN,
  SERIES_PERSONA_MAX,
  SERIES_PROMPT_MAX,
  SERIES_SUMMARY_MAX,
  SERIES_TITLE_MAX,
  SERIES_WORLDVIEW_MAX,
} from "@/lib/series-ai-draft-types";

export const SERIES_DRAFT_SYSTEM_PROMPT = `당신은 인터랙티브 픽션·비주얼 노벨용 시리즈 설정 작가입니다.
창작자의 서술형 설명을 읽고 시리즈 등록 폼 JSON 초안을 만듭니다.

반드시 아래 JSON만 반환하세요.
{
  "title": string,
  "summary": string,
  "keywords": string[],
  "worldview": string,
  "prompt": string,
  "persona": string
}

규칙:
- title: 시리즈 제목 (${SERIES_TITLE_MAX}자 이하)
- summary: 한 줄 핵심 컨셉 (${SERIES_SUMMARY_MAX}자 이하)
- keywords: 장르·분위기 키워드 ${SERIES_KEYWORD_MAX_COUNT}개 이하, 각 ${SERIES_KEYWORD_MAX_LEN}자 이하, # 없이
- worldview: 세계관·배경 설명 (${SERIES_WORLDVIEW_MAX}자 이하)
- prompt: AI 전개 가이드용 세계관 프롬프트 (${SERIES_PROMPT_MAX}자 이하)
- persona: 작품 톤·서술 페르소나 (${SERIES_PERSONA_MAX}자 이하)
- 모든 문자열은 한국어`;

export function buildSeriesDraftUserPrompt(brief: string): string {
  return `아래 설명을 바탕으로 시리즈 등록 폼 JSON을 생성해 주세요.

---
${brief}
---`;
}
