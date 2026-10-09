# Page and feature specs

One file per page/feature. A spec is the contract a builder implements; the design study is its visual proof. Update the spec in the same commit as any change to the study, decision or code.

Motion and polish are deferred to one pass on the real apps (D-073): see [../MOTION.md](../MOTION.md).

| # | Surface | Spec | Design study | Status |
| --- | --- | --- | --- | --- |
| 0 | Foundation (tokens, type, icons, player) | [../../handoff/DESIGN_PROGRAM.md](../../handoff/DESIGN_PROGRAM.md) | studies B → E | Settled in Home E |
| 1 | Home (desktop) | [HOME.md](HOME.md) | [home-e](../../design/studies/2026-10-05-home-e/README.md) | Rev 4 approved (D-065) |
| 1b | Home (phone) | [HOME.md § Phone](HOME.md) | home-e rev 4 (≤640 px) | Rev 4 approved (D-065) |
| 2 | Now Playing + lyrics/credits/queue | [NOW_PLAYING.md](NOW_PLAYING.md) | home-e rev 7 | Approved (D-068) |
| 3 | Playlists (page) + Radio page | [PLAYLISTS.md](PLAYLISTS.md), [FEATURE_PLAN.md § Radio](FEATURE_PLAN.md) | home-e rev 11 | Proposed (D-072) |
| 4 | Artist page | [ARTIST.md](ARTIST.md) | home-e rev 12–12.1 | Approved (D-074, D-075) |
| 5 | Journeys (picker, genre, artist journey) | [JOURNEYS.md](JOURNEYS.md) | home-e rev 8 | Approved (D-069) |
| 5b | Stamps, passport, share cards (Journey engagement) | [STAMPS_PASSPORT.md](STAMPS_PASSPORT.md) | home-e rev 9 | Approved direction (D-070) |
| 5c | Feature plan (where every idea lives) + listening flow (radio, Keep going, Pick up, Add similar) | [FEATURE_PLAN.md](FEATURE_PLAN.md) | home-e rev 10 | Proposed (D-071) |
| 6 | Search | [EXPLORE.md](EXPLORE.md) (search lives in Explore) | ⌘K palette + Explore header in home-e | Search page built (D-067) |
| 6b | Explore | [EXPLORE.md](EXPLORE.md) | home-e rev 5–6 | Approved (D-066); search page, Rabbit hole, Save a tune built (D-067) |
| 7 | Library | — | — | Not started |
| 8 | Release / album | [RELEASE.md](RELEASE.md) | home-e rev 13 | Approved (D-076) |
| 9 | Profile & settings | — | profile menu in home-e | Not started |
| 10 | First run (play first, setup optional, D-045) | ../ONBOARDING.md | — | Not started |
| 11 | Following + notifications | [FOLLOWING.md](FOLLOWING.md) | bell panel in home-e | Product spec only |
| 12 | Dig | [HOME.md § Dig](HOME.md) | home-e rev 4 | Approved (D-061, D-065) |

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
