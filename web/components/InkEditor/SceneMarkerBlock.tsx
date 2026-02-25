"use client";

import { useState } from "react";
import type { SceneMarker } from "../../lib/ink-editor/types";
import Icon from "../Icon";
import styles from "./SceneMarkerBlock.module.css";

interface SceneMarkerBlockProps {
  block: SceneMarker;
  onUpdate: (updates: Partial<SceneMarker>) => void;
  onRemove: () => void;
  onAddAfter: (type: "scene" | "script") => void;
}

export default function SceneMarkerBlock({
  block,
  onUpdate,
  onRemove,
  onAddAfter,
}: SceneMarkerBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(block.title);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    onUpdate({ title });
    setIsEditing(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
    if (e.key === "Escape") {
      setTitle(block.title);
      setIsEditing(false);
    }
  };

  return (
    <div 
      className={styles.sceneMarker}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.sceneHeader}>
        <div className={styles.sceneLabel}>Scene {block.sceneNumber}</div>
        {isEditing ? (
          <input
            type="text"
            className={styles.sceneTitleInput}
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            placeholder="씬 제목을 입력하세요"
            autoFocus
          />
        ) : (
          <h2
            className={styles.sceneTitle}
            onClick={() => setIsEditing(true)}
          >
            {title || "씬 제목을 입력하세요"}
          </h2>
        )}
      </div>
    </div>
  );
}
