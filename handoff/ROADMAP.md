# Rondo roadmap: experience gate, production V1, then V2

Dates are open pending team capacity, launch territory/platform, and owner-provided implementation-facing legal/source package. Every phase's scope/decision/status change must update this file plus [STATE.md](STATE.md) and relevant docs in the same session.

## Phase 0: experience approval (current)

Latest candidate `cd25bbd` on [draft PR #5](https://github.com/MakeItRando/Rando/pull/5) passed local-preview [CI run 34465613545](https://github.com/MakeItRando/Rando/actions/runs/34465613545/job/102833363733): 13 browser suites and automated visual capture. QA evidence [`513d538`](https://github.com/MakeItRando/Rando/commit/513d538822a3ea2d4b7f50b2c777a5594815fa71), preview [`089bd21`](https://github.com/MakeItRando/Rando/commit/089bd2125ab002b3aa70f8587578e01c2a879a5f). Latest exact published-preview audit, latest manual visual sign-off and owner acceptance remain unrecorded. Finish those, reconcile PR body, request desktop/phone experience test, address feedback with new exact-head QA if source changes. Only with explicit approval and clean integration plan merge to `main`, run post-merge gate and update handoff. This documentation-only pass does not move the runtime.

## Phase 1: secure foundation

Deliberately migrate `Rando` technical naming to Rondo; choose framework/hosting based on actual platform/rights needs. Freeze normalized Rondo API/adapter contracts; secure accounts/sessions/recovery, versioned preferences/Journey/Library sync, relational/domain and object/CDN storage, search index, jobs/queues, migrations, environments/secrets, backups, observability, rate limits, feature flags, privacy/security/accessibility/recovery baselines. Preserve accepted UI contract while moving playback context from prototype DOM compatibility layers into store/audio commands. **Exit:** authenticated empty shell, safe persistence, indexed empty catalog, ingestion skeleton, operating controls.

## Phase 2: authorized real artists/releases/songs

First obtain owner's source/authorization package (source types, contracts, territories/windows, delivery, storage/playback constraints, credits/attribution/reporting, takedown/corrections and API restrictions). Build replaceable provider-neutral adapters, resumable/idempotent ingestion, entity resolution, aliases, recordings vs track placements/editions, credits and provenance, rights windows and request-time playback authorization, indexed debounced cursor search, staged publication and removal. Start controlled thousands, design for millions. Remove dormant Discover renderer before catalog integration; one data-driven Genre page and bounded client APIs. **Exit:** authorized catalog can be ingested, searched, browsed, played where allowed, corrected and removed safely. Public URL is not a license.

## Phase 3: V1 listener product

Real bounded Discover/editorial shelves, genuine-history recommendations, synchronized Genre/Artist Journeys, real Artist/Release pages, authorized Song Room media/lyrics/context, private synced Library/moments/notes, secure taste onboarding, accessibility/mobile/web quality, consented analytics, export/deletion, support/moderation and load/recovery tests. No payment system, public social feed, follower counts, fake AI DJ, manipulative streaks or unauthorised media. **Exit:** a useful, trustworthy `find → play → explore → keep` listener product with territorial rights enforcement.

## Phase 4: recommendation and editorial depth

Explainable editorial and content similarity (genre/style/credits/era/relationships) plus permissioned listening signals; evaluate diversity/freshness and avoid fatigue, disclose reasons truthfully. Source-labeled trends require real measurements. Reviewed artist/label context may follow verification. Do not fabricate personalized claims for cold-start users.

## Phase 5: catalog/operational maturity

Horizontal search/media/ingestion scaling, incremental indexing, territorial updates, edition/duplicate resolution, source conflict/freshness dashboards, SLOs, quotas/backpressure/dead-letter recovery, abuse controls, incident exercises and genre/region/accessibility quality sampling. Keep high-volume events separate from bounded listener state.

## V2 opportunities, not commitments

Evidence-driven artist/label tools, deeper liner/edition context, licensed offline playback, native apps if web demand proves need, multilingual UI/authorized lyric translation, accessibility profiles, regional editorial, listening-supportive collaboration, device handoff, richer private moments, explainable Smart Queue and credits graph. Evaluate impact and rights before priority. See [PRODUCT_IDEAS.md](PRODUCT_IDEAS.md).

## Payments: explicitly beyond V1

Do not prebuild checkout, subscriptions, tips, merch checkout, artist billing, entitlements, taxes, refunds, disputes or payouts. A separate owner-approved decision must define actual paid value, territories/currencies, platform-store rules, cancellations/refunds, artist obligations, rights/accounting and entitlement behavior. Only then design compliant provider-backed server-verified, auditable, idempotent flows without dark patterns.

## Stop rules

No real catalog/backend integration before Phase 0 acceptance; no source adapter before legal package; no unbounded browser catalog or hard-coded global counts; no duplicate Genre page code or legacy Discover revival; no live chart without sourced timestamp; no V1 payments. Update this roadmap whenever order, scope or assumptions change.
