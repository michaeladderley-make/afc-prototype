"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  REPORTING_PERIODS,
  type ReportingPeriod,
} from "@/lib/mock-dashboard";

export function ReportingPeriodSelect({
  value,
  onValueChange,
}: {
  value: ReportingPeriod;
  onValueChange: (value: ReportingPeriod) => void;
}) {
  return (
    <Select
      value={value}
      onValueChange={(next) => onValueChange(next as ReportingPeriod)}
    >
      <SelectTrigger
        id="reporting-period"
        className="w-[140px]"
        aria-label="Reporting period"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {REPORTING_PERIODS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
