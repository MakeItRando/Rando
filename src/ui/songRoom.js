const artworkPalettes = Object.freeze({
  night: {
    accent: '#6f9dff', rgb: '111, 157, 255', accentSoft: '#b6c9ff',
    base: '#070910', surface: '#10141d', elevated: '#151b27', signal: 'COBALT / ARTWORK'
  },
  continuum: {
    accent: '#e3a35f', rgb: '227, 163, 95', accentSoft: '#f0c18f',
    base: '#0d0b09', surface: '#1a1510', elevated: '#211a13', signal: 'AMBER / ARTWORK'
  },
  blue: {
    accent: '#51c8d8', rgb: '81, 200, 216', accentSoft: '#9ee5ee',
    base: '#061013', surface: '#0d1a1e', elevated: '#122329', signal: 'CYAN / ARTWORK'
  },
  afterimage: {
    accent: '#e66d9a', rgb: '230, 109, 154', accentSoft: '#f2a4c0',
    base: '#10080d', surface: '#1d1017', elevated: '#27151f', signal: 'ROSE / ARTWORK'
  },
  fallback: {
    accent: '#ff4b2e', rgb: '255, 75, 46', accentSoft: '#ff9b86',
    base: '#0b0b0c', surface: '#151516', elevated: '#1d1d1f', signal: 'RONDO / FALLBACK'
  }
});

export const songRoomModes = Object.freeze(['room', 'lyrics', 'story', 'credits', 'queue']);

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[character]);

const formatTime = (value) => `${Math.floor(Math.max(0, value) / 60)}:${String(Math.floor(Math.max(0, value)) % 60).padStart(2, '0')}`;

const releasePaletteKeys = Object.freeze({
  'blacktop-studies': 'night', 'small-hours': 'night',
  'silver-weather': 'continuum', margins: 'continuum', 'soft-machines': 'continuum', 'first-light': 'continuum',
  'north-window-ep': 'blue', southbound: 'blue', 'blue-room': 'blue', 'elsewhere-again': 'blue', 'no-fixed-address': 'blue',
  'signal-memory': 'afterimage', 'rooms-i-remember': 'afterimage', 'close-reading': 'afterimage', 'soft-collision': 'afterimage'
});

function paletteKey(release) {
  if (releasePaletteKeys[release?.id]) return releasePaletteKeys[release.id];
  const cover = String(release?.cover || '').toLowerCase();
  if (cover.includes('night-transit')) return 'night';
  if (cover.includes('continuum')) return 'continuum';
  if (cover.includes('blue-hour')) return 'blue';
  if (cover.includes('afterimage')) return 'afterimage';
  return 'fallback';
}

export function getArtworkPalette(release) {
  const id = paletteKey(release);
  return { id, ...artworkPalettes[id] };
}

export function applyArtworkPalette(release, root = document.documentElement) {
  const palette = getArtworkPalette(release);
  root.dataset.songPalette = palette.id;
  root.style.setProperty('--song-accent', palette.accent);
  root.style.setProperty('--song-rgb', palette.rgb);
  root.style.setProperty('--song-accent-soft', palette.accentSoft);
  root.style.setProperty('--song-base', palette.base);
  root.style.setProperty('--song-surface', palette.surface);
  root.style.setProperty('--song-elevated', palette.elevated);
  return palette;
}

function renderLyrics(track) {
  const lyrics = Array.isArray(track.lyrics) ? track.lyrics : [];
  const hasWords = lyrics.some((line) => !/instrumental|no synchronized/i.test(line.text));
  if (!hasWords) {
    return `<div class="song-room-empty"><span>LYRICS</span><h3>No synchronized words.</h3><p>This track may be instrumental, or lyrics have not been supplied by an authorized source.</p></div>`;
  }
  return `<div class="song-room-copy song-room-lyrics"><p class="song-room-eyebrow">Synchronized demo words</p><h3>Follow the song.</h3><div class="song-room-lyric-list">${lyrics.map((line) => `<button type="button" data-time="${line.time}">${escapeHtml(line.text)}</button>`).join('')}</div><small>Prototype lyrics only · tap a line to seek</small></div>`;
}

function renderStory({ artist, release, track }, note = '') {
  const story = track.story || {
    headline: `${track.style} inside ${artist.name}'s ${release.title} chapter.`,
    body: `${artist.name}'s ${track.title} is presented as a ${track.style.toLowerCase()} entry in Rondo's fictional design catalog. Production context will only appear when an authorized source supplies it.`
  };
  const sounds = track.soundPalette?.length ? track.soundPalette : [track.style, ...(track.bpm ? [`${track.bpm} BPM`] : []), track.key || 'Key unavailable'];
  return `<div class="song-room-copy"><p class="song-room-eyebrow">Why this song is here</p><h3>${escapeHtml(story.headline)}</h3><p class="song-room-lead">${escapeHtml(story.body)}</p><dl class="song-room-facts"><div><dt>Release</dt><dd>${escapeHtml(release.title)} · ${escapeHtml(release.type)} · ${release.year}</dd></div><div><dt>Exact style</dt><dd>${escapeHtml(track.style)}</dd></div><div><dt>Signal</dt><dd>${track.bpm ? `${track.bpm} BPM` : 'Tempo unavailable'} · ${escapeHtml(track.key || 'Key unavailable')}</dd></div><div><dt>Featured</dt><dd>${escapeHtml(track.features.length ? track.features.join(', ') : 'None')}</dd></div></dl><div class="song-room-sounds">${sounds.map((item, index) => `<span class="${index === 0 ? 'active' : ''}">${escapeHtml(item)}</span>`).join('')}</div><div class="song-room-provenance"><span><b>${escapeHtml(track.source?.label || 'Prototype context')}</b><small>${escapeHtml(track.source?.detail || 'Fictional demo metadata · not a commercial catalog claim')}</small></span><strong>${escapeHtml((track.source?.status || 'demo').toUpperCase())}</strong></div><section class="song-room-private-note"><label for="songRoomPrivateNote"><span>Private song note</span><small>Only you</small></label><textarea id="songRoomPrivateNote" maxlength="280" placeholder="What made this song stay with you?">${escapeHtml(note)}</textarea><div><small>Stored in your Rondo Library on this device.</small><button type="button" data-save-song-note>Save note</button></div></section></div>`;
}

function renderCredits({ artist, track }) {
  const credits = [
    ['Primary artist', artist.name],
    ['Featured artists', track.features.length ? track.features.join(', ') : 'None'],
    ['Written by', track.writers.length ? track.writers.join(', ') : 'Not supplied'],
    ['Produced by', track.producers.length ? track.producers.join(', ') : 'Not supplied'],
    ['Recording ID', track.isrc || 'Not supplied'],
    ['Version', track.version || 'Original album version']
  ];
  return `<div class="song-room-copy"><p class="song-room-eyebrow">Credits and roles</p><h3>Everyone behind the recording.</h3><div class="song-room-credit-list">${credits.map(([label, value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join('')}</div><div class="song-room-provenance"><span><b>Credits policy</b><small>Roles remain unavailable rather than being inferred.</small></span><strong>HONEST</strong></div></div>`;
}

function renderQueue({ queueEntries, artist, genreName }) {
  return `<div class="song-room-copy song-room-queue"><p class="song-room-eyebrow">Up next · artist chapter</p><h3>${escapeHtml(artist.name)}</h3><p class="song-room-lead">${escapeHtml(genreName)} journey · albums and EPs · newest to oldest</p><div class="song-room-queue-progress"><i style="width:${queueEntries.length ? ((queueEntries.findIndex((entry) => entry.active) + 1) / queueEntries.length) * 100 : 0}%"></i></div><div class="song-room-queue-list">${queueEntries.map((entry, index) => `<button type="button" data-song-room-track="${escapeHtml(entry.track.id)}" class="${entry.active ? 'active' : ''}" ${entry.active ? 'aria-current="true"' : ''}><span>${String(index + 1).padStart(2, '0')}</span><img src="${escapeHtml(entry.release.cover)}" alt=""/><span><b>${escapeHtml(entry.track.title)}</b><small>${escapeHtml(entry.release.title)} · ${escapeHtml(entry.track.style)}</small></span><time>${formatTime(entry.track.durationSeconds)}</time></button>`).join('')}</div></div>`;
}

function renderRoom({ artist, release, track }) {
  return `<div class="song-room-copy song-room-mobile-summary"><p class="song-room-eyebrow">Song Room</p><h3>${escapeHtml(track.title)}</h3><p class="song-room-lead">${escapeHtml(artist.name)} · ${escapeHtml(release.title)} · ${release.year}</p><div class="song-room-room-actions"><span>${escapeHtml(track.style)}</span><span>${track.bpm ? `${track.bpm} BPM` : 'Tempo unavailable'}</span><span>${escapeHtml(track.key || 'Key unavailable')}</span></div><p class="song-room-room-note">Choose Lyrics, Story, Credits, or Queue below without leaving playback.</p></div>`;
}

export function renderSongRoomPanel({ mode, context, queueEntries, genreName, note = '' }) {
  if (mode === 'lyrics') return renderLyrics(context.track);
  if (mode === 'credits') return renderCredits(context);
  if (mode === 'queue') return renderQueue({ queueEntries, artist: context.artist, genreName });
  if (mode === 'room') return renderRoom(context);
  return renderStory(context, note);
}
