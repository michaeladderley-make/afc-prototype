"use client";

import Link from "next/link";

import { FaqsLink } from "@/components/faqs/faqs-link";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

export function PublicHeader() {
  return (
    <div>
      <header className="flex w-full items-center justify-between bg-background px-16 py-6">
        <Link
          href="/"
          className="text-[21px] leading-[28px] font-medium text-foreground"
        >
          AFC
        </Link>
        <div className="flex items-center gap-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto px-0 text-sm font-normal text-muted-foreground hover:bg-transparent hover:text-foreground"
              >
                Need help?
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="rounded-[4px]">
              <PopoverHeader>
                <PopoverTitle>We’re here to help</PopoverTitle>
                <PopoverDescription>
                  If you need help completing this process, please reach out to
                  support at afc.com.
                </PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
          <FaqsLink />
        </div>
      </header>
      <Separator />
    </div>
  );
}
