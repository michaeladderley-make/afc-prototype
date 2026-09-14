"use client";

import Link from "next/link";

import { DashboardSubnav } from "@/components/dashboard/dashboard-subnav";
import { PagePerformance } from "@/components/dashboard/page-performance";
import { DonationsTable } from "@/components/reporting/donations-table";
import { ReportingPeriodSelect } from "@/components/reporting/reporting-period-select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatDashboardCount,
  formatDashboardMoney,
  getAverageGift,
  getDashboardSnapshot,
  organizationScopeLabel,
} from "@/lib/mock-dashboard";
import { partnerQuery, type PartnerContext } from "@/lib/partner-context";
import { donationsHref, type DashboardView } from "@/lib/reporting-links";
import { useReportingPeriod } from "@/lib/use-reporting-period";

export function PartnerDashboard({
  context,
  schoolName,
  view,
}: {
  context: PartnerContext;
  schoolName: string;
  view: DashboardView;
}) {
  const query = partnerQuery(context);

  return (
    <>
      <DashboardSubnav query={query} section={view} />
      {view === "performance" ? (
        <PagePerformance context={context} schoolName={schoolName} />
      ) : (
        <DashboardOverview context={context} schoolName={schoolName} />
      )}
    </>
  );
}

function DashboardOverview({
  context,
  schoolName,
}: {
  context: PartnerContext;
  schoolName: string;
}) {
  const { period, setPeriod } = useReportingPeriod();
  const snapshot = getDashboardSnapshot(period);
  const averageGift = getAverageGift(snapshot);
  const query = partnerQuery(context);
  const scopeType = organizationScopeLabel(context.type);
  const maxTrend = Math.max(...snapshot.trend.map((point) => point.amount), 1);

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-10">
      <section className="flex flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-[28px] leading-[34px] font-medium tracking-[0.42px] text-foreground">
              Dashboard
            </h1>
            <p className="text-sm tracking-[0.07px] text-muted-foreground">
              {schoolName} · {scopeType}
            </p>
            <p className="text-xs tracking-[0.12px] text-muted-foreground">
              {snapshot.periodLabel} · {snapshot.rangeLabel}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ReportingPeriodSelect value={period} onValueChange={setPeriod} />
            <Button asChild variant="outline">
              <Link href={donationsHref(query)}>View donations</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[4px] border border-border bg-border md:grid-cols-4">
          <Score
            label="Net amount raised"
            value={formatDashboardMoney(snapshot.netAmount)}
          />
          <Score
            label="Number of gifts"
            value={formatDashboardCount(snapshot.giftCount)}
          />
          <Score
            label="Unique donors"
            value={formatDashboardCount(snapshot.uniqueDonors)}
          />
          <Score
            label="Average gift"
            value={formatDashboardMoney(averageGift)}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-base font-medium tracking-[0.07px] text-foreground">
          Donation trend
        </h2>
        <div
          className="flex h-44 items-end gap-2 rounded-[4px] border border-border px-4 pb-3 pt-6"
          role="img"
          aria-label={`Donation trend for ${snapshot.periodLabel}`}
        >
          {snapshot.trend.map((point) => (
            <div
              key={point.label}
              className="flex min-w-0 flex-1 flex-col items-center gap-2"
            >
              <div className="flex h-32 w-full items-end">
                <div
                  className="w-full rounded-sm bg-foreground"
                  style={{
                    height: `${Math.max((point.amount / maxTrend) * 100, 4)}%`,
                  }}
                  title={formatDashboardMoney(point.amount)}
                />
              </div>
              <p className="truncate text-xs tracking-[0.12px] text-muted-foreground">
                {point.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-10 md:grid-cols-2">
        <section className="flex min-w-0 flex-col gap-4">
          <h2 className="text-base font-medium tracking-[0.07px] text-foreground">
            Donations
          </h2>
          <DonationsTable gifts={snapshot.gifts} />
        </section>

        <section className="flex min-w-0 flex-col gap-4">
          <h2 className="text-base font-medium tracking-[0.07px] text-foreground">
            Gifts by page
          </h2>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-0">Page</TableHead>
                <TableHead>Gifts</TableHead>
                <TableHead className="px-0 text-right">Net</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {snapshot.byPage.map((row) => (
                <TableRow key={row.pageId} className="hover:bg-transparent">
                  <TableCell className="px-0">{row.page}</TableCell>
                  <TableCell>{formatDashboardCount(row.gifts)}</TableCell>
                  <TableCell className="px-0 text-right">
                    {formatDashboardMoney(row.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </div>
    </div>
  );
}

function Score({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 bg-background px-5 py-4">
      <p className="text-xs tracking-[0.12px] text-muted-foreground">{label}</p>
      <p className="text-[21px] leading-[28px] font-medium tracking-[0.07px] text-foreground">
        {value}
      </p>
    </div>
  );
}
