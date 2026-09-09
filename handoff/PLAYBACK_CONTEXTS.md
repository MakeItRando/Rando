# Playback-context contract

**Status:** confirmed product contract; prototype implementation green; production migration required.

## Mental model

Rondo has one audio engine but two resumable logical sessions:

```text
Audio engine (one clock/source/volume/analyser)
  ├── Journey session
  └── Global session (Discover, Search, Sounds, Library, Release)
```

A session owns context and queue state. The audio engine renders only the active session. Route navigation and playback selection are deliberately separate actions.

## Journey session

Must retain independently:

- active genre ID;
- active artist ID;
- current track ID;
- bounded Journey queue and index;
- playback position;
- repeat mode;
- last Journey route;
- per-genre/artist/release progress;
- Journey-specific completion state.

Leaving a Journey does not clear, rebuild, or advance this session.

## Global session

Must retain independently:

- source surface (`discover`, `search`, `sound`, `library`, `release`, later editorial/profile links);
- stable source/context ID and truthful human label;
- current track ID;
- bounded source-derived queue and index;
- playback position;
- repeat mode;
- optional manually changed queue order.

Global queue membership comes from the shelf/results/list/release that initiated playback, not from the active Journey and not from every track in the client.

## Switching rules

| Action | Result |
| --- | --- |
| Navigate Journey → Discover while Journey audio plays | Journey stays active and continues in bottom transport |
| Select a Discover/Search/Sound/Library/Release song | Save Journey unchanged; activate global session and play selected song |
| Navigate while global song plays | Global session continues unchanged |
| Open Journeys while global song plays | Show saved Journey; global audio may continue until explicit Journey play |
| Resume/play a Journey track | Save global session unchanged; activate Journey session |
| Open Song Room | Expand active session only; never change context |
| Previous/Next/Up Next | Operate on active session's queue only |

No navigation event may implicitly switch context. No non-Journey play may increment Journey progress.

## Surface behavior

- **Bottom transport:** always follows the active session and persists through routes.
- **Desktop global playback:** show a right-side player with source label, artwork, track identity, save, relevant metadata, queue access, and explicit expand control.
- **Desktop Journey playback:** retain Journey composition and Journey queue affordances.
- **Mobile/compact:** persistent bottom transport; explicit tap/expand opens Song Room.
- **Song Room:** one expanded presentation for whichever session is active. Discover/global playback never forces it open.
- **Up Next:** clearly label source and current position. Never imply Journey sequencing for a global queue.
- **Context clarity:** use restrained labels such as `Journey · Kairo Vale` or `Discover · Hits today`, not a disruptive mode switch dialog.

## Prototype persistence

Candidate key: `rondo-playback-context-v1`.

```js
{
  version: 1,
  activePlaybackContext: "journey" | "global",
  journeySession: {
    activeGenreId,
    progressByGenre,
    lastJourneyRoute
  },
  globalSession: {
    sourceLabel,
    currentTrackId,
    queueTrackIds
  }
}
```

Prototype global queues are limited to 20 stable IDs. Artwork/base64/provider payloads are never persisted.

The compatibility controller protects the legacy singleton Journey state while Discover's current bridge plays the selected audio. It also suppresses the bridge's automatic Song Room open and programmatic artist-progress mutation. A layout override places the global inspector beside the canonical content column.

## Current evidence

- Candidate: `b752cc6d2d141c453fc9ba66441ccc568516bf8e`
- Workflow: `34387982105` / job `102588986970` — success
- Dedicated `tests/playback-contexts.mjs` — success in CI and against exact published HTML
- Updated Discover/Journey regression — success
- Smoke regression across Journey, Search, Library, Release, mobile, and Song Room — success
- Published HTML blob: `4c587e1a3affaf07a6dd183fcecf2cd5d3f0b0fc`, 517222 bytes

## Production target

Move ownership into a first-class store and audio controller before real catalog work:

```js
playback = {
  activeContext: "journey" | "global",
  journeySession: {
    contextId,
    sourceSurface: "journey",
    genreId,
    artistId,
    queueTrackIds,
    queueIndex,
    selectedTrackId,
    position,
    repeatMode
  },
  globalSession: {
    contextId,
    sourceSurface,
    sourceLabel,
    queueTrackIds,
    queueIndex,
    selectedTrackId,
    position,
    repeatMode
  }
}
```

Required production transition API:

- `playFromSource(source, trackId, queuePage)`
- `activatePlaybackContext(context)`
- `resumePlaybackContext(context)`
- `moveWithinActiveQueue(direction)`
- `replaceActiveQueue(ids, origin)`
- `persistBoundedSessionReferences()`

The source layer supplies stable IDs and cursor-bounded queues. The UI dispatches intents and never mutates another session directly. The single audio engine applies the resulting active-session source and clock.

## Production acceptance tests

1. Journey → every global source → Journey restoration.
2. Global → Journey → global restoration.
3. Previous/Next/queue selection in both contexts.
4. Route Back/Forward and reload in both contexts.
5. Position restoration for both sessions.
6. Malformed/old-state migration.
7. No Journey progress from global plays.
8. Queue pagination and unavailable-track handling.
9. Mobile background/lock-screen/media-session behavior.
10. One audio element/context/analyser and no overlapping sound.
