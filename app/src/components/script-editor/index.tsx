"use client";

import { useCallback, useRef, useState } from "react";
import type { ScriptBlock } from "@/types/editor";
import { createBlock } from "@/store/useEditorStore";
import { ScriptBlock as ScriptBlockComponent } from "./script-block";

export function ScriptEditor() {
  const [blocks, setBlocks] = useState<ScriptBlock[]>(() => [
    createBlock("text", ""),
  ]);
  const blockRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const focusBlockId = useRef<string | null>(null);

  const focusBlock = useCallback((id: string) => {
    const el = blockRefs.current.get(id);
    el?.querySelector<HTMLElement>("[contenteditable]")?.focus();
    focusBlockId.current = id;
  }, []);

  const updateBlock = useCallback(
    (id: string, updater: (b: ScriptBlock) => Partial<ScriptBlock>) => {
      setBlocks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...updater(b) } : b))
      );
    },
    []
  );

  const onContentChange = useCallback((id: string, content: string) => {
    updateBlock(id, () => ({ content }));
  }, [updateBlock]);

  const onSplit = useCallback(
    (id: string, cursorOffset: number) => {
      const block = blocks.find((b) => b.id === id);
      if (!block) return;

      const before = block.content.slice(0, cursorOffset);
      const after = block.content.slice(cursorOffset);

      const newBlock = createBlock(block.type, after);

      setBlocks((prev) => {
        const idx = prev.findIndex((b) => b.id === id);
        const next = [...prev];
        next[idx] = { ...block, content: before };
        next.splice(idx + 1, 0, newBlock);
        return next;
      });

      requestAnimationFrame(() => focusBlock(newBlock.id));
    },
    [blocks, focusBlock]
  );

  const onMerge = useCallback(
    (id: string) => {
      const idx = blocks.findIndex((b) => b.id === id);
      if (idx <= 0) return;

      const prevBlock = blocks[idx - 1];
      const currBlock = blocks[idx];
      const mergedContent =
        prevBlock.content +
        (currBlock.content ? "\n" + currBlock.content : currBlock.content);

      setBlocks((prev) => {
        const next = [...prev];
        next[idx - 1] = { ...prevBlock, content: mergedContent };
        next.splice(idx, 1);
        return next;
      });

      requestAnimationFrame(() => focusBlock(prevBlock.id));
    },
    [blocks, focusBlock]
  );

  const onTypeChange = useCallback(
    (id: string, type: ScriptBlock["type"]) => {
      updateBlock(id, () => ({ type }));
    },
    [updateBlock]
  );

  const onFocusPrevious = useCallback(() => {
    const idx = blocks.findIndex((b) => b.id === focusBlockId.current);
    if (idx > 0) focusBlock(blocks[idx - 1].id);
  }, [blocks, focusBlock]);

  const onFocusNext = useCallback(() => {
    const idx = blocks.findIndex((b) => b.id === focusBlockId.current);
    if (idx >= 0 && idx < blocks.length - 1) focusBlock(blocks[idx + 1].id);
  }, [blocks, focusBlock]);

  return (
    <div className="flex w-full max-w-4xl flex-col gap-1 rounded-lg border bg-background p-4">
      {blocks.map((block, i) => (
        <div
          key={block.id}
          ref={(el) => {
            blockRefs.current.set(block.id, el);
          }}
          data-block-id={block.id}
        >
          <ScriptBlockComponent
            block={block}
            isFirst={i === 0}
            onContentChange={onContentChange}
            onTypeChange={onTypeChange}
            onSplit={onSplit}
            onMerge={onMerge}
            onFocusPrevious={onFocusPrevious}
            onFocusNext={onFocusNext}
          />
        </div>
      ))}
    </div>
  );
}
