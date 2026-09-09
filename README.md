# Rondo

**Find your next repeat.**

Rondo is an independent music-discovery and listening product. **Discover** is the quick, song-first home; **Journeys** is the deeper path through a genre, its artists, releases, and tracks; any song can open in the artwork-adaptive **Song Room**.

Rondo is not a wrapper around another streaming app. It owns its product language, discovery model, journeys, library, queue, player, memory, personalization, and brand. Production catalog, audio, metadata, artwork, and lyrics will enter through replaceable authorized connectors.

## Repository status

| Surface | Reference | Status |
| --- | --- | --- |
| Stable runtime baseline | `eaafc4c` | v0.3.0 Song Room release; application files remain unchanged by the later documentation commits on `main` |
| Canonical documentation | current `main` HEAD | Operating guide, product specs, production plan, and complete handoff |
| Current experience candidate | [`rondo-v031-user-ready`](https://github.com/MakeItRando/Rando/tree/rondo-v031-user-ready) | v0.3.2; direct Discover, Journey genre pages, route-backed navigation, and UX polish |
| Review | [draft PR #5](https://github.com/MakeItRando/Rando/pull/5) | Intentionally unmerged until user testing and approval |
| Portable preview | [`rondo-v031-preview`](https://github.com/MakeItRando/Rando/tree/rondo-v031-preview) | Test-only preview branch |

The latest PR #5 check is currently red. Do **not** describe the candidate as test-ready or merge it until the full gate is green again and the rendered experience has been inspected.

## Product hierarchy

```text
Discover
  → search / recommendations / sounds → song → Song Room
  → compact links into Genre Journeys
Journeys
  → first visit: genre picker
  → genre page → songs / releases / artists
  → guided artist Journey → release → track → completion
Library
  → saved artists / releases / tracks / moments / notes / reveals
Profile
  → account and editable taste setup
Any song
  → Song Room → Room / About / Lyrics / Credits / Extra / Up next
```

## Prototype boundaries

The repository currently uses a fictional catalog, local artwork, six original Rondo demo recordings, and browser-local persistence. It does not yet include real artists, licensed commercial songs, production accounts, provider credentials, live charts, catalog ingestion, payments, or backend services.

The next product phase begins only after the experience candidate is approved: real artist and song data, authorized playback, secure accounts, search, ingestion, recommendations, and the production system.

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

The v0.3.2 candidate adds more browser and visual checks; use its own `package.json` and [`handoff/QUALITY_GATES.md`](handoff/QUALITY_GATES.md) as the release checklist.

## Canonical specifications

- [`docs/PRODUCT.md`](docs/PRODUCT.md) — product behavior and scope
- [`docs/DESIGN.md`](docs/DESIGN.md) — interface and interaction system
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — modules and connector boundaries
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) — normalized entities and state ownership
- [`docs/ONBOARDING.md`](docs/ONBOARDING.md) — account and taste setup
- [`docs/BRAND.md`](docs/BRAND.md) — identity and visual principles
- [`docs/PRODUCTION_PLAN.md`](docs/PRODUCTION_PLAN.md) — real-system, catalog, rights, and payment plan

## Rights boundary

Production recordings, artwork, metadata, lyrics, biographies, and liner material require authorization through licensed providers, official embeds where permitted, direct artist uploads, Creative Commons/public-domain material, or direct rights agreements. Secure accounts, provider credentials, regional rights enforcement, licensed playback, and payments require a server-capable production deployment.
