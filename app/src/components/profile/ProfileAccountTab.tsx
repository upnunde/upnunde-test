"use client";

import { PAGE_GUTTER_GAP_CLASS } from "@/lib/page-layout";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "design-system/ui/button";
import { Title2 } from "@/components/ui/title2";
import { AnalyticsPanel } from "@/components/analytics/AnalyticsPanel";
import { Input, InputGroup } from "@/components/ui/input";
import { ProfileFieldLabel } from "@/components/profile/profile-field-styles";
import { loadProfileSettings } from "@/lib/profile-storage";
import { space } from "design-system/spacing-tokens";
import { cn } from "design-system/utils";

const PROFILE_ACCOUNT_LOGIN_ID = "profile-account-login-id";

const LINKED_PROVIDERS = [
  { id: "google", label: "Google", connected: true },
  { id: "line", label: "LINE", connected: false },
] as const;

export function ProfileAccountTab() {
  const router = useRouter();
  const loginId = loadProfileSettings().public.loginId;

  return (
    <div className={`flex flex-col ${PAGE_GUTTER_GAP_CLASS}`}>
      <AnalyticsPanel>
        <Title2 text="로그인 정보" variant="title" asSectionHeader />
        <div
          className={cn(
            "flex max-w-xl flex-col",
            PAGE_GUTTER_GAP_CLASS,
            space.section.sectionPadding.className,
          )}
        >
          <div className="flex flex-col gap-3">
            <ProfileFieldLabel text="아이디" htmlFor={PROFILE_ACCOUNT_LOGIN_ID} />
            <InputGroup>
              <Input
                id={PROFILE_ACCOUNT_LOGIN_ID}
                type="text"
                size="lg"
                disabled
                value={loginId}
              />
            </InputGroup>
          </div>

          <div className="flex flex-col gap-3">
            <ProfileFieldLabel text="연동 로그인" hint="연결된 계정으로 로그인할 수 있어요." />
            <ul className="flex flex-col gap-2">
              {LINKED_PROVIDERS.map(({ id, label, connected }) => (
                <li
                  key={id}
                  className="flex h-[42px] items-center justify-between rounded-md border border-border bg-background px-4"
                >
                  <span className="text-body1_500 text-foreground">{label}</span>
                  <span className="text-body3_400 text-foreground-muted">{connected ? "연결됨" : "미연결"}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-body3_400 text-foreground-muted">
            비밀번호 재설정이나 계정 관련 문의는{" "}
            <Link href="/inquiry" className="font-medium text-foreground underline underline-offset-4">
              문의
            </Link>
            로 접수해 주세요.
          </p>
        </div>
      </AnalyticsPanel>

      <AnalyticsPanel>
        <Title2 text="계정 관리" variant="title" asSectionHeader />
        <div className="flex flex-col gap-4 p-5">
          <p className="text-body3_400 text-foreground-muted">
            로그아웃하면 이 기기에서만 세션이 종료돼요.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-9 border-border text-foreground"
              onClick={() => router.push("/")}
            >
              로그아웃
            </Button>
          </div>
        </div>
      </AnalyticsPanel>
    </div>
  );
}
