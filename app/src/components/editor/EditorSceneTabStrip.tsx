"use client";

import { useMemo, useEffect, useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { FilterChip } from "@/components/ui/chip";
import { EDITOR_SCENE_TAB_STRIP_ID } from "@/lib/editor-scroll";
import { cn } from "@/lib/utils";

export interface EditorSceneTabStripProps {
  onSceneClick: (blockId: string) => void;
  className?: string;
}

function getActiveSceneBlockId(
  blocks: { id: string; type: string }[],
  focusBlockId: string | null,
  sceneIds: string[],
): string | null {
  if (sceneIds.length === 0) return null;
  if (!focusBlockId) return sceneIds[0] ?? null;

  const focusIndex = blocks.findIndex((b) => b.id === focusBlockId);
  if (focusIndex === -1) return sceneIds[0] ?? null;

  for (let i = focusIndex; i >= 0; i--) {
    if (blocks[i]?.type === "scene") return blocks[i].id;
  }
  return sceneIds[0] ?? null;
}

/** 모바일 편집 — SubHeader 아래 가로 장면 탭 + 펼침 목록 */
export function EditorSceneTabStrip({
  onSceneClick,
  className,
}: EditorSceneTabStripProps) {
  const blocks = useEditorStore((s) => s.blocks);
  const focusBlockId = useEditorStore((s) => s.focusBlockId);
  const [isListExpanded, setIsListExpanded] = useState(false);

  const scenes = useMemo(
    () =>
      blocks
        .map((block, index) => ({ block, index }))
        .filter(({ block }) => block.type === "scene"),
    [blocks],
  );

  const sceneIds = useMemo(() => scenes.map(({ block }) => block.id), [scenes]);

  const activeSceneId = useMemo(
    () => getActiveSceneBlockId(blocks, focusBlockId, sceneIds),
    [blocks, focusBlockId, sceneIds],
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
      id={EDITOR_SCENE_TAB_STRIP_ID}
      className={cn("relative z-20 w-full shrink-0 bg-white", className)}
    >
      <div className="flex items-center gap-my-8 py-my-8">
        <div
          className="flex min-w-0 flex-1 items-center gap-my-8 overflow-x-auto overscroll-x-contain"
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

      {isListExpanded ? (
        <div
          id="editor-scene-list-panel"
          className="max-h-[min(40vh,280px)] overflow-y-auto border-t border-border-10 py-my-4"
        >
          <ul className="flex flex-col">
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
                      "flex w-full cursor-pointer items-center gap-my-12 px-my-16 py-my-12 text-left transition-colors hover:bg-surface-20",
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
      ) : null}
    </div>
  );
}
