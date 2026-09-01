"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ProfileAccountTab } from "@/components/profile/ProfileAccountTab";
import { ProfileNotificationSettingsView } from "@/components/profile/ProfileNotificationSettingsView";
import { ProfilePrivacyPolicyView } from "@/components/profile/ProfilePrivacyPolicyView";
import { ProfilePublicTab } from "@/components/profile/ProfilePublicTab";
import { ProfileSettlementTab } from "@/components/profile/ProfileSettlementTab";
import { SettingsHomeView } from "@/components/profile/SettingsHomeView";
import { HeaderBackButton } from "@/components/ui/header-back-button";
import { Snackbar } from "@/components/episode/Snackbar";
import { useProfileAvatarUrl } from "@/hooks/useProfileAvatarUrl";
import { PageCard } from "@/components/layout/PageCard";
import {
  PAGE_CONTAINER_CLASS,
  PAGE_SCROLL_ROOT_FLOW_CLASS,
  PAGE_SCROLL_ROOT_MOBILE_FLUSH_CLASS,
  PAGE_SUBHEADER_CLASS,
  PROFILE_PAGE_STACK_GAP_CLASS,
} from "@/lib/page-layout";
import { PROFILE_SETTINGS_TAB_TITLES, type ProfileSettingsTabId } from "@/types/profile";
import { cn } from "design-system/utils";

export function ProfileSettingsView({
  defaultTab = "home",
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
      const qs = tab === "home" ? "" : `?tab=${tab}`;
      router.replace(`${pathname}${qs}`, { scroll: false });
    },
    [pathname, router],
  );

  const handleSaved = useCallback((message: string) => {
    setSnackbar({ open: true, message });
  }, []);

  const isHome = activeTab === "home";
  /** 폼 화면은 첫 요소가 라벨이라 카드 상하 여백을 목록(8px)보다 넓게 둔다 */
  const isFormTab = activeTab === "profile" || activeTab === "settlement";

  return (
    <>
      <div className={PAGE_SUBHEADER_CLASS}>
        <div
          className={cn(
            PAGE_CONTAINER_CLASS,
            "flex items-center justify-start gap-1",
            isHome && "gap-4",
          )}
        >
          {isHome ? null : (
            <HeaderBackButton onClick={() => setActiveTab("home")} aria-label="설정으로 돌아가기" />
          )}
          <h1 className="text-heading2_700 text-foreground">
            {PROFILE_SETTINGS_TAB_TITLES[activeTab]}
          </h1>
        </div>
      </div>

      <div
        className={cn(
          PAGE_SCROLL_ROOT_FLOW_CLASS,
          PAGE_SCROLL_ROOT_MOBILE_FLUSH_CLASS,
          "items-stretch justify-start gap-0",
        )}
      >
        <div className={cn(PAGE_CONTAINER_CLASS, "flex")}>
          <div className="min-w-0 flex-1">
            <PageCard
              fullWidth
              className={cn(
                "flex h-fit shrink-0 flex-col gap-0 overflow-hidden rounded-sm px-0 py-2 max-lg:rounded-none max-lg:border-0 lg:px-0",
                isFormTab && "py-4",
              )}
            >
              {isHome ? <SettingsHomeView onNavigate={setActiveTab} /> : null}
              {activeTab === "profile" ? (
                <div className="lg:px-5">
                  <ProfilePublicTab
                    avatarUrl={avatarUrl}
                    onAvatarChange={setAvatarUrl}
                    onSaved={() => handleSaved("프로필을 저장했습니다")}
                  >
                    <div className="border-t border-divider" role="separator" />
                    <ProfileAccountTab />
                  </ProfilePublicTab>
                </div>
              ) : null}
              {activeTab === "settlement" ? (
                <div className="lg:px-5">
                  <ProfileSettlementTab onSaved={() => handleSaved("정산 정보를 저장했습니다")} />
                </div>
              ) : null}
              {activeTab === "notifications" ? <ProfileNotificationSettingsView /> : null}
              {activeTab === "privacy" ? <ProfilePrivacyPolicyView /> : null}
            </PageCard>
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
