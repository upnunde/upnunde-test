"use client";

import { useState, useCallback } from "react";
import type { EpisodeBlock, EpisodeData, ScriptBlock } from "../../lib/ink-editor/types";
import Header from "../Header/Header";
import EditorCanvas from "./EditorCanvas";
import ResourceSidebar from "./ResourceSidebar";
import styles from "./Layout.module.css";

interface LayoutProps {
  initialData?: EpisodeData;
  onDataChange?: (data: EpisodeData) => void;
}

export default function Layout({ initialData, onDataChange }: LayoutProps) {
  const [episodeData, setEpisodeData] = useState<EpisodeData>(
    initialData || {
      id: `episode_${Date.now()}`,
      title: "",
      blocks: [],
    }
  );

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedResourceCategory, setSelectedResourceCategory] = useState<
    "character" | "background" | "bgm" | "effect" | null
  >(null);

  // 데이터 변경 핸들러
  const handleDataChange = useCallback(
    (newData: EpisodeData) => {
      setEpisodeData(newData);
      onDataChange?.(newData);
    },
    [onDataChange]
  );

  // 블록 선택 핸들러
  const handleBlockSelect = useCallback((blockId: string) => {
    setSelectedBlockId(blockId);
  }, []);

  // 리소스 칩 클릭 핸들러
  const handleResourceChipClick = useCallback(
    (blockId: string, category: "character" | "background" | "bgm" | "effect") => {
      setSelectedBlockId(blockId);
      setSelectedResourceCategory(category);
    },
    []
  );

  // 사이드바 닫기 핸들러
  const handleCloseSidebar = useCallback(() => {
    setSelectedResourceCategory(null);
  }, []);

  // 선택된 Script Block 찾기
  const selectedBlock = selectedBlockId
    ? (episodeData.blocks.find(
        (block) => block.id === selectedBlockId && block.type === "script"
      ) as ScriptBlock | undefined)
    : null;

  return (
    <div className={styles.layout}>
      {/* Header */}
      <Header title="Ink Editor" onBack={() => console.log("Back clicked")} />

      {/* Main Container */}
      <div className={styles.mainContainer}>
        {/* Editor Canvas (Left) */}
        <EditorCanvas
          episodeData={episodeData}
          onDataChange={handleDataChange}
          selectedBlockId={selectedBlockId}
          onBlockSelect={handleBlockSelect}
          onResourceChipClick={handleResourceChipClick}
        />

        {/* Resource Sidebar (Right) - Conditional Rendering */}
        {selectedBlock && selectedResourceCategory && (
          <ResourceSidebar
            selectedBlock={selectedBlock}
            episodeData={episodeData}
            onDataChange={handleDataChange}
            onClose={handleCloseSidebar}
            initialCategory={selectedResourceCategory}
          />
        )}
      </div>
    </div>
  );
}
