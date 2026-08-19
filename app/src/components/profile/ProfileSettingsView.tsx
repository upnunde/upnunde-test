"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ProfileAccountTab } from "@/components/profile/ProfileAccountTab";
import { ProfilePublicTab } from "@/components/profile/ProfilePublicTab";
import { ProfileSettingsTabBar } from "@/components/profile/ProfileSettingsTabBar";
import { ProfileSettlementTab } from "@/components/profile/ProfileSettlementTab";
import { Snackbar } from "@/components/episode/Snackbar";
import { PAGE_SCROLL_ROOT_CLASS, PAGE_STACK_CLASS } from "@/lib/page-layout";
import { loadProfileSettings } from "@/lib/profile-storage";
import type { ProfileSettingsTabId } from "@/types/profile";
import { cn } from "design-system/utils";

export function ProfileSettingsView({
  defaultTab = "profile",
}: {
  defaultTab?: ProfileSettingsTabId;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTabState] = useState<ProfileSettingsTabId>(defaultTab);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  useEffect(() => {
    setAvatarUrl(loadProfileSettings().public.avatarUrl);
  }, []);

  useEffect(() => {
    setActiveTabState(defaultTab);
  }, [defaultTab]);

  const setActiveTab = useCallback(
    (tab: ProfileSettingsTabId) => {
      setActiveTabState(tab);
      const qs = tab === "profile" ? "" : `?tab=${tab}`;
      router.replace(`${pathname}${qs}`, { scroll: false });
    },
    [pathname, router],
  );

  const handleSaved = useCallback((message: string) => {
    setSnackbar({ open: true, message });
  }, []);

  return (
    <>
      <div className={cn(PAGE_SCROLL_ROOT_CLASS, "items-stretch justify-start gap-0 bg-background")}>
        <div className={PAGE_STACK_CLASS}>
          <ProfileSettingsTabBar activeTab={activeTab} onTabChange={setActiveTab} />
          {activeTab === "profile" ? (
            <ProfilePublicTab
              avatarUrl={avatarUrl}
              onAvatarChange={setAvatarUrl}
              onSaved={() => handleSaved("프로필을 저장했습니다")}
            />
          ) : null}
          {activeTab === "settlement" ? (
            <ProfileSettlementTab onSaved={() => handleSaved("정산 정보를 저장했습니다")} />
          ) : null}
          {activeTab === "account" ? <ProfileAccountTab /> : null}
        </div>
      </div>
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        onClose={() => setSnackbar({ open: false, message: "" })}
      />
    </>
  );
}
