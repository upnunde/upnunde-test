"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_CREATOR_PROFILE,
  loadProfileSettings,
  PROFILE_AVATAR_PREVIEW_EVENT,
  PROFILE_UPDATED_EVENT,
  resolveProfileAvatarUrl,
} from "@/lib/profile-storage";

/** 헤더·마이페이지 등 전역 프로필 아바타 URL — storage + 미리보기 이벤트 동기화 */
export function useProfileAvatarUrl() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(DEFAULT_CREATOR_PROFILE.avatarUrl);

  const syncFromStorage = useCallback(() => {
    setAvatarUrl(loadProfileSettings().public.avatarUrl);
  }, []);

  useEffect(() => {
    const onPreview = (event: Event) => {
      const next = (event as CustomEvent<string | null>).detail ?? null;
      if (next?.startsWith("blob:")) {
        setAvatarUrl(next);
        return;
      }
      setAvatarUrl(resolveProfileAvatarUrl(next));
    };

    syncFromStorage();
    window.addEventListener(PROFILE_UPDATED_EVENT, syncFromStorage);
    window.addEventListener(PROFILE_AVATAR_PREVIEW_EVENT, onPreview);
    return () => {
      window.removeEventListener(PROFILE_UPDATED_EVENT, syncFromStorage);
      window.removeEventListener(PROFILE_AVATAR_PREVIEW_EVENT, onPreview);
    };
  }, [syncFromStorage]);

  return [avatarUrl, setAvatarUrl] as const;
}
