"use client";

import React, { useCallback, useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AddResourceSlot } from "@/components/resource/cards/AddResourceSlot";
import {
  CharacterExpressionMultiModal,
  CharacterExpressionSingleModal,
  ImageCropSquareModal,
} from "@/components/resource/character/CharacterExpressionModal";
import { Title1 } from "@/components/ui/title1";
import { Title2 } from "@/components/ui/title2";
import type { CharacterResource, CharacterExpressionSlot } from "@/types/resource";

interface CharacterDetailPageProps {
  /** 신규 생성인지 여부 (지금은 true 만 사용) */
  isNew?: boolean;
  /** 편집 시 기존 등장인물 데이터 – 있으면 폼에 채움 */
  initialData?: CharacterResource | null;
}

export function CharacterDetailPage({ isNew = true, initialData }: CharacterDetailPageProps) {
  const router = useRouter();
  const params = useParams();
  const seriesId = typeof params?.id === "string" ? params.id : "";

  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("");
  const [tagList, setTagList] = useState<string[]>([]);
  const [greeting, setGreeting] = useState("");
  // 썸네일 표시용 URL (크롭된 결과)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  // 항상 최초 원본 이미지를 유지하기 위한 URL (재크롭 시 이 값을 기준으로 다시 자른다)
  const [thumbnailOriginalUrl, setThumbnailOriginalUrl] = useState<string | null>(null);
  const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false);
  const [thumbnailModalInitialSlots, setThumbnailModalInitialSlots] = useState<CharacterExpressionSlot[] | null>(null);
  const [pendingThumbnailUrl, setPendingThumbnailUrl] = useState<string | null>(null);
  const [expressionSlots, setExpressionSlots] = useState<CharacterExpressionSlot[]>([]);
  const [expressionModalOpen, setExpressionModalOpen] = useState(false);
  /** 추가하기 → 파일 선택 후 이 슬롯으로 모달을 연다 */
  const [modalInitialSlots, setModalInitialSlots] = useState<CharacterExpressionSlot[] | null>(null);
  const [editingExpressionSlotId, setEditingExpressionSlotId] = useState<string | null>(null);
  const expressionFileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name ?? "");
      setSummary(initialData.summary ?? "");
      const initialTags = initialData.tags ?? "";
      setTags("");
      if (initialTags.trim()) {
        const parsed = initialTags
          .split(",")
          .map((t) => t.trim().replace(/^#+/, ""))
          .filter((t, idx, arr) => t.length > 0 && arr.indexOf(t) === idx);
        setTagList(parsed);
      }
      setGreeting(initialData.greeting ?? "");
      // 서버에서 내려온 값은 "원본"이라고 가정하고 둘 다 동일하게 세팅
      setThumbnailUrl(initialData.imageUrl ?? null);
      setThumbnailOriginalUrl(initialData.imageUrl ?? null);
      setExpressionSlots(initialData.expressions ?? []);
    }
  }, [initialData]);

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
    router.push(`/series/${seriesId}/resources`);
  }, [router, seriesId]);

  const handleSave = useCallback(() => {
    // 실제 저장 로직은 추후 API 연동 시 구현
    router.push(`/series/${seriesId}/resources`);
  }, [router, seriesId]);

  /** 추가하기 클릭 → OS 파일 선택 (최대 10장) → 선택한 수만큼 슬롯 채워서 모달 오픈 */
  const handleExpressionAddClick = useCallback(() => {
    setEditingExpressionSlotId(null);
    expressionFileInputRef.current?.click();
  }, []);

  const handleExpressionEditClick = useCallback((slot: CharacterExpressionSlot) => {
    setEditingExpressionSlotId(slot.id);
    setModalInitialSlots([slot]);
    setExpressionModalOpen(true);
  }, []);

  const handleThumbnailAddClick = useCallback(() => {
    // 이미 한 번 등록했다면, 크롭 기준은 항상 "원본"을 사용한다.
    const baseUrl = thumbnailOriginalUrl ?? thumbnailUrl;
    if (baseUrl) {
      setThumbnailModalInitialSlots([
        { id: "character-thumbnail", expressionLabel: "", imageUrl: baseUrl },
      ]);
      setThumbnailModalOpen(true);
      return;
    }
    thumbnailFileInputRef.current?.click();
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

    const objectUrl = URL.createObjectURL(file);
    // 최초 선택한 파일 URL은 "원본"으로 계속 유지한다.
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
    const files = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith("image/")).slice(0, 10);
    e.target.value = "";
    if (files.length === 0) return;
    const newSlots: CharacterExpressionSlot[] = files.map((file, i) => ({
      id: `expr-${i}-${Date.now()}`,
      expressionLabel: "",
      imageUrl: URL.createObjectURL(file),
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
  }, []);

  return (
    <main className="flex flex-1 flex-col overflow-hidden bg-slate-50">
      {/* 상단 서브 헤더 - 리소스 관리/에피소드 관리와 동일 톤 */}
      <header className="flex h-16 shrink-0 items-center justify-center border-b border-slate-200 bg-white px-10 py-0">
        <div className="flex w-full max-w-[1200px] min-w-[640px] items-center justify-between gap-4">
          <div className="flex items-center justify-start gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleBack}
              className="h-9 w-9 shrink-0 rounded-full border-slate-200 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              aria-label="리소스 목록으로"
            >
              <ChevronLeft className="h-5 w-5 text-slate-600" strokeWidth={2} />
            </Button>
            <h1 className="text-2xl font-bold text-on-surface-10">등장인물 {isNew ? "등록" : "상세"}</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto flex flex-col items-center py-8 px-10 gap-4">
        <div className="w-full max-w-[1200px] min-w-[640px] mx-auto">
          <div className="w-full rounded-2xl border border-slate-200 bg-white">
            <Title2
              text="인물정보"
              asSectionHeader
              className="px-8 pt-5 pb-3"
            />

            <div className="px-8 py-6 flex flex-col gap-8">
              {/* 이름 */}
              <section className="flex flex-col gap-2">
                <Title1
                  text="이름*"
                  variant="title-subtitle-dot"
                  subtitleText="캐릭터의 이름을 입력해 주세요."
                />
                <div className="flex flex-col justify-center items-start gap-2">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, MAX_NAME))}
                    maxLength={MAX_NAME}
                    placeholder="예) 한하루"
                    className="h-12 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary shadow-none"
                  />
                  <div className="w-full inline-flex justify-end items-center gap-2">
                    <div className="text-right text-on-surface-30 text-xs font-normal leading-4 tabular-nums">{name.length}/{MAX_NAME}</div>
                  </div>
                </div>
              </section>

              {/* 인물 소개 */}
              <section className="flex flex-col gap-2">
                <Title1
                  text="인물 소개*"
                  variant="title-subtitle-dot"
                  subtitleText="한 줄로 인물의 특징이 드러나도록 정리해 주세요."
                />
                <div className="flex flex-col justify-center items-start gap-2">
                  <Input
                    value={summary}
                    onChange={(e) => setSummary(e.target.value.slice(0, MAX_SUMMARY))}
                    maxLength={MAX_SUMMARY}
                    placeholder="예) 사람의 소리를 볼 수 있는 소리 수집가 소년"
                    className="h-12 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="w-full inline-flex justify-end items-center gap-2">
                    <div className="text-right text-on-surface-30 text-xs font-normal leading-4 tabular-nums">{summary.length}/{MAX_SUMMARY}</div>
                  </div>
                </div>
              </section>

              {/* 대표 썸네일 / 표정 */}
              <section className="flex flex-col gap-4">
                <div className="grid grid-cols-[auto,1fr] gap-8 items-start">
                  <div className="flex flex-col gap-3">
                    <Title1
                      text="대표 썸네일"
                      variant="title-subtitle"
                      subtitleText="독자에게 가장 먼저 보여질 캐릭터 이미지를 등록해 주세요."
                    />
                    {thumbnailUrl ? (
                      <div className="inline-flex flex-col justify-start items-start gap-1 w-28 group">
                        <div className="w-28 h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative">
                          <button
                            type="button"
                            onClick={handleThumbnailAddClick}
                            className="absolute inset-0 z-0 flex h-full w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                            aria-label="대표 썸네일 변경"
                          >
                            <img
                              src={thumbnailUrl}
                              alt=""
                              className="h-full w-full object-cover object-center pointer-events-none"
                            />
                          </button>
                          <div className="absolute inset-0 z-[1] bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                          <div className="absolute right-1 top-1 z-[2] flex flex-col justify-center items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                            <button
                              type="button"
                              className="w-8 h-8 rounded-full cursor-pointer bg-surface-10 inline-flex justify-center items-center text-on-surface-10 hover:bg-slate-100"
                              aria-label="대표 썸네일 편집"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleThumbnailAddClick();
                              }}
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              className="w-8 h-8 rounded-full cursor-pointer bg-surface-10 inline-flex justify-center items-center text-on-surface-10 hover:bg-slate-100"
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
                        variant="character"
                        ariaLabel="대표 썸네일 추가"
                        onClick={handleThumbnailAddClick}
                      />
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    <Title1
                      text="표정"
                      variant="title-subtitle"
                      subtitleText="다양한 감정을 표현할 수 있는 표정을 여러 장까지 등록해 둘 수 있어요. (최대 10개)"
                    />
                    <div className="flex flex-wrap gap-3 items-start">
                      {expressionSlots.filter((s) => s.imageUrl).map((slot) => (
                        <div
                          key={slot.id}
                          className="inline-flex flex-col justify-start items-start gap-1 w-[90px] group"
                        >
                          <div className="w-[90px] h-[160px] rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative">
                            <img
                              src={slot.imageUrl}
                              alt=""
                              className="w-full h-full object-cover object-top"
                            />
                            {/* 어두운 오버레이 */}
                            <div className="absolute inset-0 w-full h-full bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            {/* 편집 / 삭제 아이콘 버튼 (9:16 썸네일과 동일 스타일) */}
                            <div className="absolute right-1 top-1 flex flex-col justify-center items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                              <button
                                type="button"
                                className="w-8 h-8 rounded-full cursor-pointer bg-surface-10 inline-flex justify-center items-center text-on-surface-10 hover:bg-slate-100"
                                aria-label="표정 편집"
                                onClick={() => handleExpressionEditClick(slot)}
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                className="w-8 h-8 rounded-full cursor-pointer bg-surface-10 inline-flex justify-center items-center text-on-surface-10 hover:bg-slate-100"
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
                          <span className="w-[90px] text-xs text-on-surface-10 truncate whitespace-nowrap text-left">
                            {slot.expressionLabel || "untitle"}
                          </span>
                        </div>
                      ))}
                      <AddResourceSlot
                        variant="img9:16"
                        ariaLabel="썸네일로 변경"
                        onClick={handleExpressionAddClick}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* 해시태그 */}
              <section className="flex flex-col gap-2">
                <Title1
                  text="해시태그"
                  variant="title-subtitle"
                  subtitleText="캐릭터를 한눈에 파악할 수 있는 키워드를 입력해 주세요. 쉼표로 구분됩니다."
                />
                <div className="flex flex-col justify-center items-start gap-2">
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
                    className="h-12 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="w-full inline-flex justify-end items-start gap-2">
                    {tagList.length > 0 && (
                      <div className="flex flex-wrap gap-2 w-full">
                        {tagList.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-on-surface-10 hover:bg-slate-100 hover:border-slate-300 cursor-pointer"
                          >
                            <span className="whitespace-nowrap">#{tag}</span>
                            <span className="text-on-surface-30 text-[10px] leading-none">✕</span>
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="w-fit text-right text-on-surface-30 text-xs font-normal leading-4 tabular-nums">
                      {tags.length}/{MAX_TAGS}
                    </div>
                  </div>
                </div>
              </section>

              {/* 인물 인사 */}
              <section className="flex flex-col gap-2">
                <Title1
                  text="인물 인사"
                  variant="title-subtitle"
                  subtitleText="캐릭터의 말투와 성격이 드러나는 짧은 소개 멘트를 작성해 주세요."
                />
                <div className="flex flex-col justify-start items-start gap-2">
                  <Textarea
                    rows={5}
                    value={greeting}
                    onChange={(e) => setGreeting(e.target.value.slice(0, MAX_GREETING))}
                    maxLength={MAX_GREETING}
                    placeholder="예) 안녕, 오늘도 사진 찍으러 나갈 준비됐지?"
                    className="resize-y rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary w-full min-h-[80px]"
                  />
                  <div className="w-full inline-flex justify-end items-center gap-2">
                    <div className="text-right text-on-surface-30 text-xs font-normal leading-4 tabular-nums">{greeting.length}/{MAX_GREETING}</div>
                  </div>
                </div>
              </section>
            </div>

            <div className="flex items-center justify-end gap-2 px-8 py-4">
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
        ref={expressionFileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        aria-label="표정 이미지 선택 (최대 10장)"
        onChange={handleExpressionFilesChange}
      />
      <input
        ref={thumbnailFileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-label="대표 썸네일 이미지 선택"
        onChange={handleThumbnailFileChange}
      />
      <ImageCropSquareModal
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
    </main>
  );
}

