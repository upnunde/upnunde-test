"use client";

import type { ProfileSettingsTabId } from "@/types/profile";
import { SegmentedTextTabs } from "@/components/ui/segmented-text-tabs";
import { LINE_TAB_STRIP_SHELL_CLASS, lineTabStripListClassName } from "@/lib/tab-styles";
import { cn } from "design-system/utils";

const TABS: { id: ProfileSettingsTabId; label: string }[] = [
  { id: "profile", label: "프로필" },
  { id: "settlement", label: "정산 정보" },
  { id: "account", label: "계정" },
];

export function ProfileSettingsTabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: ProfileSettingsTabId;
  onTabChange: (tab: ProfileSettingsTabId) => void;
}) {
  return (
    <div className={cn(LINE_TAB_STRIP_SHELL_CLASS, "pt-2")}>
      <SegmentedTextTabs
        aria-label="내 정보 관리 탭"
        items={TABS}
        activeId={activeTab}
        onSelect={(id) => onTabChange(id as ProfileSettingsTabId)}
        tabsVariant="line"
        size="l"
        className="w-full"
        tabListClassName={lineTabStripListClassName("l")}
      />
    </div>
  );
}
