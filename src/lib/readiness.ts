import {
  isValidWorkEmail,
  partnershipAgreementHref,
} from "@/lib/partnership-agreement";
import type { ContactInfo } from "@/lib/partner-settings";
import { isValidMobile, smsSecurityHref } from "@/lib/sms-security";

export type ReadinessFrom = "profile" | "page-builder" | "publish";

export type ReadinessStatus = "complete" | "action-needed" | "afc-in-progress";

export type ReadinessItemId =
  | "school-approved"
  | "profile-contact"
  | "partnership-agreement"
  | "sms-security"
  | "page-content"
  | "fundraising-connection";

export type ReadinessItem = {
  id: ReadinessItemId;
  label: string;
  status: ReadinessStatus;
  href?: string;
  detail?: string;
};

export type ReadinessSnapshot = {
  items: ReadinessItem[];
  summary: ReadinessStatus;
  completedCount: number;
  totalCount: number;
  readyToPublish: boolean;
};

export const READINESS_STATUS_LABEL: Record<ReadinessStatus, string> = {
  complete: "Complete",
  "action-needed": "Action needed",
  "afc-in-progress": "AFC in progress",
};

const AFC_DETAIL =
  "AFC is working on this. No action is required from you right now.";

export function isProfileContactComplete(contact: ContactInfo) {
  return (
    contact.firstName.trim().length > 0 &&
    contact.lastName.trim().length > 0 &&
    isValidMobile(contact.phone) &&
    isValidWorkEmail(contact.email)
  );
}

export function isPageContentComplete(media: {
  logoAdded: boolean;
  coverAdded: boolean;
}) {
  return media.logoAdded && media.coverAdded;
}

export function summarizeReadiness(
  items: ReadinessItem[],
): ReadinessStatus {
  if (items.some((item) => item.status === "action-needed")) {
    return "action-needed";
  }
  if (items.some((item) => item.status === "afc-in-progress")) {
    return "afc-in-progress";
  }
  return "complete";
}

export function buildReadiness({
  query,
  from,
  profileContactComplete,
  agreementSigned,
  smsComplete,
  pageContentComplete,
}: {
  query: string;
  from: ReadinessFrom;
  profileContactComplete: boolean;
  agreementSigned: boolean;
  smsComplete: boolean;
  pageContentComplete: boolean;
}): ReadinessSnapshot {
  const items: ReadinessItem[] = [
    {
      id: "school-approved",
      label: "School account approved",
      status: "afc-in-progress",
      detail: AFC_DETAIL,
    },
    {
      id: "profile-contact",
      label: "Profile and contact details complete",
      status: profileContactComplete ? "complete" : "action-needed",
      href: profileContactComplete ? undefined : `/profile?${query}`,
    },
    {
      id: "partnership-agreement",
      label: "Partnership Agreement signed",
      status: agreementSigned ? "complete" : "action-needed",
      href: agreementSigned
        ? undefined
        : partnershipAgreementHref(query, from),
    },
    {
      id: "sms-security",
      label: "SMS security enabled",
      status: smsComplete ? "complete" : "action-needed",
      href: smsComplete ? undefined : smsSecurityHref(query, from),
    },
    {
      id: "page-content",
      label: "Required page content complete",
      status: pageContentComplete ? "complete" : "action-needed",
      href: pageContentComplete ? undefined : `/page-builder?${query}`,
    },
    {
      id: "fundraising-connection",
      label: "Fundraising connection ready",
      status: "afc-in-progress",
      detail: AFC_DETAIL,
    },
  ];

  const summary = summarizeReadiness(items);
  const completedCount = items.filter(
    (item) => item.status === "complete",
  ).length;
  return {
    items,
    summary,
    completedCount,
    totalCount: items.length,
    readyToPublish: summary === "complete",
  };
}
