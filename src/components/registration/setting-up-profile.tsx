"use client";

import { useEffect } from "react";

import { RegistrationLoading } from "@/components/registration/registration-loading";
import { partnerQuery, type PartnerContext } from "@/lib/partner-context";
import { resetPartnershipAgreementForSchool } from "@/lib/partnership-agreement";

export function SettingUpProfile({ context }: { context: PartnerContext }) {
  useEffect(() => {
    resetPartnershipAgreementForSchool(context.school);
  }, [context.school]);

  return (
    <RegistrationLoading
      nextHref={`/page-builder?${partnerQuery(context)}&welcome=1`}
      message="Setting up your profile..."
    />
  );
}
