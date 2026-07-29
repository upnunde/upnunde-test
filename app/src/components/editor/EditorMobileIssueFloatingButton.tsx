"use client";

import { useCallback, useState } from "react";
import { ICONS } from "@/lib/icons";
import { EditorBottomSheetMenu } from "@/components/editor/EditorBottomSheetMenu";
import { EDITOR_MOBILE_FAB_SIZE_CLASS } from "@/components/editor/editor-mobile-floating-layout";
import { Badge } from "design-system/ui/badge";
import { useEditorIssues, getIssueFocusTarget } from "@/hooks/useEditorIssues";
import { useEditorStore } from "@/store/useEditorStore";
import { scrollEditorBlockIntoView } from "@/lib/editor-scroll";
import { cn } from "design-system/utils";

/**
 * 모바일 편집 — 오류/누락이 있을 때만 본문 우측 하단에 노출되는 플로팅 버튼.
 * 탭 시 바텀 시트로 목록을 열고, 항목 선택 시 해당 블록으로 이동한다.
 * (데스크톱 SceneNavigation 하단 오류/누락 알림의 모바일 대응)
 */
export function EditorMobileIssueFloatingButton({ className }: { className?: string }) {
  const issues = useEditorIssues();
  const setFocusBlockId = useEditorStore((s) => s.setFocusBlockId);
  const setIssueFocus = useEditorStore((s) => s.setIssueFocus);
  const [open, setOpen] = useState(false);

  const handleIssueClick = useCallback(
    (issue: ReturnType<typeof useEditorIssues>[number]) => {
      setIssueFocus(getIssueFocusTarget(issue));
      setFocusBlockId(issue.blockId);
      setOpen(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollEditorBlockIntoView(issue.blockId, { align: "center" });
        });
      });
    },
    [setFocusBlockId, setIssueFocus],
  );

  if (issues.length === 0) return null;

  return (
    <EditorBottomSheetMenu
      open={open}
      onOpenChange={setOpen}
      title={`오류/누락 ${issues.length}건`}
      trigger={
        <button
          type="button"
          className={cn(
            EDITOR_MOBILE_FAB_SIZE_CLASS,
            "relative flex cursor-pointer items-center justify-center rounded-full border border-destructive/40 bg-destructive-container text-destructive shadow-elevation-20 transition-colors active:bg-destructive-container",
            className,
          )}
          aria-label={`오류 및 누락 알림 ${issues.length}건`}
        >
          <ICONS.warning className="h-5 w-5" aria-hidden />
          <Badge
            variant="default"
            status="destructive"
            className="absolute -right-1 -top-1 min-w-5 px-1 py-0.5 text-caption2_400 leading-none"
          >
            {issues.length > 99 ? "99+" : issues.length}
          </Badge>
        </button>
      }
    >
      {() => (
        <div>
          <p className="px-2 pb-2 text-caption1_400 text-foreground-placeholder">
            항목을 선택하면 해당 위치로 이동합니다
          </p>
          <ul className="flex flex-col">
            {issues.map((issue, idx) => (
              <li key={`${issue.blockId}-${idx}`}>
                <button
                  type="button"
                  onClick={() => handleIssueClick(issue)}
                  className="flex w-full cursor-pointer flex-col gap-0.5 rounded-md px-3 py-3 text-left transition-colors focus:bg-muted active:bg-muted"
                >
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-body3_500 text-destructive">{issue.title}</span>
                    <span className="shrink-0 text-caption2_400 uppercase text-foreground-placeholder">
                      {issue.kind}
                    </span>
                  </span>
                  {issue.detail ? (
                    <span className="text-caption1_400 text-foreground-placeholder">{issue.detail}</span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </EditorBottomSheetMenu>
  );
}
