"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ExportCsvDialog({
  open,
  onOpenChange,
  organization,
  period,
  amountRange,
  page,
  sort,
  onDownload,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization: string;
  period: string;
  amountRange: string;
  page: string;
  sort: string;
  onDownload: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[4px] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Export CSV</DialogTitle>
          <DialogDescription>
            This export uses the currently selected organization, period, and
            filters.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Summary label="Organization" value={organization} />
          <Summary label="Period" value={period} />
          <Summary label="Amount range" value={amountRange} />
          <Summary label="Page" value={page} />
          <Summary label="Sort" value={sort} />
        </div>
        <DialogFooter>
          <Button type="button" onClick={onDownload}>
            Download CSV
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs tracking-[0.12px] text-muted-foreground">{label}</p>
      <p className="text-sm tracking-[0.07px] text-foreground">{value}</p>
    </div>
  );
}
