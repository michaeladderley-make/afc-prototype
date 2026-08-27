"use client";

import { useState } from "react";
import { CircleCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { School } from "@/lib/mock-schools";

export function SchoolResultCard({
  school,
  selected = false,
  onSelect,
}: {
  school: School;
  selected?: boolean;
  onSelect?: (school: School) => void;
}) {
  const isAvailable = school.status === "available";
  const [claimOpen, setClaimOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  return (
    <Card
      className={cn(
        "w-full rounded-[4px] py-0 shadow-none ring-border",
        selected && "ring-2 ring-foreground",
      )}
    >
      <CardContent className="flex flex-row items-center justify-between gap-6 p-6">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
          <CardTitle className="text-[21px] leading-[28px] font-medium">
            {school.name}
          </CardTitle>
          <CardDescription className="text-sm tracking-[0.07px] whitespace-pre">
            {school.meta}
          </CardDescription>
          <CardDescription className="text-sm tracking-[0.07px] whitespace-pre">
            {school.address}
          </CardDescription>
          <Badge
            variant="secondary"
            className="h-auto rounded-[4px] border border-border px-3 py-1 text-xs font-normal tracking-[0.12px]"
          >
            {isAvailable ? "Available to claim" : "Claimed"}
          </Badge>
        </div>
        {isAvailable ? (
          <Button
            type="button"
            className="shrink-0"
            onClick={() => setClaimOpen(true)}
          >
            Claim this school
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="shrink-0"
            onClick={() => setRequestOpen(true)}
          >
            Request Access
          </Button>
        )}
      </CardContent>
      <Dialog open={claimOpen} onOpenChange={setClaimOpen}>
        <DialogContent className="rounded-[4px] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Are you sure this is your school?</DialogTitle>
            <DialogDescription>{school.address}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row items-center justify-end gap-3 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setClaimOpen(false)}
            >
              No, it&apos;s not.
            </Button>
            <Button
              type="button"
              onClick={() => {
                setClaimOpen(false);
                onSelect?.(school);
              }}
            >
              Yes, this is my school.
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
        <DialogContent className="rounded-[4px] sm:max-w-lg">
          {requestSubmitted ? (
            <DialogHeader className="items-center text-center sm:text-center">
              <CircleCheck
                className="size-10 text-foreground"
                strokeWidth={1.5}
                aria-hidden
              />
              <DialogTitle>Request has been submitted</DialogTitle>
            </DialogHeader>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>
                  This school has already been claimed by Anthony H.
                </DialogTitle>
                <DialogDescription>
                  Request access to this school. Please allow up to 24 hours
                  with a verification email.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex-row items-center justify-end gap-3 sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRequestOpen(false)}
                >
                  Dismiss
                </Button>
                <Button
                  type="button"
                  onClick={() => setRequestSubmitted(true)}
                >
                  Request access
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
