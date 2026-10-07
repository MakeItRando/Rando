# Product-owner decisions and remaining questions

**Last updated:** 2026-10-07. New questions for the owner: **Q11–Q15** (bottom of file).

Existing v0.3.2 suites are green, but newly reproduced playback/source-queue defects block acceptance readiness. These questions do not authorize merge or production implementation. Resolve each before its dependent phase.

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

`src/ui/discoveryHub.js` is canonical for the accepted v0.3.2 Discover/Journey contract. Legacy `renderDiscoverView()` in `src/ui/views.js` must not be revived and must be deleted before production catalog integration.

## Remaining questions

### 1. Optional listening extras

Candidate extras/reveals appear after genuine listening while all music and required information stay open.

After testing, choose: keep; simplify to always-available liner context; or remove.

### 2. Experience acceptance

The pre-test gate is reopened by B-001/B-002 in AUDIT_2026-10-04.md. Fix and expand checks first, then owner desktop/phone testing and explicit acceptance before merge or real-system work.

### 3. Launch territory and platforms

Before production licensing/infrastructure, decide initial countries/regions, web-only versus simultaneous native mobile, languages, explicit-content/age policy, and cross-territory availability behavior.

### 4. Candidate integration strategy

Candidate passes existing automation but has reproduced uncovered blockers and is not accepted. After acceptance, choose squash versus normal merge. Recommended default: retain full history until acceptance, then squash noisy diagnostic history into a clear release commit while preserving QA evidence branches and links.

### 5. Legal/source integration handoff

Before real ingestion, owner provides implementation-facing authorized source types, represented contracts/permissions, territories, delivery methods, metadata/credit obligations, reporting, corrections/takedowns, storage/playback limits, and provider/API restrictions. Do not paste secrets into chat or commit them.

### 6. First-listen setup contract — RESOLVED (D-045)

Owner: yes, play before setup at least through development/testing. Original question kept below for history.

#### Original question

May a listener play music from Discover before supplying email or choosing genres/artists, with account/taste setup offered when needed? This is a proposal to reduce friction, not a change already approved. Current implementation mandates setup; preserve it until the owner resolves the contract.

### 7. Artist-follow meaning — RESOLVED (D-046: both)

#### Original question

Does following an artist mean keeping them in Library, receiving new-release updates, or both? Current prototype only saves artists. Real following/subscriptions/notifications need a separately specified identity, privacy and delivery model. Do not imply a public social feed is approved.

### 8. Study A verdict — ANSWERED (right direction, AI-slop styling → study B; D-051 now awaits verdict)

Does the foundation direction in DESIGN_PROGRAM.md (graphite canvas, art-driven color, coral accent, Geist, familiar layout) feel right? Which parts to keep, push further or drop?

### 9. AI scope — RESOLVED (D-050: no AI for now)

The owner's brief mentions "really capable AI". Which listener problems should AI solve in Rondo (e.g. playlist suggestions, "why this song", natural-language search, Journey guidance)? Roadmap still forbids a fake AI DJ or unverifiable AI claims.

### 10. Placeholder artwork — RESOLVED (D-052: no AI-looking art; flat sleeves)

May design studies use generated (AI) photographic cover art clearly marked as placeholders, or stay with code-drawn abstract covers until real catalog art exists?

## Questions opened 2026-10-07 (session B)

### 11. Home rev 4 scope
Owner said the bottom scrubber looks untidy and the app feels boring/not explorable. Proposal: Home rev 4 = (a) phone layout, (b) clean thin scrubber (waveform only in Now Playing / on hover), (c) Dig, (d) more varied placeholder sleeves, (e) sentence-case labels instead of UPPERCASE micro labels. Approve all, or which?

### 12. Dig
The lost session built "Dig" (daily stack of 10 unheard songs, 15-second hook, Keep/Skip) but the owner never saw it. Redo it as a proposal for Home (and a phone tab)?

### 13. Platform priority
Teens are phone-first. Is the first real product a phone-friendly web app (PWA, installable), native iOS/Android, or desktop web first? This decides how we design the next pages. (Related to Q3.)

### 14. Placeholder art
Flat geometric sleeves read as "boring". Allowed alternatives (no AI): licensed stock photos (e.g. Unsplash licence) or hand-designed type/texture sleeves? Or wait for real artist art?

### 15. Name check
Docs say **Rondo** everywhere (D-030); the owner often writes "rando". Still Rondo?

**Answered 2026-10-07:** Q11 all (D-060) · Q12 yes (D-061) · Q13 desktop + mobile apps first (D-062) · Q14 wait for real art (D-063) · Q15 Rondo (D-064). Owner also asked to finish the lost session A work.

## Questions opened 2026-10-07 (session B part 3, Explore)

- **Q16 — Dig tab:** keep Dig as its own phone tab (5 tabs: Home, Explore, Dig, Journeys, Library) or inside Explore (4 tabs, proposed in D-066)?
- **Q17 — Explore verdict:** keep, change or drop Tune a mix, Go from, Most kept in Dig (docs/specs/EXPLORE.md).
