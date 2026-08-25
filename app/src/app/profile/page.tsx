import { AppShell } from "@/components/layout/AppShell";
import { ProfileSettingsView } from "@/components/profile/ProfileSettingsView";
import { PAGE_DESKTOP_SCROLL_SHELL_CLASS, PAGE_NARROW_CONTAINER_CLASS, PAGE_SUBHEADER_WITH_STICKY_CLASS } from "@/lib/page-layout";
import { APP_BROWSER_BG_ROOT_CLASS } from "@/lib/mobile-viewport";
import { parseProfileSettingsTab } from "@/types/profile";

/**
 * 설정 — `searchParams`는 서버에서 읽어 정산 화면 딥링크(`/profile?tab=settlement`)를 맞춘다.
 */
export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  const sp = await searchParams;
  const defaultTab = parseProfileSettingsTab(sp.tab);

  return (
    <AppShell sidebarActiveId="series" browserBgClassName={APP_BROWSER_BG_ROOT_CLASS}>
      <div className={PAGE_DESKTOP_SCROLL_SHELL_CLASS}>
        <div className={PAGE_SUBHEADER_WITH_STICKY_CLASS}>
          <div className={`${PAGE_NARROW_CONTAINER_CLASS} flex items-center justify-start gap-4`}>
            <h1 className="text-heading2_700 text-foreground">설정</h1>
          </div>
        </div>
        <ProfileSettingsView defaultTab={defaultTab} />
      </div>
    </AppShell>
  );
}
