"use client";

import { useRef, useEffect } from "react";
import type { ScriptBlock } from "../../lib/ink-editor/types";
import { getBlockAttribute } from "../../lib/ink-editor/utils";
import Icon from "../Icon";
import styles from "./CategoryMenu.module.css";

export type CategoryKey = "scene" | "character" | "background" | "direction" | "gallery" | "bgm" | "choice";

interface CategoryItem {
  key: CategoryKey;
  label: string;
  icon: string;
}

const CATEGORIES: CategoryItem[] = [
  { key: "scene", label: "장면추가", icon: "plus" },
  { key: "character", label: "캐릭터", icon: "profile_circle" },
  { key: "background", label: "배경", icon: "photo" },
  { key: "direction", label: "연출", icon: "star" },
  { key: "gallery", label: "갤러리", icon: "photo" },
  { key: "bgm", label: "음악", icon: "album" },
  { key: "choice", label: "선택지", icon: "arrow_down" },
];

interface CategoryMenuProps {
  block: ScriptBlock;
  position: { top: number; left: number };
  onSelect: (category: CategoryKey) => void;
  onClose: () => void;
}

export default function CategoryMenu({
  block,
  position,
  onSelect,
  onClose,
}: CategoryMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // 약간의 지연을 두어 현재 클릭 이벤트가 처리되도록 함
    setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Escape 키로 닫기
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // 카테고리 비활성화 여부 확인
  const isCategoryDisabled = (categoryKey: CategoryKey): boolean => {
    switch (categoryKey) {
      case "scene":
        // 장면추가는 항상 활성화
        return false;
      case "character":
        return !!getBlockAttribute(block, "characterId");
      case "background":
        return !!getBlockAttribute(block, "backgroundId");
      case "bgm":
        return !!getBlockAttribute(block, "bgmId");
      case "direction":
        return !!getBlockAttribute(block, "effectId"); // 연출은 effectId 사용
      case "gallery":
        // 갤러리는 별도 속성이 없으므로 항상 활성화
        return false;
      case "choice":
        // 선택지는 이미 있는지 확인
        return !!(block.choices && block.choices.length > 0);
      default:
        return false;
    }
  };

  const handleCategoryClick = (category: CategoryKey) => {
    if (isCategoryDisabled(category)) {
      return;
    }
    onSelect(category);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className={styles.categoryMenu}
      style={{
        position: "fixed",
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {CATEGORIES.map((category) => {
        const isDisabled = isCategoryDisabled(category.key);
        return (
          <button
            key={category.key}
            className={`${styles.menuItem} ${isDisabled ? styles.disabled : ""}`}
            onClick={() => handleCategoryClick(category.key)}
            disabled={isDisabled}
            title={isDisabled ? "이미 적용된 리소스입니다" : category.label}
          >
            <div className={styles.menuItemIcon}>
              <Icon name={category.icon} size={20} />
            </div>
            <span className={styles.menuItemText}>{category.label}</span>
            {isDisabled && (
              <Icon name="checked_regular" size={14} className={styles.checkIcon} />
            )}
          </button>
        );
      })}
    </div>
  );
}
