"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ICONS } from "@/lib/icons";
import { Button } from "design-system/ui/button";
import { FieldLabel } from "design-system/ui/field-label";
import { Input, InputGroup, InputHypertext } from "design-system/ui/input";
import { Textarea } from "design-system/ui/textarea";
import { cn } from "design-system/utils";
import { PAGE_FOOTER_ACTION_BUTTON_CLASS, PROFILE_PAGE_STACK_GAP_CLASS } from "@/lib/page-layout";
import { ProfileAvatarChangeDialog } from "@/components/profile/ProfileAvatarChangeDialog";
import { ProfileDirtySaveButton } from "@/components/profile/ProfileDirtySaveButton";
import {
  DEFAULT_CREATOR_PROFILE,
  dispatchProfileAvatarPreview,
  loadProfileSettings,
  PROFILE_DESCRIPTION_MAX,
  PROFILE_PEN_NAME_MAX,
  resolveProfileAvatarUrl,
  saveCreatorProfile,
} from "@/lib/profile-storage";
import type { CreatorProfile } from "@/types/profile";

const PROFILE_PUBLIC_PEN_NAME_ID = "profile-public-pen-name";
const PROFILE_PUBLIC_DESCRIPTION_ID = "profile-public-description";

const PROFILE_LOGOUT_BUTTON_CLASS = cn(
  "h-9 border-border px-4 text-foreground",
  PAGE_FOOTER_ACTION_BUTTON_CLASS,
);

export function ProfilePublicTab({
  avatarUrl,
  onAvatarChange,
  onSaved,
}: {
  avatarUrl: string | null;
  onAvatarChange: (url: string | null) => void;
  onSaved: () => void;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<CreatorProfile>(DEFAULT_CREATOR_PROFILE);
  const [saved, setSaved] = useState<CreatorProfile>(DEFAULT_CREATOR_PROFILE);
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);
  const [avatarSheetOpen, setAvatarSheetOpen] = useState(false);

  useEffect(() => {
    const publicProfile = loadProfileSettings().public;
    setDraft(publicProfile);
    setSaved(publicProfile);
    setLocalAvatar(publicProfile.avatarUrl);
    // 미리보기 이벤트는 헤더만 갱신하고, 작성 중인 draft는 덮어쓰지 않는다.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only
  }, []);

  const rawAvatar = localAvatar === "" ? null : (localAvatar ?? draft.avatarUrl);
  const displayAvatar = rawAvatar?.startsWith("blob:")
    ? rawAvatar
    : rawAvatar
      ? resolveProfileAvatarUrl(rawAvatar)
      : null;

  const displayPenName = draft.penName.trim() || DEFAULT_CREATOR_PROFILE.penName;
  const isDirty =
    draft.penName !== saved.penName ||
    draft.description !== saved.description ||
    rawAvatar !== saved.avatarUrl;

  const applyAvatar = (url: string | null) => {
    setLocalAvatar(url ?? "");
    dispatchProfileAvatarPreview(url);
    setDraft((prev) => ({ ...prev, avatarUrl: url }));
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    if (localAvatar?.startsWith("blob:")) URL.revokeObjectURL(localAvatar);
    applyAvatar(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleAvatarDelete = () => {
    if (localAvatar?.startsWith("blob:")) URL.revokeObjectURL(localAvatar);
    applyAvatar(null);
  };

  const handleSave = () => {
    const next: CreatorProfile = {
      ...draft,
      avatarUrl: rawAvatar,
    };
    saveCreatorProfile(next);
    setDraft(next);
    setSaved(next);
    onAvatarChange(rawAvatar);
    onSaved();
  };

  return (
    <div className={cn("flex flex-col max-lg:px-5", PROFILE_PAGE_STACK_GAP_CLASS)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-label="프로필 사진 선택"
        onChange={handleAvatarFileChange}
      />

      <div className="flex w-full items-center gap-4">
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={avatarSheetOpen}
          aria-label="프로필 사진 바꾸기"
          className="group relative h-24 w-24 shrink-0 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          onClick={() => setAvatarSheetOpen(true)}
        >
          <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-border bg-background-muted">
            {displayAvatar ? (
              <Image
                src={displayAvatar}
                alt=""
                width={96}
                height={96}
                unoptimized
                className="h-full w-full object-cover"
              />
            ) : (
              <ICONS.user className="h-10 w-10 text-foreground-placeholder" aria-hidden />
            )}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center justify-center bg-inverse/50 opacity-0 transition-opacity duration-short ease-standard group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              <ICONS.camera className="size-8 text-inverse-foreground" strokeWidth={1.75} />
            </span>
          </div>
        </button>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-heading4_700 text-foreground">{displayPenName}</span>
          <span className="truncate text-body3_400 text-foreground-muted">{draft.loginId}</span>
        </div>
      </div>

      <ProfileAvatarChangeDialog
        open={avatarSheetOpen}
        onOpenChange={setAvatarSheetOpen}
        canDelete={Boolean(displayAvatar)}
        onUpload={() => {
          queueMicrotask(() => fileInputRef.current?.click());
        }}
        onDelete={handleAvatarDelete}
      />

      <div className={cn("flex flex-col", PROFILE_PAGE_STACK_GAP_CLASS)}>
        <InputGroup>
          <FieldLabel size="sm" weight="600" htmlFor={PROFILE_PUBLIC_PEN_NAME_ID}>
            작가명
          </FieldLabel>
          <Input
            id={PROFILE_PUBLIC_PEN_NAME_ID}
            type="text"
            size="xl"
            value={draft.penName}
            maxLength={PROFILE_PEN_NAME_MAX}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, penName: e.target.value.slice(0, PROFILE_PEN_NAME_MAX) }))
            }
          />
          <InputHypertext count={draft.penName.length} max={PROFILE_PEN_NAME_MAX} />
        </InputGroup>

        <InputGroup>
          <FieldLabel size="sm" weight="600" htmlFor={PROFILE_PUBLIC_DESCRIPTION_ID}>
            소개
          </FieldLabel>
          <Textarea
            id={PROFILE_PUBLIC_DESCRIPTION_ID}
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
          <InputHypertext count={draft.description.length} max={PROFILE_DESCRIPTION_MAX} />
        </InputGroup>
      </div>

      <ProfileDirtySaveButton visible={isDirty} onClick={handleSave} />

      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          className={PROFILE_LOGOUT_BUTTON_CLASS}
          onClick={() => router.push("/")}
        >
          로그아웃
        </Button>
      </div>
    </div>
  );
}
