"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ImageCropOnlyModal } from "@/components/resource/character/CharacterExpressionModal";
import { SeriesImageUploadField } from "@/components/series/SeriesImageUploadField";
import { THUMBNAIL_SLOT_ARIA } from "@/lib/thumbnail-styles";
import { SeriesFormTextInputField } from "@/components/series/SeriesFormTextInputField";
import { SeriesFormKeywordsField } from "@/components/series/SeriesFormKeywordsField";
import { SeriesFormTextareaField } from "@/components/series/SeriesFormTextareaField";
import { SeriesFormPageScaffold } from "@/components/series/SeriesFormPageScaffold";
import { SeriesFormStepNav } from "@/components/series/SeriesFormStepNav";
import { PAGE_FOOTER_ACTION_BUTTON_CLASS } from "@/lib/page-layout";
import { useSeriesFormController } from "@/hooks/useSeriesFormController";
import { useFormAiDraftComposer } from "@/hooks/useFormAiDraftComposer";
import { generateSeriesDraftFromBrief } from "@/lib/series-ai-draft";
import type { SeriesAiDraft } from "@/lib/series-ai-draft";

export default function SeriesNewPage() {
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
    keywordInput,
    keywordList,
    isComposingKeyword,
    setIsComposingKeyword,
    setKeywordInput,
    handleAddKeyword,
    handleRemoveKeyword,
    initKeywordsFromString,
    worldviewDescription,
    setWorldviewDescription,
    worldviewPrompt,
    setWorldviewPrompt,
    persona,
    setPersona,
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
    coverSlotId: "series-cover-new",
    logoSlotId: "series-logo-new",
    onValidSubmit: () => {
      // TODO: 실제 생성 로직 연결
    },
  });

  const applySeriesDraft = useCallback(
    (draft: SeriesAiDraft) => {
      setSeriesTitle(draft.title);
      setSeriesSummary(draft.summary);
      initKeywordsFromString(draft.keywords.join(", "));
      setWorldviewDescription(draft.worldview);
      setWorldviewPrompt(draft.prompt);
      setPersona(draft.persona);
    },
    [
      initKeywordsFromString,
      setPersona,
      setSeriesSummary,
      setSeriesTitle,
      setWorldviewDescription,
      setWorldviewPrompt,
    ],
  );

  const seriesAiComposer = useFormAiDraftComposer({
    generate: generateSeriesDraftFromBrief,
    onApply: applySeriesDraft,
    successMessage: "시리즈 정보 초안을 채웠어요.",
    fallbackMessage: "AI 설정이 없어 임시 규칙으로 채웠어요.",
    errorMessage: "시리즈 초안 생성에 실패했어요.",
  });

  return (
    <SeriesFormPageScaffold
      profileImageUrl={profileImageUrl}
      onProfileImageChange={setProfileImageUrl}
      title="시리즈 만들기"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onBack={handleBack}
      onSubmit={handleSubmit}
      submitDisabled={!isFormValid}
      showDraftButton
      coverPreviewUrl={coverPreviewUrl}
      logoPreviewUrl={logoPreviewUrl}
      contentGapClassName="gap-my-40"
      aiComposer={{
        briefPrompt: seriesAiComposer.briefPrompt,
        onBriefChange: seriesAiComposer.setBriefPrompt,
        onSubmit: () => void seriesAiComposer.handleGenerate(),
        isGenerating: seriesAiComposer.isGenerating,
      }}
    >
      {activeTab === "image" && (
                        <div className="flex flex-col gap-my-40">
                          {/* 대표이미지 */}
                          <SeriesImageUploadField
                            label="대표이미지*"
                            subtitle="시리즈를 대표하는 공식 이미지입니다. 부적절한 이미지는 사용이 제한됩니다."
                            previewUrl={coverPreviewUrl}
                            previewAlt="대표이미지 미리보기"
                            addAriaLabel={THUMBNAIL_SLOT_ARIA.addRepresentativeImage}
                            deleteAriaLabel="대표이미지 삭제"
                            inputId="series-cover"
                            accept="image/*"
                            error={fieldErrors.cover}
                            inputRef={coverFileInputRef}
                            labelRef={coverRef}
                            onActivate={openExpressionModalForCover}
                            onClearPreview={handleClearCoverPreview}
                            onFileSelected={handleCoverFileSelected}
                          />

                          {/* 로고 */}
                          <SeriesImageUploadField
                            label="로고*"
                            subtitle="배경이 투명한 png파일을 사용하세요."
                            previewUrl={logoPreviewUrl}
                            previewAlt="로고 미리보기"
                            addAriaLabel={THUMBNAIL_SLOT_ARIA.addLogo}
                            deleteAriaLabel="로고 삭제"
                            inputId="series-logo"
                            accept=".png,image/png"
                            error={fieldErrors.logo}
                            inputRef={logoFileInputRef}
                            labelRef={logoRef}
                            onActivate={openExpressionModalForLogo}
                            onClearPreview={handleClearLogoPreview}
                            onFileSelected={handleLogoFileSelected}
                          />

                          <SeriesFormStepNav>
                            <Button
                              type="button"
                              variant="secondary"
                              size="form"
                              className={PAGE_FOOTER_ACTION_BUTTON_CLASS}
                              onClick={() => setActiveTab("info")}
                            >
                              다음
                            </Button>
                          </SeriesFormStepNav>
                        </div>
      )}

      {activeTab === "info" && (
                        <div className="flex flex-col gap-my-40">
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

                          <SeriesFormKeywordsField
                            title="키워드*"
                            subtitle="세계관은 모든 에피소드의 배경과 논리를 구성하는 기준이 됩니다."
                            keywordInput={keywordInput}
                            keywordList={keywordList}
                            placeholder="예) 판타지, 학원, 로맨스"
                            maxLength={MAX_KEYWORDS}
                            error={fieldErrors.keywords}
                            inputRef={keywordsRef}
                            isComposing={isComposingKeyword}
                            onKeywordInputChange={setKeywordInput}
                            onComposingChange={setIsComposingKeyword}
                            onAddKeyword={handleAddKeyword}
                            onRemoveKeyword={handleRemoveKeyword}
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

                          <SeriesFormStepNav>
                            <Button
                              type="button"
                              variant="secondary"
                              size="form"
                              className={PAGE_FOOTER_ACTION_BUTTON_CLASS}
                              onClick={() => setActiveTab("image")}
                            >
                              이전
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              size="form"
                              className={PAGE_FOOTER_ACTION_BUTTON_CLASS}
                              onClick={() => setActiveTab("worldview")}
                            >
                              다음
                            </Button>
                          </SeriesFormStepNav>
                        </div>
      )}

      {activeTab === "worldview" && (
                        <div className="flex flex-col gap-my-40">
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

                          <SeriesFormStepNav>
                            <Button
                              type="button"
                              variant="secondary"
                              size="form"
                              className={PAGE_FOOTER_ACTION_BUTTON_CLASS}
                              onClick={() => setActiveTab("info")}
                            >
                              이전
                            </Button>
                          </SeriesFormStepNav>
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
