"use client";

import { useCallback } from "react";
import { useIsLgUp } from "@/hooks/useMediaQuery";
import { useEditorStore } from "@/store/useEditorStore";
import { scrollEditorBlockIntoView } from "@/lib/editor-scroll";

/** 장면·탭 클릭 시 앵커 스크롤 + (데스크톱) 포커스 이동 */
export function useSceneClickHandler() {
  const isDesktop = useIsLgUp();
  const setFocusBlockId = useEditorStore((s) => s.setFocusBlockId);
  const setMobileContentEditPromptBlockId = useEditorStore(
    (s) => s.setMobileContentEditPromptBlockId,
  );

  return useCallback(
    (blockId: string) => {
      setFocusBlockId(blockId);
      setMobileContentEditPromptBlockId(null);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = scrollEditorBlockIntoView(blockId);
          if (!el || !isDesktop) return;

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
    [isDesktop, setFocusBlockId, setMobileContentEditPromptBlockId],
  );
}
