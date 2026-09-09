# Rondo roadmap: prototype, V1, V2, and payments

Dates are intentionally omitted until the product owner confirms scope, catalog path, team capacity, and launch territory.

## Phase 0 — Experience approval

**Goal:** finish and validate the v0.3.2 candidate before real-system complexity begins.

- repair the latest failing QA check;
- run clean install, audit, build, unit, and browser suites;
- inspect Discover, picker, four Genre pages, Artist Journey, release, Song Room, Library, Profile, mobile, compact, Light/Night, and Reduced Motion;
- test with the product owner on desktop and phone;
- resolve feedback without weakening the confirmed structure;
- merge the accepted candidate into `main` with a clean release history;
- update all handoff/version records.

**Exit:** explicit user approval and green release evidence.

## Phase 1 — Production foundation

**Goal:** create secure infrastructure while preserving the accepted UI contracts.

- choose web application framework and hosting based on requirements, not fashion;
- define Rondo API and normalized domain contracts;
- provision database, migrations, environments, secrets, backups, and observability;
- implement secure identity, sessions, device management, and account recovery;
- migrate prototype preferences and Journey state into versioned server data;
- add feature flags and reversible deployments;
- establish privacy, security, accessibility, and incident-response baselines.

**Exit:** authenticated empty product shell with safe persistence and operational controls.

## Phase 2 — Real artists, releases, songs, and rights

**Goal:** replace fictional records with authorized data.

- decide first catalog path: direct artist uploads, licensed provider, or hybrid;
- build ingestion, validation, normalization, deduplication, and correction workflows;
- represent artists, aliases, releases, editions, tracks, credits, identifiers, genres, styles, artwork, lyrics, and territorial availability;
- add rights windows, provenance, attribution, takedown, and audit records;
- implement rights-aware playback authorization;
- build production search and unavailable/preview/full-play states;
- seed a small, high-quality, legally cleared launch catalog before scaling.

**Exit:** real content can be searched, browsed, played where authorized, corrected, and removed safely.

## Phase 3 — V1 listener product

**Goal:** launch the complete `find → play → explore → keep` loop.

- real Discover with editorial shelves and source-labeled trends;
- server-synced Genre Journeys and progress;
- real Artist and Release pages;
- authorized Song Room playback, credits, lyrics/context where licensed;
- Library sync for songs, releases, artists, moments, and private notes;
- explainable onboarding and taste controls;
- accessible responsive web experience;
- analytics with consent, data minimization, and product-quality dashboards;
- support, privacy export/deletion, moderation, and takedown operations.

**V1 exclusions unless re-approved:** social feed, public comments, follower counts, collaborative listening, fake AI DJ, manipulative streaks, and unsupported live-analysis claims.

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

## Phase 5 — Payments and entitlements

**Goal:** monetize proven value without degrading trust.

No model is confirmed. Evaluate:

1. listener subscription;
2. artist/label tools or services;
3. direct support, memberships, tips, tickets, or merchandise;
4. transparent hybrid.

Before building payments, decide:

- what the user pays for;
- launch countries, currencies, tax responsibility, and age limits;
- web versus app-store checkout rules;
- trials, plans, upgrades, cancellation, refunds, and disputes;
- artist payout and reporting obligations;
- entitlement behavior when payment or rights status changes.

Implementation requirements:

- PCI-compliant provider;
- server-created checkout/customer portal;
- verified and idempotent webhooks;
- provider customer/payment references, not raw instruments;
- entitlement ledger and audit history;
- refund/dispute handling;
- fraud/rate controls;
- accessible, transparent prices and cancellation;
- no dark patterns or client-only trust.

## V2 opportunities

Only prioritize after V1 evidence:

- artist/label portal with verified profiles and release management;
- deeper release editions, liner material, credits, and source-linked context;
- tickets, merchandise, memberships, or direct support if selected;
- offline-capable listening where licenses permit;
- native mobile apps if web usage proves the need;
- multilingual interface and licensed lyric translation;
- accessibility profiles and cross-device continuity;
- editorial programming, guest curators, and regional scenes;
- collaborative or social features only if they support listening rather than feed growth.

## Roadmap guardrails

- Do not start Phase 2 before Phase 0 approval.
- Do not choose a provider before defining the connector contract and rights needs.
- Do not claim live charts without a named source and timestamp.
- Do not add personalization without real signals and evaluation.
- Do not add payment before product value and legal/territory obligations are understood.
- Update this file when scope, order, or assumptions change.
