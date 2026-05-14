"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CalendarDays, ChevronDown, Download, FileText } from "lucide-react";
import Header from "@/components/Header/Header";
import AppSidebar from "@/components/AppSidebar/AppSidebar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AnalyticsPanel } from "@/components/analytics/AnalyticsPanel";
import { analyticsOutlineChipClassName } from "@/components/analytics/analytics-filter-chips";
import { Title2 } from "@/components/ui/title2";
import { Pagination } from "@/components/episode/Pagination";
import { cn } from "@/lib/utils";

type SettlementStatus = "completed" | "reviewing" | "waiting" | "rejected";

type SettlementItem = {
  id: string;
  status: SettlementStatus;
  rejectionReason: string | null;
  revenueAmount: string;
  revenueValue: number;
  requestedAt: string;
  requestedDate: Date;
  payoutDueAt: string;
  payoutDueDate: Date;
  vatAmount: string;
  vatValue: number;
  settlementAmount: string;
  settlementValue: number;
  invoiceNumber: string;
  invoiceIssuedAt: string;
  supplierBizNumber: string;
  buyerBizNumber: string;
  taxInvoiceStatus: "verified" | "pending";
};

function getTaxInvoiceCompleteness(item: SettlementItem): boolean {
  return (
    Boolean(item.invoiceNumber) &&
    Boolean(item.invoiceIssuedAt) &&
    Boolean(item.supplierBizNumber) &&
    Boolean(item.buyerBizNumber) &&
    item.taxInvoiceStatus === "verified"
  );
}

const SETTLEMENT_SUMMARY = {
  availableAmount: 14_420_000,
  expectedMonthLabel: "5월 예상 정산액",
  expectedAmount: 321_213,
  completedMonthLabel: "누적 정산 완료 금액",
  completedAmount: 32_324_522,
  bankAccountMasked: "라인은행 123123***",
  depositor: "브라운",
};

const SETTLEMENT_PAGE_SIZE = 10;

type RangePreset = "all" | "1m" | "3m" | "6m" | "ytd" | "custom";
type StatusFilter = "all" | SettlementStatus;

const STATUS_FILTER_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "전체 상태" },
  { value: "reviewing", label: "지급 심사중" },
  { value: "completed", label: "지급 완료" },
];

function getSettlementStatusLabel(status: SettlementStatus): string {
  if (status === "completed") return "지급 완료";
  if (status === "reviewing") return "지급 심사중";
  if (status === "waiting") return "지급 예정";
  return "지급 반려";
}

function formatCompactDate(date: Date): string {
  const y = String(date.getFullYear()).slice(2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}. ${m}. ${d}`;
}

function toInputDateValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatRangeLabel(startDate: string, endDate: string): string {
  if (!startDate || !endDate) return "날짜 선택";
  const start = startDate.replaceAll("-", ".");
  const end = endDate.replaceAll("-", ".");
  return `${start} ~ ${end}`;
}

function formatAmount(value: number): string {
  return value.toLocaleString("ko-KR");
}

const baseSettlementItems: SettlementItem[] = Array.from({ length: 24 }, (_, idx) => {
  const n = idx + 1;
  const now = new Date(2026, 4, 29);
  const twoYearsAgo = new Date(now);
  twoYearsAgo.setFullYear(now.getFullYear() - 2);
  const rangeMs = now.getTime() - twoYearsAgo.getTime();
  const pseudo = Math.abs(Math.sin((idx + 1) * 9301 + 49297)) % 1;
  const requestedDate = new Date(twoYearsAgo.getTime() + Math.floor(rangeMs * pseudo));
  const payoutDueDate = new Date(requestedDate);
  payoutDueDate.setDate(requestedDate.getDate() + 3 + (idx % 4));
  const revenue = 900_000 + n * 137_111;
  const vat = Math.round(revenue * 0.1);
  const settlement = revenue - vat;
  return {
    id: `settlement-${n}`,
    status: "completed",
    rejectionReason: null,
    revenueAmount: revenue.toLocaleString("ko-KR"),
    revenueValue: revenue,
    requestedAt: formatCompactDate(requestedDate),
    requestedDate,
    payoutDueAt: formatCompactDate(payoutDueDate),
    payoutDueDate,
    vatAmount: vat.toLocaleString("ko-KR"),
    vatValue: vat,
    settlementAmount: settlement.toLocaleString("ko-KR"),
    settlementValue: settlement,
    invoiceNumber: `TI-2026-${String(n).padStart(4, "0")}`,
    invoiceIssuedAt: formatCompactDate(new Date(requestedDate.getTime() + 24 * 60 * 60 * 1000)),
    supplierBizNumber: "123-45-67890",
    buyerBizNumber: "987-65-43210",
    taxInvoiceStatus: n % 5 === 0 ? "pending" : "verified",
  };
});

const latestRequestedMs = Math.max(...baseSettlementItems.map((item) => item.requestedDate.getTime()));

const SETTLEMENT_ITEMS: SettlementItem[] = baseSettlementItems.map((item) => ({
  ...item,
  status: item.requestedDate.getTime() === latestRequestedMs ? "reviewing" : "completed",
  rejectionReason: null,
}));

function statusBadgeClassName(status: SettlementStatus): string {
  if (status === "completed") return "bg-primary-primary-container text-primary-on-primary-container";
  if (status === "reviewing") return "bg-surface-20 text-on-surface-20";
  if (status === "waiting") return "bg-warning-warning/15 text-warning-on-warning";
  return "bg-error-error/15 text-error-error";
}

function SettlementSummaryCard({
  title,
  amount,
}: {
  title: string;
  amount: number;
}) {
  return (
    <div className="flex min-h-[100px] w-full min-w-0 flex-col justify-between gap-3 rounded-[4px] border border-border-10 bg-surface-10 px-5 py-4 lg:min-h-0 lg:flex-1 lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:py-5">
      <p className="min-w-0 text-sm font-bold leading-5 text-on-surface-20 lg:shrink">{title}</p>
      <div className="inline-flex min-w-0 flex-wrap items-baseline gap-x-1 gap-y-0 tabular-nums">
        <p className="text-xl font-bold leading-8 text-on-surface-10 lg:text-2xl">{formatAmount(amount)}</p>
        <p className="text-xl font-bold leading-8 text-on-surface-10 lg:text-2xl">원</p>
      </div>
    </div>
  );
}

/**
 * 데스크톱 표: 상태 열은 행 너비의 15%, 나머지(80px 액션 제외)는 2.5fr·1fr×4로 분배.
 */
const SETTLEMENT_TABLE_GRID_CLASS =
  "grid w-full min-w-0 grid-cols-[minmax(0,15%)_minmax(0,2.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,min(100%,80px))] gap-x-0";

/** 기간 프리셋 선택 상태 — primary 대신 inverse 서피스(어두운 톤) */
const RANGE_PRESET_ACTIVE_CLASS =
  "border-transparent bg-[var(--surface-inverse-10)] text-[var(--on-surface-inverse)] shadow-none hover:bg-[var(--surface-inverse-20)] hover:text-[var(--on-surface-inverse)] focus-visible:ring-2 focus-visible:ring-on-surface-30/35";

function rangePresetButtonClass(active: boolean) {
  return cn("border-border-10 shadow-none", active ? RANGE_PRESET_ACTIVE_CLASS : "bg-white text-on-surface-20");
}

function SettlementRowDesktop({
  item,
  onTaxDetail,
  onRejectionReason,
}: {
  item: SettlementItem;
  onTaxDetail: () => void;
  onRejectionReason: () => void;
}) {
  return (
    <div className={cn(SETTLEMENT_TABLE_GRID_CLASS, "min-h-16 items-center px-3 py-2 sm:min-h-20 sm:px-4")}>
      <div className="flex min-w-0 items-center">
        {item.status === "rejected" && item.rejectionReason ? (
          <button
            type="button"
            className={cn(
              "inline-flex max-w-full items-center gap-1 truncate rounded-[4px] px-2 py-1 text-[12px] font-normal leading-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error-error/40 sm:text-[13px]",
              statusBadgeClassName(item.status)
            )}
            title={`반려 사유: ${item.rejectionReason}`}
            aria-label={`반려 사유 확인: ${item.rejectionReason}`}
            onClick={onRejectionReason}
          >
            <span className="truncate">{getSettlementStatusLabel(item.status)}</span>
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
          </button>
        ) : (
          <span
            className={cn(
              "inline-flex max-w-full items-center justify-center truncate rounded-[4px] px-2 py-1 text-[12px] font-normal leading-5 sm:text-[13px]",
              statusBadgeClassName(item.status),
            )}
          >
            <span className="truncate">{getSettlementStatusLabel(item.status)}</span>
          </span>
        )}
      </div>
      <div className="flex min-w-0 items-center gap-0.5 tabular-nums">
        <p className="truncate text-sm font-bold leading-5 text-on-surface-10">{item.revenueAmount}</p>
        <p className="shrink-0 text-sm font-normal leading-5 text-on-surface-20">원</p>
      </div>
      <div className="min-w-0 truncate text-sm font-normal leading-5 text-on-surface-20">{item.requestedAt}</div>
      <div className="min-w-0 truncate text-sm font-normal leading-5 text-on-surface-20">{item.payoutDueAt}</div>
      <div className="flex min-w-0 items-center gap-0.5 tabular-nums">
        <p className="truncate text-sm font-normal leading-5 text-on-surface-20">{item.vatAmount}</p>
        <p className="shrink-0 text-sm font-normal leading-5 text-on-surface-20">원</p>
      </div>
      <div className="flex min-w-0 items-center gap-0.5 tabular-nums">
        <p className="truncate text-sm font-normal leading-5 text-on-surface-20">{item.settlementAmount}</p>
        <p className="shrink-0 text-sm font-normal leading-5 text-on-surface-20">원</p>
      </div>
      <div className="flex min-w-0 items-center justify-end">
        {item.status === "completed" ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 shrink-0 rounded-full p-0 text-on-surface-30 hover:bg-surface-20"
            onClick={onTaxDetail}
            aria-label="세금 계산 상세 보기"
          >
            <FileText className="h-4 w-4" aria-hidden />
          </Button>
        ) : (
          <span aria-hidden className="h-8 w-8" />
        )}
      </div>
    </div>
  );
}

function SettlementRowMobile({
  item,
  onTaxDetail,
  onRejectionReason,
}: {
  item: SettlementItem;
  onTaxDetail: () => void;
  onRejectionReason: () => void;
}) {
  return (
    <div className="rounded-[4px] border border-border-10 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {item.status === "rejected" && item.rejectionReason ? (
            <button
              type="button"
              className={cn(
                "inline-flex max-w-full items-center gap-1 rounded-[4px] px-2 py-1 text-[13px] font-normal leading-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error-error/40",
                statusBadgeClassName(item.status),
              )}
              title={`반려 사유: ${item.rejectionReason}`}
              aria-label={`반려 사유 확인: ${item.rejectionReason}`}
              onClick={onRejectionReason}
            >
              <span className="truncate">{getSettlementStatusLabel(item.status)}</span>
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
            </button>
          ) : (
            <span
              className={cn(
                "inline-flex items-center rounded-[4px] px-2 py-1 text-[13px] font-normal leading-5",
                statusBadgeClassName(item.status),
              )}
            >
              {getSettlementStatusLabel(item.status)}
            </span>
          )}
        </div>
        {item.status === "completed" ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 shrink-0 rounded-full p-0 text-on-surface-30 hover:bg-surface-20"
            onClick={onTaxDetail}
            aria-label="세금 계산 상세 보기"
          >
            <FileText className="h-4 w-4" aria-hidden />
          </Button>
        ) : null}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <p className="text-xs text-on-surface-30">수익금</p>
          <p className="font-bold text-on-surface-10">{item.revenueAmount}원</p>
        </div>
        <div>
          <p className="text-xs text-on-surface-30">실지급액</p>
          <p className="text-on-surface-20">{item.settlementAmount}원</p>
        </div>
        <div>
          <p className="text-xs text-on-surface-30">신청일</p>
          <p className="text-on-surface-20">{item.requestedAt}</p>
        </div>
        <div>
          <p className="text-xs text-on-surface-30">지급 예정일</p>
          <p className="text-on-surface-20">{item.payoutDueAt}</p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-on-surface-30">부가세</p>
          <p className="text-on-surface-20">{item.vatAmount}원</p>
        </div>
      </div>
    </div>
  );
}

export default function MonetizationSettlementsPage() {
  const router = useRouter();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [taxDetailTarget, setTaxDetailTarget] = useState<SettlementItem | null>(null);
  const [rejectionReasonTarget, setRejectionReasonTarget] = useState<SettlementItem | null>(null);
  const [rangePreset, setRangePreset] = useState<RangePreset>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const initialEndDate = toInputDateValue(new Date(2026, 4, 29));
  const initialStartDate = toInputDateValue(new Date(2024, 4, 29));
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [pendingStartDate, setPendingStartDate] = useState(initialStartDate);
  const [pendingEndDate, setPendingEndDate] = useState(initialEndDate);

  const statusFilterLabel = useMemo(
    () => STATUS_FILTER_OPTIONS.find((option) => option.value === statusFilter)?.label ?? "전체 상태",
    [statusFilter]
  );
  const rangeLabel = useMemo(() => formatRangeLabel(startDate, endDate), [startDate, endDate]);

  const applyPresetRange = useCallback((preset: RangePreset) => {
    const end = new Date(2026, 4, 29);
    const start = new Date(end);
    if (preset === "all") {
      start.setFullYear(end.getFullYear() - 2);
    }
    if (preset === "1m") start.setMonth(end.getMonth() - 1);
    if (preset === "3m") start.setMonth(end.getMonth() - 3);
    if (preset === "6m") start.setMonth(end.getMonth() - 6);
    if (preset === "ytd") start.setMonth(0, 1);
    setRangePreset(preset);
    if (preset !== "custom") {
      const nextStart = toInputDateValue(start);
      const nextEnd = toInputDateValue(end);
      setStartDate(nextStart);
      setEndDate(nextEnd);
      setPendingStartDate(nextStart);
      setPendingEndDate(nextEnd);
    }
    setCurrentPage(1);
  }, []);

  const applyCustomRange = useCallback(() => {
    setRangePreset("custom");
    setStartDate(pendingStartDate);
    setEndDate(pendingEndDate);
    setCurrentPage(1);
    setDatePickerOpen(false);
  }, [pendingEndDate, pendingStartDate]);

  const filteredSettlementItems = useMemo(() => {
    const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
    const end = endDate ? new Date(`${endDate}T23:59:59`) : null;
    return SETTLEMENT_ITEMS
      .filter((item) => {
        const statusMatched = statusFilter === "all" ? true : item.status === statusFilter;
        const dateMatched =
          (!start || item.requestedDate >= start) &&
          (!end || item.requestedDate <= end) &&
          item.payoutDueDate >= item.requestedDate;
        return statusMatched && dateMatched;
      })
      .sort((a, b) => b.requestedDate.getTime() - a.requestedDate.getTime());
  }, [endDate, startDate, statusFilter]);

  const pagedSettlementItems = useMemo(() => {
    const start = (currentPage - 1) * SETTLEMENT_PAGE_SIZE;
    return filteredSettlementItems.slice(start, start + SETTLEMENT_PAGE_SIZE);
  }, [currentPage, filteredSettlementItems]);

  const handleDownloadCsv = useCallback(() => {
    const headers = [
      "상태",
      "수익금",
      "신청일",
      "지급 예정일",
      "부가세",
      "실지급액",
      "세율",
      "계산식",
      "세금계산서 번호",
      "세금계산서 발행일",
      "공급자 사업자등록번호",
      "공급받는자 사업자등록번호",
      "세금계산서 검증상태",
      "증빙 준비상태",
      "반려 사유",
    ];
    const rows = filteredSettlementItems.map((item) => [
      getSettlementStatusLabel(item.status),
      item.revenueValue.toString(),
      item.requestedAt,
      item.payoutDueAt,
      item.vatValue.toString(),
      item.settlementValue.toString(),
      "10%",
      `${item.revenueValue} x 0.1 = ${item.vatValue}`,
      item.invoiceNumber,
      item.invoiceIssuedAt,
      item.supplierBizNumber,
      item.buyerBizNumber,
      item.taxInvoiceStatus === "verified" ? "검증 완료" : "확인 필요",
      getTaxInvoiceCompleteness(item) ? "준비 완료" : "보완 필요",
      item.rejectionReason ?? "",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `settlements_${startDate}_${endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [endDate, filteredSettlementItems, startDate]);

  const handleDownloadSingleSettlementCsv = useCallback((item: SettlementItem) => {
    const headers = [
      "상태",
      "수익금",
      "신청일",
      "지급 예정일",
      "부가세",
      "실지급액",
      "세율",
      "계산식",
      "세금계산서 번호",
      "세금계산서 발행일",
      "공급자 사업자등록번호",
      "공급받는자 사업자등록번호",
      "세금계산서 검증상태",
      "증빙 준비상태",
      "반려 사유",
    ];
    const row = [
      getSettlementStatusLabel(item.status),
      item.revenueValue.toString(),
      item.requestedAt,
      item.payoutDueAt,
      item.vatValue.toString(),
      item.settlementValue.toString(),
      "10%",
      `${item.revenueValue} x 0.1 = ${item.vatValue}`,
      item.invoiceNumber,
      item.invoiceIssuedAt,
      item.supplierBizNumber,
      item.buyerBizNumber,
      item.taxInvoiceStatus === "verified" ? "검증 완료" : "확인 필요",
      getTaxInvoiceCompleteness(item) ? "준비 완료" : "보완 필요",
      item.rejectionReason ?? "",
    ];
    const csv = [headers, row]
      .map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `settlement_${item.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-white">
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl} />
      <div className="flex flex-1 overflow-hidden bg-surface-20">
        <AppSidebar defaultActiveId="settlements" />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <main className="flex flex-1 flex-col overflow-hidden bg-surface-20">
            <div className="flex h-[64px] w-full shrink-0 flex-col items-center justify-center border-b border-border-10 bg-white px-5">
              <div className="flex w-full max-w-[1200px] items-center justify-start gap-4">
                <h1 className="text-2xl font-bold text-on-surface-10">정산</h1>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col justify-start items-stretch gap-0 overflow-y-auto px-5 py-0">
              <div className="mx-auto flex w-full min-w-0 max-w-[1200px] flex-col gap-5 py-5">
                <AnalyticsPanel className="rounded-[4px] border border-border-10">
                  <Title2
                    text="정산 요약"
                    variant="title"
                    asSectionHeader
                    sectionEnd={
                      <Link
                        href="/analytics?area=revenue"
                        className={cn(analyticsOutlineChipClassName, "h-9 shrink-0 px-3 text-sm")}
                      >
                        수익 분석
                      </Link>
                    }
                  />
                  <div className="flex flex-col gap-5 p-5">
                    <div className="flex flex-col gap-6 rounded-[4px] bg-surface-20 p-5 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
                      <div className="flex flex-col items-start justify-start gap-5">
                        <p className="text-sm font-bold leading-5 text-on-surface-20">지금 출금 가능한 금액</p>
                        <div className="flex flex-col items-start gap-2">
                          <div className="inline-flex items-center gap-1">
                            <p className="text-3xl font-bold leading-9 text-on-surface-10">
                              {formatAmount(SETTLEMENT_SUMMARY.availableAmount)}
                            </p>
                            <p className="text-3xl font-bold leading-9 text-on-surface-10">원</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <p className="text-sm font-normal leading-5 text-on-surface-20">
                              {SETTLEMENT_SUMMARY.bankAccountMasked}
                            </p>
                            <div className="h-4 w-px bg-border-20" />
                            <p className="text-sm font-normal leading-5 text-on-surface-20">
                              {SETTLEMENT_SUMMARY.depositor}
                            </p>
                            <button
                              type="button"
                              onClick={() => router.push("/profile?tab=settlement")}
                              className="inline-flex items-center gap-1 text-sm font-medium text-on-surface-20 underline underline-offset-4 hover:text-on-surface-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-sm"
                            >
                              계좌 변경
                            </button>
                          </div>
                        </div>
                      </div>
                      <Button type="button" className="h-12 min-w-24 rounded-md px-4 text-base">
                        출금 신청
                      </Button>
                    </div>

                    <div className="flex w-full min-w-0 flex-col items-stretch gap-4 md:gap-5 lg:flex-row lg:items-stretch">
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
                  <div className="border-b border-border-10 px-5 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-lg font-bold leading-6 text-on-surface-10">정산 내역</h3>
                    </div>
                    <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                      <div className="flex flex-wrap items-end gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <Button type="button" variant="outline" size="sm" className={rangePresetButtonClass(rangePreset === "all")} onClick={() => applyPresetRange("all")}>
                            전체 기간
                          </Button>
                          <Button type="button" variant="outline" size="sm" className={rangePresetButtonClass(rangePreset === "1m")} onClick={() => applyPresetRange("1m")}>
                            1개월
                          </Button>
                          <Button type="button" variant="outline" size="sm" className={rangePresetButtonClass(rangePreset === "3m")} onClick={() => applyPresetRange("3m")}>
                            3개월
                          </Button>
                          <Button type="button" variant="outline" size="sm" className={rangePresetButtonClass(rangePreset === "6m")} onClick={() => applyPresetRange("6m")}>
                            6개월
                          </Button>
                          <Button type="button" variant="outline" size="sm" className={rangePresetButtonClass(rangePreset === "ytd")} onClick={() => applyPresetRange("ytd")}>
                            올해
                          </Button>
                        </div>
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-9 min-w-0 max-w-full flex-1 justify-between border-border-10 px-3 text-sm font-normal text-on-surface-20 sm:min-w-[200px] sm:max-w-[min(100%,320px)]"
                            onClick={() => setDatePickerOpen(true)}
                          >
                            <span className="truncate">{rangeLabel}</span>
                            <CalendarDays className="h-4 w-4 shrink-0 text-on-surface-30" aria-hidden />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-9 min-w-0 max-w-full flex-1 justify-between border-border-10 px-3 text-sm font-normal text-on-surface-20 sm:min-w-[108px] sm:flex-initial sm:max-w-none"
                              >
                                <span>{statusFilterLabel}</span>
                                <ChevronDown className="h-4 w-4 text-on-surface-30" aria-hidden />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-[160px] rounded-[4px] border border-border-10 bg-white p-1">
                              {STATUS_FILTER_OPTIONS.map((option) => (
                                <DropdownMenuItem
                                  key={option.value}
                                  className="cursor-pointer rounded-[4px] px-3 py-2 text-sm text-on-surface-20 hover:bg-surface-20"
                                  onSelect={() => {
                                    setStatusFilter(option.value);
                                    setCurrentPage(1);
                                  }}
                                >
                                  {option.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="min-w-0 shrink"
                        onClick={handleDownloadCsv}
                      >
                        <Download className="h-4 w-4 shrink-0" aria-hidden />
                        <span className="truncate">내역 다운로드 (CSV)</span>
                      </Button>
                    </div>
                  </div>
                  <div className="w-full min-w-0">
                    {pagedSettlementItems.length === 0 ? (
                      <div className="px-5 py-10 text-center text-sm text-on-surface-30">
                        조건에 맞는 정산 내역이 없어요. 기간 또는 상태를 다시 선택해 주세요.
                      </div>
                    ) : (
                      <>
                        {/* xl 미만·사이드바 포함 폭에서는 표 대신 카드로 가로 스크롤 없이 표시 */}
                        <div className="space-y-3 p-3 sm:p-4 xl:hidden">
                          {pagedSettlementItems.map((item) => (
                            <SettlementRowMobile
                              key={item.id}
                              item={item}
                              onTaxDetail={() => setTaxDetailTarget(item)}
                              onRejectionReason={() => setRejectionReasonTarget(item)}
                            />
                          ))}
                        </div>

                        <div className="hidden min-w-0 flex-col xl:flex">
                          <div
                            className={cn(
                              SETTLEMENT_TABLE_GRID_CLASS,
                              "items-center border-b border-divider-10 bg-surface-10 px-3 py-3 sm:px-4",
                            )}
                          >
                            <div className="min-w-0 truncate text-xs font-normal leading-4 text-on-surface-30">상태</div>
                            <div className="min-w-0 truncate text-xs font-normal leading-4 text-on-surface-30">수익금</div>
                            <div className="min-w-0 truncate text-xs font-normal leading-4 text-on-surface-30">신청일</div>
                            <div className="min-w-0 truncate text-xs font-normal leading-4 text-on-surface-30">지급 예정일</div>
                            <div className="min-w-0 truncate text-xs font-normal leading-4 text-on-surface-30">부가세</div>
                            <div className="min-w-0 truncate text-xs font-normal leading-4 text-on-surface-30">실지급액</div>
                            <div className="min-w-0 truncate text-right text-xs font-normal leading-4 text-on-surface-30">세금 상세</div>
                          </div>

                          {pagedSettlementItems.map((item, idx) => (
                            <React.Fragment key={item.id}>
                              <SettlementRowDesktop
                                item={item}
                                onTaxDetail={() => setTaxDetailTarget(item)}
                                onRejectionReason={() => setRejectionReasonTarget(item)}
                              />
                              {idx < pagedSettlementItems.length - 1 ? (
                                <div className="px-3 sm:px-4">
                                  <div className="h-px w-full bg-divider-10" />
                                </div>
                              ) : null}
                            </React.Fragment>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalItems={filteredSettlementItems.length}
                    pageSize={SETTLEMENT_PAGE_SIZE}
                    onPageChange={setCurrentPage}
                    className="rounded-b-[4px] border-t border-divider-10"
                  />
                </AnalyticsPanel>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Dialog open={!!taxDetailTarget} onOpenChange={(open) => !open && setTaxDetailTarget(null)}>
        <DialogContent className="w-[560px] max-w-[calc(100vw-2rem)] rounded-[4px] border border-border-10 bg-white p-0">
          <div className="border-b border-divider-10 px-6 py-4">
            <DialogTitle className="text-lg font-bold leading-6 text-on-surface-10">
              세금 계산 내역
            </DialogTitle>
            <p className="mt-1 text-sm leading-5 text-on-surface-30">정산 계산과 증빙 준비 상태를 확인해 주세요.</p>
          </div>
          {taxDetailTarget ? (
            <>
              <div className="space-y-4 px-6 py-5 text-sm text-on-surface-20">
                <section className="rounded-[4px] border border-border-10 bg-white px-4 py-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-on-surface-30">과세 대상 금액</p>
                      <p className="font-semibold text-on-surface-10">{taxDetailTarget.revenueAmount}원</p>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-on-surface-30">부가세 (10%)</p>
                      <p className="font-semibold text-on-surface-10">{taxDetailTarget.vatAmount}원</p>
                    </div>
                    <div className="h-px bg-divider-10" />
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold text-on-surface-20">실지급액</p>
                      <p className="text-lg font-bold text-on-surface-10">{taxDetailTarget.settlementAmount}원</p>
                    </div>
                  </div>
                </section>

                <section className="rounded-[4px] border border-border-10 bg-white px-4 py-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-xs text-on-surface-30">세금계산서 번호</p>
                      <p className="text-sm font-medium text-on-surface-10">{taxDetailTarget.invoiceNumber}</p>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-xs text-on-surface-30">발행일</p>
                      <p className="text-sm font-medium text-on-surface-10">{taxDetailTarget.invoiceIssuedAt}</p>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-xs text-on-surface-30">공급자 등록번호</p>
                      <p className="text-sm font-medium text-on-surface-10">{taxDetailTarget.supplierBizNumber}</p>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-xs text-on-surface-30">공급받는자 등록번호</p>
                      <p className="text-sm font-medium text-on-surface-10">{taxDetailTarget.buyerBizNumber}</p>
                    </div>
                  </div>
                </section>

                {!getTaxInvoiceCompleteness(taxDetailTarget) ? (
                  <div className="rounded-[4px] border border-error-error/30 bg-error-error/10 px-3 py-2 text-xs text-error-error">
                    필수 증빙 항목이 일부 누락되었거나 검증이 완료되지 않았어요. 발행 정보와 검증 상태를 확인해 주세요.
                  </div>
                ) : null}
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-divider-10 px-6 py-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 border-border-10 bg-white hover:bg-surface-20"
                  onClick={() => handleDownloadSingleSettlementCsv(taxDetailTarget)}
                >
                  <Download className="h-4 w-4" aria-hidden />
                  이 내역 다운로드
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="h-9"
                  onClick={() => setTaxDetailTarget(null)}
                >
                  확인
                </Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
      <Dialog open={!!rejectionReasonTarget} onOpenChange={(open) => !open && setRejectionReasonTarget(null)}>
        <DialogContent className="w-[420px] max-w-[calc(100vw-2rem)] rounded-[4px] border border-border-10 bg-white p-0">
          <div className="border-b border-divider-10 px-5 py-3">
            <DialogTitle className="text-base font-bold leading-6 text-on-surface-10">반려 사유</DialogTitle>
          </div>
          {rejectionReasonTarget ? (
            <>
              <div className="px-5 py-4">
                <p className="text-sm text-on-surface-20">{rejectionReasonTarget.rejectionReason}</p>
                <p className="mt-2 text-xs text-on-surface-30">
                  신청일 {rejectionReasonTarget.requestedAt} · 상태 {getSettlementStatusLabel(rejectionReasonTarget.status)}
                </p>
              </div>
              <div className="flex items-center justify-end border-t border-divider-10 px-5 py-3">
                <Button type="button" size="sm" onClick={() => setRejectionReasonTarget(null)}>
                  확인
                </Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
      <Dialog open={datePickerOpen} onOpenChange={setDatePickerOpen}>
        <DialogContent className="w-[420px] max-w-[calc(100vw-2rem)] rounded-[4px] border border-border-10 bg-white p-0">
          <div className="border-b border-divider-10 px-5 py-3">
            <DialogTitle className="text-base font-bold leading-6 text-on-surface-10">기간 선택</DialogTitle>
            <p className="mt-1 text-sm text-on-surface-30">조회할 신청일 기간을 설정해 주세요.</p>
          </div>
          <div className="px-5 py-4">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={pendingStartDate}
                onChange={(e) => setPendingStartDate(e.target.value)}
                className="h-9 flex-1 rounded-md border border-border-10 px-3 text-sm"
              />
              <span className="text-sm text-on-surface-30">~</span>
              <input
                type="date"
                value={pendingEndDate}
                onChange={(e) => setPendingEndDate(e.target.value)}
                className="h-9 flex-1 rounded-md border border-border-10 px-3 text-sm"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-divider-10 px-5 py-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setPendingStartDate(startDate);
                setPendingEndDate(endDate);
                setDatePickerOpen(false);
              }}
            >
              취소
            </Button>
            <Button type="button" size="sm" onClick={applyCustomRange}>
              적용
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
