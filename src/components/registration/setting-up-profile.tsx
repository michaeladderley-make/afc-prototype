"use client";

import { useSyncExternalStore } from "react";

import { RegistrationLoading } from "@/components/registration/registration-loading";
import { partnerQuery, type PartnerContext } from "@/lib/partner-context";
import {
  getInviteForEmail,
  partnershipAgreementHref,
  subscribePartnershipAgreement,
} from "@/lib/partnership-agreement";

function noInvite() {
  return null;
}

export function SettingUpProfile({
  context,
  nextHref,
}: {
  context: PartnerContext;
  nextHref: string;
}) {
  const invite = useSyncExternalStore(
    subscribePartnershipAgreement,
    () => getInviteForEmail(context.email),
    noInvite,
  );
  const destination =
    invite?.school === context.school
      ? partnershipAgreementHref(partnerQuery(context), "page-builder")
      : nextHref;

  return (
    <RegistrationLoading
      nextHref={destination}
      message="Setting up your profile..."
    />
  );
}
