const SMS_KEY = "afc-sms-security";

export const MOCK_SMS_CODE = "123456";

export type SmsSecurity = {
  complete: boolean;
  mobile?: string;
};

type SmsRecord = Record<string, SmsSecurity>;

const EMPTY_SECURITY: SmsSecurity = { complete: false };

const listeners = new Set<() => void>();

let cache: { serialized: string; value: SmsRecord } | null = null;

function notify() {
  cache = null;
  listeners.forEach((listener) => listener());
}

export function subscribeSmsSecurity(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function accountKey(email: string) {
  return email.trim().toLowerCase();
}

function readRecord(): SmsRecord {
  const stored = window.localStorage.getItem(SMS_KEY);
  const serialized = stored ?? "";
  if (cache && cache.serialized === serialized) {
    return cache.value;
  }
  let value: SmsRecord = {};
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as Record<string, unknown>;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        for (const [email, entry] of Object.entries(parsed)) {
          if (entry && typeof entry === "object" && !Array.isArray(entry)) {
            const next = entry as Partial<SmsSecurity>;
            value[email] = {
              complete: next.complete === true,
              mobile: typeof next.mobile === "string" ? next.mobile : undefined,
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

function writeRecord(next: SmsRecord) {
  window.localStorage.setItem(SMS_KEY, JSON.stringify(next));
  notify();
}

export function getSmsSecurity(email: string): SmsSecurity {
  const key = accountKey(email);
  if (!key) {
    return EMPTY_SECURITY;
  }
  return readRecord()[key] ?? EMPTY_SECURITY;
}

export function emptySmsSecurity(): SmsSecurity {
  return EMPTY_SECURITY;
}

export function isSmsSecurityComplete(email: string) {
  return getSmsSecurity(email).complete;
}

export function incompleteSmsSecurity() {
  return false;
}

export function saveSmsMobile(email: string, mobile: string) {
  const key = accountKey(email);
  if (!key) {
    return;
  }
  const current = getSmsSecurity(email);
  writeRecord({
    ...readRecord(),
    [key]: {
      ...current,
      complete: false,
      mobile,
    },
  });
}

export function markSmsSecurityComplete(email: string, mobile: string) {
  const key = accountKey(email);
  if (!key) {
    return;
  }
  writeRecord({
    ...readRecord(),
    [key]: {
      complete: true,
      mobile,
    },
  });
}

export function isValidMobile(value: string) {
  return value.replace(/\D/g, "").length >= 10;
}

export function smsSecurityHref(
  query: string,
  from: "profile" | "page-builder" | "publish",
) {
  return `/sms-security?${query}&from=${from}`;
}
