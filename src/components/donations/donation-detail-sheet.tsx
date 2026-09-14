"use client";

import { type ReactNode } from "react";

import { NeedHelp } from "@/components/help/need-help";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatDashboardMoney } from "@/lib/mock-dashboard";
import {
  formatGiftDateTime,
  giftContactLines,
  type SchoolGift,
} from "@/lib/mock-donations";

export function DonationDetailSheet({
  gift,
  schoolName,
  email,
  onClose,
}: {
  gift: SchoolGift | null;
  schoolName: string;
  email: string;
  onClose: () => void;
}) {
  const contact = gift ? giftContactLines(gift) : [];
  const adjustment = gift?.relatedAdjustment;

  return (
    <Sheet open={gift !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full gap-0 p-0 sm:max-w-[420px]"
      >
        {gift ? (
          <div className="flex h-full flex-col">
            <SheetHeader className="gap-4 border-b border-border p-6">
              <Button
                type="button"
                variant="outline"
                className="w-fit"
                onClick={onClose}
              >
                Back to donations
              </Button>
              <div className="flex flex-col gap-1">
                <SheetTitle className="text-[21px] leading-[28px] font-medium tracking-[0.07px]">
                  {formatDashboardMoney(gift.amount)}
                </SheetTitle>
                <SheetDescription>
                  {formatGiftDateTime(gift)} · {gift.status}
                </SheetDescription>
              </div>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
              <Detail label="Donation amount">
                {formatDashboardMoney(gift.amount)}
              </Detail>
              <Detail label="Date and time">{formatGiftDateTime(gift)}</Detail>
              <Detail label="Current status">{gift.status}</Detail>
              <Detail label="Cadence">{gift.giftType}</Detail>
              <Detail label="School or Network">
                {schoolName} · {gift.organizationType}
              </Detail>
              <Detail label="Fundraising page">{gift.page}</Detail>
              <Detail label="Donation source">{gift.source}</Detail>
              {gift.schoolPreference ? (
                <Detail label="School preference">{gift.schoolPreference}</Detail>
              ) : null}
              <Detail label="Donor">
                {contact.length > 0 ? (
                  <span className="flex flex-col gap-0.5">
                    {contact.map((line) => (
                      <span key={`${gift.id}-${line}`}>{line}</span>
                    ))}
                  </span>
                ) : (
                  "No donor contact details are available to this partner."
                )}
              </Detail>
              {adjustment ? (
                <>
                  <Separator />
                  <Detail label={`Related ${adjustment.kind.toLowerCase()}`}>
                    <span className="flex flex-col gap-1">
                      <span>
                        {formatDashboardMoney(adjustment.amount)} ·{" "}
                        {formatGiftDateTime(adjustment)}
                      </span>
                      {adjustment.note ? (
                        <span className="text-muted-foreground">
                          {adjustment.note}
                        </span>
                      ) : null}
                    </span>
                  </Detail>
                </>
              ) : null}
            </div>

            <SheetFooter className="border-t border-border p-6">
              <NeedHelp
                email={email}
                label="Get help with this donation"
                variant="outline"
                idPrefix={`donation-${gift.id}`}
                overlayClassName="z-[70]"
                contentClassName="z-[70]"
              />
            </SheetFooter>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function Detail({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs tracking-[0.12px] text-muted-foreground">{label}</p>
      <div className="text-sm tracking-[0.07px] text-foreground">{children}</div>
    </div>
  );
}
