import { PartnerPlaceholderPage } from "@/components/partner/partner-placeholder-page";
import { requirePartnerPage } from "@/lib/require-partner";

export default async function DonationsPage({
  searchParams,
}: PageProps<"/donations">) {
  const { context, school, query } = requirePartnerPage(await searchParams);

  return (
    <PartnerPlaceholderPage
      title="Donations"
      userName={`${context.firstName} ${context.lastName}`}
      schoolName={school.name}
      query={query}
      context={context}
      activeNav="donations"
    />
  );
}
