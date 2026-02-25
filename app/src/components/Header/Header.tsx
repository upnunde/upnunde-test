"use client";

import { useState, useRef } from "react";
import { User } from "lucide-react";
import { ProfileEditModal } from "@/components/ProfileEditModal";

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
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
      <img
        src="/renovel-studio-logo.png"
        alt="RE:NOVEL Studio"
        className="h-5 object-contain object-left"
      />
      <div className="flex items-center">
        <button
          ref={profileButtonRef}
          type="button"
          onClick={() => setIsProfileModalOpen(true)}
          className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-slate-200 transition-colors overflow-hidden"
          aria-label="프로필 편집"
        >
          {profileImageUrl ? (
            <img src={profileImageUrl} alt="프로필" className="w-full h-full object-cover" />
          ) : (
            <User className="h-4 w-4 text-slate-600" />
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
