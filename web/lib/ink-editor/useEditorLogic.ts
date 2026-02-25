/**
 * Ink Editor Logic Hook
 * 리소스 매핑 및 상태 관리 로직
 */

import { useCallback } from "react";
import type {
  EpisodeData,
  ScriptBlock,
  MappedResources,
} from "./types";
import {
  setResourceId,
  getResourceId,
  createEmptyMappedResources,
} from "./utils";

/**
 * 리소스 카테고리 타입
 */
export type ResourceCategory = "character" | "background" | "bgm" | "effect";

/**
 * 리소스 풀의 리소스 정보
 */
export interface Resource {
  id: string;
  name: string;
  category: ResourceCategory;
  avatarUrl?: string; // 이미지 URL (캐릭터, 배경 등)
  thumbnailUrl?: string; // 썸네일 URL
}

/**
 * Mock 리소스 데이터 (전역 리소스 풀)
 * 실제로는 별도 화면에서 관리되는 리소스 풀에서 가져옴
 */
export const MOCK_RESOURCES: Resource[] = [
  // 캐릭터 리소스
  {
    id: "char_001",
    name: "덕훈",
    category: "character",
    avatarUrl: "/avatars/deokhun.png",
  },
  {
    id: "char_002",
    name: "유나",
    category: "character",
    avatarUrl: "/avatars/yuna.png",
  },
  {
    id: "char_003",
    name: "고현우",
    category: "character",
    avatarUrl: "/avatars/hyunwoo.png",
  },
  {
    id: "char_004",
    name: "미나",
    category: "character",
    avatarUrl: "/avatars/mina.png",
  },
  {
    id: "char_005",
    name: "설인화",
    category: "character",
    avatarUrl: "/avatars/seolinhwa.png",
  },
  // 배경 리소스
  {
    id: "bg_001",
    name: "나메크 성",
    category: "background",
    thumbnailUrl: "/backgrounds/namek_castle.png",
  },
  {
    id: "bg_002",
    name: "서천",
    category: "background",
    thumbnailUrl: "/backgrounds/west_sky.png",
  },
  {
    id: "bg_003",
    name: "나메크 성 폭포절벽",
    category: "background",
    thumbnailUrl: "/backgrounds/namek_waterfall.png",
  },
  {
    id: "bg_004",
    name: "용궁",
    category: "background",
    thumbnailUrl: "/backgrounds/dragon_palace.png",
  },
  // BGM 리소스
  {
    id: "bgm_001",
    name: "전투 테마",
    category: "bgm",
    thumbnailUrl: "/bgm/battle_theme.png",
  },
  {
    id: "bgm_002",
    name: "Last Christmas",
    category: "bgm",
    thumbnailUrl: "/bgm/last_christmas.png",
  },
  {
    id: "bgm_003",
    name: "비장한 순간",
    category: "bgm",
    thumbnailUrl: "/bgm/epic_moment.png",
  },
  {
    id: "bgm_004",
    name: "로맨틱",
    category: "bgm",
    thumbnailUrl: "/bgm/romantic.png",
  },
  // 이펙트 리소스
  {
    id: "effect_001",
    name: "번개",
    category: "effect",
    thumbnailUrl: "/effects/lightning.png",
  },
  {
    id: "effect_002",
    name: "불꽃",
    category: "effect",
    thumbnailUrl: "/effects/fire.png",
  },
  {
    id: "effect_003",
    name: "물보라",
    category: "effect",
    thumbnailUrl: "/effects/splash.png",
  },
  {
    id: "effect_004",
    name: "안개",
    category: "effect",
    thumbnailUrl: "/effects/fog.png",
  },
];

/**
 * 카테고리별 리소스 조회
 */
export function getResourcesByCategory(
  category: ResourceCategory
): Resource[] {
  return MOCK_RESOURCES.filter((resource) => resource.category === category);
}

/**
 * ID로 리소스 조회
 */
export function getResourceById(id: string): Resource | undefined {
  return MOCK_RESOURCES.find((resource) => resource.id === id);
}

/**
 * useEditorLogic Hook
 * 리소스 토글 및 상태 관리 로직
 */
export function useEditorLogic(
  episodeData: EpisodeData,
  onDataChange: (data: EpisodeData) => void
) {
  /**
   * 리소스 토글 핸들러
   * 사이드바에서 리소스를 클릭했을 때 호출
   *
   * @param blockId - 리소스를 적용할 Script Block ID
   * @param resourceId - 토글할 리소스 ID
   * @param category - 리소스 카테고리
   */
  const handleResourceToggle = useCallback(
    (
      blockId: string,
      resourceId: string,
      category: ResourceCategory
    ): void => {
      // 1. 해당 블록 찾기
      const blockIndex = episodeData.blocks.findIndex(
        (block) => block.id === blockId
      );

      if (blockIndex === -1) {
        console.warn(`Block not found: ${blockId}`);
        return;
      }

      const block = episodeData.blocks[blockIndex];

      // 2. Script Block인지 확인
      if (block.type !== "script") {
        console.warn(`Block is not a script block: ${blockId}`);
        return;
      }

      const scriptBlock = block as ScriptBlock;
      const currentMappedResources = scriptBlock.mappedResources;

      // 3. 현재 카테고리의 리소스 ID 조회
      const currentResourceId = getResourceId(currentMappedResources, category);

      // 4. 로직 분기
      let newMappedResources: MappedResources;

      if (currentResourceId === resourceId) {
        // Case A: 같은 리소스 -> 삭제 (null로 설정)
        newMappedResources = setResourceId(
          currentMappedResources,
          category,
          null
        );
      } else if (currentResourceId !== null && currentResourceId !== undefined) {
        // Case B: 같은 카테고리에 다른 리소스가 있음 -> 교체 (Overwrite)
        newMappedResources = setResourceId(
          currentMappedResources,
          category,
          resourceId
        );
      } else {
        // Case C: 카테고리가 비어있음 -> 추가 (Set)
        newMappedResources = setResourceId(
          currentMappedResources || createEmptyMappedResources(),
          category,
          resourceId
        );
      }

      // 5. 불변성을 지키며 상태 업데이트
      const updatedBlocks = episodeData.blocks.map((b, index) => {
        if (index === blockIndex && b.type === "script") {
          return {
            ...b,
            mappedResources: newMappedResources,
          } as ScriptBlock;
        }
        return b;
      });

      // 6. 새로운 EpisodeData 생성 및 업데이트
      const newEpisodeData: EpisodeData = {
        ...episodeData,
        blocks: updatedBlocks,
      };

      onDataChange(newEpisodeData);
    },
    [episodeData, onDataChange]
  );

  /**
   * 특정 블록의 리소스 제거
   *
   * @param blockId - 리소스를 제거할 Script Block ID
   * @param category - 제거할 리소스 카테고리
   */
  const handleResourceRemove = useCallback(
    (blockId: string, category: ResourceCategory): void => {
      const blockIndex = episodeData.blocks.findIndex(
        (block) => block.id === blockId
      );

      if (blockIndex === -1) {
        console.warn(`Block not found: ${blockId}`);
        return;
      }

      const block = episodeData.blocks[blockIndex];

      if (block.type !== "script") {
        console.warn(`Block is not a script block: ${blockId}`);
        return;
      }

      const scriptBlock = block as ScriptBlock;
      const currentMappedResources = scriptBlock.mappedResources;

      // 리소스 제거 (null로 설정)
      const newMappedResources = setResourceId(
        currentMappedResources,
        category,
        null
      );

      // 불변성을 지키며 상태 업데이트
      const updatedBlocks = episodeData.blocks.map((b, index) => {
        if (index === blockIndex && b.type === "script") {
          return {
            ...b,
            mappedResources: newMappedResources,
          } as ScriptBlock;
        }
        return b;
      });

      const newEpisodeData: EpisodeData = {
        ...episodeData,
        blocks: updatedBlocks,
      };

      onDataChange(newEpisodeData);
    },
    [episodeData, onDataChange]
  );

  /**
   * 특정 블록의 모든 리소스 제거
   *
   * @param blockId - 리소스를 제거할 Script Block ID
   */
  const handleClearAllResources = useCallback(
    (blockId: string): void => {
      const blockIndex = episodeData.blocks.findIndex(
        (block) => block.id === blockId
      );

      if (blockIndex === -1) {
        console.warn(`Block not found: ${blockId}`);
        return;
      }

      const block = episodeData.blocks[blockIndex];

      if (block.type !== "script") {
        console.warn(`Block is not a script block: ${blockId}`);
        return;
      }

      const updatedBlocks = episodeData.blocks.map((b, index) => {
        if (index === blockIndex && b.type === "script") {
          return {
            ...b,
            mappedResources: createEmptyMappedResources(),
          } as ScriptBlock;
        }
        return b;
      });

      const newEpisodeData: EpisodeData = {
        ...episodeData,
        blocks: updatedBlocks,
      };

      onDataChange(newEpisodeData);
    },
    [episodeData, onDataChange]
  );

  return {
    handleResourceToggle,
    handleResourceRemove,
    handleClearAllResources,
    resources: MOCK_RESOURCES,
    getResourcesByCategory,
    getResourceById,
  };
}
