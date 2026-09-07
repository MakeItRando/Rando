# Full-concept gate failure

Run: 34104079923

## Browser log
```text

> rondo-design-prototype@0.3.1 test:browser
> node tests/smoke.mjs && node tests/quality.mjs && node tests/listening.mjs && node tests/song-room.mjs && node tests/audio.mjs && node tests/personal.mjs && node tests/user-ready.mjs && node tests/experience.mjs && node tests/full-concept.mjs && node tests/release-ready.mjs

Rondo interaction smoke test passed
{
  "checkedAt": "2026-09-07T09:06:24.563Z",
  "findings": [],
  "metadata": {
    "genreCount": 4,
    "browserErrors": []
  }
}
Immersive listening test passed.
Song Room test passed.
Authorized audio test passed.
Personal listening regression passed.
Rondo user-ready interaction test passed.
Rondo final experience regression passed.
Rondo full-concept regression passed.
Rondo release-readiness regression passed.
127.0.0.1 - - [07/Sep/2026 09:07:33] "GET /assets/artists/moni-gray.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:33] "GET /src/app.js HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:33] "GET /src/data/catalog.js HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:33] "GET /src/services/journey.js HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:33] "GET /src/services/audio.js HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:33] "GET /src/state/store.js HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:33] "GET /src/ui/views.js HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:33] "GET /src/ui/ambience.js HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:33] "GET /src/ui/songRoom.js HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:33] "GET /assets/covers/blacktop-studies.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:33] "GET /assets/artists/mira-son.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:33] "GET /assets/covers/silver-weather.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:33] "GET /assets/covers/southbound.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:33] "GET /assets/covers/signal-memory.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:33] "GET /assets/artists/nia-vale.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:33] "GET /assets/covers/margins.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:33] "GET /assets/covers/no-fixed-address.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:33] "GET /assets/covers/rooms-i-remember.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:33] "GET /assets/covers/first-light.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:33] "GET /assets/rondo-mark.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:33] "GET /index.html?skip-onboarding=1&screen=library HTTP/1.1" 304 -
127.0.0.1 - - [07/Sep/2026 09:07:34] "GET /index.html?skip-onboarding=1&screen=light HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:34] "GET /styles.css HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:34] "GET /listening.css HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:34] "GET /song-room.css HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:34] "GET /concept.css HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:34] "GET /assets/artists/kairo-vale.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:34] "GET /app.js HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:34] "GET /assets/covers/night-transit.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:34] "GET /assets/artists/moni-gray.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:34] "GET /src/app.js HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:34] "GET /src/data/catalog.js HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:34] "GET /src/services/journey.js HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:34] "GET /src/services/audio.js HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:34] "GET /src/state/store.js HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:34] "GET /src/ui/views.js HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:34] "GET /src/ui/ambience.js HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:34] "GET /src/ui/songRoom.js HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:34] "GET /assets/artists/nia-vale.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:34] "GET /assets/artists/mira-son.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:34] "GET /assets/covers/signal-memory.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:34] "GET /assets/covers/blacktop-studies.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:34] "GET /assets/covers/southbound.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:34] "GET /assets/covers/silver-weather.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:34] "GET /assets/covers/margins.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:34] "GET /assets/covers/no-fixed-address.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:34] "GET /assets/covers/rooms-i-remember.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:34] "GET /assets/covers/first-light.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:34] "GET /assets/rondo-mark.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:34] "GET /index.html?skip-onboarding=1&screen=light HTTP/1.1" 304 -
127.0.0.1 - - [07/Sep/2026 09:07:35] "GET /index.html?skip-onboarding=1 HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:35] "GET /listening.css HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:35] "GET /styles.css HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:35] "GET /song-room.css HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:35] "GET /concept.css HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:35] "GET /app.js HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:35] "GET /assets/artists/kairo-vale.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:35] "GET /assets/covers/night-transit.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:35] "GET /assets/artists/moni-gray.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:35] "GET /src/app.js HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:35] "GET /src/data/catalog.js HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:35] "GET /src/services/journey.js HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:35] "GET /src/services/audio.js HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:35] "GET /src/state/store.js HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:35] "GET /src/ui/views.js HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:35] "GET /src/ui/ambience.js HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:35] "GET /src/ui/songRoom.js HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:35] "GET /assets/artists/mira-son.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:35] "GET /assets/covers/signal-memory.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:35] "GET /assets/covers/blacktop-studies.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:35] "GET /assets/covers/southbound.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:35] "GET /assets/artists/nia-vale.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:35] "GET /assets/covers/silver-weather.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:35] "GET /assets/covers/margins.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:35] "GET /assets/covers/no-fixed-address.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:35] "GET /assets/covers/rooms-i-remember.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:35] "GET /assets/covers/first-light.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:35] "GET /assets/rondo-mark.svg HTTP/1.1" 200 -
127.0.0.1 - - [07/Sep/2026 09:07:35] "GET /index.html?skip-onboarding=1 HTTP/1.1" 304 -
127.0.0.1 - - [07/Sep/2026 09:07:35] "GET /assets/audio/night-transit.mp3 HTTP/1.1" 200 -
```
