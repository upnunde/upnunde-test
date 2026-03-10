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

interface CharacterDetailPageProps {
  /** 신규 생성인지 여부 (지금은 true 만 사용) */
  isNew?: boolean;
}

export function CharacterDetailPage({ isNew = true }: CharacterDetailPageProps) {
  const router = useRouter();
  const params = useParams();
  const seriesId = typeof params?.id === "string" ? params.id : "";

  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("");
  const [greeting, setGreeting] = useState("");

  const handleBack = useCallback(() => {
    router.push(`/series/${seriesId}/resources`);
  }, [router, seriesId]);

  const handleSave = useCallback(() => {
    // 실제 저장 로직은 추후 API 연동 시 구현
    router.push(`/series/${seriesId}/resources`);
  }, [router, seriesId]);

  return (
    <main className="flex flex-1 flex-col overflow-hidden bg-slate-50">
      {/* 상단 서브 헤더 - 리소스 관리/에피소드 관리와 동일 톤 */}
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
            <h1 className="text-2xl font-bold text-on-surface-10">등장인물 {isNew ? "등록" : "상세"}</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto flex flex-col items-center py-8 px-5 gap-4">
        <div className="w-full max-w-[1200px] min-w-[800px]">
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
                  showDot
                  subtitle
                  subtitleText="캐릭터의 이름을 입력해 주세요."
                />
                <div className="flex flex-col justify-center items-start gap-2">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="예) 한하루"
                    className="h-12 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary shadow-none"
                  />
                  <div className="w-full inline-flex justify-end items-center gap-2">
                    <div className="text-right text-on-surface-30 text-xs font-normal leading-4">0/30</div>
                  </div>
                </div>
              </section>

              {/* 인물 소개 */}
              <section className="flex flex-col gap-2">
                <Title1
                  text="인물 소개*"
                  showDot
                  subtitle
                  subtitleText="한 줄로 인물의 특징이 드러나도록 정리해 주세요."
                />
                <div className="flex flex-col justify-center items-start gap-2">
                  <Input
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="예) 사람의 소리를 볼 수 있는 소리 수집가 소년"
                    className="h-12 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="w-full inline-flex justify-end items-center gap-2">
                    <div className="text-right text-on-surface-30 text-xs font-normal leading-4">0/50</div>
                  </div>
                </div>
              </section>

              {/* 대표 썸네일 / 표정 */}
              <section className="flex flex-col gap-4">
                <div className="grid grid-cols-[auto,1fr] gap-8 items-start">
                  <div className="flex flex-col gap-3">
                    <Title1
                      text="대표 썸네일"
                      showDot={false}
                      subtitle
                      subtitleText="독자에게 가장 먼저 보여질 캐릭터 이미지를 등록해 주세요."
                    />
                    <AddResourceSlot
                      variant="character"
                      ariaLabel="대표 썸네일 추가"
                      onClick={() => {
                        // 실제 업로드 연동은 추후 구현
                      }}
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <Title1
                      text="표정"
                      showDot={false}
                      subtitle
                      subtitleText="다양한 감정을 표현할 수 있는 표정을 여러 장까지 등록해 둘 수 있어요."
                    />
                    <div className="flex flex-wrap gap-3">
                      <AddResourceSlot
                        variant="character"
                        ariaLabel="표정 이미지 추가"
                        onClick={() => {
                          // 실제 업로드 연동은 추후 구현
                        }}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* 해시태그 */}
              <section className="flex flex-col gap-2">
                <Title1
                  text="해시태그"
                  showDot={false}
                  subtitle
                  subtitleText="캐릭터를 한눈에 파악할 수 있는 키워드를 입력해 주세요. 쉼표로 구분됩니다."
                />
                <div className="flex flex-col justify-center items-start gap-2">
                  <Input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="예) 고등학생, 사진, 츤데레"
                    className="h-12 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="w-full inline-flex justify-end items-center gap-2">
                    <div className="text-right text-on-surface-30 text-xs font-normal leading-4">0/50</div>
                  </div>
                </div>
              </section>

              {/* 인물 인사 */}
              <section className="flex flex-col gap-2">
                <Title1
                  text="인물 인사"
                  showDot={false}
                  subtitle
                  subtitleText="캐릭터의 말투와 성격이 드러나는 짧은 소개 멘트를 작성해 주세요."
                />
                <div className="flex flex-col justify-start items-start gap-2">
                  <Textarea
                    rows={5}
                    value={greeting}
                    onChange={(e) => setGreeting(e.target.value)}
                    placeholder="예) 안녕, 오늘도 사진 찍으러 나갈 준비됐지?"
                    className="resize-y rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary w-full min-h-[80px]"
                  />
                  <div className="w-full inline-flex justify-end items-center gap-2">
                    <div className="text-right text-on-surface-30 text-xs font-normal leading-4">0/300</div>
                  </div>
                </div>
              </section>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-8 py-4">
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

