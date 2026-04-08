"use client";

import { useState, useCallback } from "react";
import type { ScriptBlock, EpisodeBlock, SceneMarker } from "../../lib/ink-editor/types";
import { INITIAL_BLOCKS } from "../../lib/ink-editor/mockData";
import { updateBlock, createScriptBlock, createSceneMarker } from "../../lib/ink-editor/utils";
import EditorLayout from "./EditorLayout";
import SceneMarkerBlock from "./SceneMarkerBlock";
import ScriptBlockCard from "./ScriptBlockCard";
import ResourcePanel from "./ResourcePanel";
import styles from "./EditorPage.module.css";

export default function EditorPage() {
  const [blocks, setBlocks] = useState<EpisodeBlock[]>(INITIAL_BLOCKS);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // 선택된 블록 찾기
  const activeBlock = blocks.find(
    (b) => b.id === selectedBlockId && b.type === "script"
  ) as ScriptBlock | undefined;

  // 블록 업데이트
  const handleUpdateBlock = useCallback(
    (blockId: string, updates: Partial<EpisodeBlock>) => {
      const newBlocks = updateBlock(blocks, blockId, updates);
      setBlocks(newBlocks);
    },
    [blocks]
  );

  // 블록 추가 (Enter 키로 호출)
  const handleAddBlock = useCallback(
    (afterBlockId: string) => {
      const afterIndex = blocks.findIndex((block) => block.id === afterBlockId);
      if (afterIndex === -1) return;

      const newBlock = createScriptBlock("");
      const newBlocks = [...blocks];
      newBlocks.splice(afterIndex + 1, 0, newBlock);
      setBlocks(newBlocks);

      // 새 블록에 포커스
      setTimeout(() => {
        const newBlockElement = document.querySelector(
          `[data-block-id="${newBlock.id}"] textarea`
        ) as HTMLTextAreaElement;
        if (newBlockElement) {
          newBlockElement.focus();
        }
      }, 0);
    },
    [blocks]
  );

  // 장면 추가 (ScriptBlockCard에서 호출)
  const handleAddSceneAfter = useCallback(
    (afterBlockId: string) => {
      const afterIndex = blocks.findIndex((block) => block.id === afterBlockId);
      if (afterIndex === -1) return;

      // 다음 장면 번호 계산
      const sceneCount = blocks.filter((b) => b.type === "scene").length;
      const newScene = createSceneMarker(sceneCount + 1, "");
      const newBlocks = [...blocks];
      newBlocks.splice(afterIndex + 1, 0, newScene);
      setBlocks(newBlocks);

      // 새 장면에 포커스
      setTimeout(() => {
        const newSceneElement = document.querySelector(
          `[data-block-id="${newScene.id}"] input`
        ) as HTMLInputElement;
        if (newSceneElement) {
          newSceneElement.focus();
        }
      }, 0);
    },
    [blocks]
  );

  // 블록 삭제 (Scene과 Script 모두 처리)
  const handleDeleteBlock = useCallback(
    (blockId: string) => {
      if (blocks.length <= 1) return; // 마지막 블록은 삭제 불가

      const blockIndex = blocks.findIndex((block) => block.id === blockId);
      if (blockIndex === -1) return;

      const newBlocks = blocks.filter((block) => block.id !== blockId);
      setBlocks(newBlocks);

      // 선택된 블록이 삭제되면 사이드바 닫기
      if (selectedBlockId === blockId) {
        setSelectedBlockId(null);
      }

      // 이전 블록에 포커스 (Script Block인 경우)
      if (blockIndex > 0) {
        const prevBlock = blocks[blockIndex - 1];
        if (prevBlock.type === "script") {
          setTimeout(() => {
            const prevBlockElement = document.querySelector(
              `[data-block-id="${prevBlock.id}"] textarea`
            ) as HTMLTextAreaElement;
            if (prevBlockElement) {
              prevBlockElement.focus();
            }
          }, 0);
        }
      }
    },
    [blocks, selectedBlockId]
  );

  // 블록 복제
  const handleDuplicateBlock = useCallback(
    (blockId: string) => {
      const blockIndex = blocks.findIndex((block) => block.id === blockId);
      if (blockIndex === -1) return;

      const block = blocks[blockIndex];
      if (block.type !== "script") return;

      const duplicatedBlock: ScriptBlock = {
        ...block,
        id: `script_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        // choices도 복제 (새 ID 부여)
        choices: block.choices?.map((choice) => ({
          ...choice,
          id: `choice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        })),
      };

      const newBlocks = [...blocks];
      newBlocks.splice(blockIndex + 1, 0, duplicatedBlock);
      setBlocks(newBlocks);

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
    [blocks]
  );

  // 리소스 칩 클릭 핸들러
  const handleResourceChipClick = useCallback(
    (blockId: string, category: "character" | "background" | "bgm" | "effect") => {
      setSelectedBlockId(blockId);
      // TODO: 리소스 사이드바 열기 로직 추가
    },
    []
  );

  // 배경 클릭 핸들러 (사이드바 닫기)
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // 클릭한 요소가 블록이나 블록 내부 요소가 아니면 사이드바 닫기
      const target = e.target as HTMLElement;
      if (
        !target.closest("[data-block-id]") &&
        !target.closest(".slashMenu") &&
        !target.closest(".resourcePanel")
      ) {
        setSelectedBlockId(null);
      }
    },
    []
  );

  return (
    <EditorLayout
      isSidebarOpen={!!selectedBlockId}
      sidebarContent={
        activeBlock ? <ResourcePanel block={activeBlock} /> : null
      }
    >
      <div className={styles.editorContent} onClick={handleCanvasClick}>
        <div className={styles.blocksContainer}>
          {blocks.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyMessage}>
                대사를 입력하세요... (Enter로 새 블록 추가)
              </p>
            </div>
          ) : (
            blocks.map((block, index) => {
              if (block.type === "scene") {
                return (
                  <SceneMarkerBlock
                    key={block.id}
                    block={block}
                    onUpdate={(updates) => handleUpdateBlock(block.id, updates)}
                    onRemove={() => handleDeleteBlock(block.id)}
                    onAddAfter={(type) => {
                      if (type === "script") {
                        const newBlock = createScriptBlock("");
                        const newBlocks = [...blocks];
                        newBlocks.splice(index + 1, 0, newBlock);
                        setBlocks(newBlocks);
                      } else {
                        const newBlock = createSceneMarker(
                          (block as SceneMarker).sceneNumber + 1
                        );
                        const newBlocks = [...blocks];
                        newBlocks.splice(index + 1, 0, newBlock);
                        setBlocks(newBlocks);
                      }
                    }}
                  />
                );
              } else {
                return (
                  <ScriptBlockCard
                    key={block.id}
                    block={block}
                    isSelected={selectedBlockId === block.id}
                    onUpdate={(updates) => handleUpdateBlock(block.id, updates)}
                    onAddAfter={() => handleAddBlock(block.id)}
                    onAddAfterScene={() => handleAddSceneAfter(block.id)}
                    onDelete={() => handleDeleteBlock(block.id)}
                    onDuplicate={() => handleDuplicateBlock(block.id)}
                    onSelect={() => setSelectedBlockId(block.id)}
                    onResourceChipClick={handleResourceChipClick}
                  />
                );
              }
            })
          )}
        </div>
      </div>
    </EditorLayout>
  );
}
