import type { ImageResourceKind } from "@/types/resource";

export interface ResourceAiDraft {
  name: string;
  description: string;
}

export interface ResourceAiDraftRequest {
  brief: string;
  kind: ImageResourceKind;
}

export const RESOURCE_NAME_MAX = 80;
export const RESOURCE_DESCRIPTION_MAX = 500;
export const RESOURCE_BRIEF_MAX = 5000;

export const RESOURCE_KIND_LABELS: Record<
  ImageResourceKind,
  { entity: string; nameHint: string; descriptionHint: string }
> = {
  background: {
    entity: "배경",
    nameHint: "장면을 직관적으로 식별할 수 있는 명칭",
    descriptionHint: "화면 분위기·시각적 특성·장면 묘사",
  },
  scene: {
    entity: "연출장면",
    nameHint: "연출 컷을 구분할 수 있는 이름",
    descriptionHint: "핵심 연출 의도·장면 연출",
  },
  media: {
    entity: "미디어",
    nameHint: "영상·이미지 등을 구분할 수 있는 이름",
    descriptionHint: "사용 장면·미디어 역할",
  },
  gallery: {
    entity: "갤러리 CG",
    nameHint: "CG/삽화 장면을 구분할 수 있는 이름",
    descriptionHint: "스토리적 의미·장면 설명",
  },
};
