"use client";

import { Badge } from "design-system/ui/badge";
import { cn } from "design-system/utils";
import { PAGE_GUTTER_X_CLASS } from "@/lib/page-layout";
import { PrototypeImage } from "@/components/prototype/PrototypeImage";
import { WORK_DETAIL_IMAGES } from "@/components/prototype/work-detail-assets";

/**
 * Figma `2:32` 작품 상세 프로토타입.
 * 수치는 Figma raw px가 아니라 DS 토큰/컴포넌트로 매핑한다.
 * 매핑표: `docs/figma-to-ds-mapping.md`
 */

const TAGS = ["스릴러", "인기 TOP10", "완결"] as const;

export function WorkDetailPrototype() {
  return (
    <article
      className={cn(
        "mx-auto w-full max-w-[420px] overflow-hidden bg-background text-foreground",
        "shadow-elevation-10 ring-1 ring-border lg:rounded-lg",
      )}
    >
      {/* Hero — Figma 420×360 */}
      <section className="relative aspect-[420/360] w-full overflow-hidden bg-muted">
        <PrototypeImage
          src={WORK_DETAIL_IMAGES.heroBackground}
          alt=""
          sizes="420px"
          priority
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-dim-20" aria-hidden />
        <div className="absolute inset-0 flex items-center justify-center p-5">
          <PrototypeImage
            src={WORK_DETAIL_IMAGES.cover}
            alt="건방진 스파이 후배 구하기 표지"
            sizes="202px"
            priority
            className="aspect-[202/269] w-[48%] max-w-[202px] rounded-md shadow-elevation-20"
          />
        </div>
      </section>

      {/* Title block */}
      <section className={cn(PAGE_GUTTER_X_CLASS, "flex flex-col gap-2 py-5")}>
        <h1 className="text-heading2_700 text-foreground">
          건방진 스파이 후배 구하기
        </h1>

        <div className="flex flex-wrap gap-1">
          {TAGS.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              status="default"
              size="md"
              shape="square"
              className="text-muted-foreground"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <p className="text-body1_500 text-muted-foreground">작가이름</p>
      </section>

      {/* Stats */}
      <section
        className={cn(
          PAGE_GUTTER_X_CLASS,
          "flex items-center gap-5 py-2",
        )}
      >
        <Stat label="게시물" value="3,320" />
        <Stat label="팔로워" value="1.5만" />
      </section>

      {/* Story */}
      <section className={cn(PAGE_GUTTER_X_CLASS, "flex flex-col gap-4 pt-5")}>
        <h2 className="text-heading5_600 text-foreground">작품 스토리</h2>
        <div className="rounded-md border border-border bg-muted p-4">
          <div className="flex flex-col gap-2">
            <p className="text-body3_600 text-foreground">
              천재 능력을 가진 스파이
            </p>
            <p className="text-body3_400 text-muted-foreground">
              세계적인 운동화 브랜드 &apos;플렉스핏&apos;은 예술의 경계를
              확장하고자 유명 아티스트 리아와 협업합니다. 리아는 자신의
              대표작인 &apos;도시의 꿈&apos; 시리즈를 운동화 디자인에 담아내기로
              합니다. 각 운동화는 도시의 일상과 환상을 결합한 독특한 패턴과
              색상으로 채워지고, 한정판으로 출시됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* Episodes */}
      <section
        className={cn(PAGE_GUTTER_X_CLASS, "flex flex-col gap-4 py-5 pb-10")}
      >
        <h2 className="text-heading5_600 text-foreground">에피소드</h2>
        <ul className="flex gap-1 overflow-x-auto pb-1">
          {WORK_DETAIL_IMAGES.episodes.map((src, index) => (
            <li key={src} className="shrink-0">
              <PrototypeImage
                src={src}
                alt={`에피소드 ${index + 1} 썸네일`}
                sizes="64px"
                className="size-16 rounded-sm"
              />
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-body3_400 text-muted-foreground">{label}</span>
      <span className="text-body3_700 text-foreground">{value}</span>
    </div>
  );
}
