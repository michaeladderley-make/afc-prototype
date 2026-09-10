import {
  partnerQuery,
  type PartnerContext,
} from "@/lib/partner-context";

const SESSION_KEY = "afc-partner-sessions";

type SessionRecord = Record<string, PartnerContext>;

function accountKey(email: string) {
  return email.trim().toLowerCase();
}

function readRecord(): SessionRecord {
  if (typeof window === "undefined") {
    return {};
  }
  const stored = window.localStorage.getItem(SESSION_KEY);
  if (!stored) {
    return {};
  }
  try {
    const parsed = JSON.parse(stored) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    const next: SessionRecord = {};
    for (const [email, entry] of Object.entries(parsed)) {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
        continue;
      }
      const value = entry as Partial<PartnerContext>;
      if (
        typeof value.email === "string" &&
        typeof value.school === "string" &&
        typeof value.firstName === "string" &&
        typeof value.lastName === "string" &&
        typeof value.role === "string"
      ) {
        next[email] = {
          email: value.email,
          type: typeof value.type === "string" ? value.type : "school",
          school: value.school,
          firstName: value.firstName,
          lastName: value.lastName,
          role: value.role,
        };
      }
    }
    return next;
  } catch {
    return {};
  }
}

export function savePartnerSession(context: PartnerContext) {
  const key = accountKey(context.email);
  if (!key) {
    return;
  }
  window.localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      ...readRecord(),
      [key]: context,
    }),
  );
}

export function listPartnerSessions(): PartnerContext[] {
  return Object.values(readRecord());
}

export function getAnyPartnerSession(): PartnerContext | null {
  return listPartnerSessions()[0] ?? null;
}

export function findPartnerSessionForSchool(
  schoolId: string,
): PartnerContext | null {
  const sessions = listPartnerSessions();
  return (
    sessions.find((session) => session.school === schoolId) ??
    sessions[0] ??
    null
  );
}

export function getPartnerSession(email: string): PartnerContext | null {
  const key = accountKey(email);
  if (!key) {
    return null;
  }
  return readRecord()[key] ?? null;
}

export function resolveSignInContext(email: string): PartnerContext {
  const stored = getPartnerSession(email);
  if (stored) {
    return { ...stored, email: email.trim() };
  }
  return {
    email: email.trim(),
    type: "school",
    school: "lincoln-high",
    firstName: "Partner",
    lastName: "User",
    role: "principal",
  };
}

export function pageBuilderHref(context: PartnerContext) {
  return `/page-builder?${partnerQuery(context)}`;
}
