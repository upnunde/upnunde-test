"use client";

import { useState, useEffect } from "react";
import type { EpisodeBlock, EpisodeData, SceneMarker, ScriptBlock } from "../../lib/ink-editor/types";
import { updateBlock } from "../../lib/ink-editor/utils";
import { Button, Input, Label, Card, CardHeader, CardTitle, CardContent } from "../ui/index";
import Icon from "../Icon";
import styles from "./PropertySidebar.module.css";

interface PropertySidebarProps {
  block: EpisodeBlock;
  blockType: "scene" | "script";
  episodeData: EpisodeData;
  onDataChange: (data: EpisodeData) => void;
  onClose: () => void;
}

export default function PropertySidebar({
  block,
  blockType,
  episodeData,
  onDataChange,
  onClose,
}: PropertySidebarProps) {
  const [localBlock, setLocalBlock] = useState<EpisodeBlock>(block);

  // 블록이 변경되면 로컬 상태 업데이트
  useEffect(() => {
    setLocalBlock(block);
  }, [block]);

  // 변경사항 저장
  const handleSave = () => {
    const newBlocks = updateBlock(episodeData.blocks, block.id, localBlock);
    onDataChange({ ...episodeData, blocks: newBlocks });
  };

  // Scene Marker 편집
  if (blockType === "scene" && localBlock.type === "scene") {
    return (
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Scene 속성</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className={styles.sidebarContent}>
          <Card>
            <CardHeader>
              <CardTitle>Scene 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.formGroup}>
                <Label htmlFor="scene-number">Scene 번호</Label>
                <Input
                  id="scene-number"
                  type="number"
                  value={localBlock.sceneNumber}
                  onChange={(e) =>
                    setLocalBlock({
                      ...localBlock,
                      sceneNumber: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <Label htmlFor="scene-title">Scene 제목</Label>
                <Input
                  id="scene-title"
                  value={localBlock.title}
                  onChange={(e) =>
                    setLocalBlock({
                      ...localBlock,
                      title: e.target.value,
                    })
                  }
                  placeholder="장면 제목을 입력하세요"
                />
              </div>

              <div className={styles.formActions}>
                <Button variant="default" onClick={handleSave}>
                  저장
                </Button>
                <Button variant="outline" onClick={onClose}>
                  취소
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Script Block 편집
  if (blockType === "script" && localBlock.type === "script") {
    return (
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Script 속성</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className={styles.sidebarContent}>
          <Card>
            <CardHeader>
              <CardTitle>Script 내용</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.formGroup}>
                <Label htmlFor="script-text">텍스트</Label>
                <textarea
                  id="script-text"
                  className={styles.textarea}
                  value={localBlock.content ?? ""}
                  onChange={(e) =>
                    setLocalBlock({
                      ...localBlock,
                      content: e.target.value,
                    })
                  }
                  placeholder="스크립트를 입력하세요"
                  rows={5}
                />
              </div>

              <div className={styles.formActions}>
                <Button variant="default" onClick={handleSave}>
                  저장
                </Button>
                <Button variant="outline" onClick={onClose}>
                  취소
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 리소스 섹션 */}
          <Card>
            <CardHeader>
              <CardTitle>리소스</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={styles.comingSoon}>리소스 관리 기능은 곧 추가됩니다.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
