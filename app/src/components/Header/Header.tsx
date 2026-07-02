"use client";

import { useState, useRef } from "react";
import { ICONS } from "@/lib/icons";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { ProfileEditModal } from "@/components/ProfileEditModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { APP_HEADER_STICKY_CLASS } from "@/lib/mobile-viewport";
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
  className?: string;
}

/** Global top header: Logo + ICONS.user avatar only. Full width. */
export default function Header({ profileImageUrl, onProfileImageChange, onMenuClick, className }: HeaderProps) {
  const router = useRouter();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center justify-between border-b border-border bg-background pl-0 pr-4",
        APP_HEADER_STICKY_CLASS,
        className,
      )}
    >
      <div className="flex items-center gap-2 self-stretch pl-3 lg:w-[240px] lg:pl-4">
        {onMenuClick ? (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onMenuClick}
            className="text-foreground-muted lg:hidden"
            aria-label="메뉴 열기"
          >
            <ICONS.menu className="h-5 w-5" aria-hidden />
          </Button>
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
        <button
          ref={profileButtonRef}
          type="button"
          onClick={() => setIsProfileModalOpen(true)}
          className="cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="프로필 편집"
        >
          <Avatar className="size-9 border border-border transition-opacity hover:opacity-90">
            {profileImageUrl ? <AvatarImage src={profileImageUrl} alt="프로필" /> : null}
            <AvatarFallback>
              <ICONS.user className="h-5 w-5 text-foreground-placeholder" aria-hidden />
            </AvatarFallback>
          </Avatar>
        </button>
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
