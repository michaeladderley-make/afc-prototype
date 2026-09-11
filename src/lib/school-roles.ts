export const ROLE_OPTIONS = [
  { value: "principal", label: "Principal" },
  { value: "development-officer", label: "Development officer" },
  { value: "athletic-director", label: "Athletic director" },
  { value: "other", label: "Other" },
] as const;

export type SchoolRole = (typeof ROLE_OPTIONS)[number]["value"];

export function isSchoolRole(role: string): role is SchoolRole {
  return ROLE_OPTIONS.some((option) => option.value === role);
}

export function getRoleLabel(role: string) {
  return ROLE_OPTIONS.find((option) => option.value === role)?.label ?? role;
}
