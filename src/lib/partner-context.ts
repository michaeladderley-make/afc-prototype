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
