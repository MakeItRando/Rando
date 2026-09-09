# Rondo production-system plan

This plan begins only after v0.3.2 experience approval. It is architecture direction, not a framework/provider commitment.

## Confirmed direction

- Rondo is canonical everywhere; migrate existing `Rando` technical names safely.
- Catalog is broad across artists/genres/legitimate sources and is not tied to one app.
- Start with thousands of songs and scale to millions without replacing domain/client contracts.
- Product owner supplies the legal acquisition/source-integration package before real content work.
- V1 has no payments.

## Goal

Replace fictional static catalog/browser-only state with a secure, rights-aware system for real artists, releases, songs, accounts, search, playback, recommendations, editorial discovery, and operations without changing Rondo's accepted product identity.

## Boundary

```text
Web/mobile client
  → Rondo backend-for-frontend
    → identity/profile
    → catalog/search
    → rights/playback authorization
    → editorial/recommendation
    → library/Journey
    → analytics/events
    → ingestion jobs + authorized adapters
    → future payment boundary (not V1)
```

Client contains no provider secrets, licensing decisions, unbounded payloads, or complete catalog. Adapters normalize before product code.

## Pre-production cleanup

After candidate acceptance and before real catalog integration:

1. integrate/rerun accepted v0.3.2;
2. remove dormant `renderDiscoverView()` from `src/ui/views.js` after confirming no caller;
3. keep `src/ui/discoveryHub.js` behavior as the canonical Discover contract while refactoring it behind normalized APIs;
4. replace hard-coded four-genre data/routes with one shared data-driven taxonomy/renderer;
5. freeze stable Rondo IDs, pagination envelopes, listener-state schema, route contracts, and adapter ports;
6. complete Rando-to-Rondo technical migration plan.

## Catalog/source ingestion

Concrete adapters come only from the owner's legal plan. Public availability on Spotify, YouTube, Suno, or another app does not authorize scraping/copying/storage/playback.

Every asset needs stable Rondo identity, replaceable external IDs, provenance/owner, territory/window, separate playback/preview/metadata/art/lyrics permissions, attribution/reporting, correction/conflict/takedown history.

Ingestion is idempotent/resumable and supports queues/retries/backpressure/dead letters/audit, bulk validation, staged publication, deduplication, aliases, merge/split, editions, versions, sourced credits, and incremental index/cache updates.

## Scale contract

- bounded APIs with conservative defaults and enforced maximum limits;
- opaque cursor pagination and stable deterministic sort;
- narrow list objects and separate detail endpoints;
- no unbounded `all`, offset-only deep pagination, recursive full trees, or complete-catalog export to clients;
- indexed search with aliases, typo tolerance, facets, ranking, rights/territory/explicit filters;
- client debounce, cancellation, stale-response protection, and bounded local cache;
- one shared Genre implementation driven by taxonomy/editorial configuration;
- dynamic per-page counts from metadata, no fixed global totals;
- lazy responsive artwork/media and accessible pagination/virtualization;
- no complete-catalog browser bundle, local-storage snapshot, recursive cursor fetch, or client flattening;
- CDN/object media delivery, horizontal workers/search/API, quotas/abuse controls, load tests, and observability.

Start with controlled batches while preserving the same model toward millions.

## Search and discovery

Index approved/available normalized artists, aliases, releases/editions, recordings/placements, genres/styles, credits, and identifiers. Return availability/rights summary with results. Separate editorial collections from algorithms. Label trends with source/time. Hide personal recommendation surfaces until genuine signals exist. Keep results bounded and explanations plain.

## Accounts, privacy, continuity

Secure Rondo account; server-side sessions/devices/recovery; versioned taste/consent; sync saves/moments/notes/Journeys/queue context/preferences; export/deletion/retention; encryption; private notes private by default and excluded from recommendation training absent explicit consent.

Listener state stores references and bounded windows—not catalog objects or full provider payloads. High-volume events use a separate partitioned pipeline.

## Playback and rights

Authorization checks listener, territory, asset, window, and source policy. Playback references are short-lived. Support unavailable/preview/full/explicit/region-blocked states without broken navigation. Lyrics, biographies, credits, art, and editorial material have independent rights/attribution. Correction/takedown is launch-critical.

## Recommendation layers

1. editorial shelves;
2. content similarity using supplied genre/style/credits/era/relationships;
3. personal continuation from plays/saves/skips/completed Journeys/explicit controls;
4. bounded exploration with no autoplay trap.

History-backed copy appears only after real history. Ranking requires offline evaluation, diversity/freshness constraints, bias/quality review, and human editorial oversight.

## Payments

V1 contains none: no subscription, checkout, tips, merchandise checkout, artist billing, payment entitlements, refunds, disputes, taxes, or payouts. Keep a clean future extension boundary only. Any later phase starts with a new owner decision and value/territory/store/tax/refund/entitlement/payout definition before provider selection.

## Operations

Environment separation, secret management, migrations/backups/restore tests, audit logs, API/search/playback/job observability, moderation/takedown/abuse/support, rate limits/cache strategy, schema/content validation, feature flags/reversible rollout, accessibility/performance/load/security/rights/privacy CI, SLOs, incident response, and recovery drills.

## Delivery sequence

1. Obtain experience acceptance and integrate with post-merge QA.
2. Complete canonical-renderer cleanup and Rondo naming plan.
3. Freeze normalized domain/API/pagination/state/adapter contracts.
4. Receive legal/source package and initial territories.
5. Build identity, database, search, jobs, object/CDN, and API foundations.
6. Implement controlled ingestion, normalization, deduplication, provenance, rights, search.
7. Connect authorized playback and real supplied metadata.
8. Migrate Library/Profile/Journeys/notes to server sync.
9. Add recommendations/editorial depth after real signals.
10. Load-test and prove rollback/takedown/correction/backup/recovery.
11. Complete security/rights/privacy/accessibility/production-readiness review.
12. Revisit payments only after V1 and a new explicit decision.

## Current gate

Candidate `89fc0d5` is green and ready for product-owner testing. Real-system implementation remains blocked on explicit experience acceptance.
