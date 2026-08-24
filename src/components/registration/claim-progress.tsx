import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const STEPS = [
  "Getting Started",
  "Select School",
  "Claim School",
  "Review & Complete",
] as const;

export function ClaimProgress({
  currentStep = 1,
  currentFill = 1,
  mutedUpcoming = false,
}: {
  currentStep?: number;
  currentFill?: number;
  mutedUpcoming?: boolean;
}) {
  return (
    <section className="flex w-full flex-col gap-2.5 bg-background px-16 py-3">
      <p className="text-sm font-medium tracking-[0.07px] text-foreground">
        Step {currentStep} of {STEPS.length}
      </p>
      <div className="flex w-full items-center gap-3">
        {STEPS.map((label, index) => {
          const stepNumber = index + 1;
          const isCurrent = stepNumber === currentStep;
          const isComplete = stepNumber < currentStep;
          const fill = isComplete ? 1 : isCurrent ? currentFill : 0;
          return (
            <Progress
              key={label}
              value={Math.min(fill, 1) * 100}
              aria-label={label}
              className="min-w-0 flex-1"
            />
          );
        })}
      </div>
      <div className="flex w-full gap-3 text-xs tracking-[0.12px]">
        {STEPS.map((label, index) => {
          const isCurrent = index + 1 === currentStep;
          return (
            <p
              key={label}
              className={cn(
                "min-w-0 flex-1 leading-3",
                isCurrent || !mutedUpcoming
                  ? "font-medium text-foreground"
                  : "font-normal text-muted-foreground",
              )}
            >
              {label}
            </p>
          );
        })}
      </div>
    </section>
  );
}
