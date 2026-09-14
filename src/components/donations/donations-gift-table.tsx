"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDashboardMoney } from "@/lib/mock-dashboard";
import {
  formatGiftDate,
  giftContactLines,
  type SchoolGift,
} from "@/lib/mock-donations";

export function DonationsGiftTable({
  gifts,
  selectedGiftId,
  onSelectGift,
}: {
  gifts: SchoolGift[];
  selectedGiftId?: string;
  onSelectGift: (gift: SchoolGift) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="px-0">Amount</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Donation source</TableHead>
          <TableHead>Fundraising page</TableHead>
          <TableHead className="px-0">Donor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {gifts.map((gift) => {
          const contact = giftContactLines(gift);
          const selected = selectedGiftId === gift.id;
          return (
            <TableRow
              key={gift.id}
              data-state={selected ? "selected" : undefined}
              className="cursor-pointer"
              onClick={() => onSelectGift(gift)}
            >
              <TableCell className="px-0 font-medium">
                <button
                  type="button"
                  className="text-left font-medium underline-offset-3 hover:underline"
                  aria-label={`View donation of ${formatDashboardMoney(gift.amount)}`}
                >
                  {formatDashboardMoney(gift.amount)}
                </button>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatGiftDate(gift.date)}
              </TableCell>
              <TableCell>{gift.giftType}</TableCell>
              <TableCell>{gift.status}</TableCell>
              <TableCell>{gift.source}</TableCell>
              <TableCell>{gift.page}</TableCell>
              <TableCell className="px-0 whitespace-normal">
                {contact.length > 0 ? (
                  <div className="flex flex-col gap-0.5">
                    {contact.map((line, index) => (
                      <span
                        key={`${gift.id}-${line}`}
                        className={
                          index === 0 && gift.donorName
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
