"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useIsLgUp } from "@/hooks/useMediaQuery";
import { PAGE_GUTTER_X_CLASS } from "@/lib/page-layout";
import { mobileBottomSheetMaxHeightClassName, MOBILE_BOTTOM_SHEET_PAD_CLASS } from "@/components/ui/modal/modal-styles";
import { cn } from "@/lib/utils";

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
      <div className="self-stretch shrink-0 pt-my-20 pb-my-20 inline-flex justify-center items-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          aria-label="프로필 사진 선택"
          onChange={onAvatarFileChange}
        />
        <div className="relative h-24 w-24">
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
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
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-on-surface-30"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            )}
          </div>
          <button
            type="button"
            onClick={triggerAvatarFileSelect}
            className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-white bg-[#2d2d2d] transition-colors hover:bg-black"
            aria-label="프로필 사진 변경"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          </button>
        </div>
      </div>

      <div className="flex w-full flex-col gap-my-20">
        <div className="flex flex-col gap-my-12">
          <div className="text-body1_700 text-on-surface-10">아이디</div>
          <div className="flex h-[42px] items-center overflow-hidden rounded-md border border-slate-200 bg-slate-100 px-my-16">
            <input
              type="text"
              disabled
              value="selly@linefriends.com"
              className="w-full bg-transparent text-body1_400 text-on-surface-30 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-my-12">
          <div className="text-body1_700 text-on-surface-10">작가명</div>
          <div className="flex flex-col gap-my-8">
            <div className="flex h-[42px] items-center overflow-hidden rounded-md border border-slate-200 bg-white px-my-16 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400/30">
              <input
                type="text"
                value={penName}
                onChange={(e) => onPenNameChange(e.target.value.slice(0, MAX_PEN_NAME))}
                maxLength={MAX_PEN_NAME}
                className="w-full bg-transparent text-body1_500 text-on-surface-10 focus:outline-none placeholder:text-on-surface-30"
              />
            </div>
            <div className="text-right text-caption1_400 tabular-nums text-on-surface-30">
              {penName.length}/{MAX_PEN_NAME}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-my-12">
          <div className="text-body1_700 text-on-surface-10">소개</div>
          <div className="flex flex-col gap-my-8">
            <div className="flex h-[120px] items-stretch rounded-lg border border-slate-200 bg-white p-my-16 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400/30">
              <textarea
                placeholder="소개 내용을 작성해주세요."
                rows={5}
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value.slice(0, MAX_DESCRIPTION))}
                maxLength={MAX_DESCRIPTION}
                className="h-full min-h-0 w-full resize-none bg-transparent text-body1_400 text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none"
              />
            </div>
            <div className="text-right text-caption1_400 tabular-nums text-on-surface-30">
              {description.length}/{MAX_DESCRIPTION}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ProfileEditFooter({
  onLogout,
  onCancel,
  onSave,
  className,
}: {
  onLogout: () => void;
  onCancel: () => void;
  onSave: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex shrink-0 items-center justify-between gap-my-8 border-t border-border-10 pt-my-12 pb-my-12", className)}>
      <button
        type="button"
        onClick={onLogout}
        className="flex h-9 min-w-20 items-center justify-center rounded-lg bg-transparent transition-colors hover:bg-red-50"
      >
        <span className="text-body1_500 text-red-600">로그아웃</span>
      </button>
      <div className="inline-flex items-center gap-my-8">
        <button
          type="button"
          onClick={onCancel}
          className="flex h-9 min-w-20 items-center justify-center rounded-md border border-slate-200 px-my-12 text-slate-700 transition-colors hover:bg-slate-50"
        >
          <span className="text-body1_500">취소</span>
        </button>
        <button
          type="button"
          onClick={onSave}
          className="flex h-9 min-w-20 items-center justify-center rounded-md bg-slate-800 px-my-12 transition-colors hover:bg-slate-900"
        >
          <span className="text-body1_500 text-white">저장</span>
        </button>
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
              <div className="fixed inset-0 z-40 bg-black/50" aria-hidden onClick={handleClose} />
              <div
                className={cn(
                  "fixed inset-x-0 z-50 flex min-h-0 flex-col rounded-t-[4px] border-t border-border-10 bg-white shadow-elevation-40",
                  MOBILE_BOTTOM_SHEET_PAD_CLASS,
                  mobileBottomSheetMaxHeightClassName,
                )}
                role="dialog"
                aria-modal="true"
                aria-label="프로필편집"
              >
                <div
                  className={cn(
                    "flex w-full shrink-0 items-center justify-between border-b border-border-10 py-my-16",
                    PAGE_GUTTER_X_CLASS,
                  )}
                >
                  <div className="text-body1_700 text-on-surface-10">프로필편집</div>
                  <button
                    type="button"
                    aria-label="닫기"
                    onClick={handleClose}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-on-surface-30 transition-colors hover:bg-surface-20/60 hover:text-on-surface-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                    style={{ marginRight: -8 }}
                  >
                    <X className="h-5 w-5" aria-hidden />
                  </button>
                </div>
                <div className={cn("min-h-0 flex-1 overflow-y-auto py-my-12", PAGE_GUTTER_X_CLASS)}>
                  {formFields}
                </div>
                <ProfileEditFooter
                  className={PAGE_GUTTER_X_CLASS}
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
      <div className="fixed inset-0 z-40" onClick={handleClose} aria-hidden />
      {showCard ? (
        <div className="fixed z-50 animate-in fade-in zoom-in-95 duration-200" style={style}>
          <div
            ref={cardRef}
            className="relative flex w-full max-w-96 flex-col items-start justify-start overflow-y-auto rounded-[4px] border border-slate-200 bg-white shadow-elevation-50"
            style={position ? { maxHeight: position.maxHeight } : undefined}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="inline-flex h-16 w-full shrink-0 items-center justify-between pl-5 pr-2 pb-2 pt-4">
              <div className="text-heading5_700 text-on-surface-10">프로필편집</div>
              <button
                type="button"
                onClick={handleClose}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100"
                aria-label="닫기"
              >
                <X className="h-6 w-6" aria-hidden />
              </button>
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
