"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { ICONS } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { HeaderBackButton } from "@/components/ui/header-back-button";
import { Input, InputGroup, InputHypertext } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FloatingAiComposerPortal } from "@/components/ui/FloatingAiComposerPortal";
import { FLOATING_COMPOSER_SCROLL_PAD_CLASS } from "@/components/ui/floating-composer-bar";
import { AddResourceSlot } from "@/components/resource/cards/AddResourceSlot";
import { createOptimizedImageObjectUrl } from "@/lib/image-upload-compress";
import { THUMBNAIL_DIM_OVERLAY_CLASS, thumbnailHoverDimOverlayClass } from "@/lib/thumbnail-styles";
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
import { cn } from "design-system/utils";
import { generateResourceDraftFromBrief } from "@/lib/resource-ai-draft";
import { RESOURCE_DESCRIPTION_MAX } from "@/lib/resource-ai-draft-types";
import { useFormAiDraftComposer } from "@/hooks/useFormAiDraftComposer";
import { ImageCropPosterModal } from "@/components/resource/character/CharacterExpressionModal";
import type { ImageResource, ImageResourceKind, MediaResource } from "@/types/resource";

export type { ImageResourceKind };

/** OS 파일 선택창 — label htmlFor 연결용 */
const IMAGE_RESOURCE_THUMBNAIL_FILE_INPUT_ID = "image-resource-thumbnail-file";
const IMAGE_RESOURCE_NAME_INPUT_ID = "image-resource-name";
const IMAGE_RESOURCE_DESCRIPTION_INPUT_ID = "image-resource-description";
const IMAGE_RESOURCE_SCENE_AI_GROUP_ID = "image-resource-scene-ai";

/** 편집 시 기존 데이터. 배경/연출/갤러리는 imageUrl, 미디어는 thumbnailUrl 사용 */
export type ImageResourceInitialData = ImageResource | MediaResource;

export interface ImageResourceDetailPageProps {
  kind: ImageResourceKind;
  /** 있으면 편집 모드: 폼에 기존 정보 채움 */
  initialData?: ImageResourceInitialData | null;
}

function getLabels(kind: ImageResourceKind) {
  const listThumbNote = "등록한 이미지는 목록 썸네일 등에도 함께 쓰입니다.";

  switch (kind) {
    case "background":
      return {
        headerTitle: "배경 등록",
        sectionTitle: "배경정보",
        nameLabel: "배경이름*",
        nameSubtitle: "장면을 직관적으로 식별할 수 있는 명칭을 입력해 주세요.",
        descriptionLabel: "배경 설명*",
        descriptionSubtitle:
          "화면 상의 분위기나 시각적 특성을 한 줄로 요약해 주세요. 장면 묘시에 대한 간단한 설명입니다.",
        thumbnailLabel: "배경 이미지*",
        thumbnailSubtitle: `장면에 사용할 배경 이미지입니다. ${listThumbNote}`,
        thumbnailAddAriaLabel: "배경 이미지 추가",
      };
    case "scene":
      return {
        headerTitle: "연출장면 등록",
        sectionTitle: "연출장면 정보",
        nameLabel: "연출장면 이름*",
        nameSubtitle: "연출 컷을 직관적으로 구분할 수 있는 이름을 입력해 주세요.",
        descriptionLabel: "연출 설명*",
        descriptionSubtitle: "장면의 핵심 연출 의도를 한 줄로 요약해 주세요.",
        thumbnailLabel: "연출 이미지*",
        thumbnailSubtitle: `장면에 사용할 연출 이미지입니다. ${listThumbNote}`,
        thumbnailAddAriaLabel: "연출 이미지 추가",
      };
    case "media":
      return {
        headerTitle: "미디어 등록",
        sectionTitle: "미디어 정보",
        nameLabel: "미디어 이름*",
        nameSubtitle: "영상·이미지 등을 구분할 수 있는 이름을 입력해 주세요.",
        descriptionLabel: "미디어 설명*",
        descriptionSubtitle: "어떤 장면에서 사용되는 미디어인지 간단히 설명해 주세요.",
        thumbnailLabel: "미디어 이미지*",
        thumbnailSubtitle: `에피소드에 사용할 미디어 이미지입니다. ${listThumbNote}`,
        thumbnailAddAriaLabel: "미디어 이미지 추가",
      };
    case "gallery":
    default:
      return {
        headerTitle: "갤러리 등록",
        sectionTitle: "갤러리 정보",
        nameLabel: "갤러리 이름*",
        nameSubtitle: "CG/삽화 장면을 구분할 수 있는 이름을 입력해 주세요.",
        descriptionLabel: "갤러리 설명*",
        descriptionSubtitle: "장면의 스토리적 의미를 한 줄로 요약해 주세요.",
        thumbnailLabel: "갤러리 이미지*",
        thumbnailSubtitle: `갤러리에 등록할 CG·삽화 이미지입니다. ${listThumbNote}`,
        thumbnailAddAriaLabel: "갤러리 이미지 추가",
      };
  }
}

const RESOURCE_COMPOSER_PLACEHOLDER: Record<ImageResourceKind, string> = {
  background: "배경의 분위기·장면·시각적 특징을 서술형으로 입력해 주세요.",
  scene: "연출 장면의 의도·구도·감정을 서술형으로 입력해 주세요.",
  media: "미디어의 용도·장면·느낌을 서술형으로 입력해 주세요.",
  gallery: "CG 장면의 스토리·분위기·인물 관계를 서술형으로 입력해 주세요.",
};

function getThumbnailUrl(data: ImageResourceInitialData): string {
  return "thumbnailUrl" in data ? data.thumbnailUrl : data.imageUrl;
}

export function ImageResourceDetailPage({ kind, initialData }: ImageResourceDetailPageProps) {
  const isNewPage = !initialData;
  const router = useRouter();
  const pathname = usePathname();
  const seriesId = React.useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    return segments[1] ?? "";
  }, [pathname]);

  const labels = getLabels(kind);

  const [name, setName] = useState<string>(() => initialData?.name ?? "");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(() =>
    initialData ? getThumbnailUrl(initialData) : ""
  );
  const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false);
  const [thumbnailModalInitialSlots, setThumbnailModalInitialSlots] =
    useState<{ id: string; expressionLabel: string; imageUrl?: string }[] | null>(null);
  const [pendingThumbnailUrl, setPendingThumbnailUrl] = useState<string | null>(null);
  const [sceneAiMode, setSceneAiMode] = useState<"apply" | "none">("apply");

  /** initialData 참조 변경 시 폼 값 재동기화 — render 중 setState 패턴 */
  const [initialDataSnapshot, setInitialDataSnapshot] = useState(initialData);
  if (initialData !== initialDataSnapshot) {
    setInitialDataSnapshot(initialData);
    if (initialData) {
      setName(initialData.name);
      setThumbnailUrl(getThumbnailUrl(initialData));
    }
  }

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

  const handleBack = useCallback(() => {
    router.push(`/series/${seriesId}/resources`);
  }, [router, seriesId]);

  const handleSave = useCallback(() => {
    // TODO: 실제 저장 로직은 추후 API 연동 시 구현
    router.push(`/series/${seriesId}/resources`);
  }, [router, seriesId]);

  const applyResourceDraft = useCallback((draft: { name: string; description: string }) => {
    setName(draft.name);
    setDescription(draft.description);
  }, []);

  const generateResourceDraft = useCallback(
    (brief: string) => generateResourceDraftFromBrief(brief, kind),
    [kind],
  );

  const aiComposer = useFormAiDraftComposer({
    generate: generateResourceDraft,
    onApply: applyResourceDraft,
    successMessage: `${labels.sectionTitle} 초안을 채웠어요.`,
    fallbackMessage: "AI 설정이 없어 임시 규칙으로 채웠어요.",
    errorMessage: "리소스 초안 생성에 실패했어요.",
  });

  const handleThumbnailClick = useCallback(() => {
    if (!thumbnailUrl) return;
    setThumbnailModalInitialSlots([
      { id: "image-thumbnail", expressionLabel: "", imageUrl: thumbnailUrl },
    ]);
    setThumbnailModalOpen(true);
  }, [thumbnailUrl]);

  const handleThumbnailRemove = useCallback(() => {
    setThumbnailModalOpen(false);
    setThumbnailModalInitialSlots(null);
    setThumbnailUrl((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return "";
    });
    setPendingThumbnailUrl((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

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
            { id: "image-thumbnail", expressionLabel: "", imageUrl: objectUrl },
          ]);
          setThumbnailModalOpen(true);
        } catch (err) {
          console.error("Thumbnail prepare failed:", err);
        }
      })();
    },
    [],
  );

  return (
    <div className={PAGE_SUBHEADER_PAGE_SHELL_CLASS}>
      {/* 상단 서브 헤더 */}
      <header className={PAGE_SUBHEADER_WITH_STICKY_CLASS}>
        <div className="flex w-full min-w-0 max-w-[1200px] mx-auto items-center justify-between gap-4">
          <div className="flex items-center justify-start gap-3">
            <HeaderBackButton onClick={handleBack} aria-label="리소스 목록으로" />
            <h1 className="text-heading2_700 text-foreground">{labels.headerTitle}</h1>
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
            <Title2
              text={labels.sectionTitle}
              asSectionHeader
            />

            <div className={`${PAGE_CONTENT_BODY_CLASS} flex flex-col gap-8`}>
              {/* 이름 */}
              <section className="flex flex-col gap-2">
                <FormFieldLabel
                  title={labels.nameLabel}
                  subtitle={labels.nameSubtitle}
                  inputId={IMAGE_RESOURCE_NAME_INPUT_ID}
                />
                <InputGroup>
                  <Input
                    id={IMAGE_RESOURCE_NAME_INPUT_ID}
                    aria-describedby={formFieldAriaDescribedBy(IMAGE_RESOURCE_NAME_INPUT_ID)}
                    size="lg"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름을 입력해 주세요."
                  />
                </InputGroup>
              </section>

              {/* 설명 */}
              <section className="flex flex-col gap-2">
                <FormFieldLabel
                  title={labels.descriptionLabel}
                  subtitle={labels.descriptionSubtitle}
                  inputId={IMAGE_RESOURCE_DESCRIPTION_INPUT_ID}
                />
                <InputGroup>
                  <Textarea
                    id={IMAGE_RESOURCE_DESCRIPTION_INPUT_ID}
                    aria-describedby={formFieldAriaDescribedBy(IMAGE_RESOURCE_DESCRIPTION_INPUT_ID)}
                    rows={4}
                    maxLength={RESOURCE_DESCRIPTION_MAX}
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value.slice(0, RESOURCE_DESCRIPTION_MAX))
                    }
                    placeholder="설명을 입력해 주세요."
                    className="min-h-[96px] max-h-[400px] resize-y"
                  />
                  <InputHypertext
                    id={formFieldAriaDescribedBy(IMAGE_RESOURCE_DESCRIPTION_INPUT_ID)}
                    count={description.length}
                    max={RESOURCE_DESCRIPTION_MAX}
                  />
                </InputGroup>
              </section>

              {/* 이미지 업로드 */}
              <section className="flex flex-col gap-3">
                <FormFieldLabel
                  title={labels.thumbnailLabel}
                  subtitle={labels.thumbnailSubtitle}
                  inputId={IMAGE_RESOURCE_THUMBNAIL_FILE_INPUT_ID}
                />
                {thumbnailUrl ? (
                  <div className="inline-flex flex-col justify-start items-start gap-1 w-[90px] group">
                    <div className="w-[90px] h-[160px] rounded-lg overflow-hidden border border-border bg-muted relative">
                      <button
                        type="button"
                        onClick={handleThumbnailClick}
                        className="absolute inset-0 z-0 flex h-full w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                        aria-label={`${labels.thumbnailLabel.replace("*", "")} 변경`}
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
                          aria-label={`${labels.thumbnailLabel.replace("*", "")} 편집`}
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
                          aria-label={`${labels.thumbnailLabel.replace("*", "")} 삭제`}
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
                    ariaLabel={labels.thumbnailAddAriaLabel}
                    fileInput={{
                      id: IMAGE_RESOURCE_THUMBNAIL_FILE_INPUT_ID,
                      accept: "image/*",
                      onChange: handleThumbnailFileChange,
                    }}
                  />
                )}
              </section>

              {/* 연출장면 전용: AI채팅 적용 여부 */}
              {kind === "scene" && (
                <section className="flex flex-col gap-2">
                  <FormFieldLabel
                    title="AI채팅 적용 여부*"
                    subtitle="이 연출장면을 AI 자동 전개에 사용할지 여부를 선택해 주세요."
                    inputId={IMAGE_RESOURCE_SCENE_AI_GROUP_ID}
                  />
                  <div
                    id={IMAGE_RESOURCE_SCENE_AI_GROUP_ID}
                    role="radiogroup"
                    aria-describedby={formFieldAriaDescribedBy(IMAGE_RESOURCE_SCENE_AI_GROUP_ID)}
                    className="mt-1 flex items-center gap-6"
                  >
                    <button
                      type="button"
                      onClick={() => setSceneAiMode("apply")}
                      className="inline-flex items-center gap-2 text-body3_500 text-foreground cursor-pointer"
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                          sceneAiMode === "apply"
                            ? "border-primary"
                            : "border-border"
                        }`}
                      >
                        {sceneAiMode === "apply" && (
                          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                        )}
                      </span>
                      <span>적용</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSceneAiMode("none")}
                      className="inline-flex items-center gap-2 text-body3_500 text-foreground cursor-pointer"
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                          sceneAiMode === "none"
                            ? "border-primary"
                            : "border-border"
                        }`}
                      >
                        {sceneAiMode === "none" && (
                          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                        )}
                      </span>
                      <span>적용 안 함</span>
                    </button>
                  </div>
                </section>
              )}
            </div>

            <div className={`${PAGE_CONTENT_FOOTER_CLASS} flex items-center justify-end gap-2`}>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className={PAGE_FOOTER_ACTION_BUTTON_CLASS}
                onClick={handleBack}
              >
                취소
              </Button>
              <Button
                type="button"
                size="lg"
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
      {isNewPage ? (
        <FloatingAiComposerPortal
          value={aiComposer.briefPrompt}
          onChange={aiComposer.setBriefPrompt}
          onSubmit={() => void aiComposer.handleGenerate()}
          placeholder={RESOURCE_COMPOSER_PLACEHOLDER[kind]}
          isLoading={aiComposer.isGenerating}
          submitDisabled={aiComposer.isGenerating || aiComposer.briefPrompt.trim().length === 0}
          loadingMessage={`${labels.sectionTitle} 초안을 생성하고 있어요`}
          ariaLabel={`${labels.sectionTitle} AI 초안 입력`}
        />
      ) : null}
    </div>
  );
}

