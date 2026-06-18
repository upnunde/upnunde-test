"use client";

import React, { useCallback, useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeaderBackButton } from "@/components/ui/header-back-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AddResourceSlot } from "@/components/resource/cards/AddResourceSlot";
import { createOptimizedImageObjectUrl } from "@/lib/image-upload-compress";
import { THUMBNAIL_SLOT_ARIA, THUMBNAIL_DIM_OVERLAY_CLASS } from "@/lib/thumbnail-styles";
import {
  CharacterExpressionMultiModal,
  CharacterExpressionSingleModal,
  ImageCropOnlyModal,
} from "@/components/resource/character/CharacterExpressionModal";
import {
  ImportCharacterDialog,
  type ImportableCharacterPick,
} from "@/components/resource/character/ImportCharacterDialog";
import { Tag } from "@/components/ui/tag";
import {
  FLOATING_COMPOSER_SCROLL_PAD_CLASS,
} from "@/components/ui/floating-composer-bar";
import { FloatingAiComposerPortal } from "@/components/ui/FloatingAiComposerPortal";
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
import { generateCharacterDraftFromBrief } from "@/lib/character-ai-draft";
import type { CharacterAiDraft } from "@/lib/character-ai-draft";
import { useFormAiDraftComposer } from "@/hooks/useFormAiDraftComposer";
import {
  buildMyWorksCharacterFromForm,
  stageMyWorksPendingCharacter,
} from "@/lib/myWorksCharacterCreate";
import { WORKS_TAB_PATH } from "@/lib/worksArea";
import type { CharacterResource, CharacterExpressionSlot } from "@/types/resource";

export type CharacterDetailPageContext = "series-resource" | "my-works";

/** OS 파일 선택창 — label htmlFor 연결용 (ref.click() 대신) */
const CHARACTER_DETAIL_THUMBNAIL_FILE_INPUT_ID = "character-detail-thumbnail-file";
const CHARACTER_DETAIL_EXPRESSION_FILE_INPUT_ID = "character-detail-expression-file";

interface CharacterDetailPageProps {
  /** 신규 생성인지 여부 (지금은 true 만 사용) */
  isNew?: boolean;
  /** 편집 시 기존 등장인물 데이터 – 있으면 폼에 채움 */
  initialData?: CharacterResource | null;
  /** 시리즈 리소스 등록 vs 내 작품 캐릭터 생성 */
  context?: CharacterDetailPageContext;
}

export function CharacterDetailPage({
  isNew = true,
  initialData,
  context = "series-resource",
}: CharacterDetailPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const seriesId = React.useMemo(() => {
    if (context === "my-works") return "";
    const segments = pathname.split("/").filter(Boolean);
    return segments[1] ?? "";
  }, [context, pathname]);

  const isMyWorks = context === "my-works";

  const parseInitialTagList = (raw: string | undefined): string[] => {
    if (!raw || !raw.trim()) return [];
    return raw
      .split(",")
      .map((t) => t.trim().replace(/^#+/, ""))
      .filter((t, idx, arr) => t.length > 0 && arr.indexOf(t) === idx);
  };

  const [name, setName] = useState<string>(() => initialData?.name ?? "");
  const [summary, setSummary] = useState<string>(() => initialData?.summary ?? "");
  const [tags, setTags] = useState("");
  const [tagList, setTagList] = useState<string[]>(() => parseInitialTagList(initialData?.tags));
  const [greeting, setGreeting] = useState<string>(() => initialData?.greeting ?? "");
  // 썸네일 표시용 URL (크롭된 결과)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(() => initialData?.imageUrl ?? null);
  // 항상 최초 원본 이미지를 유지하기 위한 URL (재크롭 시 이 값을 기준으로 다시 자른다)
  const [thumbnailOriginalUrl, setThumbnailOriginalUrl] = useState<string | null>(() => initialData?.imageUrl ?? null);
  const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false);
  const [thumbnailModalInitialSlots, setThumbnailModalInitialSlots] = useState<CharacterExpressionSlot[] | null>(null);
  const [pendingThumbnailUrl, setPendingThumbnailUrl] = useState<string | null>(null);
  const [expressionSlots, setExpressionSlots] = useState<CharacterExpressionSlot[]>(() => initialData?.expressions ?? []);
  const [expressionModalOpen, setExpressionModalOpen] = useState(false);
  /** 추가하기 → 파일 선택 후 이 슬롯으로 모달을 연다 */
  const [modalInitialSlots, setModalInitialSlots] = useState<CharacterExpressionSlot[] | null>(null);
  const [editingExpressionSlotId, setEditingExpressionSlotId] = useState<string | null>(null);
  const [importCharacterModalOpen, setImportCharacterModalOpen] = useState(false);

  const applyCharacterDraft = useCallback((draft: CharacterAiDraft) => {
    setName(draft.name);
    setSummary(draft.summary);
    setTagList(draft.tags);
    setTags("");
    setGreeting(draft.greeting);
  }, []);

  const aiComposer = useFormAiDraftComposer({
    generate: generateCharacterDraftFromBrief,
    onApply: applyCharacterDraft,
    successMessage: "캐릭터 정보 초안을 채웠어요.",
    fallbackMessage: "AI 설정이 없어 임시 규칙으로 채웠어요.",
    errorMessage: "캐릭터 초안 생성에 실패했어요.",
  });

  /** initialData 참조 변경 시 폼 값 재동기화 — render 중 setState 패턴 */
  const [initialDataSnapshot, setInitialDataSnapshot] = useState(initialData);
  if (initialData !== initialDataSnapshot) {
    setInitialDataSnapshot(initialData);
    if (initialData) {
      setName(initialData.name ?? "");
      setSummary(initialData.summary ?? "");
      setTags("");
      setTagList(parseInitialTagList(initialData.tags));
      setGreeting(initialData.greeting ?? "");
      setThumbnailUrl(initialData.imageUrl ?? null);
      setThumbnailOriginalUrl(initialData.imageUrl ?? null);
      setExpressionSlots(initialData.expressions ?? []);
    }
  }

  useEffect(() => {
    return () => {
      if (thumbnailUrl && thumbnailUrl.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailUrl);
      }
      if (thumbnailOriginalUrl && thumbnailOriginalUrl.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailOriginalUrl);
      }
      if (pendingThumbnailUrl && pendingThumbnailUrl.startsWith("blob:")) {
        URL.revokeObjectURL(pendingThumbnailUrl);
      }
    };
  }, [thumbnailUrl, thumbnailOriginalUrl, pendingThumbnailUrl]);

  const handleBack = useCallback(() => {
    if (isMyWorks) {
      router.push(WORKS_TAB_PATH.character);
      return;
    }
    router.push(`/series/${seriesId}/resources`);
  }, [isMyWorks, router, seriesId]);

  const isFormComplete = useMemo(
    () =>
      name.trim().length > 0 &&
      summary.trim().length > 0 &&
      Boolean(thumbnailUrl) &&
      expressionSlots.some((slot) => Boolean(slot.imageUrl)) &&
      tagList.length > 0 &&
      greeting.trim().length > 0,
    [name, summary, thumbnailUrl, expressionSlots, tagList, greeting],
  );

  const handleSave = useCallback(() => {
    if (!isFormComplete) return;
    if (isMyWorks) {
      stageMyWorksPendingCharacter(
        buildMyWorksCharacterFromForm({ name, summary, thumbnailUrl }),
      );
      router.push(WORKS_TAB_PATH.character);
      return;
    }
    // 실제 저장 로직은 추후 API 연동 시 구현
    router.push(`/series/${seriesId}/resources`);
  }, [isFormComplete, isMyWorks, name, router, seriesId, summary, thumbnailUrl]);

  const handleApplyImportedCharacterToForm = useCallback((selected: ImportableCharacterPick) => {
    setName(selected.name);
    setSummary(selected.summary ?? "");
    setThumbnailUrl((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return selected.imageUrl;
    });
    setThumbnailOriginalUrl(selected.imageUrl);
  }, []);

  /** 추가하기 — label htmlFor로 OS 파일 선택 (ref.click()은 Safari 등에서 차단됨) */
  const handleExpressionEditClick = useCallback((slot: CharacterExpressionSlot) => {
    setEditingExpressionSlotId(slot.id);
    setModalInitialSlots([slot]);
    setExpressionModalOpen(true);
  }, []);

  const handleThumbnailAddClick = useCallback(() => {
    // 이미 한 번 등록했다면, 크롭 기준은 항상 "원본"을 사용한다.
    const baseUrl = thumbnailOriginalUrl ?? thumbnailUrl;
    if (!baseUrl) return;
    setThumbnailModalInitialSlots([
      { id: "character-thumbnail", expressionLabel: "", imageUrl: baseUrl },
    ]);
    setThumbnailModalOpen(true);
  }, [thumbnailUrl, thumbnailOriginalUrl]);

  const handleThumbnailRemove = useCallback(() => {
    setThumbnailModalOpen(false);
    setThumbnailModalInitialSlots(null);
    setThumbnailUrl((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return null;
    });
    setThumbnailOriginalUrl((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return null;
    });
    setPendingThumbnailUrl((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  const handleThumbnailFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = (e.target.files ?? [])[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;

    void (async () => {
      try {
        const objectUrl = await createOptimizedImageObjectUrl(file);
        setThumbnailOriginalUrl((prev) => {
          if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
          return objectUrl;
        });
        setPendingThumbnailUrl((prev) => {
          if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
          return objectUrl;
        });
        setThumbnailModalInitialSlots([
          { id: "character-thumbnail", expressionLabel: "", imageUrl: objectUrl },
        ]);
        setThumbnailModalOpen(true);
      } catch (err) {
        console.error("Thumbnail prepare failed:", err);
      }
    })();
  }, []);

  const [isComposingTag, setIsComposingTag] = useState(false);

  const MAX_NAME = 30;
  const MAX_SUMMARY = 50;
  const MAX_TAGS = 50;
  const MAX_GREETING = 300;

  const handleAddTag = useCallback(
    (rawValue?: string) => {
      const cleaned = (rawValue ?? tags).trim().replace(/,$/, "");
      // 앞에 붙은 # 기호는 제거하고 저장 (칩 렌더 시에만 #를 붙임)
      const value = cleaned.replace(/^#+/, "");
      // 한 글자짜리 입력(오타 등)은 태그로 만들지 않는다
      if (!value || value.length < 2) return;
      setTagList((prev) => (prev.includes(value) ? prev : [...prev, value]));
      setTags("");
    },
    [tags],
  );

  const handleRemoveTag = useCallback((tag: string) => {
    setTagList((prev) => prev.filter((t) => t !== tag));
  }, []);

  const handleExpressionFilesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingExpressionSlotId(null);
    const files = Array.from(e.target.files ?? [])
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 10);
    e.target.value = "";
    if (files.length === 0) return;

    void (async () => {
      try {
        const imageUrls = await Promise.all(
          files.map((file) => createOptimizedImageObjectUrl(file)),
        );
        const newSlots: CharacterExpressionSlot[] = imageUrls.map((imageUrl, i) => ({
          id: `expr-${i}-${Date.now()}`,
          expressionLabel: "",
          imageUrl,
        }));
        while (newSlots.length < 10) {
          newSlots.push({
            id: `expr-${newSlots.length}-${Date.now()}`,
            expressionLabel: "",
            imageUrl: undefined,
          });
        }
        setModalInitialSlots(newSlots);
        setExpressionModalOpen(true);
      } catch (err) {
        console.error("Expression prepare failed:", err);
      }
    })();
  }, []);

  return (
    <div className={PAGE_SUBHEADER_PAGE_SHELL_CLASS}>
      {/* 상단 서브 헤더 - 리소스 관리/에피소드 관리와 동일 톤 */}
      <header className={PAGE_SUBHEADER_WITH_STICKY_CLASS}>
        <div className="flex w-full min-w-0 max-w-[1200px] mx-auto items-center justify-between gap-my-16">
          <div className="flex items-center justify-start gap-my-12">
            <HeaderBackButton
              onClick={handleBack}
              aria-label={isMyWorks ? "캐릭터 목록으로" : "리소스 목록으로"}
            />
            <h1 className="text-heading2_700 text-on-surface-10">
              {isMyWorks ? "캐릭터" : "등장인물"} {isNew ? "등록" : "상세"}
            </h1>
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
            <Title2
              text="인물정보"
              asSectionHeader
              sectionEnd={
                isMyWorks ? undefined : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setImportCharacterModalOpen(true)}
                    className="h-8 rounded-md bg-white px-my-12 text-body3_500 text-on-surface-10 hover:bg-surface-20 disabled:border-border-20"
                  >
                    캐릭터 가져오기
                  </Button>
                )
              }
            />

            <div className={`${PAGE_CONTENT_BODY_CLASS} flex flex-col gap-my-32`}>
              {/* 이름 */}
              <section className="flex flex-col gap-my-8">
                <Title1
                  text="이름*"
                  variant="title-subtitle-dot"
                  subtitleText="캐릭터의 이름을 입력해 주세요."
                />
                <div className="flex flex-col justify-center items-start gap-my-8">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, MAX_NAME))}
                    maxLength={MAX_NAME}
                    placeholder="예) 한하루"
                    className="h-[42px] rounded-md border border-border-10 bg-white px-my-12 py-my-8 text-body3_400 text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary shadow-none"
                  />
                  <div className="w-full inline-flex justify-end items-center gap-my-8">
                    <div className="text-right text-on-surface-30 text-caption1_400 tabular-nums">{name.length}/{MAX_NAME}</div>
                  </div>
                </div>
              </section>

              {/* 인물 소개 */}
              <section className="flex flex-col gap-my-8">
                <Title1
                  text="인물 소개*"
                  variant="title-subtitle-dot"
                  subtitleText="한 줄로 인물의 특징이 드러나도록 정리해 주세요."
                />
                <div className="flex flex-col justify-center items-start gap-my-8">
                  <Input
                    value={summary}
                    onChange={(e) => setSummary(e.target.value.slice(0, MAX_SUMMARY))}
                    maxLength={MAX_SUMMARY}
                    placeholder="예) 사람의 소리를 볼 수 있는 소리 수집가 소년"
                    className="h-[42px] rounded-md border border-border-10 bg-white px-my-12 py-my-8 text-body3_400 text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="w-full inline-flex justify-end items-center gap-my-8">
                    <div className="text-right text-on-surface-30 text-caption1_400 tabular-nums">{summary.length}/{MAX_SUMMARY}</div>
                  </div>
                </div>
              </section>

              {/* 캐릭터 이미지 / 표정 */}
              <section className="flex flex-col gap-my-16">
                <div className="grid grid-cols-[auto,1fr] gap-my-32 items-start">
                  <div className="flex flex-col gap-my-12">
                    <Title1
                      text="캐릭터 이미지*"
                      variant="title-subtitle-dot"
                      subtitleText="대화·연출에 쓰일 캐릭터 이미지입니다. 등록한 이미지는 목록 썸네일 등에도 함께 쓰입니다."
                    />
                    {thumbnailUrl ? (
                      <div className="inline-flex flex-col justify-start items-start gap-my-4 w-[90px] group">
                        <div className="w-[90px] h-[160px] rounded-lg overflow-hidden border border-border-10 bg-surface-20 relative">
                          <button
                            type="button"
                            onClick={handleThumbnailAddClick}
                            className="absolute inset-0 z-0 flex h-full w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                            aria-label="캐릭터 이미지 변경"
                          >
                            <Image
                              src={thumbnailUrl}
                              alt=""
                              fill
                              sizes="90px"
                              unoptimized
                              className="object-cover object-center pointer-events-none"
                            />
                            <div className={THUMBNAIL_DIM_OVERLAY_CLASS} aria-hidden />
                          </button>
                          <div className="absolute inset-0 z-[1] bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                          <div className="absolute right-1 top-1 z-[2] flex flex-col justify-center items-start gap-my-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                            <button
                              type="button"
                              className="w-8 h-8 rounded-full cursor-pointer bg-surface-10 inline-flex justify-center items-center text-on-surface-10 hover:bg-surface-20"
                              aria-label="캐릭터 이미지 편집"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleThumbnailAddClick();
                              }}
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              className="w-8 h-8 rounded-full cursor-pointer bg-surface-10 inline-flex justify-center items-center text-on-surface-10 hover:bg-surface-20"
                              aria-label="캐릭터 이미지 삭제"
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
                        ariaLabel={THUMBNAIL_SLOT_ARIA.addCharacterImage}
                        fileInput={{
                          id: CHARACTER_DETAIL_THUMBNAIL_FILE_INPUT_ID,
                          accept: "image/*",
                          onChange: handleThumbnailFileChange,
                        }}
                      />
                    )}
                  </div>

                  <div className="flex flex-col gap-my-12">
                    <Title1
                      text="표정*"
                      variant="title-subtitle-dot"
                      subtitleText="다양한 감정을 표현할 수 있는 표정을 여러 장까지 등록해 둘 수 있어요. (최대 10개)"
                    />
                    <div className="flex flex-wrap items-start gap-my-12">
                      {expressionSlots.filter((s) => s.imageUrl).map((slot) => (
                        <div
                          key={slot.id}
                          className="inline-flex shrink-0 flex-col justify-start items-start gap-my-4 w-[90px] group"
                        >
                          <div className="w-[90px] h-[160px] rounded-lg overflow-hidden border border-border-10 bg-surface-20 relative">
                            <Image
                              src={slot.imageUrl ?? ""}
                              alt=""
                              fill
                              sizes="90px"
                              unoptimized
                              className="object-cover object-top"
                            />
                            <div className={THUMBNAIL_DIM_OVERLAY_CLASS} aria-hidden />
                            {/* 어두운 오버레이 */}
                            <div className="absolute inset-0 w-full h-full bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            {/* 편집 / 삭제 아이콘 버튼 (9:16 썸네일과 동일 스타일) */}
                            <div className="absolute right-1 top-1 flex flex-col justify-center items-start gap-my-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                              <button
                                type="button"
                                className="w-8 h-8 rounded-full cursor-pointer bg-surface-10 inline-flex justify-center items-center text-on-surface-10 hover:bg-surface-20"
                                aria-label="표정 편집"
                                onClick={() => handleExpressionEditClick(slot)}
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                className="w-8 h-8 rounded-full cursor-pointer bg-surface-10 inline-flex justify-center items-center text-on-surface-10 hover:bg-surface-20"
                                aria-label="표정 삭제"
                                onClick={() =>
                                  setExpressionSlots((prev) =>
                                    prev.filter((s) => s.id !== slot.id)
                                  )
                                }
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <span className="w-[90px] text-caption1_400 text-on-surface-10 truncate whitespace-nowrap text-left">
                            {slot.expressionLabel || "untitle"}
                          </span>
                        </div>
                      ))}
                      <AddResourceSlot
                        variant="img9:16"
                        slotKind="thumbnail"
                        ariaLabel={THUMBNAIL_SLOT_ARIA.addExpression}
                        showCaptionSpacer
                        fileInput={{
                          id: CHARACTER_DETAIL_EXPRESSION_FILE_INPUT_ID,
                          accept: "image/*",
                          multiple: true,
                          onChange: handleExpressionFilesChange,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* 해시태그 */}
              <section className="flex flex-col gap-my-8">
                <Title1
                  text="해시태그*"
                  variant="title-subtitle-dot"
                  subtitleText="캐릭터를 한눈에 파악할 수 있는 키워드를 입력해 주세요. 쉼표로 구분됩니다."
                />
                <div className="flex flex-col justify-center items-start gap-my-8">
                  <Input
                    value={tags}
                    onChange={(e) => setTags(e.target.value.slice(0, MAX_TAGS))}
                    maxLength={MAX_TAGS}
                    onCompositionStart={() => setIsComposingTag(true)}
                    onCompositionEnd={() => setIsComposingTag(false)}
                    onKeyDown={(e) => {
                      if (!isComposingTag && (e.key === "Enter" || e.key === ",")) {
                        e.preventDefault();
                        handleAddTag();
                      } else if (e.key === "Backspace" && !tags && tagList.length > 0) {
                        // 입력이 비어 있고 백스페이스를 누르면 마지막 태그 삭제
                        e.preventDefault();
                        setTagList((prev) => prev.slice(0, -1));
                      }
                    }}
                    placeholder="예) 고등학생, 사진, 츤데레"
                    className="h-[42px] rounded-md border border-border-10 bg-white px-my-12 py-my-8 text-body3_400 text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="w-full inline-flex justify-end items-start gap-my-8">
                    {tagList.length > 0 && (
                      <div className="flex flex-wrap gap-my-8 w-full">
                        {tagList.map((tag) => (
                          <Tag key={tag} onDismiss={() => handleRemoveTag(tag)}>
                            #{tag}
                          </Tag>
                        ))}
                      </div>
                    )}
                    <div className="w-fit text-right text-on-surface-30 text-caption1_400 tabular-nums">
                      {tags.length}/{MAX_TAGS}
                    </div>
                  </div>
                </div>
              </section>

              {/* 인물 인사 */}
              <section className="flex flex-col gap-my-8">
                <Title1
                  text="인물 인사*"
                  variant="title-subtitle-dot"
                  subtitleText="캐릭터의 말투와 성격이 드러나는 짧은 소개 멘트를 작성해 주세요."
                />
                <div className="flex flex-col justify-start items-start gap-my-8">
                  <Textarea
                    rows={5}
                    value={greeting}
                    onChange={(e) => setGreeting(e.target.value.slice(0, MAX_GREETING))}
                    maxLength={MAX_GREETING}
                    placeholder="예) 안녕, 오늘도 사진 찍으러 나갈 준비됐지?"
                    className="resize-y rounded-md border border-border-10 bg-white px-my-12 py-my-8 text-body3_400 text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary w-full min-h-[80px]"
                  />
                  <div className="w-full inline-flex justify-end items-center gap-my-8">
                    <div className="text-right text-on-surface-30 text-caption1_400 tabular-nums">{greeting.length}/{MAX_GREETING}</div>
                  </div>
                </div>
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
                disabled={!isFormComplete}
                title={
                  isFormComplete
                    ? undefined
                    : "이름, 인물 소개, 캐릭터 이미지, 표정, 해시태그, 인물 인사를 모두 입력해야 저장할 수 있어요"
                }
                onClick={handleSave}
              >
                저장
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ImageCropOnlyModal
        open={thumbnailModalOpen}
        onClose={() => {
          setThumbnailModalOpen(false);
          setThumbnailModalInitialSlots(null);
          setPendingThumbnailUrl((prev) => {
            if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
            return null;
          });
        }}
        initialSlots={thumbnailModalInitialSlots ?? []}
        onSave={(slots) => {
          const saved = slots[0];
          if (saved?.imageUrl) {
            setThumbnailUrl((prev) => {
              // 모달 저장 결과로 교체되므로 기존 blob URL 정리
              if (prev && prev.startsWith("blob:") && prev !== saved.imageUrl) {
                URL.revokeObjectURL(prev);
              }
              return saved.imageUrl ?? null;
            });
          }
          setThumbnailModalOpen(false);
          setThumbnailModalInitialSlots(null);
          setPendingThumbnailUrl((prev) => {
            if (prev && prev.startsWith("blob:") && prev !== saved?.imageUrl) URL.revokeObjectURL(prev);
            return null;
          });
        }}
      />
      {editingExpressionSlotId ? (
        <CharacterExpressionSingleModal
          open={expressionModalOpen}
          onClose={() => {
            setExpressionModalOpen(false);
            setModalInitialSlots(null);
            setEditingExpressionSlotId(null);
          }}
          initialSlots={modalInitialSlots ?? expressionSlots}
          onSave={(slots) => {
            const edited = slots[0];
            setExpressionSlots((prev) => {
              if (!edited || !edited.imageUrl) {
                return prev.filter((s) => s.id !== editingExpressionSlotId);
              }
              return prev.map((s) => (s.id === editingExpressionSlotId ? { ...s, ...edited } : s));
            });
            setExpressionModalOpen(false);
            setModalInitialSlots(null);
            setEditingExpressionSlotId(null);
          }}
        />
      ) : (
        <CharacterExpressionMultiModal
          open={expressionModalOpen}
          onClose={() => {
            setExpressionModalOpen(false);
            setModalInitialSlots(null);
            setEditingExpressionSlotId(null);
          }}
          initialSlots={modalInitialSlots ?? expressionSlots}
          onSave={(slots) => {
            // 멀티 추가: 기존 슬롯은 유지하고, 새로 추가한 슬롯을 뒤에 쌓되 최대 10개까지만 유지
            setExpressionSlots((prev) => {
              const existingFilled = prev.filter((s) => s.imageUrl);
              const newFilled = slots.filter((s) => s.imageUrl);
              const combined = [...existingFilled, ...newFilled];
              return combined.slice(0, 10);
            });
            setExpressionModalOpen(false);
            setModalInitialSlots(null);
            setEditingExpressionSlotId(null);
          }}
        />
      )}

      {!isMyWorks ? (
        <ImportCharacterDialog
          open={importCharacterModalOpen}
          onOpenChange={setImportCharacterModalOpen}
          onApply={handleApplyImportedCharacterToForm}
        />
      ) : null}

      <FloatingAiComposerPortal
        value={aiComposer.briefPrompt}
        onChange={aiComposer.setBriefPrompt}
        onSubmit={() => void aiComposer.handleGenerate()}
        placeholder="캐릭터 특징을 서술형으로 입력해 주세요."
        isLoading={aiComposer.isGenerating}
        submitDisabled={aiComposer.isGenerating || aiComposer.briefPrompt.trim().length === 0}
        loadingMessage="캐릭터 정보를 생성하고 있어요"
        ariaLabel="캐릭터 AI 초안 입력"
      />
    </div>
  );
}

