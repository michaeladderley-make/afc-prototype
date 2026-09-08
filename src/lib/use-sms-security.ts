"use client";

import { useSyncExternalStore } from "react";

import {
  emptySmsSecurity,
  getSmsSecurity,
  incompleteSmsSecurity,
  isSmsSecurityComplete,
  markSmsSecurityComplete,
  saveSmsMobile,
  subscribeSmsSecurity,
} from "@/lib/sms-security";

export function useSmsSecurity(email: string) {
  const security = useSyncExternalStore(
    subscribeSmsSecurity,
    () => getSmsSecurity(email),
    emptySmsSecurity,
  );
  const complete = useSyncExternalStore(
    subscribeSmsSecurity,
    () => isSmsSecurityComplete(email),
    incompleteSmsSecurity,
  );

  function saveMobile(mobile: string) {
    saveSmsMobile(email, mobile);
  }

  function completeSetup(mobile: string) {
    markSmsSecurityComplete(email, mobile);
  }

  return {
    complete,
    mobile: security.mobile ?? "",
    saveMobile,
    completeSetup,
  };
}
