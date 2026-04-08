"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Icon from "../Icon";
import styles from "./SlashMenu.module.css";

export type SlashCommandAction =
  | { type: "resource"; category: "character" | "background" | "bgm" | "effect" }
  | { type: "blockType"; blockType: "dialogue" | "description" }
  | { type: "edit"; action: "delete" | "duplicate" };

interface SlashCommand {
  id: string;
  label: string;
  description?: string;
  icon: string;
  emoji: string;
  category: "resource" | "blockType" | "edit";
  action: SlashCommandAction;
}

interface SlashMenuProps {
  position: { top: number; left: number };
  onSelect: (action: SlashCommandAction) => void;
  onClose: () => void;
}

const SLASH_COMMANDS: SlashCommand[] = [
  // 리소스 추가
  {
    id: "character",
    label: "캐릭터 변경",
    description: "대사에 캐릭터를 설정합니다",
    icon: "profile_circle",
    emoji: "🧜‍♀️",
    category: "resource",
    action: { type: "resource", category: "character" },
  },
  {
    id: "background",
    label: "배경 설정",
    description: "장면의 배경을 설정합니다",
    icon: "photo",
    emoji: "🏰",
    category: "resource",
    action: { type: "resource", category: "background" },
  },
  {
    id: "bgm",
    label: "BGM 추가",
    description: "배경음악을 추가합니다",
    icon: "album",
    emoji: "🎵",
    category: "resource",
    action: { type: "resource", category: "bgm" },
  },
  {
    id: "effect",
    label: "이펙트 추가",
    description: "시각 효과를 추가합니다",
    icon: "star",
    emoji: "✨",
    category: "resource",
    action: { type: "resource", category: "effect" },
  },
  // 블록 타입 변경
  {
    id: "to-description",
    label: "지문으로 전환",
    description: "대사를 지문(설명)으로 변경합니다",
    icon: "pen",
    emoji: "📝",
    category: "blockType",
    action: { type: "blockType", blockType: "description" },
  },
  {
    id: "to-dialogue",
    label: "대사로 전환",
    description: "지문을 대사로 변경합니다",
    icon: "mic",
    emoji: "💬",
    category: "blockType",
    action: { type: "blockType", blockType: "dialogue" },
  },
  // 편집
  {
    id: "duplicate",
    label: "복제",
    description: "블록을 복제합니다",
    icon: "plus",
    emoji: "📋",
    category: "edit",
    action: { type: "edit", action: "duplicate" },
  },
  {
    id: "delete",
    label: "블록 삭제",
    description: "이 블록을 삭제합니다",
    icon: "delete",
    emoji: "🗑️",
    category: "edit",
    action: { type: "edit", action: "delete" },
  },
];

export default function SlashMenu({
  position,
  onSelect,
  onClose,
}: SlashMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredCommands, setFilteredCommands] = useState(SLASH_COMMANDS);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          onSelect(filteredCommands[selectedIndex].action);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, filteredCommands, onSelect, onClose]);

  // 선택된 아이템으로 스크롤
  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // 명령어 그룹화
  const groupedCommands = filteredCommands.reduce(
    (acc, command) => {
      if (!acc[command.category]) {
        acc[command.category] = [];
      }
      acc[command.category].push(command);
      return acc;
    },
    {} as Record<string, SlashCommand[]>
  );

  const categoryLabels: Record<string, string> = {
    resource: "리소스",
    blockType: "블록 타입",
    edit: "편집",
  };

  return (
    <div
      ref={menuRef}
      className={styles.slashMenu}
      style={{
        position: "fixed",
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className={styles.slashMenuHeader}>
        <span className={styles.slashMenuTitle}>명령어</span>
      </div>
      <div className={styles.slashMenuList}>
        {Object.entries(groupedCommands).map(([category, commands]) => (
          <div key={category} className={styles.slashMenuGroup}>
            <div className={styles.slashMenuGroupLabel}>
              {categoryLabels[category]}
            </div>
            {commands.map((command, index) => {
              const globalIndex = filteredCommands.indexOf(command);
              const isSelected = globalIndex === selectedIndex;

              return (
                <button
                  key={command.id}
                  ref={(el) => {
                    itemRefs.current[globalIndex] = el;
                  }}
                  className={`${styles.slashMenuItem} ${
                    isSelected ? styles.slashMenuItemSelected : ""
                  }`}
                  onClick={() => onSelect(command.action)}
                  onMouseEnter={() => setSelectedIndex(globalIndex)}
                >
                  <span className={styles.slashMenuEmoji}>{command.emoji}</span>
                  <div className={styles.slashMenuItemContent}>
                    <span className={styles.slashMenuLabel}>{command.label}</span>
                    {command.description && (
                      <span className={styles.slashMenuDescription}>
                        {command.description}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
