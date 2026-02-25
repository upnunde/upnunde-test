"use client";

import { useState, useCallback } from "react";
import type { ScriptBlock, ChoiceBlock } from "../../lib/ink-editor/types";
import Icon from "../Icon";
import { Button } from "../ui/index";
import styles from "./ChoiceTable.module.css";

interface ChoiceTableProps {
  block: ScriptBlock;
  onUpdate: (updates: Partial<ScriptBlock>) => void;
}

export default function ChoiceTable({ block, onUpdate }: ChoiceTableProps) {
  const choices = block.choices || [];

  // 선택지 추가
  const handleAddChoice = useCallback(() => {
    const newChoice: ChoiceBlock = {
      id: `choice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: "",
      isPaid: false,
      isAI: false,
    };

    onUpdate({
      choices: [...choices, newChoice],
    });
  }, [choices, onUpdate]);

  // 선택지 삭제
  const handleDeleteChoice = useCallback(
    (choiceId: string) => {
      const newChoices = choices.filter((choice) => choice.id !== choiceId);
      onUpdate({ choices: newChoices });
    },
    [choices, onUpdate]
  );

  // 선택지 업데이트
  const handleUpdateChoice = useCallback(
    (choiceId: string, updates: Partial<ChoiceBlock>) => {
      const newChoices = choices.map((choice) =>
        choice.id === choiceId ? { ...choice, ...updates } : choice
      );
      onUpdate({ choices: newChoices });
    },
    [choices, onUpdate]
  );

  return (
    <div className={styles.choiceTable}>
      {/* 테이블 헤더 */}
      <div className={styles.tableHeader}>
        <div className={styles.headerCell} style={{ width: "80px" }}>
          선택
        </div>
        <div className={styles.headerCell} style={{ flex: 1, minWidth: "320px" }}>
          내용
        </div>
        <div className={styles.headerCell} style={{ width: "192px" }}>
          Scene 전환
        </div>
        <div className={styles.headerCell} style={{ width: "192px" }}>
          선택지 유료로 전환
        </div>
        <div className={styles.headerCell} style={{ width: "32px" }}>
          <button
            className={styles.deleteHeaderButton}
            onClick={(e) => {
              e.stopPropagation();
              // 전체 선택지 삭제
              onUpdate({ choices: [] });
            }}
            title="선택지 테이블 삭제"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      </div>

      {/* 테이블 행들 */}
      {choices.map((choice, index) => (
        <div key={choice.id} className={styles.tableRow}>
          <div className={styles.tableCell} style={{ width: "80px" }}>
            <span className={styles.choiceNumber}>선택 {index + 1}</span>
          </div>
          <div className={styles.tableCell} style={{ flex: 1, minWidth: "320px" }}>
            {choice.isAI ? (
              <div className={styles.aiChoice}>
                <Icon name="ai" size={16} />
                <span className={styles.aiText}>AI 모드로 직접 대화</span>
              </div>
            ) : (
              <input
                type="text"
                className={styles.choiceInput}
                value={choice.content}
                onChange={(e) =>
                  handleUpdateChoice(choice.id, { content: e.target.value })
                }
                placeholder="선택지 내용을 입력하세요"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
          <div className={styles.tableCell} style={{ width: "192px" }}>
            <input
              type="text"
              className={styles.sceneInput}
              value={choice.nextSceneId || ""}
              onChange={(e) =>
                handleUpdateChoice(choice.id, { nextSceneId: e.target.value })
              }
              placeholder="Scene ID"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className={styles.sceneSelectButton}
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Scene 선택 모달 열기
              }}
            >
              <Icon name="arrow_down" size={16} />
            </button>
          </div>
          <div className={styles.tableCell} style={{ width: "192px" }}>
            <label className={styles.toggleSwitch}>
              <input
                type="checkbox"
                checked={choice.isPaid || false}
                onChange={(e) =>
                  handleUpdateChoice(choice.id, { isPaid: e.target.checked })
                }
                onClick={(e) => e.stopPropagation()}
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>
          <div className={styles.tableCell} style={{ width: "32px" }}>
            <button
              className={styles.deleteRowButton}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteChoice(choice.id);
              }}
              title="선택지 삭제"
            >
              <Icon name="close" size={16} />
            </button>
          </div>
        </div>
      ))}

      {/* 선택지 추가 버튼 */}
      <div className={styles.tableFooter}>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleAddChoice();
          }}
          className={styles.addChoiceButton}
        >
          <Icon name="plus" size={16} />
          <span>선택지 추가</span>
        </Button>
      </div>
    </div>
  );
}
