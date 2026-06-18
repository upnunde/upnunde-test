"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PageCard } from "@/components/layout/PageCard";
import { AddResourceSlot } from "@/components/resource/cards/AddResourceSlot";
import { createOptimizedImageObjectUrl } from "@/lib/image-upload-compress";
import { THUMBNAIL_SLOT_ARIA } from "@/lib/thumbnail-styles";
import { ImageCard } from "@/components/resource/cards/ImageCard";
import { Title1 } from "@/components/ui/title1";
import { Title2 } from "@/components/ui/title2";
import { ImageCropPosterModal } from "@/components/resource/character/CharacterExpressionModal";
import {
  formDialogSheetEpisodeFormClassName,
  formDialogSheetScrollBodyClassName,
  formDialogSheetStickyFooterClassName,
} from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { EPISODE_FORM_FIELD_COPY } from "@/lib/episode-form-copy";
import type { ImageResource } from "@/types/resource";

const MAX_TITLE = 50;
const MAX_SUMMARY = 100;
const EPISODE_FORM_THUMBNAIL_FILE_INPUT_ID = "episode-form-thumbnail-file";

export interface EpisodeFormSubmitPayload {
  title: string;
  summary: string;
  thumbnailUrl: string;
}

export interface EpisodeFormInitialValues {
  title?: string;
  summary?: string;
  thumbnailUrl?: string;
}

export interface EpisodeFormProps {
  onConverted?: (payload: EpisodeFormSubmitPayload) => void;
  onCancel?: () => void;
  containerClassName?: string;
  stickyFooter?: boolean;
  sectionTitle?: string;
  submitLabel?: string;
  initialValues?: EpisodeFormInitialValues;
}

export function EpisodeForm({
  onConverted,
  onCancel,
  containerClassName,
  stickyFooter = false,
  sectionTitle = "에피소드",
  submitLabel = "생성하기",
  initialValues,
}: EpisodeFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [summary, setSummary] = useState(initialValues?.summary ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(initialValues?.thumbnailUrl ?? "");

  const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false);
  const [thumbnailModalInitialSlots, setThumbnailModalInitialSlots] =
    useState<{ id: string; expressionLabel: string; imageUrl?: string }[] | null>(null);
  const [pendingThumbnailUrl, setPendingThumbnailUrl] = useState<string | null>(null);
  const isAiFilling = false;

  useEffect(() => {
    setTitle(initialValues?.title ?? "");
    setSummary(initialValues?.summary ?? "");
    setThumbnailUrl(initialValues?.thumbnailUrl ?? "");
  }, [initialValues?.summary, initialValues?.thumbnailUrl, initialValues?.title]);

  useEffect(() => {
    return () => {
      if (thumbnailUrl && thumbnailUrl.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailUrl);
      }
      if (pendingThumbnailUrl && pendingThumbnailUrl.startsWith("blob:")) {
        URL.revokeObjectURL(pendingThumbnailUrl);
      }
    };
  }, [thumbnailUrl, pendingThumbnailUrl]);

  const handleThumbnailClick = useCallback(() => {
    if (!thumbnailUrl) return;
    setThumbnailModalInitialSlots([
      { id: "episode-thumbnail", expressionLabel: "", imageUrl: thumbnailUrl },
    ]);
    setThumbnailModalOpen(true);
  }, [thumbnailUrl]);

  const handleThumbnailRemove = useCallback(() => {
    setThumbnailUrl((prev) => {
      if (prev && prev.startsWith("blob:")) {
        URL.revokeObjectURL(prev);
      }
      return "";
    });
  }, []);

  const thumbnailItem: ImageResource = {
    id: "episode-thumbnail",
    name: "대표 이미지",
    imageUrl: thumbnailUrl,
  };

  const handleThumbnailFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = (e.target.files ?? [])[0];
      e.target.value = "";
      if (!file || !file.type.startsWith("image/")) return;

      void (async () => {
        try {
          const objectUrl = await createOptimizedImageObjectUrl(file);
          setPendingThumbnailUrl((prev) => {
            if (prev && prev.startsWith("blob:")) {
              URL.revokeObjectURL(prev);
            }
            return objectUrl;
          });
          setThumbnailModalInitialSlots([
            { id: "episode-thumbnail", expressionLabel: "", imageUrl: objectUrl },
          ]);
          setThumbnailModalOpen(true);
        } catch (err) {
          console.error("Thumbnail prepare failed:", err);
        }
      })();
    },
    [],
  );

  const isFormComplete =
    title.trim().length > 0 &&
    summary.trim().length > 0 &&
    thumbnailUrl.trim().length > 0;

  const handleCreateEpisode = useCallback(() => {
    if (!isFormComplete || isAiFilling) return;
    onConverted?.({
      title: title.trim(),
      summary: summary.trim(),
      thumbnailUrl: thumbnailUrl.trim(),
    });
  }, [isAiFilling, isFormComplete, onConverted, summary, thumbnailUrl, title]);

  const footer = (
    <div
      className={cn(
        "flex justify-end gap-my-8",
        stickyFooter ? formDialogSheetStickyFooterClassName : "mt-8",
      )}
    >
      <Button type="button" variant="outline" onClick={onCancel}>
        취소
      </Button>
      <Button
        type="button"
        onClick={handleCreateEpisode}
        disabled={!isFormComplete || isAiFilling}
        title={
          isFormComplete
            ? undefined
            : `제목, 요약, 대표 이미지가 모두 채워져야 ${submitLabel.replace("하기", "")}할 수 있어요`
        }
      >
        {submitLabel}
      </Button>
    </div>
  );

  const formFields = (
    <div className="mt-0 flex flex-col gap-my-24">
      <div className="flex flex-col gap-my-12">
        <Title1
          text="에피소드 제목*"
          variant="title-subtitle-dot"
          subtitleText={EPISODE_FORM_FIELD_COPY.title.subtitle}
        />
        <input
          type="text"
          maxLength={MAX_TITLE}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isAiFilling}
          placeholder={EPISODE_FORM_FIELD_COPY.title.placeholder}
          className="h-[42px] w-full rounded-md border border-border-10 bg-white px-my-12 py-my-8 text-body3_400 text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
        />
        <div className="flex justify-end text-caption1_400 text-on-surface-30">
          {title.length}/{MAX_TITLE}
        </div>
      </div>

      <div className="flex flex-col gap-my-12">
        <Title1
          text="에피소드 요약*"
          variant="title-subtitle-dot"
          subtitleText={EPISODE_FORM_FIELD_COPY.summary.subtitle}
        />
        <input
          type="text"
          maxLength={MAX_SUMMARY}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          disabled={isAiFilling}
          placeholder={EPISODE_FORM_FIELD_COPY.summary.placeholder}
          className="h-[42px] w-full rounded-md border border-border-10 bg-white px-my-12 py-my-8 text-body3_400 text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
        />
        <div className="flex justify-end text-caption1_400 text-on-surface-30">
          {summary.length}/{MAX_SUMMARY}
        </div>
      </div>

      <div className="flex flex-col gap-my-12">
        <Title1
          text="대표 이미지*"
          variant="title-subtitle-dot"
          subtitleText={EPISODE_FORM_FIELD_COPY.thumbnail.subtitle}
        />
        {thumbnailUrl ? (
          <ImageCard
            item={thumbnailItem}
            slotType="img9:16"
            showName={false}
            onDetailClick={handleThumbnailClick}
            onDeleteClick={handleThumbnailRemove}
          />
        ) : (
          <AddResourceSlot
            variant="img9:16"
            slotKind="thumbnail"
            ariaLabel={THUMBNAIL_SLOT_ARIA.addRepresentativeImage}
            fileInput={{
              id: EPISODE_FORM_THUMBNAIL_FILE_INPUT_ID,
              accept: "image/*",
              onChange: handleThumbnailFileChange,
            }}
          />
        )}
      </div>
    </div>
  );

  return (
    <>
      <div
        className={cn(
          stickyFooter
            ? cn(formDialogSheetEpisodeFormClassName, "flex min-h-0 w-full flex-1 flex-col", containerClassName)
            : cn(
                "mx-auto w-full min-w-0 max-w-[1200px] rounded-[4px] border border-border-10 bg-white shadow-none",
                containerClassName,
              ),
        )}
      >
        <Title2 text={sectionTitle} asSectionHeader className="shrink-0" />

        {stickyFooter ? (
          <div
            className={cn(
              formDialogSheetScrollBodyClassName,
              "px-my-16 pt-my-20",
            )}
          >
            {formFields}
          </div>
        ) : (
          <PageCard className="mx-0 max-w-none min-w-0 border-0 rounded-none px-my-20 pt-my-20 pb-my-20 shadow-none">
            {formFields}
            {footer}
          </PageCard>
        )}

        {stickyFooter && footer}
        <ImageCropPosterModal
          open={thumbnailModalOpen}
          onClose={() => {
            setThumbnailModalOpen(false);
            setThumbnailModalInitialSlots(null);
            setPendingThumbnailUrl((prev) => {
              if (prev && prev.startsWith("blob:")) {
                URL.revokeObjectURL(prev);
              }
              return null;
            });
          }}
          initialSlots={thumbnailModalInitialSlots ?? []}
          onSave={(slots) => {
            const saved = slots[0];
            if (saved?.imageUrl) {
              setThumbnailUrl((prev) => {
                if (prev && prev.startsWith("blob:") && prev !== saved.imageUrl) {
                  URL.revokeObjectURL(prev);
                }
                return saved.imageUrl ?? "";
              });
            }
            setThumbnailModalOpen(false);
            setThumbnailModalInitialSlots(null);
            setPendingThumbnailUrl((prev) => {
              if (prev && prev.startsWith("blob:") && prev !== saved?.imageUrl) {
                URL.revokeObjectURL(prev);
              }
              return null;
            });
          }}
        />
      </div>
    </>
  );
}
