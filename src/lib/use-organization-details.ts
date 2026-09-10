"use client";

import { useSyncExternalStore } from "react";

import {
  emptyOrganizationDetails,
  getOrganizationDetails,
  saveOrganizationDetails,
  subscribeOrganizationDetails,
  type OrganizationDetails,
} from "@/lib/organization-details";

export function useOrganizationDetails(schoolId: string) {
  const details = useSyncExternalStore(
    subscribeOrganizationDetails,
    () => getOrganizationDetails(schoolId),
    emptyOrganizationDetails,
  );

  function update(patch: Partial<OrganizationDetails>) {
    saveOrganizationDetails(schoolId, {
      ...getOrganizationDetails(schoolId),
      ...patch,
    });
  }

  return { details, update };
}
