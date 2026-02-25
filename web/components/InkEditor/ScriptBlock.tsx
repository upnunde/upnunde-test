"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ScriptBlock } from "../../lib/ink-editor/types";
import { getResourceId } from "../../lib/ink-editor/utils";
import { getResourceById, type ResourceCategory } from "../../lib/ink-editor/useEditorLogic";
import type { SlashCommandAction } from "./SlashMenu";
import { Badge } from "../ui/index";
import Icon from "../Icon";
import SlashMenu from "./SlashMenu";
import ResourceChips from "./ResourceChips";
import styles from "./ScriptBlock.module.css";

interface ScriptBlockProps {
  block: ScriptBlock;
  isSelected: boolean;
  onUpdate: (updates: Partial<ScriptBlock>) => void;
  onAddAfter: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onSelect: () => void;
  onResourceChipClick: (blockId: string, category: ResourceCategory) => void;
}

export default function ScriptBlockComponent({
  block,
  isSelected,
  onUpdate,
  onAddAfter,
  onDelete,
  onDuplicate,
  onSelect,
  onResourceChipClick,
}: ScriptBlockProps) {
  const [text, setText] = useState(block.content ?? "");
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // 텍스트 변경 시 자동 저장
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const currentContent = block.content ?? "";
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
        const lineHeight = 22; // line-height
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

      // Backspace: 빈 블록 삭제
      if (
        e.key === "Backspace" &&
        text.trim() === "" &&
        e.currentTarget.selectionStart === 0 &&
        e.currentTarget.selectionEnd === 0
      ) {
        e.preventDefault();
        onDelete();
      }

      // Escape: Slash 메뉴 닫기
      if (e.key === "Escape") {
        setShowSlashMenu(false);
      }
    },
    [text, onAddAfter, onDelete]
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.scriptBlock} ${isSelected ? styles.selected : ""}`}
      data-block-id={block.id}
      onClick={onSelect}
    >
      {/* Drag Handle */}
      <div
        className={styles.dragHandle}
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
      >
        <Icon name="move" size={16} />
      </div>

      {/* Text Input Area */}
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

      {/* Resource Chips (Metadata Row) */}
      <ResourceChips
        block={block}
        onChipClick={(category) => onResourceChipClick(block.id, category)}
      />
    </div>
  );
}
