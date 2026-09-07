"use client";

import { useSyncExternalStore } from "react";

import {
  emptySchoolAgreement,
  getSchoolAgreement,
  isPartnershipAgreementSigned,
  markPartnershipAgreementSigned,
  savePartnershipAgreementInvite,
  subscribePartnershipAgreement,
  unsignedPartnershipAgreement,
  type AgreementSigner,
} from "@/lib/partnership-agreement";

export function usePartnershipAgreement(email: string, school: string) {
  const agreement = useSyncExternalStore(
    subscribePartnershipAgreement,
    () => getSchoolAgreement(school),
    emptySchoolAgreement,
  );
  const signed = useSyncExternalStore(
    subscribePartnershipAgreement,
    () => isPartnershipAgreementSigned(school),
    unsignedPartnershipAgreement,
  );

  function approve(details: Omit<AgreementSigner, "email">) {
    markPartnershipAgreementSigned(school, { ...details, email });
  }

  function invite(inviteEmail: string) {
    savePartnershipAgreementInvite(school, {
      email: inviteEmail.trim(),
      invitedBy: email,
    });
  }

  return {
    signed,
    signer: agreement.signer,
    pendingInvite: agreement.pendingInvite,
    approve,
    invite,
  };
}
