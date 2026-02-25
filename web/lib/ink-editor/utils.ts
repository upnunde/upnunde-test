/**
 * Ink Editor Utility Functions
 */

import type {
  EpisodeBlock,
  SceneMarker,
  ScriptBlock,
  MappedResources,
  ScriptBlockAttributes,
} from "./types";

/**
 * 새로운 Scene Marker 생성
 */
export function createSceneMarker(
  sceneNumber: number,
  title: string = ""
): SceneMarker {
  return {
    type: "scene",
    id: `scene_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    sceneNumber,
    title,
  };
}

/**
 * 새로운 Script Block 생성
 */
export function createScriptBlock(
  content: string = "",
  blockType: "dialogue" | "description" = "dialogue"
): ScriptBlock {
  return {
    type: "script",
    id: `script_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    blockType,
    content,
    attributes: {
      characterId: null,
      backgroundId: null,
      bgmId: null,
      effectId: null,
      emotion: null,
    },
  };
}

/**
 * 블록 배열에서 특정 인덱스에 새 블록 삽입
 */
export function insertBlock(
  blocks: EpisodeBlock[],
  index: number,
  block: EpisodeBlock
): EpisodeBlock[] {
  const newBlocks = [...blocks];
  newBlocks.splice(index, 0, block);
  return newBlocks;
}

/**
 * 블록 배열에서 특정 블록 삭제
 */
export function removeBlock(
  blocks: EpisodeBlock[],
  blockId: string
): EpisodeBlock[] {
  return blocks.filter((block) => block.id !== blockId);
}

/**
 * 블록 배열에서 특정 블록 업데이트
 */
export function updateBlock(
  blocks: EpisodeBlock[],
  blockId: string,
  updates: Partial<EpisodeBlock>
): EpisodeBlock[] {
  return blocks.map((block) =>
    block.id === blockId ? ({ ...block, ...updates } as EpisodeBlock) : block
  );
}

/**
 * 블록 배열에서 특정 블록 찾기
 */
export function findBlock(
  blocks: EpisodeBlock[],
  blockId: string
): EpisodeBlock | undefined {
  return blocks.find((block) => block.id === blockId);
}

/**
 * 블록 배열에서 특정 블록의 인덱스 찾기
 */
export function findBlockIndex(
  blocks: EpisodeBlock[],
  blockId: string
): number {
  return blocks.findIndex((block) => block.id === blockId);
}

/**
 * 다음 Scene 번호 계산
 */
export function getNextSceneNumber(blocks: EpisodeBlock[]): number {
  const sceneMarkers = blocks.filter(
    (block) => block.type === "scene"
  ) as SceneMarker[];
  if (sceneMarkers.length === 0) return 1;
  const maxSceneNumber = Math.max(
    ...sceneMarkers.map((scene) => scene.sceneNumber)
  );
  return maxSceneNumber + 1;
}

/**
 * 블록 타입 가드
 */
export function isSceneMarker(block: EpisodeBlock): block is SceneMarker {
  return block.type === "scene";
}

export function isScriptBlock(block: EpisodeBlock): block is ScriptBlock {
  return block.type === "script";
}

/**
 * 리소스 매핑 유틸리티 함수들
 */

/**
 * 빈 MappedResources 객체 생성
 */
export function createEmptyMappedResources(): MappedResources {
  return {
    characterId: null,
    backgroundId: null,
    bgmId: null,
    effectId: null,
  };
}

/**
 * 특정 카테고리의 리소스 ID 설정 (단일 슬롯 규칙 강제)
 * 이미 같은 카테고리에 리소스가 있으면 교체(Replace)
 *
 * @param mappedResources - 기존 매핑된 리소스
 * @param category - 리소스 카테고리 ('character' | 'background' | 'bgm' | 'effect')
 * @param resourceId - 설정할 리소스 ID (null이면 제거)
 * @param aiMatchMetadata - AI 매칭 메타데이터 (선택적)
 */
export function setResourceId(
  mappedResources: MappedResources | undefined,
  category: "character" | "background" | "bgm" | "effect",
  resourceId: string | null,
  aiMatchMetadata?: MappedResources["aiMatchMetadata"]
): MappedResources {
  const current = mappedResources || createEmptyMappedResources();

  const key = `${category}Id` as keyof MappedResources;

  return {
    ...current,
    [key]: resourceId,
    // 리소스가 설정될 때만 AI 메타데이터 업데이트
    ...(resourceId !== null && aiMatchMetadata
      ? { aiMatchMetadata }
      : resourceId === null
      ? { aiMatchMetadata: undefined }
      : {}),
  };
}

/**
 * 특정 카테고리의 리소스 ID 제거
 *
 * @param mappedResources - 기존 매핑된 리소스
 * @param category - 리소스 카테고리
 */
export function removeResourceId(
  mappedResources: MappedResources | undefined,
  category: "character" | "background" | "bgm" | "effect"
): MappedResources {
  return setResourceId(mappedResources, category, null);
}

/**
 * 특정 카테고리의 리소스 ID 조회
 *
 * @param mappedResources - 매핑된 리소스
 * @param category - 리소스 카테고리
 * @returns 리소스 ID 또는 null
 */
export function getResourceId(
  mappedResources: MappedResources | undefined,
  category: "character" | "background" | "bgm" | "effect"
): string | null | undefined {
  if (!mappedResources) return undefined;
  const key = `${category}Id` as keyof MappedResources;
  return mappedResources[key] as string | null | undefined;
}

/**
 * 리소스가 하나라도 매핑되어 있는지 확인
 *
 * @param mappedResources - 매핑된 리소스
 * @returns 리소스가 하나라도 있으면 true
 */
export function hasAnyResource(
  mappedResources: MappedResources | undefined
): boolean {
  if (!mappedResources) return false;
  return (
    (mappedResources.characterId !== null &&
      mappedResources.characterId !== undefined &&
      mappedResources.characterId !== "") ||
    (mappedResources.backgroundId !== null &&
      mappedResources.backgroundId !== undefined &&
      mappedResources.backgroundId !== "") ||
    (mappedResources.bgmId !== null &&
      mappedResources.bgmId !== undefined &&
      mappedResources.bgmId !== "") ||
    (mappedResources.effectId !== null &&
      mappedResources.effectId !== undefined &&
      mappedResources.effectId !== "")
  );
}

/**
 * 모든 리소스 제거
 *
 * @param mappedResources - 매핑된 리소스
 */
export function clearAllResources(
  mappedResources: MappedResources | undefined
): MappedResources {
  return createEmptyMappedResources();
}

/**
 * Script Block Attributes 유틸리티 함수들
 */

/**
 * 빈 ScriptBlockAttributes 객체 생성
 */
export function createEmptyAttributes(): ScriptBlockAttributes {
  return {
    characterId: null,
    backgroundId: null,
    bgmId: null,
    effectId: null,
    emotion: null,
  };
}

/**
 * 블록 속성 업데이트 (카테고리별 단일 슬롯 규칙 강제)
 * 🔥 핵심 로직: 이미 값이 있는 Key에 새로운 ID가 들어오면 '교체(Replace)'
 *
 * @param blocks - 블록 배열
 * @param blockId - 업데이트할 블록 ID
 * @param attributeKey - 속성 키 ('characterId' | 'backgroundId' | 'bgmId' | 'effectId' | 'emotion')
 * @param attributeValue - 설정할 값 (string | null, null이면 제거)
 * @returns 업데이트된 블록 배열
 */
export function updateBlockAttribute(
  blocks: EpisodeBlock[],
  blockId: string,
  attributeKey: keyof ScriptBlockAttributes,
  attributeValue: string | null
): EpisodeBlock[] {
  return blocks.map((block) => {
    if (block.id !== blockId || block.type !== "script") {
      return block;
    }

    const scriptBlock = block as ScriptBlock;

    // attributes가 없으면 빈 객체 생성
    const currentAttributes = scriptBlock.attributes || createEmptyAttributes();

    // 🔥 교체 로직: 이미 값이 있어도 새로운 값으로 교체 (단일 슬롯 규칙)
    const updatedAttributes: ScriptBlockAttributes = {
      ...currentAttributes,
      [attributeKey]: attributeValue,
    };

    return {
      ...scriptBlock,
      attributes: updatedAttributes,
    } as ScriptBlock;
  });
}

/**
 * 블록 속성 조회
 *
 * @param block - Script Block
 * @param attributeKey - 속성 키
 * @returns 속성 값 또는 null/undefined
 */
export function getBlockAttribute(
  block: ScriptBlock,
  attributeKey: keyof ScriptBlockAttributes
): string | null | undefined {
  return block.attributes?.[attributeKey];
}

/**
 * 블록 속성 제거
 *
 * @param blocks - 블록 배열
 * @param blockId - 블록 ID
 * @param attributeKey - 제거할 속성 키
 * @returns 업데이트된 블록 배열
 */
export function removeBlockAttribute(
  blocks: EpisodeBlock[],
  blockId: string,
  attributeKey: keyof ScriptBlockAttributes
): EpisodeBlock[] {
  return updateBlockAttribute(blocks, blockId, attributeKey, null);
}

/**
 * 블록에 속성이 하나라도 있는지 확인
 *
 * @param block - Script Block
 * @returns 속성이 하나라도 있으면 true
 */
export function hasAnyAttribute(block: ScriptBlock): boolean {
  if (!block.attributes) return false;
  const attrs = block.attributes;
  return (
    (attrs.characterId !== null &&
      attrs.characterId !== undefined &&
      attrs.characterId !== "") ||
    (attrs.backgroundId !== null &&
      attrs.backgroundId !== undefined &&
      attrs.backgroundId !== "") ||
    (attrs.bgmId !== null &&
      attrs.bgmId !== undefined &&
      attrs.bgmId !== "") ||
    (attrs.effectId !== null &&
      attrs.effectId !== undefined &&
      attrs.effectId !== "") ||
    (attrs.emotion !== null &&
      attrs.emotion !== undefined &&
      attrs.emotion !== "")
  );
}

/**
 * 모든 블록 속성 제거
 *
 * @param blocks - 블록 배열
 * @param blockId - 블록 ID
 * @returns 업데이트된 블록 배열
 */
export function clearAllAttributes(
  blocks: EpisodeBlock[],
  blockId: string
): EpisodeBlock[] {
  return blocks.map((block) => {
    if (block.id !== blockId || block.type !== "script") {
      return block;
    }

    return {
      ...block,
      attributes: createEmptyAttributes(),
    } as ScriptBlock;
  });
}
