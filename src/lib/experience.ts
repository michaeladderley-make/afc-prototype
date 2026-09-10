export type Experience = "school" | "network" | "afc";

export const EXPERIENCE_LABEL: Record<Experience, string> = {
  school: "School",
  network: "Network",
  afc: "AFC",
};

const EXPERIENCE_KEY = "afc-experience";

const listeners = new Set<() => void>();

let cache: { serialized: string; value: Experience | undefined } | null = null;

function notify() {
  cache = null;
  listeners.forEach((listener) => listener());
}

export function parseExperience(value: unknown): Experience | undefined {
  if (value === "school" || value === "network" || value === "afc") {
    return value;
  }
  return undefined;
}

export function subscribeExperience(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function getExperience(): Experience | undefined {
  const stored = window.localStorage.getItem(EXPERIENCE_KEY);
  const serialized = stored ?? "";
  if (cache && cache.serialized === serialized) {
    return cache.value;
  }
  const value = parseExperience(stored);
  cache = { serialized, value };
  return value;
}

export function emptyExperience() {
  return undefined;
}

export function saveExperience(experience: Experience) {
  window.localStorage.setItem(EXPERIENCE_KEY, experience);
  notify();
}
