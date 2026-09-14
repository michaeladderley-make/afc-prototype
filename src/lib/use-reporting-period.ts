"use client";

import { useSyncExternalStore } from "react";

import {
  defaultReportingPeriod,
  getReportingPeriod,
  setReportingPeriod,
  subscribeReportingPeriod,
} from "@/lib/mock-dashboard";

export function useReportingPeriod() {
  const period = useSyncExternalStore(
    subscribeReportingPeriod,
    getReportingPeriod,
    defaultReportingPeriod,
  );

  return {
    period,
    setPeriod: setReportingPeriod,
  };
}
