# Product-owner decisions and remaining questions

**Last answered:** 2026-09-09

These records do not trigger application work in the current documentation-only session. Remaining questions should be answered before their dependent production phase.

## Resolved decisions

### 1. Canonical name — resolved

**Rondo everywhere.** Rondo is the canonical product, repository, package, infrastructure, domain, and future app-store name. The existing `MakeItRando/Rando` repository remains in place during the prototype so links and branch evidence are not broken; perform a planned naming migration before production-facing domains, packages, contracts, or store submissions.

### 2. Real-catalog direction — resolved at product level

Rondo should ultimately accept a broad catalog across artists, genres, and legitimate source systems rather than being designed around one provider or a narrow launch genre. The architecture must comfortably handle thousands of songs at initial rollout and scale to millions without rebuilding the product model.

The product owner has a legal acquisition plan and will supply the concrete source, authorization, territory, credential, and playback requirements before production integration begins. Rondo must remain source-neutral: public availability on Spotify, YouTube, Suno, or another app is not itself treated by code as permission to copy, ingest, or stream anything.

Engineering implication: use normalized Rondo IDs, replaceable authorized connectors, background ingestion, bounded APIs, indexed search, pagination, lazy media/artwork loading, deduplication, and rights/provenance records. Never load the full catalog into the browser.

### 3. V1 payments — resolved

**No payments in V1.** V1 must not include subscriptions, checkout, tips, merchandise checkout, artist billing, payment entitlements, refunds, disputes, taxes, or payout systems. Keep future payment boundaries documented so they can be added cleanly only after a new explicit decision.

## Remaining questions

### 1. Optional listening extras

The candidate includes extras/reveals after genuine listening time while keeping all music and required information open.

Decision needed after testing:

- keep the feature;
- simplify it to always-available liner context;
- remove it entirely.

### 2. Launch territory and platforms

Needed before production licensing and infrastructure:

- initial country/region;
- web-only V1 or simultaneous native mobile;
- supported languages;
- explicit-content and age requirements;
- availability behavior across territories.

### 3. Candidate integration strategy

After the candidate is green and accepted:

- squash the experience into a clean release commit; or
- retain detailed history and merge normally.

Recommended default: preserve full branch history until acceptance, then squash the noisy diagnostic history into a clear release commit with complete QA evidence.

### 4. Legal/source integration handoff

Before real ingestion begins, the product owner will need to provide the implementation-facing form of the legal plan: authorized source types, contracts or permissions represented in the system, territories, asset-delivery method, metadata/credit obligations, takedown rules, and any provider/API restrictions. This is a future input, not a request to disclose sensitive credentials in chat or commit them to the repository.
