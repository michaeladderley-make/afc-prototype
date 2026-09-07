"use client";

import { PartnershipAgreementPrompt } from "@/components/partnership/partnership-agreement-prompt";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function PageBuilderWelcome({
  open,
  onOpenChange,
  email,
  school,
  query,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  school: string;
  query: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-lg"
        overlayClassName="bg-black/40 backdrop-blur-none supports-backdrop-filter:backdrop-blur-none"
      >
        <DialogHeader>
          <DialogTitle className="text-[28px] leading-[34px] font-medium tracking-[0.42px]">
            Welcome to your page builder!
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-3">
              <p>You can:</p>
              <ul className="list-disc space-y-1 pl-5 text-foreground">
                <li>Upload your school logo</li>
                <li>Upload your cover image</li>
                <li>Click to edit any text block</li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>
        <PartnershipAgreementPrompt
          email={email}
          school={school}
          query={query}
          from="page-builder"
        />
        <p className="text-xs tracking-[0.12px] text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground">
          If you have any issues, please contact us at{" "}
          <a href="mailto:support@afc.com">support@afc.com</a>
        </p>
        <DialogFooter className="gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Dismiss
          </Button>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
