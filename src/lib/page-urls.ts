import { isLivePageStatus, type PartnerPage } from "@/lib/mock-pages";

export const PAGE_URL_BASE = "donations.afc.com/";

export function publicDonationPath(slug: string) {
  return `/d/${slug}`;
}

export function publicDonationUrl(slug: string) {
  return `https://${PAGE_URL_BASE}${slug}`;
}

export function liveDonationUrl(slug: string) {
  if (typeof window === "undefined") {
    return publicDonationUrl(slug);
  }
  return `${window.location.origin}${publicDonationPath(slug)}`;
}

function pageUrl(page: PartnerPage) {
  const path = isLivePageStatus(page.status)
    ? page.slug
    : `preview/${page.slug}`;
  return `${PAGE_URL_BASE}${path}`;
}

export function pageShareUrl(page: PartnerPage) {
  if (isLivePageStatus(page.status)) {
    return liveDonationUrl(page.slug);
  }
  return `https://${pageUrl(page)}`;
}

export function pageUrlLabel(page: PartnerPage) {
  return isLivePageStatus(page.status) ? "Live URL" : "Preview URL";
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
