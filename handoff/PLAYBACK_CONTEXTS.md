# Playback-context contract

**Status:** confirmed product behavior, candidate prototype compatibility implementation; production migration required. See [STATE.md](STATE.md) for live candidate and evidence.

## Mental model

One physical audio element/clock/volume/analyser and persistent bottom transport, **two independently resumable logical sessions and queues**. Journey owns genre, artist, track, bounded queue/index, position, repeat, route and progress. Global owns source surface/context/label, track, bounded source-derived queue/index, position and repeat. The active session alone drives the audio engine. Navigation changes the page, not the playback session; explicit play from another context switches it. Opening Song Room expands the active song without switching context.

## Required switching behavior

- Journey playback continues while moving to Discover. A Discover/Search/Sounds/Library/Release play action saves Journey unchanged and activates Global.
- Global Previous/Next and Up next use the initiating shelf/results/list/release, never Journey or the entire catalog. Missing source roots degrade to a bounded page queue rather than throw.
- Returning to Journeys shows saved Journey route, artist, track and progress while Global audio can continue; explicit Journey play resumes Journey and retains Global for later.
- Desktop Global context has source-labeled side player and bottom transport; mobile uses bottom transport; Song Room opens only on explicit expansion.
- No non-Journey action increments Journey progress or changes its queue. No navigation action implicitly switches context. No overlapping sound or second physical player.

## Prototype truth

Candidate `9046918` stores bounded IDs under `rondo-playback-context-v1` alongside legacy `rondo-prototype-v2` and `rondo-route-state-v1`. `src/ui/playbackContexts.js`, `src/ui/playbackContextLayout.js`, and `src/ui/journeyStateGuard.js` bridge the singleton app through DOM/event interception; the global prototype queue limit is 20 track IDs. Do not persist artwork/base64/provider payloads. The layers are compatibility glue, not production architecture. In the 2026-10-03 local recheck, the dedicated playback-context suite passed before the later Song Room failure; this proves that test at that head, not overall release readiness. Preview `089bd21` is stale and cannot certify the current implementation. The compatibility layers remain migration debt: production ownership must move into explicit store/audio commands, not DOM observation or event interception.

## Production target

First-class store object: `activeContext: 'journey' | 'global'` and separately versioned `journeySession`/`globalSession`, each with stable `contextId`, `sourceSurface`, `sourceLabel`, `queueTrackIds`, `queueIndex`, `selectedTrackId`, `position`, and `repeatMode`; Journey also owns genre/artist/route/progress. Retain one physical audio engine. UI dispatches `playFromSource`, `activatePlaybackContext`, `resumePlaybackContext`, `moveWithinActiveQueue`, `replaceActiveQueue`, `persistBoundedSessionReferences`; it must not mutate another session directly. Source adapters and APIs provide stable IDs and cursor-bounded playable windows, not a global browser catalog.

Migration plan: model and version both sessions in store, route each play intent through audio controller, migrate and repair legacy keys, test isolation/restoration and media authorization, then remove interception/duplicate render paths. Preserve back/forward/reload without autoplay, queue source truthfulness, 320px and keyboard behavior. Production tests must cover Journey→each Global source→Journey, Global→Journey→Global, Previous/Next, both positions, malformed state, rights/unavailable tracks, queue pagination, lock-screen/media controls and one-engine invariant.
