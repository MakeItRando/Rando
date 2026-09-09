# Rondo production-system plan

This plan begins after the v0.3.2 experience candidate is approved. It records architecture direction, not a commitment to a specific framework, provider, or payment model.

## Goal

Replace the fictional static catalog and browser-only state with a secure, rights-aware system for real artists, releases, songs, accounts, search, playback, recommendations, editorial discovery, and payments—without changing Rondo's product identity.

## Proposed system boundary

```text
Web/mobile client
  → Rondo backend-for-frontend
    → identity and profile service
    → catalog and search service
    → rights/playback authorization service
    → recommendation/editorial service
    → library and Journey service
    → payments and entitlement service
    → analytics/event pipeline
    → provider adapters and artist-ingestion tools
```

The client never contains provider secrets, payment secrets, or licensing rules. Provider payloads are normalized before product code sees them.

## Real catalog and artist ingestion

Support two replaceable ingestion paths:

1. **Authorized provider connector** — catalog, availability, metadata, artwork, and playback references from a licensed API.
2. **Direct artist/label ingestion** — verified uploads, metadata, credits, artwork, rights attestations, release scheduling, and takedown workflows.

A hybrid approach is likely, but the first launch path remains a user decision. Every asset needs provenance, territory, rights window, attribution requirements, and an owner/contact record.

## Search and discovery

- normalize artists, aliases, releases, editions, tracks, genres, styles, credits, and identifiers;
- index only approved, available records;
- return availability and rights state with each result;
- separate editorial collections from algorithmic recommendations;
- label live/trending data with a source and update time;
- explain personal recommendations using real listening signals;
- avoid cold-start claims until enough history exists.

## Accounts, privacy, and continuity

- secure email/passkey or OAuth-based Rondo account;
- server-side sessions and device management;
- versioned taste profile and consent records;
- sync saves, moments, notes, Journey progress, queue context, volume, and accessibility preferences;
- export, deletion, privacy controls, and retention policy;
- encrypt sensitive data in transit and at rest;
- keep private notes private by default and out of recommendation training unless explicitly consented.

## Playback and rights

Playback authorization must check user, plan, territory, asset, rights window, and provider policy. Signed or provider-issued playback references are short-lived. The system must support unavailable, preview-only, full-play, explicit-content, and region-blocked states without breaking navigation.

Lyrics, biographies, credits, artwork, and editorial material each have independent rights and attribution rules. Takedown and correction flows are required before launch.

## Recommendation layers

1. Editorial shelves: curated and fully explainable.
2. Content similarity: genre, style, credits, era, and release relationships.
3. Personal continuation: recent plays, saves, skips, completed Journeys, and explicit taste controls.
4. Exploration: a bounded unfamiliarity control with no endless autoplay trap.

“Because you liked…” appears only after genuine history exists. Ranking systems require offline evaluation, diversity constraints, freshness checks, and human review.

## Payments and entitlements

No payment model is confirmed. Candidate models to evaluate are:

- listener subscription;
- artist/label tools or services;
- direct support, memberships, tips, tickets, or merchandise;
- a transparent hybrid.

Use a PCI-compliant payment provider. Create checkout and customer portals server-side or with provider-hosted surfaces. Verify webhooks, make operations idempotent, keep a ledger of entitlement changes, support refunds and disputes, and never trust client-only success states.

Before implementation, decide product model, launch countries/currencies, tax responsibility, refunds, artist payout obligations, platform-store rules, age requirements, and whether payments purchase access, ownership, support, or physical goods.

## Operational requirements

- environment separation and secret management;
- migrations, backups, restore tests, and audit logs;
- observability for API, search, playback, jobs, and payments;
- moderation, takedown, abuse, and support workflows;
- rate limits, cache strategy, background ingestion, and dead-letter handling;
- content and schema validation;
- feature flags and reversible rollouts;
- accessibility, performance, and security gates in CI.

## Delivery sequence

1. Approve the experience candidate.
2. Freeze the normalized domain contracts and provider interfaces.
3. Choose the first catalog/rights path and launch territory.
4. Build identity, database, and Rondo API foundations.
5. Implement ingestion, normalization, rights, and search.
6. Connect authorized playback and real metadata.
7. Migrate Library, Profile, Journeys, and notes from local state.
8. Add recommendation and editorial systems.
9. Decide and implement payments only after the value proposition is validated.
10. Complete security, rights, privacy, accessibility, load, and recovery reviews before production launch.
