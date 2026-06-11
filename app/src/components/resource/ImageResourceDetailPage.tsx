"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeaderBackButton } from "@/components/ui/header-back-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AddResourceSlot } from "@/components/resource/cards/AddResourceSlot";
import { THUMBNAIL_SLOT_ARIA } from "@/lib/thumbnail-styles";
import { Title1 } from "@/components/ui/title1";
import { Title2 } from "@/components/ui/title2";
import {
  PAGE_CONTENT_BODY_CLASS,
  PAGE_CONTENT_FOOTER_CLASS,
  PAGE_SCROLL_COLUMN_CLASS,
  PAGE_SUBHEADER_WITH_STICKY_CLASS,
} from "@/lib/page-layout";
import { ImageCropPosterModal } from "@/components/resource/character/CharacterExpressionModal";
import type { ImageResource, MediaResource } from "@/types/resource";

export type ImageResourceKind = "background" | "scene" | "media" | "gallery";

/** 편집 시 기존 데이터. 배경/연출/갤러리는 imageUrl, 미디어는 thumbnailUrl 사용 */
export type ImageResourceInitialData = ImageResource | MediaResource;

export interface ImageResourceDetailPageProps {
  kind: ImageResourceKind;
  /** 있으면 편집 모드: 폼에 기존 정보 채움 */
  initialData?: ImageResourceInitialData | null;
}

function getLabels(kind: ImageResourceKind) {
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
        thumbnailLabel: "대표 썸네일",
        thumbnailSubtitle: "부가정보에 표시되는 썸네일입니다.",
      };
    case "scene":
      return {
        headerTitle: "연출장면 등록",
        sectionTitle: "연출장면 정보",
        nameLabel: "연출장면 이름*",
        nameSubtitle: "연출 컷을 직관적으로 구분할 수 있는 이름을 입력해 주세요.",
        descriptionLabel: "연출 설명*",
        descriptionSubtitle: "장면의 핵심 연출 의도를 한 줄로 요약해 주세요.",
        thumbnailLabel: "대표 썸네일",
        thumbnailSubtitle: "연출이 대표적으로 드러나는 이미지를 등록해 주세요.",
      };
    case "media":
      return {
        headerTitle: "미디어 등록",
        sectionTitle: "미디어 정보",
        nameLabel: "미디어 이름*",
        nameSubtitle: "영상·이미지 등을 구분할 수 있는 이름을 입력해 주세요.",
        descriptionLabel: "미디어 설명*",
        descriptionSubtitle: "어떤 장면에서 사용되는 미디어인지 간단히 설명해 주세요.",
        thumbnailLabel: "대표 썸네일",
        thumbnailSubtitle: "리스트와 미리보기에서 사용될 대표 이미지를 등록해 주세요.",
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
        thumbnailLabel: "대표 썸네일",
        thumbnailSubtitle: "갤러리 목록에서 먼저 보여질 이미지를 등록해 주세요.",
      };
  }
}

function getThumbnailUrl(data: ImageResourceInitialData): string {
  return "thumbnailUrl" in data ? data.thumbnailUrl : data.imageUrl;
}

export function ImageResourceDetailPage({ kind, initialData }: ImageResourceDetailPageProps) {
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
  const thumbnailFileInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleThumbnailClick = useCallback(() => {
    if (thumbnailUrl) {
      setThumbnailModalInitialSlots([
        { id: "image-thumbnail", expressionLabel: "", imageUrl: thumbnailUrl },
      ]);
      setThumbnailModalOpen(true);
      return;
    }
    thumbnailFileInputRef.current?.click();
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

      const objectUrl = URL.createObjectURL(file);
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
    },
    [],
  );

  return (
    <div className="flex flex-col bg-surface-20">
      {/* 상단 서브 헤더 */}
      <header className={PAGE_SUBHEADER_WITH_STICKY_CLASS}>
        <div className="flex w-full min-w-0 max-w-[1200px] mx-auto items-center justify-between gap-my-16">
          <div className="flex items-center justify-start gap-my-12">
            <HeaderBackButton onClick={handleBack} aria-label="리소스 목록으로" />
            <h1 className="text-heading2_700 text-on-surface-10">{labels.headerTitle}</h1>
          </div>
        </div>
      </header>

      <div className={PAGE_SCROLL_COLUMN_CLASS}>
        <div className="w-full min-w-0 max-w-[1200px] mx-auto mx-auto">
          <div className="w-full rounded-[4px] border border-border-10 bg-white">
            <Title2
              text={labels.sectionTitle}
              asSectionHeader
            />

            <div className={`${PAGE_CONTENT_BODY_CLASS} flex flex-col gap-my-32`}>
              {/* 이름 */}
              <section className="flex flex-col gap-my-8">
                <Title1
                  text={labels.nameLabel}
                  variant="title-subtitle-dot"
                  subtitleText={labels.nameSubtitle}
                />
                <div className="flex flex-col justify-center items-start gap-my-8">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름을 입력해 주세요."
                    className="h-[42px] rounded-md border border-border-10 bg-white px-my-12 py-my-8 text-body3_400 text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary shadow-none"
                  />
                </div>
              </section>

              {/* 설명 */}
              <section className="flex flex-col gap-my-8">
                <Title1
                  text={labels.descriptionLabel}
                  variant="title-subtitle-dot"
                  subtitleText={labels.descriptionSubtitle}
                />
                <div className="flex flex-col justify-center items-start gap-my-8">
                  <Textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="설명을 입력해 주세요."
                    className="min-h-[96px] max-h-[400px] w-full resize-y rounded-md border border-border-10 bg-white px-my-12 py-my-8 text-body3_400 text-on-surface-10 placeholder:text-on-surface-30 shadow-none focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </section>

              {/* 대표 썸네일 */}
              <section className="flex flex-col gap-my-12">
                <Title1
                  text={labels.thumbnailLabel}
                  variant="title-subtitle-dot"
                  subtitleText={labels.thumbnailSubtitle}
                />
                {thumbnailUrl ? (
                  <div className="inline-flex flex-col justify-start items-start gap-my-4 w-[90px] group">
                    <div className="w-[90px] h-[160px] rounded-lg overflow-hidden border border-border-10 bg-surface-20 relative">
                      <button
                        type="button"
                        onClick={handleThumbnailClick}
                        className="absolute inset-0 z-0 flex h-full w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                        aria-label="대표 썸네일 변경"
                      >
                        <Image
                          src={thumbnailUrl}
                          alt=""
                          fill
                          sizes="90px"
                          unoptimized
                          className="object-cover pointer-events-none"
                        />
                      </button>
                      <div className="absolute inset-0 z-[1] bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      <div className="absolute right-1 top-1 z-[2] flex flex-col justify-center items-start gap-my-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                        <button
                          type="button"
                          className="w-8 h-8 rounded-full cursor-pointer bg-surface-10 inline-flex justify-center items-center text-on-surface-10 hover:bg-surface-20"
                          aria-label="대표 썸네일 편집"
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
                          aria-label="대표 썸네일 삭제"
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
                    ariaLabel={THUMBNAIL_SLOT_ARIA.addRepresentativeThumbnail}
                    onClick={handleThumbnailClick}
                  />
                )}
              </section>

              {/* 연출장면 전용: AI채팅 적용 여부 */}
              {kind === "scene" && (
                <section className="flex flex-col gap-my-8">
                  <Title1
                    text="AI채팅 적용 여부*"
                    variant="title-subtitle-dot"
                    subtitleText="이 연출장면을 AI 자동 전개에 사용할지 여부를 선택해 주세요."
                  />
                  <div className="flex items-center gap-my-24 mt-1">
                    <button
                      type="button"
                      onClick={() => setSceneAiMode("apply")}
                      className="inline-flex items-center gap-my-8 text-body3_500 text-on-surface-10 cursor-pointer"
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                          sceneAiMode === "apply"
                            ? "border-[rgba(255,0,128,1)]"
                            : "border-border-20"
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
                      className="inline-flex items-center gap-my-8 text-body3_500 text-on-surface-10 cursor-pointer"
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                          sceneAiMode === "none"
                            ? "border-[rgba(255,0,128,1)]"
                            : "border-border-20"
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

            <div className={`${PAGE_CONTENT_FOOTER_CLASS} flex items-center justify-end gap-my-8`}>
              <Button
                type="button"
                variant="outline"
                className="min-w-[80px]"
                onClick={handleBack}
              >
                취소
              </Button>
              <Button
                type="button"
                className="min-w-[88px]"
                onClick={handleSave}
              >
                저장
              </Button>
            </div>
          </div>
        </div>
      </div>
      <input
        ref={thumbnailFileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-label={THUMBNAIL_SLOT_ARIA.addRepresentativeThumbnail}
        onChange={handleThumbnailFileChange}
      />
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
  );
}

