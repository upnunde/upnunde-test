"use client";

import { useState } from "react";
import { ICONS } from "@/lib/icons";
import { BankLogo } from "@/components/profile/BankLogo";
import { BankSelectModal } from "@/components/profile/BankSelectModal";
import { findFinancialInstitutionByName } from "@/lib/korean-financial-institutions";
import { cn } from "design-system/utils";

export function BankSelectField({
  id,
  value,
  onChange,
  placeholder = "은행을 선택해 주세요",
  disabled = false,
  className,
  ariaLabel,
}: {
  id: string;
  value: string;
  onChange: (bankName: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** 라벨을 다른 필드와 공유할 때 — 계좌번호와 한 줄로 묶는 경우 */
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const institution = findFinancialInstitutionByName(value);
  const hasValue = Boolean(value.trim());

  return (
    <>
      <button
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setOpen(true);
        }}
        className={cn(
          "flex h-10 w-full items-center gap-2 rounded-lg border border-border-emphasis bg-transparent px-3 text-left text-body2_400 transition-colors duration-short ease-standard outline-none",
          disabled
            ? "cursor-default"
            : "hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          !hasValue && "text-foreground-placeholder",
          className,
        )}
      >
        {institution ? <BankLogo institution={institution} size="sm" /> : null}
        <span className={cn("min-w-0 flex-1 truncate", hasValue && "text-foreground")}>
          {hasValue ? value : placeholder}
        </span>
        {disabled ? null : (
          <ICONS.chevronDown className="size-4 shrink-0 text-foreground-muted" aria-hidden />
        )}
      </button>

      {disabled ? null : (
        <BankSelectModal
          open={open}
          onOpenChange={setOpen}
          value={value}
          onSelect={onChange}
        />
      )}
    </>
  );
}
