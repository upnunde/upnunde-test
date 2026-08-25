"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ModalFooterButtons } from "@/components/ui/modal";
import { LineTabStrip } from "@/components/ui/line-tab-strip";
import { BankLogo } from "@/components/profile/BankLogo";
import {
  findFinancialInstitutionByName,
  listFinancialInstitutionsByCategory,
  type FinancialInstitutionCategory,
} from "@/lib/korean-financial-institutions";
import { cn } from "design-system/utils";

const BANK_SELECT_TABS = [
  { id: "bank", label: "은행" },
  { id: "securities", label: "증권" },
] as const;

const BANK_SELECT_DIALOG_CLASS =
  "flex w-full max-h-[min(92dvh,640px)] min-h-0 flex-col gap-0 overflow-hidden p-0 max-lg:max-w-none max-lg:rounded-t-xl max-lg:rounded-b-none lg:w-[420px] lg:max-w-[calc(100vw-2rem)] lg:rounded-sm";

export function BankSelectModal({
  open,
  onOpenChange,
  value,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onSelect: (bankName: string) => void;
}) {
  const matched = findFinancialInstitutionByName(value);
  const [activeCategory, setActiveCategory] = useState<FinancialInstitutionCategory>(
    matched?.category ?? "bank",
  );

  useEffect(() => {
    if (!open) return;
    setActiveCategory(matched?.category ?? "bank");
  }, [open, matched?.category]);

  const institutions = listFinancialInstitutionsByCategory(activeCategory);

  const handleSelect = (institution: (typeof institutions)[number]) => {
    onSelect(institution.name);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={BANK_SELECT_DIALOG_CLASS}>
        <div className="shrink-0 border-b border-divider px-6 py-4">
          <DialogTitle className="text-left text-heading5_700 text-foreground">
            은행·증권 선택
          </DialogTitle>
        </div>

        <LineTabStrip
          items={BANK_SELECT_TABS}
          activeId={activeCategory}
          onSelect={(id) => setActiveCategory(id as FinancialInstitutionCategory)}
          aria-label="금융기관 종류"
          className="shrink-0 border-b border-divider"
        />

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-4 gap-x-2 gap-y-5">
            {institutions.map((institution) => {
              const selected = value === institution.name;
              return (
                <button
                  key={institution.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => handleSelect(institution)}
                  className={cn(
                    "flex min-w-0 flex-col items-center gap-1.5 rounded-sm px-1 py-1 text-center transition-colors",
                    "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    selected && "bg-primary/10",
                  )}
                >
                  <BankLogo institution={institution} />
                  <span className="w-full truncate text-caption1_400 text-foreground">
                    {institution.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <ModalFooterButtons
          className="shrink-0 border-t border-divider"
          layout="end"
          trailingButtons={[{ label: "취소", closeOnSelect: true }]}
        />
      </DialogContent>
    </Dialog>
  );
}
