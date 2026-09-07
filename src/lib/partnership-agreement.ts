const AGREEMENT_KEY = "afc-partnership-agreement";

const listeners = new Set<() => void>();

export type AgreementSigner = {
  email: string;
  legalName: string;
  title: string;
};

export type AgreementInvite = {
  email: string;
  invitedBy: string;
};

export type SchoolAgreement = {
  signed: boolean;
  signer?: AgreementSigner;
  pendingInvite?: AgreementInvite;
};

type AgreementRecord = Record<string, SchoolAgreement>;

const EMPTY_AGREEMENT: SchoolAgreement = { signed: false };

let cache: { serialized: string; value: AgreementRecord } | null = null;

function notify() {
  cache = null;
  listeners.forEach((listener) => listener());
}

export function subscribePartnershipAgreement(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function readRecord(): AgreementRecord {
  const stored = window.localStorage.getItem(AGREEMENT_KEY);
  const serialized = stored ?? "";
  if (cache && cache.serialized === serialized) {
    return cache.value;
  }
  let value: AgreementRecord = {};
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as Record<string, unknown>;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        for (const [school, entry] of Object.entries(parsed)) {
          if (entry && typeof entry === "object" && !Array.isArray(entry)) {
            const next = entry as Partial<SchoolAgreement>;
            value[school] = {
              signed: next.signed === true,
              signer: next.signer,
              pendingInvite: next.pendingInvite,
            };
          }
        }
      }
    } catch {
      value = {};
    }
  }
  cache = { serialized, value };
  return value;
}

function writeRecord(next: AgreementRecord) {
  window.localStorage.setItem(AGREEMENT_KEY, JSON.stringify(next));
  notify();
}

export function getSchoolAgreement(school: string): SchoolAgreement {
  return readRecord()[school] ?? EMPTY_AGREEMENT;
}

export function emptySchoolAgreement(): SchoolAgreement {
  return EMPTY_AGREEMENT;
}

export function isPartnershipAgreementSigned(school: string) {
  return getSchoolAgreement(school).signed;
}

export function unsignedPartnershipAgreement() {
  return false;
}

export function resetPartnershipAgreementsForSignup() {
  const current = readRecord();
  const next: AgreementRecord = {};
  for (const [school, entry] of Object.entries(current)) {
    if (entry.pendingInvite) {
      next[school] = {
        signed: false,
        pendingInvite: entry.pendingInvite,
      };
    }
  }
  writeRecord(next);
}

export function resetPartnershipAgreementForSchool(school: string) {
  const current = getSchoolAgreement(school);
  writeRecord({
    ...readRecord(),
    [school]: {
      signed: false,
      pendingInvite: current.pendingInvite,
    },
  });
}

export function markPartnershipAgreementSigned(
  school: string,
  signer: AgreementSigner,
) {
  const current = getSchoolAgreement(school);
  writeRecord({
    ...readRecord(),
    [school]: {
      ...current,
      signed: true,
      signer,
      pendingInvite: undefined,
    },
  });
}

export function savePartnershipAgreementInvite(
  school: string,
  invite: AgreementInvite,
) {
  const current = getSchoolAgreement(school);
  if (current.signed) {
    return;
  }
  writeRecord({
    ...readRecord(),
    [school]: {
      ...current,
      pendingInvite: invite,
    },
  });
}

export function getInviteForEmail(email: string) {
  const needle = email.trim().toLowerCase();
  if (!needle) {
    return null;
  }
  for (const [school, agreement] of Object.entries(readRecord())) {
    if (agreement.pendingInvite?.email.toLowerCase() === needle) {
      return { school, invite: agreement.pendingInvite };
    }
  }
  return null;
}

export function isPendingInvitee(email: string, school: string) {
  const invite = getSchoolAgreement(school).pendingInvite;
  return invite?.email.toLowerCase() === email.trim().toLowerCase();
}

export function partnershipAgreementHref(
  query: string,
  from: "profile" | "page-builder" | "publish" | "signup",
) {
  return `/partnership-agreement?${query}&from=${from}`;
}

export function partnershipInviteSignupHref(email: string) {
  return `/?${new URLSearchParams({ email }).toString()}`;
}

export function isValidWorkEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
