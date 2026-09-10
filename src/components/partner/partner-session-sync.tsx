"use client";

import { useEffect } from "react";

import type { PartnerContext } from "@/lib/partner-context";
import { savePartnerSession } from "@/lib/partner-session";

export function PartnerSessionSync({ context }: { context: PartnerContext }) {
  useEffect(() => {
    savePartnerSession(context);
  }, [context]);

  return null;
}
