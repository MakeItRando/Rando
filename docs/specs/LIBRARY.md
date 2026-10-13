# Library

**Status:** D-092 proposal, Home E rev 24, 2026-10-13. Rev 23 / D-091 was not approved: owner called it too small / below the app's target level and requested a higher-effort iteration. Review Library before moving to Profile/Settings. Renders 123–127; interactive entry: `home.html?view=library`.

## Job and design direction

Library is the collection you have actually kept, not another discovery feed. Rev 23 gave every item the same small-row treatment. Rev 24 uses cover shelves, category-specific shapes, playable album previews, and private memories. Density has a practical alternative: **Shelf / List**, one reversible view control, no playback changes.

No invented inventory, recommendations, popularity or listening statistics. Covers remain the study's existing fictional catalog / placeholder sleeves (D-063), not newly generated production artwork.

## All / shelf view (default)

1. **Library header:** actual playlist / followed artist / saved album counts; New playlist (44px phone button).
2. **Category tabs:** All · Playlists · Artists · Albums · Moments · Notes · Downloaded. Underlined active tab, not seven bordered pills. Scrollable within its own region on phone.
3. **Find in Library**, Recent / A–Z, Switch to list view. Wide desktop uses one tools row; smaller screens use two rows.
4. **Your playlists** (or **Playlists & pins**): large playable cover cards. Liked songs is a wider feature with its real song count and a three-sleeve stack drawn from the actual liked set. Always first; pins follow, then playlists. Pinned artists/albums are not duplicated in their normal shelves. ⋯ stays visible; Play/Pause mirrors source state and resumes, never restarts an active source.
5. **Artists you follow:** circular covers, real names, New release only if an unseen release exists; real menus. Phone has three columns. A smaller visual menu circle retains its 44px hit target.
6. **Saved albums:** with one or two saved albums, horizontal summaries show artist, song count, calculated rounded duration, Play/Pause, Open album, ⋯, and the first three actual tracks (or fewer if fewer exist). Track buttons play the exact album/index with the album-bounded queue; tapping the current track pauses/resumes. More than two albums use cover cards. Albums filter always offers the full collection.
7. **Moments & notes:** the first two saved clips, with title, artist, exact start/end, actual clip duration and a thin range marker positioned against the full song. Song notes show their actual private text; no seeded user notes on delivery screenshots. Empty notes gives a quiet explanation rather than asking people to type on entry. View all opens the full filter.
8. **Your listening:** Your month and Passport remain reachable but live lower down, separate from the saved music.
9. **Footer:** plainly says import and offline playback are planned for the real app; Import options explains the limitation.

Sections with no saved inventory are omitted; no filler cards. A–Z and search results use one flat grid rather than category shelves so the ordering is truthful.

## List alternative

Same collection, same source state and actions, smaller covers; two columns on wide screens, one on narrow screens. Liked stays first, then pins, then Recent or A–Z. Moments & notes and listening links remain below. Layout choice survives navigation within the current study session, not a page reload. Shelf / List never switches, pauses or expands the queue.

## Search and ordering

- Music: matches saved item name and type / artist metadata.
- Moments filter: matches song or artist; filtered cards retain their original clip identity.
- Notes filter: matches song, artist or the actual note text.
- Find retains focus while typing; Escape clears. No matches gives an honest empty state and Show all clears the search.
- **Recent** means current source, then existing Recently played entries, then catalog/default order — not a fabricated date-added sort.
- **A–Z** is alphabetical except Liked/pins retain their deliberate top placement.
- Filters, view controls and card routes are keyboard accessible. Changing a category moves focus to its corresponding tab.

## Playlist management (preserved from rev 23)

- **New playlist:** creates an empty playlist and immediately opens name/description editing.
- **Edit details:** name required, up to 60 characters; optional description up to 140. Enter saves, Escape cancels. Rename propagates to sidebar, Library, playlist page and Now Playing. Undo.
- **Delete:** removes from Library, sidebar and Add to playlist. If browsing it, return to Library; playing audio remains uninterrupted. Undo restores the playlist and its pin.
- **Pin to top / Unpin:** works on desktop and phone; Undo. Artists also offer Go to artist / Unfollow; albums offer Go to artist / Remove from library, with Undo.
- Back from a playlist / artist / release opened through Library returns to Library and retains the chosen layout.

## Moments and notes

- Moments filter lists every actual clip; Play all uses the existing bounded moments queue. Tapping the currently playing clip pauses/resumes at its current position, not the start.
- Clip identity checks song **and** start/end, not just an array index (an artist-only moments queue can use the same index).
- Remove and Undo refresh Library while paused; range/signature changes are reflected even if the count does not change.
- Notes are the existing 140-character private song notes, now findable from Library. Edit reuses the note editor; Save, Delete and Undo refresh the collection even while paused. Text is escaped in cards and the textarea.
- There are no first-listen popups, mandatory notes or invented memories.

## Downloads and import: explicit prototype limits

Download / Remove download previews an in-memory downloading → downloaded state. Downloaded filter shows its song count and **“Download-state preview only. No offline audio stored.”** Empty downloads also explains that offline playback is not implemented. Completion toast says **state preview only**, not “plays without internet.” Real storage, quality, licensing, errors and mobile-data choices belong to the real apps/Settings. Import requires an authorized connector and account sign-in; no real import runs in this study.

## Responsive and production states

- Desktop tested at 1440, 1024 and 768px; phones at 390 and 320px. Phone shelves are two columns with Liked spanning both; followed artists are three columns; album previews and memories stack. No fixed-width desktop grid track is allowed to enlarge the phone shell.
- Changed Library controls have 44px targets; small visual icons keep their larger hit regions. Reduced motion disables Library transitions/spinner animation.
- Long editable names and notes wrap; no source metadata is invented to fill sparse sections.
- This synchronous study implements empty, no-match, downloading and undo states. Production requires separately tested loading skeletons, fetch failures with Retry, rights/unavailable states, persistent collection/view preferences, large-library pagination/virtualization and offline errors. They are **requirements**, not claimed working here.

## QA

The full study regression suite is `check.mjs`; the new focused suite is `library-check.mjs` (run with `CHROMIUM=$(which chromium) node ...`). See `handoff/SESSION_2026-10-13_LIBRARY.md` for exact scope and evidence. No production-ready/perfect claim.

## Next ideas — not built or approved

- **Folders / collection groups** when a large Library makes them useful; don't force filing on a small collection.
- **Saved but not heard** as a filter, backed only by genuine listen history. No made-up “forgotten gems” recommendation shelf.
- **Bulk selection** for organizing/removing/downloading many items when the real app supports it, with clear selection mode and Undo.

Social playlist-following / shared collections stay in the Profile & social phase, not added as fake people to Library.
