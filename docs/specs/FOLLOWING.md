# Spec: following artists (draft)

**Decision:** D-046 confirmed (owner, 2026-10-04): following means **both** keeping the artist in Library **and** receiving new-release updates.

## Behavior

- Follow / Following toggle on Artist page, Now Playing (artist line) and artist rows; one shared state.
- Library → Artists lists followed artists (sort: recent activity, A–Z).
- Home shelf "New from artists you follow" (releases within 30 days, newest first; hidden when empty).
- Notifications inbox (bell): new release from followed artist; per-artist mute; global setting for in-app only (prototype). Email/push are production-phase, opt-in, require accounts and consent.
- No public follower counts or social feed in V1 (unchanged boundary).

## Prototype vs production

Prototype: local follow list + simulated release dates from fictional catalog. Production: account-scoped follows, release ingestion events → notification fan-out jobs, unsubscribe and rate limits.
