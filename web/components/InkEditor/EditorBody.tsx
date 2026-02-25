"use client";

import { useCallback } from "react";
import type { EpisodeBlock, EpisodeData } from "../../lib/ink-editor/types";
import {
  createSceneMarker,
  createScriptBlock,
  insertBlock,
  removeBlock,
  updateBlock,
  getNextSceneNumber,
} from "../../lib/ink-editor/utils";
import SceneMarkerBlock from "./SceneMarkerBlock";
import ScriptBlock from "./ScriptBlock";
import styles from "./EditorBody.module.css";

interface EditorBodyProps {
  episodeData: EpisodeData;
  onDataChange: (data: EpisodeData) => void;
  selectedBlockId: string | null;
  onBlockSelect: (blockId: string, blockType: "scene" | "script") => void;
  onEmptyAreaClick: () => void;
}

export default function EditorBody({
  episodeData,
  onDataChange,
  selectedBlockId,
  onBlockSelect,
  onEmptyAreaClick,
}: EditorBodyProps) {
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

  return (
    <div className={styles.editorBody} onClick={handleBodyClick}>
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
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
