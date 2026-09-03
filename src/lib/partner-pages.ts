import { MOCK_PAGES, type PartnerPage } from "@/lib/mock-pages";
import { slugFromName } from "@/lib/page-urls";

const PAGES_KEY = "afc-pages";

const listeners = new Set<() => void>();

let cache: { serialized: string; value: PartnerPage[] } | null = null;

function notify() {
  cache = null;
  listeners.forEach((listener) => listener());
}

export function subscribePartnerPages(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function defaultPartnerPages(): PartnerPage[] {
  return MOCK_PAGES;
}

// Pages stored before slugs existed still need a URL.
function withSlugs(pages: PartnerPage[]): PartnerPage[] {
  return pages.map((page) =>
    page.slug ? page : { ...page, slug: slugFromName(page.name) },
  );
}

export function getPartnerPages(): PartnerPage[] {
  const stored = window.localStorage.getItem(PAGES_KEY);
  const serialized = stored ?? "";
  if (cache && cache.serialized === serialized) {
    return cache.value;
  }
  let value = MOCK_PAGES;
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as PartnerPage[];
      if (Array.isArray(parsed)) {
        value = withSlugs(parsed);
      }
    } catch {
      value = MOCK_PAGES;
    }
  }
  cache = { serialized, value };
  return value;
}

export function savePartnerPages(next: PartnerPage[]) {
  window.localStorage.setItem(PAGES_KEY, JSON.stringify(next));
  notify();
}
