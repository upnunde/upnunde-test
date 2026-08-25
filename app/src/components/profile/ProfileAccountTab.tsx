"use client";

import { PROFILE_PAGE_STACK_GAP_CLASS } from "@/lib/page-layout";

import { useEffect, useState } from "react";
import { Button } from "design-system/ui/button";
import { FieldLabel } from "design-system/ui/field-label";
import { Input, InputGroup } from "design-system/ui/input";
import { ICONS, Icon, type LucideIcon } from "@/lib/icons";
import { DEFAULT_CREATOR_PROFILE, loadProfileSettings } from "@/lib/profile-storage";
import { cn } from "design-system/utils";

const PROFILE_ACCOUNT_LOGIN_ID = "profile-account-login-id";

/** 목업 세션 — 로그인 화면의 ‘최근 로그인’과 동일하게 Google */
const SESSION_LOGIN_PROVIDER_ID = "google";

const LOGIN_PROVIDERS: readonly {
  id: string;
  label: string;
  icon: LucideIcon;
  iconClassName?: string;
}[] = [
  { id: "google", label: "Google", icon: ICONS.googleBrand },
  { id: "apple", label: "Apple", icon: ICONS.appleBrand, iconClassName: "text-foreground" },
  { id: "x", label: "X", icon: ICONS.xBrand },
  { id: "line", label: "LINE", icon: ICONS.lineBrand },
];

export function ProfileAccountTab() {
  const [loginId, setLoginId] = useState(DEFAULT_CREATOR_PROFILE.loginId);
  const [connectedIds, setConnectedIds] = useState(() => new Set([SESSION_LOGIN_PROVIDER_ID]));

  useEffect(() => {
    setLoginId(loadProfileSettings().public.loginId);
  }, []);

  const connectProvider = (id: string) => {
    setConnectedIds((prev) => new Set(prev).add(id));
  };

  return (
    <div className={cn("flex flex-col max-lg:px-5", PROFILE_PAGE_STACK_GAP_CLASS)}>
      <InputGroup>
        <FieldLabel size="sm" weight="600" htmlFor={PROFILE_ACCOUNT_LOGIN_ID}>
          아이디
        </FieldLabel>
        <Input
          id={PROFILE_ACCOUNT_LOGIN_ID}
          type="text"
          size="xl"
          disabled
          value={loginId}
        />
      </InputGroup>

      <InputGroup>
        <FieldLabel
          size="sm"
          weight="600"
          description="같은 계정으로 로그인할 수 있는 간편 로그인을 연결해요."
        >
          연동 로그인
        </FieldLabel>
        <ul className="flex flex-col gap-2">
          {LOGIN_PROVIDERS.map(({ id, label, icon, iconClassName }) => {
            const connected = connectedIds.has(id);
            return (
              <li
                key={id}
                className="flex h-[42px] items-center justify-between gap-3 rounded-md border border-border bg-background px-4"
              >
                <span className="flex min-w-0 items-center gap-2 text-body1_500 text-foreground">
                  <Icon icon={icon} size="xl" className={iconClassName} />
                  {label}
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className={cn("text-body3_400", connected ? "text-success" : "text-foreground-muted")}>
                    {connected ? "연결됨" : "미연결"}
                  </span>
                  {connected ? null : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      aria-label={`${label} 연결하기`}
                      onClick={() => connectProvider(id)}
                    >
                      연결하기
                    </Button>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </InputGroup>
    </div>
  );
}
