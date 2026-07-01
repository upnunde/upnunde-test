import { PAGE_FLUSH_CONTENT_PAD_X_CLASS } from "@/lib/page-layout";
import { getInquiryFaqCategoryLabel } from "@/lib/inquiry-faq";
import type { InquiryFaqItem as InquiryFaqItemType } from "@/lib/inquiry-faq";
import { cn } from "design-system/utils";
import { ICONS } from "@/lib/icons";

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
        "transition-colors hover:bg-muted",
        isOpen && "bg-muted",
      )}
    >
      <button
        type="button"
        onClick={() => onToggle?.()}
        className="inline-flex w-full min-h-[72px] cursor-pointer items-center gap-3 self-stretch rounded-lg py-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset lg:gap-5 lg:py-3"
        aria-expanded={isOpen}
        aria-controls={`inquiry-faq-content-${id}`}
        id={`inquiry-faq-trigger-${id}`}
      >
        <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-1">
          <span className="text-body4_500 text-foreground-placeholder lg:text-caption1_500">
            {getInquiryFaqCategoryLabel(category)}
          </span>
          <span className="w-full min-w-0 text-left text-body1_700 text-foreground lg:text-body2_500">
            {question}
          </span>
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-[999px] bg-transparent px-3 text-foreground-placeholder">
          <ICONS.chevronDown
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
          className="flex flex-col gap-3 pb-4 pt-0 lg:pb-5"
        >
          <p className="whitespace-pre-wrap text-body3_400 text-foreground-muted">{answer}</p>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggle?.();
              }}
              className="h-8 cursor-pointer rounded-md border border-border bg-background px-3 text-body3_500 text-foreground-muted transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              접기
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
