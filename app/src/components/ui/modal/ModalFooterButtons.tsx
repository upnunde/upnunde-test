"use client";

import type { ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";
import { DialogClose } from "@/components/ui/dialog";
import { Button, buttonVariants } from "design-system/ui/button";
import { cn } from "design-system/utils";
import {
  modalFooterActionButtonClassName,
  modalFooterButtonRowClassName,
  modalFooterShellClassName,
  modalFooterTrailingGroupClassName,
  MODAL_ACTION_BUTTON_SIZE,
} from "@/components/ui/modal/modal-styles";

/** end: 보조·주 버튼 우측 정렬 | split: 좌측 1버튼 + 우측 버튼 그룹 */
export type ModalFooterButtonLayout = "end" | "split";

export type ModalFooterButtonTone = "secondary" | "primary" | "destructive" | "ghost";

export interface ModalFooterButtonConfig {
  label: string;
  tone?: ModalFooterButtonTone;
  onClick?: () => void;
  disabled?: boolean;
  /** true면 DialogClose로 감싸 모달 닫기 (취소 등) */
  closeOnSelect?: boolean;
}

export interface ModalFooterButtonsProps {
  layout: ModalFooterButtonLayout;
  /** split 전용 — 좌측 단일 버튼 (보통 취소) */
  leadingButton?: ModalFooterButtonConfig;
  /** end: 전체 버튼 | split: 우측 그룹 (보통 보조 + 주) */
  trailingButtons: ModalFooterButtonConfig[];
  /** 버튼행 위에 붙는 푸터 보조 섹션(agree/confirm 등) */
  body?: ReactNode;
  className?: string;
}

function toneToButtonProps(tone: ModalFooterButtonTone): {
  variant: NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
  tone: NonNullable<VariantProps<typeof buttonVariants>["tone"]>;
} {
  switch (tone) {
    case "primary":
      return { variant: "default", tone: "brand" };
    case "destructive":
      return { variant: "default", tone: "destructive" };
    case "ghost":
      return { variant: "ghost", tone: "neutral" };
    default:
      return { variant: "outline", tone: "neutral" };
  }
}

function FooterActionButton({ config }: { config: ModalFooterButtonConfig }) {
  const footerTone = config.tone ?? "secondary";
  const { variant, tone } = toneToButtonProps(footerTone);
  const button = (
    <Button
      type="button"
      variant={variant}
      tone={tone}
      shape="square"
      size={MODAL_ACTION_BUTTON_SIZE}
      className={modalFooterActionButtonClassName}
      onClick={config.onClick}
      disabled={config.disabled}
    >
      {config.label}
    </Button>
  );

  if (config.closeOnSelect) {
    return (
      <DialogClose
        render={
          <Button
            type="button"
            variant={variant}
            tone={tone}
            shape="square"
            size={MODAL_ACTION_BUTTON_SIZE}
            className={modalFooterActionButtonClassName}
            disabled={config.disabled}
          />
        }
      >
        {config.label}
      </DialogClose>
    );
  }

  return button;
}

/** modal Footer 버튼 행 — layout에 따라 end / split 전환 */
export function ModalFooterButtons({
  layout,
  leadingButton,
  trailingButtons,
  body,
  className,
}: ModalFooterButtonsProps) {
  return (
    <div className={cn(modalFooterShellClassName, className)}>
      {body}
      <div
        className={cn(
          modalFooterButtonRowClassName,
          layout === "end" ? "lg:justify-end" : "lg:justify-between",
        )}
      >
        {layout === "split" && leadingButton ? <FooterActionButton config={leadingButton} /> : null}
        <div className={modalFooterTrailingGroupClassName}>
          {trailingButtons.map((config, index) => (
            <FooterActionButton key={`${config.label}-${index}`} config={config} />
          ))}
        </div>
      </div>
    </div>
  );
}
