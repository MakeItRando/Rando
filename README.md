# Rondo

**Find your next repeat.**

Rondo is an independent music-discovery and listening product. **Discover** is the quick, song-first home; **Journeys** is the deeper route through a genre, its artists, releases, and tracks; any song can open in the artwork-adaptive **Song Room**.

Rondo owns its product language, discovery model, journeys, library, queue, player, memory, personalization, and brand. Production catalog, audio, metadata, artwork, and lyrics will enter through replaceable authorized connectors rather than coupling the experience to another music app.

## Repository status

| Surface | Reference | Status |
| --- | --- | --- |
| Stable runtime baseline | `eaafc4c` | v0.3.0 Song Room runtime on `main`; later `main` commits are canonical documentation only |
| Canonical documentation | current `main` HEAD | Operating guide, product specifications, production plan, QA evidence, and handoff |
| v0.3.2 candidate | [`89fc0d5`](https://github.com/MakeItRando/Rando/commit/89fc0d5d352db31ab90ff7d5b25b698db8e8c6cf) | Final pre-test candidate on `rondo-v031-user-ready` |
| Review | [draft PR #5](https://github.com/MakeItRando/Rando/pull/5) | Open, draft, and intentionally unmerged pending product-owner testing and acceptance |
| QA evidence | [`dbe315e`](https://github.com/MakeItRando/Rando/commit/dbe315e6ad1687537594a80da566af44645c764f) | Exact-head results, logs, 18 screenshots, report, and contact sheet |
| Portable preview | [`873fbbe`](https://github.com/MakeItRando/Rando/commit/873fbbeb1d209889250825b054b235b8493b4e05) | Test-only preview branch; exact HTML blob `759a9df` |

## Current readiness

The engineering pre-test gate is **green** for candidate `89fc0d5`:

- [workflow run `34332141798`](https://github.com/MakeItRando/Rando/actions/runs/34332141798/job/102403183216) passed the clean install, high-severity dependency audit, build, static/unit checks, all 12 browser suites, and visual capture;
- all 18 final desktop/mobile/compact/Light/Reduced Motion captures were manually inspected and accepted;
- the 58 changed files were reviewed for credential patterns with zero findings;
- the exact portable-preview blob passed a 37-check runtime audit over HTTP with zero page, console, request, or HTTP errors;
- candidate, evidence, preview, PR, and canonical handoff agree.

This means the candidate is ready for the product owner's experience test. It does **not** mean the candidate is accepted or merged. PR #5 stays draft and unmerged until explicit approval.

## Test preview

[Open the Rondo v0.3.2 candidate](https://htmlpreview.github.io/?https://raw.githubusercontent.com/MakeItRando/Rando/rondo-v031-preview/rondo-v031-preview.html)

The preview deliberately uses the fictional catalog, local artwork, six original Rondo demo recordings, and browser-local persistence. Real artists, authorized production songs, production accounts, ingestion, backend services, and source credentials remain outside this experience gate.

## Confirmed production direction

- **Rondo everywhere:** Rondo is the canonical product and future technical name; migrate current `Rando` repository/infrastructure naming deliberately before production.
- **Broad catalog:** support artists and genres broadly through replaceable authorized source connectors, not a product tied to one app.
- **Large scale:** design for thousands of songs initially and millions without a UI/domain rewrite.
- **Legal source plan:** the product owner will supply the implementation-facing acquisition and authorization package before real-source work begins.
- **No payments in V1:** subscriptions, checkout, tips, artist billing, payment entitlements, taxes, refunds, disputes, and payouts are deferred.

## Product hierarchy

```text
Discover
  → search / editorial shelves / truthful recommendations / sounds
  → song → Song Room
  → compact links into Genre Journeys
Journeys
  → first visit: genre picker
  → genre page → songs / releases / artists
  → guided Artist Journey → release → track → completion
Library
  → saved artists / releases / tracks / moments / notes / progress
Profile
  → account and editable taste setup
Any song
  → Song Room → Room / About / Lyrics / Credits / Extra / Up next
```

## Product and scale contracts

- Discover opens directly and never starts with a genre chooser.
- Made for you is absent until genuine listening history exists.
- Journeys owns first-use genre selection, Change genre, and route-backed genre/artist exploration.
- Playback survives navigation; meaningful listening/Journey/Library state persists; dialogs, focus, hover, and animation state do not.
- Production clients receive bounded shelves and cursor-paginated results. They never receive, flatten, cache, or persist the complete catalog.
- Search becomes indexed, debounced, alias-aware, typo-tolerant, and rights-aware.
- Genre pages use one shared data-driven implementation; adding a genre must not require duplicated page code.
- Stable Rondo IDs and normalized provider-neutral entities remain the contract across source changes.

## Canonical implementation note

The v0.3.2 Discover contract lives in `src/ui/discoveryHub.js`. The older `renderDiscoverView()` in `src/ui/views.js` is dormant legacy code with superseded conceptual framing. Do not revive or adapt it into a second Discover implementation. Delete it before production catalog integration, after the accepted candidate is integrated and its callers are confirmed absent.

## Work on the project

Before changing anything, read:

1. [`AGENTS.md`](AGENTS.md)
2. [`handoff/STATE.md`](handoff/STATE.md)
3. [`handoff/HANDOFF_REPORT.md`](handoff/HANDOFF_REPORT.md)
4. [`handoff/DECISIONS.md`](handoff/DECISIONS.md)
5. [`handoff/PRODUCT_MAP.md`](handoff/PRODUCT_MAP.md)
6. [`handoff/QUALITY_GATES.md`](handoff/QUALITY_GATES.md)

Documentation and continuity records live on `main`. Test candidates remain on dedicated branches until accepted. Every meaningful product, design, architecture, data, branch, or QA change must update the relevant handoff files in the same work session.

## Local preview and checks

For the stable `main` prototype:

```bash
npm ci
npm run build:preview
npm run serve
```

Open `http://localhost:4173`, then run from another terminal:

```bash
RONDO_URL=http://127.0.0.1:4173/preview-test.html npm test
npm audit --audit-level=high
```

For v0.3.2, use the candidate branch's `package.json`, `.github/workflows/qa.yml`, and [`handoff/QUALITY_GATES.md`](handoff/QUALITY_GATES.md). Never infer candidate readiness from the stable `main` runtime.

## Canonical specifications

- [`docs/PRODUCT.md`](docs/PRODUCT.md) — product behavior and scope
- [`docs/DESIGN.md`](docs/DESIGN.md) — interface and interaction system
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — modules, connectors, and catalog-scale boundaries
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) — normalized entities, rights, scale, and state ownership
- [`docs/ONBOARDING.md`](docs/ONBOARDING.md) — account and taste setup
- [`docs/BRAND.md`](docs/BRAND.md) — identity and visual principles
- [`docs/PRODUCTION_PLAN.md`](docs/PRODUCTION_PLAN.md) — real-system, catalog, rights, scale, and deferred-payment plan

## Rights boundary

Public availability in Spotify, YouTube, Suno, or another app is not authorization. Production recordings, artwork, metadata, lyrics, biographies, and liner material require the permission represented by the product owner's legal/source plan. Secure accounts, source credentials, regional rights enforcement, authorized playback, and large-scale ingestion require a server-capable production deployment. Payments remain outside V1.
