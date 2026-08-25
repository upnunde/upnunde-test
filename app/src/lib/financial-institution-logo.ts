import type { FinancialInstitution } from "@/lib/korean-financial-institutions";

/** `public/bank-logos/` — korea_bank_icons(MIT) SVG + 개별 보완 */
export const FINANCIAL_INSTITUTION_LOGO_PREFIX = "/bank-logos";

export function financialInstitutionLogoSrc(institution: FinancialInstitution): string {
  return `${FINANCIAL_INSTITUTION_LOGO_PREFIX}/${institution.id}.${institution.logoExt ?? "svg"}`;
}
