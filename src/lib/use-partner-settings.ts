"use client";

import { useSyncExternalStore } from "react";

import type { PartnerContext } from "@/lib/partner-context";
import {
  defaultsFromContext,
  EMPTY_OVERRIDE,
  getGlobalDefaults,
  getPageOverride,
  getResolvedPageDefaults,
  patchGlobalDefaults,
  patchPageDefaults,
  subscribePageDefaults,
  type PageDefaultsOverride,
} from "@/lib/partner-settings";

export function useGlobalDefaults(context: PartnerContext) {
  const settings = useSyncExternalStore(
    subscribePageDefaults,
    () => getGlobalDefaults(context),
    () => defaultsFromContext(context),
  );

  function update(patch: PageDefaultsOverride) {
    patchGlobalDefaults(context, patch);
  }

  return { settings, update };
}

export function usePageDefaults(context: PartnerContext, pageId: string) {
  const settings = useSyncExternalStore(
    subscribePageDefaults,
    () => getResolvedPageDefaults(context, pageId),
    () => defaultsFromContext(context),
  );
  const globalSettings = useSyncExternalStore(
    subscribePageDefaults,
    () => getGlobalDefaults(context),
    () => defaultsFromContext(context),
  );
  const override = useSyncExternalStore(
    subscribePageDefaults,
    () => getPageOverride(pageId),
    () => EMPTY_OVERRIDE,
  );

  function update(patch: PageDefaultsOverride) {
    patchPageDefaults(pageId, patch);
  }

  return { settings, globalSettings, override, update };
}
