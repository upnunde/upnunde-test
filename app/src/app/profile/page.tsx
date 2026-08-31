import { AppShell } from "@/components/layout/AppShell";
import { ProfileSettingsView } from "@/components/profile/ProfileSettingsView";
import { PAGE_DESKTOP_SCROLL_SHELL_CLASS } from "@/lib/page-layout";
import { APP_BROWSER_BG_ROOT_CLASS } from "@/lib/mobile-viewport";
import { parseProfileSettingsTab } from "@/types/profile";

/**
 * 설정 — `searchParams`는 서버에서 읽어 하위 화면 딥링크(`/profile?tab=settlement`)를 맞춘다.
 */
export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  const sp = await searchParams;
  const defaultTab = parseProfileSettingsTab(sp.tab);

  return (
    <AppShell sidebarActiveId="profile" browserBgClassName={APP_BROWSER_BG_ROOT_CLASS}>
      <div className={PAGE_DESKTOP_SCROLL_SHELL_CLASS}>
        <ProfileSettingsView defaultTab={defaultTab} />
      </div>
    </AppShell>
  );
}
