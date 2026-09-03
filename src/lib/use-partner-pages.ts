"use client";

import { useSyncExternalStore } from "react";

import type { PartnerPage } from "@/lib/mock-pages";
import {
  defaultPartnerPages,
  getPartnerPages,
  savePartnerPages,
  subscribePartnerPages,
} from "@/lib/partner-pages";

export function usePartnerPages() {
  const pages = useSyncExternalStore(
    subscribePartnerPages,
    getPartnerPages,
    defaultPartnerPages,
  );

  function setPages(next: PartnerPage[]) {
    savePartnerPages(next);
  }

  return { pages, setPages };
}
