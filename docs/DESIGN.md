# Rondo product design direction

## Intent

Rondo is music-first, artwork-led, professional and immediately understandable. It should feel made by a careful product team, not assembled from effects, strategy copy or competitor patterns. `find → play → explore → keep`. Curiosity comes from music, artwork, sequencing, contrast and a few strong choices. Copy explains an action and gets out of the way.

## Hierarchy

```text
Discover → search / editorial / history-backed picks / sounds → song
         → compact Genre Journey links
Journeys → first visit: genre picker → Genre page → Artist Journey → release
Any song → Song Room
Library / Profile → memory and editable listener setup
```

Discover is quick/song-forward; Journeys is deliberate/artist-forward. They must never become duplicate pages.

## Route and shell behavior

Discover, Library, Profile, Genre pages and Artist Journeys use distinct hash routes in one shell. The active route owns title, main landmark, heading focus and announcement; Back/Forward does not restart the active recording. Release chapter in the current candidate is state-backed, not proven independently deep-linkable. Inactive DOM is removed or intentionally hidden; artwork loads lazily. Production can code-split without changing the accepted route contract.

The persistent bottom transport shows one active physical audio engine. Journey and Global have independently resumable logical sessions and queues. Browsing another page never switches session; deliberate play does. On desktop, Global playback has a restrained source-labeled side player; mobile keeps the bottom transport. Do not auto-expand Song Room when a Discover song starts or imply its queue is the Journey queue.

## Discover

Opens directly with no genre requirement. First concise orientation and useful search, then Continue listening if relevant, finite editorial/history-backed shelves, Sounds/moods and compact Genre Journey links. Made for you is absent at cold start; after genuine history it may say `From your recent plays`. Editorial popularity must be named; production trends need source and time. Cards vary through actual authorized release identity and hierarchy, not random decoration.

`src/ui/discoveryHub.js` is the candidate's canonical renderer. The competing old `renderDiscoverView()` in `src/ui/views.js` uses rejected language such as “Find a door, not a feed”; do not revive/adapt it. Remove after accepted integration/caller verification, before production catalog integration.

## Journey picker and Genre page

Picker appears only with no active Journey or after Change genre. Require readable choices, dynamic artist/song counts/progress, selected state, genre-named primary action, contextual Back/close, focus containment, Escape, inert background, focus return and 44×44px targets. It is a focused decision, not a Discover interruption.

Genre page is a real destination: restrained atmosphere, real stacked release art, progress/next artist, Start/Resume, Play top mix, Change genre, scoped search, songs/releases/artists/hidden finds and a Discover return. All genres share layout/language/interaction, with variation from data/art/accent. Production adds genres through taxonomy/configuration rather than copied routes, CSS or fixed counts. The prototype currently has four playable Genre pages even if onboarding lists more seed labels.

## Artist Journey and release identity

Artist Journey uses a compact current-genre/Change action instead of a permanent dropdown. Alphabetical browsing, release sequence, completion, active-session queue and playback state stay clear. Artist primary action truthfully says Play/Pause/Resume. Each release carries distinct authorized art, accessible accent, official sequence and concise supplied context across Discover, Genre, release, Song Room and Library. Unknown metadata stays unknown. Nonessential Extra content never gates playback, credits or navigation.

## Song Room

The active cover drives accent and restrained blurred atmosphere while controls stay readable. Desktop art/title share a stage without poster-size text; modes About/Lyrics/Credits/Extra/Up next and transport/timeline/volume remain compact. Mobile art is prominent, title compact, previous/play/next obvious, context sheet and mode bar reachable at 390px and 320px. Three-column time row keeps elapsed, metadata and remaining separate; metadata truncates rather than collides.

Waveform tells the truth: `audio` only with active analyser data, `motion` for playback-driven fallback, `paused` while paused, `reduced` for static Reduced Motion. Native volume slider, icon, percent and restrained feedback share one volume state; mute restores the previous audible level. Modal expands explicitly from the active session, preserves audio, contains focus and returns focus on close.

## Motion and copy

Animate only playback, focus, navigation or subtle art response. Avoid orbits, particles, automatic cards and constant page-wide effects. Transitions stay short and calm; remove nonessential motion under Reduced Motion. Generated imagery is not part of the system. Use familiar labels: About, Lyrics, Credits, Extra, Up next, Change genre, Resume Journey, Play/Pause/Resume, Saved, Open. Prefer short user-language copy, not product strategy. Rights/provenance remain accessible where decisions require them.

## Accessibility and large-catalog visual contract

One page main outside modal states; route titles/announcements/focus; keyboard actions; top dialog containment/Escape/focus return; accurate current/pressed/selected/value states; 44×44px important controls; non-color states; long names, missing art, unavailable audio and instrumentals usable; no overflow at desktop/390px/320px, no player/nav covering content. Large catalog uses bounded shelves/first renders, progressive disclosure, accessible cursor pagination or virtualization, debounced search with loading/empty/error/rights states, metadata-derived counts, layout-preserving skeletons, responsive art and one data-driven Genre composition. Never flatten full catalog in browser.

## Current quality status (reviewed 2026-10-03)

Candidate `9046918` is not ready for owner testing: Song Room Credits visibly renders `undefined`, compact Discover and Light-mode refinements still require new-head visual review, and the attempted runtime guard is ineffective architectural glue. Evidence `6f68fda` belongs to the failed head; preview `089bd21` belongs to older `cd25bbd`. After a source-level correction, regenerate and manually inspect all 18 desktop/mobile/Light/320px/Reduced Motion captures and audit the exact published artifact. Automated visual zeros are never visual approval.
