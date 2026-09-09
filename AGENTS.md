# Rondo agent operating guide

This file is the required starting point for any human or AI agent working in this repository.

## Mission

Build Rondo into a professional, music-first product that helps listeners find a song quickly, explore artists deeply, and keep what matters. The experience must feel deliberate, human, and trustworthy—not like a toy, generated mockup, or clone.

## Read before acting

Read in order:

1. `README.md`
2. `handoff/STATE.md`
3. `handoff/HANDOFF_REPORT.md`
4. `handoff/DECISIONS.md`
5. `handoff/PRODUCT_MAP.md`
6. `docs/PRODUCT.md`
7. `docs/DESIGN.md`
8. `docs/ARCHITECTURE.md`
9. `docs/DATA_MODEL.md`
10. `docs/PRODUCTION_PLAN.md`
11. `handoff/QUALITY_GATES.md`
12. Current branch diff, open PRs, commits, and checks

Do not implement from one screenshot or old summary. Reconcile source, candidate, handoff, evidence, and latest owner decision.

## Current checkpoint

- Stable `main` runtime baseline: `eaafc4c`; later `main` changes are canonical documentation.
- v0.3.2 candidate: `89fc0d5` on `rondo-v031-user-ready`.
- QA evidence: `dbe315e`; preview: `873fbbe`; successful run: `34332141798`.
- Candidate passed all 12 suites, visual capture, 18/18 manual review, exact preview audit, and targeted credential review.
- PR #5 is open, draft, unmerged. Product-owner acceptance is pending.
- Any candidate source change invalidates that exact-head evidence and requires the complete gate again.

Always verify live refs; this checkpoint may age.

## Branch policy

- `main` carries stable runtime and canonical documentation.
- Product/runtime candidates use focused branches and reviewable PRs.
- Test previews/generated QA evidence stay off `main`.
- Do not merge while acceptance is pending or a required gate is red/incomplete.
- Documentation/continuity may go directly to `main` when requested.
- Never force-push shared branches or hide failures with test-only workarounds.

## Product north star

Rondo follows `find → play → explore → keep`.

- **Discover:** immediate, song-forward answer to “What should I play?”
- **Journeys:** genre selection, Genre pages, and deliberate artist-by-artist depth.
- **Song Room:** active recording made central without oversized type/noise.
- **Library:** artists, releases, tracks, moments, private notes, progress.
- **Profile:** Rondo account and editable taste; no external streaming account required by the product concept.

## Owner constraints

- **Rondo everywhere:** safely migrate current `Rando` technical names before production.
- **Broad catalog:** artists/genres broadly; independent of one source app.
- **Thousands first, millions ready:** stable IDs, normalized models, bounded APIs, indexed/debounced search, cursor pagination, lazy assets, resumable ingestion; never full catalog in browser.
- **Owner-supplied legal path:** wait for implementation-facing authorization/source package. Public availability is not authorization.
- **No payments in V1:** no checkout, subscriptions, tips, artist billing, entitlements, taxes, refunds, disputes, or payouts.

## UX non-negotiables

1. Familiar concise labels; truthful Play/Pause/Resume.
2. Credible app-scale type; no giant filler type.
3. Artwork, hierarchy, sequencing, and whitespace before effects.
4. Motion only for playback/navigation/focus/loading/state; Reduced Motion honored.
5. No generated imagery shortcut.
6. Discover opens directly; never a genre popup.
7. Made for you/Because you liked only after genuine history.
8. Journeys owns genre selection and route-backed Genre pages.
9. Playback survives navigation; browsing never replaces Journey silently.
10. Persist meaningful state, not dialogs/hover/focus/animation/autoplay intent.
11. No fake charts/live signals, manipulative streaks, autoplay traps, or locks on core music/information.
12. Unknown metadata stays unknown; claims require provenance.

## Canonical implementation policy

- `src/ui/discoveryHub.js` is the canonical v0.3.2 Discover/Journey-route renderer.
- `renderDiscoverView()` in `src/ui/views.js` is dormant legacy code with rejected conceptual framing.
- Never wire it back in, adapt it, or create a competing Discover implementation.
- Delete it before production catalog integration after the accepted candidate is integrated and no caller remains.
- Production uses one shared data-driven Genre renderer over an editable taxonomy—no per-genre code copies or fixed global counts.

## Engineering rules

- UI consumes normalized Rondo objects; source payloads stop at adapters.
- Credentials, rights decisions, and source tokens stay server-side.
- One playback state, queue, audio element/engine, and analyser contract.
- No duplicate sorting/save/palette/progress/route/recommendation rules.
- Persisted state has schema validation, safe defaults, write-back repair, and tested migrations.
- Rights, territory, attribution, correction, and takedown are product requirements.
- Preserve accessible routes, titles, landmarks, Back/Forward, focus, and uninterrupted playback.
- Stable Rondo IDs/slugs; never array position identity.
- Every list/search API has a bounded limit, hard maximum, opaque cursor, and stable order.
- Search is indexed, debounced, cancellable, alias/typo/rights aware; never global client filtering over catalog JSON.
- Listener state stores bounded references/progress, not catalog objects/search pages/source payloads.
- Never issue unbounded queries, recursively fetch all cursors, ship full catalog arrays, or flatten complete artist/release/track trees in the client.
- Ingestion is idempotent, resumable, auditable, deduplicated, backpressured, and retryable.
- Prefer small reviewable changes with rollback paths.

## Required quality pass

Before test request or merge:

```bash
npm ci
npm audit --audit-level=high
npm run build:preview
RONDO_URL=http://127.0.0.1:4173/preview-test.html npm test
```

Then complete `handoff/QUALITY_GATES.md`, including exact portable-preview and manual visual review. Green commands do not replace inspection.

Never say “perfect,” “no errors,” “ready,” or “test now” while checks are pending/failing, runtime/resource/layout/focus issues exist, mobile/Reduced Motion is uninspected, candidate/evidence/preview/docs disagree, or rights claims are unsupported.

## Handoff update protocol

Same session:

- status/branch/commit/PR/check/blocker/next action → `handoff/STATE.md`;
- decision/reversal → `handoff/DECISIONS.md`;
- page/flow/copy/persistence/navigation → `handoff/PRODUCT_MAP.md`, `docs/PRODUCT.md`;
- architecture/service/connector/hosting/security/scale → `docs/ARCHITECTURE.md`, `docs/PRODUCTION_PLAN.md`;
- entity/ID/state/migration/analytics → `docs/DATA_MODEL.md`;
- visual/responsive/motion/accessibility → `docs/DESIGN.md`;
- tests/results/screenshots/video → `handoff/QUALITY_GATES.md`, `handoff/SNAPSHOTS.md`;
- future phases/real system/payments → `handoff/ROADMAP.md`.

At completion, `STATE.md` must say what changed, where, what passed/failed, what remains, next action, and whether/why the user should test.

## Definition of done

Behavior, edge cases, accessibility, responsive states, automated tests, visual inspection, preview identity, security review, documentation, and branch status must agree. User acceptance is a separate gate. Keep the candidate unmerged until explicit.

## Security, privacy, rights

Never commit secrets, production personal data, unauthorized media, or full copyrighted lyrics. Run targeted secret review. Keep prototype accounts/notes local-only until secure services. Record source provenance/territory. Payments stay outside V1; any later approved system requires compliant server-verified flows.

## Competitive standard

Win through a clearer mental model, strong release identity, truthful playback, thoughtful memory, accessible continuity, and calm craft—not feature count. If a feature makes Rondo busier without improving `find → play → explore → keep`, remove or defer it.
