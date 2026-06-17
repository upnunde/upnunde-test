import { PAGE_FLUSH_CONTENT_PAD_X_CLASS } from "@/lib/page-layout";
import { getInquiryFaqCategoryLabel } from "@/lib/inquiry-faq";
import type { InquiryFaqItem as InquiryFaqItemType } from "@/lib/inquiry-faq";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface InquiryFaqItemProps {
  item: InquiryFaqItemType;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function InquiryFaqItem({ item, isOpen = false, onToggle }: InquiryFaqItemProps) {
  const { id, category, question, answer } = item;

  return (
    <div
      className={cn(
        PAGE_FLUSH_CONTENT_PAD_X_CLASS,
        "transition-colors hover:bg-surface-20",
        isOpen && "bg-surface-20",
      )}
    >
      <button
        type="button"
        onClick={() => onToggle?.()}
        className="inline-flex w-full min-h-[72px] cursor-pointer items-center gap-my-12 self-stretch rounded-lg py-my-20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset lg:gap-my-20 lg:py-my-12"
        aria-expanded={isOpen}
        aria-controls={`inquiry-faq-content-${id}`}
        id={`inquiry-faq-trigger-${id}`}
      >
        <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-my-4">
          <span className="text-body4_500 text-on-surface-30 lg:text-caption1_500">
            {getInquiryFaqCategoryLabel(category)}
          </span>
          <span className="w-full min-w-0 text-left text-body1_700 text-on-surface-10 lg:text-body2_700">
            {question}
          </span>
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-[999px] bg-transparent px-my-12 text-on-surface-30">
          <ChevronDown
            className={cn("h-4 w-4 shrink-0 transition-transform", isOpen && "rotate-180")}
            aria-hidden
          />
        </div>
      </button>

      {isOpen ? (
        <div
          id={`inquiry-faq-content-${id}`}
          role="region"
          aria-labelledby={`inquiry-faq-trigger-${id}`}
          className="flex flex-col gap-my-12 pb-my-16 pt-0 lg:pb-my-20"
        >
          <p className="whitespace-pre-wrap text-body3_400 text-on-surface-20">{answer}</p>
          <div className="flex items-center justify-end gap-my-8">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggle?.();
              }}
              className="h-8 cursor-pointer rounded-md border border-border-20 bg-white px-my-12 text-body3_500 text-on-surface-20 transition-colors hover:bg-surface-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              접기
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
