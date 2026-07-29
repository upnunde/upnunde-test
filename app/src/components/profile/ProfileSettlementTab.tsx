"use client";

import { PAGE_GUTTER_GAP_CLASS } from "@/lib/page-layout";

import { useState } from "react";
import Link from "next/link";
import { Button } from "design-system/ui/button";
import { Title2 } from "@/components/ui/title2";
import { AnalyticsPanel } from "@/components/analytics/AnalyticsPanel";
import { analyticsOutlineChipClassName } from "@/components/analytics/analytics-filter-chips";
import { Input, InputGroup } from "@/components/ui/input";
import { ProfileFieldLabel } from "@/components/profile/profile-field-styles";
import { formFieldAriaDescribedBy } from "@/components/ui/field-label";
import { loadProfileSettings, saveSettlementProfile } from "@/lib/profile-storage";
import type { SettlementProfile } from "@/types/profile";
import { space } from "@/lib/spacing";
import { cn } from "design-system/utils";

const PROFILE_SETTLEMENT_BANK_ID = "profile-settlement-bank";
const PROFILE_SETTLEMENT_ACCOUNT_ID = "profile-settlement-account";
const PROFILE_SETTLEMENT_DEPOSITOR_ID = "profile-settlement-depositor";
const PROFILE_SETTLEMENT_BIZ_ID = "profile-settlement-biz";
const PROFILE_SETTLEMENT_TAX_EMAIL_ID = "profile-settlement-tax-email";

export function ProfileSettlementTab({ onSaved }: { onSaved: () => void }) {
  const [draft, setDraft] = useState<SettlementProfile>(() => loadProfileSettings().settlement);

  const handleSave = () => {
    saveSettlementProfile(draft);
    onSaved();
  };

  const setField = <K extends keyof SettlementProfile>(key: K, value: SettlementProfile[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`flex flex-col ${PAGE_GUTTER_GAP_CLASS}`}>
      <AnalyticsPanel>
        <Title2
          text="정산 계좌"
          variant="title"
          asSectionHeader
          sectionEnd={
            <Link
              href="/settlements"
              className={cn(analyticsOutlineChipClassName, "h-9 shrink-0 px-3 text-body3_400")}
            >
              정산 내역
            </Link>
          }
        />
        <div className={cn(
          "flex max-w-xl flex-col",
          PAGE_GUTTER_GAP_CLASS,
          space.section.sectionPadding.className,
        )}>
          <p className="text-body3_400 text-foreground-muted">
            출금은 등록한 계좌로 입금돼요. 계좌 정보가 바뀌면 정산 전에 꼭 업데이트해 주세요.
          </p>

          <div className="flex flex-col gap-3">
            <ProfileFieldLabel text="은행" htmlFor={PROFILE_SETTLEMENT_BANK_ID} />
            <InputGroup>
              <Input
                id={PROFILE_SETTLEMENT_BANK_ID}
                type="text"
                size="lg"
                value={draft.bankName}
                onChange={(e) => setField("bankName", e.target.value)}
                placeholder="은행명"
              />
            </InputGroup>
          </div>

          <div className="flex flex-col gap-3">
            <ProfileFieldLabel
              text="계좌번호"
              hint="숫자만 입력해 주세요."
              htmlFor={PROFILE_SETTLEMENT_ACCOUNT_ID}
            />
            <InputGroup>
              <Input
                id={PROFILE_SETTLEMENT_ACCOUNT_ID}
                aria-describedby={formFieldAriaDescribedBy(PROFILE_SETTLEMENT_ACCOUNT_ID)}
                type="text"
                size="lg"
                inputMode="numeric"
                value={draft.accountNumber}
                onChange={(e) => setField("accountNumber", e.target.value.replace(/[^\d-]/g, ""))}
                placeholder="계좌번호"
              />
            </InputGroup>
          </div>

          <div className="flex flex-col gap-3">
            <ProfileFieldLabel
              text="예금주"
              hint="계좌 명의와 동일해야 해요."
              htmlFor={PROFILE_SETTLEMENT_DEPOSITOR_ID}
            />
            <InputGroup>
              <Input
                id={PROFILE_SETTLEMENT_DEPOSITOR_ID}
                aria-describedby={formFieldAriaDescribedBy(PROFILE_SETTLEMENT_DEPOSITOR_ID)}
                type="text"
                size="lg"
                value={draft.depositor}
                onChange={(e) => setField("depositor", e.target.value)}
                placeholder="예금주명"
              />
            </InputGroup>
          </div>

          <div className="flex justify-end border-t border-border pt-5">
            <Button type="button" className="h-9 min-w-20 px-4" onClick={handleSave}>
              저장
            </Button>
          </div>
        </div>
      </AnalyticsPanel>

      <AnalyticsPanel>
        <Title2 text="사업자·세금계산서" variant="title" asSectionHeader />
        <div className={cn(
          "flex max-w-xl flex-col",
          PAGE_GUTTER_GAP_CLASS,
          space.section.sectionPadding.className,
        )}>
          <div className="flex flex-col gap-3">
            <ProfileFieldLabel text="사업자등록번호" htmlFor={PROFILE_SETTLEMENT_BIZ_ID} />
            <InputGroup>
              <Input
                id={PROFILE_SETTLEMENT_BIZ_ID}
                type="text"
                size="lg"
                value={draft.supplierBizNumber}
                onChange={(e) => setField("supplierBizNumber", e.target.value)}
                placeholder="000-00-00000"
              />
            </InputGroup>
          </div>

          <div className="flex flex-col gap-3">
            <ProfileFieldLabel text="세금계산서 수신 이메일" htmlFor={PROFILE_SETTLEMENT_TAX_EMAIL_ID} />
            <InputGroup>
              <Input
                id={PROFILE_SETTLEMENT_TAX_EMAIL_ID}
                type="email"
                size="lg"
                value={draft.taxInvoiceEmail}
                onChange={(e) => setField("taxInvoiceEmail", e.target.value)}
                placeholder="email@example.com"
              />
            </InputGroup>
          </div>

          <div className="flex justify-end border-t border-border pt-5">
            <Button type="button" className="h-9 min-w-20 px-4" onClick={handleSave}>
              저장
            </Button>
          </div>
        </div>
      </AnalyticsPanel>
    </div>
  );
}
