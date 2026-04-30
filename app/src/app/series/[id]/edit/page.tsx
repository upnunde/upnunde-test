"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Title1 } from "@/components/ui/title1";
import { ImageCropOnlyModal } from "@/components/resource/character/CharacterExpressionModal";
import { SeriesImageUploadField } from "@/components/series/SeriesImageUploadField";
import { SeriesFormTextInputField } from "@/components/series/SeriesFormTextInputField";
import { SeriesFormTextareaField } from "@/components/series/SeriesFormTextareaField";
import { SeriesFormPageScaffold } from "@/components/series/SeriesFormPageScaffold";
import {
  DEFAULT_FRAME_THEME_ITEM_COUNT,
  FrameThemeSelector,
} from "@/components/series/FrameThemeSelector";
import { useSeriesFormController } from "@/hooks/useSeriesFormController";

export default function SeriesEditPage() {
  const router = useRouter();
  const [profileImageUrl, setProfileImageUrl] = React.useState<string | null>(null);

  const handleBack = useCallback(() => {
    router.push("/series");
  }, [router]);

  const {
    activeTab,
    setActiveTab,
    seriesTitle,
    setSeriesTitle,
    seriesSummary,
    setSeriesSummary,
    seriesKeywords,
    setSeriesKeywords,
    worldviewDescription,
    setWorldviewDescription,
    worldviewPrompt,
    setWorldviewPrompt,
    persona,
    setPersona,
    selectedFrameThemeId,
    setSelectedFrameThemeId,
    frameThemeSelectorRef,
    frameThemePager,
    handleFrameThemePagerChange,
    fieldErrors,
    isFormValid,
    coverPreviewUrl,
    logoPreviewUrl,
    expressionModalOpen,
    coverRef,
    logoRef,
    coverFileInputRef,
    logoFileInputRef,
    titleRef,
    summaryRef,
    keywordsRef,
    worldviewRef,
    promptRef,
    personaRef,
    MAX_TITLE,
    MAX_SUMMARY,
    MAX_KEYWORDS,
    MAX_WORLDVIEW,
    MAX_WORLDVIEW_PROMPT,
    MAX_PERSONA,
    handleRequiredFieldChange,
    openExpressionModalForCover,
    openExpressionModalForLogo,
    getExpressionModalInitialSlots,
    handleExpressionModalSave,
    handleExpressionModalClose,
    handleClearCoverPreview,
    handleClearLogoPreview,
    handleCoverFileSelected,
    handleLogoFileSelected,
    handleSubmit,
  } = useSeriesFormController({
    coverSlotId: "series-cover",
    logoSlotId: "series-logo",
    onValidSubmit: () => {
      // TODO: 실제 저장 로직 연결
    },
  });

  return (
    <SeriesFormPageScaffold
      profileImageUrl={profileImageUrl}
      onProfileImageChange={setProfileImageUrl}
      title="시리즈 관리"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onBack={handleBack}
      onSubmit={handleSubmit}
      submitDisabled={!isFormValid}
      coverPreviewUrl={coverPreviewUrl}
      logoPreviewUrl={logoPreviewUrl}
      contentPaddingClassName="px-10"
      contentGapClassName="gap-5"
    >
      {activeTab === "image" && (
                        <div className="flex flex-col gap-10">
                          <SeriesImageUploadField
                            label="대표이미지*"
                            subtitle="시리즈를 대표하는 공식 이미지입니다. 부적절한 이미지는 사용이 제한됩니다."
                            previewUrl={coverPreviewUrl}
                            previewAlt="대표이미지 미리보기"
                            deleteAriaLabel="대표이미지 삭제"
                            inputId="series-cover-edit"
                            accept="image/*"
                            error={fieldErrors.cover}
                            inputRef={coverFileInputRef}
                            labelRef={coverRef}
                            onActivate={openExpressionModalForCover}
                            onClearPreview={handleClearCoverPreview}
                            onFileSelected={handleCoverFileSelected}
                          />

                          <SeriesImageUploadField
                            label="로고*"
                            subtitle="배경이 투명한 png파일을 사용하세요."
                            previewUrl={logoPreviewUrl}
                            previewAlt="로고 미리보기"
                            deleteAriaLabel="로고 삭제"
                            inputId="series-logo-edit"
                            accept=".png,image/png"
                            error={fieldErrors.logo}
                            inputRef={logoFileInputRef}
                            labelRef={logoRef}
                            onActivate={openExpressionModalForLogo}
                            onClearPreview={handleClearLogoPreview}
                            onFileSelected={handleLogoFileSelected}
                          />

                          <div className="flex flex-col gap-1">
                            <div className="flex items-end justify-end gap-3">
                              <Title1
                                className="min-w-0 flex-1"
                                text="디자인 테마*"
                                variant="title-subtitle-dot"
                                subtitleText="말풍선을 포함한 화면 전체 테마 세트를 선택하세요."
                              />
                              {frameThemePager.needsPager ? (
                                <div className="inline-flex shrink-0 items-center gap-2 pt-0.5">
                                  <span className="whitespace-nowrap text-xs text-on-surface-30">
                                    총 {DEFAULT_FRAME_THEME_ITEM_COUNT}개
                                  </span>
                                  <button
                                    type="button"
                                    aria-label="이전 테마 목록"
                                    onClick={() => frameThemeSelectorRef.current?.goPrev()}
                                    disabled={!frameThemePager.canGoPrev}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border-10 bg-white text-on-surface-30 transition-colors hover:bg-surface-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-40"
                                  >
                                    <ChevronLeft className="h-4 w-4" />
                                  </button>
                                  <button
                                    type="button"
                                    aria-label="다음 테마 목록"
                                    onClick={() => frameThemeSelectorRef.current?.goNext()}
                                    disabled={!frameThemePager.canGoNext}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border-10 bg-white text-on-surface-30 transition-colors hover:bg-surface-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-40"
                                  >
                                    <ChevronRight className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : null}
                            </div>
                            <FrameThemeSelector
                              ref={frameThemeSelectorRef}
                              selectedThemeId={selectedFrameThemeId}
                              onSelectTheme={setSelectedFrameThemeId}
                              onPagerChange={handleFrameThemePagerChange}
                            />
                          </div>

                          <div className="flex justify-end mt-4">
                            <Button
                              type="button"
                              variant="outline"
                              className="border-border-10 text-on-surface-20"
                              onClick={() => setActiveTab("info")}
                            >
                              다음
                            </Button>
                          </div>
                        </div>
      )}

      {activeTab === "info" && (
                        <div className="flex flex-col gap-10">
                          <SeriesFormTextInputField
                            title="시리즈 제목*"
                            subtitle="요약 내용이 AI 전개의 가이드라인이 된다는 기술적 사실을 전달합니다."
                            value={seriesTitle}
                            placeholder="제목을 입력해주세요."
                            maxLength={MAX_TITLE}
                            error={fieldErrors.title}
                            inputRef={titleRef}
                            onValueChange={(value) =>
                              handleRequiredFieldChange(value, setSeriesTitle, "title")
                            }
                          />

                          <SeriesFormTextareaField
                            title="시리즈 요약*"
                            subtitle="작품의 핵심 컨셉을 한 줄로 요약하여 독자의 흥미와 클릭을 유도하세요"
                            value={seriesSummary}
                            placeholder="시리즈 요약 내용을 작성해주세요."
                            maxLength={MAX_SUMMARY}
                            rows={3}
                            error={fieldErrors.summary}
                            textareaRef={summaryRef}
                            onValueChange={(value) =>
                              handleRequiredFieldChange(value, setSeriesSummary, "summary")
                            }
                          />

                          <SeriesFormTextInputField
                            title="키워드*"
                            subtitle="세계관은 모든 에피소드의 배경과 논리를 구성하는 기준이 됩니다."
                            value={seriesKeywords}
                            placeholder="키워드를 작성해주세요."
                            maxLength={MAX_KEYWORDS}
                            error={fieldErrors.keywords}
                            inputRef={keywordsRef}
                            onValueChange={(value) =>
                              handleRequiredFieldChange(value, setSeriesKeywords, "keywords")
                            }
                          />

                          <SeriesFormTextareaField
                            title="세계관 설명*"
                            subtitle="독자들이 작품의 배경과 규칙을 쉽고 깊이 있게 이해할 수 있도록 자유롭게 설명해 주세요."
                            value={worldviewDescription}
                            placeholder="세계관 내용을 작성해주세요."
                            maxLength={MAX_WORLDVIEW}
                            rows={6}
                            error={fieldErrors.worldview}
                            textareaRef={worldviewRef}
                            onValueChange={(value) =>
                              handleRequiredFieldChange(value, setWorldviewDescription, "worldview")
                            }
                          />

                          <div className="flex justify-end gap-2 mt-4">
                            <Button
                              type="button"
                              variant="outline"
                              className="border-border-10 text-on-surface-20"
                              onClick={() => setActiveTab("image")}
                            >
                              이전
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              className="border-border-10 text-on-surface-20"
                              onClick={() => setActiveTab("worldview")}
                            >
                              다음
                            </Button>
                          </div>
                        </div>
      )}

      {activeTab === "worldview" && (
                        <div className="flex flex-col gap-10">
                          <SeriesFormTextareaField
                            title="세계관 프롬프트*"
                            subtitle="세계관은 모든 에피소드의 배경과 논리를 구성하는 절대적인 기준이 됩니다. 설정이 구체적일수록 AI가 원작의 의도에서 벗어나지 않고 일관성 있는 전개를 이어갈 수 있습니다."
                            value={worldviewPrompt}
                            placeholder="세계관 프롬프트를 작성해주세요."
                            maxLength={MAX_WORLDVIEW_PROMPT}
                            rows={8}
                            error={fieldErrors.prompt}
                            textareaRef={promptRef}
                            onValueChange={(value) =>
                              handleRequiredFieldChange(value, setWorldviewPrompt, "prompt")
                            }
                          />

                          <SeriesFormTextInputField
                            title="페르소나*"
                            subtitle="작품의 핵심 컨셉을 한 줄로 요약하여 독자의 흥미와 클릭을 유도하세요"
                            value={persona}
                            placeholder="페르소나를 입력해주세요."
                            maxLength={MAX_PERSONA}
                            error={fieldErrors.persona}
                            inputRef={personaRef}
                            onValueChange={(value) =>
                              handleRequiredFieldChange(value, setPersona, "persona")
                            }
                          />

                          <div className="flex justify-end gap-2 mt-4">
                            <Button
                              type="button"
                              variant="outline"
                              className="border-border-10 text-on-surface-20"
                              onClick={() => setActiveTab("info")}
                            >
                              이전
                            </Button>
                          </div>
                        </div>
      )}
      <ImageCropOnlyModal
        open={expressionModalOpen}
        onClose={handleExpressionModalClose}
        initialSlots={getExpressionModalInitialSlots()}
        onSave={handleExpressionModalSave}
      />
    </SeriesFormPageScaffold>
  );
}
