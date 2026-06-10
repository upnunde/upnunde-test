"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Title2 } from "@/components/ui/title2";
import { AnalyticsPanel } from "@/components/analytics/AnalyticsPanel";
import { ProfileFieldLabel, profileReadonlyInputClassName } from "@/components/profile/profile-field-styles";
import { loadProfileSettings } from "@/lib/profile-storage";

const LINKED_PROVIDERS = [
  { id: "google", label: "Google", connected: true },
  { id: "line", label: "LINE", connected: false },
] as const;

export function ProfileAccountTab() {
  const router = useRouter();
  const loginId = loadProfileSettings().public.loginId;

  return (
    <div className="flex flex-col gap-my-12 lg:gap-my-20">
      <AnalyticsPanel>
        <Title2 text="로그인 정보" variant="title" asSectionHeader />
        <div className="flex max-w-xl flex-col gap-my-12 lg:gap-my-20 p-my-20">
          <div className="flex flex-col gap-my-12">
            <ProfileFieldLabel text="아이디" />
            <input type="text" disabled value={loginId} className={profileReadonlyInputClassName} />
          </div>

          <div className="flex flex-col gap-my-12">
            <ProfileFieldLabel text="연동 로그인" hint="연결된 계정으로 로그인할 수 있어요." />
            <ul className="flex flex-col gap-my-8">
              {LINKED_PROVIDERS.map(({ id, label, connected }) => (
                <li
                  key={id}
                  className="flex h-[42px] items-center justify-between rounded-md border border-slate-200 bg-white px-my-16"
                >
                  <span className="text-body1_500 text-on-surface-10">{label}</span>
                  <span className="text-body3_400 text-on-surface-20">{connected ? "연결됨" : "미연결"}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-body3_400 text-on-surface-20">
            비밀번호 재설정이나 계정 관련 문의는{" "}
            <Link href="/inquiry" className="font-medium text-on-surface-10 underline underline-offset-4">
              문의
            </Link>
            로 접수해 주세요.
          </p>
        </div>
      </AnalyticsPanel>

      <AnalyticsPanel>
        <Title2 text="계정 관리" variant="title" asSectionHeader />
        <div className="flex flex-col gap-my-16 p-my-20">
          <p className="text-body3_400 text-on-surface-20">
            로그아웃하면 이 기기에서만 세션이 종료돼요.
          </p>
          <div className="flex flex-wrap gap-my-12">
            <Button
              type="button"
              variant="outline"
              className="h-my-36 border-slate-200 text-on-surface-10"
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
