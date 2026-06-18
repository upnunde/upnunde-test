"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Pause, Pencil, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeaderBackButton } from "@/components/ui/header-back-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FloatingAiComposerPortal } from "@/components/ui/FloatingAiComposerPortal";
import { FLOATING_COMPOSER_SCROLL_PAD_CLASS } from "@/components/ui/floating-composer-bar";
import { AddResourceSlot } from "@/components/resource/cards/AddResourceSlot";
import { createOptimizedImageObjectUrl } from "@/lib/image-upload-compress";
import {
  RESOURCE_THUMBNAIL_FIXED_9_16_CLASS,
  THUMBNAIL_DIM_OVERLAY_CLASS,
  THUMBNAIL_SLOT_ARIA,
} from "@/lib/thumbnail-styles";
import { Title1 } from "@/components/ui/title1";
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
import { cn } from "@/lib/utils";
import { generateResourceDraftFromBrief } from "@/lib/resource-ai-draft";
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
        <div className="flex w-full min-w-0 max-w-[1200px] mx-auto items-center justify-between gap-my-16">
          <div className="flex items-center justify-start gap-my-12">
            <HeaderBackButton onClick={handleBack} aria-label="리소스 목록으로" />
            <h1 className="text-heading2_700 text-on-surface-10">미디어 등록</h1>
          </div>
        </div>
      </header>

      <div
        className={cn(
          PAGE_SCROLL_COLUMN_CLASS,
          FLOATING_COMPOSER_SCROLL_PAD_CLASS,
          "max-lg:px-0 max-lg:pt-0 max-lg:gap-0",
        )}
      >
        <div className="w-full min-w-0 max-w-[1200px] mx-auto mx-auto">
          <div
            className={cn(
              "w-full rounded-[4px] border border-border-10 bg-white",
              PAGE_CARD_SHELL_MOBILE_FLUSH_CLASS,
            )}
          >
            <Title2 text="미디어 정보" asSectionHeader />

            <div className={`${PAGE_CONTENT_BODY_CLASS} flex flex-col gap-my-32`}>
              <section className="flex flex-col gap-my-8">
                <Title1
                  text="미디어 이름*"
                  variant="title-subtitle-dot"
                  subtitleText="영상·음성 등을 구분할 수 있는 이름을 입력해 주세요."
                />
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력해 주세요."
                  className="h-[42px] rounded-md border border-border-10 bg-white px-my-12 py-my-8 text-body3_400 text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary shadow-none"
                />
              </section>

              <section className="flex flex-col gap-my-8">
                <Title1
                  text="미디어 설명*"
                  variant="title-subtitle-dot"
                  subtitleText="어떤 장면에서 사용되는 미디어인지 간단히 설명해 주세요."
                />
                <Textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="설명을 입력해 주세요."
                  className="min-h-[96px] max-h-[400px] w-full resize-y rounded-md border border-border-10 bg-white px-my-12 py-my-8 text-body3_400 text-on-surface-10 placeholder:text-on-surface-30 shadow-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </section>

              <section className="flex flex-col gap-my-12">
                <Title1
                  text="미디어 파일*"
                  variant="title-subtitle-dot"
                  subtitleText="에피소드에 삽입할 영상 파일입니다. MP4·WebM 등을 업로드할 수 있습니다."
                />
                {videoUrl ? (
                  <div className="inline-flex flex-col justify-start items-start gap-my-4 w-[90px] group">
                    <div
                      className={cn(
                        "relative overflow-hidden rounded-lg border border-border-10 bg-black",
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
                        className="absolute inset-0 z-[1] flex items-center justify-center bg-black/20 text-white transition-colors hover:bg-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label={isPlaying ? "영상 일시정지" : "영상 재생"}
                      >
                        {isPlaying ? (
                          <Pause className="h-8 w-8" aria-hidden />
                        ) : (
                          <Play className="h-8 w-8" aria-hidden />
                        )}
                      </button>
                      <div className={THUMBNAIL_DIM_OVERLAY_CLASS} aria-hidden />
                      <div className="pointer-events-none absolute bottom-0 left-0 flex h-6 w-full items-center justify-center bg-black/40">
                        <span className="text-center text-caption1_700 text-white">{duration}</span>
                      </div>
                      <div className="pointer-events-none absolute inset-0 z-[1] bg-black/10 opacity-0 transition-opacity group-hover:opacity-100" />
                      <div className="absolute right-1 top-1 z-[2] flex flex-col items-start justify-center gap-my-4 opacity-0 transition-opacity pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto">
                        <label
                          htmlFor={MEDIA_VIDEO_FILE_INPUT_ID}
                          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-surface-10 text-on-surface-10 hover:bg-surface-20"
                          aria-label="미디어 파일 변경"
                        >
                          <Pencil className="h-4 w-4" aria-hidden />
                        </label>
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-surface-10 text-on-surface-10 hover:bg-surface-20"
                          aria-label="미디어 파일 삭제"
                          onClick={handleVideoRemove}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </button>
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

              <section className="flex flex-col gap-my-12">
                <Title1
                  text="미리보기 이미지*"
                  variant="title-subtitle-dot"
                  subtitleText="목록에 표시됩니다. 영상 등록 시 첫 프레임으로 자동 채워집니다."
                />
                {isExtractingPreview && !thumbnailUrl ? (
                  <p className="text-body4_400 text-on-surface-30">영상에서 미리보기를 만드는 중…</p>
                ) : thumbnailUrl ? (
                  <div className="inline-flex flex-col justify-start items-start gap-my-4 w-[90px] group">
                    <div className="w-[90px] h-[160px] rounded-lg overflow-hidden border border-border-10 bg-surface-20 relative">
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
                      <div className="absolute inset-0 z-[1] bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      <div className="absolute right-1 top-1 z-[2] flex flex-col justify-center items-start gap-my-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                        <button
                          type="button"
                          className="w-8 h-8 rounded-full cursor-pointer bg-surface-10 inline-flex justify-center items-center text-on-surface-10 hover:bg-surface-20"
                          aria-label="미리보기 이미지 편집"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleThumbnailClick();
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="w-8 h-8 rounded-full cursor-pointer bg-surface-10 inline-flex justify-center items-center text-on-surface-10 hover:bg-surface-20"
                          aria-label="미리보기 이미지 삭제"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleThumbnailRemove();
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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

            <div className={`${PAGE_CONTENT_FOOTER_CLASS} flex items-center justify-end gap-my-8`}>
              <Button
                type="button"
                variant="outline"
                size="form"
                className={PAGE_FOOTER_ACTION_BUTTON_CLASS}
                onClick={handleBack}
              >
                취소
              </Button>
              <Button
                type="button"
                size="form"
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
    </div>
  );
}
