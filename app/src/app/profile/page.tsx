import { AppShell } from "@/components/layout/AppShell";
import { ProfileSettingsView } from "@/components/profile/ProfileSettingsView";
import { PAGE_CONTAINER_CLASS, PAGE_SUBHEADER_WITH_STICKY_CLASS } from "@/lib/page-layout";
import { parseProfileSettingsTab } from "@/types/profile";

/**
 * 내 정보 관리 — `searchParams`는 서버에서 읽어 정산 화면 딥링크(`/profile?tab=settlement`)를 맞춘다.
 */
export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  const sp = await searchParams;
  const defaultTab = parseProfileSettingsTab(sp.tab);

  return (
    <AppShell sidebarActiveId="profile">
      <div className={PAGE_SUBHEADER_WITH_STICKY_CLASS}>
        <div className={`${PAGE_CONTAINER_CLASS} flex items-center justify-start gap-4`}>
          <h1 className="text-heading2_700 text-foreground">내 정보 관리</h1>
        </div>
      </div>
      <ProfileSettingsView defaultTab={defaultTab} />
    </AppShell>
  );
}
