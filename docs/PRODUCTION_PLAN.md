# Rondo production-system plan

This plan begins after the v0.3.2 experience candidate is approved. It records architecture direction, not a commitment to a specific framework or provider.

## Confirmed product-owner direction

- **Rondo** is the canonical name everywhere. Existing `Rando` repository URLs remain temporarily to preserve prototype history and will be migrated deliberately before production-facing naming is finalized.
- The intended catalog is broad across artists, genres, and legitimate source systems—not limited to one app or a small curated genre set.
- Design for thousands of songs at initial ingestion and millions without replacing the domain model or client architecture.
- The product owner will provide the legal acquisition and source-integration plan before real content integration begins.
- **V1 has no payments.** Payment infrastructure is deferred until a separately approved later phase.

## Goal

Replace the fictional static catalog and browser-only state with a secure, rights-aware system for real artists, releases, songs, accounts, search, playback, recommendations, editorial discovery, and large-scale operations—without changing Rondo's product identity.

## Proposed system boundary

```text
Web/mobile client
  → Rondo backend-for-frontend
    → identity and profile service
    → catalog and search service
    → rights/playback authorization service
    → recommendation/editorial service
    → library and Journey service
    → analytics/event pipeline
    → ingestion jobs and authorized source adapters
    → future payment/entitlement boundary (not V1)
```

The client never contains provider secrets, licensing rules, or unbounded catalog payloads. Source payloads are normalized before product code sees them.

## Real catalog and source ingestion

Rondo must support multiple replaceable, authorized source adapters. Examples may include licensed catalog providers, owner-supplied feeds, and verified artist/label ingestion, but the concrete path comes from the product owner's legal plan.

Public availability on Spotify, YouTube, Suno, or another app is not itself treated as authorization. No implementation should scrape, copy, store, or stream content merely because it is publicly reachable. Each enabled adapter must encode the supplied authorization, attribution, storage, territory, playback, and takedown rules.

Every catalog asset needs:

- a stable Rondo identity plus replaceable external IDs;
- source provenance and owner/contact record;
- territory and rights window;
- playback/preview/metadata/artwork/lyrics permissions kept separately;
- required attribution and reporting fields;
- correction, replacement, conflict, and takedown history.

## Catalog scale contract

The large-catalog design must avoid assumptions that work only for the 39-track prototype:

- canonical artist, alias, release-edition, recording, track, credit, genre, style, and territory entities;
- durable deduplication and merge/split workflows;
- idempotent, resumable background imports with queues, retries, dead-letter handling, and audit records;
- bulk validation and staged publication rather than editing production rows blindly;
- indexed search with typo tolerance, aliases, facets, ranking, and cursor pagination;
- bounded API responses and CDN-backed artwork/media delivery;
- lazy loading, list virtualization where appropriate, and no full-catalog client download;
- cache invalidation and incremental search-index updates;
- horizontal job/search/API scaling, load tests, quotas, and abuse controls;
- metrics for ingestion latency, catalog conflicts, search quality, playback authorization, and unavailable content.

Start with controlled batches to prove correctness and operations, while preserving a model that can expand to millions of tracks.

## Search and discovery

- normalize artists, aliases, releases, editions, tracks, genres, styles, credits, and identifiers;
- index only approved and available records;
- return availability and rights state with each result;
- separate editorial collections from algorithmic recommendations;
- label live/trending data with a source and update time;
- explain personal recommendations using real listening signals;
- avoid cold-start claims until enough history exists;
- keep result sets bounded and make deeper exploration intentional.

## Accounts, privacy, and continuity

- secure email/passkey or OAuth-based Rondo account;
- server-side sessions and device management;
- versioned taste profile and consent records;
- sync saves, moments, notes, Journey progress, queue context, volume, and accessibility preferences;
- export, deletion, privacy controls, and retention policy;
- encrypt sensitive data in transit and at rest;
- keep private notes private by default and out of recommendation training unless explicitly consented.

## Playback and rights

Playback authorization must check user, territory, asset, rights window, and source policy. Signed or source-issued playback references are short-lived. The system must support unavailable, preview-only, full-play, explicit-content, and region-blocked states without breaking navigation.

Lyrics, biographies, credits, artwork, and editorial material each have independent rights and attribution rules. Takedown and correction flows are required before launch.

## Recommendation layers

1. Editorial shelves: curated and fully explainable.
2. Content similarity: genre, style, credits, era, and release relationships.
3. Personal continuation: recent plays, saves, skips, completed Journeys, and explicit taste controls.
4. Exploration: a bounded unfamiliarity control with no endless autoplay trap.

“Because you liked…” appears only after genuine history exists. Ranking systems require offline evaluation, diversity constraints, freshness checks, and human review.

## Payments and entitlements

**V1 contains no payments.** Do not build subscriptions, checkout, tips, merchandise checkout, artist billing, payment entitlements, refunds, disputes, taxes, or payout systems into the V1 critical path.

Keep provider-neutral extension boundaries so a future approved phase can add payments without coupling them to catalog access, accounts, or playback state. If payments are reconsidered later, create a separate decision record and define the value proposition, territories, taxes, store policy, entitlements, refunds, disputes, and payout obligations before selecting a provider.

## Operational requirements

- environment separation and secret management;
- migrations, backups, restore tests, and audit logs;
- observability for API, search, playback, jobs, and ingestion;
- moderation, takedown, abuse, and support workflows;
- rate limits, cache strategy, background ingestion, and dead-letter handling;
- content and schema validation;
- feature flags and reversible rollouts;
- accessibility, performance, load, and security gates in CI.

## Delivery sequence

1. Approve the experience candidate.
2. Freeze the normalized domain contracts, scale contract, and source-adapter interfaces.
3. Receive the product owner's legal/source integration package and choose initial territories.
4. Build identity, database, search, job, object-storage/CDN, and Rondo API foundations.
5. Implement ingestion, normalization, deduplication, provenance, rights, and search with controlled batches.
6. Connect authorized playback and real metadata through the supplied path.
7. Migrate Library, Profile, Journeys, and notes from local state.
8. Add recommendation and editorial systems after real listening signals exist.
9. Load-test catalog/search/playback paths and prove rollback, takedown, correction, backup, and recovery operations.
10. Complete security, rights, privacy, accessibility, and production-readiness reviews before launch.
11. Revisit payments only after V1 and a new explicit product-owner decision.
