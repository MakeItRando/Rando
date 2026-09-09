# Product and engineering decision log

Statuses:

- **Confirmed** — explicit user direction or established non-negotiable.
- **Working** — implemented experiment that still needs user validation.
- **Open** — decision required before the related phase.
- **Superseded** — historical direction that must not guide new work.

| ID | Status | Decision | Reason / evidence |
| --- | --- | --- | --- |
| D-001 | Confirmed | Product name in the experience is **Rondo**. | Existing brand and user discussion. |
| D-002 | Confirmed | Rondo is independent, not a Spotify wrapper or clone. | Product foundation and user ambition. |
| D-003 | Confirmed | Core product rhythm is `find → play → explore → keep`. | Reconciles immediate discovery with deeper journeys and memory. |
| D-004 | Confirmed | Primary navigation is Discover, Library, Journeys, and Profile. | Candidate design and recovered chat. |
| D-005 | Superseded | Opening Discover should show a genre chooser popup. | User explicitly rejected this approach. Do not restore it. |
| D-006 | Confirmed | Discover opens directly as a song-first music home. | User requested songs, suggestions, search, hits, bangers, moods, and exploration without interruption. |
| D-007 | Confirmed | Genre selection belongs to Journeys. | User explicitly moved genre choice and exploration into Journeys. |
| D-008 | Confirmed | Journeys opens a genre picker only when there is no active Journey or the user selects Change genre. | Keeps first use clear and returning use fast. |
| D-009 | Confirmed | Each genre is a distinct page-like subroute beneath Journeys. | User requested subpages; route-backed SPA approach preserves playback and accessibility. |
| D-010 | Confirmed | Meaningful progress is independent per genre and survives navigation/reload. | User required every part of progress to be remembered. |
| D-011 | Confirmed | Playing from Discover must not replace the active Journey. | Candidate correction and continuity requirement. |
| D-012 | Confirmed | Changing genre must not erase another genre's progress or stop the active song. | User continuity requirement. |
| D-013 | Confirmed | Global playback continues while navigating Discover, Genre pages, and Journeys. | Accepted recommendation and core product quality. |
| D-014 | Confirmed | Artist Journey remains deliberate: alphabetical artist progression, releases in sequence, and confirmation at the artist boundary. | Original product promise retained. |
| D-015 | Confirmed | Play controls must truthfully say Play, Pause, or Resume and preserve position. | User called out the broken Play artist behavior. |
| D-016 | Confirmed | Song Room should be immersive but restrained, with active waveform/volume feedback and familiar language. | User rejected plain or toy-like presentation and excessive copy/effects. |
| D-017 | Confirmed | Use app-scale typography and human-made design. Avoid giant type, needless AI imagery, excessive animation, and overexplained copy. | Direct user feedback. |
| D-018 | Confirmed | Motion supports playback, navigation, focus, or state and respects Reduced Motion. | Design and accessibility standard. |
| D-019 | Confirmed | Avoid fake charts, unsupported live-analysis claims, streaks, autoplay traps, and manipulative unlock loops. | User/assistant agreement in recovered context. |
| D-020 | Confirmed | “Because you liked…” appears only after genuine history exists. | Avoids fake personalization in a cold start. |
| D-021 | Working | Optional release extras may unlock after genuine listening, but core music and required information never lock. | Candidate experiment; validate during user testing. |
| D-022 | Confirmed | The prototype uses fictional catalog data and original Rondo demo audio only. | Rights boundary and current source. |
| D-023 | Superseded | Real artists, songs, accounts, ingestion, backend, and payments start after experience approval. | Real-system phase boundary remains, but payment scope is replaced by D-032. |
| D-024 | Confirmed | `main` carries stable runtime and canonical specifications; user-test candidates stay unmerged until accepted. | User requested all important specs on main but testers separate. |
| D-025 | Confirmed | Every meaningful change updates the handoff in the same work session. | Explicit user request for continuity. |
| D-026 | Confirmed | Never ask the user to test while required checks are red or visual QA is incomplete. | Quality policy and current QA discrepancy. |
| D-027 | Superseded | Repository/package/domain spelling: retain `Rando` infrastructure or normalize to `Rondo`. | Resolved by D-030. |
| D-028 | Superseded | First real-catalog path: artist uploads, licensed provider, or hybrid. | Replaced by the source-neutral, owner-supplied legal path in D-031. |
| D-029 | Superseded | Payment/value model and launch territories. | V1 payment scope is resolved by D-032; territory remains a separate production input in D-033. |
| D-030 | Confirmed | **Rondo** is the canonical product, repository, package, infrastructure, domain, and future app-store name. Existing `Rando` URLs remain until a planned migration avoids breakage. | Product-owner answer on 2026-09-09: “Rondo everywhere.” |
| D-031 | Confirmed | The production catalog is artist-, genre-, and source-inclusive. Build provider-neutral ingestion and browsing that can hold thousands of songs initially and scale to millions without redesign. The product owner will supply the legal acquisition plan before source integration begins. | Product-owner answer on 2026-09-09. Public availability in another app is never treated by code as authorization; Rondo integrates only through the supplied legal path. |
| D-032 | Confirmed | **V1 has no payments.** Do not build checkout, subscriptions, tips, artist billing, payment entitlements, or payout flows into V1. | Product-owner answer on 2026-09-09. Payments may be reconsidered only as a separately approved later phase. |
| D-033 | Open | Launch territory, platform mix, and the concrete legal/source integration package are required before production ingestion and playback implementation. | These affect availability, rights enforcement, infrastructure, and release operations without narrowing the intended catalog. |

## Decision-writing rules

- Append a new row when a decision changes; do not silently rewrite history.
- Mark the old row Superseded and reference the replacement.
- Separate confirmed behavior from experiments and recommendations.
- Record the decision before implementing dependent infrastructure.
- If code and this log disagree, stop and resolve the discrepancy instead of guessing.
