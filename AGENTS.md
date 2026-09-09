# Rondo agent operating guide

This file is the required starting point for any human or AI agent working in this repository.

## Mission

Build Rondo into a professional, music-first product that helps listeners find a song quickly, explore artists deeply, and keep what matters. The experience must feel deliberate, human, and trustworthy—not like a toy, a generated mockup, or a clone of an existing streaming app.

## Read before acting

Read these files in order before code, design, branch, release, or product work:

1. `README.md`
2. `handoff/STATE.md`
3. `handoff/HANDOFF_REPORT.md`
4. `handoff/DECISIONS.md`
5. `handoff/PRODUCT_MAP.md`
6. `docs/PRODUCT.md`
7. `docs/DESIGN.md`
8. `docs/ARCHITECTURE.md`
9. `docs/DATA_MODEL.md`
10. `handoff/QUALITY_GATES.md`
11. The current branch diff, open pull requests, commits, and checks

Do not begin implementation from a single screenshot or an old summary. Reconcile the current source, current candidate, current handoff, and latest user decision first.

## Current branch policy

- `main` is the stable runtime and canonical documentation branch.
- Product and runtime candidates use a focused branch and a reviewable pull request.
- Test-only previews and generated QA artifacts stay off `main`.
- Do not merge a candidate while user acceptance is pending or a required check is red.
- Documentation/continuity updates may go directly to `main` when explicitly requested.
- Never force-push shared branches or hide a failing gate with a test-only workaround.

## Product north star

Rondo follows `find → play → explore → keep`.

- **Discover** answers “What should I play?” It opens directly and remains song-forward.
- **Journeys** answers “Which genre or artist do I want to explore deeply?” It owns genre selection, genre pages, and the artist-by-artist path.
- **Song Room** makes the active song feel central without oversized text or decorative noise.
- **Library** preserves artists, releases, tracks, moments, private notes, and meaningful progress.
- **Profile** owns a Rondo account and editable taste preferences; no external streaming account is required by the product concept.

## Confirmed production constraints

- **Rondo everywhere:** Rondo is the canonical product and future technical name. Keep existing `MakeItRando/Rando` URLs only until a deliberate migration avoids breaking prototype history and automation.
- **Broad catalog:** production should support artists and genres broadly and remain independent of any single source app.
- **Large scale:** build for thousands of songs initially and millions without changing the product model. Use stable IDs, indexed search, bounded APIs, pagination, lazy loading, and background ingestion; never put the full catalog in the browser.
- **Owner-supplied legal path:** wait for the product owner's implementation-facing acquisition/source package before connecting real media. Public availability on Spotify, YouTube, Suno, or another app is not itself authorization.
- **No payments in V1:** do not implement subscriptions, checkout, tips, artist billing, payment entitlements, taxes, refunds, disputes, or payouts in V1.

## UX non-negotiables

1. Use familiar, concise language. Prefer Play, Pause, Resume, About, Lyrics, Credits, Extra, Up next, Change genre, and Resume Journey.
2. Keep typography at credible app scale. No giant type merely to fill space.
3. Use artwork, hierarchy, sequencing, and whitespace before extra effects.
4. Motion must explain playback, navigation, focus, loading, or state. Avoid constant or page-wide animation.
5. Never use generated imagery as a shortcut for product quality.
6. Discover must not interrupt with a genre popup.
7. Genre selection belongs to Journeys; each genre is a distinct page-like route.
8. Global playback must survive navigation. Browsing must not silently replace the active Journey.
9. Persist meaningful state, not open modals, hover states, animation phases, or temporary panels.
10. Do not use fake charts, fake live signals, manipulative streaks, autoplay traps, or unsupported recommendation claims.
11. Build curiosity through strong curation and context; never lock core music or required information behind engagement mechanics.
12. Unknown metadata stays unknown. Production claims require provenance.

## Engineering rules

- Keep UI code on normalized Rondo domain objects; source payloads stop at authorized adapters.
- Keep credentials, rights rules, and source tokens off the client.
- Maintain one playback state, one queue model, and one audio engine.
- Do not duplicate sorting, save, palette, progress, route, or reveal rules.
- Add migration-safe defaults for persisted state.
- Treat playback rights, territory, attribution, correction, and takedown as product requirements, not later cleanup.
- Keep route transitions accessible and preserve browser Back/Forward behavior.
- Use data-driven genre/artist/release routes; do not duplicate screens for every genre.
- Never issue unbounded catalog queries or ship full catalog arrays to the client.
- Build source ingestion as idempotent, resumable, auditable background work with deduplication and retries.
- Prefer small, reviewable changes with clear rollback paths.

## Required quality pass

Before asking the user to test or merging a product candidate:

```bash
npm ci
npm audit --audit-level=high
npm run build:preview
RONDO_URL=http://127.0.0.1:4173/preview-test.html npm test
```

Then complete the manual and visual checks in `handoff/QUALITY_GATES.md`. A green command is not visual inspection. Inspect every required desktop, mobile, compact, Light, Night, and Reduced Motion state.

Never say “perfect,” “no errors,” “ready,” or “test now” while:

- a required check is failing or pending;
- runtime errors, broken visible images, or horizontal overflow exist;
- keyboard/focus behavior is unverified;
- a mobile or Reduced Motion state is uninspected;
- the implementation and documentation disagree;
- rights or source claims are unsupported.

## Handoff update protocol

Every meaningful change must update continuity in the same work session:

- status, branch, commit, PR, check, blocker, or next action → `handoff/STATE.md`;
- product choice or reversed choice → append to `handoff/DECISIONS.md`;
- page, section, flow, copy, persistence, or navigation → `handoff/PRODUCT_MAP.md` and `docs/PRODUCT.md`;
- module, route, service, connector, hosting, security, or scale assumption → `docs/ARCHITECTURE.md` and/or `docs/PRODUCTION_PLAN.md`;
- entity, field, ID, persistence, analytics, or migration → `docs/DATA_MODEL.md`;
- visual, responsive, motion, or accessibility rule → `docs/DESIGN.md`;
- test coverage, result, screenshot, or release evidence → `handoff/QUALITY_GATES.md` and `handoff/SNAPSHOTS.md`;
- future phase, real-system work, or payments → `handoff/ROADMAP.md`.

At the end of a work session, `handoff/STATE.md` must answer:

- What changed?
- Where is it?
- What passed and failed?
- What is still unverified?
- What should the next agent do first?
- Is the user being asked to test? Why or why not?

## Definition of done

A section is done only when behavior, edge cases, accessibility, responsive states, automated tests, visual inspection, documentation, and branch status agree. User acceptance is a separate gate. Keep the candidate unmerged until that gate is explicit.

## Security, privacy, and rights

- Never commit secrets, tokens, personal production data, media without authorization, or full copyrighted lyrics without rights.
- Run targeted secret scanning for changed source and configuration.
- Keep prototype accounts and personal notes clearly local-only until secure services exist.
- Record source provenance and territorial availability for every production asset.
- Do not infer authorization from public availability in another app.
- Payments are outside V1. If separately approved later, use a compliant provider and server-side verification; never trust client-only entitlements.

## Competitive standard

Do not chase feature count. Rondo should win through a clearer mental model, stronger release identity, truthful playback, thoughtful memory, accessible continuity, and calm product craft. If a feature makes the app busier without improving `find → play → explore → keep`, remove or defer it.
