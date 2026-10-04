# Rondo product map and page specifications

**Status labels:** stable `main` is v0.3.0 runtime; draft PR #5 has newer candidate behavior; production requirements below are specifications, not shipped features. Use [STATE.md](STATE.md) for latest evidence.

## Shared shell and mental model

**find → play → explore → keep.** Primary navigation: Discover, Library, Journeys, Profile. One SPA shell, one physical audio engine/player transport/Song Room, and two independently resumable **logical** Journey/Global playback sessions and bounded queues. Browse routes do not switch audio. Route URLs/titles/landmarks/Back/Forward/heading focus, keyboard/visible focus, mobile non-overlapping nav and transport, Light/Night, Reduced Motion, and honest live feedback are required. No fake chart, forced autoplay or lock on essential music/context.

## Discover: find something good now

**Candidate:** direct song-first `#/discover`, not a genre popup. Search songs/artists/releases; Continue listening only after activity; Made for you only after genuine listening history; curated Hits today/Popular now with named source and eventual timestamp; Bangers; Sounds/moods; Hidden gems; New & rising; compact Genre Journey links; surprise/direct playback and release actions. Shelves stay finite and useful, not an endless feed. Cold-start personalization is hidden, not fabricated. Global playback preserves Journey state; source-specific queues keep truthful labels. Production shelves are rights-aware, bounded, editorially controlled, and dynamically sourced; live popularity requires genuine data/source/time. Candidate canonical renderer: `src/ui/discoveryHub.js`; old `renderDiscoverView()` in `src/ui/views.js` must not be revived, and requires removal after accepted integration/caller verification.

## Journeys: deeper deliberate exploration

**Landing/picker:** no active Journey → focused genre picker; active Journey → its Genre page. First-use dismissal → Discover; contextual dismissal preserves route/focus. Change genre never erases progress. Choices need names, accurate dynamic artist/song counts, per-genre progress, selected state, genre-named primary action, focus trap/Escape/inert background/return focus and 44px targets.

**Genre page:** atmosphere and identity, next artist and progress, Start/Resume, Play top mix, Change genre, scoped search, Songs, Releases, Artists, optional hidden finds, return to Discover. Candidate has four playable prototype genres: Hip-Hop, R&B, Electronic, Jazz. Production has one data-driven Genre renderer/taxonomy for broad catalog, with no duplicate components or fixed global counts. Profile's extra seed-genre labels are not additional playable prototype pages.

**Artist Journey:** supplied biography/origin/years/tags, alphabetical artist progression, matching-genre default with All catalog escape, newest-to-oldest releases and official track order, truthful Play/Pause/Resume, save artist/release/track, queue within current source, explicit completion before crossing artist boundary. Independent progress and return position without autoplay.

## Release: understand and play a chapter

Distinct art and accessible palette, title/artist/type/date/source where known, official sequence, supplied context, credits/provenance, save/play and Song Room actions; optional extras add value but never gate music/credits/navigation. **Candidate release chapter is state-backed; independent hash deep link is not proven.** Design and test a stable release route before claiming full route-backed release support. Unknown metadata stays unknown. Production handles editions, territorial playability, loading/partial/empty and rights-blocked states.

## Song Room: make the active recording central

**Room**: artwork, identity, timeline/controls, truthful signal, lyric peek and moment; **About/Story**: supplied context; **Lyrics**: authorized/demo timed words and seeking; **Credits**: sourced contributors and roles; **Extra**: optional experimental listening-earned context, owner validation pending; **Up next**: active queue/source and position. One expanded player for the active Journey or Global session. Open explicitly; close/focus-return without interrupting playback. Artwork drives a restrained, contrast-safe backdrop; analyser is labeled live only when real analyser data is active, fallback is Playback motion, and paused/Reduced Motion differ. Volume persists; mute restores previous audible level; time/metadata do not overlap at narrow widths.

## Library and Profile: keep and shape taste

**Library candidate:** browser-local saved artists, releases, tracks, timestamped moments, private per-song notes, release/Journey continuity and optional extras. Empty state links back to Discover. **Production:** private secure sync, edit/export/delete, pagination and conflicts, rights-aware saved-but-unavailable representations.

**Profile/onboarding candidate:** local display/email and seed taste, discovery/popularity/album focus, theme/volume and accessibility preferences. No real account security. **Production:** secure Rondo identity/passkey-or-password, age/territory/explicit/privacy, interface/music language, three genres or Help me discover, five seed artists, listening-familiarity/popularity/vocal/era/album-vs-track and accessibility/autoplay controls, resumable under-seven-screen setup, review/editable taste rationale, devices, export/deletion. No other streaming account required by product concept.

## Search, state and unavailable paths

Production search: indexed, debounced/cancellable, alias/typo/edition/rights-aware, stable and cursor-paginated. Every shelf/list/API has a hard maximum; no complete catalog, tree flattening or array-position IDs in client state. Persist only bounded IDs/progress/preferences/saves/moments/notes/theme/volume and both session references; not open dialogs, hover/focus, wave samples, loading/errors or autoplay intent. Repair malformed versions and write back safely. Each production surface needs deliberate loading/empty/partial/offline/unavailable/rights-blocked/rate-limited/retry paths; playback failures preserve browse state.

## Phases and payments

Experience approval and integration first; then secure Rondo foundations; owner-authorized real catalog/rights; V1 listener product; recommendation/editorial maturity; operations at scale. V2 ideas follow measured need. **No payments in V1**; any later subscriptions/tips/artist transactions require a separate decision and compliant rights/finance design. See [ROADMAP.md](ROADMAP.md) and [PRODUCT_IDEAS.md](PRODUCT_IDEAS.md).

## Current audit overlay — 2026-10-04

Contracts above remain targets, not certification that every source path satisfies them. Natural Global audio end and one-result Search queue behavior currently fail their contracts; see AUDIT_2026-10-04.md. Artist saving exists; a real following/release notification service does not. Onboarding is four local-profile steps in the prototype, while docs/ONBOARDING.md describes planned production setup. Clarify guest-first entry and artist-follow meaning before changes. Original design is retained; rejected PR #9 must not be revived.
