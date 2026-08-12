"use client";

import { IconButton } from "@/components/ui/icon-button";
import { ICONS } from "@/lib/icons";
import { cn } from "design-system/utils";

/** 아바타 우하단 편집 FAB — inverse 면 + DS icon-sm circle */
const PROFILE_AVATAR_EDIT_BUTTON_CLASS =
  "absolute bottom-0 right-0 border-2 border-inverse bg-inverse hover:bg-inverse data-[hovered=true]:bg-inverse";

export function ProfileAvatarEditButton({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <IconButton
      type="button"
      icon={ICONS.pencil}
      variant="default"
      tone="neutral"
      shape="circle"
      size="icon-sm"
      onClick={onClick}
      className={cn(PROFILE_AVATAR_EDIT_BUTTON_CLASS, className)}
      iconClassName="text-inverse-foreground"
      aria-label="프로필 사진 변경"
    />
  );
}
