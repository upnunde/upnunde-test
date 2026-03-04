 "use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { Menu } from "lucide-react";
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

  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingNavTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const startEdit = (e: React.MouseEvent, block: { id: string; content?: string }) => {
    e.preventDefault();
    e.stopPropagation();
    clearPendingNav(); // 더블클릭이면 예약된 씬 이동 취소
    setEditingBlockId(block.id);
    setEditValue(block.content?.trim() ?? "");
  };

  // 언마운트 시 예약된 타이머 정리
  useEffect(() => () => clearPendingNav(), []);

  // 씬 블록들만 필터링하고 인덱스 정보 포함
  const scenes = useMemo(() => {
    return blocks
      .map((block, index) => ({ block, index }))
      .filter(({ block }) => block.type === "scene");
  }, [blocks]);

  const commitEdit = (blockId: string, currentContent: string) => {
    const trimmed = editValue.trim();
    if (trimmed) {
      updateBlock(blockId, trimmed);
    }
    setEditingBlockId(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingBlockId(null);
    setEditValue("");
  };

  return (
    <div className="flex h-full flex-col">
      <nav
        className={cn(
          "flex-1 overflow-y-auto pt-2",
          collapsed ? "px-0" : "px-2"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2 py-2",
            collapsed ? "justify-center" : "justify-between px-1"
          )}
        >
          {!collapsed && (
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              씬 목록
            </h2>
          )}
          <button
            type="button"
            onClick={onToggleCollapsed}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label={collapsed ? "씬 목록 펼치기" : "씬 목록 최소화"}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {!collapsed &&
          (scenes.length === 0 ? (
            <div className="px-3 py-2 text-sm text-slate-400 text-center">
              씬이 없습니다
            </div>
          ) : (
            <ul className="space-y-1 px-1">
              {scenes.map(({ block, index }) => {
                const sceneNumber = blocks.slice(0, index).filter((b) => b.type === "scene").length + 1;
                const isActive = focusBlockId === block.id;
                const sceneTitle = block.content?.trim() || `씬 ${sceneNumber}`;
                const isEditing = editingBlockId === block.id;

                const rowContent = (
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs text-slate-400 font-mono tabular-nums shrink-0">
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
                        aria-label="씬 제목 편집"
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
    </div>
  );
}
