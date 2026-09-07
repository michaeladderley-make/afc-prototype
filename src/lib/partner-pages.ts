import { MOCK_PAGES, type PartnerPage } from "@/lib/mock-pages";
import { getSchoolById, type School } from "@/lib/mock-schools";
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
    page.slug ? page : { ...page, slug: page.id || slugFromName(page.name) },
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

function schoolFromPage(page: PartnerPage): School {
  return {
    id: page.editableSchoolId ?? page.id,
    name: page.name,
    meta: page.meta,
    address: page.address,
    status: "available",
    welcomeStatement: `Make a Donation to ${page.name}`,
    schoolStory: `${page.name} is a partner of the AFC Scholarship Fund network. Gifts fund student support — not individual student designations.`,
  };
}

export function resolvePublishedDonationFrom(
  pages: PartnerPage[],
  slug: string,
) {
  const page = pages.find((entry) => {
    if (entry.status !== "Published") {
      return false;
    }
    return (
      entry.slug === slug ||
      entry.id === slug ||
      entry.editableSchoolId === slug
    );
  });
  if (!page) {
    const school = getSchoolById(slug);
    if (!school) {
      return null;
    }
    return {
      page: {
        id: school.id,
        name: school.name,
        slug: school.id,
        status: "Published" as const,
        meta: school.meta,
        address: school.address,
        editableSchoolId: school.id,
      },
      school,
    };
  }
  const school =
    getSchoolById(page.editableSchoolId ?? page.id) ?? schoolFromPage(page);
  return { page, school };
}

export function resolvePublishedDonation(slug: string) {
  return resolvePublishedDonationFrom(getPartnerPages(), slug);
}

export function publishPartnerPage(school: School, slug: string) {
  const pages = getPartnerPages();
  const index = pages.findIndex(
    (page) => page.editableSchoolId === school.id || page.id === school.id,
  );
  const nextPage: PartnerPage = {
    id: index === -1 ? school.id : pages[index].id,
    name: school.name,
    slug,
    status: "Published",
    meta: school.meta,
    address: school.address,
    editableSchoolId: school.id,
  };
  savePartnerPages(
    index === -1
      ? [...pages, nextPage]
      : pages.map((page, pageIndex) =>
          pageIndex === index ? { ...page, ...nextPage } : page,
        ),
  );
}
