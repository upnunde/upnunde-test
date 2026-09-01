"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Toggle } from "design-system/ui/toggle";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { Icon, ICONS, type LucideIcon } from "@/lib/icons";
import { APP_VERSION } from "@/lib/app-version";
import { useThemeMode } from "@/hooks/useThemeMode";
import {
  DEFAULT_CREATOR_PROFILE,
  loadProfileSettings,
  MOCK_CREATOR_FOLLOWER_COUNT,
  resolveProfileAvatarUrl,
} from "@/lib/profile-storage";
import { useSeriesCatalogStore } from "@/store/useSeriesCatalogStore";
import { LogoutConfirmDialog } from "@/components/profile/LogoutConfirmDialog";
import {
  SettingsActionRow,
  SettingsLinkRow,
  SettingsList,
  SettingsValueRow,
} from "@/components/profile/settings-rows";
import type { ProfileSettingsTabId } from "@/types/profile";
import type { ThemeMode } from "@/lib/theme-mode";

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: LucideIcon }[] = [
  { mode: "light", label: "라이트", icon: ICONS.sun },
  { mode: "dark", label: "다크", icon: ICONS.moon },
];

function SettingsProfileSummary({ onClick }: { onClick: () => void }) {
  const ensureDemoSeries = useSeriesCatalogStore((s) => s.ensureDemoSeries);
  /** 스토어를 직접 구독 — 작품 추가·삭제가 곧바로 반영된다 */
  const seriesCount = useSeriesCatalogStore((s) => s.orderedIds.length);
  const [profile, setProfile] = useState(DEFAULT_CREATOR_PROFILE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProfile(loadProfileSettings().public);
    ensureDemoSeries();
    setMounted(true);
  }, [ensureDemoSeries]);

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left transition-colors duration-short ease-standard hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40"
    >
      <span className="relative flex size-14 shrink-0 overflow-hidden rounded-full border border-border bg-background-muted">
        <Image
          src={resolveProfileAvatarUrl(profile.avatarUrl)}
          alt=""
          width={56}
          height={56}
          unoptimized
          className="size-full object-cover"
        />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-heading4_700 text-foreground">{profile.penName}</span>
        <span className="truncate text-body3_400 text-foreground-muted">{profile.loginId}</span>
        <span className="mt-1 flex items-center gap-2 text-body3_400 text-foreground-muted">
          <span>
            팔로워{" "}
            <span className="text-body3_700 text-foreground">
              {MOCK_CREATOR_FOLLOWER_COUNT.toLocaleString("ko-KR")}
            </span>
          </span>
          <span className="h-3 w-px bg-divider" aria-hidden />
          <span>
            작품{" "}
            <span className="text-body3_700 text-foreground">
              {mounted ? seriesCount.toLocaleString("ko-KR") : "-"}
            </span>
          </span>
        </span>
      </span>
      <Icon icon={ICONS.chevronRight} size="xl" className="shrink-0 text-foreground-placeholder" />
    </button>
  );
}

/** 행 아이콘은 선택된 모드의 세그먼트 아이콘과 동일하게 유지한다. */
function SettingsThemeRow() {
  const { mode, mounted, setThemeMode } = useThemeMode();
  const activeIcon = mode === "dark" ? ICONS.moon : ICONS.sun;

  return (
    <SettingsValueRow icon={activeIcon} label="화면 스타일">
      <ToggleGroup
        size="sm"
        value={mounted ? [mode] : []}
        onValueChange={(value) => {
          const next = value[0];
          if (next === "light" || next === "dark") setThemeMode(next);
        }}
        aria-label="화면 스타일"
        className="rounded-md border border-border"
      >
        {THEME_OPTIONS.map(({ mode: optionMode, label, icon }) => (
          <Toggle key={optionMode} value={optionMode} size="sm">
            <Icon icon={icon} size="md" position="inline-start" />
            {label}
          </Toggle>
        ))}
      </ToggleGroup>
    </SettingsValueRow>
  );
}

export function SettingsHomeView({
  onNavigate,
}: {
  onNavigate: (tab: ProfileSettingsTabId) => void;
}) {
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <div className="flex w-full flex-col">
      <SettingsProfileSummary onClick={() => onNavigate("profile")} />

      <SettingsList>
        <SettingsLinkRow
          icon={ICONS.circleWon}
          label="계좌정보"
          onClick={() => onNavigate("settlement")}
        />
        <SettingsLinkRow
          icon={ICONS.bell}
          label="알림 설정"
          onClick={() => onNavigate("notifications")}
        />
        <SettingsThemeRow />
        <SettingsLinkRow
          icon={ICONS.messageCircle}
          label="서비스 문의"
          onClick={() => router.push("/inquiry")}
        />
        <SettingsLinkRow
          icon={ICONS.fileText}
          label="개인정보처리방침"
          onClick={() => onNavigate("privacy")}
        />
        <SettingsValueRow icon={ICONS.info} label="버전 정보" value={`v${APP_VERSION}`} />
        <SettingsActionRow label="로그아웃" onClick={() => setLogoutOpen(true)} />
      </SettingsList>

      <LogoutConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        onConfirm={() => router.push("/login")}
      />
    </div>
  );
}
