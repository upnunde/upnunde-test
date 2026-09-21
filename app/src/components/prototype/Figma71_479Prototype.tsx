"use client";

import { useState } from "react";
import { Button } from "design-system/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { COIN_EVENT_EMOJI } from "@/components/prototype/coin-event-assets";
import { TossfaceIcon } from "@/components/prototype/TossfaceIcon";
import {
  PAGE_FLUSH_CONTENT_PAD_X_CLASS,
} from "@/lib/page-layout";
import { lineTabStripListClassName } from "@/lib/tab-styles";
import { cn } from "design-system/utils";

/**
 * Figma `71:479` — 코인 이벤트 홈 (Gold 배너 · 캐러셀 · line 탭 · 참여/미션 · 제휴 카드)
 * 이벤트 목록 카드 가이드: `79:1572` (헤더·행 h64 · 카드 상하 pad 8 · 좌우 12)
 * @see https://www.figma.com/design/wxrlczSyjZ0eAfQ2suYFPO/?node-id=71-479
 * @see https://www.figma.com/design/wxrlczSyjZ0eAfQ2suYFPO/?node-id=79-1572
 */

type EventRowData = {
  emoji: string;
  iconAlt: string;
  title: string;
  reward: string;
  action?: {
    label: string;
    completed?: boolean;
  };
};

type PromoCardData = {
  bgClass: string;
  label: string;
  headline: string;
  highlight: string;
  suffix: string;
  icon: string;
};

const PROMO_CARD_WIDTH_PX = 340;
const PROMO_CARD_GAP_PX = 8;
const PROMO_CAROUSEL_INSET_PX = 12;
const PROMO_CARD_STRIDE_PX = PROMO_CARD_WIDTH_PX + PROMO_CARD_GAP_PX;

const PROMO_CARDS: PromoCardData[] = [
  {
    bgClass: "bg-info/15",
    label: "코인 이벤트",
    headline: "오늘 딱 하루만",
    highlight: "3만 코인",
    suffix: " 획득 기회!",
    icon: COIN_EVENT_EMOJI.promo,
  },
  {
    bgClass: "bg-primary-container",
    label: "코인 이벤트",
    headline: "오늘 딱 하루만",
    highlight: "3만 코인",
    suffix: " 획득 기회!",
    icon: COIN_EVENT_EMOJI.promo,
  },
];

const PARTICIPATION_EVENTS: EventRowData[] = [
  {
    emoji: COIN_EVENT_EMOJI.affiliate,
    iconAlt: "제휴 이벤트",
    title: "제휴 이벤트",
    reward: "최대 1,000코인 획득",
  },
  {
    emoji: COIN_EVENT_EMOJI.review,
    iconAlt: "리뷰 작성",
    title: "리뷰 작성하면",
    reward: "200코인 지급",
  },
  {
    emoji: COIN_EVENT_EMOJI.youtube,
    iconAlt: "유튜브 시청",
    title: "유튜브 시청하면",
    reward: "100코인 지급",
    action: { label: "시청하기" },
  },
  {
    emoji: COIN_EVENT_EMOJI.instagram,
    iconAlt: "SNS 팔로우",
    title: "SNS 팔로우하면",
    reward: "300코인 지급",
  },
];

const MISSION_EVENTS: EventRowData[] = [
  {
    emoji: COIN_EVENT_EMOJI.attendance,
    iconAlt: "출석 체크",
    title: "출석 체크하고",
    reward: "100코인 받기",
  },
  {
    emoji: COIN_EVENT_EMOJI.referral,
    iconAlt: "친구 추천",
    title: "친구 추천하고",
    reward: "500코인 받기",
  },
  {
    emoji: COIN_EVENT_EMOJI.notification,
    iconAlt: "알림 설정",
    title: "알림 설정하면",
    reward: "50코인 지급",
    action: { label: "지급 완료", completed: true },
  },
  {
    emoji: COIN_EVENT_EMOJI.review,
    iconAlt: "리뷰 작성",
    title: "리뷰 작성하면",
    reward: "200코인 지급",
  },
  {
    emoji: COIN_EVENT_EMOJI.dice,
    iconAlt: "주사위 이벤트",
    title: "매일 1,000코인",
    reward: "주사위 이벤트 참석하기",
  },
];

const ROW_HOVER_CLASS =
  "cursor-pointer transition-colors duration-short ease-standard hover:bg-muted";

const ROW_BUTTON_CLASS =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/40";

const COLORED_BLOCK_HOVER_CLASS =
  "cursor-pointer transition-colors duration-short ease-standard hover:opacity-90 hover:shadow-elevation-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40";

function GoldMembershipCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl bg-background py-3 ring-1 ring-border/70",
        PAGE_FLUSH_CONTENT_PAD_X_CLASS,
        className,
      )}
    >
      <span
        className="tossface flex size-12 shrink-0 items-center justify-center text-[length:var(--icon-size-3xl)] leading-none select-none"
        aria-hidden
      >
        🥇
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-body1_700 text-foreground">Gold</p>
        <p className="text-body3_400 text-foreground-muted">리워드 1.2배 지급 우대</p>
        <p className="mt-0.5 flex items-center gap-1 text-body3_700 text-foreground">
          <span className="tossface text-[length:var(--icon-size-sm)] leading-none" aria-hidden>
            {COIN_EVENT_EMOJI.promo}
          </span>
          2,100
        </p>
      </div>
    </div>
  );
}

function PromoCarousel({
  activeIndex,
  onActiveIndexChange,
}: {
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          "w-full min-w-0 snap-x snap-mandatory overflow-x-auto overscroll-x-contain pb-1",
          "scroll-px-3 touch-pan-x",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
        onScroll={(event) => {
          const el = event.currentTarget;
          const index = Math.min(
            PROMO_CARDS.length - 1,
            Math.max(0, Math.round((el.scrollLeft - PROMO_CAROUSEL_INSET_PX) / PROMO_CARD_STRIDE_PX)),
          );
          if (index !== activeIndex) onActiveIndexChange(index);
        }}
      >
        <div className="flex w-max gap-2">
          <span className="w-3 shrink-0" aria-hidden />
          {PROMO_CARDS.map((card, index) => (
            <button
              key={index}
              type="button"
              className={cn(
                "flex h-40 w-[340px] shrink-0 snap-start snap-always items-center justify-between rounded-xl px-8 text-left",
                card.bgClass,
                COLORED_BLOCK_HOVER_CLASS,
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="text-body3_400 text-foreground-muted">{card.label}</p>
                <p className="mt-2 text-heading4_700 text-foreground">{card.headline}</p>
                <p className="text-heading4_700 text-foreground">
                  <span className="text-primary">{card.highlight}</span>
                  {card.suffix}
                </p>
              </div>
              <span
                className="tossface shrink-0 text-[length:var(--icon-size-3xl)] leading-none select-none"
                aria-hidden
              >
                {card.icon}
              </span>
            </button>
          ))}
          <span className="w-3 shrink-0" aria-hidden />
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "rounded-full",
              index === activeIndex ? "h-2 w-6 bg-foreground" : "size-2 bg-border-medium",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function EventSectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <header className="flex h-16 flex-col justify-center gap-1 px-3">
      <h2 className="text-body1_700 text-foreground">{title}</h2>
      <p className="text-body3_400 text-foreground-muted">{description}</p>
    </header>
  );
}

function EventRow({ emoji, iconAlt, title, reward, action }: EventRowData) {
  return (
    <div className={cn("group flex h-16 items-center gap-3 px-3", ROW_HOVER_CLASS)}>
      <button
        type="button"
        className={cn(
          "flex h-full min-w-0 flex-1 cursor-pointer items-center gap-3 text-left",
          ROW_BUTTON_CLASS,
        )}
      >
        <TossfaceIcon emoji={emoji} label={iconAlt} />
        <span className="min-w-0 flex-1">
          <span className="block text-body1_700 text-foreground">{title}</span>
          <span className="block text-body3_500 text-primary">{reward}</span>
        </span>
      </button>
      {action ? (
        <Button
          type="button"
          variant={action.completed ? "secondary" : "default"}
          tone={action.completed ? "neutral" : "neutral"}
          shape="circle"
          size="default"
          disabled={action.completed}
          className="relative shrink-0 px-3.5"
          onClick={(event) => event.stopPropagation()}
        >
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}

function EventCard({
  title,
  description,
  rows,
}: {
  title: string;
  description: string;
  rows: EventRowData[];
}) {
  return (
    <section className="overflow-hidden rounded-xl bg-background py-2">
      <EventSectionHeader title={title} description={description} />
      <ul className="flex flex-col">
        {rows.map((row) => (
          <li key={`${title}-${row.title}-${row.reward}`}>
            <EventRow {...row} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ChuseokPromoBanner() {
  return (
    <button
      type="button"
      className={cn(
        "flex min-h-[72px] w-full items-center justify-between gap-3 rounded-xl bg-warning/15 px-5 py-3 text-left",
        COLORED_BLOCK_HOVER_CLASS,
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-body1_700 text-foreground">추석맞이 복주머니 이벤트</p>
        <p className="text-body4_400 text-foreground-muted">최대 2,000코인 획득</p>
      </div>
      <span
        className="tossface shrink-0 text-[length:var(--icon-size-3xl)] leading-none select-none"
        aria-hidden
      >
        {COIN_EVENT_EMOJI.chuseok}
      </span>
    </button>
  );
}

function AffiliateClaimCard() {
  return (
    <section className="overflow-hidden rounded-xl bg-background p-3">
      <div className="flex h-40 items-center justify-between rounded-xl bg-info/15 px-5">
        <div className="min-w-0 flex-1">
          <p className="text-body3_400 text-foreground-muted">코인 이벤트</p>
          <p className="mt-2 text-heading4_700 text-foreground">오늘 딱 하루만</p>
          <p className="text-heading4_700 text-foreground">
            <span className="text-primary">3만 코인</span> 획득 기회!
          </p>
        </div>
        <span
          className="tossface shrink-0 text-[length:var(--icon-size-3xl)] leading-none select-none"
          aria-hidden
        >
          {COIN_EVENT_EMOJI.promo}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 pt-3">
        <div className="min-w-0">
          <p className="text-body1_700 text-foreground">제휴 이벤트</p>
          <p className="text-body3_400 text-foreground-muted">
            포인트 전환하면 <span className="text-body3_500 text-primary">1,000코인</span>
          </p>
        </div>
        <Button type="button" tone="brand" shape="circle" size="default" className="shrink-0 px-3.5">
          코인받기
        </Button>
      </div>
    </section>
  );
}

/** iPhone 프레임 안에 넣을 스크롤 시안 — 기본 면은 DS `bg-background` */
export function Figma71_479Prototype({ className }: { className?: string }) {
  const [promoIndex, setPromoIndex] = useState(0);

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden bg-background text-foreground",
        className,
      )}
    >
      {/* pt-11이 스크롤 안에 있어 콘텐츠가 투명 스테이터스바 아래로 지나감 */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <Tabs defaultValue="coin" className="flex w-full flex-col gap-0 pt-11">
          <GoldMembershipCard className="mt-2" />
          <div className="mt-3">
            <PromoCarousel activeIndex={promoIndex} onActiveIndexChange={setPromoIndex} />
          </div>
          <div className={cn("mt-3", PAGE_FLUSH_CONTENT_PAD_X_CLASS)}>
            <TabsList
              variant="line"
              size="default"
              aria-label="코인 이벤트"
              className={lineTabStripListClassName("l")}
            >
              <TabsTrigger value="coin">코인</TabsTrigger>
              <TabsTrigger value="pass">무료 이용권</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="coin"
            className="mt-0 flex flex-col gap-2 bg-background-muted p-3 pb-6 outline-none"
          >
            <EventCard
              title="참여 이벤트"
              description="한 번만 참여해도 받을 수 있어요"
              rows={PARTICIPATION_EVENTS}
            />
            <ChuseokPromoBanner />
            <EventCard
              title="미션 달성 이벤트"
              description="하루 한 번 코인 획득 기회!"
              rows={MISSION_EVENTS}
            />
            <AffiliateClaimCard />
            <AffiliateClaimCard />
          </TabsContent>

          <TabsContent value="pass" className="mt-0 bg-background-muted p-6 outline-none">
            <p className="text-center text-body3_400 text-foreground-placeholder">
              무료 이용권 영역 (시안 생략)
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
