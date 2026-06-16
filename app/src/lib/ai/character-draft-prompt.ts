import {
  CHARACTER_GREETING_MAX,
  CHARACTER_NAME_MAX,
  CHARACTER_SUMMARY_MAX,
  CHARACTER_TAG_MAX_COUNT,
  CHARACTER_TAG_MAX_LEN,
} from "@/lib/character-form-limits";

export const CHARACTER_DRAFT_SYSTEM_PROMPT = `당신은 인터랙티브 픽션·비주얼 노벨용 캐릭터 설정 작가입니다.
창작자가 서술형으로 적은 캐릭터 설명을 읽고, 인물정보 폼에 넣을 JSON 초안을 만듭니다.

반드시 아래 JSON 스키마만 반환하세요. 다른 텍스트·마크다운·코드블록은 금지합니다.
{
  "name": string,
  "summary": string,
  "tags": string[],
  "greeting": string
}

작성 규칙:
- name: 캐릭터 이름 (${CHARACTER_NAME_MAX}자 이하). 설명에 이름이 없으면 맥락에 맞게 창작.
- summary: 한 줄 인물 소개 (${CHARACTER_SUMMARY_MAX}자 이하). 성격·역할·특징이 한눈에 드러나게.
- tags: 성격·직업·관계 등 핵심 키워드 ${CHARACTER_TAG_MAX_COUNT}개 이하, 각 ${CHARACTER_TAG_MAX_LEN}자 이하, # 없이.
- greeting: 캐릭터 1인칭 첫인사 (${CHARACTER_GREETING_MAX}자 이하). 말투·성격이 드러나게 자연스럽게.
- 입력에 없는 설정은 과도하게 지어내지 말고, 주어진 서술을 바탕으로 풍부하게 풀어 쓸 것.
- 모든 문자열은 한국어.`;

export function buildCharacterDraftUserPrompt(brief: string): string {
  return `아래는 창작자가 입력한 캐릭터 설명입니다. 인물정보 필드를 채울 JSON을 생성해 주세요.

---
${brief}
---`;
}
