"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Check } from "lucide-react";

import { DonationDetailSheet } from "@/components/donations/donation-detail-sheet";
import { DonationsGiftTable } from "@/components/donations/donations-gift-table";
import { ExportCsvDialog } from "@/components/donations/export-csv-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formatDashboardMoney,
  organizationScopeLabel,
} from "@/lib/mock-dashboard";
import {
  DONATION_SORTS,
  DONATIONS_PAGE_SIZE,
  filterSchoolGifts,
  formatGiftDate,
  giftsForSchool,
  isDonationSort,
  parseAmountFilter,
  sortSchoolGifts,
  type DonationSort,
  type SchoolGift,
} from "@/lib/mock-donations";
import { partnerQuery, type PartnerContext } from "@/lib/partner-context";
import { dashboardHref, donationsHref } from "@/lib/reporting-links";
import { usePartnerPages } from "@/lib/use-partner-pages";

export function PartnerDonations({
  context,
  schoolName,
  pageId,
}: {
  context: PartnerContext;
  schoolName: string;
  pageId?: string;
}) {
  const router = useRouter();
  const { pages } = usePartnerPages();
  const query = partnerQuery(context);
  const selectedPage = pages.find((page) => page.id === pageId);
  const scopeType = organizationScopeLabel(context.type);

  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sort, setSort] = useState<DonationSort>("date-desc");
  const [visibleCount, setVisibleCount] = useState(DONATIONS_PAGE_SIZE);
  const [selectedGift, setSelectedGift] = useState<SchoolGift | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState(false);
  const downloadNoticeTimerRef = useRef<number | null>(null);

  const filteredGifts = useMemo(() => {
    const named = giftsForSchool(context.school).map((gift) => ({
      ...gift,
      page: pages.find((page) => page.id === gift.pageId)?.name ?? gift.page,
    }));
    return sortSchoolGifts(
      filterSchoolGifts(named, {
        pageId: selectedPage?.id,
        minAmount: parseAmountFilter(minAmount),
        maxAmount: parseAmountFilter(maxAmount),
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
      }),
      sort,
    );
  }, [
    context.school,
    fromDate,
    maxAmount,
    minAmount,
    pages,
    selectedPage?.id,
    sort,
    toDate,
  ]);

  useEffect(() => {
    setVisibleCount(DONATIONS_PAGE_SIZE);
  }, [fromDate, maxAmount, minAmount, selectedPage?.id, sort, toDate]);

  useEffect(() => {
    return () => {
      if (downloadNoticeTimerRef.current !== null) {
        window.clearTimeout(downloadNoticeTimerRef.current);
      }
    };
  }, []);

  const visibleGifts = filteredGifts.slice(0, visibleCount);
  const remaining = filteredGifts.length - visibleGifts.length;
  const sortLabel =
    DONATION_SORTS.find((option) => option.value === sort)?.label ?? sort;

  function selectPage(nextPageId: string) {
    router.replace(
      donationsHref(query, nextPageId === "all" ? undefined : nextPageId),
    );
  }

  function showDownloadStarted() {
    if (downloadNoticeTimerRef.current !== null) {
      window.clearTimeout(downloadNoticeTimerRef.current);
    }
    setDownloadNotice(true);
    downloadNoticeTimerRef.current = window.setTimeout(() => {
      setDownloadNotice(false);
    }, 4000);
  }

  function confirmDownload() {
    setExportOpen(false);
    showDownloadStarted();
  }

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] leading-[34px] font-medium tracking-[0.42px] text-foreground">
            Donations
          </h1>
          <p className="text-sm tracking-[0.07px] text-muted-foreground">
            {schoolName} · {scopeType}
            {selectedPage ? ` · ${selectedPage.name}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <p
            aria-live="polite"
            className="flex min-h-7 shrink-0 items-center gap-1 text-sm tracking-[0.07px] text-emerald-800"
          >
            {downloadNotice ? (
              <>
                <Check className="size-4" aria-hidden />
                Download started
              </>
            ) : null}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => setExportOpen(true)}
          >
            Export CSV
          </Button>
          <Button asChild variant="outline">
            <Link href={dashboardHref(query)}>Dashboard</Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-end gap-3">
          <FilterGroup label="Amount range">
            <Input
              id="donations-min-amount"
              className="w-[110px]"
              inputMode="decimal"
              placeholder="Min"
              aria-label="Minimum amount"
              value={minAmount}
              onChange={(event) => setMinAmount(event.target.value)}
            />
            <span className="text-sm text-muted-foreground">–</span>
            <Input
              id="donations-max-amount"
              className="w-[110px]"
              inputMode="decimal"
              placeholder="Max"
              aria-label="Maximum amount"
              value={maxAmount}
              onChange={(event) => setMaxAmount(event.target.value)}
            />
          </FilterGroup>
          <FilterGroup label="Date range">
            <Input
              id="donations-from-date"
              className="w-[150px]"
              type="date"
              aria-label="From date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
            />
            <span className="text-sm text-muted-foreground">–</span>
            <Input
              id="donations-to-date"
              className="w-[150px]"
              type="date"
              aria-label="To date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
            />
          </FilterGroup>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <FilterGroup label="Page">
            <Select
              value={selectedPage?.id ?? "all"}
              onValueChange={selectPage}
            >
              <SelectTrigger
                id="donations-page"
                className="w-[220px]"
                aria-label="Page"
              >
                <SelectValue placeholder="All pages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All pages</SelectItem>
                {pages.map((page) => (
                  <SelectItem key={page.id} value={page.id}>
                    {page.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterGroup>
          <FilterGroup label="Sort">
            <Select
              value={sort}
              onValueChange={(value) => {
                if (isDonationSort(value)) {
                  setSort(value);
                }
              }}
            >
              <SelectTrigger
                id="donations-sort"
                className="w-[200px]"
                aria-label="Sort"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DONATION_SORTS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterGroup>
        </div>
      </div>

      {visibleGifts.length > 0 ? (
        <div className="flex flex-col gap-6">
          <DonationsGiftTable
            gifts={visibleGifts}
            selectedGiftId={selectedGift?.id}
            onSelectGift={setSelectedGift}
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm tracking-[0.07px] text-muted-foreground">
              Showing {visibleGifts.length} of {filteredGifts.length}
            </p>
            {remaining > 0 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setVisibleCount((count) => count + DONATIONS_PAGE_SIZE)
                }
              >
                Load more
              </Button>
            ) : null}
          </div>
        </div>
      ) : (
        <p className="text-sm tracking-[0.07px] text-muted-foreground">
          No donations match these filters.
        </p>
      )}
      <DonationDetailSheet
        gift={selectedGift}
        schoolName={schoolName}
        email={context.email}
        onClose={() => setSelectedGift(null)}
      />
      <ExportCsvDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        organization={`${schoolName} · ${scopeType}`}
        period={periodSummary(fromDate, toDate)}
        amountRange={amountRangeSummary(minAmount, maxAmount)}
        page={selectedPage?.name ?? "All pages"}
        sort={sortLabel}
        onDownload={confirmDownload}
      />
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const labelId = `donations-filter-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="flex flex-col gap-1.5">
      <p
        id={labelId}
        className="text-xs tracking-[0.12px] text-muted-foreground"
      >
        {label}
      </p>
      <div
        className="flex items-center gap-2"
        role="group"
        aria-labelledby={labelId}
      >
        {children}
      </div>
    </div>
  );
}

function periodSummary(fromDate: string, toDate: string) {
  if (fromDate && toDate) {
    return `${formatGiftDate(fromDate)} – ${formatGiftDate(toDate)}`;
  }
  if (fromDate) {
    return `From ${formatGiftDate(fromDate)}`;
  }
  if (toDate) {
    return `Through ${formatGiftDate(toDate)}`;
  }
  return "All dates";
}

function amountRangeSummary(minAmount: string, maxAmount: string) {
  const min = parseAmountFilter(minAmount);
  const max = parseAmountFilter(maxAmount);
  if (min !== undefined && max !== undefined) {
    return `${formatDashboardMoney(min)} – ${formatDashboardMoney(max)}`;
  }
  if (min !== undefined) {
    return `${formatDashboardMoney(min)} and up`;
  }
  if (max !== undefined) {
    return `Up to ${formatDashboardMoney(max)}`;
  }
  return "All amounts";
}
