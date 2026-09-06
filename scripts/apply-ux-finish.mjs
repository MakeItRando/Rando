import { readFileSync, writeFileSync } from 'node:fs';

function replaceOnce(source, before, after, label) {
  if (source.includes(after)) return source;
  if (!source.includes(before)) throw new Error(`Patch target not found: ${label}`);
  return source.replace(before, after);
}

function replaceText(source, before, after, label) {
  if (source.includes(after)) return source;
  if (!source.includes(before)) throw new Error(`Copy target not found: ${label}`);
  return source.replace(before, after);
}

let app = readFileSync('src/app.js', 'utf8');
app = replaceOnce(app,
  "inspectorTab: 'details', playing: false, position: 7, repeatMode: 'continue', view: 'discover',",
  "inspectorTab: 'details', playing: false, position: 0, repeatMode: 'continue', view: 'discover',",
  'honest initial position');
app = replaceOnce(app,
  'let modalReturnFocus = null;',
  'let modalReturnFocus = null;\nlet activeArtistSessionId = null;\nlet mediaSessionTrackId = null;',
  'artist playback session state');
app = replaceOnce(app,
  "artistOrigin: $('artistOrigin'), artistYears: $('artistYears'), artistTags: $('artistTags'), artistBio: $('artistBio'), saveArtist: $('saveArtist'),",
  "artistOrigin: $('artistOrigin'), artistYears: $('artistYears'), artistTags: $('artistTags'), artistBio: $('artistBio'), saveArtist: $('saveArtist'), playArtist: $('playArtist'),",
  'play artist element');

if (!app.includes('// Final listening controls')) {
  app = replaceOnce(app, 'function renderArtistFocus() {', `// Final listening controls\nfunction syncArtistPlaybackAction() {\n  const artist = currentArtist();\n  const currentSession = activeArtistSessionId === artist.id;\n  const playing = Boolean(state().playing && currentSession);\n  const playbackState = playing ? 'pause' : currentSession ? 'resume' : 'play';\n  const label = playbackState === 'pause' ? 'Pause artist' : playbackState === 'resume' ? 'Resume artist' : 'Play artist';\n  if (elements.playArtist.dataset.playbackState !== playbackState || elements.playArtist.dataset.artistId !== artist.id) {\n    elements.playArtist.dataset.playbackState = playbackState;\n    elements.playArtist.dataset.artistId = artist.id;\n    elements.playArtist.innerHTML = \`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">\${playing ? pausePath : playPath}</svg><span>\${label}</span>\`;\n  }\n  elements.playArtist.classList.toggle('playing', playing);\n  elements.playArtist.setAttribute('aria-pressed', String(playing));\n  elements.playArtist.setAttribute('aria-label', \`\${label} · \${artist.name}\`);\n}\n\nfunction syncCatalogPlaybackControls() {\n  document.querySelectorAll('.track-row').forEach((row) => {\n    const button = row.querySelector('[data-play-track]');\n    const number = row.querySelector('.track-number');\n    if (!button || !number) return;\n    if (!number.dataset.index) number.dataset.index = number.textContent.trim();\n    const selected = row.dataset.track === state().selectedTrackId;\n    const playing = selected && state().playing;\n    const label = playing ? 'Pause' : selected && activeArtistSessionId === state().artistId ? 'Resume' : 'Play';\n    const title = row.querySelector('.track-name strong')?.textContent.trim() || 'track';\n    row.dataset.playbackState = playing ? 'playing' : selected ? 'selected' : 'idle';\n    button.setAttribute('aria-label', \`\${label} \${title}\`);\n    button.setAttribute('aria-pressed', String(playing));\n    number.innerHTML = playing\n      ? '<span class="track-equalizer" aria-hidden="true"><i></i><i></i><i></i></span>'\n      : selected\n        ? \`<svg class="track-state-icon" viewBox="0 0 24 24" aria-hidden="true">\${playPath}</svg>\`\n        : escapeHtml(number.dataset.index);\n  });\n}\n\nfunction syncMediaSession(context = currentContext()) {\n  if (!context || !('mediaSession' in navigator)) return;\n  const { artist, release, track } = context;\n  try {\n    if (mediaSessionTrackId !== track.id && 'MediaMetadata' in window) {\n      mediaSessionTrackId = track.id;\n      navigator.mediaSession.metadata = new MediaMetadata({\n        title: track.title,\n        artist: trackArtistLine(track, artist),\n        album: release.title,\n        artwork: [{ src: new URL(release.cover, window.location.href).href, type: 'image/svg+xml' }]\n      });\n    }\n    navigator.mediaSession.playbackState = state().playing ? 'playing' : 'paused';\n    if (navigator.mediaSession.setPositionState) {\n      const duration = Math.max(1, playbackDuration(track));\n      navigator.mediaSession.setPositionState({ duration, position: Math.min(duration, Math.max(0, state().position)), playbackRate: 1 });\n    }\n  } catch {\n    // Media Session support varies; core playback remains unaffected.\n  }\n}\n\nfunction bindMediaSession() {\n  if (!('mediaSession' in navigator)) return;\n  const handlers = {\n    play: () => setPlaying(true),\n    pause: () => setPlaying(false),\n    previoustrack: () => changeTrack(-1),\n    nexttrack: () => changeTrack(1),\n    seekbackward: (details = {}) => seekTo(state().position - (details.seekOffset || 10)),\n    seekforward: (details = {}) => seekTo(state().position + (details.seekOffset || 10)),\n    seekto: (details = {}) => { if (Number.isFinite(details.seekTime)) seekTo(details.seekTime); },\n    stop: () => setPlaying(false)\n  };\n  Object.entries(handlers).forEach(([action, handler]) => {\n    try { navigator.mediaSession.setActionHandler(action, handler); } catch { /* Unsupported action. */ }\n  });\n}\n\nfunction renderArtistFocus() {`, 'final listening helpers');
}

app = replaceOnce(app,
  "  elements.saveArtist.setAttribute('aria-label', saved ? 'Remove artist from Library' : 'Save artist to Library');\n  syncLocation();",
  "  elements.saveArtist.setAttribute('aria-label', saved ? 'Remove artist from Library' : 'Save artist to Library');\n  syncArtistPlaybackAction();\n  syncLocation();",
  'artist action sync');
app = replaceOnce(app,
  "  elements.releases.querySelectorAll('[data-save-release]').forEach((button) => button.addEventListener('click', () => toggleReleaseSave(button.dataset.saveRelease)));\n}",
  "  elements.releases.querySelectorAll('[data-save-release]').forEach((button) => button.addEventListener('click', () => toggleReleaseSave(button.dataset.saveRelease)));\n  syncCatalogPlaybackControls();\n}",
  'catalog playback sync');
app = replaceOnce(app,
  "      if (saveButton) { event.stopPropagation(); toggleTrackSave(saveButton.dataset.saveTrack); return; }\n      selectTrack(row.dataset.track, true);",
  "      if (saveButton) { event.stopPropagation(); toggleTrackSave(saveButton.dataset.saveTrack); return; }\n      if (row.dataset.track === state().selectedTrackId) { togglePlaying(); return; }\n      selectTrack(row.dataset.track, true);",
  'active track toggle');
app = replaceOnce(app,
  "  elements.fullPlay.setAttribute('aria-label', state().playing ? 'Pause' : 'Play');\n  document.body.classList.toggle('is-playing', state().playing);",
  "  elements.fullPlay.setAttribute('aria-label', state().playing ? 'Pause' : 'Play');\n  document.body.classList.toggle('is-playing', state().playing);\n  syncArtistPlaybackAction();\n  syncCatalogPlaybackControls();\n  syncMediaSession(context);",
  'global playback UI sync');
app = replaceOnce(app,
  "function selectGenre(genreId) {\n  const continuePlaying = state().playing;\n  audioEngine.pause();",
  "function selectGenre(genreId) {\n  const continuePlaying = state().playing;\n  if (!continuePlaying) activeArtistSessionId = null;\n  audioEngine.pause();",
  'genre session reset');
app = replaceOnce(app,
  "function selectArtist(artistId, shouldPlay = false) {\n  const continuePlaying = shouldPlay || state().playing;\n  audioEngine.pause();",
  "function selectArtist(artistId, shouldPlay = false) {\n  const continuePlaying = shouldPlay || state().playing;\n  if (!continuePlaying) activeArtistSessionId = null;\n  audioEngine.pause();",
  'artist session reset');
app = replaceOnce(app,
  "    store.set({ playing: false, directoryCollapsed: false });",
  "    store.set({ playing: false });",
  'stable layout on pause');
app = replaceOnce(app,
  "  const duration = playbackDuration(context.track);\n  const nextPosition = state().position >= duration - .1 ? 0 : state().position;\n  store.set({ playing: true, directoryCollapsed: true, position: nextPosition });",
  "  const duration = playbackDuration(context.track);\n  const nextPosition = state().position >= duration - .1 ? 0 : state().position;\n  activeArtistSessionId = state().artistId;\n  store.set({ playing: true, directoryCollapsed: true, position: nextPosition });",
  'active artist session');
app = replaceOnce(app,
  "  const index = queue.findIndex((track) => track.id === state().selectedTrackId);\n  const nextIndex = index + direction;",
  "  const index = queue.findIndex((track) => track.id === state().selectedTrackId);\n  if (direction < 0 && state().position > 3) { seekTo(0); return; }\n  const nextIndex = index + direction;",
  'previous restarts current track');
app = replaceOnce(app,
  "  $('playArtist').addEventListener('click', () => { const first = currentQueue()[0]; if (first) selectTrack(first.id, true); });",
  "  elements.playArtist.addEventListener('click', () => {\n    if (activeArtistSessionId === state().artistId) { togglePlaying(); return; }\n    const first = currentQueue()[0];\n    if (first) selectTrack(first.id, true);\n  });",
  'truthful play artist control');
app = replaceOnce(app,
  "  $('stopJourney').addEventListener('click', () => { closeCompletion(); setPlaying(false); showToast('Journey paused'); });",
  "  $('stopJourney').addEventListener('click', () => { closeCompletion(); activeArtistSessionId = null; setPlaying(false); syncArtistPlaybackAction(); showToast('Journey stopped'); });",
  'stop clears artist session');
app = replaceOnce(app,
  "    if (event.code === 'Space' && document.activeElement === document.body) { event.preventDefault(); togglePlaying(); }",
  "    const activeElement = document.activeElement;\n    const interactive = activeElement?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(activeElement?.tagName);\n    const modal = topModal();\n    if (event.code === 'Space' && !interactive && (!modal || modal === elements.fullPlayer)) { event.preventDefault(); togglePlaying(); }",
  'spacebar playback shortcut');
app = replaceOnce(app,
  'bindEvents();\nshowView(\'discover\');',
  'bindEvents();\nbindMediaSession();\nshowView(\'discover\');',
  'media session binding');
writeFileSync('src/app.js', app);

let html = readFileSync('index.html', 'utf8');
const htmlCopies = [
  ['<span class="demo-label">DESIGN PROTOTYPE</span>', '<span class="demo-label">PRIVATE PREVIEW</span>', 'preview label'],
  ['<strong id="artistCount">05 artists</strong>', '<strong id="artistCount">05 artists</strong>', 'artist count baseline'],
  ['<div class="directory-foot"><span>DEMO CATALOG</span><p>Fictional artists and releases for product design.</p></div>', '<div class="directory-foot"><span>RONDO EDITION / 01</span><p>A small listening world, for now.</p></div>', 'directory ending'],
  ['<button class="primary-action" id="playArtist" type="button"><svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 4.5v11l9-5.5z"/></svg>Play artist</button>', '<button class="primary-action" id="playArtist" type="button" aria-pressed="false" data-playback-state="play"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg><span>Play artist</span></button>', 'artist action markup'],
  ['<button id="previewCompletion" type="button">Preview completion <span>↗</span></button>', '<span class="artist-chapter-note">ONE ARTIST AT A TIME</span>', 'remove prototype control'],
  ['<span>Open immersive lyrics</span>', '<span>Enter lyrics</span>', 'lyrics action'],
  ['Synchronized demo words · open Lyrics to follow', 'Lyrics unfold with the song.', 'lyric invitation'],
  ['<div class="search-results" id="searchResults"><span>START ANYWHERE</span><p>Search across artists, albums, tracks, and genres.</p></div>', '<div class="search-results" id="searchResults"><span>START ANYWHERE</span><p>Artists, releases, tracks, genres.</p></div>', 'search empty copy'],
  ['<span id="elapsed">0:43</span>', '<span id="elapsed">0:00</span>', 'main elapsed'],
  ['aria-valuenow="7" aria-valuetext="0:07 of 0:32"', 'aria-valuenow="0" aria-valuetext="0:00 of 0:32"', 'main timeline state'],
  ['<span id="remaining">−2:59</span>', '<span id="remaining">−0:32</span>', 'main remaining'],
  ['Save this moment · 0:43', 'Save this moment · 0:00', 'moment baseline'],
  ['<span id="fullElapsed">0:43</span>', '<span id="fullElapsed">0:00</span>', 'room elapsed'],
  ['<span id="fullRemaining">−2:59</span>', '<span id="fullRemaining">−0:32</span>', 'room remaining']
];
for (const [before, after, label] of htmlCopies) {
  if (before === after) continue;
  html = replaceText(html, before, after, label);
}
writeFileSync('index.html', html);

let views = readFileSync('src/ui/views.js', 'utf8');
for (const [before, after, label] of [
  ['Keep the music that stays with you.', 'Keep what stays.', 'empty library headline'],
  ['Save artists, releases, tracks, exact moments, and private song notes. Your progress remains separate, so a save never interrupts the journey.', 'Artists, releases, tracks, moments, and notes — together.', 'empty library intro'],
  ['Return to a full catalog chapter.', 'Return to the whole chapter.', 'artist save copy'],
  ['Keep a release without losing its context.', 'Keep the record intact.', 'release save copy'],
  ['Remember exactly why a song stayed with you.', 'Save the second. Write the why.', 'moment save copy'],
  ['Your explicit choices shape starting points and highlights. Alphabetical artist order remains stable.', 'Your choices shape discovery. Artist order stays steady.', 'profile summary']
]) views = replaceText(views, before, after, label);
writeFileSync('src/ui/views.js', views);

let room = readFileSync('src/ui/songRoom.js', 'utf8');
for (const [before, after, label] of [
  ['Synchronized demo words', 'Rondo demo words', 'lyrics eyebrow'],
  ['Prototype lyrics only · tap a line to seek', 'Tap a line to seek.', 'lyrics hint'],
  ['Why this song is here', 'Inside the track', 'story eyebrow'],
  ['Stored in your Rondo Library on this device.', 'Only on this device.', 'private note hint'],
  ['Choose Lyrics, Story, Credits, or Queue below without leaving playback.', 'Stay with the song, or go deeper.', 'room invitation']
]) room = replaceText(room, before, after, label);
writeFileSync('src/ui/songRoom.js', room);

let styles = readFileSync('styles.css', 'utf8');
if (!styles.includes('/* Final listening polish */')) styles += `\n\n/* Final listening polish */\n#playArtist { min-width: 150px; justify-content: center; }\n#playArtist span { white-space: nowrap; }\n#playArtist[data-playback-state="pause"] { box-shadow: 0 0 0 1px rgba(var(--genre-rgb), .45), 0 10px 30px rgba(var(--genre-rgb), .16); }\n#playArtist[data-playback-state="resume"] { box-shadow: inset 0 0 0 1px rgba(var(--genre-rgb), .28); }\n.artist-chapter-note { grid-column: 1 / -1; align-self: end; color: var(--muted); font-size: 9px; font-weight: 700; letter-spacing: .16em; }\n.track-state-icon { display: block; width: 15px; height: 15px; fill: currentColor; }\n.track-equalizer { display: inline-flex; align-items: flex-end; justify-content: center; gap: 2px; width: 15px; height: 15px; }\n.track-equalizer i { width: 2px; min-height: 4px; border-radius: 2px; background: currentColor; animation: rondo-track-level .72s ease-in-out infinite alternate; }\n.track-equalizer i:nth-child(2) { animation-delay: -.28s; }\n.track-equalizer i:nth-child(3) { animation-delay: -.48s; }\n.track-row[data-playback-state="playing"] .track-number { color: var(--signal); }\n@keyframes rondo-track-level { from { height: 4px; } to { height: 14px; } }\n@media (max-width: 760px) { .artist-chapter-note { display: none; } #playArtist { min-width: 142px; } }\n@media (prefers-reduced-motion: reduce) { .track-equalizer i { animation: none; height: 9px; } .track-equalizer i:nth-child(2) { height: 14px; } .track-equalizer i:nth-child(3) { height: 6px; } }\n`;
writeFileSync('styles.css', styles);

let pkg = readFileSync('package.json', 'utf8');
pkg = replaceOnce(pkg,
  'node tests/personal.mjs && node tests/user-ready.mjs && node tests/release-ready.mjs',
  'node tests/personal.mjs && node tests/user-ready.mjs && node tests/experience.mjs && node tests/release-ready.mjs',
  'experience regression in test gate');
writeFileSync('package.json', pkg);

let readme = readFileSync('README.md', 'utf8');
readme = replaceText(readme,
  'This polish release adds persistent mobile navigation, safely coordinated modal layers, semantic catalog controls, keyboard-complete timelines, and a dismissible, focus-contained Genre Journey drawer.',
  'This polish release adds persistent mobile navigation, safely coordinated modal layers, semantic catalog controls, keyboard-complete timelines, and a dismissible, focus-contained Genre Journey drawer. The final listening pass makes artist and active-track controls truthful, preserves layout when paused, restarts the current song before skipping back, and connects native media controls.',
  'release finish summary');
writeFileSync('README.md', readme);

console.log('Rondo UX finish patch applied.');
