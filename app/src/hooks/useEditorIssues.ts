"use client";

import { useMemo } from "react";
import { useEditorStore } from "@/store/useEditorStore";

export type EditorIssueKind = "error" | "missing";

export interface EditorIssue {
  kind: EditorIssueKind;
  blockId: string;
  title: string;
  detail?: string;
}

/** 이슈 제목에서 선택지 필드 포커스 대상(choiceIndex·field)을 해석한다 */
export function getIssueFocusTarget(issue: EditorIssue): {
  blockId: string;
  choiceIndex?: number;
  field?: "text" | "nextScene";
} {
  const choiceFieldMatch = issue.title.match(/^선택지\s+(\d+)\s+(문구|다음 장면)\s+누락$/);
  if (choiceFieldMatch) {
    return {
      blockId: issue.blockId,
      choiceIndex: Number(choiceFieldMatch[1]) - 1,
      field: choiceFieldMatch[2] === "문구" ? "text" : "nextScene",
    };
  }
  return { blockId: issue.blockId };
}

/** 에디터 블록 전체의 오류/누락 목록 (SceneNavigation·모바일 플로팅 버튼 공용) */
export function useEditorIssues(): EditorIssue[] {
  const blocks = useEditorStore((s) => s.blocks);

  return useMemo<EditorIssue[]>(() => {
    const next: EditorIssue[] = [];

    for (const block of blocks) {
      // "누락" 기본 규칙: 텍스트성 블록인데 내용이 비어 있음
      if (["scene", "top_desc", "text", "direction"].includes(block.type)) {
        if (!block.content?.trim()) {
          const title =
            block.type === "scene"
              ? "장면 제목 누락"
              : block.type === "top_desc"
                ? "장면정보 누락"
                : block.type === "text"
                  ? "대사/서술 누락"
                  : "연출 텍스트 누락";
          next.push({ kind: "missing", blockId: block.id, title });
        }
      }

      // 선택지 블록 검증: 선택지 텍스트/다음 장면 누락
      if (block.type === "choice") {
        const choices = Array.isArray(block.data?.choices) ? block.data?.choices : [];
        if (choices.length === 0) {
          next.push({
            kind: "error",
            blockId: block.id,
            title: "선택지 항목 없음",
            detail: "선택지 블록에 항목이 없습니다.",
          });
        } else {
          choices.forEach((c, idx) => {
            const n = idx + 1;
            // AI 모드 선택지는 문구 입력을 쓰지 않으므로 빈 text는 누락으로 보지 않음
            if (!c.isAiMode && !c.text?.trim()) {
              next.push({
                kind: "missing",
                blockId: block.id,
                title: `선택지 ${n} 문구 누락`,
              });
            }
            if (!c.nextScene?.trim()) {
              next.push({
                kind: "missing",
                blockId: block.id,
                title: `선택지 ${n} 다음 장면 누락`,
              });
            }
          });
        }
      }
    }

    return next;
  }, [blocks]);
}
