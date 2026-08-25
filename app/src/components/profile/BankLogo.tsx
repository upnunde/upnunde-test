"use client";

import type { FinancialInstitution } from "@/lib/korean-financial-institutions";
import { cn } from "design-system/utils";
import Image from "next/image";
import { useState } from "react";
import { financialInstitutionLogoSrc } from "@/lib/financial-institution-logo";

const BANK_LOGO_SIZE_CLASS = {
  sm: "size-6",
  md: "size-12",
} as const;

const BANK_LOGO_PX = {
  sm: 24,
  md: 48,
} as const;

function BankLogoFallback({
  institution,
  size,
  className,
}: {
  institution: FinancialInstitution;
  size: keyof typeof BANK_LOGO_SIZE_CLASS;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full text-caption1_700",
        BANK_LOGO_SIZE_CLASS[size],
        size === "sm" && "text-[0.5rem]",
        className,
      )}
      style={{
        backgroundColor: institution.brandColor,
        color: institution.logoTextColor ?? "#FFFFFF",
      }}
    >
      {institution.logoLabel ?? institution.name.slice(0, 2)}
    </span>
  );
}

export function BankLogo({
  institution,
  size = "md",
  className,
}: {
  institution: FinancialInstitution;
  size?: keyof typeof BANK_LOGO_SIZE_CLASS;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const px = BANK_LOGO_PX[size];

  if (failed) {
    return <BankLogoFallback institution={institution} size={size} className={className} />;
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        BANK_LOGO_SIZE_CLASS[size],
        className,
      )}
    >
      <Image
        src={financialInstitutionLogoSrc(institution)}
        alt=""
        width={px}
        height={px}
        unoptimized
        className="h-full w-full object-cover"
        onError={() => setFailed(true)}
      />
    </span>
  );
}
