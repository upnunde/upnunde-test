"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { ScriptBlock, ChoiceBlock } from "../../lib/ink-editor/types";
import { getBlockAttribute } from "../../lib/ink-editor/utils";
import { getResourceById } from "../../lib/ink-editor/useEditorLogic";
import type { SlashCommandAction } from "./SlashMenu";
import type { CategoryKey } from "./CategoryMenu";
import { Badge } from "../ui/index";
import Icon from "../Icon";
import SlashMenu from "./SlashMenu";
import CategoryMenu from "./CategoryMenu";
import ChoiceTable from "./ChoiceTable";
import styles from "./ScriptBlockCard.module.css";

interface ScriptBlockCardProps {
  block: ScriptBlock;
  isSelected: boolean;
  onUpdate: (updates: Partial<ScriptBlock>) => void;
  onAddAfter: () => void;
  onAddAfterScene?: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onSelect: () => void;
  onResourceChipClick: (blockId: string, category: "character" | "background" | "bgm" | "effect") => void;
}

export default function ScriptBlockCard({
  block,
  isSelected,
  onUpdate,
  onAddAfter,
  onAddAfterScene,
  onDelete,
  onDuplicate,
  onSelect,
  onResourceChipClick,
}: ScriptBlockCardProps) {
  const [text, setText] = useState(block.content || "");
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [categoryMenuPosition, setCategoryMenuPosition] = useState({ top: 0, left: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  // 텍스트 변경 시 자동 저장
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const currentContent = block.content || "";
      if (text !== currentContent) {
        onUpdate({ content: text });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [text, block.content, onUpdate]);

  // Slash Command 감지
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setText(value);

      // Slash Command 감지
      const cursorPosition = e.target.selectionStart;
      const textBeforeCursor = value.substring(0, cursorPosition);
      const lastSlashIndex = textBeforeCursor.lastIndexOf("/");

      if (
        lastSlashIndex !== -1 &&
        (lastSlashIndex === 0 ||
          textBeforeCursor[lastSlashIndex - 1] === " " ||
          textBeforeCursor[lastSlashIndex - 1] === "\n")
      ) {
        // Slash 메뉴 표시
        const rect = e.target.getBoundingClientRect();
        const lineHeight = 24; // line-height
        const lines = textBeforeCursor.split("\n").length;
        setSlashMenuPosition({
          top: rect.top + lines * lineHeight + 8,
          left: rect.left + 20,
        });
        setShowSlashMenu(true);
      } else {
        setShowSlashMenu(false);
      }
    },
    []
  );

  // Enter 키 처리
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Enter: 새 블록 추가
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onAddAfter();
      }

      // Escape: Slash 메뉴 닫기
      if (e.key === "Escape") {
        setShowSlashMenu(false);
      }
    },
    [onAddAfter]
  );

  // Slash 메뉴 항목 선택
  const handleSlashMenuSelect = useCallback(
    (action: SlashCommandAction) => {
      // Slash 제거
      const newText = text.replace(/\/[^\s]*$/, "");
      setText(newText);
      setShowSlashMenu(false);

      // 액션 처리
      if (action.type === "resource") {
        onResourceChipClick(block.id, action.category);
      } else if (action.type === "blockType") {
        onUpdate({ blockType: action.blockType });
      } else if (action.type === "edit") {
        if (action.action === "delete") {
          onDelete();
        } else if (action.action === "duplicate") {
          onDuplicate();
        }
      }

      // 포커스 유지
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 0);
    },
    [text, block.id, onResourceChipClick, onUpdate, onDelete, onDuplicate]
  );

  // 리소스 정보
  const characterId = getBlockAttribute(block, "characterId");
  const backgroundId = getBlockAttribute(block, "backgroundId");
  const bgmId = getBlockAttribute(block, "bgmId");
  const effectId = getBlockAttribute(block, "effectId");
  const emotion = getBlockAttribute(block, "emotion");

  const character = characterId ? getResourceById(characterId) : null;
  const background = backgroundId ? getResourceById(backgroundId) : null;
  const bgm = bgmId ? getResourceById(bgmId) : null;
  const effect = effectId ? getResourceById(effectId) : null;

  // 리소스가 하나라도 있는지 확인
  const hasAnyResource = !!(
    character ||
    background ||
    bgm ||
    effect ||
    emotion ||
    (block.choices && block.choices.length > 0)
  );

  // Category Menu 토글
  const handleAddButtonClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (addButtonRef.current) {
        const rect = addButtonRef.current.getBoundingClientRect();
        setCategoryMenuPosition({
          top: rect.bottom + 4,
          left: rect.left,
        });
        setShowCategoryMenu(true);
      }
    },
    []
  );

  // Category 선택 핸들러
  const handleCategorySelect = useCallback(
    (category: CategoryKey) => {
      if (category === "scene") {
        // 씬 추가
        if (onAddAfterScene) {
          onAddAfterScene();
        }
      } else if (category === "choice") {
        // 선택지 추가
        const newChoice: ChoiceBlock = {
          id: `choice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          content: "",
          isPaid: false,
          isAI: false,
        };
        onUpdate({
          choices: [...(block.choices || []), newChoice],
        });
      } else if (category === "character" || category === "background" || category === "bgm") {
        // 리소스 사이드바 열기
        onResourceChipClick(block.id, category);
      } else if (category === "direction") {
        // 연출은 effect로 처리
        onResourceChipClick(block.id, "effect");
      } else if (category === "gallery") {
        // 갤러리는 추후 구현
        console.log("갤러리 기능은 추후 구현 예정");
      }
    },
    [block.id, block.choices, onUpdate, onResourceChipClick, onAddAfterScene]
  );

  return (
    <div
      className={`${styles.scriptBlockCard} ${styles.group} ${isSelected ? styles.selected : ""}`}
      data-block-id={block.id}
      onClick={onSelect}
    >
      {/* 좌측 Add Button (Hover 시 표시) */}
      <button
        ref={addButtonRef}
        className={styles.addButton}
        onClick={handleAddButtonClick}
        title="리소스 추가"
      >
        <Icon name="plus" size={16} />
      </button>

      {/* Category Menu */}
      {showCategoryMenu && (
        <CategoryMenu
          block={block}
          position={categoryMenuPosition}
          onSelect={handleCategorySelect}
          onClose={() => setShowCategoryMenu(false)}
        />
      )}

      {/* 메인 콘텐츠 영역 */}
      <div className={styles.contentArea}>
        <div className={styles.textAreaWrapper}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="대사를 입력하세요... (Enter로 새 블록 추가, /로 명령어)"
            rows={1}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Slash Menu */}
          {showSlashMenu && (
            <SlashMenu
              position={slashMenuPosition}
              onSelect={handleSlashMenuSelect}
              onClose={() => setShowSlashMenu(false)}
            />
          )}
        </div>

        {/* 삭제 버튼 (호버 시 표시) */}
        <button
          className={styles.deleteButton}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="블록 삭제"
        >
          <Icon name="close" size={20} />
        </button>
      </div>

      {/* 리소스 메타데이터 행 */}
      {hasAnyResource && (
        <>
          {/* 구분선 */}
          <div className={styles.divider} />

          <div className={styles.metadataRow}>
            {/* 캐릭터 */}
            {character && (
              <div className={styles.resourceGroup}>
                <span className={styles.resourceLabel}>캐릭터</span>
                <Badge
                  variant="secondary"
                  className={styles.resourceChip}
                  onClick={(e) => {
                    e.stopPropagation();
                    onResourceChipClick(block.id, "character");
                  }}
                >
                  {character.avatarUrl ? (
                    <img
                      src={character.avatarUrl}
                      alt={character.name}
                      className={styles.chipAvatar}
                    />
                  ) : (
                    <span className={styles.chipEmoji}>🧜‍♀️</span>
                  )}
                  <span>{character.name}</span>
                </Badge>
                {emotion && (
                  <Badge variant="secondary" className={styles.emotionChip}>
                    #{emotion}
                    <Icon name="arrow_down" size={12} />
                  </Badge>
                )}
              </div>
            )}

            {/* 배경 */}
            {background && (
              <div className={styles.resourceGroup}>
                <span className={styles.resourceLabel}>배경</span>
                <Badge
                  variant="secondary"
                  className={styles.resourceChip}
                  onClick={(e) => {
                    e.stopPropagation();
                    onResourceChipClick(block.id, "background");
                  }}
                >
                  <span className={styles.chipEmoji}>🏰</span>
                  <span>{background.name}</span>
                </Badge>
              </div>
            )}

            {/* 음악 */}
            {bgm && (
              <div className={styles.resourceGroup}>
                <span className={styles.resourceLabel}>음악</span>
                <Badge
                  variant="secondary"
                  className={styles.resourceChip}
                  onClick={(e) => {
                    e.stopPropagation();
                    onResourceChipClick(block.id, "bgm");
                  }}
                >
                  <span className={styles.chipEmoji}>🎵</span>
                  <span>{bgm.name}</span>
                </Badge>
              </div>
            )}

            {/* 이펙트 */}
            {effect && (
              <div className={styles.resourceGroup}>
                <span className={styles.resourceLabel}>연출</span>
                <Badge
                  variant="secondary"
                  className={styles.resourceChip}
                  onClick={(e) => {
                    e.stopPropagation();
                    onResourceChipClick(block.id, "effect");
                  }}
                >
                  <span className={styles.chipEmoji}>⭐</span>
                  <span>{effect.name}</span>
                </Badge>
              </div>
            )}
          </div>
        </>
      )}

      {/* 선택지 테이블 */}
      {block.choices && block.choices.length > 0 && (
        <div className={styles.choiceSection}>
          <ChoiceTable
            block={block}
            onUpdate={onUpdate}
          />
        </div>
      )}
    </div>
  );
}
