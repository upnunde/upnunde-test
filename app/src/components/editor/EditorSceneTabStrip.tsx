"use client";

import { useMemo, useEffect, useState, useCallback, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, X } from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { useEditorScrollActiveSceneId } from "@/hooks/useEditorScrollActiveSceneId";
import { FilterChip } from "@/components/ui/chip";
import { EDITOR_SCENE_TAB_STRIP_ID, resolveEditorActiveSceneId } from "@/lib/editor-scroll";
import { HORIZONTAL_SCROLLBAR_HIDE_CLASS } from "@/lib/tab-styles";
import { cn } from "@/lib/utils";

export interface EditorSceneTabStripProps {
  onSceneClick: (blockId: string) => void;
  className?: string;
}

/** 모바일 편집 — SubHeader 아래 가로 장면 탭 + 펼침 목록 */
export function EditorSceneTabStrip({
  onSceneClick,
  className,
}: EditorSceneTabStripProps) {
  const blocks = useEditorStore((s) => s.blocks);
  const focusBlockId = useEditorStore((s) => s.focusBlockId);
  const [isListExpanded, setIsListExpanded] = useState(false);
  const [listAnchorTop, setListAnchorTop] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);

  const updateListAnchor = useCallback(() => {
    const strip = stripRef.current;
    if (!strip) return;
    // 펼침 패널이 탭 strip 자리까지 덮도록 strip 상단을 기준으로 한다
    setListAnchorTop(strip.getBoundingClientRect().top);
  }, []);

  useLayoutEffect(() => {
    if (!isListExpanded) return;
    updateListAnchor();

    window.addEventListener("resize", updateListAnchor);
    window.visualViewport?.addEventListener("resize", updateListAnchor);
    window.visualViewport?.addEventListener("scroll", updateListAnchor);

    return () => {
      window.removeEventListener("resize", updateListAnchor);
      window.visualViewport?.removeEventListener("resize", updateListAnchor);
      window.visualViewport?.removeEventListener("scroll", updateListAnchor);
    };
  }, [isListExpanded, updateListAnchor]);

  useEffect(() => {
    if (!isListExpanded) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsListExpanded(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isListExpanded]);

  const scenes = useMemo(
    () =>
      blocks
        .map((block, index) => ({ block, index }))
        .filter(({ block }) => block.type === "scene"),
    [blocks],
  );

  const sceneIds = useMemo(() => scenes.map(({ block }) => block.id), [scenes]);

  const scrollActiveSceneId = useEditorScrollActiveSceneId(sceneIds);
  const activeSceneId = useMemo(
    () => resolveEditorActiveSceneId(blocks, focusBlockId, sceneIds, scrollActiveSceneId),
    [blocks, focusBlockId, sceneIds, scrollActiveSceneId],
  );

  useEffect(() => {
    if (!activeSceneId || isListExpanded) return;
    document.getElementById(`editor-scene-tab-${activeSceneId}`)?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeSceneId, isListExpanded]);

  const handleSceneSelect = useCallback(
    (blockId: string) => {
      onSceneClick(blockId);
      setIsListExpanded(false);
    },
    [onSceneClick],
  );

  if (scenes.length === 0) {
    return (
      <div
        id={EDITOR_SCENE_TAB_STRIP_ID}
        className={cn(
          "relative z-20 w-full shrink-0 bg-white py-my-8",
          className,
        )}
      />
    );
  }

  return (
    <div
      ref={stripRef}
      id={EDITOR_SCENE_TAB_STRIP_ID}
      className={cn("relative z-20 w-full shrink-0 bg-white", className)}
    >
      <div className="flex items-center gap-my-8 py-my-8">
        <div
          className={cn(
            "flex min-w-0 flex-1 items-center gap-my-8 overflow-x-auto overscroll-x-contain",
            HORIZONTAL_SCROLLBAR_HIDE_CLASS,
          )}
          role="tablist"
          aria-label="장면"
        >
          {scenes.map(({ block, index }) => {
            const sceneNumber =
              blocks.slice(0, index).filter((b) => b.type === "scene").length + 1;
            const label = `장면${String(sceneNumber).padStart(2, "0")}`;
            const isActive = activeSceneId === block.id;
            const sceneTitle = block.content?.trim();
            const ariaLabel = sceneTitle ? `${label} ${sceneTitle}` : label;

            return (
              <FilterChip
                key={block.id}
                id={`editor-scene-tab-${block.id}`}
                role="tab"
                aria-selected={isActive}
                aria-label={ariaLabel}
                selected={isActive}
                chipSize="m"
                className="shrink-0"
                onClick={() => handleSceneSelect(block.id)}
              >
                {label}
              </FilterChip>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setIsListExpanded((open) => !open)}
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border-10 text-on-surface-30 transition-colors hover:bg-surface-20 hover:text-on-surface-20"
          aria-label={isListExpanded ? "장면 목록 접기" : "장면 목록 펼치기"}
          aria-expanded={isListExpanded}
          aria-controls="editor-scene-list-panel"
        >
          <ChevronDown
            className={cn("h-4 w-4 transition-transform duration-200", isListExpanded && "rotate-180")}
            aria-hidden
          />
        </button>
      </div>

      {isListExpanded && typeof document !== "undefined"
        ? createPortal(
            <>
              {/* 딤드 없이 바깥 탭으로만 닫히도록 투명 레이어 유지 */}
              <div
                className="fixed inset-0 z-40"
                aria-hidden
                onClick={() => setIsListExpanded(false)}
              />
              <div
                id="editor-scene-list-panel"
                className="fixed inset-x-0 z-50 flex max-h-[min(48vh,360px)] min-h-0 flex-col border-b border-border-10 bg-white shadow-elevation-20"
                style={{ top: listAnchorTop }}
                role="dialog"
                aria-modal="true"
                aria-label="장면 목록"
              >
                <div className="flex shrink-0 items-center justify-end px-my-12 py-my-8">
                  <button
                    type="button"
                    aria-label="장면 목록 닫기"
                    onClick={() => setIsListExpanded(false)}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-on-surface-30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary lg:hover:bg-surface-20/60 lg:hover:text-on-surface-10"
                  >
                    <X className="h-5 w-5" aria-hidden />
                  </button>
                </div>
                <ul className="flex min-h-0 flex-col overflow-y-auto overscroll-contain pb-my-8">
                  {scenes.map(({ block, index }) => {
                    const sceneNumber =
                      blocks.slice(0, index).filter((b) => b.type === "scene").length + 1;
                    const label = `장면${String(sceneNumber).padStart(2, "0")}`;
                    const sceneTitle = block.content?.trim();
                    const isActive = activeSceneId === block.id;

                    return (
                      <li key={block.id}>
                        <button
                          type="button"
                          onClick={() => handleSceneSelect(block.id)}
                          className={cn(
                            "flex w-full cursor-pointer items-center gap-my-12 px-my-12 py-my-12 text-left transition-colors focus:bg-surface-20 lg:hover:bg-surface-20",
                            isActive && "bg-surface-20",
                          )}
                        >
                          <span
                            className={cn(
                              "shrink-0 tabular-nums text-body3_500",
                              isActive ? "text-primary" : "text-on-surface-20",
                            )}
                          >
                            {label}
                          </span>
                          {sceneTitle ? (
                            <span className="min-w-0 truncate text-body3_400 text-on-surface-30">
                              {sceneTitle}
                            </span>
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </>,
            document.body,
          )
        : null}
    </div>
  );
}
