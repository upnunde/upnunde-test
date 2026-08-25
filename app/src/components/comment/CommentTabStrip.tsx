"use client";

import { LineTabStrip } from "@/components/ui/line-tab-strip";
import type { CommentManagementTab } from "@/types/comment";

const TAB_ITEMS = [
  { id: "all" as const, label: "전체 댓글" },
  { id: "pick" as const, label: "PICK" },
  { id: "restricted" as const, label: "작성 제한" },
] as const;

export function CommentTabStrip({
  activeTab,
  onTabChange,
}: {
  activeTab: CommentManagementTab;
  onTabChange: (tab: CommentManagementTab) => void;
}) {
  return (
    <LineTabStrip
      aria-label="댓글관리 필터"
      items={TAB_ITEMS}
      activeId={activeTab}
      onSelect={(id) => onTabChange(id as CommentManagementTab)}
      size="l"
    />
  );
}
