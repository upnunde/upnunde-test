"use client";

import { useRef, useState } from "react";
import { ICONS } from "@/lib/icons";
import { HeaderNotificationMenu } from "@/components/Header/HeaderNotificationMenu";
import { ProfileEditModal } from "@/components/ProfileEditModal";
import { IconButton } from "@/components/ui/icon-button";
import { Button } from "design-system/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "design-system/ui/avatar";
import { useProfileAvatarUrl } from "@/hooks/useProfileAvatarUrl";
import { useRouter } from "next/navigation";
import { APP_HEADER_EDGE_X_CLASS, APP_HEADER_START_INSET_CLASS, APP_HEADER_STICKY_CLASS } from "@/lib/mobile-viewport";
import { RenovelStudioLogo } from "@/components/brand/RenovelStudioLogo";

import { cn } from "design-system/utils";

export interface HeaderProps {
  /** Reserved for future use */
  contextLabel?: string;
  /** 모바일 메뉴 열기 (미전달 시 햄버거 버튼 숨김) */
  onMenuClick?: () => void;
  /** 뒤로가기 서브헤더가 있는 페이지 — 모바일/태블릿(max-lg)에서 전역 헤더 숨김 (헤더 중복 방지) */
  hideOnMobile?: boolean;
  className?: string;
}

/** Global top header: Logo + profile Avatar. Full width. 아바타는 storage 단일 소스. */
export default function Header({ onMenuClick, hideOnMobile, className }: HeaderProps) {
  const router = useRouter();
  const [profileImageUrl, setProfileImageUrl] = useProfileAvatarUrl();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center justify-between border-b border-border bg-background",
        APP_HEADER_EDGE_X_CLASS,
        APP_HEADER_STICKY_CLASS,
        hideOnMobile && "max-lg:hidden",
        className,
      )}
    >
      <div className={cn("flex items-center gap-2 self-stretch", APP_HEADER_START_INSET_CLASS, "lg:w-[240px]")}>
        {onMenuClick ? (
          <IconButton
            type="button"
            variant="ghost"
            shape="circle"
            size="icon-xl"
            icon={ICONS.menu}
            onClick={onMenuClick}
            className="text-foreground-muted lg:hidden"
            aria-label="메뉴 열기"
          />
        ) : null}
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="flex cursor-pointer items-center"
          aria-label="로그인 화면으로 이동"
        >
          <RenovelStudioLogo />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0">
          <HeaderNotificationMenu />
        </div>
        <Button
          ref={profileButtonRef}
          type="button"
          variant="ghost"
          shape="circle"
          size="icon-sm"
          onClick={() => setIsProfileModalOpen(true)}
          className="overflow-hidden p-0"
          aria-label="프로필 편집"
        >
          <Avatar size="default">
            {profileImageUrl ? <AvatarImage src={profileImageUrl} alt="프로필" /> : null}
            <AvatarFallback />
          </Avatar>
        </Button>
      </div>
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        anchorRef={profileButtonRef}
        onSave={(avatarUrl) => {
          setProfileImageUrl(avatarUrl);
          setIsProfileModalOpen(false);
        }}
      />
    </header>
  );
}
