# Snapshot and media evidence

Store durable UX evidence here. Keep generated test artifacts and disposable previews off `main`; retain only selected evidence that explains an approved decision, regression, or release.

## Naming

```text
YYYY-MM-DD_<version>_<route>_<state>_<viewport>_<appearance>.<png|jpg|webp|mp4>
```

Examples:

```text
2026-09-09_v0.3.2_discover_default_1440x900_night.png
2026-09-09_v0.3.2_song-room_playing_390x844_night.mp4
```

## Every asset needs an entry

Add its metadata and purpose to `../SNAPSHOTS.md`:

- branch and exact SHA;
- preview/build URL;
- route, state, viewport, appearance, and Reduced Motion setting;
- what the asset proves;
- any visible known issue;
- related check or test run.

## Retention rules

- Do not commit secrets, personal production data, licensed media without authorization, or huge raw recordings.
- Prefer compressed PNG/WebP/JPEG for stills and short MP4/WebM clips for motion.
- Keep source captures outside the release tree when they are merely generated QA output.
- Commit representative evidence only after visual inspection.
- Never treat a screenshot as proof that interactions, accessibility, or runtime errors passed.
