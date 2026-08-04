"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ICONS } from "@/lib/icons";
import { useRouter } from "next/navigation";
import { useIsLgUp } from "@/hooks/useMediaQuery";
import { PAGE_GUTTER_X_CLASS } from "@/lib/page-layout";
import { Button } from "design-system/ui/button";
import { Input, InputGroup, InputHypertext } from "@/components/ui/input";
import { Textarea } from "design-system/ui/textarea";
import { formDialogSheetStickyFooterClassName, MODAL_ACTION_BUTTON_SIZE, MOBILE_BOTTOM_SHEET_SCRIM_CLASS, MOBILE_BOTTOM_SHEET_SHELL_BASE_CLASS, mobileBottomSheetLargeMaxHeightClassName } from "@/components/ui/modal/modal-styles";
import { cn } from "design-system/utils";

const MODAL_WIDTH = 384;
const GAP_BELOW_ANCHOR = 8;
const VIEWPORT_MARGIN = 20;

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** 앵커(프로필 버튼) ref — lg+ 에서 버튼 바로 아래 배치 */
  anchorRef?: React.RefObject<HTMLElement | null>;
  /** 저장 시 선택한 프로필 이미지 URL(blob 등)을 전달하여 헤더 등에서 반영 */
  onSave?: (avatarUrl: string | null) => void;
}

const MAX_PEN_NAME = 50;
const MAX_DESCRIPTION = 500;

function ProfileEditFormFields({
  avatarPreview,
  penName,
  description,
  onPenNameChange,
  onDescriptionChange,
  onAvatarFileChange,
  fileInputRef,
  triggerAvatarFileSelect,
}: {
  avatarPreview: string | null;
  penName: string;
  description: string;
  onPenNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onAvatarFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  triggerAvatarFileSelect: () => void;
}) {
  return (
    <>
      <div className="flex w-full shrink-0 items-center justify-center self-stretch pt-5 pb-5">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          aria-label="프로필 사진 선택"
          onChange={onAvatarFileChange}
        />
        <div className="relative h-24 w-24">
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
            {avatarPreview ? (
              <Image
                src={avatarPreview}
                alt="프로필 미리보기"
                width={96}
                height={96}
                unoptimized
                className="h-full w-full object-cover"
              />
            ) : (
              <ICONS.user className="size-10 text-foreground-placeholder" aria-hidden />
            )}
          </div>
          <button
            type="button"
            onClick={triggerAvatarFileSelect}
            className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-inverse bg-inverse transition-colors hover:bg-inverse"
            aria-label="프로필 사진 변경"
          >
            <ICONS.pencil className="size-4 text-inverse-foreground" aria-hidden />
          </button>
        </div>
      </div>

      <div className="flex w-full flex-col gap-5">
        <div className="flex flex-col gap-3">
          <div className="text-body1_700 text-foreground">아이디</div>
          <InputGroup>
            <Input type="text" size="xl" disabled value="selly@linefriends.com" />
          </InputGroup>
        </div>

        <div className="flex flex-col gap-3">
          <div className="text-body1_700 text-foreground">작가명</div>
          <InputGroup>
            <Input
              type="text"
              size="xl"
              value={penName}
              onChange={(e) => onPenNameChange(e.target.value.slice(0, MAX_PEN_NAME))}
              maxLength={MAX_PEN_NAME}
            />
            <InputHypertext count={penName.length} max={MAX_PEN_NAME} />
          </InputGroup>
        </div>

        <div className="flex flex-col gap-3">
          <div className="text-body1_700 text-foreground">소개</div>
          <InputGroup>
            <Textarea
              placeholder="소개 내용을 작성해주세요."
              rows={5}
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value.slice(0, MAX_DESCRIPTION))}
              maxLength={MAX_DESCRIPTION}
              className="min-h-[120px] resize-none"
            />
            <InputHypertext count={description.length} max={MAX_DESCRIPTION} />
          </InputGroup>
        </div>
      </div>
    </>
  );
}

function ProfileEditFooter({
  onLogout,
  onCancel,
  onSave,
  mobile = false,
  className,
}: {
  onLogout: () => void;
  onCancel: () => void;
  onSave: () => void;
  mobile?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-between gap-2",
        mobile
          ? formDialogSheetStickyFooterClassName
          : "border-t border-border pt-3 pb-3",
        className,
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size={MODAL_ACTION_BUTTON_SIZE}
        className="min-w-0 px-2 text-destructive hover:text-destructive"
        onClick={onLogout}
      >
        로그아웃
      </Button>
      <div className="inline-flex items-center gap-2">
        <Button type="button" variant="outline" size={MODAL_ACTION_BUTTON_SIZE} onClick={onCancel}>
          취소
        </Button>
        <Button type="button" size={MODAL_ACTION_BUTTON_SIZE} onClick={onSave}>
          저장
        </Button>
      </div>
    </div>
  );
}

export function ProfileEditModal({ isOpen, onClose, anchorRef, onSave }: ProfileEditModalProps) {
  const router = useRouter();
  const isDesktop = useIsLgUp();
  const [position, setPosition] = useState<{ top: number; left: number; maxHeight: number } | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [penName, setPenName] = useState("사자이빨닦기");
  const [description, setDescription] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetPreview = useCallback(() => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(null);
  }, [avatarPreview]);

  const handleClose = useCallback(() => {
    resetPreview();
    onClose();
  }, [onClose, resetPreview]);

  const handleSave = useCallback(() => {
    onSave?.(avatarPreview ?? null);
    onClose();
  }, [avatarPreview, onClose, onSave]);

  const handleLogout = useCallback(() => {
    resetPreview();
    onClose();
    router.push("/");
  }, [onClose, resetPreview, router]);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const triggerAvatarFileSelect = () => fileInputRef.current?.click();

  const updatePosition = useCallback(() => {
    if (typeof document === "undefined") return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const leftClamp = (left: number) =>
      Math.max(VIEWPORT_MARGIN, Math.min(left, vw - VIEWPORT_MARGIN - MODAL_WIDTH));

    if (!anchorRef?.current) {
      const centeredLeft = (vw - MODAL_WIDTH) / 2;
      setPosition({
        top: 56,
        left: leftClamp(centeredLeft),
        maxHeight: vh - 56 - VIEWPORT_MARGIN,
      });
      return;
    }

    const anchor = anchorRef.current;
    const rect = anchor.getBoundingClientRect();
    let top = rect.bottom + GAP_BELOW_ANCHOR;
    const left = leftClamp(rect.left);
    top = Math.max(VIEWPORT_MARGIN, top);
    const maxHeight = vh - top - VIEWPORT_MARGIN;
    setPosition({ top, left, maxHeight });
  }, [anchorRef]);

  useLayoutEffect(() => {
    if (!isOpen || !isDesktop) return;
    updatePosition();
  }, [isOpen, isDesktop, updatePosition]);

  useLayoutEffect(() => {
    if (!isOpen || !isDesktop || typeof window === "undefined") return;
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [isOpen, isDesktop, updatePosition]);

  useEffect(() => {
    if (isDesktop || !isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleClose, isDesktop, isOpen]);

  if (!isOpen) return null;

  const formFields = (
    <ProfileEditFormFields
      avatarPreview={avatarPreview}
      penName={penName}
      description={description}
      onPenNameChange={setPenName}
      onDescriptionChange={setDescription}
      onAvatarFileChange={handleAvatarFileChange}
      fileInputRef={fileInputRef}
      triggerAvatarFileSelect={triggerAvatarFileSelect}
    />
  );

  if (!isDesktop) {
    const mobileSheet =
      typeof document !== "undefined"
        ? createPortal(
            <>
              <div className={MOBILE_BOTTOM_SHEET_SCRIM_CLASS} aria-hidden onClick={handleClose} />
              <div
                className={cn(
                  MOBILE_BOTTOM_SHEET_SHELL_BASE_CLASS,
                  mobileBottomSheetLargeMaxHeightClassName,
                )}
                role="dialog"
                aria-modal="true"
                aria-label="프로필편집"
              >
                <div
                  className={cn(
                    "flex w-full shrink-0 items-center justify-between border-b border-border py-4",
                    PAGE_GUTTER_X_CLASS,
                  )}
                >
                  <div className="text-body1_700 text-foreground">프로필편집</div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="닫기"
                    onClick={handleClose}
                    className="rounded-full text-foreground-placeholder -mr-2"
                  >
                    <ICONS.close className="h-5 w-5" aria-hidden />
                  </Button>
                </div>
                <div className={cn("min-h-0 flex-1 overflow-y-auto py-3", PAGE_GUTTER_X_CLASS)}>
                  {formFields}
                </div>
                <ProfileEditFooter
                  mobile
                  onLogout={handleLogout}
                  onCancel={handleClose}
                  onSave={handleSave}
                />
              </div>
            </>,
            document.body,
          )
        : null;

    return mobileSheet;
  }

  const hasAnchor = anchorRef !== undefined;
  const showCard = !hasAnchor || position !== null;

  const style: React.CSSProperties =
    position != null
      ? {
          top: position.top,
          left: position.left,
          width: MODAL_WIDTH,
          maxHeight: position.maxHeight,
        }
      : hasAnchor
        ? { width: MODAL_WIDTH }
        : {
            top: 56,
            left: "50%",
            transform: "translateX(-50%)",
            width: MODAL_WIDTH,
            maxHeight: "calc(100vh - 76px)",
          };

  const desktopContent = (
    <>
      <div className="fixed inset-0 z-modal" onClick={handleClose} aria-hidden />
      {showCard ? (
        <div className="fixed z-sticky animate-in fade-in zoom-in-95 duration-short" style={style}>
          <div
            ref={cardRef}
            className="relative flex w-full max-w-96 flex-col items-start justify-start overflow-y-auto rounded-sm border border-border bg-background shadow-elevation-50"
            style={position ? { maxHeight: position.maxHeight } : undefined}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="inline-flex h-16 w-full shrink-0 items-center justify-between pl-5 pr-2 pb-2 pt-4">
              <div className="text-heading5_700 text-foreground">프로필편집</div>
              <Button
                variant="ghost"
                size="icon-xl"
                onClick={handleClose}
                className="rounded-full text-foreground-muted"
                aria-label="닫기"
              >
                <ICONS.close className="h-6 w-6" aria-hidden />
              </Button>
            </div>

            <div className="w-full px-5">{formFields}</div>

            <ProfileEditFooter
              className="w-full px-5 pb-5"
              onLogout={handleLogout}
              onCancel={handleClose}
              onSave={handleSave}
            />
          </div>
        </div>
      ) : null}
    </>
  );

  const portal = typeof document !== "undefined" ? document.getElementById("profile-modal-portal") : null;
  if (portal) {
    return createPortal(desktopContent, portal);
  }
  return desktopContent;
}
