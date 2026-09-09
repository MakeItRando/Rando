# Rondo roadmap: prototype, scalable V1, and V2

Dates remain intentionally open until the product owner confirms team capacity, launch territory, platform scope, and the implementation-facing legal/source package.

## Confirmed roadmap inputs

- Rondo is canonical everywhere; migrate existing `Rando` technical names deliberately.
- The catalog should cover artists and genres broadly, independent of one source app.
- Build for thousands of songs at initial rollout and millions without changing the product model.
- The product owner supplies the legal acquisition/source plan before real ingestion.
- V1 has no payments.

## Phase 0 — Experience approval

**Goal:** validate v0.3.2 before real-system complexity begins.

### Engineering status

Completed for candidate `89fc0d5`:

- clean install, high-severity audit, preview build, static/unit checks;
- all 12 browser suites and enforced visual step green in run `34332141798`;
- 18/18 final captures manually accepted;
- exact portable-preview 37-check runtime audit green;
- 58-file credential-pattern review with zero findings;
- candidate/evidence/preview/PR/handoff reconciled.

### Remaining

- product owner tests desktop and phone experience;
- address any feedback with a new exact-head full gate;
- obtain explicit acceptance;
- merge accepted candidate into `main` with clean integration history;
- update version/status/handoff and run the post-merge gate.

**Exit:** explicit owner approval plus green exact-head and post-merge evidence.

## Phase 1 — Production and scale foundation

**Goal:** create secure infrastructure while preserving the accepted UI contract.

- complete the Rando-to-Rondo technical naming migration;
- choose framework/hosting from requirements;
- freeze normalized Rondo API and adapter contracts;
- provision relational/domain storage, search index, object storage/CDN, jobs, migrations, environments, secrets, backups, and observability;
- implement secure identity, sessions, devices, and recovery;
- migrate preferences/Journey state to versioned server data;
- require bounded APIs, cursor pagination, lazy assets, idempotent jobs, rate limits, feature flags, and reversible deployments;
- establish privacy, security, accessibility, load, and incident-response baselines.

**Scale invariant:** clients receive small route/shelf/search windows and bounded listener references. They never receive, flatten, cache, or persist the complete catalog.

**Exit:** authenticated empty product shell, safe persistence, indexed empty catalog, ingestion skeleton, and operational controls.

## Phase 2 — Real artists, releases, songs, and rights

**Goal:** replace fictional records through the owner's authorized path.

- translate the legal/source package into connector, territory, storage, playback, attribution, reporting, correction, and takedown rules;
- implement replaceable adapters rather than hard-coding Spotify, YouTube, Suno, or another app into product logic;
- build resumable ingestion, validation, normalization, deduplication, merge/split, correction, and staged publication;
- represent artists, aliases, releases, editions, recordings, track placements, credits, identifiers, genres/styles, artwork, lyrics, and territorial availability;
- add rights windows, provenance, attribution, takedown, and audit records;
- implement rights-aware playback authorization;
- build indexed, debounced, typo-tolerant, alias-aware, cursor-paginated search;
- prove controlled batches, then scale from thousands toward millions.

Before this phase, remove the dormant `renderDiscoverView()` legacy renderer. Production Discover and every Genre route must use one normalized, data-driven implementation—never duplicated provider- or genre-specific pages.

**Exit:** authorized real content can be ingested, searched, browsed, played where allowed, corrected, and removed safely.

## Phase 3 — V1 listener product

**Goal:** launch `find → play → explore → keep` without payment complexity.

- real Discover with bounded editorial shelves and source-labeled trends;
- truthful personalization only after genuine history;
- server-synced Genre Journeys over an editable taxonomy;
- real Artist and Release pages;
- authorized Song Room playback, credits, lyrics/context where permitted;
- synchronized Library for songs, releases, artists, moments, and private notes;
- explainable onboarding/taste controls;
- accessible responsive web experience;
- consented analytics and product-quality dashboards;
- privacy export/deletion, support, moderation, corrections, and takedowns;
- catalog/search/playback load tests and recovery drills.

**V1 exclusions:** all payments; social feed; public comments; follower counts; collaborative listening; fake AI DJ; manipulative streaks; unsupported live-analysis claims; and content outside the supplied legal path.

## Phase 4 — Recommendation and editorial depth

- editorial collections and genre experts;
- content similarity using genre, style, credits, era, and release relationships;
- personal continuation using plays, saves, skips, completed Journeys, and explicit controls;
- “Because you liked…” only after genuine history;
- bounded exploration/diversity/freshness controls;
- offline ranking evaluation and human editorial review;
- reviewed artist/label editorial submissions.

**Exit:** recommendations are useful, explainable, diverse, and never fabricated.

## Phase 5 — Catalog and operational maturity

- horizontal ingestion/search/API/media scaling;
- incremental reindexing and cache invalidation;
- bulk rights/territory updates;
- duplicate/edition resolution and audit history;
- source freshness/conflict/attribution dashboards;
- SLOs for search, playback authorization, ingestion, and takedowns;
- quotas, backpressure, dead-letter recovery, abuse controls, and incident drills;
- quality sampling across genres, regions, scripts, devices, and accessibility states.

## Deferred beyond V1 — payments

Do not prebuild checkout, subscriptions, tips, artist billing, payment entitlements, taxes, refunds, disputes, or payouts. A later owner-approved phase must first define value, territories/currencies, platform rules, cancellation/refunds, artist obligations, and entitlement behavior, then use compliant providers and auditable idempotent flows without dark patterns.

## V2 opportunities

Only prioritize after V1 evidence: verified artist/label tools, deeper editions/liner context, offline listening where rights permit, native apps if web use proves need, multilingual UI/licensed lyric translation, accessibility profiles, regional editorial programming, listening-supportive collaboration, and a separately approved payment model.

## Guardrails

- Do not start real catalog/backend work before Phase 0 acceptance.
- Do not implement a source adapter before the legal/source package.
- Do not infer authorization from public availability.
- Do not load/render/flatten an unbounded catalog in the browser.
- Do not use fixed global catalog counts as architecture.
- Do not duplicate Genre page code or revive the legacy Discover renderer.
- Do not claim live charts without a source and timestamp.
- Do not personalize without real signals and evaluation.
- Do not add payments to V1.
- Update this file whenever scope, order, scale assumptions, or owner decisions change.
