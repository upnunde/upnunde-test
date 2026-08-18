"use client";

import { space } from "@/lib/spacing";
import { cn } from "design-system/utils";

import { PAGE_GUTTER_GAP_CLASS } from "@/lib/page-layout";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ICONS } from "@/lib/icons";
import { Button } from "design-system/ui/button";
import { Title2 } from "@/components/ui/title2";
import { AnalyticsPanel } from "@/components/analytics/AnalyticsPanel";
import { Input, InputGroup, InputHypertext } from "@/components/ui/input";
import { Textarea } from "design-system/ui/textarea";
import { ProfileAvatarEditButton } from "@/components/profile/ProfileAvatarEditButton";
import { ProfileFieldLabel } from "@/components/profile/profile-field-styles";
import { formFieldAriaDescribedBy } from "@/components/ui/field-label";
import {
  loadProfileSettings,
  PROFILE_DESCRIPTION_MAX,
  PROFILE_PEN_NAME_MAX,
  saveCreatorProfile,
} from "@/lib/profile-storage";
import type { CreatorProfile } from "@/types/profile";

const PROFILE_PUBLIC_LOGIN_ID = "profile-public-login-id";
const PROFILE_PUBLIC_PEN_NAME_ID = "profile-public-pen-name";
const PROFILE_PUBLIC_DESCRIPTION_ID = "profile-public-description";

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
      <div
        className={cn(
          "flex flex-col",
          space.section.sectionStackGapLarge.className,
          space.section.sectionPadding.className,
        )}
      >
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
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-border bg-background-muted">
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
                <ICONS.user className="h-10 w-10 text-foreground-placeholder" aria-hidden />
              )}
            </div>
            <ProfileAvatarEditButton onClick={() => fileInputRef.current?.click()} />
          </div>
          <p className="text-center text-body3_400 text-foreground-muted">
            독자에게 표시되는 작가 프로필이에요.
          </p>
        </div>

        <div className={`flex max-w-xl flex-col ${PAGE_GUTTER_GAP_CLASS}`}>
          <div className="flex flex-col gap-3">
            <ProfileFieldLabel text="아이디" hint="로그인에 사용하는 이메일이에요." htmlFor={PROFILE_PUBLIC_LOGIN_ID} />
            <InputGroup>
              <Input
                id={PROFILE_PUBLIC_LOGIN_ID}
                aria-describedby={formFieldAriaDescribedBy(PROFILE_PUBLIC_LOGIN_ID)}
                type="text"
                size="xl"
                disabled
                value={draft.loginId}
              />
            </InputGroup>
          </div>

          <div className="flex flex-col gap-3">
            <ProfileFieldLabel text="작가명" htmlFor={PROFILE_PUBLIC_PEN_NAME_ID} />
            <InputGroup>
              <Input
                id={PROFILE_PUBLIC_PEN_NAME_ID}
                aria-describedby={formFieldAriaDescribedBy(PROFILE_PUBLIC_PEN_NAME_ID)}
                type="text"
                size="xl"
                value={draft.penName}
                maxLength={PROFILE_PEN_NAME_MAX}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, penName: e.target.value.slice(0, PROFILE_PEN_NAME_MAX) }))
                }
              />
              <InputHypertext
                id={formFieldAriaDescribedBy(PROFILE_PUBLIC_PEN_NAME_ID)}
                count={draft.penName.length}
                max={PROFILE_PEN_NAME_MAX}
              />
            </InputGroup>
          </div>

          <div className="flex flex-col gap-3">
            <ProfileFieldLabel text="소개" htmlFor={PROFILE_PUBLIC_DESCRIPTION_ID} />
            <InputGroup>
              <Textarea
                id={PROFILE_PUBLIC_DESCRIPTION_ID}
                aria-describedby={formFieldAriaDescribedBy(PROFILE_PUBLIC_DESCRIPTION_ID)}
                placeholder="소개 내용을 작성해 주세요."
                value={draft.description}
                maxLength={PROFILE_DESCRIPTION_MAX}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    description: e.target.value.slice(0, PROFILE_DESCRIPTION_MAX),
                  }))
                }
                className="min-h-[120px] resize-none"
              />
              <InputHypertext
                id={formFieldAriaDescribedBy(PROFILE_PUBLIC_DESCRIPTION_ID)}
                count={draft.description.length}
                max={PROFILE_DESCRIPTION_MAX}
              />
            </InputGroup>
          </div>
        </div>

        <div className="flex justify-end border-t border-border pt-5">
          <Button type="button" className="h-9 min-w-20 px-4" onClick={handleSave}>
            저장
          </Button>
        </div>
      </div>
    </AnalyticsPanel>
  );
}
