"use client";

import { useState, useCallback } from "react";
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
import styles from "./InkEditor.module.css";

interface InkEditorProps {
  initialData?: EpisodeData;
  onDataChange?: (data: EpisodeData) => void;
}

export default function InkEditor({
  initialData,
  onDataChange,
}: InkEditorProps) {
  const [episodeData, setEpisodeData] = useState<EpisodeData>(
    initialData || {
      id: `episode_${Date.now()}`,
      title: "",
      blocks: [],
    }
  );

  // 데이터 변경 핸들러
  const handleDataChange = useCallback(
    (newData: EpisodeData) => {
      setEpisodeData(newData);
      onDataChange?.(newData);
    },
    [onDataChange]
  );

  // 블록 추가 (특정 인덱스 뒤에)
  const handleAddBlock = useCallback(
    (index: number, type: "scene" | "script") => {
      const newBlock =
        type === "scene"
          ? createSceneMarker(getNextSceneNumber(episodeData.blocks))
          : createScriptBlock();

      const newBlocks = insertBlock(episodeData.blocks, index + 1, newBlock);
      handleDataChange({ ...episodeData, blocks: newBlocks });
    },
    [episodeData, handleDataChange]
  );

  // 블록 삭제
  const handleRemoveBlock = useCallback(
    (blockId: string) => {
      const newBlocks = removeBlock(episodeData.blocks, blockId);
      handleDataChange({ ...episodeData, blocks: newBlocks });
    },
    [episodeData, handleDataChange]
  );

  // 블록 업데이트
  const handleUpdateBlock = useCallback(
    (blockId: string, updates: Partial<EpisodeBlock>) => {
      const newBlocks = updateBlock(episodeData.blocks, blockId, updates);
      handleDataChange({ ...episodeData, blocks: newBlocks });
    },
    [episodeData, handleDataChange]
  );

  return (
    <div className={styles.editor}>
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
            <div key={block.id} className={styles.blockWrapper}>
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
                  isSelected={false}
                  onUpdate={(updates) =>
                    handleUpdateBlock(block.id, updates)
                  }
                  onAddAfter={() => handleAddBlock(index, "script")}
                  onDelete={() => handleRemoveBlock(block.id)}
                  onDuplicate={() => {
                    const dup = createScriptBlock(block.content ?? "", block.blockType ?? "dialogue");
                    const withAttrs = { ...dup, attributes: { ...dup.attributes, ...block.attributes } };
                    const newBlocks = insertBlock(episodeData.blocks, index + 1, withAttrs);
                    handleDataChange({ ...episodeData, blocks: newBlocks });
                  }}
                  onSelect={() => {}}
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
