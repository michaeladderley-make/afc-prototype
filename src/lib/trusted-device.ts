const TRUST_KEY = "afc-trusted-devices";
const TRUST_MS = 30 * 24 * 60 * 60 * 1000;

type TrustRecord = Record<string, number>;

function accountKey(email: string) {
  return email.trim().toLowerCase();
}

function readRecord(): TrustRecord {
  const stored = window.localStorage.getItem(TRUST_KEY);
  if (!stored) {
    return {};
  }
  try {
    const parsed = JSON.parse(stored) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    const next: TrustRecord = {};
    for (const [email, expiry] of Object.entries(parsed)) {
      if (typeof expiry === "number") {
        next[email] = expiry;
      }
    }
    return next;
  } catch {
    return {};
  }
}

export function isDeviceTrusted(email: string) {
  const key = accountKey(email);
  if (!key) {
    return false;
  }
  const expiry = readRecord()[key];
  return typeof expiry === "number" && expiry > Date.now();
}

export function trustDevice(email: string) {
  const key = accountKey(email);
  if (!key) {
    return;
  }
  window.localStorage.setItem(
    TRUST_KEY,
    JSON.stringify({
      ...readRecord(),
      [key]: Date.now() + TRUST_MS,
    }),
  );
}
