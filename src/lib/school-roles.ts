export const ROLE_OPTIONS = [
  { value: "principal", label: "Principal" },
  { value: "head-of-school", label: "Head of School" },
  { value: "chief-executive-officer", label: "Chief Executive Officer" },
  { value: "admissions-director", label: "Admissions Director" },
  { value: "business-director", label: "Business Director" },
] as const;

export type SchoolRole = (typeof ROLE_OPTIONS)[number]["value"];

export function isSchoolRole(role: string): role is SchoolRole {
  return ROLE_OPTIONS.some((option) => option.value === role);
}

export function getRoleLabel(role: string) {
  return ROLE_OPTIONS.find((option) => option.value === role)?.label ?? role;
}
