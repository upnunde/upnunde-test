"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { AlertTriangle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/useEditorStore";
import { cn } from "@/lib/utils";

interface SceneNavigationProps {
  onSceneClick?: (blockId: string) => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}

export function SceneNavigation({
  onSceneClick,
  collapsed = false,
  onToggleCollapsed,
}: SceneNavigationProps) {
  const blocks = useEditorStore((s) => s.blocks);
  const focusBlockId = useEditorStore((s) => s.focusBlockId);
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const setFocusBlockId = useEditorStore((s) => s.setFocusBlockId);
  const setIssueFocus = useEditorStore((s) => s.setIssueFocus);
  const clearIssueFocus = useEditorStore((s) => s.clearIssueFocus);

  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [collapsedIssueOpen, setCollapsedIssueOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingNavTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const collapsedIssueWrapRef = useRef<HTMLDivElement>(null);

  // 편집 모드 진입 시 input 포커스 (다음 틱에 실행해 DOM 반영 후 포커스 유지)
  useEffect(() => {
    if (!editingBlockId) return;
    const id = requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
    return () => cancelAnimationFrame(id);
  }, [editingBlockId]);

  // 클릭/더블클릭 구분: 클릭 시 짧은 지연 후 이동, 그 전에 더블클릭이 오면 편집만 진입
  const NAV_DELAY_MS = 300;

  const clearPendingNav = () => {
    if (pendingNavTimeoutRef.current !== null) {
      clearTimeout(pendingNavTimeoutRef.current);
      pendingNavTimeoutRef.current = null;
    }
  };

  const handleSceneClick = (blockId: string) => {
    if (editingBlockId) return;
    clearIssueFocus();
    clearPendingNav();
    pendingNavTimeoutRef.current = setTimeout(() => {
      pendingNavTimeoutRef.current = null;
      if (onSceneClick) {
        onSceneClick(blockId);
      } else {
        const element = document.getElementById(`block-${blockId}`);
        if (element) {
          element.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
        }
      }
    }, NAV_DELAY_MS);
  };

  const navigateToBlock = (blockId: string, options?: { preserveIssueFocus?: boolean }) => {
    clearPendingNav();
    setEditingBlockId(null);
    setEditValue("");
    if (!options?.preserveIssueFocus) {
      clearIssueFocus();
    }
    setFocusBlockId(blockId);
    if (onSceneClick) {
      onSceneClick(blockId);
      return;
    }
    const element = document.getElementById(`block-${blockId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    }
  };

  const startEdit = (e: React.MouseEvent, block: { id: string; content?: string }) => {
    e.preventDefault();
    e.stopPropagation();
    clearPendingNav(); // 더블클릭이면 예약된 장면 이동 취소
    setEditingBlockId(block.id);
    setEditValue(block.content?.trim() ?? "");
  };

  // 언마운트 시 예약된 타이머 정리
  useEffect(() => () => clearPendingNav(), []);

  // 장면 블록들만 필터링하고 인덱스 정보 포함
  const scenes = useMemo(() => {
    return blocks
      .map((block, index) => ({ block, index }))
      .filter(({ block }) => block.type === "scene");
  }, [blocks]);

  type IssueKind = "error" | "missing";
  type EditorIssue = {
    kind: IssueKind;
    blockId: string;
    title: string;
    detail?: string;
  };

  const issues = useMemo<EditorIssue[]>(() => {
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
          next.push({
            kind: "missing",
            blockId: block.id,
            title,
          });
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

  const commitEdit = (blockId: string, currentContent: string) => {
    const trimmed = editValue.trim();
    if (trimmed) {
      updateBlock(blockId, trimmed);
    }
    setEditingBlockId(null);
    setEditValue("");
  };

  const applyIssueFocus = (issue: EditorIssue) => {
    const choiceFieldMatch = issue.title.match(/^선택지\s+(\d+)\s+(문구|다음 장면)\s+누락$/);
    if (choiceFieldMatch) {
      const choiceIndex = Number(choiceFieldMatch[1]) - 1;
      const field = choiceFieldMatch[2] === "문구" ? "text" : "nextScene";
      setIssueFocus({ blockId: issue.blockId, choiceIndex, field });
      return;
    }
    setIssueFocus({ blockId: issue.blockId });
  };

  const cancelEdit = () => {
    setEditingBlockId(null);
    setEditValue("");
  };

  useEffect(() => {
    if (!collapsed) {
      setCollapsedIssueOpen(false);
    }
  }, [collapsed]);

  useEffect(() => {
    if (!collapsedIssueOpen) return;
    const handleOutsidePointerDown = (event: PointerEvent) => {
      if (!collapsedIssueWrapRef.current) return;
      const target = event.target;
      if (target instanceof Node && !collapsedIssueWrapRef.current.contains(target)) {
        setCollapsedIssueOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleOutsidePointerDown);
    return () => document.removeEventListener("pointerdown", handleOutsidePointerDown);
  }, [collapsedIssueOpen]);

  return (
    <div className="flex h-full flex-col">
      <nav
        className={cn(
          "flex-1 overflow-y-auto pt-2",
          collapsed ? "px-0" : "px-1"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2 py-1.5",
            collapsed ? "justify-center" : "justify-between pl-3 pr-2"
          )}
        >
          {!collapsed && (
            <h2 className="text-sm font-semibold text-on-surface-10 flex items-center gap-2">
              장면 목록
            </h2>
          )}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onToggleCollapsed}
            className="h-9 w-9 shrink-0 rounded-full border-slate-200 shadow-none text-on-surface-30"
            aria-label={collapsed ? "장면 목록 펼치기" : "장면 목록 최소화"}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>

        {!collapsed &&
          (scenes.length === 0 ? (
            <div className="px-3 py-2 text-sm text-on-surface-30 text-center">
              장면이 없습니다
            </div>
          ) : (
            <ul className="space-y-1 px-1">
              {scenes.map(({ block, index }) => {
                const sceneNumber = blocks.slice(0, index).filter((b) => b.type === "scene").length + 1;
                const isActive = focusBlockId === block.id;
                const sceneTitle = block.content?.trim() || `장면 ${sceneNumber}`;
                const isEditing = editingBlockId === block.id;

                const rowContent = (
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs text-on-surface-30 font-mono tabular-nums shrink-0">
                      {String(sceneNumber).padStart(2, "0")}
                    </span>
                    {isEditing ? (
                      <input
                        ref={inputRef}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => commitEdit(block.id, block.content ?? "")}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            commitEdit(block.id, block.content ?? "");
                          } else if (e.key === "Escape") {
                            cancelEdit();
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 min-w-0 rounded px-1 py-0.5 text-[14px] font-medium bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400"
                        aria-label="장면 제목 편집"
                      />
                    ) : (
                      <span
                        className="truncate font-medium text-[14px] flex-1 min-w-0"
                        onDoubleClick={(e) => startEdit(e, block)}
                        title="더블클릭하여 제목 편집"
                      >
                        {sceneTitle}
                      </span>
                    )}
                  </div>
                );

                return (
                  <li key={block.id}>
                    {isEditing ? (
                      <div
                        className={cn(
                          "w-full px-3 py-2 rounded-md text-sm",
                          "bg-white ring-1 ring-slate-300 ring-inset"
                        )}
                      >
                        {rowContent}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSceneClick(block.id)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                          "hover:bg-slate-100",
                          isActive && "font-medium text-black",
                          !isActive && "text-slate-600"
                        )}
                      >
                        {rowContent}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          ))}
      </nav>

      {/* 최하단: 오류/누락 알림 박스 (hover 시 상세 리스트 노출, 클릭 시 해당 위치로 이동) */}
      {!collapsed && (
        <div className="mt-auto px-2 pb-2">
          <div className="relative group">
            <button
              type="button"
              className={cn(
                "w-full rounded-lg border px-3 py-2 text-left transition-colors",
                issues.length > 0
                  ? "border-rose-300 bg-rose-50 text-rose-900 hover:bg-rose-100"
                  : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
              )}
              aria-label="오류 및 누락 알림"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold">
                  {issues.length > 0 ? "오류/누락 있음" : "오류/누락 없음"}
                </div>
                <div className="text-xs tabular-nums">
                  {issues.length}건
                </div>
              </div>
            </button>

            {/* Hover list */}
            {issues.length > 0 && (
              <div
                className="absolute left-0 right-0 bottom-full mb-0 hidden group-hover:block z-50"
                role="dialog"
                aria-label="오류 및 누락 상세"
              >
                <div className="rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden">
                  <div className="px-3 py-2 border-b border-slate-200 bg-slate-50">
                    <div className="text-xs font-semibold text-slate-700">오류/누락 목록</div>
                    <div className="text-[11px] text-slate-500">클릭하면 해당 위치로 이동합니다</div>
                  </div>
                  <ul className="max-h-60 overflow-y-auto py-1">
                    {issues.map((it, idx) => (
                      <li key={`${it.blockId}-${idx}`}>
                        <button
                          type="button"
                          className={cn(
                            "w-full px-3 py-2 text-left text-xs hover:bg-slate-100 transition-colors",
                            it.kind === "error" ? "text-rose-700" : "text-rose-700"
                          )}
                          onClick={() => {
                            applyIssueFocus(it);
                            navigateToBlock(it.blockId, { preserveIssueFocus: true });
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="font-medium">{it.title}</div>
                            <div className="shrink-0 text-[10px] uppercase opacity-70">
                              {it.kind}
                            </div>
                          </div>
                          {it.detail && <div className="mt-0.5 text-[11px] text-slate-500">{it.detail}</div>}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 접힘 상태: 오류 아이콘 고정 노출 + 클릭 시 상세 */}
      {collapsed && (
        <div className="mt-auto pb-2">
          <div ref={collapsedIssueWrapRef} className="relative">
            <button
              type="button"
              onClick={() => setCollapsedIssueOpen((prev) => !prev)}
              className={cn(
                "relative mx-auto flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
                issues.length > 0
                  ? "border-rose-300 bg-rose-50 text-rose-900 hover:bg-rose-100"
                  : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
              )}
              aria-label={issues.length > 0 ? `오류 및 누락 알림 ${issues.length}건` : "오류 및 누락 없음"}
              aria-expanded={collapsedIssueOpen}
              aria-haspopup="dialog"
            >
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              {issues.length > 0 && (
                <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-rose-600 px-1 text-[10px] leading-4 text-white">
                  {issues.length > 99 ? "99+" : issues.length}
                </span>
              )}
            </button>

            {collapsedIssueOpen && issues.length > 0 && (
              <div
                className="absolute bottom-full left-0 z-[80] mb-2 w-[280px]"
                role="dialog"
                aria-label="오류 및 누락 상세"
              >
                <div className="rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden">
                  <div className="px-3 py-2 border-b border-slate-200 bg-slate-50">
                    <div className="text-xs font-semibold text-slate-700">오류/누락 목록</div>
                    <div className="text-[11px] text-slate-500">클릭하면 해당 위치로 이동합니다</div>
                  </div>
                  <ul className="max-h-60 overflow-y-auto py-1">
                    {issues.map((it, idx) => (
                      <li key={`${it.blockId}-${idx}`}>
                        <button
                          type="button"
                          className={cn(
                            "w-full px-3 py-2 text-left text-xs hover:bg-slate-100 transition-colors",
                            it.kind === "error" ? "text-rose-700" : "text-rose-700"
                          )}
                          onClick={() => {
                            applyIssueFocus(it);
                            navigateToBlock(it.blockId, { preserveIssueFocus: true });
                            setCollapsedIssueOpen(false);
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="font-medium">{it.title}</div>
                            <div className="shrink-0 text-[10px] uppercase opacity-70">
                              {it.kind}
                            </div>
                          </div>
                          {it.detail && <div className="mt-0.5 text-[11px] text-slate-500">{it.detail}</div>}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
