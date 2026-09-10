export type OrganizationFee = {
  id: string;
  name: string;
  amount: string;
};

export type OrganizationDetails = {
  averageAnnualTuition: string;
  fees: OrganizationFee[];
  marketplaceParticipates: boolean | null;
  marketplaceName: string;
  studentCountRange: string;
  religiousAffiliation: string;
};

export const STUDENT_COUNT_RANGES = [
  { value: "under-200", label: "Fewer than 200" },
  { value: "200-499", label: "200–499" },
  { value: "500-999", label: "500–999" },
  { value: "1000-1999", label: "1,000–1,999" },
  { value: "2000-4999", label: "2,000–4,999" },
  { value: "5000-plus", label: "5,000 or more" },
] as const;

export const RELIGIOUS_AFFILIATIONS = [
  { value: "none", label: "None" },
  { value: "catholic", label: "Catholic" },
  { value: "protestant", label: "Protestant" },
  { value: "other-christian", label: "Other Christian" },
  { value: "jewish", label: "Jewish" },
  { value: "muslim", label: "Muslim" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
] as const;

const STORAGE_KEY = "afc-organization-details";

export const EMPTY_ORGANIZATION_DETAILS: OrganizationDetails = {
  averageAnnualTuition: "",
  fees: [],
  marketplaceParticipates: null,
  marketplaceName: "",
  studentCountRange: "",
  religiousAffiliation: "",
};

type DetailsRecord = Record<string, OrganizationDetails>;

const listeners = new Set<() => void>();

let cache: { serialized: string; value: DetailsRecord } | null = null;

function notify() {
  cache = null;
  listeners.forEach((listener) => listener());
}

export function subscribeOrganizationDetails(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function schoolKey(schoolId: string) {
  return schoolId.trim().toLowerCase();
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function normalizeFee(value: unknown): OrganizationFee | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  const fee = value as Partial<OrganizationFee>;
  if (typeof fee.id !== "string" || !fee.id) {
    return null;
  }
  return {
    id: fee.id,
    name: asString(fee.name),
    amount: asString(fee.amount),
  };
}

function normalizeDetails(value: unknown): OrganizationDetails {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return EMPTY_ORGANIZATION_DETAILS;
  }
  const next = value as Partial<OrganizationDetails>;
  const fees = Array.isArray(next.fees)
    ? next.fees
        .map(normalizeFee)
        .filter((fee): fee is OrganizationFee => fee !== null)
    : [];
  return {
    averageAnnualTuition: asString(next.averageAnnualTuition),
    fees,
    marketplaceParticipates:
      next.marketplaceParticipates === true
        ? true
        : next.marketplaceParticipates === false
          ? false
          : null,
    marketplaceName: asString(next.marketplaceName),
    studentCountRange: asString(next.studentCountRange),
    religiousAffiliation: asString(next.religiousAffiliation),
  };
}

function readRecord(): DetailsRecord {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  const serialized = stored ?? "";
  if (cache && cache.serialized === serialized) {
    return cache.value;
  }
  let value: DetailsRecord = {};
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as Record<string, unknown>;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        for (const [id, entry] of Object.entries(parsed)) {
          value[id] = normalizeDetails(entry);
        }
      }
    } catch {
      value = {};
    }
  }
  cache = { serialized, value };
  return value;
}

export function getOrganizationDetails(schoolId: string): OrganizationDetails {
  const key = schoolKey(schoolId);
  if (!key) {
    return EMPTY_ORGANIZATION_DETAILS;
  }
  return readRecord()[key] ?? EMPTY_ORGANIZATION_DETAILS;
}

export function emptyOrganizationDetails(): OrganizationDetails {
  return EMPTY_ORGANIZATION_DETAILS;
}

export function saveOrganizationDetails(
  schoolId: string,
  next: OrganizationDetails,
) {
  const key = schoolKey(schoolId);
  if (!key) {
    return;
  }
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...readRecord(),
      [key]: normalizeDetails(next),
    }),
  );
  notify();
}

export function createOrganizationFee(): OrganizationFee {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `fee-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return { id, name: "", amount: "" };
}
