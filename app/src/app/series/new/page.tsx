"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Play } from "lucide-react";
import Header from "@/components/Header/Header";
import AppSidebar from "@/components/AppSidebar/AppSidebar";
import { PageCard } from "@/components/layout/PageCard";
import { Button } from "@/components/ui/button";
import { Title1 } from "@/components/ui/title1";
import { cn } from "@/lib/utils";

type SeriesCreateTab = "image" | "info" | "worldview";

export default function SeriesNewPage() {
  const router = useRouter();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SeriesCreateTab>("image");
  const [seriesTitle, setSeriesTitle] = useState("");
  const [seriesSummary, setSeriesSummary] = useState("");
  const [seriesKeywords, setSeriesKeywords] = useState("");
  const [worldviewDescription, setWorldviewDescription] = useState("");
  const [worldviewPrompt, setWorldviewPrompt] = useState("");
  const [persona, setPersona] = useState("");

  const [hasCoverImage, setHasCoverImage] = useState(false);
  const [hasLogoImage, setHasLogoImage] = useState(false);

  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState({
    cover: false,
    logo: false,
    title: false,
    summary: false,
    keywords: false,
    worldview: false,
    prompt: false,
    persona: false,
  });

  const coverRef = useRef<HTMLLabelElement | null>(null);
  const logoRef = useRef<HTMLLabelElement | null>(null);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const summaryRef = useRef<HTMLTextAreaElement | null>(null);
  const keywordsRef = useRef<HTMLInputElement | null>(null);
  const worldviewRef = useRef<HTMLTextAreaElement | null>(null);
  const promptRef = useRef<HTMLTextAreaElement | null>(null);
  const personaRef = useRef<HTMLInputElement | null>(null);

  const MAX_TITLE = 50;
  const MAX_SUMMARY = 100;
  const MAX_KEYWORDS = 50;
  const MAX_WORLDVIEW = 500;
  const MAX_WORLDVIEW_PROMPT = 1500;
  const MAX_PERSONA = 50;

  const handleBack = useCallback(() => {
    router.push("/series");
  }, [router]);

  useEffect(() => {
    return () => {
      if (coverPreviewUrl) {
        URL.revokeObjectURL(coverPreviewUrl);
      }
      if (logoPreviewUrl) {
        URL.revokeObjectURL(logoPreviewUrl);
      }
    };
  }, [coverPreviewUrl, logoPreviewUrl]);

  const isFormValid =
    hasCoverImage &&
    hasLogoImage &&
    seriesTitle.trim().length > 0 &&
    seriesSummary.trim().length > 0 &&
    seriesKeywords.trim().length > 0 &&
    worldviewDescription.trim().length > 0 &&
    worldviewPrompt.trim().length > 0 &&
    persona.trim().length > 0;

  const focusField = (
    tab: SeriesCreateTab,
    ref: { current: HTMLElement | null }
  ) => {
    setActiveTab(tab);
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      ref.current?.focus?.();
    }, 0);
  };

  const handleSubmit = () => {
    const errors = {
      cover: !hasCoverImage,
      logo: !hasLogoImage,
      title: seriesTitle.trim().length === 0,
      summary: seriesSummary.trim().length === 0,
      keywords: seriesKeywords.trim().length === 0,
      worldview: worldviewDescription.trim().length === 0,
      prompt: worldviewPrompt.trim().length === 0,
      persona: persona.trim().length === 0,
    };

    setFieldErrors(errors);

    if (!Object.values(errors).some(Boolean)) {
      // TODO: 실제 생성 로직 연결
      return;
    }

    if (errors.cover) {
      focusField("image", coverRef);
      return;
    }
    if (errors.logo) {
      focusField("image", logoRef);
      return;
    }
    if (errors.title) {
      focusField("info", titleRef);
      return;
    }
    if (errors.summary) {
      focusField("info", summaryRef);
      return;
    }
    if (errors.keywords) {
      focusField("info", keywordsRef);
      return;
    }
    if (errors.worldview) {
      focusField("info", worldviewRef);
      return;
    }
    if (errors.prompt) {
      focusField("worldview", promptRef);
      return;
    }
    if (errors.persona) {
      focusField("worldview", personaRef);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl} />
      <div className="flex flex-1 overflow-hidden bg-slate-50">
        <AppSidebar defaultActiveId="series" />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <main className="flex flex-1 flex-col overflow-hidden bg-slate-50">
            {/* Sub Header: 뒤로가기 + 시리즈 만들기 | 임시저장, 등록하기 (EditorInner와 동일 스타일) */}
            <header className="flex h-16 shrink-0 items-center justify-center border-b border-slate-200 bg-white px-6 py-0">
              <div className="flex w-full max-w-[1200px] min-w-[800px] items-center justify-between gap-4">
                <div className="flex items-center justify-start gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleBack}
                    className="h-9 w-9 shrink-0 rounded-full border-slate-200 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    aria-label="시리즈 목록으로"
                  >
                    <ChevronLeft className="h-5 w-5 text-slate-600" strokeWidth={2} />
                  </Button>
                  <h1 className="text-2xl font-extrabold text-on-surface-10">시리즈 만들기</h1>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  >
                    임시저장
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    className={cn(
                      "bg-primary text-primary-foreground hover:bg-primary/90",
                      !isFormValid && "bg-primary/40 hover:bg-primary/40 cursor-not-allowed"
                    )}
                  >
                    등록하기
                  </Button>
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto flex flex-col items-center py-8 gap-3">
              <div className="w-full max-w-[1200px] min-w-[800px] flex gap-5">
                {/* 왼쪽: 폼 영역 */}
                <div className="flex-1 min-w-0">
                  <PageCard className="h-fit rounded-2xl flex flex-col shrink-0 overflow-hidden px-0 pt-0 pb-0">
                    {/* 탭: 이미지, 정보, 세계관 (문의 페이지와 동일 스타일) */}
                    <div className="self-stretch px-5 pt-0 pb-0 mt-2 mb-2 border-b border-border-10 inline-flex flex-col justify-start items-start gap-2.5">
                      <div className="self-stretch inline-flex justify-start items-center gap-4 overflow-hidden">
                        {(
                          [
                            ["image", "이미지"],
                            ["info", "정보"],
                            ["worldview", "세계관"],
                          ] as const
                        ).map(([id, label]) => (
                          <button
                            key={id}
                            type="button"
                            className={cn(
                              "h-10 flex cursor-pointer justify-center items-center gap-2.5 min-w-0 border-b-2 transition-colors font-['Pretendard_JP',sans-serif] text-base font-bold leading-6",
                              activeTab === id
                                ? "border-slate-800 text-on-surface-10"
                                : "border-transparent text-on-surface-disabled"
                            )}
                            onClick={() => setActiveTab(id)}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="self-stretch px-5 pt-2 pb-5">
                      {activeTab === "image" && (
                        <div className="flex flex-col gap-10">
                          {/* 대표이미지 */}
                          <div className="flex flex-col gap-1">
                            <Title1
                              text="대표이미지*"
                              showDot
                              subtitle
                              subtitleText="시리즈를 대표하는 공식 이미지입니다. 부적절한 이미지는 사용이 제한됩니다."
                            />
                            <label
                              ref={coverRef}
                              htmlFor="series-cover"
                              className={cn(
                                "mt-2 flex w-[90px] h-[160px] cursor-pointer items-center justify-center rounded-lg border border-dashed bg-white overflow-hidden",
                                fieldErrors.cover ? "border-destructive" : "border-border-20"
                              )}
                              tabIndex={-1}
                            >
                              {coverPreviewUrl ? (
                                <img
                                  src={coverPreviewUrl}
                                  alt="대표이미지 미리보기"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-6 h-6 relative flex items-center justify-center text-on-surface-10">
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                  >
                                    <path
                                      d="M12 5v14M5 12h14"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                </div>
                              )}
                            </label>
                            <input
                              id="series-cover"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                const hasFile = !!file;
                                setHasCoverImage(hasFile);
                                if (hasFile) {
                                  setFieldErrors((prev) => ({ ...prev, cover: false }));
                                  setCoverPreviewUrl((prev) => {
                                    if (prev) URL.revokeObjectURL(prev);
                                    return URL.createObjectURL(file as File);
                                  });
                                } else {
                                  setCoverPreviewUrl((prev) => {
                                    if (prev) URL.revokeObjectURL(prev);
                                    return null;
                                  });
                                }
                              }}
                            />
                          </div>

                          {/* 로고 */}
                          <div className="flex flex-col gap-1">
                            <Title1
                              text="로고*"
                              showDot
                              subtitle
                              subtitleText="배경이 투명한 png파일을 사용하세요."
                            />
                            <label
                              ref={logoRef}
                              htmlFor="series-logo"
                              className={cn(
                                "mt-2 flex w-[90px] h-[160px] cursor-pointer items-center justify-center rounded-lg border border-dashed bg-white overflow-hidden",
                                fieldErrors.logo ? "border-destructive" : "border-border-20"
                              )}
                              tabIndex={-1}
                            >
                              {logoPreviewUrl ? (
                                <img
                                  src={logoPreviewUrl}
                                  alt="로고 미리보기"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-6 h-6 relative flex items-center justify-center text-on-surface-10">
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                  >
                                    <path
                                      d="M12 5v14M5 12h14"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                </div>
                              )}
                            </label>
                            <input
                              id="series-logo"
                              type="file"
                              accept=".png,image/png"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                const hasFile = !!file;
                                setHasLogoImage(hasFile);
                                if (hasFile) {
                                  setFieldErrors((prev) => ({ ...prev, logo: false }));
                                  setLogoPreviewUrl((prev) => {
                                    if (prev) URL.revokeObjectURL(prev);
                                    return URL.createObjectURL(file as File);
                                  });
                                } else {
                                  setLogoPreviewUrl((prev) => {
                                    if (prev) URL.revokeObjectURL(prev);
                                    return null;
                                  });
                                }
                              }}
                            />
                          </div>

                          <div className="flex justify-end mt-4">
                            <Button
                              type="button"
                              variant="outline"
                              className="border-slate-200 text-slate-700"
                              onClick={() => setActiveTab("info")}
                            >
                              다음
                            </Button>
                          </div>
                        </div>
                      )}

                      {activeTab === "info" && (
                        <div className="flex flex-col gap-10">
                          {/* 시리즈 제목 */}
                          <div className="flex flex-col gap-1">
                            <Title1
                              text="시리즈 제목*"
                              showDot
                              subtitle
                              subtitleText="요약 내용이 AI 전개의 가이드라인이 된다는 기술적 사실을 전달합니다."
                            />
                            <input
                              ref={titleRef}
                              type="text"
                              maxLength={MAX_TITLE}
                              value={seriesTitle}
                              onChange={(e) => {
                                setSeriesTitle(e.target.value);
                                if (e.target.value.trim().length > 0) {
                                  setFieldErrors((prev) => ({ ...prev, title: false }));
                                }
                              }}
                              placeholder="제목을 입력해주세요."
                              className={cn(
                                "mt-1 h-12 rounded-md border bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 w-full",
                                fieldErrors.title
                                  ? "border-destructive focus:ring-destructive/40"
                                  : "border-slate-200 focus:ring-primary"
                              )}
                            />
                            <div className="flex justify-end text-xs text-on-surface-30">
                              {seriesTitle.length}/{MAX_TITLE}
                            </div>
                          </div>

                          {/* 시리즈 요약 */}
                          <div className="flex flex-col gap-1">
                            <Title1
                              text="시리즈 요약*"
                              showDot
                              subtitle
                              subtitleText="작품의 핵심 컨셉을 한 줄로 요약하여 독자의 흥미와 클릭을 유도하세요"
                            />
                            <textarea
                              ref={summaryRef}
                              rows={3}
                              maxLength={MAX_SUMMARY}
                              value={seriesSummary}
                              onChange={(e) => {
                                setSeriesSummary(e.target.value);
                                if (e.target.value.trim().length > 0) {
                                  setFieldErrors((prev) => ({ ...prev, summary: false }));
                                }
                              }}
                              placeholder="시리즈 요약 내용을 작성해주세요."
                              className={cn(
                                "mt-1 resize-y rounded-md border bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 w-full min-h-[160px]",
                                fieldErrors.summary
                                  ? "border-destructive focus:ring-destructive/40"
                                  : "border-slate-200 focus:ring-primary"
                              )}
                            />
                            <div className="flex justify-end text-xs text-on-surface-30">
                              {seriesSummary.length}/{MAX_SUMMARY}
                            </div>
                          </div>

                          {/* 키워드 */}
                          <div className="flex flex-col gap-1">
                            <Title1
                              text="키워드*"
                              showDot
                              subtitle
                              subtitleText="세계관은 모든 에피소드의 배경과 논리를 구성하는 기준이 됩니다."
                            />
                            <input
                              ref={keywordsRef}
                              type="text"
                              maxLength={MAX_KEYWORDS}
                              value={seriesKeywords}
                              onChange={(e) => {
                                setSeriesKeywords(e.target.value);
                                if (e.target.value.trim().length > 0) {
                                  setFieldErrors((prev) => ({ ...prev, keywords: false }));
                                }
                              }}
                              placeholder="키워드를 작성해주세요."
                              className={cn(
                                "mt-1 h-12 rounded-md border bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 w-full",
                                fieldErrors.keywords
                                  ? "border-destructive focus:ring-destructive/40"
                                  : "border-slate-200 focus:ring-primary"
                              )}
                            />
                            <div className="flex justify-end text-xs text-on-surface-30">
                              {seriesKeywords.length}/{MAX_KEYWORDS}
                            </div>
                          </div>

                          {/* 세계관 설명 */}
                          <div className="flex flex-col gap-1">
                            <Title1
                              text="세계관 설명*"
                              showDot
                              subtitle
                              subtitleText="독자들이 작품의 배경과 규칙을 쉽고 깊이 있게 이해할 수 있도록 자유롭게 설명해 주세요."
                            />
                            <textarea
                              ref={worldviewRef}
                              rows={6}
                              maxLength={MAX_WORLDVIEW}
                              value={worldviewDescription}
                              onChange={(e) => {
                                setWorldviewDescription(e.target.value);
                                if (e.target.value.trim().length > 0) {
                                  setFieldErrors((prev) => ({ ...prev, worldview: false }));
                                }
                              }}
                              placeholder="세계관 내용을 작성해주세요."
                              className={cn(
                                "mt-1 resize-y rounded-md border bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 w-full min-h-[160px]",
                                fieldErrors.worldview
                                  ? "border-destructive focus:ring-destructive/40"
                                  : "border-slate-200 focus:ring-primary"
                              )}
                            />
                            <div className="flex justify-end text-xs text-on-surface-30">
                              {worldviewDescription.length}/{MAX_WORLDVIEW}
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 mt-4">
                            <Button
                              type="button"
                              variant="outline"
                              className="border-slate-200 text-slate-700"
                              onClick={() => setActiveTab("image")}
                            >
                              이전
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              className="border-slate-200 text-slate-700"
                              onClick={() => setActiveTab("worldview")}
                            >
                              다음
                            </Button>
                          </div>
                        </div>
                      )}

                      {activeTab === "worldview" && (
                        <div className="flex flex-col gap-10">
                          {/* 세계관 프롬프트 */}
                          <div className="flex flex-col gap-1">
                            <Title1
                              text="세계관 프롬프트*"
                              showDot
                              subtitle
                              subtitleText="세계관은 모든 에피소드의 배경과 논리를 구성하는 절대적인 기준이 됩니다. 설정이 구체적일수록 AI가 원작의 의도에서 벗어나지 않고 일관성 있는 전개를 이어갈 수 있습니다."
                            />
                            <textarea
                              ref={promptRef}
                              rows={8}
                              maxLength={MAX_WORLDVIEW_PROMPT}
                              value={worldviewPrompt}
                              onChange={(e) => {
                                setWorldviewPrompt(e.target.value);
                                if (e.target.value.trim().length > 0) {
                                  setFieldErrors((prev) => ({ ...prev, prompt: false }));
                                }
                              }}
                              placeholder="세계관 프롬프트를 작성해주세요."
                              className={cn(
                                "mt-1 resize-y rounded-md border bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 w-full min-h-[160px]",
                                fieldErrors.prompt
                                  ? "border-destructive focus:ring-destructive/40"
                                  : "border-slate-200 focus:ring-primary"
                              )}
                            />
                            <div className="flex justify-end text-xs text-on-surface-30">
                              {worldviewPrompt.length}/{MAX_WORLDVIEW_PROMPT}
                            </div>
                          </div>

                          {/* 페르소나 */}
                          <div className="flex flex-col gap-1">
                            <Title1
                              text="페르소나*"
                              showDot
                              subtitle
                              subtitleText="작품의 핵심 컨셉을 한 줄로 요약하여 독자의 흥미와 클릭을 유도하세요"
                            />
                            <input
                              ref={personaRef}
                              type="text"
                              maxLength={MAX_PERSONA}
                              value={persona}
                              onChange={(e) => {
                                setPersona(e.target.value);
                                if (e.target.value.trim().length > 0) {
                                  setFieldErrors((prev) => ({ ...prev, persona: false }));
                                }
                              }}
                              placeholder="페르소나를 입력해주세요."
                              className={cn(
                                "mt-1 h-12 rounded-md border bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 w-full",
                                fieldErrors.persona
                                  ? "border-destructive focus:ring-destructive/40"
                                  : "border-slate-200 focus:ring-primary"
                              )}
                            />
                            <div className="flex justify-end text-xs text-on-surface-30">
                              {persona.length}/{MAX_PERSONA}
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 mt-4">
                            <Button
                              type="button"
                              variant="outline"
                              className="border-slate-200 text-slate-700"
                              onClick={() => setActiveTab("info")}
                            >
                              이전
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </PageCard>
                </div>

                {/* 오른쪽: 미리보기 (공통 레이아웃) */}
                <div className="w-[300px] shrink-0 flex flex-col gap-3">
                  <p className="text-base font-semibold text-slate-700">미리보기</p>
                  <div className="w-full flex justify-center">
                    <div className="w-[300px] h-[652px] relative bg-slate-100 rounded-[2rem] outline outline-8 outline-slate-800 overflow-hidden flex flex-col">
                      <div className="flex-1 bg-slate-300 flex flex-col justify-end items-center pb-4">
                        <button
                          type="button"
                          className="flex items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                        >
                          <Play className="w-4 h-4" aria-hidden />
                          지금 플레이
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
