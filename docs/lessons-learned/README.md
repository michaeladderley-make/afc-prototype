# Lessons Learned

Persistent knowledge accumulated by agents across tasks. Each entry captures something discovered during implementation that would help future sessions avoid the same mistake or find the right pattern faster.

**Pre-upgrade gate:** If your repo still has a monolithic `docs/lessons-learned.md`, complete the **lessons-learned-fragments** migration in your installed make-harness plugin (`docs/migrations/lessons-learned-fragments.md`) before upgrading to a harness binary that writes fragments.

## Purpose and identifiers

- Closeout writes **one file per run** under `runs/`.
- **Identifier equivalence:** artifact `tag` == frontmatter `run_id` == HTML `<!-- lessons-tag:{run_id} -->`.
- **Append-only:** never edit or delete existing run fragments; add new files only.
- **No secrets:** never record credentials, tokens, passwords, or identifiable personal data.

## Read order

1. This README (contract + optional archive manifest below).
2. Bounded enumeration of `docs/lessons-learned/runs/*.md` (see caps).
3. Optional `docs/lessons-learned/manual/*.md` (same sort, separate cap).
4. Optional archive files listed in the manifest when `runs/` budget is exhausted.

**Operational note:** When `runs/` exceeds ~500 entries, roll up older fragments into quarterly/archive files before relying on agent reads at scale.

## Caps

- **20** run fragments + **5** manual files maximum.
- **256 KiB lessons read budget** combined, counting **whole file bytes** (frontmatter + tags + body). Distinct from the runtime `lessons-file-large` warning at **1 MiB** total `runs/` bytes during closeout.
- Stop when **either** file-count cap **or** byte budget is exhausted; skip a whole file if it would exceed remaining bytes.

## Bounded enumeration

Listing `runs/*.md` basenames is allowed. The **20-file** and **256 KiB** caps apply to **body reads** (frontmatter + content), not to directory listing.

## Filename parse grammar

Strip `.md` → the `run_id` token is exactly **16** characters matching `^[0-9]{8}T[0-9]{6}Z$`; split on the first `-` after it (offset 17):

- If remainder contains `__`, split once into `{epic-slug, feature-slug}`.
- Else treat remainder as a single fallback slug.

Example: `20260519T100000Z-closeout__test.md` → epic `closeout`, feature `test`.

## Selection algorithm (when working in a feature folder)

Use **three tier-priority bounded passes**. Within each pass, prefer newer runs (basename descending) before older runs. Skip a whole file if including it would exceed the remaining byte budget.

1. **Tier 1 pass:** For each `runs/*.md` basename whose epic slug (from filename grammar) matches the active feature's epic, read frontmatter when needed to find an exact `feature_path` match. Include matches until the file-count or byte budget is exhausted.
2. **Tier 2 pass:** Include files not yet selected whose filename epic slug matches the active feature epic (filename-only tier 2).
3. **Tier 3 pass:** Include remaining `runs/*.md` files sorted by basename descending until caps trigger.

Do not fill the budget with tier-3 files while tier-1 matches for the active feature still fit within caps.

Missing/invalid frontmatter: still include within cap using filename metadata.

## Write paths

| Writer                | Path                                                                                               |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| Closeout orchestrator | `runs/{run_id}-{epic}__{feature}.md` or `runs/{run_id}-{slug}.md` for non-epic feature paths       |
| Ad-hoc compound step  | `manual/{YYYYMMDD}-{topic-slug}.md` (same slug rules; pattern `^manual/[0-9]{8}-[a-z0-9-]+\\.md$`) |

## Archive manifest (maintainers)

After quarterly rollup, add archive paths here for tier-4 reads:

| Path     | Covers |
| -------- | ------ |
| _(none)_ | —      |

## Forward compatibility

Unknown `fragment_schema_version` in frontmatter: still include within caps using filename metadata; ignore unrecognized keys.

## Migration

See the **lessons-learned-fragments** migration guide in your installed make-harness plugin (`docs/migrations/lessons-learned-fragments.md`).
