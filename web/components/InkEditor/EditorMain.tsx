"use client";

import { useCallback } from "react";
import type { EpisodeBlock, EpisodeData, ScriptBlock as ScriptBlockType } from "../../lib/ink-editor/types";
import {
  createSceneMarker,
  createScriptBlock,
  insertBlock,
  removeBlock,
  updateBlock,
  getNextSceneNumber,
  getResourceId,
} from "../../lib/ink-editor/utils";
import { getResourceById } from "../../lib/ink-editor/useEditorLogic";
import SceneMarkerBlock from "./SceneMarkerBlock";
import ScriptBlock from "./ScriptBlock";
import { Badge } from "../ui/index";
import Icon from "../Icon";
import styles from "./EditorMain.module.css";

interface EditorMainProps {
  episodeData: EpisodeData;
  onDataChange: (data: EpisodeData) => void;
  selectedBlockId: string | null;
  onBlockSelect: (blockId: string, blockType: "scene" | "script") => void;
  onEmptyAreaClick: () => void;
}

export default function EditorMain({
  episodeData,
  onDataChange,
  selectedBlockId,
  onBlockSelect,
  onEmptyAreaClick,
}: EditorMainProps) {
  // 블록 추가 (특정 인덱스 뒤에)
  const handleAddBlock = useCallback(
    (index: number, type: "scene" | "script") => {
      const newBlock =
        type === "scene"
          ? createSceneMarker(getNextSceneNumber(episodeData.blocks))
          : createScriptBlock();

      const newBlocks = insertBlock(episodeData.blocks, index + 1, newBlock);
      onDataChange({ ...episodeData, blocks: newBlocks });
    },
    [episodeData, onDataChange]
  );

  // 블록 삭제
  const handleRemoveBlock = useCallback(
    (blockId: string) => {
      const newBlocks = removeBlock(episodeData.blocks, blockId);
      onDataChange({ ...episodeData, blocks: newBlocks });
      // 선택된 블록이 삭제되면 사이드바도 닫기
      if (selectedBlockId === blockId) {
        onEmptyAreaClick();
      }
    },
    [episodeData, onDataChange, selectedBlockId, onEmptyAreaClick]
  );

  // 블록 업데이트
  const handleUpdateBlock = useCallback(
    (blockId: string, updates: Partial<EpisodeBlock>) => {
      const newBlocks = updateBlock(episodeData.blocks, blockId, updates);
      onDataChange({ ...episodeData, blocks: newBlocks });
    },
    [episodeData, onDataChange]
  );

  // 블록 클릭 핸들러
  const handleBlockClick = useCallback(
    (e: React.MouseEvent, block: EpisodeBlock) => {
      e.stopPropagation();
      onBlockSelect(block.id, block.type);
    },
    [onBlockSelect]
  );

  // 빈 공간 클릭 핸들러
  const handleBodyClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // 블록이나 블록 내부 요소를 클릭한 경우가 아니면
      if (e.target === e.currentTarget) {
        onEmptyAreaClick();
      }
    },
    [onEmptyAreaClick]
  );

  // 리소스 칩 렌더링
  const renderResourceChips = (block: ScriptBlockType) => {
    const { mappedResources } = block;
    if (!mappedResources) return null;

    const chips = [];

    // 캐릭터 리소스
    const characterId = getResourceId(mappedResources, "character");
    if (characterId) {
      const resource = getResourceById(characterId);
      if (resource) {
        chips.push(
          <Badge key="character" variant="secondary" className={styles.resourceChip}>
            {resource.avatarUrl ? (
              <img
                src={resource.avatarUrl}
                alt={resource.name}
                className={styles.resourceAvatar}
              />
            ) : (
              <Icon name="profile_circle" size={14} />
            )}
            <span>{resource.name}</span>
          </Badge>
        );
      }
    }

    // 배경 리소스
    const backgroundId = getResourceId(mappedResources, "background");
    if (backgroundId) {
      const resource = getResourceById(backgroundId);
      if (resource) {
        chips.push(
          <Badge key="background" variant="secondary" className={styles.resourceChip}>
            <Icon name="photo" size={14} />
            <span>{resource.name}</span>
          </Badge>
        );
      }
    }

    // BGM 리소스
    const bgmId = getResourceId(mappedResources, "bgm");
    if (bgmId) {
      const resource = getResourceById(bgmId);
      if (resource) {
        chips.push(
          <Badge key="bgm" variant="secondary" className={styles.resourceChip}>
            <Icon name="album" size={14} />
            <span>{resource.name}</span>
          </Badge>
        );
      }
    }

    // 이펙트 리소스
    const effectId = getResourceId(mappedResources, "effect");
    if (effectId) {
      const resource = getResourceById(effectId);
      if (resource) {
        chips.push(
          <Badge key="effect" variant="secondary" className={styles.resourceChip}>
            <Icon name="star" size={14} />
            <span>{resource.name}</span>
          </Badge>
        );
      }
    }

    return chips.length > 0 ? (
      <div className={styles.resourceChips}>{chips}</div>
    ) : null;
  };

  return (
    <div className={styles.editorMain} onClick={handleBodyClick}>
      <div className={styles.blocksContainer}>
        {episodeData.blocks.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyMessage}>
              에피소드를 시작하려면 첫 번째 블록을 추가하세요
            </p>
            <button
              className={styles.addFirstBlockButton}
              onClick={() => handleAddBlock(-1, "scene")}
            >
              Scene 추가
            </button>
            <button
              className={styles.addFirstBlockButton}
              onClick={() => handleAddBlock(-1, "script")}
            >
              Script 추가
            </button>
          </div>
        ) : (
          episodeData.blocks.map((block, index) => (
            <div
              key={block.id}
              className={`${styles.blockWrapper} ${
                selectedBlockId === block.id ? styles.blockActive : ""
              }`}
              onClick={(e) => handleBlockClick(e, block)}
            >
              {block.type === "scene" ? (
                <SceneMarkerBlock
                  block={block}
                  onUpdate={(updates) =>
                    handleUpdateBlock(block.id, updates)
                  }
                  onRemove={() => handleRemoveBlock(block.id)}
                  onAddAfter={(type) => handleAddBlock(index, type)}
                />
              ) : (
                <div className={styles.scriptBlockWrapper}>
                  <ScriptBlock
                    block={block}
                    isSelected={selectedBlockId === block.id}
                    onUpdate={(updates) =>
                      handleUpdateBlock(block.id, updates)
                    }
                    onAddAfter={() => handleAddBlock(index, "script")}
                    onDelete={() => handleRemoveBlock(block.id)}
                    onDuplicate={() => {
                      const dup = createScriptBlock(block.content ?? "", block.blockType ?? "dialogue");
                      const withAttrs = { ...dup, attributes: { ...dup.attributes, ...block.attributes } };
                      const newBlocks = insertBlock(episodeData.blocks, index + 1, withAttrs);
                      onDataChange({ ...episodeData, blocks: newBlocks });
                    }}
                    onSelect={() => onBlockSelect(block.id, "script")}
                    onResourceChipClick={() => {}}
                  />
                  {/* 리소스 칩 표시 */}
                  {renderResourceChips(block)}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
