import { PartnerSignIn } from "@/components/sign-in/partner-sign-in";
import { PublicHeader } from "@/components/registration/public-header";

export default function SignInPage() {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <PublicHeader />
      <main className="flex w-full flex-1 justify-center px-16 pt-24 pb-16">
        <PartnerSignIn />
      </main>
    </div>
  );
}
