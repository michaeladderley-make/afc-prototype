import { redirect } from "next/navigation";

import { getSchoolById, type School } from "@/lib/mock-schools";
import { partnerQuery, type PartnerContext } from "@/lib/partner-context";

type PartnerSearchParams = {
  email?: string | string[];
  type?: string | string[];
  school?: string | string[];
  firstName?: string | string[];
  lastName?: string | string[];
  role?: string | string[];
};

function asString(value: string | string[] | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

export function requirePartnerPage(searchParams: PartnerSearchParams): {
  context: PartnerContext;
  school: School;
  query: string;
} {
  const workEmail = asString(searchParams.email);
  const registrantType = asString(searchParams.type) || "school";
  const selectedSchoolId = asString(searchParams.school);
  const givenName = asString(searchParams.firstName);
  const familyName = asString(searchParams.lastName);
  const schoolRole = asString(searchParams.role);
  const school = getSchoolById(selectedSchoolId);

  if (!workEmail || !school || !givenName || !familyName || !schoolRole) {
    redirect("/");
  }

  const context = {
    email: workEmail,
    type: registrantType,
    school: school.id,
    firstName: givenName,
    lastName: familyName,
    role: schoolRole,
  };

  return {
    context,
    school,
    query: partnerQuery(context),
  };
}
