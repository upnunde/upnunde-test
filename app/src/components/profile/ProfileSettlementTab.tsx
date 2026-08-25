"use client";

import { PROFILE_PAGE_STACK_GAP_CLASS } from "@/lib/page-layout";

import { useEffect, useState } from "react";
import { FieldLabel } from "design-system/ui/field-label";
import { Input, InputGroup } from "design-system/ui/input";
import { BankSelectField } from "@/components/profile/BankSelectField";
import { ProfileDirtySaveButton } from "@/components/profile/ProfileDirtySaveButton";
import {
  DEFAULT_SETTLEMENT_PROFILE,
  loadProfileSettings,
  saveSettlementProfile,
} from "@/lib/profile-storage";
import type { SettlementProfile } from "@/types/profile";
import { cn } from "design-system/utils";

const PROFILE_SETTLEMENT_BANK_ID = "profile-settlement-bank";
const PROFILE_SETTLEMENT_ACCOUNT_ID = "profile-settlement-account";
const PROFILE_SETTLEMENT_DEPOSITOR_ID = "profile-settlement-depositor";
const PROFILE_SETTLEMENT_BIZ_ID = "profile-settlement-biz";
const PROFILE_SETTLEMENT_TAX_EMAIL_ID = "profile-settlement-tax-email";

function isSettlementDirty(draft: SettlementProfile, saved: SettlementProfile) {
  return (
    draft.bankName !== saved.bankName ||
    draft.accountNumber !== saved.accountNumber ||
    draft.depositor !== saved.depositor ||
    draft.supplierBizNumber !== saved.supplierBizNumber ||
    draft.taxInvoiceEmail !== saved.taxInvoiceEmail
  );
}

export function ProfileSettlementTab({ onSaved }: { onSaved: () => void }) {
  const [draft, setDraft] = useState<SettlementProfile>(DEFAULT_SETTLEMENT_PROFILE);
  const [saved, setSaved] = useState<SettlementProfile>(DEFAULT_SETTLEMENT_PROFILE);

  useEffect(() => {
    const settlement = loadProfileSettings().settlement;
    setDraft(settlement);
    setSaved(settlement);
  }, []);

  const handleSave = () => {
    saveSettlementProfile(draft);
    setSaved(draft);
    onSaved();
  };

  const setField = <K extends keyof SettlementProfile>(key: K, value: SettlementProfile[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className={cn("flex flex-col max-lg:px-5", PROFILE_PAGE_STACK_GAP_CLASS)}>
      <InputGroup>
        <FieldLabel size="sm" weight="600" htmlFor={PROFILE_SETTLEMENT_BANK_ID}>
          은행
        </FieldLabel>
        <BankSelectField
          id={PROFILE_SETTLEMENT_BANK_ID}
          value={draft.bankName}
          onChange={(bankName) => setField("bankName", bankName)}
        />
      </InputGroup>

      <InputGroup>
        <FieldLabel
          size="sm"
          weight="600"
          htmlFor={PROFILE_SETTLEMENT_ACCOUNT_ID}
          description="숫자만 입력해 주세요."
          descriptionId={`${PROFILE_SETTLEMENT_ACCOUNT_ID}-desc`}
        >
          계좌번호
        </FieldLabel>
        <Input
          id={PROFILE_SETTLEMENT_ACCOUNT_ID}
          aria-describedby={`${PROFILE_SETTLEMENT_ACCOUNT_ID}-desc`}
          type="text"
          size="xl"
          inputMode="numeric"
          value={draft.accountNumber}
          onChange={(e) => setField("accountNumber", e.target.value.replace(/[^\d-]/g, ""))}
          placeholder="계좌번호"
        />
      </InputGroup>

      <InputGroup>
        <FieldLabel
          size="sm"
          weight="600"
          htmlFor={PROFILE_SETTLEMENT_DEPOSITOR_ID}
          description="계좌 명의와 동일해야 해요."
          descriptionId={`${PROFILE_SETTLEMENT_DEPOSITOR_ID}-desc`}
        >
          예금주
        </FieldLabel>
        <Input
          id={PROFILE_SETTLEMENT_DEPOSITOR_ID}
          aria-describedby={`${PROFILE_SETTLEMENT_DEPOSITOR_ID}-desc`}
          type="text"
          size="xl"
          value={draft.depositor}
          onChange={(e) => setField("depositor", e.target.value)}
          placeholder="예금주명"
        />
      </InputGroup>

      <div className="border-t border-divider" role="separator" />

      <InputGroup>
        <FieldLabel size="sm" weight="600" htmlFor={PROFILE_SETTLEMENT_BIZ_ID}>
          사업자등록번호
        </FieldLabel>
        <Input
          id={PROFILE_SETTLEMENT_BIZ_ID}
          type="text"
          size="xl"
          value={draft.supplierBizNumber}
          onChange={(e) => setField("supplierBizNumber", e.target.value)}
          placeholder="000-00-00000"
        />
      </InputGroup>

      <InputGroup>
        <FieldLabel size="sm" weight="600" htmlFor={PROFILE_SETTLEMENT_TAX_EMAIL_ID}>
          세금계산서 수신 이메일
        </FieldLabel>
        <Input
          id={PROFILE_SETTLEMENT_TAX_EMAIL_ID}
          type="email"
          size="xl"
          value={draft.taxInvoiceEmail}
          onChange={(e) => setField("taxInvoiceEmail", e.target.value)}
          placeholder="email@example.com"
        />
      </InputGroup>

      <ProfileDirtySaveButton visible={isSettlementDirty(draft, saved)} onClick={handleSave} />
    </div>
  );
}
