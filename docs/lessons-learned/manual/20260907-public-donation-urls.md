# Public donation URLs

- Stored `afc-pages` entries created before slugs existed have no `slug`. Backfill from `page.id`, not `slugFromName(name)`, or `/d/lincoln-high` will miss a published Lincoln High page that resolved as `lincoln-high-school`.
- Do not render `window.location.origin` during SSR for share URLs. Use `useSyncExternalStore` (server snapshot = branded URL, client snapshot = origin + `/d/{slug}`) so the public page does not hydration-mismatch.
