# Product and engineering decision log

Statuses:

- **Confirmed** — explicit user direction or established non-negotiable.
- **Working** — implemented experiment that still needs user validation.
- **Open** — decision required before the related phase.
- **Superseded** — historical direction that must not guide new work.

| ID | Status | Decision | Reason / evidence |
| --- | --- | --- | --- |
| D-001 | Confirmed | Product name in the experience is **Rondo**. | Existing brand and user discussion. Repository spelling remains an open cleanup question. |
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
| D-023 | Confirmed | Real artists, songs, accounts, ingestion, backend, and payments start after experience approval. | Explicit phase boundary from the user. |
| D-024 | Confirmed | `main` carries stable runtime and canonical specifications; user-test candidates stay unmerged until accepted. | User requested all important specs on main but testers separate. |
| D-025 | Confirmed | Every meaningful change updates the handoff in the same work session. | Explicit user request for continuity. |
| D-026 | Confirmed | Never ask the user to test while required checks are red or visual QA is incomplete. | Quality policy and current QA discrepancy. |
| D-027 | Open | Repository/package/domain spelling: retain `Rando` infrastructure or normalize to `Rondo`. | Needed before production branding. |
| D-028 | Open | First real-catalog path: artist uploads, licensed provider, or hybrid. | Determines ingestion, rights, and playback architecture. |
| D-029 | Open | Payment/value model and launch territories. | Determines entitlements, taxes, refunds, payouts, and store rules. |

## Decision-writing rules

- Append a new row when a decision changes; do not silently rewrite history.
- Mark the old row Superseded and reference the replacement.
- Separate confirmed behavior from experiments and recommendations.
- Record the decision before implementing dependent infrastructure.
- If code and this log disagree, stop and resolve the discrepancy instead of guessing.
