"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "design-system/ui/button";
import { Chip, FilterChip } from "@/components/ui/chip";
import type { ChipVariantProps } from "@/lib/chip-styles";
import { Input, InputGroup, InputHypertext } from "@/components/ui/input";
import {
  CHIP_COMPANION_CONTROL_CLASS,
  CONTROL_GROUP_GAP_COMPACT_CLASS,
  CONTROL_GROUP_GAP_STANDARD_CLASS,
  CONTROL_HEIGHT_CLASS,
  CONTROL_HEIGHT_FORM_CLASS,
  CONTROL_HEIGHT_STANDARD_CLASS,
  chipGroupGapClass,
} from "@/lib/chip-styles";
import { Tabs, TabsList, TabsTrigger } from "design-system/ui/tabs";
import { lineTabStripListClassName } from "@/lib/tab-styles";
import {
  PAGE_CONTAINER_CLASS,
  PAGE_SCROLL_COLUMN_CLASS,
  PAGE_SUBHEADER_WITH_STICKY_CLASS,
} from "@/lib/page-layout";
import { cn } from "design-system/utils";

const AREA_TABS = [
  { id: "content", label: "콘텐츠" },
  { id: "user", label: "이용자" },
  { id: "revenue", label: "수익" },
] as const;

const SCOPE_LABELS = ["시리즈", "캐릭터", "상황", "공략"] as const;
const GENRE_LABELS = ["전체", "일상", "로맨스", "미스터리"] as const;

function SpecRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="flex w-full max-w-[1200px] flex-col gap-3 rounded-sm border border-border bg-background p-5">
      <h2 className="text-body1_700 text-foreground">{label}</h2>
      {children}
    </section>
  );
}

const CHIP_MATRIX_ROWS: {
  label: string;
  chipType: NonNullable<ChipVariantProps["chipType"]>;
  variant: NonNullable<ChipVariantProps["variant"]>;
  size: NonNullable<ChipVariantProps["size"]>;
}[] = [
  { label: "fill · activated · L", chipType: "fill", variant: "activated", size: "l" },
  { label: "fill · default · L", chipType: "fill", variant: "default", size: "l" },
  { label: "fill · activated · M", chipType: "fill", variant: "activated", size: "m" },
  { label: "fill · default · M", chipType: "fill", variant: "default", size: "m" },
  { label: "outline · activated · L", chipType: "outline", variant: "activated", size: "l" },
  { label: "outline · default · L", chipType: "outline", variant: "default", size: "l" },
  { label: "outline · activated · M", chipType: "outline", variant: "activated", size: "m" },
  { label: "outline · default · M", chipType: "outline", variant: "default", size: "m" },
];

const CHIP_MATRIX_COLUMNS: {
  label: string;
  corner: NonNullable<ChipVariantProps["corner"]>;
  icon: boolean;
}[] = [
  { label: "circle + icon", corner: "circle", icon: true },
  { label: "circle", corner: "circle", icon: false },
  { label: "square + icon", corner: "square", icon: true },
  { label: "square", corner: "square", icon: false },
];

function ChipIconPlaceholder({ size }: { size: NonNullable<ChipVariantProps["size"]> }) {
  return (
    <span
      className={cn(
        "bg-current",
        size === "l" ? "size-4" : "size-3",
      )}
    />
  );
}

export default function ElementsPage() {
  const [areaTab, setAreaTab] = useState<(typeof AREA_TABS)[number]["id"]>("content");
  const [scope, setScope] = useState<(typeof SCOPE_LABELS)[number]>("시리즈");
  const [genre, setGenre] = useState<(typeof GENRE_LABELS)[number]>("전체");

  return (
    <AppShell sidebarActiveId="guide">
      <div className={PAGE_SUBHEADER_WITH_STICKY_CLASS}>
          <div className={`${PAGE_CONTAINER_CLASS} flex items-center justify-start`}>
            <h1 className="text-heading2_700 text-foreground">UI 요소</h1>
          </div>
        </div>

        <div className={PAGE_SCROLL_COLUMN_CLASS}>
              <SpecRow label="Tab 2xl — 분석 영역 (variant text)">
                <Tabs value={areaTab} onValueChange={(v) => setAreaTab(v as (typeof AREA_TABS)[number]["id"])}>
                  <TabsList variant="line" size="2xl" aria-label="분석 영역 미리보기">
                    {AREA_TABS.map((tab) => (
                      <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </SpecRow>

              <SpecRow label="Tab L — line (탭 간격 16px)">
                <Tabs value="a" className="w-full">
                  <TabsList variant="line" size="default" aria-label="밑줄 탭 L" className={lineTabStripListClassName("l")}>
                    <TabsTrigger value="a">activated</TabsTrigger>
                    <TabsTrigger value="b">inactived</TabsTrigger>
                    <TabsTrigger value="c">inactived</TabsTrigger>
                  </TabsList>
                </Tabs>
              </SpecRow>

              <SpecRow label="Tab M — underline false (탭 간격 12px)">
                <Tabs value="a">
                  <TabsList variant="line" size="sm" aria-label="텍스트 탭 M">
                    <TabsTrigger value="a">activated</TabsTrigger>
                    <TabsTrigger value="b">inactived</TabsTrigger>
                  </TabsList>
                </Tabs>
              </SpecRow>

              <SpecRow label="Chip 매트릭스 — Figma chips (type × variant × corner × size × icon)">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-3 pr-4 text-body3_500 text-foreground-placeholder">상태</th>
                        {CHIP_MATRIX_COLUMNS.map((col) => (
                          <th
                            key={col.label}
                            className="pb-3 pr-4 text-body3_500 text-foreground-placeholder"
                          >
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {CHIP_MATRIX_ROWS.map((row) => (
                        <tr key={row.label} className="border-b border-border last:border-0">
                          <td className="py-3 pr-4 align-middle text-body3_400 text-foreground-muted">
                            {row.label}
                          </td>
                          {CHIP_MATRIX_COLUMNS.map((col) => (
                            <td key={col.label} className="py-3 pr-4 align-middle">
                              <Chip
                                chipType={row.chipType}
                                variant={row.variant}
                                corner={col.corner}
                                size={row.size}
                                icon={col.icon}
                                trailingIcon={
                                  col.icon ? (
                                    <ChipIconPlaceholder size={row.size} />
                                  ) : undefined
                                }
                                type="button"
                              >
                                Option
                              </Chip>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
                  <Button size="sm">sm (32px)</Button>
                  <Button size="default">default (36px)</Button>
                  <Button size="xl">xl (40px)</Button>
                  <Button size="2xl">2xl (48px)</Button>
                  <Button className={CONTROL_HEIGHT_FORM_CLASS}>form (42px)</Button>
                </div>
              </SpecRow>

              <SpecRow label="Input · xl (40px)">
                <div className="max-w-md">
                  <InputGroup>
                    <Input size="xl" placeholder="시리즈 제목" aria-label="시리즈 제목" />
                    <InputHypertext count={0} max={30} />
                  </InputGroup>
                </div>
              </SpecRow>

              <SpecRow label="높이 클래스 참고">
                <ul className="list-inside list-disc text-body3_400 text-foreground-muted">
                  <li>
                    <code className="text-foreground">CONTROL_HEIGHT_CLASS</code> — {CONTROL_HEIGHT_CLASS}
                  </li>
                  <li>
                    <code className="text-foreground">CONTROL_HEIGHT_STANDARD_CLASS</code> —{" "}
                    {CONTROL_HEIGHT_STANDARD_CLASS}
                  </li>
                  <li>
                    <code className="text-foreground">CONTROL_HEIGHT_FORM_CLASS</code> —{" "}
                    {CONTROL_HEIGHT_FORM_CLASS}
                  </li>
                  <li>
                    <code className="text-foreground">CONTROL_GROUP_GAP_COMPACT_CLASS</code> — 4px
                  </li>
                  <li>
                    <code className="text-foreground">CONTROL_GROUP_GAP_STANDARD_CLASS</code> — 8px
                  </li>
                </ul>
              </SpecRow>
        </div>
    </AppShell>
  );
}
