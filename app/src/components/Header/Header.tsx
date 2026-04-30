"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { User } from "lucide-react";
import { ProfileEditModal } from "@/components/ProfileEditModal";
import { useRouter } from "next/navigation";

export interface HeaderProps {
  /** Reserved for future use */
  contextLabel?: string;
  /** 헤더에 표시할 프로필 이미지 URL (저장 시 반영) */
  profileImageUrl?: string | null;
  /** 프로필 편집 모달에서 저장 시 호출 */
  onProfileImageChange?: (avatarUrl: string | null) => void;
}

/** Global top header: Logo + User avatar only. Full width. */
export default function Header({ profileImageUrl, onProfileImageChange }: HeaderProps) {
  const router = useRouter();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border-10 bg-white pl-0 pr-4">
      <div className="flex w-[240px] self-stretch items-center pl-4">
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="flex cursor-pointer items-center"
          aria-label="로그인 화면으로 이동"
        >
          <Image
            src="/renovel-studio-logo.png"
            alt="RE:NOVEL Studio"
            width={94}
            height={20}
            priority
            className="h-5 w-auto object-contain object-left"
          />
        </button>
      </div>
      <div className="flex items-center">
        <button
          ref={profileButtonRef}
          type="button"
          onClick={() => setIsProfileModalOpen(true)}
          className="w-9 h-9 rounded-full bg-surface-20 border border-border-10 flex cursor-pointer items-center justify-center hover:bg-slate-200 transition-colors overflow-hidden"
          aria-label="프로필 편집"
        >
          {profileImageUrl ? (
            <Image
              src={profileImageUrl}
              alt="프로필"
              width={36}
              height={36}
              unoptimized
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="h-4 w-4 text-on-surface-30" />
          )}
        </button>
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
