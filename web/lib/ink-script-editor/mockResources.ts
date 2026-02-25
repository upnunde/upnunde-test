import type { GameResource, ResourceType } from "../../types/editor";

/** 카테고리별 목업 리소스 (Single Slot 선택용) - RESOURCE_ORDER 순서 */
export const MOCK_RESOURCES: GameResource[] = [
  { id: "char-1", name: "주인공", type: "character", url: "" },
  { id: "char-2", name: "히로인", type: "character", url: "" },
  { id: "char-3", name: "조연 A", type: "character", url: "" },
  { id: "bg-1", name: "교실", type: "background", url: "" },
  { id: "bg-2", name: "복도", type: "background", url: "" },
  { id: "bg-3", name: "옥상", type: "background", url: "" },
  { id: "bgm-1", name: "일상 BGM", type: "bgm", url: "" },
  { id: "bgm-2", name: "긴장 BGM", type: "bgm", url: "" },
  { id: "sound-1", name: "문 열림", type: "sound", url: "" },
  { id: "sound-2", name: "발걸음", type: "sound", url: "" },
  { id: "dir-1", name: "페이드 인", type: "direction", url: "" },
  { id: "dir-2", name: "흔들림", type: "direction", url: "" },
];

const ATTRIBUTE_KEYS = [
  "characterId",
  "backgroundId",
  "bgmId",
  "soundId",
  "directionId",
] as const;

export type AttributeKey = (typeof ATTRIBUTE_KEYS)[number];

export function getResourcesByType(
  type: ResourceType,
  resources: GameResource[] = MOCK_RESOURCES
): GameResource[] {
  return resources.filter((r) => r.type === type);
}

export function getAttributeKeyForType(type: ResourceType): AttributeKey | null {
  const map: Record<ResourceType, AttributeKey> = {
    character: "characterId",
    background: "backgroundId",
    bgm: "bgmId",
    sound: "soundId",
    direction: "directionId",
  };
  return map[type];
}
