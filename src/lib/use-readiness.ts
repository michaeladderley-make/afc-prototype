"use client";

import type { PartnerContext } from "@/lib/partner-context";
import {
  buildReadiness,
  isPageContentComplete,
  isProfileContactComplete,
  type ReadinessFrom,
} from "@/lib/readiness";
import { usePartnershipAgreement } from "@/lib/use-partnership-agreement";
import { usePageDefaults } from "@/lib/use-partner-settings";
import { useSmsSecurity } from "@/lib/use-sms-security";

export function useReadiness(
  context: PartnerContext,
  query: string,
  from: ReadinessFrom,
) {
  const { signed } = usePartnershipAgreement(context.email, context.school);
  const { complete: smsComplete } = useSmsSecurity(context.email);
  const { settings } = usePageDefaults(context, context.school);

  return buildReadiness({
    query,
    from,
    profileContactComplete: isProfileContactComplete(settings.contact),
    agreementSigned: signed,
    smsComplete,
    pageContentComplete: isPageContentComplete({
      logoAdded: settings.logo.added,
      coverAdded: settings.cover.added,
    }),
  });
}
