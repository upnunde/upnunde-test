"use client";

import { useState, useRef } from "react";
import { ICONS } from "@/lib/icons";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { ProfileEditModal } from "@/components/ProfileEditModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconButton } from "@/components/ui/icon-button";
import { Button } from "design-system/ui/button";
import { useRouter } from "next/navigation";
import { APP_HEADER_EDGE_X_CLASS, APP_HEADER_START_INSET_CLASS, APP_HEADER_STICKY_CLASS } from "@/lib/mobile-viewport";
import { RenovelStudioLogo } from "@/components/brand/RenovelStudioLogo";
import { cn } from "design-system/utils";

export interface HeaderProps {
  /** Reserved for future use */
  contextLabel?: string;
  /** 헤더에 표시할 프로필 이미지 URL (저장 시 반영) */
  profileImageUrl?: string | null;
  /** 프로필 편집 모달에서 저장 시 호출 */
  onProfileImageChange?: (avatarUrl: string | null) => void;
  /** 모바일 메뉴 열기 (미전달 시 햄버거 버튼 숨김) */
  onMenuClick?: () => void;
  /** 뒤로가기 서브헤더가 있는 페이지 — 모바일/태블릿(max-lg)에서 전역 헤더 숨김 (헤더 중복 방지) */
  hideOnMobile?: boolean;
  className?: string;
}

/** Global top header: Logo + ICONS.user avatar only. Full width. */
export default function Header({ profileImageUrl, onProfileImageChange, onMenuClick, hideOnMobile, className }: HeaderProps) {
  const router = useRouter();
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
      <div className="flex items-center gap-1">
        <Button
          ref={profileButtonRef}
          type="button"
          variant="ghost"
          shape="circle"
          size="icon-xl"
          onClick={() => setIsProfileModalOpen(true)}
          className="overflow-hidden p-0"
          aria-label="프로필 편집"
        >
          <Avatar className="size-10">
            {profileImageUrl ? <AvatarImage src={profileImageUrl} alt="프로필" /> : null}
            <AvatarFallback>
              <ICONS.user className="h-5 w-5 text-foreground-placeholder" aria-hidden />
            </AvatarFallback>
          </Avatar>
        </Button>
        <ThemeToggleButton />
      </div>
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        anchorRef={profileButtonRef}
        onSave={(avatarUrl) => {
          onProfileImageChange?.(avatarUrl);
          setIsProfileModalOpen(false);
        }}
      />
    </header>
  );
}
