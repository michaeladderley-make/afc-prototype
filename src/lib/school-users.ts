export type SchoolUser = {
  id: string;
  name: string;
  email: string;
  joinedOn: string;
};

const STORAGE_KEY = "afc-school-users";

export const DEFAULT_SCHOOL_USERS: SchoolUser[] = [
  {
    id: "jordan-hale",
    name: "Jordan Hale",
    email: "jordan.hale@lincoln.edu",
    joinedOn: "2026-01-12",
  },
  {
    id: "priya-shah",
    name: "Priya Shah",
    email: "priya.shah@lincoln.edu",
    joinedOn: "2026-03-03",
  },
  {
    id: "marcus-chen",
    name: "Marcus Chen",
    email: "marcus.chen@lincoln.edu",
    joinedOn: "2026-04-18",
  },
  {
    id: "elena-ruiz",
    name: "Elena Ruiz",
    email: "elena.ruiz@lincoln.edu",
    joinedOn: "2026-06-09",
  },
];

type UsersRecord = Record<string, SchoolUser[]>;

const listeners = new Set<() => void>();

let cache: { serialized: string; value: UsersRecord } | null = null;

function notify() {
  cache = null;
  listeners.forEach((listener) => listener());
}

export function subscribeSchoolUsers(onStoreChange: () => void) {
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

function normalizeUser(value: unknown): SchoolUser | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  const next = value as Partial<SchoolUser>;
  const id = asString(next.id);
  const name = asString(next.name);
  const email = asString(next.email);
  const joinedOn = asString(next.joinedOn);
  if (!id || !name || !email || !joinedOn) {
    return null;
  }
  return { id, name, email, joinedOn };
}

function normalizeUsers(value: unknown): SchoolUser[] | null {
  if (!Array.isArray(value)) {
    return null;
  }
  return value
    .map(normalizeUser)
    .filter((user): user is SchoolUser => user !== null);
}

function readRecord(): UsersRecord {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  const serialized = stored ?? "";
  if (cache && cache.serialized === serialized) {
    return cache.value;
  }
  let value: UsersRecord = {};
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as Record<string, unknown>;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        for (const [id, entry] of Object.entries(parsed)) {
          const users = normalizeUsers(entry);
          if (users) {
            value[id] = users;
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

export function defaultSchoolUsers(): SchoolUser[] {
  return DEFAULT_SCHOOL_USERS;
}

export function getSchoolUsers(schoolId: string): SchoolUser[] {
  const key = schoolKey(schoolId);
  if (!key) {
    return DEFAULT_SCHOOL_USERS;
  }
  return readRecord()[key] ?? DEFAULT_SCHOOL_USERS;
}

export function saveSchoolUsers(schoolId: string, next: SchoolUser[]) {
  const key = schoolKey(schoolId);
  if (!key) {
    return;
  }
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...readRecord(),
      [key]: next,
    }),
  );
  notify();
}

export function formatJoinedDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
