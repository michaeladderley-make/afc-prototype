# Partner settings must be read with useSyncExternalStore

- `usePartnerSettings` hooks originally seeded state from `defaultsFromContext` and then called `setSettings(...)` inside `useEffect`. On initial load the stored `localStorage` defaults never rendered — values only appeared after an unrelated re-render (e.g. typing in a field), which made global tracking-pixel inheritance look broken.
- `partner-settings.ts` already caches snapshots by serialized payload and exposes `subscribePageDefaults`, so `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)` is the intended pattern. It fixed initial load and cleared the `react-hooks/set-state-in-effect` lint errors.
- When verifying this in the Cursor browser, the snapshot returned by `browser_navigate` can be the pre-hydration render. Re-snapshot (or read `input.value` via CDP) before concluding that stored values are missing.
