"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ICONS } from "@/lib/icons";
import { AppShell } from "@/components/layout/AppShell";
import {
  PAGE_CONTAINER_CLASS,
  PAGE_FLUSH_CONTENT_PAD_X_CLASS,
  PAGE_GUTTER_GAP_CLASS,
  PAGE_SCROLL_ROOT_CLASS,
  PAGE_SCROLL_ROOT_MOBILE_FLUSH_CLASS,
  PAGE_STACK_CLASS,
  PAGE_SUBHEADER_WITH_STICKY_CLASS,
} from "@/lib/page-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "design-system/ui/button";
import { Input } from "@/components/ui/input";
import { Badge, badgeVariants } from "design-system/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import type { VariantProps } from "class-variance-authority";
import { CHIP_COMPANION_CONTROL_CLASS, CHIP_GROUP_GAP_CLASS } from "@/lib/chip-styles";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  ModalFooterButtons,
  ModalHeader,
  modalDialogContentClassName,
} from "@/components/ui/modal";
import { AnalyticsPanel } from "@/components/analytics/AnalyticsPanel";
import { Title2 } from "@/components/ui/title2";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination } from "@/components/episode/Pagination";
import { cn } from "design-system/utils";

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

const RANGE_PRESET_OPTIONS: ReadonlyArray<{ value: Exclude<RangePreset, "custom">; label: string }> = [
  { value: "all", label: "전체 기간" },
  { value: "1m", label: "1개월" },
  { value: "3m", label: "3개월" },
  { value: "6m", label: "6개월" },
  { value: "ytd", label: "올해" },
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

/** 모바일 정산 카드 — `26.06.01` */
function formatSettlementMobileDate(date: Date): string {
  const y = String(date.getFullYear()).slice(2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

function toInputDateValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatRangeLabel(startDate: string, endDate: string, compact = false): string {
  if (!startDate || !endDate) return "날짜 선택";
  const formatPart = (iso: string) => {
    const dotted = iso.replaceAll("-", ".");
    if (!compact) return dotted;
    const [year, month, day] = iso.split("-");
    if (!year || !month || !day) return dotted;
    return `${year.slice(2)}.${month}.${day}`;
  };
  return `${formatPart(startDate)} ~ ${formatPart(endDate)}`;
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

function settlementStatusBadgeProps(status: SettlementStatus): {
  variant: NonNullable<VariantProps<typeof badgeVariants>["variant"]>;
  status: NonNullable<VariantProps<typeof badgeVariants>["status"]>;
} {
  if (status === "completed") return { variant: "default", status: "default" };
  if (status === "reviewing") return { variant: "secondary", status: "default" };
  if (status === "waiting") return { variant: "outline", status: "default" };
  return { variant: "default", status: "destructive" };
}

function SettlementStatusBadge({
  status,
  rejectionReason,
  onRejectionReason,
}: {
  status: SettlementStatus;
  rejectionReason?: string | null;
  onRejectionReason?: () => void;
}) {
  const label = getSettlementStatusLabel(status);
  const badgeProps = settlementStatusBadgeProps(status);

  if (status === "rejected" && rejectionReason && onRejectionReason) {
    return (
      <Badge
        variant="default"
        status="destructive"
        shape="square"
        size="md"
        render={<button type="button" />}
        className="max-w-full"
        title={`반려 사유: ${rejectionReason}`}
        aria-label={`반려 사유 확인: ${rejectionReason}`}
        onClick={onRejectionReason}
      >
        <span className="truncate">{label}</span>
        <ICONS.alertCircle className="size-4 shrink-0" aria-hidden />
      </Badge>
    );
  }

  return (
    <Badge
      variant={badgeProps.variant}
      status={badgeProps.status}
      shape="square"
      size="md"
      className="max-w-full"
    >
      <span className="truncate">{label}</span>
    </Badge>
  );
}

function SettlementSummaryCard({
  title,
  amount,
}: {
  title: string;
  amount: number;
}) {
  return (
    <div className="flex h-[80px] w-full min-w-0 flex-col justify-center gap-1 rounded-sm border border-border bg-background px-5 max-lg:py-0 lg:min-h-0 lg:h-auto lg:flex-1 lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:py-5">
      <p className="min-w-0 text-body3_400 text-foreground-muted lg:shrink">{title}</p>
      <div className="inline-flex min-w-0 flex-wrap items-baseline gap-x-1 gap-y-0 tabular-nums">
        <p className="text-heading4_700 text-foreground lg:text-heading2_700">{formatAmount(amount)}</p>
        <p className="text-heading4_700 text-foreground lg:text-heading2_700">원</p>
      </div>
    </div>
  );
}

/**
 * 데스크톱 표: 상태 열은 행 너비의 15%, 나머지(80px 액션 제외)는 2.5fr·1fr×4로 분배.
 */
const SETTLEMENT_TABLE_GRID_CLASS =
  "grid w-full min-w-0 grid-cols-[minmax(0,15%)_minmax(0,2.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,min(100%,80px))] gap-x-0";

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
    <div className={cn(SETTLEMENT_TABLE_GRID_CLASS, "min-h-16 items-center px-5 py-2 sm:min-h-20")}>
      <div className="flex min-w-0 items-center">
        <SettlementStatusBadge
          status={item.status}
          rejectionReason={item.rejectionReason}
          onRejectionReason={onRejectionReason}
        />
      </div>
      <div className="flex min-w-0 items-center gap-0.5 tabular-nums">
        <p className="truncate text-body2_700 text-foreground">{item.revenueAmount}</p>
        <p className="shrink-0 text-body2_400 text-foreground-muted">원</p>
      </div>
      <div className="min-w-0 truncate text-body2_400 text-foreground-muted">{item.requestedAt}</div>
      <div className="min-w-0 truncate text-body2_400 text-foreground-muted">{item.payoutDueAt}</div>
      <div className="flex min-w-0 items-center gap-0.5 tabular-nums">
        <p className="truncate text-body2_400 text-foreground-muted">{item.vatAmount}</p>
        <p className="shrink-0 text-body2_400 text-foreground-muted">원</p>
      </div>
      <div className="flex min-w-0 items-center gap-0.5 tabular-nums">
        <p className="truncate text-body2_400 text-foreground-muted">{item.settlementAmount}</p>
        <p className="shrink-0 text-body2_400 text-foreground-muted">원</p>
      </div>
      <div className="flex min-w-0 items-center justify-end">
        {item.status === "completed" ? (
          <IconButton
            type="button"
            variant="ghost"
            shape="circle"
            size="icon"
            icon={ICONS.fileText}
            onClick={onTaxDetail}
            aria-label="세금 계산 상세 보기"
          />
        ) : (
          <span aria-hidden className="size-9" />
        )}
      </div>
    </div>
  );
}

function SettlementMobileFieldRow({
  label,
  value,
  variant = "secondary",
}: {
  label: string;
  value: string;
  variant?: "revenue" | "secondary";
}) {
  const labelClassName =
    variant === "revenue"
      ? "text-body1_700 text-foreground-muted"
      : "text-body3_400 text-foreground-muted";
  const valueClassName =
    variant === "revenue"
      ? "text-body1_700 text-foreground"
      : "text-body3_500 text-foreground-muted";

  return (
    <div className="flex items-center justify-between gap-3 self-stretch">
      <span className={cn("shrink-0", labelClassName)}>{label}</span>
      <span className={cn("min-w-0 truncate text-right tabular-nums", valueClassName)}>{value}</span>
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
    <div className="rounded-md border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <SettlementStatusBadge
            status={item.status}
            rejectionReason={item.rejectionReason}
            onRejectionReason={onRejectionReason}
          />
        </div>
        {item.status === "completed" ? (
          <IconButton
            type="button"
            variant="ghost"
            shape="circle"
            size="icon"
            icon={ICONS.fileText}
            onClick={onTaxDetail}
            aria-label="세금 계산 상세 보기"
          />
        ) : null}
      </div>

      <div className="mt-3 flex flex-col gap-2 self-stretch">
        <SettlementMobileFieldRow
          label="수익금"
          value={`${item.revenueAmount}원`}
          variant="revenue"
        />
        <SettlementMobileFieldRow label="부가세" value={`${item.vatAmount}원`} />
        <SettlementMobileFieldRow label="실지급액" value={`${item.settlementAmount}원`} />
        <div className="my-2 h-px w-full bg-divider" aria-hidden />
        <SettlementMobileFieldRow
          label="신청일"
          value={formatSettlementMobileDate(item.requestedDate)}
        />
        <SettlementMobileFieldRow
          label="지급 예정일"
          value={formatSettlementMobileDate(item.payoutDueDate)}
        />
      </div>
    </div>
  );
}

export default function MonetizationSettlementsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [taxDetailTarget, setTaxDetailTarget] = useState<SettlementItem | null>(null);
  const [rejectionReasonTarget, setRejectionReasonTarget] = useState<SettlementItem | null>(null);
  const [rangePreset, setRangePreset] = useState<RangePreset>("all");
  const initialEndDate = toInputDateValue(new Date(2026, 4, 29));
  const initialStartDate = toInputDateValue(new Date(2024, 4, 29));
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [pendingStartDate, setPendingStartDate] = useState(initialStartDate);
  const [pendingEndDate, setPendingEndDate] = useState(initialEndDate);

  const rangeLabel = useMemo(() => formatRangeLabel(startDate, endDate), [startDate, endDate]);
  const rangeLabelCompact = useMemo(
    () => formatRangeLabel(startDate, endDate, true),
    [startDate, endDate],
  );

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
        const dateMatched =
          (!start || item.requestedDate >= start) &&
          (!end || item.requestedDate <= end) &&
          item.payoutDueDate >= item.requestedDate;
        return dateMatched;
      })
      .sort((a, b) => b.requestedDate.getTime() - a.requestedDate.getTime());
  }, [endDate, startDate]);

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
    <AppShell sidebarActiveId="settlements">
      <div className={PAGE_SUBHEADER_WITH_STICKY_CLASS}>
          <div className={`${PAGE_CONTAINER_CLASS} flex items-center justify-start gap-4`}>
            <h1 className="text-heading2_700 text-foreground">정산</h1>
          </div>
        </div>

        <div
          className={cn(
            PAGE_SCROLL_ROOT_CLASS,
            PAGE_SCROLL_ROOT_MOBILE_FLUSH_CLASS,
            "items-stretch justify-start gap-0",
          )}
        >
          <div className={PAGE_STACK_CLASS}>
                <AnalyticsPanel>
                  <Title2
                    text="정산 요약"
                    variant="title"
                    asSectionHeader
                    sectionEnd={
                      <Button
                        variant="outline"
                        size="sm"
                        render={<Link href="/analytics?area=revenue" />}
                        nativeButton={false}
                      >
                        수익 분석
                      </Button>
                    }
                  />
                  <div className={cn("flex flex-col p-5", PAGE_GUTTER_GAP_CLASS)}>
                    <div className="flex flex-col gap-3 rounded-sm bg-background-muted p-5 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:p-10">
                      <div className={cn("flex flex-col items-start justify-start mb-5", PAGE_GUTTER_GAP_CLASS)}>
                        <p className="text-body3_700 text-foreground-muted">지금 출금 가능한 금액</p>
                        <div className="flex flex-col items-start gap-2">
                          <div className="inline-flex items-center gap-1">
                            <p className="text-heading1_700 text-foreground">
                              {formatAmount(SETTLEMENT_SUMMARY.availableAmount)}
                            </p>
                            <p className="text-heading1_700 text-foreground">원</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <p className="text-body3_400 text-foreground-muted">
                              {SETTLEMENT_SUMMARY.bankAccountMasked}
                            </p>
                            <div className="h-4 w-px bg-border" />
                            <p className="text-body3_400 text-foreground-muted">
                              {SETTLEMENT_SUMMARY.depositor}
                            </p>
                            <button
                              type="button"
                              onClick={() => router.push("/profile?tab=settlement")}
                              className="inline-flex items-center gap-1 text-body3_500 text-foreground-muted underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-sm"
                            >
                              계좌 변경
                            </button>
                          </div>
                        </div>
                      </div>
                      <Button type="button" className="h-[42px] min-w-24 rounded-md px-4 text-body1_400">
                        출금 신청
                      </Button>
                    </div>

                    <div className={cn("flex w-full min-w-0 flex-col items-stretch lg:flex-row lg:items-stretch", PAGE_GUTTER_GAP_CLASS)}>
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

                <AnalyticsPanel>
                  <div className="px-5 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-heading5_700 text-foreground">정산 내역</h3>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
                      <div
                        className={cn(
                          "flex min-w-0 flex-wrap items-center",
                          CHIP_GROUP_GAP_CLASS,
                        )}
                      >
                        <Tabs
                          value={rangePreset === "custom" ? "" : rangePreset}
                          onValueChange={(v) => applyPresetRange(v as Exclude<RangePreset, "custom">)}
                        >
                          <TabsList variant="default" size="sm" aria-label="정산 내역 조회 기간">
                            {RANGE_PRESET_OPTIONS.map(({ value, label }) => (
                              <TabsTrigger key={value} value={value}>{label}</TabsTrigger>
                            ))}
                          </TabsList>
                        </Tabs>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className={cn(
                            CHIP_COMPANION_CONTROL_CLASS,
                            "min-w-0 max-w-full flex-1 justify-between sm:min-w-[200px] sm:max-w-[min(100%,320px)]",
                          )}
                          onClick={() => setDatePickerOpen(true)}
                        >
                          <span className="truncate max-lg:inline lg:hidden">{rangeLabelCompact}</span>
                          <span className="hidden truncate lg:inline">{rangeLabel}</span>
                          <ICONS.calendarDays className="h-4 w-4 shrink-0 text-foreground-placeholder" aria-hidden />
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="min-w-0 shrink"
                        onClick={handleDownloadCsv}
                      >
                        <ICONS.download className="h-4 w-4 shrink-0" aria-hidden />
                        <span className="truncate">내역 저장</span>
                      </Button>
                    </div>
                  </div>
                  <div className="w-full min-w-0">
                    {pagedSettlementItems.length === 0 ? (
                      <div className="px-5 py-10 text-center text-body3_400 text-foreground-placeholder">
                        조건에 맞는 정산 내역이 없어요. 기간을 다시 선택해 주세요.
                      </div>
                    ) : (
                      <>
                        {/* xl 미만·사이드바 포함 폭에서는 표 대신 카드로 가로 스크롤 없이 표시 */}
                        <div className="mb-5 flex flex-col gap-4 bg-background px-5 py-0 xl:hidden">
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
                              "items-center border-b border-divider bg-background px-5 py-3",
                            )}
                          >
                            <div className="min-w-0 truncate text-caption1_400 text-foreground-placeholder">상태</div>
                            <div className="min-w-0 truncate text-caption1_400 text-foreground-placeholder">수익금</div>
                            <div className="min-w-0 truncate text-caption1_400 text-foreground-placeholder">신청일</div>
                            <div className="min-w-0 truncate text-caption1_400 text-foreground-placeholder">지급 예정일</div>
                            <div className="min-w-0 truncate text-caption1_400 text-foreground-placeholder">부가세</div>
                            <div className="min-w-0 truncate text-caption1_400 text-foreground-placeholder">실지급액</div>
                            <div className="min-w-0 truncate text-right text-caption1_400 text-foreground-placeholder">세금 상세</div>
                          </div>

                          {pagedSettlementItems.map((item, idx) => (
                            <React.Fragment key={item.id}>
                              <SettlementRowDesktop
                                item={item}
                                onTaxDetail={() => setTaxDetailTarget(item)}
                                onRejectionReason={() => setRejectionReasonTarget(item)}
                              />
                              {idx < pagedSettlementItems.length - 1 ? (
                                <div className="px-5">
                                  <div className="h-px w-full bg-divider" />
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
                    className="rounded-b-sm border-t border-divider"
                  />
                </AnalyticsPanel>
              </div>
            </div>
      <Dialog open={!!taxDetailTarget} onOpenChange={(open) => !open && setTaxDetailTarget(null)}>
        <DialogContent className="w-full max-lg:max-w-none lg:w-[560px] lg:max-w-[calc(100vw-2rem)] max-lg:rounded-t-xl max-lg:rounded-b-none lg:rounded-sm border border-border bg-background p-0">
          <div className="border-b border-divider px-6 py-4">
            <DialogTitle className="text-heading5_700 text-foreground">
              세금 계산 내역
            </DialogTitle>
            <p className="mt-1 text-body3_400 text-foreground-placeholder">정산 계산과 증빙 준비 상태를 확인해 주세요.</p>
          </div>
          {taxDetailTarget ? (
            <>
              <div className="space-y-4 px-6 py-5 text-body3_400 text-foreground-muted">
                <section className="rounded-sm border border-border bg-background px-4 py-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-foreground-placeholder">과세 대상 금액</p>
                      <p className="font-semibold text-foreground">{taxDetailTarget.revenueAmount}원</p>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-foreground-placeholder">부가세 (10%)</p>
                      <p className="font-semibold text-foreground">{taxDetailTarget.vatAmount}원</p>
                    </div>
                    <div className="h-px bg-divider" />
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-body3_700 text-foreground-muted">실지급액</p>
                      <p className="text-heading5_700 text-foreground">{taxDetailTarget.settlementAmount}원</p>
                    </div>
                  </div>
                </section>

                <section className="rounded-sm border border-border bg-background px-4 py-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-caption1_400 text-foreground-placeholder">세금계산서 번호</p>
                      <p className="text-body3_500 text-foreground">{taxDetailTarget.invoiceNumber}</p>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-caption1_400 text-foreground-placeholder">발행일</p>
                      <p className="text-body3_500 text-foreground">{taxDetailTarget.invoiceIssuedAt}</p>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-caption1_400 text-foreground-placeholder">공급자 등록번호</p>
                      <p className="text-body3_500 text-foreground">{taxDetailTarget.supplierBizNumber}</p>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-caption1_400 text-foreground-placeholder">공급받는자 등록번호</p>
                      <p className="text-body3_500 text-foreground">{taxDetailTarget.buyerBizNumber}</p>
                    </div>
                  </div>
                </section>

                {!getTaxInvoiceCompleteness(taxDetailTarget) ? (
                  <Alert variant="destructive" className="border-destructive/30 bg-destructive/10 px-3 py-2 rounded-sm">
                    <AlertDescription className="text-caption1_400 text-destructive">
                      필수 증빙 항목이 일부 누락되었거나 검증이 완료되지 않았어요. 발행 정보와 검증 상태를 확인해 주세요.
                    </AlertDescription>
                  </Alert>
                ) : null}
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-divider px-6 py-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 border-border bg-background hover:bg-muted"
                  onClick={() => handleDownloadSingleSettlementCsv(taxDetailTarget)}
                >
                  <ICONS.download className="h-4 w-4" aria-hidden />
                  이 내역 다운로드
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="h-8"
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
        <DialogContent presentation="center" className={modalDialogContentClassName}>
          <ModalHeader title="반려 사유" />
          {rejectionReasonTarget ? (
            <>
              <div className="px-6 pb-4">
                <p className="text-body3_400 text-foreground-muted">{rejectionReasonTarget.rejectionReason}</p>
                <p className="mt-2 text-caption1_400 text-foreground-placeholder">
                  신청일 {rejectionReasonTarget.requestedAt} · 상태 {getSettlementStatusLabel(rejectionReasonTarget.status)}
                </p>
              </div>
              <ModalFooterButtons
                layout="end"
                trailingButtons={[
                  {
                    label: "확인",
                    tone: "primary",
                    closeOnSelect: true,
                  },
                ]}
              />
            </>
          ) : null}
        </DialogContent>
      </Dialog>
      <Dialog open={datePickerOpen} onOpenChange={setDatePickerOpen}>
        <DialogContent className="w-full max-lg:max-w-none lg:w-[420px] lg:max-w-[calc(100vw-2rem)] max-lg:rounded-t-xl max-lg:rounded-b-none lg:rounded-sm border border-border bg-background p-0">
          <div className="border-b border-divider px-5 py-3">
            <DialogTitle className="text-body1_700 text-foreground">기간 선택</DialogTitle>
            <p className="mt-1 text-body3_400 text-foreground-placeholder">조회할 신청일 기간을 설정해 주세요.</p>
          </div>
          <div className="px-5 py-4">
            <div className="flex items-center gap-2">
              <Input
                type="date"
                size="sm"
                value={pendingStartDate}
                onChange={(e) => setPendingStartDate(e.target.value)}
                className="flex-1"
              />
              <span className="text-body3_400 text-foreground-placeholder">~</span>
              <Input
                type="date"
                size="sm"
                value={pendingEndDate}
                onChange={(e) => setPendingEndDate(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          <ModalFooterButtons
            layout="end"
            trailingButtons={[
              {
                label: "취소",
                onClick: () => {
                  setPendingStartDate(startDate);
                  setPendingEndDate(endDate);
                  setDatePickerOpen(false);
                },
              },
              { label: "적용", tone: "primary", onClick: applyCustomRange },
            ]}
          />
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
