"use client";

import React from "react";
import Image from "next/image";
import { FormFieldLabel } from "@/components/ui/field-label";
import {
  RESOURCE_FILE_INPUT_OVERLAY_CLASS,
  THUMBNAIL_SLOT_ARIA,
  THUMBNAIL_DIM_OVERLAY_CLASS,
} from "@/lib/thumbnail-styles";
import { ICONS } from "@/lib/icons";
import { cn } from "design-system/utils";

interface SeriesImageUploadFieldProps {
  label: string;
  subtitle: string;
  previewUrl: string | null;
  previewAlt: string;
  /** 빈 슬롯 클릭 시 접근성 라벨 (기본: "이미지 추가") */
  addAriaLabel?: string;
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
  addAriaLabel = THUMBNAIL_SLOT_ARIA.addImage,
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
  const slotClassName = cn(
    "mt-2 relative flex h-[160px] w-[90px] cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed bg-background",
    error ? "border-destructive" : "border-border",
  );

  return (
    <div className="flex flex-col gap-1">
      <FormFieldLabel title={label} subtitle={subtitle} inputId={inputId} />
      {previewUrl ? (
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
          className={cn(slotClassName, "group")}
        >
          <Image
            key={previewUrl}
            src={previewUrl}
            alt={previewAlt}
            fill
            sizes="90px"
            unoptimized
            className="object-cover"
          />
          <div className={THUMBNAIL_DIM_OVERLAY_CLASS} aria-hidden />
          <button
            type="button"
            aria-label={deleteAriaLabel}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClearPreview();
            }}
            className="absolute right-1 top-1 hidden h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-background text-foreground shadow-elevation-10 group-hover:inline-flex hover:bg-muted"
          >
            <ICONS.trash2 className="size-4" aria-hidden />
          </button>
        </label>
      ) : (
        <label ref={labelRef} className={slotClassName} aria-label={addAriaLabel}>
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept={accept}
            className={RESOURCE_FILE_INPUT_OVERLAY_CLASS}
            aria-label={addAriaLabel}
            tabIndex={-1}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onFileSelected(file);
              }
              e.target.value = "";
            }}
          />
          <div className="pointer-events-none relative z-0 flex h-6 w-6 items-center justify-center text-foreground">
            <ICONS.plus className="size-5" aria-hidden />
          </div>
        </label>
      )}
    </div>
  );
}
