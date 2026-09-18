export type DashboardSection = "overview" | "donations" | "allocation" | "users";

export type PagesSection = "pages" | "performance";

export function parsePagesView(value: unknown): PagesSection {
  return value === "performance" ? "performance" : "pages";
}

function partnerParams(query: string) {
  const params = new URLSearchParams(query);
  params.delete("view");
  params.delete("page");
  return params;
}

export function dashboardHref(query: string) {
  return `/dashboard?${partnerParams(query).toString()}`;
}

export function dashboardSectionHref(
  query: string,
  section: DashboardSection,
) {
  if (section === "donations") {
    return donationsHref(query);
  }
  if (section === "allocation") {
    return `/allocation?${partnerParams(query).toString()}`;
  }
  if (section === "users") {
    return `/users?${partnerParams(query).toString()}`;
  }
  return dashboardHref(query);
}

export function pagesHref(query: string) {
  return `/pages?${partnerParams(query).toString()}`;
}

export function pagePerformanceHref(query: string) {
  const params = partnerParams(query);
  params.set("view", "performance");
  return `/pages?${params.toString()}`;
}

export function pagesSectionHref(query: string, section: PagesSection) {
  return section === "performance"
    ? pagePerformanceHref(query)
    : pagesHref(query);
}

export function donationsHref(query: string, pageId?: string) {
  const params = new URLSearchParams(query);
  params.delete("view");
  if (pageId) {
    params.set("page", pageId);
  } else {
    params.delete("page");
  }
  return `/donations?${params.toString()}`;
}
