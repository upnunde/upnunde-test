"use client";

import type { ProfileSettingsTabId } from "@/types/profile";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as ProfileSettingsTabId)} className="w-full">
        <TabsList variant="line" size="default" aria-label="내 정보 관리 탭" className={lineTabStripListClassName("l")}>
          {TABS.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
