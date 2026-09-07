import type { Metadata } from "next";

import { PublicDonationPage } from "@/components/public/public-donation-page";

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
}: PageProps<"/d/[slug]">) {
  const { slug } = await params;
  return <PublicDonationPage slug={slug} />;
}
