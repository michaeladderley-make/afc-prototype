export type DashboardView = "overview" | "performance";

export type DashboardSection =
  | DashboardView
  | "donations"
  | "allocation"
  | "users";

export function parseDashboardView(value: unknown): DashboardView {
  return value === "performance" ? "performance" : "overview";
}

function partnerParams(query: string) {
  const params = new URLSearchParams(query);
  params.delete("view");
  params.delete("page");
  return params;
}

export function dashboardHref(
  query: string,
  view: DashboardView = "overview",
) {
  const params = partnerParams(query);
  if (view === "performance") {
    params.set("view", "performance");
  }
  return `/dashboard?${params.toString()}`;
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
  return dashboardHref(query, section);
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
