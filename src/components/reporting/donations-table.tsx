"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatDashboardMoney,
  type DashboardGift,
} from "@/lib/mock-dashboard";

export function DonationsTable({ gifts }: { gifts: DashboardGift[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="px-0">Date</TableHead>
          <TableHead>Donor</TableHead>
          <TableHead>Page</TableHead>
          <TableHead className="px-0 text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {gifts.map((gift) => (
          <TableRow key={gift.id} className="hover:bg-transparent">
            <TableCell className="px-0 text-muted-foreground">
              {gift.date}
            </TableCell>
            <TableCell>{gift.donor}</TableCell>
            <TableCell>{gift.page}</TableCell>
            <TableCell className="px-0 text-right">
              {formatDashboardMoney(gift.amount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
