# Product and engineering decision log

Statuses: **Confirmed** (non-negotiable), **Working** (testable experiment), **Open** (input required), **Superseded** (historical; do not restore).

| ID | Status | Decision | Reason / evidence |
| --- | --- | --- | --- |
| D-001 | Confirmed | Product name in the experience is **Rondo**. | Existing brand and user discussion. |
| D-002 | Confirmed | Rondo is independent, not a wrapper or clone of another streaming app. | Product foundation. |
| D-003 | Confirmed | Core rhythm is `find → play → explore → keep`. | Immediate discovery plus deeper journeys and memory. |
| D-004 | Confirmed | Primary navigation is Discover, Library, Journeys, and Profile. | Candidate and recovered chat. |
| D-005 | Superseded | Opening Discover shows a genre chooser. | User explicitly rejected it. |
| D-006 | Confirmed | Discover opens directly as a song-first music home. | User requested songs, search, hits, bangers, moods, and direct exploration. |
| D-007 | Confirmed | Genre selection belongs to Journeys. | Explicit user direction. |
| D-008 | Confirmed | Journeys shows a picker only with no active Journey or after Change genre. | Clear first use and fast return. |
| D-009 | Confirmed | Each genre is a route-backed subpage beneath Journeys. | Distinct URLs/titles/landmarks with shared playback. |
| D-010 | Confirmed | Meaningful progress is independent per genre and survives navigation/reload. | User continuity requirement. |
| D-011 | Superseded | Discover playback merely avoids replacing the active Journey genre. | Too weak; replaced by D-036 through D-040. |
| D-012 | Confirmed | Changing genre erases no progress and stops no song. | User continuity requirement. |
| D-013 | Confirmed | Active playback continues through navigation. | Core product quality. |
| D-014 | Confirmed | Artist Journey uses deliberate alphabetical progression, release sequence, and explicit artist-boundary confirmation. | Original product promise. |
| D-015 | Confirmed | Controls truthfully say Play, Pause, or Resume and preserve position. | User called out prior behavior. |
| D-016 | Confirmed | Song Room is immersive but restrained, with honest waveform/volume feedback and familiar language. | User rejected plain/toy-like and excessive presentation. |
| D-017 | Confirmed | Use app-scale typography and human-made design; avoid giant type, generated decoration, excessive animation, and overexplained copy. | Direct feedback. |
| D-018 | Confirmed | Motion serves playback/navigation/focus/state and respects Reduced Motion. | Accessibility/design standard. |
| D-019 | Confirmed | No fake charts, unsupported live analysis, streaks, autoplay traps, or manipulative locks. | Recovered agreement. |
| D-020 | Confirmed | Made for you/Because you liked appears only after genuine history. | No fabricated personalization. |
| D-021 | Working | Optional extras may unlock after genuine listening; core music/information never locks. | Validate during owner test. |
| D-022 | Confirmed | Prototype uses fictional catalog data and original Rondo demo audio only. | Rights boundary. |
| D-023 | Superseded | Real-system work including payments starts after experience approval. | Real-system boundary remains; payments replaced by D-032. |
| D-024 | Confirmed | `main` carries stable runtime/canonical specs; test candidates remain unmerged until accepted. | User continuity request. |
| D-025 | Confirmed | Every meaningful change updates handoff in the same work session. | Explicit user request. |
| D-026 | Confirmed | Never ask for testing while required checks, visual QA, preview audit, or docs disagree. | Quality policy. |
| D-027 | Superseded | Keep `Rando` or normalize to `Rondo`. | Resolved by D-030. |
| D-028 | Superseded | Choose artist uploads, licensed provider, or hybrid now. | Replaced by D-031 and owner-supplied legal path. |
| D-029 | Superseded | Payment model and territory are one open decision. | V1 payment scope resolved; territory remains D-033. |
| D-030 | Confirmed | **Rondo** is canonical for product, repository, package, infrastructure, domain, and future store name; existing `Rando` URLs remain only until a safe migration. | Owner: “Rondo everywhere.” |
| D-031 | Confirmed | Catalog is artist-, genre-, and source-inclusive; build provider-neutral ingestion/browsing for thousands first and millions without redesign. Owner supplies legal acquisition plan first. | Public availability is never code-level authorization. |
| D-032 | Confirmed | **V1 has no payments.** | Owner answer; revisit only in a separately approved later phase. |
| D-033 | Open | Launch territory/platform mix and concrete legal/source package are required before production ingestion/playback. | Affects rights, infrastructure, and operations. |
| D-034 | Confirmed | `src/ui/discoveryHub.js` is the canonical v0.3.2 Discover/Journey route implementation. Legacy `renderDiscoverView()` in `src/ui/views.js` must never be revived and must be deleted before production catalog integration after caller migration/verification. | Avoid two competing product contracts. |
| D-035 | Confirmed | Production catalog UI uses stable Rondo IDs, normalized provider-neutral models, bounded shelves/results, cursor pagination, indexed/debounced search, bounded listener references, and one shared data-driven Genre implementation. | Scale from thousands to millions without a product rewrite. |
| D-036 | Confirmed | Journey and non-Journey listening are separate logical playback sessions and queues over exactly one physical audio engine. | Owner correction after the prior candidate mutated Journey state from Discover. |
| D-037 | Confirmed | Navigation never switches playback context. A trusted play action switches context only when its source belongs to the other session. | Audio continuity without accidental state mutation. |
| D-038 | Confirmed | Starting Discover, Search, Library, Sounds, or Release playback must not change Journey genre, artist, track, queue, route, position, or progress. | Explicit owner requirement. |
| D-039 | Confirmed | Global playback uses the initiating source's bounded queue, truthful Up Next, persistent bottom transport, desktop side player, and manually expandable Song Room. It never auto-expands Song Room. | Familiar control plus context clarity. |
| D-040 | Confirmed | Returning to Journeys restores its saved session. Explicit Journey playback switches back without deleting the global session. | Both sessions remain resumable. |
| D-041 | Confirmed | Prototype compatibility interception is temporary. Production must model contexts in the store/audio controller and remove DOM interception before real-catalog integration. | Prevent prototype glue from becoming production architecture. |


| D-042 | Confirmed | Living Record study PR #9 is rejected, closed and unmerged; original Rondo is the sole design foundation. | Owner explicitly preferred original; current screenshot 05 and PR #9 record verdict. Do not revive or blend rejected concepts. |
| D-043 | Superseded by D-048 for the design phase | Improve actual components through small comparative changes, not wholesale concept-board resets. | Owner rejection plus contributor reset; preserve dark musical identity, art, navigation and Song Room. |
| D-044 | Confirmed | This 2026-10-04 round is orientation, documentation and archive only; no application development or candidate merge. | Explicit current owner instruction. |
| D-045 | Confirmed | Listeners can play before email/taste setup, at least for the whole development/testing period; setup is offered when useful. Revisit for launch. | Owner answer 2026-10-04 session 2: "yes, until we aren't done with development at least, because we need testing". |
| D-046 | Confirmed | Following an artist means both: saved in Library and new-release updates. See docs/specs/FOLLOWING.md. | Owner answer 2026-10-04 session 2. |
| D-047 | Confirmed | Listeners can create their own playlists (V1 scope). See docs/specs/PLAYLISTS.md. | Owner request 2026-10-04 session 2. |
| D-048 | Confirmed | Design-first phase: design every page (systematic, page by page) to a modern standard before choosing implementation approaches. Wholesale visual modernization is allowed; D-042 (no Living Record) still holds. See handoff/DESIGN_PROGRAM.md. | Owner: v0.3.1 preview "fine but not that good", looks dated; "design it first then we will think about approaches". |
| D-049 | Superseded by D-051 | Foundation study A: neutral graphite canvas, artwork-derived ambience, single coral accent, Geist type, Home + persistent Now Playing panel, "Playing from" source line everywhere. | Owner 2026-10-05: right direction, but colors and wording feel overused/AI slop. |
| D-050 | Confirmed | No AI features in Rondo for now. Any later AI must solve a stated listener problem and make no unverifiable claims. | Owner 2026-10-05: "no ai for rando yet". |
| D-051 | Superseded by D-053 (anti-slop rules still binding) | Study B "instrument" foundation: neutral hairline UI, mono metadata, flat sleeves, waveform scrubber, plain wording, single live-state accent. Anti-slop rules in DESIGN_PROGRAM.md are binding. | Awaiting owner verdict. |
| D-054 | Proposal | Study D: state-aware play controls everywhere, Open Journey always available, per-source truthful queues, single player column (no bottom bar), clutter removed. | Awaiting owner verdict. |
| D-055 | Confirmed | Every playback control reflects its source's live state (not started / in progress / playing / paused) on every surface; the Journey card always offers Open Journey. | Owner 2026-10-05 feedback on study C. |
| D-053 | Superseded by D-054 | Study C: B's system + sleeve-colour flat surfaces, Journey artist path signature, interactive motion, truthful source switching. | Awaiting owner verdict. |
| D-052 | Confirmed | Design placeholders must not look like AI imagery; use flat designed sleeves until real catalog art exists. | Owner 2026-10-05: "don't make it look like AI slop". |

## Writing rules

- Append when a decision changes; mark the old row Superseded and reference its replacement.
- Separate confirmed behavior from experiments and recommendations.
- Record a decision before dependent infrastructure.
- If code and this log disagree, stop and resolve the discrepancy.
- QA status belongs in `STATE.md`/`QUALITY_GATES.md`; use this log only for durable contracts.
