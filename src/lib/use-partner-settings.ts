"use client";

import { useEffect, useState } from "react";

import type { PartnerContext } from "@/lib/partner-context";
import {
  defaultsFromContext,
  getGlobalDefaults,
  getPageOverride,
  getResolvedPageDefaults,
  patchGlobalDefaults,
  patchPageDefaults,
  subscribePageDefaults,
  type PageDefaults,
  type PageDefaultsOverride,
} from "@/lib/partner-settings";

export function useGlobalDefaults(context: PartnerContext) {
  const [settings, setSettings] = useState<PageDefaults>(() =>
    defaultsFromContext(context),
  );

  useEffect(() => {
    setSettings(getGlobalDefaults(context));
    return subscribePageDefaults(() => {
      setSettings(getGlobalDefaults(context));
    });
  }, [context]);

  function update(patch: PageDefaultsOverride) {
    patchGlobalDefaults(context, patch);
  }

  return { settings, update };
}

export function usePageDefaults(context: PartnerContext, pageId: string) {
  const [settings, setSettings] = useState<PageDefaults>(() =>
    defaultsFromContext(context),
  );
  const [override, setOverride] = useState<PageDefaultsOverride>({});

  useEffect(() => {
    setSettings(getResolvedPageDefaults(context, pageId));
    setOverride(getPageOverride(pageId));
    return subscribePageDefaults(() => {
      setSettings(getResolvedPageDefaults(context, pageId));
      setOverride(getPageOverride(pageId));
    });
  }, [context, pageId]);

  function update(patch: PageDefaultsOverride) {
    patchPageDefaults(pageId, patch);
  }

  return { settings, override, update };
}
