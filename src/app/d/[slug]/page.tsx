import type { Metadata } from "next";

import { PublicDonationPage } from "@/components/public/public-donation-page";
import { optionalPartnerContext } from "@/lib/partner-context";

export async function generateMetadata({
  params,
}: PageProps<"/d/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Donate | ${slug}`,
    description: "Public donation page for AFC Scholarship Fund partners",
  };
}

export default async function PublicDonationRoute({
  params,
  searchParams,
}: PageProps<"/d/[slug]">) {
  const { slug } = await params;
  const query = await searchParams;
  const promote = query.promote;
  return (
    <PublicDonationPage
      slug={slug}
      partnerContext={optionalPartnerContext(query)}
      openPromote={promote === "1" || promote === "true"}
    />
  );
}
