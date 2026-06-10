"use client";

import type { ProfileSettingsTabId } from "@/types/profile";
import { profileTabButtonClassName } from "@/components/profile/profile-field-styles";

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
    <div className="inline-flex w-full flex-col items-start justify-start gap-my-8 self-stretch border-b border-border-10 px-my-16 lg:px-my-20 pb-0 pt-my-8">
      <div
        role="tablist"
        aria-label="내 정보 관리 탭"
        className="inline-flex w-full items-center gap-my-16 overflow-hidden"
      >
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            className={profileTabButtonClassName(activeTab === id)}
            onClick={() => onTabChange(id)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
