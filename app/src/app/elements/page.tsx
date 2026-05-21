"use client";

import React, { useState } from "react";
import Header from "@/components/Header/Header";
import AppSidebar from "@/components/AppSidebar/AppSidebar";
import { Button } from "@/components/ui/button";
import { FilterChip } from "@/components/ui/chip";
import { Input } from "@/components/ui/input";
import {
  CHIP_COMPANION_CONTROL_CLASS,
  CONTROL_GROUP_GAP_COMPACT_CLASS,
  CONTROL_GROUP_GAP_STANDARD_CLASS,
  CONTROL_HEIGHT_CLASS,
  CONTROL_HEIGHT_FORM_CLASS,
  CONTROL_HEIGHT_STANDARD_CLASS,
  chipGroupGapClass,
} from "@/lib/chip-styles";
import { SegmentedTextTabs } from "@/components/ui/segmented-text-tabs";
import { PAGE_SCROLL_COLUMN_CLASS } from "@/lib/page-layout";
import { cn } from "@/lib/utils";

const AREA_TABS = [
  { id: "content", label: "콘텐츠" },
  { id: "user", label: "이용자" },
  { id: "revenue", label: "수익" },
] as const;

const SCOPE_LABELS = ["시리즈", "캐릭터", "상황", "공략"] as const;
const GENRE_LABELS = ["전체", "일상", "로맨스", "미스터리"] as const;

function SpecRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="flex w-full max-w-[1200px] flex-col gap-3 rounded-[4px] border border-border-10 bg-white p-5">
      <h2 className="text-base font-bold text-on-surface-10">{label}</h2>
      {children}
    </section>
  );
}

export default function ElementsPage() {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [areaTab, setAreaTab] = useState<(typeof AREA_TABS)[number]["id"]>("content");
  const [scope, setScope] = useState<(typeof SCOPE_LABELS)[number]>("시리즈");
  const [genre, setGenre] = useState<(typeof GENRE_LABELS)[number]>("전체");

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-white">
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl} />
      <div className="flex flex-1 overflow-hidden bg-surface-20">
        <AppSidebar defaultActiveId="guide" />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <main className="flex flex-1 flex-col overflow-hidden bg-surface-20">
            <div className="flex h-16 shrink-0 items-center justify-center border-b border-border-10 bg-white px-5">
              <div className="flex w-full max-w-[1200px] items-center justify-start">
                <h1 className="text-2xl font-bold text-on-surface-10">UI 요소</h1>
              </div>
            </div>

            <div className={cn(PAGE_SCROLL_COLUMN_CLASS, "gap-5")}>
              <SpecRow label="Tab XL — 분석 영역 (underline false · 탭 간격 20px)">
                <SegmentedTextTabs
                  aria-label="분석 영역 미리보기"
                  items={[...AREA_TABS]}
                  activeId={areaTab}
                  onSelect={(id) => setAreaTab(id as (typeof AREA_TABS)[number]["id"])}
                  size="xl"
                  underline={false}
                />
              </SpecRow>

              <SpecRow label="Tab L — underline true (탭 간격 16px)">
                <SegmentedTextTabs
                  aria-label="밑줄 탭 L"
                  items={[
                    { id: "a", label: "activated" },
                    { id: "b", label: "inactived" },
                    { id: "c", label: "inactived" },
                  ]}
                  activeId="a"
                  size="l"
                  underline
                />
              </SpecRow>

              <SpecRow label="Tab M — underline false (탭 간격 12px)">
                <SegmentedTextTabs
                  aria-label="텍스트 탭 M"
                  items={[
                    { id: "a", label: "activated" },
                    { id: "b", label: "inactived" },
                  ]}
                  activeId="a"
                  size="m"
                />
              </SpecRow>

              <SpecRow label="FilterChip L — h-36 · gap 8px · radius 8px (분석 범위 칩 · Tab 아님)">
                <div
                  className={cn("inline-flex items-center", CONTROL_GROUP_GAP_STANDARD_CLASS)}
                  role="group"
                  aria-label="콘텐츠 범위 미리보기"
                >
                  {SCOPE_LABELS.map((label) => (
                    <FilterChip
                      key={label}
                      chipSize="l"
                      selected={scope === label}
                      className="min-w-20"
                      onClick={() => setScope(label)}
                    >
                      {label}
                    </FilterChip>
                  ))}
                </div>
              </SpecRow>

              <SpecRow label="FilterChip M — h-32 · gap 4px · radius 8px">
                <div
                  className={cn("inline-flex flex-wrap items-center", chipGroupGapClass("m"))}
                  role="group"
                  aria-label="장르 미리보기"
                >
                  {GENRE_LABELS.map((label) => (
                    <FilterChip
                      key={label}
                      chipSize="m"
                      selected={genre === label}
                      onClick={() => setGenre(label)}
                    >
                      {label}
                    </FilterChip>
                  ))}
                </div>
              </SpecRow>

              <SpecRow label="M 칩 + companion (정산 필터 행)">
                <div className={cn("inline-flex flex-wrap items-center", CONTROL_GROUP_GAP_COMPACT_CLASS)}>
                  <div
                    className={cn("inline-flex items-center", CONTROL_GROUP_GAP_COMPACT_CLASS)}
                    role="group"
                  >
                    {["전체 기간", "6개월", "3개월"].map((label, i) => (
                      <FilterChip key={label} chipSize="m" selected={i === 0}>
                        {label}
                      </FilterChip>
                    ))}
                  </div>
                  <Button type="button" variant="outline" size="sm" className={CHIP_COMPANION_CONTROL_CLASS}>
                    2024.01.01 – 2024.12.31
                  </Button>
                </div>
              </SpecRow>

              <SpecRow label="버튼 높이 티어">
                <div className={cn("inline-flex flex-wrap items-center", CONTROL_GROUP_GAP_STANDARD_CLASS)}>
                  <Button size="default">default (32px)</Button>
                  <Button size="sm">sm (32px)</Button>
                  <Button size="lg">lg (36px)</Button>
                  <Button className={CONTROL_HEIGHT_FORM_CLASS}>form (42px)</Button>
                </div>
              </SpecRow>

              <SpecRow label="Input · form 42px">
                <div className="max-w-md">
                  <Input placeholder="시리즈 제목" aria-label="시리즈 제목" />
                </div>
              </SpecRow>

              <SpecRow label="높이 클래스 참고">
                <ul className="list-inside list-disc text-sm text-on-surface-20">
                  <li>
                    <code className="text-on-surface-10">CONTROL_HEIGHT_CLASS</code> — {CONTROL_HEIGHT_CLASS}
                  </li>
                  <li>
                    <code className="text-on-surface-10">CONTROL_HEIGHT_STANDARD_CLASS</code> —{" "}
                    {CONTROL_HEIGHT_STANDARD_CLASS}
                  </li>
                  <li>
                    <code className="text-on-surface-10">CONTROL_HEIGHT_FORM_CLASS</code> —{" "}
                    {CONTROL_HEIGHT_FORM_CLASS}
                  </li>
                  <li>
                    <code className="text-on-surface-10">CONTROL_GROUP_GAP_COMPACT_CLASS</code> — 4px
                  </li>
                  <li>
                    <code className="text-on-surface-10">CONTROL_GROUP_GAP_STANDARD_CLASS</code> — 8px
                  </li>
                </ul>
              </SpecRow>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
