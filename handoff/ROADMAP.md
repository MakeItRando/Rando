# Rondo roadmap: prototype, scalable V1, and V2

Dates are intentionally omitted until the product owner confirms team capacity, launch territory, platform scope, and the implementation-facing legal/source package.

## Confirmed roadmap inputs

- Rondo is the canonical name everywhere; migrate existing `Rando` technical names deliberately before production-facing release.
- The eventual catalog should cover artists and genres broadly, independent of a single source app.
- Build for thousands of songs at initial rollout and millions without changing the product model.
- The product owner will provide the legal acquisition/source plan before real ingestion work begins.
- V1 has no payments.

## Phase 0 — Experience approval

**Goal:** finish and validate the v0.3.2 candidate before real-system complexity begins.

- repair the latest failing QA check;
- run clean install, audit, build, unit, and browser suites;
- inspect Discover, picker, four prototype Genre pages, Artist Journey, release, Song Room, Library, Profile, mobile, compact, Light/Night, and Reduced Motion;
- test with the product owner on desktop and phone;
- resolve feedback without weakening the confirmed structure;
- merge the accepted candidate into `main` with a clean release history;
- update all handoff/version records.

**Exit:** explicit user approval and green release evidence.

## Phase 1 — Production and scale foundation

**Goal:** create secure infrastructure while preserving the accepted UI contracts and avoiding prototype-scale assumptions.

- complete the planned Rando-to-Rondo technical naming migration;
- choose web application framework and hosting based on requirements, not fashion;
- define normalized Rondo API and source-adapter contracts;
- provision relational/domain storage, search index, object storage/CDN, background jobs, migrations, environments, secrets, backups, and observability;
- implement secure identity, sessions, device management, and account recovery;
- migrate prototype preferences and Journey state into versioned server data;
- require bounded APIs, cursor pagination, lazy assets, idempotent jobs, and rate limits;
- add feature flags and reversible deployments;
- establish privacy, security, accessibility, load, and incident-response baselines.

**Exit:** authenticated empty product shell with safe persistence, indexed empty catalog, ingestion pipeline skeleton, and operational controls.

## Phase 2 — Real artists, releases, songs, and rights

**Goal:** replace fictional records through the product owner's authorized legal/source path.

- receive and translate the legal/source plan into explicit connector, territory, storage, playback, attribution, reporting, correction, and takedown rules;
- implement replaceable authorized source adapters rather than hard-coding Spotify, YouTube, Suno, or any other app into product logic;
- build resumable ingestion, validation, normalization, deduplication, merge/split, correction, and staged-publication workflows;
- represent artists, aliases, releases, editions, recordings, tracks, credits, identifiers, genres, styles, artwork, lyrics, and territorial availability;
- add rights windows, provenance, attribution, takedown, and audit records;
- implement rights-aware playback authorization;
- build production search and unavailable/preview/full-play states;
- prove controlled batches first, then scale ingestion and search from thousands toward millions.

**Exit:** authorized real content can be ingested at scale, searched, browsed, played where allowed, corrected, and removed safely.

## Phase 3 — V1 listener product

**Goal:** launch the complete `find → play → explore → keep` loop without payment complexity.

- real Discover with editorial shelves and source-labeled trends;
- server-synced Genre Journeys and progress across an editable large taxonomy;
- real Artist and Release pages;
- authorized Song Room playback, credits, lyrics/context where permitted;
- Library sync for songs, releases, artists, moments, and private notes;
- explainable onboarding and taste controls;
- indexed, typo-tolerant, paginated search across the broad catalog;
- accessible responsive web experience;
- analytics with consent, data minimization, and product-quality dashboards;
- support, privacy export/deletion, moderation, correction, and takedown operations;
- catalog/search/playback load tests and recovery drills.

**V1 exclusions:** all payments; social feed; public comments; follower counts; collaborative listening; fake AI DJ; manipulative streaks; unsupported live-analysis claims; and content outside the supplied legal path.

## Phase 4 — Recommendation and editorial depth

**Goal:** improve discovery only after real catalog and listening signals exist.

- editorial collections and genre experts;
- content similarity using genre, style, credits, era, and release relationships;
- personal continuation using plays, saves, skips, completed Journeys, and explicit controls;
- “Because you liked…” after genuine history;
- bounded exploration slider and diversity/freshness constraints;
- offline ranking evaluation and human editorial review;
- artist/label editorial submissions with review workflow.

**Exit:** recommendations are useful, explainable, diverse, and not fabricated.

## Phase 5 — Catalog and operational maturity

**Goal:** make broad catalog growth routine rather than risky.

- horizontally scale ingestion workers, search, API, and media delivery;
- incremental reindexing and cache invalidation;
- bulk rights-window and territory updates;
- duplicate/edition resolution tools and full audit history;
- source health, freshness, conflict, and attribution dashboards;
- SLOs for search, playback authorization, ingestion, and takedowns;
- abuse controls, quotas, backpressure, dead-letter recovery, and incident drills;
- catalog quality sampling across genres, regions, scripts, and accessibility states.

## Deferred beyond V1 — payments

Payments are explicitly excluded from V1. Do not prebuild checkout, subscriptions, tips, artist billing, payment entitlements, taxes, refunds, disputes, or payouts.

If the product owner later opens a payment phase, first decide what value is paid for, territories/currencies, platform-store rules, cancellation/refunds, artist obligations, and entitlement behavior. Then use a PCI-compliant provider, verified idempotent webhooks, an auditable entitlement ledger, transparent prices, and no dark patterns.

## V2 opportunities

Only prioritize after V1 evidence:

- artist/label portal with verified profiles and release management;
- deeper release editions, liner material, credits, and source-linked context;
- offline-capable listening where rights permit;
- native mobile apps if web usage proves the need;
- multilingual interface and licensed lyric translation;
- accessibility profiles and cross-device continuity;
- editorial programming, guest curators, and regional scenes;
- collaborative or social features only if they support listening rather than feed growth;
- a separately approved payment model, if proven useful.

## Roadmap guardrails

- Do not start Phase 2 before Phase 0 approval.
- Do not implement a source connector until the product owner's legal/source package defines the allowed integration.
- Do not treat public availability in another app as authorization.
- Do not load or render an unbounded catalog in the browser.
- Do not claim live charts without a named source and timestamp.
- Do not add personalization without real signals and evaluation.
- Do not add payments to V1.
- Update this file whenever scope, order, scale assumptions, or owner decisions change.
