"use client";

import { useCallback } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { scrollEditorBlockIntoView } from "@/lib/editor-scroll";

/** Returns a handler to scroll to and focus a block when a scene is clicked in the sidebar. */
export function useSceneClickHandler() {
  const setFocusBlockId = useEditorStore((s) => s.setFocusBlockId);

  return useCallback(
    (blockId: string) => {
      setFocusBlockId(blockId);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = scrollEditorBlockIntoView(blockId);
          if (!el) return;

          const textarea = el.querySelector("textarea");
          const input = el.querySelector("input");
          const pickerButton = el.querySelector(
            "button[type='button']:not([aria-label='Delete block']):not([aria-label='Drag to reorder']):not([aria-label='Add block below'])",
          );
          const rootDivs = Array.from(el.querySelectorAll<HTMLElement>("div[tabindex='0']"));
          const rootDiv =
            rootDivs.find(
              (div) =>
                div !== el &&
                !div.querySelector("textarea, input") &&
                div.classList.contains("group"),
            ) ?? rootDivs[0];

          const focusable = textarea ?? input ?? pickerButton ?? rootDiv;

          if (focusable && typeof (focusable as HTMLElement).focus === "function") {
            (focusable as HTMLElement).focus();
            if (textarea && textarea instanceof HTMLTextAreaElement) {
              const len = textarea.value.length;
              textarea.setSelectionRange(len, len);
            }
            if (input && input instanceof HTMLInputElement) {
              const len = input.value.length;
              input.setSelectionRange(len, len);
            }
            setTimeout(() => {
              focusable.dispatchEvent(
                new FocusEvent("focus", { bubbles: true, cancelable: true }),
              );
            }, 0);
          }
        });
      });
    },
    [setFocusBlockId],
  );
}
