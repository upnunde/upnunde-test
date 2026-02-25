"use client";

import { useState, useMemo } from "react";
import type { ScriptBlock } from "../../lib/ink-editor/types";
import {
  useEditorLogic,
  getResourcesByCategory,
  type ResourceCategory,
} from "../../lib/ink-editor/useEditorLogic";
import { getResourceId } from "../../lib/ink-editor/utils";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/index";
import Icon from "../Icon";
import styles from "./ResourceSidebar.module.css";

interface ResourceSidebarProps {
  selectedBlock: ScriptBlock | null;
  episodeData: any;
  onDataChange: (data: any) => void;
  onClose: () => void;
  initialCategory?: "character" | "background" | "bgm" | "effect";
}

export default function ResourceSidebar({
  selectedBlock,
  episodeData,
  onDataChange,
  onClose,
  initialCategory,
}: ResourceSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<
    Set<ResourceCategory>
  >(
    new Set(
      initialCategory
        ? [initialCategory]
        : ["character", "background", "bgm", "effect"]
    )
  );

  const { handleResourceToggle, getResourceById } = useEditorLogic(
    episodeData,
    onDataChange
  );

  // 카테고리 토글
  const toggleCategory = (category: ResourceCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  // 현재 선택된 블록의 매핑된 리소스 ID들
  const mappedResourceIds = useMemo(() => {
    if (!selectedBlock?.mappedResources) return new Set<string>();
    const ids = new Set<string>();
    const categories: ResourceCategory[] = [
      "character",
      "background",
      "bgm",
      "effect",
    ];
    categories.forEach((category) => {
      const id = getResourceId(selectedBlock.mappedResources, category);
      if (id) ids.add(id);
    });
    return ids;
  }, [selectedBlock]);

  // 리소스 클릭 핸들러
  const handleResourceClick = (
    resourceId: string,
    category: ResourceCategory
  ) => {
    if (!selectedBlock) return;
    handleResourceToggle(selectedBlock.id, resourceId, category);
  };

  // 카테고리별 리소스 렌더링
  const renderCategory = (category: ResourceCategory, label: string) => {
    const resources = getResourcesByCategory(category);
    const isExpanded = expandedCategories.has(category);
    const categoryIcon = {
      character: "profile_circle",
      background: "photo",
      bgm: "album",
      effect: "star",
    }[category];

    return (
      <Card key={category} className={styles.categoryCard}>
        <CardHeader
          className={styles.categoryHeader}
          onClick={() => toggleCategory(category)}
        >
          <div className={styles.categoryHeaderLeft}>
            <Icon name={categoryIcon} size={20} />
            <CardTitle className={styles.categoryTitle}>{label}</CardTitle>
          </div>
          <Icon
            name={isExpanded ? "arrow_up" : "arrow_down"}
            size={16}
            className={styles.expandIcon}
          />
        </CardHeader>
        {isExpanded && (
          <CardContent className={styles.categoryContent}>
            <div className={styles.resourceGrid}>
              {resources.map((resource) => {
                const isActive = mappedResourceIds.has(resource.id);
                return (
                  <div
                    key={resource.id}
                    className={`${styles.resourceItem} ${
                      isActive ? styles.resourceItemActive : ""
                    }`}
                    onClick={() => handleResourceClick(resource.id, category)}
                  >
                    <div className={styles.resourceThumbnail}>
                      {resource.avatarUrl || resource.thumbnailUrl ? (
                        <img
                          src={resource.avatarUrl || resource.thumbnailUrl}
                          alt={resource.name}
                          className={styles.resourceImage}
                        />
                      ) : (
                        <div className={styles.resourcePlaceholder}>
                          <Icon name={categoryIcon} size={24} />
                        </div>
                      )}
                      {isActive && (
                        <div className={styles.activeIndicator}>
                          <Icon name="checked_regular" size={16} />
                        </div>
                      )}
                    </div>
                    <div className={styles.resourceName}>{resource.name}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  if (!selectedBlock) {
    return null;
  }

  return (
    <div className={styles.resourceSidebar}>
      <div className={styles.sidebarHeader}>
        <h2 className={styles.sidebarTitle}>리소스</h2>
        <button className={styles.closeButton} onClick={onClose}>
          <Icon name="close" size={20} />
        </button>
      </div>

      <div className={styles.sidebarContent}>
        {renderCategory("character", "캐릭터")}
        {renderCategory("background", "배경")}
        {renderCategory("bgm", "배경음악")}
        {renderCategory("effect", "이펙트")}
      </div>
    </div>
  );
}
