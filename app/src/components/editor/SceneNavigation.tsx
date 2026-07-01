"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { ICONS } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useEditorStore } from "@/store/useEditorStore";
import {
  useEditorIssues,
  getIssueFocusTarget,
  type EditorIssue,
} from "@/hooks/useEditorIssues";
import { useEditorScrollActiveSceneId } from "@/hooks/useEditorScrollActiveSceneId";
import { resolveEditorActiveSceneId } from "@/lib/editor-scroll";
import { cn } from "design-system/utils";

interface SceneNavigationProps {
  onSceneClick?: (blockId: string) => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  showIssues?: boolean;
}

export function SceneNavigation({
  onSceneClick,
  collapsed = false,
  onToggleCollapsed,
  showIssues = true,
}: SceneNavigationProps) {
  const blocks = useEditorStore((s) => s.blocks);
  const focusBlockId = useEditorStore((s) => s.focusBlockId);
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const setFocusBlockId = useEditorStore((s) => s.setFocusBlockId);
  const setIssueFocus = useEditorStore((s) => s.setIssueFocus);
  const clearIssueFocus = useEditorStore((s) => s.clearIssueFocus);

  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [collapsedIssueOpenRaw, setCollapsedIssueOpen] = useState(false);
  /** 사이드바가 펼쳐진 상태에서는 알림 패널 자체가 표시되지 않으므로 강제로 닫힌 것으로 간주 */
  const collapsedIssueOpen = collapsed && collapsedIssueOpenRaw;
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

  const sceneIds = useMemo(() => scenes.map(({ block }) => block.id), [scenes]);
  const scrollActiveSceneId = useEditorScrollActiveSceneId(sceneIds);
  const activeSceneId = useMemo(
    () => resolveEditorActiveSceneId(blocks, focusBlockId, sceneIds, scrollActiveSceneId),
    [blocks, focusBlockId, sceneIds, scrollActiveSceneId],
  );

  const issues = useEditorIssues();

  const commitEdit = (blockId: string, _currentContent: string) => {
    const trimmed = editValue.trim();
    if (trimmed) {
      updateBlock(blockId, trimmed);
    }
    setEditingBlockId(null);
    setEditValue("");
  };

  const applyIssueFocus = (issue: EditorIssue) => {
    setIssueFocus(getIssueFocusTarget(issue));
  };

  const cancelEdit = () => {
    setEditingBlockId(null);
    setEditValue("");
  };

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
            "flex items-center gap-2 py-2",
            collapsed ? "justify-center" : "justify-between pl-3 pr-2"
          )}
        >
          {!collapsed && (
            <h2 className="text-body3_500 text-foreground flex items-center gap-2">
              장면 목록
            </h2>
          )}
          {onToggleCollapsed ? (
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              onClick={onToggleCollapsed}
              className="shrink-0 rounded-full shadow-none text-foreground-placeholder disabled:border-border"
              aria-label={collapsed ? "장면 목록 펼치기" : "장면 목록 최소화"}
            >
              <ICONS.menu aria-hidden="true" />
            </Button>
          ) : null}
        </div>

        {!collapsed &&
          (scenes.length === 0 ? (
            <div className="px-3 py-2 text-body3_400 text-foreground-placeholder text-center">
              장면이 없습니다
            </div>
          ) : (
            <ul className="space-y-1 px-1">
              {scenes.map(({ block, index }) => {
                const sceneNumber = blocks.slice(0, index).filter((b) => b.type === "scene").length + 1;
                const isActive = activeSceneId === block.id;
                const sceneTitle = block.content?.trim() || `장면 ${sceneNumber}`;
                const isEditing = editingBlockId === block.id;

                const rowContent = (
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-caption1_400 text-foreground-placeholder font-mono tabular-nums shrink-0">
                      {String(sceneNumber).padStart(2, "0")}
                    </span>
                    {isEditing ? (
                      <Input
                        ref={inputRef}
                        type="text"
                        size="sm"
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
                        className="min-w-0 flex-1"
                        aria-label="장면 제목 편집"
                      />
                    ) : (
                      <span
                        className="truncate text-body3_500 flex-1 min-w-0"
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
                          "w-full px-3 py-2 rounded-md text-body3_400",
                          "bg-background ring-1 ring-border ring-inset"
                        )}
                      >
                        {rowContent}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSceneClick(block.id)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md text-body3_400 transition-colors",
                          "hover:bg-muted",
                          isActive && "font-medium text-foreground",
                          !isActive && "text-foreground-placeholder"
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

      {/* 읽기 전용 화면 등에서 오류 패널을 숨길 때도 레이아웃 높이는 유지 */}
      {!showIssues && !collapsed && <div className="mt-auto h-[46px]" aria-hidden />}

      {/* 최하단: 오류/누락 알림 박스 (hover 시 상세 리스트 노출, 클릭 시 해당 위치로 이동) */}
      {showIssues && !collapsed && (
        <div className="mt-auto px-2 pb-2">
          <div className="relative group">
            <button
              type="button"
              className={cn(
                "w-full rounded-lg border px-3 py-2 text-left transition-colors",
                issues.length > 0
                  ? "border-destructive/40 bg-destructive-container text-destructive hover:bg-destructive-container"
                  : "border-border bg-muted text-foreground-placeholder hover:bg-muted"
              )}
              aria-label="오류 및 누락 알림"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-body3_500">
                  {issues.length > 0 ? "오류/누락 있음" : "오류/누락 없음"}
                </div>
                <div className="text-caption1_400 tabular-nums">
                  {issues.length}건
                </div>
              </div>
            </button>

            {/* Hover list */}
            {issues.length > 0 && (
              <div
                className="absolute left-0 right-0 bottom-full mb-0 hidden group-hover:block z-sticky"
                role="dialog"
                aria-label="오류 및 누락 상세"
              >
                <div className="rounded-lg border border-border bg-background shadow-elevation-40 overflow-hidden">
                  <div className="px-3 py-2 border-b border-border bg-muted">
                    <div className="text-caption1_500 text-foreground-muted">오류/누락 목록</div>
                    <div className="text-caption2_400 text-foreground-placeholder">클릭하면 해당 위치로 이동합니다</div>
                  </div>
                  <ul className="max-h-60 overflow-y-auto py-1">
                    {issues.map((it, idx) => (
                      <li key={`${it.blockId}-${idx}`}>
                        <button
                          type="button"
                          className={cn(
                            "w-full px-3 py-2 text-left text-caption1_400 hover:bg-muted transition-colors",
                            it.kind === "error" ? "text-destructive" : "text-destructive"
                          )}
                          onClick={() => {
                            applyIssueFocus(it);
                            navigateToBlock(it.blockId, { preserveIssueFocus: true });
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="font-medium">{it.title}</div>
                            <div className="shrink-0 text-caption2_400 uppercase opacity-70">
                              {it.kind}
                            </div>
                          </div>
                          {it.detail && <div className="mt-0.5 text-caption2_400 text-foreground-placeholder">{it.detail}</div>}
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
      {!showIssues && collapsed && <div className="mt-auto h-[42px]" aria-hidden />}

      {showIssues && collapsed && (
        <div className="mt-auto pb-2">
          <div ref={collapsedIssueWrapRef} className="relative">
            <button
              type="button"
              onClick={() => setCollapsedIssueOpen((prev) => !prev)}
              className={cn(
                "relative mx-auto flex h-9 w-9 items-center justify-center rounded-lg border transition-colors",
                issues.length > 0
                  ? "border-destructive/40 bg-destructive-container text-destructive hover:bg-destructive-container"
                  : "border-border bg-muted text-foreground-placeholder hover:bg-muted"
              )}
              aria-label={issues.length > 0 ? `오류 및 누락 알림 ${issues.length}건` : "오류 및 누락 없음"}
              aria-expanded={collapsedIssueOpen}
              aria-haspopup="dialog"
            >
              <ICONS.warning className="h-4 w-4" aria-hidden="true" />
              {issues.length > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 min-w-4 px-1 py-0 text-caption2_400"
                >
                  {issues.length > 99 ? "99+" : issues.length}
                </Badge>
              )}
            </button>

            {collapsedIssueOpen && issues.length > 0 && (
              <div
                className="absolute bottom-full left-0 z-toast mb-2 w-[280px]"
                role="dialog"
                aria-label="오류 및 누락 상세"
              >
                <div className="rounded-lg border border-border bg-background shadow-elevation-40 overflow-hidden">
                  <div className="px-3 py-2 border-b border-border bg-muted">
                    <div className="text-caption1_500 text-foreground-muted">오류/누락 목록</div>
                    <div className="text-caption2_400 text-foreground-placeholder">클릭하면 해당 위치로 이동합니다</div>
                  </div>
                  <ul className="max-h-60 overflow-y-auto py-1">
                    {issues.map((it, idx) => (
                      <li key={`${it.blockId}-${idx}`}>
                        <button
                          type="button"
                          className={cn(
                            "w-full px-3 py-2 text-left text-caption1_400 hover:bg-muted transition-colors",
                            it.kind === "error" ? "text-destructive" : "text-destructive"
                          )}
                          onClick={() => {
                            applyIssueFocus(it);
                            navigateToBlock(it.blockId, { preserveIssueFocus: true });
                            setCollapsedIssueOpen(false);
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="font-medium">{it.title}</div>
                            <div className="shrink-0 text-caption2_400 uppercase opacity-70">
                              {it.kind}
                            </div>
                          </div>
                          {it.detail && <div className="mt-0.5 text-caption2_400 text-foreground-placeholder">{it.detail}</div>}
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
