"use client";

import { useCallback, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { EpisodeData, ScriptBlock } from "../../lib/ink-editor/types";
import { createScriptBlock, updateBlock } from "../../lib/ink-editor/utils";
import ScriptBlockComponent from "./ScriptBlock";
import styles from "./EditorCanvas.module.css";

interface EditorCanvasProps {
  episodeData: EpisodeData;
  onDataChange: (data: EpisodeData) => void;
  selectedBlockId: string | null;
  onBlockSelect: (blockId: string) => void;
  onResourceChipClick: (blockId: string, category: "character" | "background" | "bgm" | "effect") => void;
}

export default function EditorCanvas({
  episodeData,
  onDataChange,
  selectedBlockId,
  onBlockSelect,
  onResourceChipClick,
}: EditorCanvasProps) {
  // Drag & Drop 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Drag 종료 핸들러
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) {
        return;
      }

      const oldIndex = episodeData.blocks.findIndex(
        (block) => block.id === active.id
      );
      const newIndex = episodeData.blocks.findIndex(
        (block) => block.id === over.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const newBlocks = arrayMove(episodeData.blocks, oldIndex, newIndex);
        onDataChange({
          ...episodeData,
          blocks: newBlocks,
        });
      }
    },
    [episodeData, onDataChange]
  );

  // 블록 추가 (Enter 키로 호출)
  const handleAddBlock = useCallback(
    (afterBlockId: string) => {
      const afterIndex = episodeData.blocks.findIndex(
        (block) => block.id === afterBlockId
      );

      if (afterIndex === -1) return;

      const newBlock = createScriptBlock("");
      const newBlocks = [...episodeData.blocks];
      newBlocks.splice(afterIndex + 1, 0, newBlock);

      onDataChange({
        ...episodeData,
        blocks: newBlocks,
      });

      // 새 블록에 포커스 (약간의 지연 후)
      setTimeout(() => {
        const newBlockElement = document.querySelector(
          `[data-block-id="${newBlock.id}"] textarea`
        ) as HTMLTextAreaElement;
        if (newBlockElement) {
          newBlockElement.focus();
        }
      }, 0);
    },
    [episodeData, onDataChange]
  );

  // 블록 삭제
  const handleDeleteBlock = useCallback(
    (blockId: string) => {
      if (episodeData.blocks.length <= 1) return; // 마지막 블록은 삭제 불가

      const blockIndex = episodeData.blocks.findIndex(
        (block) => block.id === blockId
      );
      if (blockIndex === -1) return;

      const newBlocks = episodeData.blocks.filter(
        (block) => block.id !== blockId
      );
      onDataChange({
        ...episodeData,
        blocks: newBlocks,
      });

      // 이전 블록에 포커스
      if (blockIndex > 0) {
        setTimeout(() => {
          const prevBlockElement = document.querySelector(
            `[data-block-id="${episodeData.blocks[blockIndex - 1].id}"] textarea`
          ) as HTMLTextAreaElement;
          if (prevBlockElement) {
            prevBlockElement.focus();
          }
        }, 0);
      }
    },
    [episodeData, onDataChange]
  );

  // 블록 복제
  const handleDuplicateBlock = useCallback(
    (blockId: string) => {
      const blockIndex = episodeData.blocks.findIndex(
        (block) => block.id === blockId
      );
      if (blockIndex === -1) return;

      const block = episodeData.blocks[blockIndex];
      if (block.type !== "script") return;

      // 블록 복제 (새 ID 생성)
      const duplicatedBlock: ScriptBlock = {
        ...block,
        id: `script_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      const newBlocks = [...episodeData.blocks];
      newBlocks.splice(blockIndex + 1, 0, duplicatedBlock);

      onDataChange({
        ...episodeData,
        blocks: newBlocks,
      });

      // 복제된 블록에 포커스
      setTimeout(() => {
        const duplicatedBlockElement = document.querySelector(
          `[data-block-id="${duplicatedBlock.id}"] textarea`
        ) as HTMLTextAreaElement;
        if (duplicatedBlockElement) {
          duplicatedBlockElement.focus();
          duplicatedBlockElement.setSelectionRange(
            duplicatedBlockElement.value.length,
            duplicatedBlockElement.value.length
          );
        }
      }, 0);
    },
    [episodeData, onDataChange]
  );

  // 블록 업데이트
  const handleUpdateBlock = useCallback(
    (blockId: string, updates: Partial<ScriptBlock>) => {
      const newBlocks = updateBlock(episodeData.blocks, blockId, updates);
      onDataChange({
        ...episodeData,
        blocks: newBlocks,
      });
    },
    [episodeData, onDataChange]
  );

  // Script Block만 필터링 (Scene Marker는 제외)
  const scriptBlocks = episodeData.blocks.filter(
    (block) => block.type === "script"
  ) as ScriptBlock[];

  return (
    <div className={styles.editorCanvas}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={scriptBlocks.map((block) => block.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className={styles.blocksList}>
            {scriptBlocks.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyBlock}>
                  <textarea
                    className={styles.emptyTextarea}
                    placeholder="대사를 입력하세요... (Enter로 새 블록 추가)"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        const newBlock = createScriptBlock("");
                        onDataChange({
                          ...episodeData,
                          blocks: [newBlock],
                        });
                        setTimeout(() => {
                          const textarea = document.querySelector(
                            `[data-block-id="${newBlock.id}"] textarea`
                          ) as HTMLTextAreaElement;
                          if (textarea) textarea.focus();
                        }, 0);
                      }
                    }}
                    autoFocus
                  />
                </div>
              </div>
            ) : (
              scriptBlocks.map((block) => (
                <ScriptBlockComponent
                  key={block.id}
                  block={block}
                  isSelected={selectedBlockId === block.id}
                  onUpdate={(updates) => handleUpdateBlock(block.id, updates)}
                  onAddAfter={() => handleAddBlock(block.id)}
                  onDelete={() => handleDeleteBlock(block.id)}
                  onDuplicate={() => handleDuplicateBlock(block.id)}
                  onSelect={() => onBlockSelect(block.id)}
                  onResourceChipClick={onResourceChipClick}
                />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
