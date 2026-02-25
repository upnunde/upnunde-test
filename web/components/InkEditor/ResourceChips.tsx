"use client";

import type { ScriptBlock } from "../../lib/ink-editor/types";
import { getResourceId } from "../../lib/ink-editor/utils";
import { getResourceById, type ResourceCategory } from "../../lib/ink-editor/useEditorLogic";
import { Badge } from "../ui/index";
import Icon from "../Icon";
import styles from "./ResourceChips.module.css";

interface ResourceChipsProps {
  block: ScriptBlock;
  onChipClick: (category: ResourceCategory) => void;
}

const CATEGORY_CONFIG: Record<
  ResourceCategory,
  { label: string; icon: string; emoji: string }
> = {
  character: { label: "캐릭터", icon: "profile_circle", emoji: "🧜‍♀️" },
  background: { label: "배경", icon: "photo", emoji: "🏰" },
  bgm: { label: "BGM", icon: "album", emoji: "🎵" },
  effect: { label: "이펙트", icon: "star", emoji: "✨" },
};

export default function ResourceChips({
  block,
  onChipClick,
}: ResourceChipsProps) {
  const { mappedResources } = block;

  // 리소스 칩 렌더링
  const renderChip = (
    category: ResourceCategory,
    resourceId: string | null | undefined
  ) => {
    const config = CATEGORY_CONFIG[category];
    const hasResource = resourceId && resourceId !== "";

    if (hasResource) {
      const resource = getResourceById(resourceId);
      if (!resource) return null;

      return (
        <Badge
          key={category}
          variant="secondary"
          className={styles.resourceChip}
          onClick={(e) => {
            e.stopPropagation();
            onChipClick(category);
          }}
        >
          {resource.avatarUrl ? (
            <img
              src={resource.avatarUrl}
              alt={resource.name}
              className={styles.chipAvatar}
            />
          ) : (
            <span className={styles.chipEmoji}>{config.emoji}</span>
          )}
          <span className={styles.chipName}>{resource.name}</span>
        </Badge>
      );
    } else {
      // 빈 카테고리: 희미한 아이콘(+) 표시
      return (
        <button
          key={category}
          className={styles.emptyChip}
          onClick={(e) => {
            e.stopPropagation();
            onChipClick(category);
          }}
          title={`${config.label} 추가`}
        >
          <Icon name="plus" size={14} />
          <span className={styles.emptyChipLabel}>{config.label}</span>
        </button>
      );
    }
  };

  // 카테고리 순서: 캐릭터 → 배경 → BGM → 이펙트
  const categories: ResourceCategory[] = [
    "character",
    "background",
    "bgm",
    "effect",
  ];

  const chips = categories.map((category) => {
    const resourceId = getResourceId(mappedResources, category);
    return renderChip(category, resourceId);
  }).filter(Boolean);

  if (chips.length === 0) {
    return null;
  }

  return <div className={styles.resourceChips}>{chips}</div>;
}
