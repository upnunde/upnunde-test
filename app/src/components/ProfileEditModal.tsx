"use client";

import React, { useLayoutEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

const MODAL_WIDTH = 384;
const GAP_BELOW_ANCHOR = 8;
const VIEWPORT_MARGIN = 20;

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** 앵커(프로필 버튼) ref - 있으면 버튼 바로 아래, 뷰포트 20px 이내로 배치 */
  anchorRef?: React.RefObject<HTMLElement | null>;
  /** 저장 시 선택한 프로필 이미지 URL(blob 등)을 전달하여 헤더 등에서 반영 */
  onSave?: (avatarUrl: string | null) => void;
}

export function ProfileEditModal({ isOpen, onClose, anchorRef, onSave }: ProfileEditModalProps) {
  const router = useRouter();
  const [position, setPosition] = useState<{ top: number; left: number; maxHeight: number } | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const triggerAvatarFileSelect = () => fileInputRef.current?.click();

  const updatePosition = React.useCallback(() => {
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
    let left = leftClamp(rect.left);
    top = Math.max(VIEWPORT_MARGIN, top);
    const maxHeight = vh - top - VIEWPORT_MARGIN;
    setPosition({ top, left, maxHeight });
  }, [anchorRef]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    updatePosition();
  }, [isOpen, updatePosition]);

  // 스크린 리사이즈 시 앵커 기준으로 위치 다시 계산 (넓어져도 모달이 따라감)
  useLayoutEffect(() => {
    if (!isOpen || typeof window === "undefined") return;
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [isOpen, updatePosition]);

  if (!isOpen) return null;

  // anchorRef가 있으면 위치 계산이 끝난 뒤에만 카드 표시 → 프로필 바로 아래 고정 좌표로만 노출, 중앙으로 갔다 이동하는 느낌 제거
  const hasAnchor = !!anchorRef?.current;
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

  const content = (
    <>
      {/* 바깥 영역 클릭 시 모달 닫기 */}
      <div
        className="fixed inset-0 z-40"
        onClick={() => {
          if (avatarPreview) URL.revokeObjectURL(avatarPreview);
          setAvatarPreview(null);
          onClose();
        }}
        aria-hidden
      />
      {showCard && (
      <div
        className="fixed z-50 animate-in fade-in zoom-in-95 duration-200"
        style={style}
      >
        {/* Modal Card: 프로필 버튼 바로 아래 고정 배치 */}
        <div
          ref={cardRef}
          className="w-full max-w-96 relative bg-white rounded-2xl shadow-[0px_8px_16px_8px_rgba(0,0,0,0.16)] border border-slate-200 flex flex-col justify-start items-start overflow-y-auto"
          style={position ? { maxHeight: position.maxHeight } : undefined}
          onClick={(e) => e.stopPropagation()}
        >

        {/* Header */}
        <div className="self-stretch h-16 pl-5 pr-2 pt-4 pb-2 border-b border-slate-200 inline-flex justify-between items-center shrink-0">
          <div className="text-slate-800 text-lg font-bold leading-6">
            프로필편집
          </div>
          {/* Close Button */}
          <button
            type="button"
            onClick={() => {
              if (avatarPreview) URL.revokeObjectURL(avatarPreview);
              setAvatarPreview(null);
              onClose();
            }}
            className="w-10 h-10 rounded-full flex justify-center items-center cursor-pointer hover:bg-slate-100 transition-colors text-slate-600"
            aria-label="닫기"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {/* Avatar Section */}
        <div className="self-stretch pt-10 pb-5 inline-flex justify-center items-center shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            aria-label="프로필 사진 선택"
            onChange={handleAvatarFileChange}
          />
          <div className="w-24 h-24 relative">
            <div className="w-24 h-24 left-0 top-0 absolute bg-slate-100 rounded-full overflow-hidden flex items-center justify-center border border-slate-200">
              {avatarPreview ? (
                <img src={avatarPreview} alt="프로필 미리보기" className="w-full h-full object-cover" />
              ) : (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              )}
            </div>
            {/* Edit Badge: 펜 아이콘 20x20, 클릭 시 OS 폴더(파일 선택) 열기 */}
            <button
              type="button"
              onClick={triggerAvatarFileSelect}
              className="w-8 h-8 left-[64px] top-[64px] absolute bg-[#2d2d2d] rounded-[999px] inline-flex justify-center items-center overflow-hidden cursor-pointer hover:bg-black transition-colors border-2 border-white"
              aria-label="프로필 사진 변경"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="self-stretch p-5 flex flex-col justify-start items-start gap-5">

          {/* ID Field */}
          <div className="self-stretch flex flex-col justify-start items-start gap-3">
            <div className="flex flex-col justify-start items-start gap-1">
              <div className="text-slate-800 text-base font-bold leading-5">아이디</div>
            </div>
            <div className="self-stretch rounded flex flex-col justify-center items-start gap-2">
              <div className="self-stretch h-12 px-4 bg-slate-100 rounded-md border border-slate-200 inline-flex justify-start items-center overflow-hidden">
                <input
                  type="text"
                  disabled
                  value="selly@linefriends.com"
                  className="w-full bg-transparent text-slate-500 text-base font-normal leading-6 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Pen Name Field */}
          <div className="self-stretch flex flex-col justify-start items-start gap-3">
            <div className="flex flex-col justify-start items-start gap-1">
              <div className="text-slate-800 text-base font-bold leading-5">작가명</div>
            </div>
            <div className="self-stretch rounded flex flex-col justify-center items-start gap-2">
              <div className="self-stretch h-12 px-4 bg-white rounded-md border border-slate-200 inline-flex justify-start items-center overflow-hidden focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400/30">
                <input
                  type="text"
                  defaultValue="사자이빨닦기"
                  className="w-full bg-transparent text-slate-900 text-base font-medium leading-6 focus:outline-none placeholder:text-slate-400"
                />
              </div>
              <div className="self-stretch inline-flex justify-end items-center gap-2">
                <div className="text-right text-slate-500 text-xs font-normal leading-4">0/50</div>
              </div>
            </div>
          </div>

          {/* Description Field */}
          <div className="self-stretch flex flex-col justify-start items-start gap-3">
            <div className="flex flex-col justify-start items-start gap-1">
              <div className="text-slate-800 text-base font-bold leading-5">소개</div>
            </div>
            <div className="self-stretch max-h-[28rem] min-h-24 flex flex-col justify-start items-start gap-2">
              <div className="self-stretch h-[120px] max-h-[28rem] p-4 relative bg-white rounded-lg border border-slate-200 flex justify-start items-stretch focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400/30">
                <textarea
                  placeholder="소개 내용을 작성해주세요."
                  rows={5}
                  className="w-full h-full bg-transparent text-slate-900 placeholder:text-slate-400 text-base font-normal leading-6 focus:outline-none resize-none"
                  style={{ height: "100%" }}
                />
              </div>
              <div className="self-stretch inline-flex justify-end items-center gap-2">
                <div className="text-right text-slate-500 text-xs font-normal leading-4">0/500</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="self-stretch px-5 pb-5 flex justify-between items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (avatarPreview) URL.revokeObjectURL(avatarPreview);
              setAvatarPreview(null);
              onClose();
              router.push("/login");
            }}
            className="h-10 min-w-20 -ml-2 bg-transparent rounded-lg flex justify-center items-center hover:bg-red-50 transition-colors"
          >
            <span className="text-red-600 text-base font-medium leading-5">로그아웃</span>
          </button>
          <div className="inline-flex justify-end items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (avatarPreview) URL.revokeObjectURL(avatarPreview);
                setAvatarPreview(null);
                onClose();
              }}
              className="h-10 min-w-20 px-4 rounded-md border border-slate-200 flex justify-center items-center text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <span className="text-base font-medium leading-5">취소</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onSave?.(avatarPreview ?? null);
                onClose();
              }}
              className="h-10 min-w-20 px-4 bg-slate-800 rounded-md flex justify-center items-center hover:bg-slate-900 transition-colors"
            >
              <span className="text-white text-base font-medium leading-5">저장</span>
            </button>
          </div>
        </div>

      </div>
    </div>
      )}
    </>
  );

  const portal = typeof document !== "undefined" ? document.getElementById("profile-modal-portal") : null;
  if (portal) {
    return createPortal(content, portal);
  }
  return content;
}
