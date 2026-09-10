export type PartnerContext = {
  email: string;
  type: string;
  school: string;
  firstName: string;
  lastName: string;
  role: string;
};

export function partnerQuery(context: PartnerContext) {
  return new URLSearchParams(context).toString();
}

function asTrimmedString(value: string | string[] | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

export function optionalPartnerContext(searchParams: {
  email?: string | string[];
  type?: string | string[];
  school?: string | string[];
  firstName?: string | string[];
  lastName?: string | string[];
  role?: string | string[];
}): PartnerContext | null {
  const email = asTrimmedString(searchParams.email);
  const school = asTrimmedString(searchParams.school);
  const firstName = asTrimmedString(searchParams.firstName);
  const lastName = asTrimmedString(searchParams.lastName);
  const role = asTrimmedString(searchParams.role);
  if (!email || !school || !firstName || !lastName || !role) {
    return null;
  }
  return {
    email,
    type: asTrimmedString(searchParams.type) || "school",
    school,
    firstName,
    lastName,
    role,
  };
}
