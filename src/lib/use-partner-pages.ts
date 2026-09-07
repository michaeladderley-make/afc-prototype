"use client";

import { useSyncExternalStore } from "react";

import type { PartnerPage } from "@/lib/mock-pages";
import type { School } from "@/lib/mock-schools";
import {
  defaultPartnerPages,
  getPartnerPages,
  publishPartnerPage,
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

  function publishPage(school: School, slug: string) {
    publishPartnerPage(school, slug);
  }

  return { pages, setPages, publishPage };
}
