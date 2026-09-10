import { ExperiencePicker } from "@/components/prototype/experience-picker";
import { PublicHeader } from "@/components/registration/public-header";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <PublicHeader />
      <ExperiencePicker />
    </div>
  );
}
