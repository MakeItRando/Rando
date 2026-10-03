# Product-owner decisions and remaining questions

**Last updated:** 2026-09-09

v0.3.2 is green and ready for product-owner testing; these remaining questions do not authorize merge or production implementation. Resolve each before its dependent phase.

## Resolved decisions

### Canonical name

**Rondo everywhere.** Rondo is canonical for product, repository, package, infrastructure, domain, and future app-store name. Existing `MakeItRando/Rando` remains during prototype continuity; perform a planned migration before production-facing domains/packages/contracts/store submissions.

### Real-catalog direction

Rondo supports a broad catalog across artists, genres, and legitimate sources rather than one provider or a narrow launch genre. Architecture must hold thousands of songs initially and millions without rebuilding the product model.

Owner has a legal acquisition plan and will supply concrete source, authorization, territory, asset-delivery, credential, and playback requirements before production integration. Public availability on Spotify, YouTube, Suno, or another app is not permission to copy, ingest, store, or stream.

Engineering uses normalized stable Rondo IDs, replaceable authorized connectors, resumable background ingestion, bounded APIs, indexed/debounced search, cursor pagination, lazy assets, deduplication, and rights/provenance records. Never deliver or flatten the full catalog in the browser.

### V1 payments

**No payments in V1.** No subscriptions, checkout, tips, merchandise checkout, artist billing, payment entitlements, refunds, disputes, taxes, or payouts. Reconsider only through a new explicit later decision.

### Canonical renderer

`src/ui/discoveryHub.js` is canonical for the accepted v0.3.2 Discover/Journey contract. Dormant `renderDiscoverView()` in `src/ui/views.js` must not be revived and must be deleted before production catalog integration.

## Remaining questions

### 1. Optional listening extras

Candidate extras/reveals appear after genuine listening while all music and required information stay open.

After testing, choose: keep; simplify to always-available liner context; or remove.

### 2. Experience acceptance

The engineering pre-test gate is complete. Owner must test desktop and phone and explicitly accept the experience before PR #5 merges or real-system work begins.

### 3. Launch territory and platforms

Before production licensing/infrastructure, decide initial countries/regions, web-only versus simultaneous native mobile, languages, explicit-content/age policy, and cross-territory availability behavior.

### 4. Candidate integration strategy

Candidate is green but not accepted. After acceptance, choose squash versus normal merge. Recommended default: retain full history until acceptance, then squash noisy diagnostic history into a clear release commit while preserving QA evidence branches and links.

### 5. Legal/source integration handoff

Before real ingestion, owner provides implementation-facing authorized source types, represented contracts/permissions, territories, delivery methods, metadata/credit obligations, reporting, corrections/takedowns, storage/playback limits, and provider/API restrictions. Do not paste secrets into chat or commit them.
