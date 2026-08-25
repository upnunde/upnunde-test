"use client";

import React from "react";
import Image from "next/image";
import { FormFieldLabel } from "@/components/ui/field-label";
import { FORM_LABEL_CONTROL_STACK_CLASS } from "@/lib/form-field-styles";
import { AddResourceSlot } from "@/components/resource/cards/AddResourceSlot";
import {
  THUMBNAIL_SLOT_ARIA,
  THUMBNAIL_DIM_OVERLAY_CLASS,
} from "@/lib/thumbnail-styles";
import { ICONS } from "@/lib/icons";

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
  return (
    <div className={FORM_LABEL_CONTROL_STACK_CLASS}>
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
          className="group relative flex h-[160px] w-[90px] cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-border-emphasis bg-background"
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
        <AddResourceSlot
          variant="img9:16"
          slotKind="thumbnail"
          error={error}
          ariaLabel={addAriaLabel}
          labelRef={labelRef}
          fileInput={{
            id: inputId,
            accept,
            inputRef,
            onChange: (event) => {
              const file = event.target.files?.[0];
              if (file) onFileSelected(file);
              event.target.value = "";
            },
          }}
        />
      )}
    </div>
  );
}
