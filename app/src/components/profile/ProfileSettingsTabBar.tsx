"use client";

import type { ProfileSettingsTabId } from "@/types/profile";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { lineTabStripListClassName } from "@/lib/tab-styles";

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
    <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as ProfileSettingsTabId)} className="w-full">
      <TabsList variant="line" size="default" aria-label="내 정보 관리 탭" className={`${lineTabStripListClassName("l")} border-b-0`}>
        {TABS.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
