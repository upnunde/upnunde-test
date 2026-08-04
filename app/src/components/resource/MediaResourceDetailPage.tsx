"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { ICONS } from "@/lib/icons";
import { Button } from "design-system/ui/button";
import { HeaderBackButton } from "@/components/ui/header-back-button";
import { Input, InputGroup, InputHypertext } from "@/components/ui/input";
import { Textarea } from "design-system/ui/textarea";
import { FloatingAiComposerPortal } from "@/components/ui/FloatingAiComposerPortal";
import { FLOATING_COMPOSER_SCROLL_PAD_CLASS } from "@/components/ui/floating-composer-bar";
import { AddResourceSlot } from "@/components/resource/cards/AddResourceSlot";
import { createOptimizedImageObjectUrl } from "@/lib/image-upload-compress";
import {
  RESOURCE_THUMBNAIL_FIXED_9_16_CLASS,
  THUMBNAIL_DIM_OVERLAY_CLASS,
  THUMBNAIL_META_BAR_DIM_CLASS,
  THUMBNAIL_SLOT_ARIA,
  thumbnailHoverDimOverlayClass,
  DIM_OVERLAY_TEXT_CLASS,
} from "@/lib/thumbnail-styles";
import { FormFieldLabel, formFieldAriaDescribedBy } from "@/components/ui/field-label";
import { Title2 } from "@/components/ui/title2";
import {
  PAGE_CARD_SHELL_MOBILE_FLUSH_CLASS,
  PAGE_CONTENT_BODY_CLASS,
  PAGE_CONTENT_FOOTER_CLASS,
  PAGE_FOOTER_ACTION_BUTTON_CLASS,
  PAGE_SCROLL_COLUMN_CLASS,
  PAGE_SUBHEADER_PAGE_SHELL_CLASS,
  PAGE_SUBHEADER_WITH_STICKY_CLASS,
} from "@/lib/page-layout";
import { space } from "@/lib/spacing";
import { cn } from "design-system/utils";
import { generateResourceDraftFromBrief } from "@/lib/resource-ai-draft";
import { RESOURCE_DESCRIPTION_MAX, RESOURCE_DESCRIPTION_INPUT_GROUP_CLASS, RESOURCE_DESCRIPTION_ROWS, RESOURCE_DESCRIPTION_TEXTAREA_CLASS } from "@/lib/resource-ai-draft-types";
import { useFormAiDraftComposer } from "@/hooks/useFormAiDraftComposer";
import { ImageCropPosterModal } from "@/components/resource/character/CharacterExpressionModal";
import {
  captureVideoFrame,
  formatVideoDuration,
  loadVideoMetadata,
} from "@/lib/video-media-utils";
import type { MediaResource } from "@/types/resource";

const MEDIA_VIDEO_FILE_INPUT_ID = "media-resource-video-file";
const MEDIA_PREVIEW_IMAGE_FILE_INPUT_ID = "media-resource-preview-image-file";
const MEDIA_NAME_INPUT_ID = "media-resource-name";
const MEDIA_DESCRIPTION_INPUT_ID = "media-resource-description";

const ACCEPTED_VIDEO_TYPES = "video/mp4,video/webm,video/quicktime";

export interface MediaResourceDetailPageProps {
  initialData?: MediaResource | null;
}

function revokeBlobUrl(url: string | null | undefined) {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

export function MediaResourceDetailPage({ initialData }: MediaResourceDetailPageProps) {
  const isNewPage = !initialData;
  const router = useRouter();
  const pathname = usePathname();
  const videoRef = useRef<HTMLVideoElement>(null);

  const seriesId = React.useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    return segments[1] ?? "";
  }, [pathname]);

  const [name, setName] = useState<string>(() => initialData?.name ?? "");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState<string>(() => initialData?.videoUrl ?? "");
  const [duration, setDuration] = useState<string>(() => initialData?.duration ?? "00:00");
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(() => initialData?.thumbnailUrl ?? "");
  const [previewManuallySet, setPreviewManuallySet] = useState(() =>
    Boolean(initialData?.thumbnailUrl),
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExtractingPreview, setIsExtractingPreview] = useState(false);

  const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false);
  const [thumbnailModalInitialSlots, setThumbnailModalInitialSlots] =
    useState<{ id: string; expressionLabel: string; imageUrl?: string }[] | null>(null);
  const [pendingThumbnailUrl, setPendingThumbnailUrl] = useState<string | null>(null);

  const [initialDataSnapshot, setInitialDataSnapshot] = useState(initialData);
  if (initialData !== initialDataSnapshot) {
    setInitialDataSnapshot(initialData);
    if (initialData) {
      setName(initialData.name);
      setVideoUrl(initialData.videoUrl ?? "");
      setDuration(initialData.duration);
      setThumbnailUrl(initialData.thumbnailUrl);
      setPreviewManuallySet(Boolean(initialData.thumbnailUrl));
    }
  }

  useEffect(() => {
    return () => {
      revokeBlobUrl(videoUrl);
      revokeBlobUrl(thumbnailUrl);
      revokeBlobUrl(pendingThumbnailUrl);
    };
  }, [videoUrl, thumbnailUrl, pendingThumbnailUrl]);

  const applyPreviewFromVideo = useCallback(async (sourceUrl: string) => {
    setIsExtractingPreview(true);
    try {
      const frameUrl = await captureVideoFrame(sourceUrl);
      setThumbnailUrl((prev) => {
        revokeBlobUrl(prev);
        return frameUrl;
      });
    } catch (error) {
      console.error("Preview frame extract failed:", error);
    } finally {
      setIsExtractingPreview(false);
    }
  }, []);

  const handleVideoFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("video/")) return;

      const objectUrl = URL.createObjectURL(file);
      setVideoUrl((prev) => {
        revokeBlobUrl(prev);
        return objectUrl;
      });
      setIsPlaying(false);

      try {
        const { duration: seconds } = await loadVideoMetadata(objectUrl);
        setDuration(formatVideoDuration(seconds));
      } catch (error) {
        console.error("Video metadata load failed:", error);
        setDuration("00:00");
      }

      if (!previewManuallySet) {
        await applyPreviewFromVideo(objectUrl);
      }
    },
    [applyPreviewFromVideo, previewManuallySet],
  );

  const handleVideoFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = (e.target.files ?? [])[0];
      e.target.value = "";
      if (!file) return;
      void handleVideoFile(file);
    },
    [handleVideoFile],
  );

  const handleVideoRemove = useCallback(() => {
    setVideoUrl((prev) => {
      revokeBlobUrl(prev);
      return "";
    });
    setDuration("00:00");
    setIsPlaying(false);
  }, []);

  const togglePlayback = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
      setIsPlaying(true);
    } else {
      el.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleBack = useCallback(() => {
    router.push(`/series/${seriesId}/resources`);
  }, [router, seriesId]);

  const handleSave = useCallback(() => {
    router.push(`/series/${seriesId}/resources`);
  }, [router, seriesId]);

  const applyResourceDraft = useCallback((draft: { name: string; description: string }) => {
    setName(draft.name);
    setDescription(draft.description);
  }, []);

  const aiComposer = useFormAiDraftComposer({
    generate: (brief) => generateResourceDraftFromBrief(brief, "media"),
    onApply: applyResourceDraft,
    successMessage: "미디어 정보 초안을 채웠어요.",
    fallbackMessage: "AI 설정이 없어 임시 규칙으로 채웠어요.",
    errorMessage: "리소스 초안 생성에 실패했어요.",
  });

  const handleThumbnailClick = useCallback(() => {
    if (!thumbnailUrl) return;
    setThumbnailModalInitialSlots([
      { id: "media-preview", expressionLabel: "", imageUrl: thumbnailUrl },
    ]);
    setThumbnailModalOpen(true);
  }, [thumbnailUrl]);

  const handleThumbnailRemove = useCallback(() => {
    setThumbnailModalOpen(false);
    setThumbnailModalInitialSlots(null);
    setThumbnailUrl((prev) => {
      revokeBlobUrl(prev);
      return "";
    });
    setPendingThumbnailUrl((prev) => {
      revokeBlobUrl(prev);
      return null;
    });
    setPreviewManuallySet(false);
  }, []);

  const handleThumbnailFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = (e.target.files ?? [])[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;

    void (async () => {
      try {
        const objectUrl = await createOptimizedImageObjectUrl(file);
        setPendingThumbnailUrl((prev) => {
          revokeBlobUrl(prev);
          return objectUrl;
        });
        setThumbnailModalInitialSlots([
          { id: "media-preview", expressionLabel: "", imageUrl: objectUrl },
        ]);
        setThumbnailModalOpen(true);
      } catch (err) {
        console.error("Preview image prepare failed:", err);
      }
    })();
  }, []);

  return (
    <div className={PAGE_SUBHEADER_PAGE_SHELL_CLASS}>
      <header className={PAGE_SUBHEADER_WITH_STICKY_CLASS}>
        <div className="flex w-full min-w-0 max-w-[1200px] mx-auto items-center justify-between gap-4">
          <div className="flex items-center justify-start gap-3">
            <HeaderBackButton onClick={handleBack} aria-label="리소스 목록으로" />
            <h1 className="text-heading2_700 text-foreground">미디어 등록</h1>
          </div>
        </div>
      </header>

      <div
        className={cn(
          PAGE_SCROLL_COLUMN_CLASS,
          isNewPage && FLOATING_COMPOSER_SCROLL_PAD_CLASS,
          "max-lg:px-0 max-lg:pt-0 max-lg:gap-0",
        )}
      >
        <div className="w-full min-w-0 max-w-[1200px] mx-auto mx-auto">
          <div
            className={cn(
              "w-full rounded-sm border border-border bg-background",
              PAGE_CARD_SHELL_MOBILE_FLUSH_CLASS,
            )}
          >
            <Title2 text="미디어 정보" asSectionHeader />

            <div
              className={cn(
                PAGE_CONTENT_BODY_CLASS,
                "flex flex-col",
                space.section.sectionStackGapLarge.className,
              )}
            >
              <section className="flex flex-col gap-2">
                <FormFieldLabel
                  title="미디어 이름*"
                  subtitle="영상·음성 등을 구분할 수 있는 이름을 입력해 주세요."
                  inputId={MEDIA_NAME_INPUT_ID}
                />
                <InputGroup>
                  <Input
                    id={MEDIA_NAME_INPUT_ID}
                    aria-describedby={formFieldAriaDescribedBy(MEDIA_NAME_INPUT_ID)}
                    size="xl"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름을 입력해 주세요."
                  />
                </InputGroup>
              </section>

              <section className="flex flex-col gap-2">
                <FormFieldLabel
                  title="미디어 설명*"
                  subtitle="어떤 장면에서 사용되는 미디어인지 간단히 설명해 주세요."
                  inputId={MEDIA_DESCRIPTION_INPUT_ID}
                />
                <InputGroup className={RESOURCE_DESCRIPTION_INPUT_GROUP_CLASS}>
                  <Textarea
                    id={MEDIA_DESCRIPTION_INPUT_ID}
                    aria-describedby={formFieldAriaDescribedBy(MEDIA_DESCRIPTION_INPUT_ID)}
                    rows={RESOURCE_DESCRIPTION_ROWS}
                    maxLength={RESOURCE_DESCRIPTION_MAX}
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value.slice(0, RESOURCE_DESCRIPTION_MAX))
                    }
                    placeholder="설명을 입력해 주세요."
                    className={RESOURCE_DESCRIPTION_TEXTAREA_CLASS}
                  />
                  <InputHypertext
                    id={formFieldAriaDescribedBy(MEDIA_DESCRIPTION_INPUT_ID)}
                    count={description.length}
                    max={RESOURCE_DESCRIPTION_MAX}
                  />
                </InputGroup>
              </section>

              <section className="flex flex-col gap-3">
                <FormFieldLabel
                  title="미디어 파일*"
                  subtitle="에피소드에 삽입할 영상 파일입니다. MP4·WebM 등을 업로드할 수 있습니다."
                  inputId={MEDIA_VIDEO_FILE_INPUT_ID}
                />
                {videoUrl ? (
                  <div className="inline-flex flex-col justify-start items-start gap-1 w-[90px] group">
                    <div
                      className={cn(
                        "relative overflow-hidden rounded-lg border border-border bg-inverse",
                        RESOURCE_THUMBNAIL_FIXED_9_16_CLASS,
                      )}
                    >
                      <video
                        ref={videoRef}
                        src={videoUrl}
                        className="absolute inset-0 h-full w-full object-cover"
                        playsInline
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onEnded={() => setIsPlaying(false)}
                      />
                      <button
                        type="button"
                        onClick={togglePlayback}
                        className={cn(
                          "absolute inset-0 z-0 flex items-center justify-center bg-dim-10 transition-colors hover:bg-dim-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          DIM_OVERLAY_TEXT_CLASS,
                        )}
                        aria-label={isPlaying ? "영상 일시정지" : "영상 재생"}
                      >
                        {isPlaying ? (
                          <ICONS.pause className="h-8 w-8" aria-hidden />
                        ) : (
                          <ICONS.play className="h-8 w-8" aria-hidden />
                        )}
                      </button>
                      <div className={THUMBNAIL_DIM_OVERLAY_CLASS} aria-hidden />
                      <div className={THUMBNAIL_META_BAR_DIM_CLASS}>
                        <span className={cn("text-center text-caption1_700", DIM_OVERLAY_TEXT_CLASS)}>{duration}</span>
                      </div>
                      <div className={thumbnailHoverDimOverlayClass()} aria-hidden />
                      <div className="absolute right-1 top-1 z-dropdown flex flex-col items-start justify-center gap-1 opacity-0 transition-opacity pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto">
                        <label
                          htmlFor={MEDIA_VIDEO_FILE_INPUT_ID}
                          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-background text-foreground hover:bg-muted"
                          aria-label="미디어 파일 변경"
                        >
                          <ICONS.pencil className="h-4 w-4" aria-hidden />
                        </label>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="rounded-full bg-background text-foreground"
                          aria-label="미디어 파일 삭제"
                          onClick={handleVideoRemove}
                        >
                          <ICONS.trash2 className="h-4 w-4" aria-hidden />
                        </Button>
                      </div>
                    </div>
                    <input
                      type="file"
                      id={MEDIA_VIDEO_FILE_INPUT_ID}
                      accept={ACCEPTED_VIDEO_TYPES}
                      onChange={handleVideoFileChange}
                      className="sr-only"
                      aria-label="미디어 파일 변경"
                      tabIndex={-1}
                    />
                  </div>
                ) : (
                  <AddResourceSlot
                    variant="img9:16"
                    slotKind="thumbnail"
                    ariaLabel={THUMBNAIL_SLOT_ARIA.addMediaFile}
                    fileInput={{
                      id: MEDIA_VIDEO_FILE_INPUT_ID,
                      accept: ACCEPTED_VIDEO_TYPES,
                      onChange: handleVideoFileChange,
                    }}
                  />
                )}
              </section>

              <section className="flex flex-col gap-3">
                <FormFieldLabel
                  title="미리보기 이미지*"
                  subtitle="목록에 표시됩니다. 영상 등록 시 첫 프레임으로 자동 채워집니다."
                  inputId={MEDIA_PREVIEW_IMAGE_FILE_INPUT_ID}
                />
                {isExtractingPreview && !thumbnailUrl ? (
                  <p className="text-body4_400 text-foreground-placeholder">영상에서 미리보기를 만드는 중…</p>
                ) : thumbnailUrl ? (
                  <div className="inline-flex flex-col justify-start items-start gap-1 w-[90px] group">
                    <div className="w-[90px] h-[160px] rounded-lg overflow-hidden border border-border bg-muted relative">
                      <button
                        type="button"
                        onClick={handleThumbnailClick}
                        className="absolute inset-0 z-0 flex h-full w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                        aria-label="미리보기 이미지 변경"
                      >
                        <Image
                          src={thumbnailUrl}
                          alt=""
                          fill
                          sizes="90px"
                          unoptimized
                          className="object-cover pointer-events-none"
                        />
                        <div className={THUMBNAIL_DIM_OVERLAY_CLASS} aria-hidden />
                      </button>
                      <div className={thumbnailHoverDimOverlayClass()} aria-hidden />
                      <div className="absolute right-1 top-1 z-dropdown flex flex-col justify-center items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="rounded-full bg-background text-foreground"
                          aria-label="미리보기 이미지 편집"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleThumbnailClick();
                          }}
                        >
                          <ICONS.pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="rounded-full bg-background text-foreground"
                          aria-label="미리보기 이미지 삭제"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleThumbnailRemove();
                          }}
                        >
                          <ICONS.trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <AddResourceSlot
                    variant="img9:16"
                    slotKind="thumbnail"
                    ariaLabel={THUMBNAIL_SLOT_ARIA.addPreviewImage}
                    fileInput={{
                      id: MEDIA_PREVIEW_IMAGE_FILE_INPUT_ID,
                      accept: "image/*",
                      onChange: handleThumbnailFileChange,
                    }}
                  />
                )}
              </section>
            </div>

            <div className={`${PAGE_CONTENT_FOOTER_CLASS} flex items-center justify-end gap-2`}>
              <Button
                type="button"
                variant="outline"
                size="xl"
                className={PAGE_FOOTER_ACTION_BUTTON_CLASS}
                onClick={handleBack}
              >
                취소
              </Button>
              <Button
                type="button"
                size="xl"
                className={PAGE_FOOTER_ACTION_BUTTON_CLASS}
                onClick={handleSave}
              >
                저장
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ImageCropPosterModal
        open={thumbnailModalOpen}
        onClose={() => {
          setThumbnailModalOpen(false);
          setThumbnailModalInitialSlots(null);
          setPendingThumbnailUrl((prev) => {
            revokeBlobUrl(prev);
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
            setPreviewManuallySet(true);
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

      {isNewPage ? (
        <FloatingAiComposerPortal
          value={aiComposer.briefPrompt}
          onChange={aiComposer.setBriefPrompt}
          onSubmit={() => void aiComposer.handleGenerate()}
          placeholder="미디어의 용도·장면·느낌을 서술형으로 입력해 주세요."
          isLoading={aiComposer.isGenerating}
          submitDisabled={aiComposer.isGenerating || aiComposer.briefPrompt.trim().length === 0}
          loadingMessage="미디어 정보 초안을 생성하고 있어요"
          ariaLabel="미디어 정보 AI 초안 입력"
        />
      ) : null}
    </div>
  );
}
