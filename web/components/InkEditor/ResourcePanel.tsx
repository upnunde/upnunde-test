"use client";

import type { ScriptBlock } from "../../lib/ink-editor/types";
import { getBlockAttribute } from "../../lib/ink-editor/utils";
import { getResourceById } from "../../lib/ink-editor/useEditorLogic";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/index";
import { Badge } from "../ui/index";
import Icon from "../Icon";
import styles from "./ResourcePanel.module.css";

interface ResourcePanelProps {
  block: ScriptBlock;
}

export default function ResourcePanel({ block }: ResourcePanelProps) {
  const characterId = getBlockAttribute(block, "characterId");
  const backgroundId = getBlockAttribute(block, "backgroundId");
  const bgmId = getBlockAttribute(block, "bgmId");
  const effectId = getBlockAttribute(block, "effectId");
  const emotion = getBlockAttribute(block, "emotion");

  const character = characterId ? getResourceById(characterId) : null;
  const background = backgroundId ? getResourceById(backgroundId) : null;
  const bgm = bgmId ? getResourceById(bgmId) : null;
  const effect = effectId ? getResourceById(effectId) : null;

  return (
    <div className={styles.resourcePanel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>블록 속성</h2>
      </div>

      <div className={styles.panelContent}>
        {/* 현재 선택된 블록 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>블록 내용</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.blockContent}>
              <p className={styles.blockText}>{block.content || "(비어있음)"}</p>
              {block.blockType && (
                <Badge variant="secondary" className={styles.blockTypeBadge}>
                  {block.blockType === "dialogue" ? "대사" : "지문"}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 연결된 리소스 */}
        <Card>
          <CardHeader>
            <CardTitle>연결된 리소스</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.resourcesList}>
              {/* 캐릭터 */}
              {character ? (
                <div className={styles.resourceItem}>
                  <div className={styles.resourceItemHeader}>
                    <Icon name="profile_circle" size={16} />
                    <span className={styles.resourceItemLabel}>캐릭터</span>
                  </div>
                  <Badge variant="secondary" className={styles.resourceBadge}>
                    {character.avatarUrl ? (
                      <img
                        src={character.avatarUrl}
                        alt={character.name}
                        className={styles.resourceAvatar}
                      />
                    ) : (
                      <span className={styles.resourceEmoji}>🧜‍♀️</span>
                    )}
                    <span>{character.name}</span>
                  </Badge>
                </div>
              ) : (
                <div className={styles.resourceItemEmpty}>
                  <Icon name="profile_circle" size={16} />
                  <span className={styles.resourceItemLabel}>캐릭터</span>
                  <span className={styles.emptyText}>미설정</span>
                </div>
              )}

              {/* 배경 */}
              {background ? (
                <div className={styles.resourceItem}>
                  <div className={styles.resourceItemHeader}>
                    <Icon name="photo" size={16} />
                    <span className={styles.resourceItemLabel}>배경</span>
                  </div>
                  <Badge variant="secondary" className={styles.resourceBadge}>
                    <span className={styles.resourceEmoji}>🏰</span>
                    <span>{background.name}</span>
                  </Badge>
                </div>
              ) : (
                <div className={styles.resourceItemEmpty}>
                  <Icon name="photo" size={16} />
                  <span className={styles.resourceItemLabel}>배경</span>
                  <span className={styles.emptyText}>미설정</span>
                </div>
              )}

              {/* BGM */}
              {bgm ? (
                <div className={styles.resourceItem}>
                  <div className={styles.resourceItemHeader}>
                    <Icon name="album" size={16} />
                    <span className={styles.resourceItemLabel}>BGM</span>
                  </div>
                  <Badge variant="secondary" className={styles.resourceBadge}>
                    <span className={styles.resourceEmoji}>🎵</span>
                    <span>{bgm.name}</span>
                  </Badge>
                </div>
              ) : (
                <div className={styles.resourceItemEmpty}>
                  <Icon name="album" size={16} />
                  <span className={styles.resourceItemLabel}>BGM</span>
                  <span className={styles.emptyText}>미설정</span>
                </div>
              )}

              {/* 이펙트 */}
              {effect ? (
                <div className={styles.resourceItem}>
                  <div className={styles.resourceItemHeader}>
                    <Icon name="star" size={16} />
                    <span className={styles.resourceItemLabel}>이펙트</span>
                  </div>
                  <Badge variant="secondary" className={styles.resourceBadge}>
                    <span className={styles.resourceEmoji}>✨</span>
                    <span>{effect.name}</span>
                  </Badge>
                </div>
              ) : (
                <div className={styles.resourceItemEmpty}>
                  <Icon name="star" size={16} />
                  <span className={styles.resourceItemLabel}>이펙트</span>
                  <span className={styles.emptyText}>미설정</span>
                </div>
              )}

              {/* 감정 */}
              {emotion && (
                <div className={styles.resourceItem}>
                  <div className={styles.resourceItemHeader}>
                    <Icon name="face_smile" size={16} />
                    <span className={styles.resourceItemLabel}>감정</span>
                  </div>
                  <Badge variant="secondary" className={styles.resourceBadge}>
                    <span>{emotion}</span>
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
