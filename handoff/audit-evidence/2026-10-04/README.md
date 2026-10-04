# Local playback audit observations

Diagnostic JSON from unchanged candidate `d9bc54f8db83efc1cc3360266391cd5d0a3442a0`, canonical `preview.html` over local HTTP, desktop 1440x900, Chromium 153. These are local probes, not GitHub CI results. No user data, credentials or production catalog was used.

`global-natural-end.json`: real 32-second Continuum recording allowed to finish naturally; wrong artist-next selection and stale Global ID.

`single-result-search.json`: Night Transit sole search result; source label says Discover search while stored queue has 20 unrelated items.

See ../../AUDIT_2026-10-04.md for reproduction and acceptance criteria. Passing existing suites does not invalidate these uncovered cases.
