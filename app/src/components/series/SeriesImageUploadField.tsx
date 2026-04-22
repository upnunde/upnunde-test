"use client";

import React from "react";
import Image from "next/image";
import { Title1 } from "@/components/ui/title1";
import { cn } from "@/lib/utils";

interface SeriesImageUploadFieldProps {
  label: string;
  subtitle: string;
  previewUrl: string | null;
  previewAlt: string;
  deleteAriaLabel: string;
  inputId: string;
  accept: string;
  error: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  labelRef: React.RefObject<HTMLLabelElement | null>;
  onActivate: () => void;
  onClearPreview: () => void;
  onFileSelected: (file: File) => void;
}

export function SeriesImageUploadField({
  label,
  subtitle,
  previewUrl,
  previewAlt,
  deleteAriaLabel,
  inputId,
  accept,
  error,
  inputRef,
  labelRef,
  onActivate,
  onClearPreview,
  onFileSelected,
}: SeriesImageUploadFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <Title1 text={label} variant="title-subtitle-dot" subtitleText={subtitle} />
      <label
        ref={labelRef}
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.preventDefault();
          onActivate();
        }}
        onKeyDown={(e) => {
          if (e.key !== "Enter" && e.key !== " ") return;
          e.preventDefault();
          onActivate();
        }}
        className={cn(
          "mt-2 relative flex h-[160px] w-[90px] cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed bg-white group",
          error ? "border-destructive" : "border-border-20"
        )}
      >
        {previewUrl ? (
          <>
            <Image
              key={previewUrl}
              src={previewUrl}
              alt={previewAlt}
              fill
              sizes="90px"
              unoptimized
              className="object-cover"
            />
            <button
              type="button"
              aria-label={deleteAriaLabel}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClearPreview();
              }}
              className="absolute right-1 top-1 hidden h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-surface-10 text-on-surface-10 shadow-sm group-hover:inline-flex hover:bg-slate-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>
          </>
        ) : (
          <div className="relative flex h-6 w-6 items-center justify-center text-on-surface-10">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
      </label>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onFileSelected(file);
          }
          e.target.value = "";
        }}
      />
    </div>
  );
}
