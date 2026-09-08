"use client";

import Link from "next/link";
import { Check, CircleAlert, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { PartnerContext } from "@/lib/partner-context";
import {
  READINESS_STATUS_LABEL,
  type ReadinessFrom,
  type ReadinessStatus,
} from "@/lib/readiness";
import { useReadiness } from "@/lib/use-readiness";
import { cn } from "@/lib/utils";

function ReadinessRing({
  complete,
  total,
}: {
  complete: number;
  total: number;
}) {
  const size = 16;
  const stroke = 2.5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = total === 0 ? 0 : complete / total;
  const offset = circumference * (1 - progress);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="-rotate-90"
      aria-hidden
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        className="text-border"
        stroke="currentColor"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        className="text-foreground"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}

function summaryBadgeClass(status: ReadinessStatus) {
  if (status === "action-needed") {
    return "border-transparent bg-red-100 text-red-700";
  }
  if (status === "complete") {
    return "border-transparent bg-emerald-100 text-emerald-800";
  }
  return "border-transparent bg-muted text-muted-foreground";
}

function StatusIcon({ status }: { status: ReadinessStatus }) {
  if (status === "complete") {
    return <Check className="size-4" aria-hidden />;
  }
  if (status === "action-needed") {
    return <CircleAlert className="size-4" aria-hidden />;
  }
  return <Clock className="size-4" aria-hidden />;
}

export function ReadinessMenu({
  context,
  query,
  from,
}: {
  context: PartnerContext;
  query: string;
  from: ReadinessFrom;
}) {
  const { items, summary, completedCount, totalCount } = useReadiness(
    context,
    query,
    from,
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          aria-label={`Readiness: ${READINESS_STATUS_LABEL[summary]}. ${completedCount} of ${totalCount} steps complete.`}
          className="h-auto gap-2 whitespace-nowrap px-0 text-sm font-normal tracking-[0.07px] text-muted-foreground hover:bg-transparent hover:text-muted-foreground"
        >
          <ReadinessRing complete={completedCount} total={totalCount} />
          <span>Readiness</span>
          <Badge
            variant="secondary"
            className={cn(
              "h-auto rounded-[4px] px-2 py-0.5 text-xs font-normal tracking-[0.12px]",
              summaryBadgeClass(summary),
            )}
          >
            {READINESS_STATUS_LABEL[summary]}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="center" className="w-[360px] rounded-[4px] gap-3">
        <PopoverHeader>
          <PopoverTitle>Onboarding readiness</PopoverTitle>
          <PopoverDescription>
            See what you can do now and what must be complete before you
            publish.
          </PopoverDescription>
        </PopoverHeader>
        <ul className="flex flex-col gap-2">
          {items.map((item) => {
            const statusLabel = READINESS_STATUS_LABEL[item.status];
            const content = (
              <>
                <span
                  className={cn(
                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                    item.status === "complete" &&
                      "bg-emerald-100 text-emerald-800",
                    item.status === "action-needed" &&
                      "bg-orange-100 text-orange-800",
                    item.status === "afc-in-progress" &&
                      "bg-muted text-muted-foreground",
                  )}
                >
                  <StatusIcon status={item.status} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium tracking-[0.07px] text-foreground">
                    {item.label}
                  </span>
                  <span
                    className={cn(
                      "block text-xs tracking-[0.12px]",
                      item.status === "action-needed"
                        ? "text-orange-800"
                        : "text-muted-foreground",
                    )}
                  >
                    {statusLabel}
                    {item.detail ? ` · ${item.detail}` : null}
                  </span>
                </span>
              </>
            );

            if (item.href) {
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="flex items-start gap-3 rounded-md px-1 py-1 hover:bg-muted"
                  >
                    {content}
                  </Link>
                </li>
              );
            }

            return (
              <li key={item.id} className="flex items-start gap-3 px-1 py-1">
                {content}
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
