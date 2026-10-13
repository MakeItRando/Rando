# Library rev 24 — 2026-10-13

## Owner request and boundary

Owner called Library rev 23 too small / below the app's target level, asked for higher effort and useful results, not perfection. Exact message is in CONVERSATION_LOG.md. D-091 is superseded, **not approved**. D-092 / rev 24 is a proposal. Stay on Library until reviewed; Profile/Settings and First run follow later. Only the Home E design study changed; old v0.3.0 runtime / draft PR #5 remain untouched.

## What changed

Cover shelves with a distinct real-Liked cover stack; dedicated followed-artist section; no duplicated pinned items; Shelf/List toggle; useful album summaries with exact album-bound track previews; existing private song notes now searchable/editable; saved moments with exact clip ranges and pause/resume; Your month / Passport lower down. Import and Downloaded visibly labelled prototype-only. Direct entry `home.html?view=library`.

Spec: docs/specs/LIBRARY.md. Ideas and deferred scope: PRODUCT_IDEAS.md / BACKLOG.md. Renders 123–127 in the Home E study. No fictitious saved items or new user notes were added to make the delivery screenshots look fuller.

## Checks run

- `node --check design/studies/2026-10-05-home-e/app.js` — pass.
- `git diff --check` — pass.
- `CHROMIUM=$(which chromium) node design/studies/2026-10-05-home-e/check.mjs` — full study suite pass. The old moments-row assertion was updated to assert the new clip cards, preserving the same actual-count contract.
- `CHROMIUM=$(which chromium) node design/studies/2026-10-05-home-e/library-check.mjs` — **46 focused checks passed, zero failures / page exceptions**.
- Focused coverage: direct entry; saved item uniqueness; Shelf/List without audio changes; keyboard focus; Liked pause/resume; pinned artist + Undo without duplication; album track identity/bounded source; clip range/pause/resume/filter identity/Delete/Undo; honest notes empty state; actual note search and escaped editing; note Save/Delete/Undo while paused; long editable title; document/Library bounds; 44px changed action targets; playlist editor visible above the transport; 1440/1024/768/390/320; phone Back; honest empty albums/downloads; reduced-motion spinner.
- Screenshots rendered with `/skills/artifact-design/scripts/capture_html.py`, then opened **individually** for by-eye inspection. Desktop dark/light shelves, compact list, album/memory area, 390px shelves/artists/albums, 320px shelves/albums, Moments filter, empty search, phone note editor, phone playlist editor. Editor note text was explicitly synthetic QA text, not a user note or delivery fixture.

## Bugs found and fixed during this iteration

1. Saved moment Undo did not refresh Library while paused — changes now sync through `momUI` / `lbSync`; signature tracks clip identity/ranges, not just count.
2. New Library note opener was immediately closed by the legacy outside-click listener — propagation fixed; Save/Delete/Undo refresh even while paused.
3. Existing fixed `300px` inner note editor overflowed its popup; global popup button width forced action-row overflow — inner editor now fits, actions retain 44px heights and their own widths; textarea escapes user text.
4. A `1fr` phone shell track kept the mini-player's min-content width at 320px — `minmax(0,1fr)` and min-width constraints fix it.
5. Artist New-release text wrapped awkwardly; menu target extended beyond the narrow shelf — shorter truthful card label and contained 44px target.
6. Narrow album action row exceeded its text column — constrained action grid, wrapping Open album label, no hidden action.
7. Playlist editor could sit behind the phone mini-player despite fitting inside the overall viewport — menus/editors now respect the main-content bottom; regression checks that bound.
8. Popup animated its geometry because `transition` applied to every property — only opacity/transform now transition.
9. Download state falsely promised offline audio in the toast/footer — copy explicitly says state preview only, no offline audio stored.

## By-eye result and limits

Reviewed replacements have no observed Library text/control overlap or broken cover/card layout in the states above. Horizontal category scrolling, ordinary vertical content scrolling and ellipsis on the unchanged tiny mini-player are intentional. The capture helper can geometrically flag the off-screen translated queue drawer on phone; it is closed, not actually covering Library. This is not an exhaustive app-wide or assistive-technology certification.

Study catalog and sleeves are still fictional placeholders. Prototype playback/collection/download state is not production streaming or durable offline storage. List preference is session-only. Async fetch/loading/retry/rights states and large-library performance are production requirements, not working features demonstrated here. No “perfect,” production-ready, or owner-approved claim.

## Publication

Code/docs/tests and five reviewed study renders are pushed to `main` in bounded commits. Verify the pushed tree against the local copy and rerun both study suites on a fresh clone; publication verification is recorded below when complete. A GitHub source push and GitHub Pages deployment are separate checks.
