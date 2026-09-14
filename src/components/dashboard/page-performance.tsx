"use client";

import Link from "next/link";

import { ReportingPeriodSelect } from "@/components/reporting/reporting-period-select";
import { Badge } from "@/components/ui/badge";
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
  getDashboardSnapshot,
  getPagePerformance,
  organizationScopeLabel,
} from "@/lib/mock-dashboard";
import { partnerQuery, type PartnerContext } from "@/lib/partner-context";
import { donationsHref } from "@/lib/reporting-links";
import { usePartnerPages } from "@/lib/use-partner-pages";
import { useReportingPeriod } from "@/lib/use-reporting-period";

export function PagePerformance({
  context,
  schoolName,
}: {
  context: PartnerContext;
  schoolName: string;
}) {
  const { period, setPeriod } = useReportingPeriod();
  const snapshot = getDashboardSnapshot(period);
  const { pages } = usePartnerPages();
  const rows = getPagePerformance(snapshot, pages);
  const query = partnerQuery(context);
  const scopeType = organizationScopeLabel(context.type);

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] leading-[34px] font-medium tracking-[0.42px] text-foreground">
            Page Performance
          </h1>
          <p className="text-sm tracking-[0.07px] text-muted-foreground">
            {schoolName} · {scopeType}
          </p>
          <p className="text-xs tracking-[0.12px] text-muted-foreground">
            {snapshot.periodLabel} · {snapshot.rangeLabel}
          </p>
        </div>
        <ReportingPeriodSelect value={period} onValueChange={setPeriod} />
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-0">Page</TableHead>
            <TableHead>Current status</TableHead>
            <TableHead className="text-right">Amount raised</TableHead>
            <TableHead className="text-right">Number of gifts</TableHead>
            <TableHead className="px-0 text-right">
              <span className="sr-only">View page donations</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.page.id} className="hover:bg-transparent">
              <TableCell className="px-0">
                <Link
                  href={donationsHref(query, row.page.id)}
                  className="font-medium underline-offset-3 hover:underline"
                >
                  {row.page.name}
                </Link>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className="h-auto rounded-[4px] border border-border px-3 py-1 text-xs font-normal tracking-[0.12px]"
                >
                  {row.page.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {formatDashboardMoney(row.amount)}
              </TableCell>
              <TableCell className="text-right">
                {formatDashboardCount(row.gifts)}
              </TableCell>
              <TableCell className="px-0 text-right">
                <Button asChild variant="outline" size="sm">
                  <Link href={donationsHref(query, row.page.id)}>
                    View page donations
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
