# Page and feature specs

One file per page/feature. A spec is the contract a builder implements; the design study is its visual proof. Update the spec in the same commit as any change to the study, decision or code.

| # | Surface | Spec | Design study | Status |
| --- | --- | --- | --- | --- |
| 0 | Foundation (tokens, type, icons, player) | [../../handoff/DESIGN_PROGRAM.md](../../handoff/DESIGN_PROGRAM.md) | studies B → E | Settled in Home E |
| 1 | Home (desktop) | [HOME.md](HOME.md) | [home-e](../../design/studies/2026-10-05-home-e/README.md) | Rev 3 complete (D-058); rev 4 pending |
| 1b | Home (phone) | HOME.md § Phone (to write) | — | Not designed |
| 2 | Now Playing + lyrics/credits/queue | — | overlay inside home-e | Next |
| 3 | Playlists | [PLAYLISTS.md](PLAYLISTS.md) | study A (superseded) | Product spec only |
| 4 | Artist page | — | — | Not started |
| 5 | Journeys (picker, genre, artist journey) | — (see ../../handoff/PRODUCT_MAP.md) | — | Not started |
| 6 | Search | — | ⌘K palette in home-e | Not started |
| 7 | Library | — | — | Not started |
| 8 | Release / album | — | — | Not started |
| 9 | Profile & settings | — | profile menu in home-e | Not started |
| 10 | First run (play first, setup optional, D-045) | ../ONBOARDING.md | — | Not started |
| 11 | Following + notifications | [FOLLOWING.md](FOLLOWING.md) | bell panel in home-e | Product spec only |
| 12 | Dig (proposal) | — | lost 2026-10-07, redo | Proposal (OPEN_QUESTIONS Q12) |

## Template (copy for a new page)

```markdown
# Spec: <Page>
Status: draft | study | owner-approved (D-xxx) | built | verified. Decisions: D-…
## Job — what the listener comes here to do (one sentence)
## Sections, top → bottom — content, data source, actions, empty state
## States — loading, empty, error, offline/unavailable, long text, playing/paused
## Interactions & shortcuts — click, long-press/right-click, keyboard, focus order
## Responsive — 320 / 390 / 768 / 1024 / 1440
## Motion — what moves, duration, Reduced Motion fallback
## Scope — V1 local | V1 backend | V2 (accounts/payments)
## Data — entities/fields read and written
## Acceptance tests — what a browser test must prove
## Open questions
```
