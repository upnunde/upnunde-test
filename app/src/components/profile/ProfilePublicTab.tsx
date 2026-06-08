"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Title2 } from "@/components/ui/title2";
import { AnalyticsPanel } from "@/components/analytics/AnalyticsPanel";
import {
  ProfileCharCount,
  ProfileFieldLabel,
  profileEditableInputClassName,
  profileReadonlyInputClassName,
  profileTextareaClassName,
} from "@/components/profile/profile-field-styles";
import {
  loadProfileSettings,
  PROFILE_DESCRIPTION_MAX,
  PROFILE_PEN_NAME_MAX,
  saveCreatorProfile,
} from "@/lib/profile-storage";
import type { CreatorProfile } from "@/types/profile";

export function ProfilePublicTab({
  avatarUrl,
  onAvatarChange,
  onSaved,
}: {
  avatarUrl: string | null;
  onAvatarChange: (url: string | null) => void;
  onSaved: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<CreatorProfile>(() => loadProfileSettings().public);
  const [localAvatar, setLocalAvatar] = useState<string | null>(avatarUrl);

  useEffect(() => {
    setDraft(loadProfileSettings().public);
    setLocalAvatar(avatarUrl);
  }, [avatarUrl]);

  const displayAvatar = localAvatar ?? draft.avatarUrl;

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    if (localAvatar?.startsWith("blob:")) URL.revokeObjectURL(localAvatar);
    const next = URL.createObjectURL(file);
    setLocalAvatar(next);
    e.target.value = "";
  };

  const handleSave = () => {
    const next: CreatorProfile = {
      ...draft,
      avatarUrl: localAvatar,
    };
    saveCreatorProfile(next);
    setDraft(next);
    onAvatarChange(localAvatar);
    onSaved();
  };

  return (
    <AnalyticsPanel className="overflow-hidden border-0 bg-transparent">
      <Title2 text="공개 프로필" variant="title" asSectionHeader />
      <div className="flex flex-col gap-8 p-5">
        <div className="flex flex-col items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            aria-label="프로필 사진 선택"
            onChange={handleAvatarFileChange}
          />
          <div className="relative h-24 w-24">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
              {displayAvatar ? (
                <Image
                  src={displayAvatar}
                  alt="프로필"
                  width={96}
                  height={96}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-on-surface-30" aria-hidden />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#2d2d2d] hover:bg-black"
              aria-label="프로필 사진 변경"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
            </button>
          </div>
          <p className="text-center text-sm leading-5 text-on-surface-20">
            독자에게 표시되는 작가 프로필이에요.
          </p>
        </div>

        <div className="flex max-w-xl flex-col gap-5">
          <div className="flex flex-col gap-3">
            <ProfileFieldLabel text="아이디" hint="로그인에 사용하는 이메일이에요." />
            <input type="text" disabled value={draft.loginId} className={profileReadonlyInputClassName} />
          </div>

          <div className="flex flex-col gap-3">
            <ProfileFieldLabel text="작가명" />
            <input
              type="text"
              value={draft.penName}
              maxLength={PROFILE_PEN_NAME_MAX}
              onChange={(e) => setDraft((prev) => ({ ...prev, penName: e.target.value.slice(0, PROFILE_PEN_NAME_MAX) }))}
              className={profileEditableInputClassName}
            />
            <ProfileCharCount current={draft.penName.length} max={PROFILE_PEN_NAME_MAX} />
          </div>

          <div className="flex flex-col gap-3">
            <ProfileFieldLabel text="소개" />
            <textarea
              placeholder="소개 내용을 작성해 주세요."
              value={draft.description}
              maxLength={PROFILE_DESCRIPTION_MAX}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  description: e.target.value.slice(0, PROFILE_DESCRIPTION_MAX),
                }))
              }
              className={profileTextareaClassName}
            />
            <ProfileCharCount current={draft.description.length} max={PROFILE_DESCRIPTION_MAX} />
          </div>
        </div>

        <div className="flex justify-end border-t border-border-10 pt-5">
          <Button type="button" className="h-10 min-w-20 px-4" onClick={handleSave}>
            저장
          </Button>
        </div>
      </div>
    </AnalyticsPanel>
  );
}
