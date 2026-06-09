"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Title2 } from "@/components/ui/title2";
import { AnalyticsPanel } from "@/components/analytics/AnalyticsPanel";
import { analyticsOutlineChipClassName } from "@/components/analytics/analytics-filter-chips";
import {
  ProfileFieldLabel,
  profileEditableInputClassName,
} from "@/components/profile/profile-field-styles";
import { loadProfileSettings, saveSettlementProfile } from "@/lib/profile-storage";
import type { SettlementProfile } from "@/types/profile";
import { cn } from "@/lib/utils";

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
    <div className="flex flex-col gap-my-20">
      <AnalyticsPanel>
        <Title2
          text="정산 계좌"
          variant="title"
          asSectionHeader
          sectionEnd={
            <Link
              href="/settlements"
              className={cn(analyticsOutlineChipClassName, "h-9 shrink-0 px-my-12 text-body3_400")}
            >
              정산 내역
            </Link>
          }
        />
        <div className="flex max-w-xl flex-col gap-my-20 p-my-20">
          <p className="text-body3_400 text-on-surface-20">
            출금은 등록한 계좌로 입금돼요. 계좌 정보가 바뀌면 정산 전에 꼭 업데이트해 주세요.
          </p>

          <div className="flex flex-col gap-my-12">
            <ProfileFieldLabel text="은행" />
            <input
              type="text"
              value={draft.bankName}
              onChange={(e) => setField("bankName", e.target.value)}
              placeholder="은행명"
              className={profileEditableInputClassName}
            />
          </div>

          <div className="flex flex-col gap-my-12">
            <ProfileFieldLabel text="계좌번호" hint="숫자만 입력해 주세요." />
            <input
              type="text"
              inputMode="numeric"
              value={draft.accountNumber}
              onChange={(e) => setField("accountNumber", e.target.value.replace(/[^\d-]/g, ""))}
              placeholder="계좌번호"
              className={profileEditableInputClassName}
            />
          </div>

          <div className="flex flex-col gap-my-12">
            <ProfileFieldLabel text="예금주" hint="계좌 명의와 동일해야 해요." />
            <input
              type="text"
              value={draft.depositor}
              onChange={(e) => setField("depositor", e.target.value)}
              placeholder="예금주명"
              className={profileEditableInputClassName}
            />
          </div>

          <div className="flex justify-end border-t border-border-10 pt-my-20">
            <Button type="button" className="h-my-36 min-w-my-80 px-my-16" onClick={handleSave}>
              저장
            </Button>
          </div>
        </div>
      </AnalyticsPanel>

      <AnalyticsPanel>
        <Title2 text="사업자·세금계산서" variant="title" asSectionHeader />
        <div className="flex max-w-xl flex-col gap-my-20 p-my-20">
          <div className="flex flex-col gap-my-12">
            <ProfileFieldLabel text="사업자등록번호" />
            <input
              type="text"
              value={draft.supplierBizNumber}
              onChange={(e) => setField("supplierBizNumber", e.target.value)}
              placeholder="000-00-00000"
              className={profileEditableInputClassName}
            />
          </div>

          <div className="flex flex-col gap-my-12">
            <ProfileFieldLabel text="세금계산서 수신 이메일" />
            <input
              type="email"
              value={draft.taxInvoiceEmail}
              onChange={(e) => setField("taxInvoiceEmail", e.target.value)}
              placeholder="email@example.com"
              className={profileEditableInputClassName}
            />
          </div>

          <div className="flex justify-end border-t border-border-10 pt-my-20">
            <Button type="button" className="h-my-36 min-w-my-80 px-my-16" onClick={handleSave}>
              저장
            </Button>
          </div>
        </div>
      </AnalyticsPanel>
    </div>
  );
}
