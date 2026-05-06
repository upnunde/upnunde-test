"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, PencilLine } from "lucide-react";
import Header from "@/components/Header/Header";
import AppSidebar from "@/components/AppSidebar/AppSidebar";
import { Button } from "@/components/ui/button";
import { AnalyticsPanel } from "@/components/analytics/AnalyticsPanel";
import { Pagination } from "@/components/episode/Pagination";
import { cn } from "@/lib/utils";

type SettlementStatus = "pending" | "complete" | "failed";

type SettlementItem = {
  id: string;
  episodeLabel: string;
  status: SettlementStatus;
  revenueAmount: string;
  requestedAt: string;
  payoutDueAt: string;
  vatAmount: string;
  settlementAmount: string;
};

const SETTLEMENT_SUMMARY = {
  availableAmount: "1,442",
  expectedMonthLabel: "5월 정산 예상 수익금",
  expectedAmount: "321,213",
  completedMonthLabel: "총 정산완료 수익금",
  completedAmount: "32,2324,522",
  bankAccountMasked: "라인은행 123123***",
  depositor: "브라운",
};

const SETTLEMENT_PAGE_SIZE = 10;

const SETTLEMENT_ITEMS: SettlementItem[] = Array.from({ length: 26 }, (_, idx) => {
  const n = idx + 1;
  const month = String(Math.max(1, 5 - Math.floor(idx / 5))).padStart(2, "0");
  const day = String(29 - (idx % 20)).padStart(2, "0");
  const payoutDay = String(4 + (idx % 20)).padStart(2, "0");
  const revenue = 900_000 + n * 137_111;
  const vat = Math.round(revenue * 0.1);
  const settlement = revenue - vat;

  return {
    id: `settlement-${n}`,
    episodeLabel: n % 4 === 0 ? "정산신청" : "지급완료",
    status: n % 4 === 0 ? "pending" : "complete",
    revenueAmount: revenue.toLocaleString("ko-KR"),
    requestedAt: `26. ${month}. ${day}`,
    payoutDueAt: `26. ${month}. ${payoutDay}`,
    vatAmount: vat.toLocaleString("ko-KR"),
    settlementAmount: settlement.toLocaleString("ko-KR"),
  };
});

function statusBadgeClassName(status: SettlementStatus): string {
  if (status === "complete") return "bg-primary-primary-container text-primary-on-primary-container";
  if (status === "failed") return "bg-error-error/15 text-error-error";
  return "bg-surface-20 text-on-surface-30";
}

function SettlementSummaryCard({
  title,
  amount,
}: {
  title: string;
  amount: string;
}) {
  return (
    <div className="flex h-[100px] flex-1 items-center justify-between gap-0 rounded-[4px] border border-border-10 bg-surface-10 px-10 py-5 outline outline-1 -outline-offset-1 outline-border-10/5">
      <p className="text-sm font-bold leading-5 text-on-surface-20">{title}</p>
      <div className="inline-flex items-center gap-1">
        <p className="text-2xl font-bold leading-8 text-on-surface-10">{amount}</p>
        <p className="text-2xl font-bold leading-8 text-on-surface-10">원</p>
      </div>
    </div>
  );
}

export default function MonetizationSettlementsPage() {
  const router = useRouter();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const handleBack = useCallback(() => {
    router.push("/monetization");
  }, [router]);
  const pagedSettlementItems = useMemo(() => {
    const start = (currentPage - 1) * SETTLEMENT_PAGE_SIZE;
    return SETTLEMENT_ITEMS.slice(start, start + SETTLEMENT_PAGE_SIZE);
  }, [currentPage]);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-white">
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl} />
      <div className="flex flex-1 overflow-hidden bg-surface-20">
        <AppSidebar defaultActiveId="monetization" />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <main className="flex flex-1 flex-col overflow-hidden bg-surface-20">
            <header className="flex h-16 shrink-0 items-center justify-center border-b border-border-10 bg-white px-5 py-0">
              <div className="flex w-full max-w-[1200px] items-center justify-start gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleBack}
                  className="h-9 w-9 shrink-0 rounded-full border-border-10 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  aria-label="수익창출로"
                >
                  <ChevronLeft className="h-5 w-5 text-on-surface-30" strokeWidth={2} />
                </Button>
                <h1 className="text-2xl font-bold text-on-surface-10">정산신청 및 내역</h1>
              </div>
            </header>

            <div className="flex min-h-0 flex-1 flex-col justify-start items-stretch gap-0 overflow-y-auto px-5 py-0">
              <div className="mx-auto flex w-full min-w-0 max-w-[1200px] flex-col gap-5 py-5">
                <AnalyticsPanel className="rounded-[4px] border border-border-10">
                  <div className="self-stretch border-b border-border-10 px-5 pb-3 pt-5">
                    <h3 className="text-lg font-bold leading-6 text-on-surface-10">수익금 정산</h3>
                  </div>
                  <div className="flex flex-col gap-5 p-5">
                    <div className="inline-flex items-center justify-between rounded-[4px] bg-surface-20 p-10">
                      <div className="inline-flex flex-col items-start justify-start gap-5">
                        <p className="text-sm font-bold leading-5 text-on-surface-20">정산 가능 금액</p>
                        <div className="flex flex-col items-start gap-2">
                          <div className="inline-flex items-center gap-1">
                            <p className="text-3xl font-bold leading-9 text-on-surface-10">
                              {SETTLEMENT_SUMMARY.availableAmount}
                            </p>
                            <p className="text-3xl font-bold leading-9 text-on-surface-10">원</p>
                          </div>
                          <div className="inline-flex items-center gap-3">
                            <p className="text-sm font-normal leading-5 text-on-surface-20">
                              {SETTLEMENT_SUMMARY.bankAccountMasked}
                            </p>
                            <div className="h-4 w-px bg-border-20" />
                            <p className="text-sm font-normal leading-5 text-on-surface-20">
                              {SETTLEMENT_SUMMARY.depositor}
                            </p>
                            <Button
                              type="button"
                              variant="ghost"
                              className="h-8 px-2 text-sm font-medium text-on-surface-20 hover:bg-surface-20"
                              onClick={() => router.push("/profile?tab=settlement")}
                            >
                              <PencilLine className="h-4 w-4" aria-hidden />
                              계좌 변경
                            </Button>
                          </div>
                        </div>
                      </div>
                      <Button type="button" className="h-12 min-w-24 rounded-md px-4 text-base">
                        정산 신청하기
                      </Button>
                    </div>

                    <div className="inline-flex items-start justify-start gap-5">
                      <SettlementSummaryCard
                        title={SETTLEMENT_SUMMARY.expectedMonthLabel}
                        amount={SETTLEMENT_SUMMARY.expectedAmount}
                      />
                      <SettlementSummaryCard
                        title={SETTLEMENT_SUMMARY.completedMonthLabel}
                        amount={SETTLEMENT_SUMMARY.completedAmount}
                      />
                    </div>
                  </div>
                </AnalyticsPanel>

                <AnalyticsPanel className="rounded-[4px] border border-border-10">
                  <div className="self-stretch border-b border-border-10 px-5 pb-3 pt-5">
                    <h3 className="text-lg font-bold leading-6 text-on-surface-10">정산 내역</h3>
                  </div>
                  <div className="flex flex-col">
                    <div className="inline-flex h-10 items-center border-b border-divider-10 bg-surface-10 px-5">
                      <div className="w-40 text-xs font-normal leading-4 text-on-surface-30">상태</div>
                      <div className="min-w-[220px] flex-1 text-xs font-normal leading-4 text-on-surface-30">수익금</div>
                      <div className="w-40 text-xs font-normal leading-4 text-on-surface-30">신청일</div>
                      <div className="w-40 text-xs font-normal leading-4 text-on-surface-30">지급 예정일</div>
                      <div className="w-40 text-xs font-normal leading-4 text-on-surface-30">부가세</div>
                      <div className="w-40 text-xs font-normal leading-4 text-on-surface-30">최종 정산금</div>
                    </div>

                    {pagedSettlementItems.map((item, idx) => (
                      <React.Fragment key={item.id}>
                        <div className="inline-flex items-center px-5">
                          <div className="flex h-20 w-40 items-center">
                            <span
                              className={cn(
                                "inline-flex h-8 items-center justify-center rounded-[4px] px-2 py-1 text-[13px] font-normal leading-5",
                                statusBadgeClassName(item.status),
                              )}
                            >
                              {item.episodeLabel}
                            </span>
                          </div>
                          <div className="flex h-20 min-w-[220px] flex-1 items-center gap-0.5">
                            <p className="text-base font-bold leading-6 text-on-surface-10">{item.revenueAmount}</p>
                            <p className="text-base font-normal leading-6 text-on-surface-20">원</p>
                          </div>
                          <div className="flex h-20 w-40 items-center text-sm font-normal leading-5 text-on-surface-20">
                            {item.requestedAt}
                          </div>
                          <div className="flex h-20 w-40 items-center text-sm font-normal leading-5 text-on-surface-20">
                            {item.payoutDueAt}
                          </div>
                          <div className="flex h-20 w-40 items-center gap-0.5">
                            <p className="text-sm font-normal leading-5 text-on-surface-20">{item.vatAmount}</p>
                            <p className="text-sm font-normal leading-5 text-on-surface-20">원</p>
                          </div>
                          <div className="flex h-20 w-40 items-center gap-0.5">
                            <p className="text-sm font-normal leading-5 text-on-surface-20">{item.settlementAmount}</p>
                            <p className="text-sm font-normal leading-5 text-on-surface-20">원</p>
                          </div>
                        </div>
                        {idx < pagedSettlementItems.length - 1 ? (
                          <div className="px-5">
                            <div className="h-px bg-divider-10" />
                          </div>
                        ) : null}
                      </React.Fragment>
                    ))}
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalItems={SETTLEMENT_ITEMS.length}
                    pageSize={SETTLEMENT_PAGE_SIZE}
                    onPageChange={setCurrentPage}
                    className="rounded-b-[4px] border-t border-border-10"
                  />
                </AnalyticsPanel>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
