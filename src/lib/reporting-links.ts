export type DashboardView = "overview" | "performance";

export function parseDashboardView(value: unknown): DashboardView {
  return value === "performance" ? "performance" : "overview";
}

export function dashboardHref(
  query: string,
  view: DashboardView = "overview",
) {
  const params = new URLSearchParams(query);
  if (view === "performance") {
    params.set("view", "performance");
  } else {
    params.delete("view");
  }
  params.delete("page");
  return `/dashboard?${params.toString()}`;
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
