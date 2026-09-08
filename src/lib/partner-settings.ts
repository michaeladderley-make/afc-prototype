import type { PartnerContext } from "@/lib/partner-context";

export const PIXEL_PROVIDERS = [
  {
    value: "ga4",
    label: "GA4",
    example: "G-XXXXXXXXXX",
    pattern: /^G-[A-Z0-9]+$/i,
    error: "Enter a GA4 ID like G-XXXXXXXXXX.",
  },
  {
    value: "meta",
    label: "Meta",
    example: "a numeric ID",
    pattern: /^\d+$/,
    error: "Enter a numeric Meta pixel ID.",
  },
  {
    value: "microsoft-uet",
    label: "Microsoft UET",
    example: "a numeric ID",
    pattern: /^\d+$/,
    error: "Enter a numeric Microsoft UET ID.",
  },
  {
    value: "google-ads",
    label: "Google Ads",
    example: "AW-XXXXXXXXX",
    pattern: /^AW-[A-Z0-9]+$/i,
    error: "Enter a Google Ads ID like AW-XXXXXXXXX.",
  },
] as const;

export type PixelProvider = (typeof PIXEL_PROVIDERS)[number]["value"];

export type PixelSettings = Record<PixelProvider, string>;

export function pixelExampleText(provider: PixelProvider) {
  const spec = PIXEL_PROVIDERS.find((item) => item.value === provider);
  return spec ? `Example: ${spec.example}` : "";
}

export function pixelIdError(provider: PixelProvider, value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const spec = PIXEL_PROVIDERS.find((item) => item.value === provider);
  if (!spec || spec.pattern.test(trimmed)) {
    return null;
  }
  return spec.error;
}

export type ContactInfo = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

type LegacyPixelSettings = {
  provider?: string;
  id?: string;
};

export function emptyPixelSettings(): PixelSettings {
  return {
    ga4: "",
    meta: "",
    "microsoft-uet": "",
    "google-ads": "",
  };
}

export function normalizePixelSettings(
  value?: (Partial<PixelSettings> & LegacyPixelSettings) | null,
): PixelSettings {
  const next = emptyPixelSettings();
  if (!value) {
    return next;
  }
  for (const provider of PIXEL_PROVIDERS) {
    const stored = value[provider.value];
    if (typeof stored === "string") {
      next[provider.value] = stored;
    }
  }
  if (value.id && value.provider) {
    const match = PIXEL_PROVIDERS.find(
      (provider) => provider.value === value.provider,
    );
    if (match && !next[match.value]) {
      next[match.value] = value.id;
    }
  }
  return next;
}

function migratePixelOverride(
  value?: (Partial<PixelSettings> & LegacyPixelSettings) | null,
): Partial<PixelSettings> | undefined {
  if (!value) {
    return undefined;
  }
  const next: Partial<PixelSettings> = {};
  for (const provider of PIXEL_PROVIDERS) {
    const stored = value[provider.value];
    if (typeof stored === "string") {
      next[provider.value] = stored;
    }
  }
  if (value.id && value.provider) {
    const match = PIXEL_PROVIDERS.find(
      (provider) => provider.value === value.provider,
    );
    if (match && next[match.value] === undefined) {
      next[match.value] = value.id;
    }
  }
  return Object.keys(next).length > 0 ? next : undefined;
}

export type MediaSettings = {
  added: boolean;
};

export type PageDefaults = {
  contact: ContactInfo;
  pixel: PixelSettings;
  logo: MediaSettings;
  cover: MediaSettings;
};

export type PageDefaultsOverride = {
  contact?: Partial<ContactInfo>;
  pixel?: Partial<PixelSettings>;
  logo?: Partial<MediaSettings>;
  cover?: Partial<MediaSettings>;
};

const GLOBAL_KEY = "afc-page-defaults";

function pageKey(pageId: string) {
  return `afc-page-defaults:${pageId}`;
}

const listeners = new Set<() => void>();

type GlobalCache = {
  serialized: string;
  contextKey: string;
  value: PageDefaults;
};

let globalCache: GlobalCache | null = null;
const pageOverrideCache = new Map<string, { serialized: string; value: PageDefaultsOverride }>();
const resolvedCache = new Map<string, { serialized: string; contextKey: string; value: PageDefaults }>();

function contextKey(context: PartnerContext) {
  return `${context.firstName}|${context.lastName}|${context.email}`;
}

function notify() {
  globalCache = null;
  pageOverrideCache.clear();
  resolvedCache.clear();
  listeners.forEach((listener) => listener());
}

export function subscribePageDefaults(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export const EMPTY_OVERRIDE: PageDefaultsOverride = {};

const defaultCache = new Map<string, PageDefaults>();

export function defaultsFromContext(context: PartnerContext): PageDefaults {
  const key = contextKey(context);
  const cached = defaultCache.get(key);
  if (cached) {
    cached.pixel = normalizePixelSettings(cached.pixel);
    return cached;
  }
  const value: PageDefaults = {
    contact: {
      firstName: context.firstName,
      lastName: context.lastName,
      phone: "",
      email: context.email,
    },
    pixel: emptyPixelSettings(),
    logo: {
      added: false,
    },
    cover: {
      added: false,
    },
  };
  defaultCache.set(key, value);
  return value;
}

function mergeDefaults(
  base: PageDefaults,
  override?: PageDefaultsOverride | null,
): PageDefaults {
  return {
    contact: { ...base.contact, ...override?.contact },
    pixel: normalizePixelSettings({
      ...emptyPixelSettings(),
      ...base.pixel,
      ...override?.pixel,
    }),
    logo: { ...base.logo, ...override?.logo },
    cover: { ...base.cover, ...override?.cover },
  };
}

export function getGlobalDefaults(context: PartnerContext): PageDefaults {
  const stored = window.localStorage.getItem(GLOBAL_KEY);
  const serialized = stored ?? "";
  const key = contextKey(context);
  if (
    globalCache &&
    globalCache.serialized === serialized &&
    globalCache.contextKey === key
  ) {
    return globalCache.value;
  }
  let parsed: PageDefaultsOverride | null = null;
  if (stored) {
    try {
      parsed = JSON.parse(stored) as PageDefaultsOverride;
    } catch {
      parsed = null;
    }
  }
  const value = parsed
    ? mergeDefaults(defaultsFromContext(context), parsed)
    : defaultsFromContext(context);
  globalCache = { serialized, contextKey: key, value };
  return value;
}

export function getPageOverride(pageId: string): PageDefaultsOverride {
  const stored = window.localStorage.getItem(pageKey(pageId));
  const serialized = stored ?? "";
  const cached = pageOverrideCache.get(pageId);
  if (cached && cached.serialized === serialized) {
    return cached.value;
  }
  let value: PageDefaultsOverride = EMPTY_OVERRIDE;
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as PageDefaultsOverride & {
        pixel?: Partial<PixelSettings> & LegacyPixelSettings;
      };
      const { pixel: storedPixel, ...rest } = parsed;
      const pixel = migratePixelOverride(storedPixel);
      value = pixel ? { ...rest, pixel } : rest;
    } catch {
      value = EMPTY_OVERRIDE;
    }
  }
  pageOverrideCache.set(pageId, { serialized, value });
  return value;
}

export function getResolvedPageDefaults(
  context: PartnerContext,
  pageId: string,
): PageDefaults {
  const global = getGlobalDefaults(context);
  const override = getPageOverride(pageId);
  const serialized = `${globalCache?.serialized ?? ""}|${pageOverrideCache.get(pageId)?.serialized ?? ""}`;
  const key = `${contextKey(context)}|${pageId}`;
  const cached = resolvedCache.get(key);
  if (cached && cached.serialized === serialized && cached.contextKey === key) {
    return cached.value;
  }
  const value = mergeDefaults(global, override);
  resolvedCache.set(key, { serialized, contextKey: key, value });
  return value;
}

export function saveGlobalDefaults(next: PageDefaults) {
  window.localStorage.setItem(GLOBAL_KEY, JSON.stringify(next));
  notify();
}

export function patchGlobalDefaults(
  context: PartnerContext,
  patch: PageDefaultsOverride,
) {
  const current = getGlobalDefaults(context);
  saveGlobalDefaults(mergeDefaults(current, patch));
}

export function patchPageDefaults(pageId: string, patch: PageDefaultsOverride) {
  const current = getPageOverride(pageId);
  const next: PageDefaultsOverride = {
    contact: { ...current.contact, ...patch.contact },
    pixel: migratePixelOverride({ ...current.pixel, ...patch.pixel }),
    logo: { ...current.logo, ...patch.logo },
    cover: { ...current.cover, ...patch.cover },
  };
  window.localStorage.setItem(pageKey(pageId), JSON.stringify(next));
  notify();
}

export function isContactOverridden(override: PageDefaultsOverride) {
  return Boolean(override.contact && Object.keys(override.contact).length > 0);
}

export function isPixelOverridden(override: PageDefaultsOverride) {
  return Boolean(override.pixel && Object.keys(override.pixel).length > 0);
}

export function clearPagePixelOverride(pageId: string) {
  const { pixel, ...rest } = getPageOverride(pageId);
  if (!pixel) {
    return;
  }
  window.localStorage.setItem(pageKey(pageId), JSON.stringify(rest));
  notify();
}

export function isLogoOverridden(override: PageDefaultsOverride) {
  return Boolean(override.logo && Object.keys(override.logo).length > 0);
}

export function isCoverOverridden(override: PageDefaultsOverride) {
  return Boolean(override.cover && Object.keys(override.cover).length > 0);
}
