"use client";

import type { ReactNode } from "react";
import {
  PREVIEW_DEVICE_FRAME_INNER_CLASS,
  PREVIEW_DEVICE_FRAME_OUTER_CLASS,
  PREVIEW_PLAYER_ROOT_CLASS,
} from "@/lib/preview-overlay-styles";
import {
  PREVIEW_PHONE_FRAME_INNER_MOBILE_FILL_CLASS,
  PREVIEW_PHONE_FRAME_MOBILE_FILL_CLASS,
} from "@/components/preview/PreviewPhoneDialog";
import { cn } from "design-system/utils";

interface IPhone15ProFrameProps {
  children: ReactNode;
  className?: string;
  /**
   * true면 max-lg에서 디바이스 비젤을 제거하고 부모를 가득 채운다.
   * PreviewPhoneDialog(모달→모바일 풀페이지)와 함께 쓴다.
   */
  fillOnMobile?: boolean;
}

export function IPhone15ProFrame({
  children,
  className,
  fillOnMobile = false,
}: IPhone15ProFrameProps) {
  return (
    <div
      className={cn(
        PREVIEW_DEVICE_FRAME_OUTER_CLASS,
        fillOnMobile && PREVIEW_PHONE_FRAME_MOBILE_FILL_CLASS,
        className,
      )}
    >
      <div
        className={cn(
          PREVIEW_DEVICE_FRAME_INNER_CLASS,
          PREVIEW_PLAYER_ROOT_CLASS,
          fillOnMobile && PREVIEW_PHONE_FRAME_INNER_MOBILE_FILL_CLASS,
        )}
      >
        {children}
      </div>
    </div>
  );
}
