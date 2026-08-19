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
import { space } from "@/lib/spacing";
import { cn } from "design-system/utils";

const PROFILE_ACCOUNT_LOGIN_ID = "profile-account-login-id";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.997 10.997 0 0 0 12 23Z" fill="#34A853"/>
      <path d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84Z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" fill="#EA4335"/>
    </svg>
  );
}

function LineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2C6.48 2 2 5.81 2 10.5c0 4.01 3.17 7.36 7.46 8.23.29.06.68.19.78.44.09.22.06.57.03.8l-.13.74c-.04.22-.17.87.76.47.93-.4 5.03-2.96 6.86-5.07C19.69 13.92 22 12.36 22 10.5 22 5.81 17.52 2 12 2Z" fill="#06C755"/>
      <path d="M9.5 8.5H9v4h2.5v-.75H9.75V8.5H9.5Zm-2.25 0h-.75v4h.75v-4Zm7 2.5h-1.5V8.5h-.75v4h2.25v-.75h0v-.25Zm2.75-2.5h-.75v2.44l-1.69-2.44h-.81v4h.75v-2.44l1.69 2.44H17v-4h-.75 0Z" fill="#fff"/>
    </svg>
  );
}

const LINKED_PROVIDERS = [
  { id: "google", label: "Google", icon: GoogleIcon, connected: true },
  { id: "line", label: "LINE", icon: LineIcon, connected: false },
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
            "flex flex-col",
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
                size="xl"
                disabled
                value={loginId}
              />
            </InputGroup>
          </div>

          <div className="flex flex-col gap-3">
            <ProfileFieldLabel text="연동 로그인" hint="연결된 계정으로 로그인할 수 있어요." />
            <ul className="flex flex-col gap-2">
              {LINKED_PROVIDERS.map(({ id, label, icon: Icon, connected }) => (
                <li
                  key={id}
                  className="flex h-[42px] items-center justify-between rounded-md border border-border bg-background px-4"
                >
                  <span className="flex items-center gap-2 text-body1_500 text-foreground">
                    <Icon className="size-5" />
                    {label}
                  </span>
                  <span className={`text-body3_400 ${connected ? "text-success" : "text-foreground-muted"}`}>{connected ? "연결됨" : "미연결"}</span>
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
