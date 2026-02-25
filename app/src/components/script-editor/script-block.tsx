"use client";

import {
  useCallback,
  useEffect,
  useRef,
  KeyboardEvent,
  FocusEvent,
} from "react";
import type { ScriptBlock, BlockType } from "@/types/editor";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const BLOCK_TYPE_STYLES: Record<
  BlockType,
  { label: string; className: string }
> = {
  scene: {
    label: "씬",
    className:
      "border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20",
  },
  text: {
    label: "본문",
    className:
      "border-l-4 border-l-neutral-400 bg-neutral-50/50 dark:bg-neutral-900/30",
  },
  background: {
    label: "배경",
    className:
      "border-l-4 border-l-blue-500 bg-blue-50/30 dark:bg-blue-950/20",
  },
  character: {
    label: "캐릭터",
    className:
      "border-l-4 border-l-green-500 bg-green-50/30 dark:bg-green-950/20",
  },
  bgm: {
    label: "BGM",
    className:
      "border-l-4 border-l-purple-500 bg-purple-50/30 dark:bg-purple-950/20",
  },
  sfx: {
    label: "효과음",
    className:
      "border-l-4 border-l-orange-500 bg-orange-50/30 dark:bg-orange-950/20",
  },
  gallery: {
    label: "갤러리",
    className:
      "border-l-4 border-l-primary bg-primary/10 dark:bg-primary/20",
  },
  direction: {
    label: "Direction",
    className:
      "border-l-4 border-l-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20",
  },
  choice: {
    label: "선택지",
    className:
      "border-l-4 border-l-cyan-500 bg-cyan-50/30 dark:bg-cyan-950/20",
  },
};

const ALL_BLOCK_TYPES: BlockType[] = [
  "scene",
  "text",
  "background",
  "character",
  "bgm",
  "sfx",
  "gallery",
];

interface ScriptBlockProps {
  block: ScriptBlock;
  isFirst: boolean;
  onContentChange: (id: string, content: string) => void;
  onTypeChange: (id: string, type: BlockType) => void;
  onSplit: (id: string, cursorOffset: number) => void;
  onMerge: (id: string) => void;
  onFocusPrevious: () => void;
  onFocusNext: () => void;
}

export function ScriptBlock({
  block,
  isFirst,
  onContentChange,
  onTypeChange,
  onSplit,
  onMerge,
  onFocusPrevious,
  onFocusNext,
}: ScriptBlockProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const isInternalUpdate = useRef(false);

  const style = BLOCK_TYPE_STYLES[block.type];

  const syncFromProps = useCallback(
    (content: string) => {
      if (!contentRef.current) return;
      isInternalUpdate.current = true;
      contentRef.current.textContent = content;
    },
    []
  );

  useEffect(() => {
    if (!contentRef.current || isInternalUpdate.current) return;
    const current = contentRef.current.textContent ?? "";
    if (current !== block.content) {
      syncFromProps(block.content);
    }
  }, [block.id, block.content, syncFromProps]);

  const handleInput = useCallback(() => {
    if (!contentRef.current || isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    const text = contentRef.current.textContent ?? "";
    onContentChange(block.id, text);
  }, [block.id, onContentChange]);

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLDivElement>) => {
      const text = contentRef.current?.textContent ?? "";
      if (text !== block.content) {
        onContentChange(block.id, text);
      }
    },
    [block.id, block.content, onContentChange]
  );

  const getCaretOffset = useCallback((): number => {
    const sel = window.getSelection();
    if (!sel || !contentRef.current) return 0;
    const range = sel.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(contentRef.current);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    return preCaretRange.toString().length;
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (block.type !== "text" && block.type !== "scene") return;
      if (e.key === "Enter") {
        e.preventDefault();
        const offset = getCaretOffset();
        onSplit(block.id, offset);
        return;
      }
      if (e.key === "Backspace") {
        const offset = getCaretOffset();
        if (offset === 0 && !isFirst) {
          e.preventDefault();
          onMerge(block.id);
        }
        return;
      }
      if (e.key === "ArrowUp" && getCaretOffset() === 0) {
        e.preventDefault();
        onFocusPrevious();
      }
      if (e.key === "ArrowDown") {
        const len = (contentRef.current?.textContent ?? "").length;
        if (getCaretOffset() === len) {
          e.preventDefault();
          onFocusNext();
        }
      }
    },
    [
      block.id,
      block.type,
      isFirst,
      getCaretOffset,
      onSplit,
      onMerge,
      onFocusPrevious,
      onFocusNext,
    ]
  );

  const isEditable = block.type === "text" || block.type === "scene";

  return (
    <div
      className={cn(
        "group flex min-h-[2.5rem] w-full rounded-r-md px-3 py-2",
        style.className
      )}
    >
      <div className="flex w-full items-start gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="shrink-0 pt-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              {style.label}
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-40 p-2 max-h-60 overflow-y-auto">
            <div className="flex flex-col gap-0.5">
              {ALL_BLOCK_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onTypeChange(block.id, t)}
                  className={cn(
                    "rounded px-2 py-1.5 text-left text-sm",
                    block.type === t
                      ? "bg-accent font-medium"
                      : "hover:bg-accent/50"
                  )}
                >
                  {BLOCK_TYPE_STYLES[t].label}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <div className="min-w-0 flex-1">
          {isEditable ? (
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              className="min-h-[1.5rem] outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground"
              data-placeholder="블록 입력..."
              onInput={handleInput}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <input
              type="text"
              value={block.content}
              onChange={(e) => onContentChange(block.id, e.target.value)}
              placeholder={block.content === "none" ? "해제" : "값 입력"}
              className="min-h-[1.5rem] w-full bg-transparent outline-none text-sm"
            />
          )}
        </div>
      </div>
    </div>
  );
}
