"use client";

import React, { useCallback, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AddResourceSlot } from "@/components/resource/cards/AddResourceSlot";
import { Title1 } from "@/components/ui/title1";
import { Title2 } from "@/components/ui/title2";

export type ImageResourceKind = "background" | "scene" | "media" | "gallery";

export interface ImageResourceDetailPageProps {
  kind: ImageResourceKind;
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
        thumbnailLabel: "대표 썸네일*",
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
        thumbnailLabel: "대표 썸네일*",
        thumbnailSubtitle: "연출이 대표적으로 드러나는 이미지를 등록해 주세요.",
      };
    case "media":
      return {
        headerTitle: "미디어 등록",
        sectionTitle: "미디어 정보",
        nameLabel: "미디어 이름*",
        nameSubtitle: "영상·이미지 등을 구분할 수 있는 이름을 입력해 주세요.",
        descriptionLabel: "미디어 설명*",
        descriptionSubtitle: "어떤 상황에서 사용되는 미디어인지 간단히 설명해 주세요.",
        thumbnailLabel: "대표 썸네일*",
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
        thumbnailLabel: "대표 썸네일*",
        thumbnailSubtitle: "갤러리 목록에서 먼저 보여질 이미지를 등록해 주세요.",
      };
  }
}

export function ImageResourceDetailPage({ kind }: ImageResourceDetailPageProps) {
  const router = useRouter();
  const params = useParams();
  const seriesId = typeof params?.id === "string" ? params.id : "";

  const labels = getLabels(kind);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sceneAiMode, setSceneAiMode] = useState<"apply" | "none">("apply");

  const handleBack = useCallback(() => {
    router.push(`/series/${seriesId}/resources`);
  }, [router, seriesId]);

  const handleSave = useCallback(() => {
    // TODO: 실제 저장 로직은 추후 API 연동 시 구현
    router.push(`/series/${seriesId}/resources`);
  }, [router, seriesId]);

  return (
    <main className="flex flex-1 flex-col overflow-hidden bg-slate-50">
      {/* 상단 서브 헤더 */}
      <header className="flex h-16 shrink-0 items-center justify-center border-b border-slate-200 bg-white px-6 py-0">
        <div className="flex w-full max-w-[1200px] min-w-[800px] items-center justify-between gap-4">
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
            <h1 className="text-2xl font-bold text-on-surface-10">{labels.headerTitle}</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto flex flex-col items-center py-8 px-5 gap-4">
        <div className="w-full max-w-[1200px] min-w-[800px]">
          <div className="w-full rounded-2xl border border-slate-200 bg-white">
            <Title2
              text={labels.sectionTitle}
              asSectionHeader
              className="px-8 pt-5 pb-3"
            />

            <div className="px-8 py-6 flex flex-col gap-8">
              {/* 이름 */}
              <section className="flex flex-col gap-2">
                <Title1
                  text={labels.nameLabel}
                  showDot
                  subtitle
                  subtitleText={labels.nameSubtitle}
                />
                <div className="flex flex-col justify-center items-start gap-2">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름을 입력해 주세요."
                    className="h-12 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary shadow-none"
                  />
                </div>
              </section>

              {/* 설명 */}
              <section className="flex flex-col gap-2">
                <Title1
                  text={labels.descriptionLabel}
                  showDot
                  subtitle
                  subtitleText={labels.descriptionSubtitle}
                />
                <div className="flex flex-col justify-start items-start gap-2">
                  <Textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="설명을 입력해 주세요."
                    className="resize-y rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary w-full min-h-[96px]"
                  />
                </div>
              </section>

              {/* 대표 썸네일 */}
              <section className="flex flex-col gap-3">
                <Title1
                  text={labels.thumbnailLabel}
                  showDot={false}
                  subtitle
                  subtitleText={labels.thumbnailSubtitle}
                />
                <AddResourceSlot
                  variant="img9:16"
                  ariaLabel="대표 썸네일 업로드"
                  onClick={() => {
                    // 실제 업로드 연동은 추후 구현
                  }}
                />
              </section>

              {/* 연출장면 전용: AI채팅 적용 여부 */}
              {kind === "scene" && (
                <section className="flex flex-col gap-2">
                  <Title1
                    text="AI채팅 적용 여부*"
                    showDot
                    subtitle
                    subtitleText="이 연출장면을 AI 자동 전개에 사용할지 여부를 선택해 주세요."
                  />
                  <div className="flex items-center gap-6 mt-1">
                    <button
                      type="button"
                      onClick={() => setSceneAiMode("apply")}
                      className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-10"
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                          sceneAiMode === "apply"
                            ? "border-[rgba(255,0,128,1)]"
                            : "border-border-20"
                        }`}
                      >
                        {sceneAiMode === "apply" && (
                          <span className="h-2.5 w-2.5 rounded-full bg-[rgba(255,0,128,1)]" />
                        )}
                      </span>
                      <span>적용</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSceneAiMode("none")}
                      className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-30"
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                          sceneAiMode === "none"
                            ? "border-[rgba(255,0,128,1)]"
                            : "border-border-20"
                        }`}
                      >
                        {sceneAiMode === "none" && (
                          <span className="h-2.5 w-2.5 rounded-full bg-[rgba(255,0,128,1)]" />
                        )}
                      </span>
                      <span>적용 안 함</span>
                    </button>
                  </div>
                </section>
              )}
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
    </main>
  );
}

