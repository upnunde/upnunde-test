"use client";

import { useState } from "react";
import { Button } from "design-system/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { COIN_EVENT_EMOJI } from "@/components/prototype/coin-event-assets";
import { TossfaceIcon } from "@/components/prototype/TossfaceIcon";
import { cn } from "design-system/utils";

/**
 * Figma `20:582` — 코인·이벤트 목록 (393×1152 모바일)
 * @see https://www.figma.com/design/wxrlczSyjZ0eAfQ2suYFPO/?node-id=20-582
 * @see docs/figma-to-ds-mapping.md
 */

type EventCategory = "all" | "coin" | "pass";

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

const CATEGORY_TABS: { id: EventCategory; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "coin", label: "코인" },
  { id: "pass", label: "이용권" },
];

const PROMO_CARD_WIDTH_PX = 340;
const PROMO_CARD_GAP_PX = 8;
const PROMO_CAROUSEL_INSET_PX = 12;
const PROMO_CARD_STRIDE_PX = PROMO_CARD_WIDTH_PX + PROMO_CARD_GAP_PX;

const PROMO_CARDS: PromoCardData[] = [
  {
    bgClass: "bg-[#cdebee]",
    label: "코인 이벤트",
    headline: "오늘 딱 하루만",
    highlight: "3만 코인",
    suffix: " 획득 기회!",
    icon: COIN_EVENT_EMOJI.promo,
  },
  {
    bgClass: "bg-[#cdd9ee]",
    label: "코인 이벤트",
    headline: "오늘 딱 하루만",
    highlight: "3만 코인",
    suffix: " 획득 기회!",
    icon: COIN_EVENT_EMOJI.promo,
  },
];

const PARTICIPATION_EVENTS: EventRowData[] = [
  { emoji: COIN_EVENT_EMOJI.affiliate, iconAlt: "제휴 이벤트", title: "제휴 이벤트", reward: "최대 1,000코인 획득" },
  { emoji: COIN_EVENT_EMOJI.review, iconAlt: "리뷰 작성", title: "리뷰 작성하면", reward: "200코인 지급" },
  {
    emoji: COIN_EVENT_EMOJI.youtube,
    iconAlt: "유튜브 시청",
    title: "유튜브 시청하면",
    reward: "100코인 지급",
    action: { label: "시청하기" },
  },
  { emoji: COIN_EVENT_EMOJI.instagram, iconAlt: "SNS 팔로우", title: "SNS 팔로우하면", reward: "300코인 지급" },
];

const MISSION_EVENTS: EventRowData[] = [
  { emoji: COIN_EVENT_EMOJI.attendance, iconAlt: "출석 체크", title: "출석 체크하고", reward: "100코인 받기" },
  { emoji: COIN_EVENT_EMOJI.referral, iconAlt: "친구 추천", title: "친구 추천하고", reward: "500코인 받기" },
  {
    emoji: COIN_EVENT_EMOJI.notification,
    iconAlt: "알림 설정",
    title: "알림 설정하면",
    reward: "50코인 지급",
    action: { label: "지급완료", completed: true },
  },
  { emoji: COIN_EVENT_EMOJI.review, iconAlt: "리뷰 작성", title: "리뷰 작성하면", reward: "200코인 지급" },
  { emoji: COIN_EVENT_EMOJI.dice, iconAlt: "주사위 이벤트", title: "매일 1,000코인", reward: "주사위 이벤트 참석하기" },
];

const ROW_HOVER_CLASS =
  "cursor-pointer transition-colors duration-short ease-standard hover:bg-black/[0.04]";

const FIGMA_TEXT = {
  title: "text-black/90",
  muted: "text-black/50",
  rowTitle: "text-black/70 group-hover:text-black/90",
  rowReward: "text-[#f642d4]",
  promoLabel: "text-black/50",
  promoHeadline: "text-black/80",
} as const;

const FIGMA_ACTION_BUTTON_CLASS =
  "bg-[#444444] text-white hover:bg-[#444444]/90 data-[hovered=true]:bg-[#444444]/90";

const FIGMA_ACTION_BUTTON_COMPLETED_CLASS =
  "bg-[#444444]/10 text-black/30 hover:bg-[#444444]/10 data-[hovered=true]:bg-[#444444]/10";

const ROW_BUTTON_CLASS =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40";

const COLORED_BLOCK_HOVER_CLASS =
  "cursor-pointer transition-all duration-short ease-standard hover:brightness-[0.97] hover:shadow-elevation-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-[0.995]";

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
          "scroll-px-[12px] touch-pan-x [-webkit-overflow-scrolling:touch]",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
        onScroll={(event) => {
          const el = event.currentTarget;
          const index = Math.min(
            PROMO_CARDS.length - 1,
            Math.max(0, Math.round((el.scrollLeft - PROMO_CAROUSEL_INSET_PX) / PROMO_CARD_STRIDE_PX)),
          );
          if (index !== activeIndex) {
            onActiveIndexChange(index);
          }
        }}
      >
        <div className="flex w-max gap-2">
          <span className="w-[12px] shrink-0" aria-hidden />
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
                <p className={cn("text-body3_400", FIGMA_TEXT.promoLabel)}>{card.label}</p>
                <p className={cn("mt-2 text-heading4_700", FIGMA_TEXT.promoHeadline)}>{card.headline}</p>
                <p className={cn("text-heading4_700", FIGMA_TEXT.promoHeadline)}>
                  <span className={FIGMA_TEXT.rowReward}>{card.highlight}</span>
                  {card.suffix}
                </p>
              </div>
              <span className="tossface shrink-0 text-[28px] leading-none select-none" aria-hidden>
                {card.icon}
              </span>
            </button>
          ))}
          <span className="w-[12px] shrink-0" aria-hidden />
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "rounded-full",
              index === activeIndex
                ? "h-2 w-6 bg-[#2b2b2b]"
                : "size-2 bg-black/12",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function EventCategoryTabs({
  value,
  onValueChange,
}: {
  value: EventCategory;
  onValueChange: (value: EventCategory) => void;
}) {
  return (
    <Tabs
      value={value}
      onValueChange={(next) => onValueChange(next as EventCategory)}
      className="w-full"
    >
      <TabsList
        variant="line"
        size="default"
        aria-label="이벤트 카테고리"
        className="h-10 w-full justify-start gap-4 border-b border-black/[0.07] bg-background px-4"
      >
        {CATEGORY_TABS.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

function EventSectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="flex min-h-16 flex-col justify-center gap-0.5 px-4 pt-2">
      <h2 className={cn("text-body1_700", FIGMA_TEXT.title)}>{title}</h2>
      <p className={cn("text-body3_400", FIGMA_TEXT.muted)}>{description}</p>
    </header>
  );
}

function EventRow({ emoji, iconAlt, title, reward, action }: EventRowData) {
  return (
    <div className={cn("group flex min-h-16 items-center gap-3 px-4", ROW_HOVER_CLASS)}>
      <button
        type="button"
        className={cn("flex min-w-0 flex-1 cursor-pointer items-center gap-3 py-3 text-left", ROW_BUTTON_CLASS)}
      >
        <TossfaceIcon emoji={emoji} label={iconAlt} />
        <span className="min-w-0 flex-1">
          <span className={cn("block text-body1_700", FIGMA_TEXT.rowTitle)}>
            {title}
          </span>
          <span className={cn("block text-body3_500", FIGMA_TEXT.rowReward)}>{reward}</span>
        </span>
      </button>
      {action ? (
        <Button
          type="button"
          variant="default"
          tone="neutral"
          shape="circle"
          size="default"
          disabled={action.completed}
          className={cn(
            "relative z-[1] shrink-0 px-3.5",
            action.completed ? FIGMA_ACTION_BUTTON_COMPLETED_CLASS : FIGMA_ACTION_BUTTON_CLASS,
          )}
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
    <section className="overflow-hidden rounded-xl bg-background">
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
        "flex min-h-[4.5rem] w-full items-center justify-between gap-3 rounded-xl px-5 py-3 text-left",
        "bg-[#eedbcd]",
        COLORED_BLOCK_HOVER_CLASS,
      )}
    >
      <div className="min-w-0 flex-1">
        <p className={cn("text-body1_700", FIGMA_TEXT.promoHeadline)}>추석맞이 복주머니 이벤트</p>
        <p className={cn("text-body4_400", FIGMA_TEXT.muted)}>최대 2,000코인 획득</p>
      </div>
      <span className="tossface shrink-0 text-[28px] leading-none select-none" aria-hidden>
        {COIN_EVENT_EMOJI.chuseok}
      </span>
    </button>
  );
}

export function Figma20_252Prototype() {
  const [category, setCategory] = useState<EventCategory>("all");
  const [promoIndex, setPromoIndex] = useState(0);

  return (
    <article className="mx-auto flex w-full max-w-[393px] flex-col bg-[#f5f5f5] text-[#2b2b2b] lg:rounded-xl lg:shadow-elevation-10 lg:ring-1 lg:ring-black/[0.07]">
      <section className="min-w-0 bg-background pt-3">
        <PromoCarousel activeIndex={promoIndex} onActiveIndexChange={setPromoIndex} />
      </section>

      <EventCategoryTabs value={category} onValueChange={setCategory} />

      <div className="flex flex-col gap-3 p-3">
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
      </div>
    </article>
  );
}
