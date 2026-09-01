"use client";

import { PROFILE_PAGE_STACK_GAP_CLASS } from "@/lib/page-layout";

import { useEffect, useState } from "react";
import { FieldLabel } from "design-system/ui/field-label";
import { Input, InputGroup } from "design-system/ui/input";
import { ICONS, Icon, type LucideIcon } from "@/lib/icons";
import { DEFAULT_CREATOR_PROFILE, loadProfileSettings } from "@/lib/profile-storage";
import { cn } from "design-system/utils";

const PROFILE_ACCOUNT_LOGIN_ID = "profile-account-login-id";

/**
 * 이 서비스는 가입 수단이 고정된 유일 간편로그인이다. 설정에는 제공자 카탈로그·연결하기를
 * 두지 않고 현재 로그인 방식만 읽기 전용으로 노출한다.
 * 목업 세션 — 로그인 화면의 ‘최근 로그인’과 동일하게 Google.
 */
const SESSION_LOGIN_PROVIDER: {
  label: string;
  icon: LucideIcon;
  iconClassName?: string;
} = { label: "Google", icon: ICONS.googleBrand };

/** 아이디 필드와 같은 비활성 필드 표현 — 값이 아니라 사실 전달용 */
const LOGIN_METHOD_FIELD_CLASS =
  "h-10 border border-disabled-border bg-disabled text-body2_400 text-disabled-foreground";

export function ProfileAccountTab() {
  const [loginId, setLoginId] = useState(DEFAULT_CREATOR_PROFILE.loginId);

  useEffect(() => {
    setLoginId(loadProfileSettings().public.loginId);
  }, []);

  return (
    // 좌우 패딩은 감싸는 회원정보 화면이 갖는다 (모바일 이중 패딩 방지)
    <div className={cn("flex flex-col", PROFILE_PAGE_STACK_GAP_CLASS)}>
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
          description="가입할 때 사용한 방식으로만 로그인할 수 있어요."
        >
          로그인 방식
        </FieldLabel>
        <div className={cn("flex items-center gap-2 rounded-md px-3", LOGIN_METHOD_FIELD_CLASS)}>
          <Icon
            icon={SESSION_LOGIN_PROVIDER.icon}
            size="xl"
            className={cn("shrink-0", SESSION_LOGIN_PROVIDER.iconClassName)}
          />
          <span className="min-w-0 truncate">{SESSION_LOGIN_PROVIDER.label}</span>
        </div>
      </InputGroup>
    </div>
  );
}
