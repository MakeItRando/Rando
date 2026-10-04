# Rondo production-system plan

This plan begins only after experience approval, accepted-code integration and the required quality gates. It is architecture direction, not a framework/provider commitment.

## Confirmed direction

Rondo is canonical everywhere; migrate existing `Rando` technical names deliberately. Support a broad legitimate catalog rather than one source app. Start with thousands of songs, scale to millions without replacing domain/client contracts. The product owner supplies an implementation-facing legal/source package before real content integration. **V1 has no payments.**

## Goal and boundary

Replace fictional static catalog/browser-only state with a secure rights-aware system for real artists, releases, songs, accounts, search, playback, recommendations, editorial discovery and operations without losing the accepted product identity.

```text
Web/mobile client
  → Rondo backend-for-frontend
    → identity/profile and library/Journey state
    → catalog/search
    → rights/playback authorization
    → editorial/recommendation
    → analytics/events
    → ingestion jobs + authorized adapters
    → future payment boundary (not V1)
```

No provider secrets, licensing decisions, unbounded payloads or complete catalog in client. Normalize in adapters before product code.

## Pre-production cleanup

After candidate acceptance and before real catalog integration:

1. Integrate accepted candidate and rerun post-merge QA; recheck live mergeability and exact-head evidence before merge.
2. Remove old `renderDiscoverView()` from `src/ui/views.js` after confirming callers and preserve `src/ui/discoveryHub.js` behavior behind normalized services.
3. Move Journey/Global session ownership out of `src/ui/playbackContexts.js`/`journeyStateGuard.js` DOM/event compatibility glue into first-class store/audio controller commands; one physical engine, two logical resumable sessions and source-derived bounded queues. Migrate old local keys and test both restorations.
4. Replace fixed four-genre data/routes with one shared data-driven taxonomy/renderer, not per-genre code.
5. Define deep-linkable Release route deliberately if required: current chapter changes state rather than proving independent hash navigation.
6. Freeze stable Rondo IDs, bounded pagination envelopes, listener-state schema, route contracts and adapter ports; plan technical `Rando`→Rondo migration.

## Catalog/source ingestion

Concrete adapters come only from the owner's legal package. Public availability on Spotify, YouTube, Suno or another app does not authorize copying, scraping, storing or playback. Every asset needs stable Rondo identity, replaceable external IDs, provenance/owner, territory/window, separate playback/preview/metadata/art/lyrics permissions, attribution/reporting and correction/takedown history. Ingestion must be idempotent/resumable with queues, retries/backpressure, dead letters/audit, bulk validation, staged publication, deduplication, aliases, merge/split, editions, versions, sourced credits and incremental index/cache updates.

## Scale, search and discovery

Bounded APIs with conservative defaults/enforced maximums, opaque cursor/stable deterministic sorting, narrow list entities with separate detail endpoints; never unbounded `all`, recursive full trees, complete-catalog client export, offset-only deep pagination or browser flattening. Indexed search covers aliases, typo tolerance, facets, ranking, rights/territory/explicit filters; client debounce/cancellation/stale-response protection and bounded cache. Dynamic per-page counts, no fixed global totals. One shared Genre renderer; lazy responsive art/media and accessible pagination/virtualization. Object/CDN media, horizontally scalable workers/search/API, quotas/abuse controls, load tests and observability. Controlled batches first; same model toward millions.

Index approved available artists, aliases, releases/editions, recordings/placements, genres/styles, credits and identifiers. Return playability/rights summaries. Editorial collections differ from algorithms; trend claims need source/time. Personal recommendation surfaces require actual signals and plain explanations, not cold-start fabrication.

## Accounts, privacy and continuity

Secure Rondo account and server-side sessions/devices/recovery; versioned taste/consent; sync saves/moments/notes/Journeys and both session references/preferences; export/deletion/retention/encryption. Private notes remain private by default and excluded from recommendation training absent explicit consent. Listener records keep bounded IDs/windows, not catalog objects or provider payloads. High-volume events use separate partitioned retention. Current localStorage prototype implements none of the secure account/sync guarantees.

## Playback and rights

Authorization checks listener, territory, asset, time window and source policy at request time; playback references are short-lived. Model unavailable/preview/full/explicit/region-blocked states without breaking navigation. Lyrics, biography, credits, artwork and editorial text have independent permissions/attribution. Correction/takedown is launch-critical. One physical audio engine renders whichever Journey or Global session is active; navigating a page does not change the context. Rights changes can invalidate queued tracks gracefully.

## Recommendation layers

1. Editorial shelves.
2. Content similarity from supplied genre/style/credits/era/relationships.
3. Personal continuation from genuine plays/saves/skips/completed Journeys/explicit controls.
4. Bounded exploration without autoplay traps.

Ranking needs offline evaluation, diversity/freshness and bias/quality review with editorial oversight. Claims such as “Because you liked” require real evidence.

## Payments

V1 contains none: no subscription, checkout, tips, merchandise checkout, artist billing, payment entitlements, refunds, disputes, taxes or payouts. Preserve only a clean future extension boundary. A later phase requires a new owner decision on value, territory, currencies, store rules, cancellation, refunds, entitlement, tax and payout obligations before compliant provider selection.

## Operations

Environment separation, secret management, migrations, backup/restore drills, audit logs, API/search/playback/job observability, moderation/takedown/abuse/support, rate limits/cache strategy, schema/content validation, feature flags/reversible rollout, accessibility/performance/load/security/rights/privacy CI, SLOs, incidents and recovery.

## Delivery sequence

1. Obtain explicit owner experience acceptance, integrate candidate with post-merge QA.
2. Clean canonical renderer, production session ownership and Rondo naming plan.
3. Freeze normalized domain/API/pagination/state/adapter contracts.
4. Receive legal/source package and initial territory/platform requirements.
5. Build identity, database, search, jobs, object/CDN and API foundations.
6. Ingest controlled authorized catalog with normalization, provenance, rights and search.
7. Connect authorized playback/metadata and server-synced Library/Profile/Journeys/notes.
8. Evaluate real recommendation/editorial signals and load/recovery/takedown behavior.
9. Complete security, rights, privacy, accessibility and production-readiness review.
10. Revisit payments only after V1 and a separate explicit decision.

## Current gate (reviewed 2026-10-03)

Draft PR #5 candidate d9bc54f passes existing automation but has new reproduced playback/source-queue blockers. Experience acceptance is not currently ready. Fix B-001/B-002, remediate main dependency/CI policy and rerun expanded exact-head/manual/published gates before owner testing, accepted merge and production-system work. Living Record PR #9 is rejected; original Rondo is the foundation. See ../handoff/STATE.md and ../handoff/AUDIT_2026-10-04.md.
