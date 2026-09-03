import type { PartnerPage } from "@/lib/mock-pages";

export const PAGE_URL_BASE = "donations.afc.com/";

function pageUrl(page: PartnerPage) {
  const path = page.status === "Published" ? page.slug : `preview/${page.slug}`;
  return `${PAGE_URL_BASE}${path}`;
}

export function pageShareUrl(page: PartnerPage) {
  return `https://${pageUrl(page)}`;
}

export function pageUrlLabel(page: PartnerPage) {
  return page.status === "Published" ? "Live URL" : "Preview URL";
}

export function slugFromName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function uniqueSlug(name: string, taken: string[]) {
  const base = slugFromName(name) || "page";
  if (!taken.includes(base)) {
    return base;
  }
  let suffix = 2;
  while (taken.includes(`${base}-${suffix}`)) {
    suffix += 1;
  }
  return `${base}-${suffix}`;
}
