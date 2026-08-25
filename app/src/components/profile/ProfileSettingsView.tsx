"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ProfileAccountTab } from "@/components/profile/ProfileAccountTab";
import { ProfilePublicTab } from "@/components/profile/ProfilePublicTab";
import { ProfileSettingsTabBar } from "@/components/profile/ProfileSettingsTabBar";
import { ProfileSettlementTab } from "@/components/profile/ProfileSettlementTab";
import { Snackbar } from "@/components/episode/Snackbar";
import { useProfileAvatarUrl } from "@/hooks/useProfileAvatarUrl";
import {
  PAGE_GUTTER_X_CLASS,
  PAGE_NARROW_CONTAINER_CLASS,
  PAGE_SCROLL_BOTTOM_CLASS,
  PAGE_SCROLL_TOP_CLASS,
  PROFILE_PAGE_STACK_GAP_CLASS,
} from "@/lib/page-layout";
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
  const [avatarUrl, setAvatarUrl] = useProfileAvatarUrl();
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

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
      <div
        className={cn(
          "flex w-full flex-col items-center max-lg:overflow-visible",
          PAGE_SCROLL_TOP_CLASS,
          PAGE_SCROLL_BOTTOM_CLASS,
          PAGE_GUTTER_X_CLASS,
          "max-lg:px-0 max-lg:pt-0",
        )}
      >
        <div className={cn(PAGE_NARROW_CONTAINER_CLASS, "flex w-full max-lg:max-w-none")}>
          <div className={cn("flex min-w-0 flex-1 flex-col max-lg:bg-background", PROFILE_PAGE_STACK_GAP_CLASS)}>
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
      </div>
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        onClose={() => setSnackbar({ open: false, message: "" })}
      />
    </>
  );
}
