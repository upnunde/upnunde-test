import type { ImageResourceKind } from "@/types/resource";
import {
  RESOURCE_DESCRIPTION_MAX,
  RESOURCE_KIND_LABELS,
  RESOURCE_NAME_MAX,
} from "@/lib/resource-ai-draft-types";

export function buildResourceDraftSystemPrompt(kind: ImageResourceKind): string {
  const labels = RESOURCE_KIND_LABELS[kind];

  return `당신은 인터랙티브 픽션·비주얼 노벨용 ${labels.entity} 리소스 설정 작가입니다.
창작자의 서술형 설명을 읽고 등록 폼 JSON 초안을 만듭니다.

반드시 아래 JSON만 반환하세요.
{
  "name": string,
  "description": string
}

규칙:
- name: ${labels.nameHint} (${RESOURCE_NAME_MAX}자 이하)
- description: ${labels.descriptionHint} (${RESOURCE_DESCRIPTION_MAX}자 이하, 한국어)
- 입력에 없는 설정은 과도하게 지어내지 말고 주어진 서술을 풍부하게 풀어 쓸 것`;
}

export function buildResourceDraftUserPrompt(brief: string): string {
  return `아래 설명을 바탕으로 리소스 등록 폼 JSON을 생성해 주세요.

---
${brief}
---`;
}
