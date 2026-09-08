const artworkPalettes = Object.freeze({
  night: { accent: '#6f9dff', rgb: '111, 157, 255', accentSoft: '#b6c9ff', base: '#070910', surface: '#10141d', elevated: '#151b27' },
  continuum: { accent: '#e3a35f', rgb: '227, 163, 95', accentSoft: '#f0c18f', base: '#0d0b09', surface: '#1a1510', elevated: '#211a13' },
  blue: { accent: '#51c8d8', rgb: '81, 200, 216', accentSoft: '#9ee5ee', base: '#061013', surface: '#0d1a1e', elevated: '#122329' },
  afterimage: { accent: '#e66d9a', rgb: '230, 109, 154', accentSoft: '#f2a4c0', base: '#10080d', surface: '#1d1017', elevated: '#27151f' },
  fallback: { accent: '#ff4b2e', rgb: '255, 75, 46', accentSoft: '#ff9b86', base: '#0b0b0c', surface: '#151516', elevated: '#1d1d1f' }
});

export const songRoomModes = Object.freeze(['room', 'lyrics', 'story', 'credits', 'reveals', 'queue']);

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
  if (/night|blacktop|small-hours/.test(cover)) return 'night';
  if (/continuum|silver|margins|first-light|soft-machines/.test(cover)) return 'continuum';
  if (/blue|window|southbound|elsewhere|fixed-address/.test(cover)) return 'blue';
  if (/afterimage|signal|rooms|close-reading|collision/.test(cover)) return 'afterimage';
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
  if (!hasWords) return '<div class="song-room-empty"><p class="song-room-eyebrow">Lyrics</p><h3>No lyrics yet.</h3><p>This track may be instrumental.</p></div>';
  return `<div class="song-room-copy song-room-lyrics"><p class="song-room-eyebrow">Lyrics</p><h3>Sing along.</h3><div class="song-room-lyric-list">${lyrics.map((line) => `<button type="button" data-time="${line.time}">${escapeHtml(line.text)}</button>`).join('')}</div><small>Tap a line to jump there.</small></div>`;
}

function renderStory({ artist, release, track }, lore, note = '') {
  const body = track.story?.body || `${track.title} is a ${track.style.toLowerCase()} track by ${artist.name}, from ${release.title}.`;
  const sounds = track.soundPalette?.length ? track.soundPalette : [track.style, ...(track.bpm ? [`${track.bpm} BPM`] : []), track.key || 'Key not listed'];
  return `<div class="song-room-copy"><p class="song-room-eyebrow">About this song</p><h3>${escapeHtml(track.title)}</h3><p class="song-room-lead">${escapeHtml(body)}</p>${lore ? `<button class="song-room-chapter-link" type="button" data-open-release-from-room="${escapeHtml(release.id)}"><span>${escapeHtml(release.type)}</span><strong>${escapeHtml(release.title)}</strong><b>View album →</b></button>` : ''}<dl class="song-room-facts"><div><dt>Artist</dt><dd>${escapeHtml(artist.name)}</dd></div><div><dt>Album</dt><dd>${escapeHtml(release.title)} · ${release.year}</dd></div><div><dt>Sound</dt><dd>${escapeHtml(track.style)}${track.bpm ? ` · ${track.bpm} BPM` : ''}</dd></div></dl><div class="song-room-sounds">${sounds.slice(0, 4).map((item, index) => `<span class="${index === 0 ? 'active' : ''}">${escapeHtml(item)}</span>`).join('')}</div><section class="song-room-private-note"><label for="songRoomPrivateNote"><span>Your note</span><small>Private</small></label><textarea id="songRoomPrivateNote" maxlength="280" placeholder="What did you like about this song?">${escapeHtml(note)}</textarea><div><small>Saved on this device.</small><button type="button" data-save-song-note>Save</button></div></section></div>`;
}

function renderCredits({ artist, track }) {
  const credits = [
    ['Artist', artist.name],
    ['Featured', track.features.length ? track.features.join(', ') : '—'],
    ['Written by', track.writers.length ? track.writers.join(', ') : 'Not listed'],
    ['Produced by', track.producers.length ? track.producers.join(', ') : 'Not listed']
  ];
  return `<div class="song-room-copy"><p class="song-room-eyebrow">Credits</p><h3>Made by</h3><div class="song-room-credit-list">${credits.map(([label, value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join('')}</div></div>`;
}

function renderReveal({ release, lore, unlocked, progress }) {
  if (!lore) return '<div class="song-room-empty"><p class="song-room-eyebrow">Extra</p><h3>Nothing extra here.</h3></div>';
  const threshold = lore.artifact.unlockSeconds;
  const percent = Math.min(100, Math.round((Math.min(progress, threshold) / threshold) * 100));
  if (unlocked) return `<div class="song-room-copy song-room-reveal open"><p class="song-room-eyebrow">Extra unlocked</p><h3>${escapeHtml(lore.artifact.title)}</h3><p class="song-room-lead">${escapeHtml(lore.artifact.body)}</p><div class="song-room-reveal-mark" aria-hidden="true"><span></span><i></i><b>OPEN</b></div><button class="song-room-chapter-link" type="button" data-open-release-from-room="${escapeHtml(release.id)}"><span>${escapeHtml(release.type)}</span><strong>${escapeHtml(release.title)}</strong><b>View album →</b></button></div>`;
  return `<div class="song-room-copy song-room-reveal locked"><p class="song-room-eyebrow">Extra · ${String(percent).padStart(2, '0')}%</p><h3>${escapeHtml(lore.artifact.title)}</h3><p class="song-room-lead">${escapeHtml(lore.artifact.prompt)}</p><div class="song-room-reveal-lock" aria-label="${percent}% unlocked"><span style="--reveal-progress:${percent}%"><i></i></span><b>${Math.max(0, threshold - Math.floor(progress))}</b><small>seconds left</small></div><p class="song-room-reveal-policy">Keep listening to unlock this extra.</p></div>`;
}

function renderQueue({ queueEntries, artist, genreName }) {
  return `<div class="song-room-copy song-room-queue"><p class="song-room-eyebrow">Up next</p><h3>${escapeHtml(artist.name)}</h3><p class="song-room-lead">${escapeHtml(genreName)} · ${queueEntries.length} songs</p><div class="song-room-queue-progress"><i style="width:${queueEntries.length ? ((queueEntries.findIndex((entry) => entry.active) + 1) / queueEntries.length) * 100 : 0}%"></i></div><div class="song-room-queue-list">${queueEntries.map((entry, index) => `<button type="button" data-song-room-track="${escapeHtml(entry.track.id)}" class="${entry.active ? 'active' : ''}" ${entry.active ? 'aria-current="true"' : ''}><span>${String(index + 1).padStart(2, '0')}</span><img src="${escapeHtml(entry.release.cover)}" alt=""/><span><b>${escapeHtml(entry.track.title)}</b><small>${escapeHtml(entry.artist?.name || artist.name)}</small></span><time>${formatTime(entry.track.durationSeconds)}</time></button>`).join('')}</div></div>`;
}

function volumeMarkup(volume) {
  const value = Math.round(Math.max(0, Math.min(1, Number(volume) || 0)) * 100);
  return `<div class="song-room-room-volume"><button type="button" data-room-mute aria-label="${value ? 'Mute' : 'Unmute'}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 10v4h4l5 4V6L8 10H4Z"/><path class="volume-wave" d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/><path class="volume-slash" d="m16 9 5 6"/></svg></button><label><span>Volume <output>${value}</output></span><input data-room-volume type="range" min="0" max="100" value="${value}" style="--volume:${value}%" aria-label="Song Room volume"/></label><div class="sound-meter" aria-hidden="true">${Array.from({ length: 10 }, (_, index) => `<i class="${index < Math.ceil(value / 10) ? 'active' : ''}"></i>`).join('')}</div></div>`;
}

function renderRoom({ artist, release, track }, volume) {
  return `<div class="song-room-copy song-room-mobile-summary"><p class="song-room-eyebrow">Now playing</p><h3>${escapeHtml(track.title)}</h3><p class="song-room-lead">${escapeHtml(artist.name)} · ${escapeHtml(release.title)}</p><div class="song-room-room-actions"><span>${escapeHtml(track.style)}</span>${track.bpm ? `<span>${track.bpm} BPM</span>` : ''}</div>${volumeMarkup(volume)}</div>`;
}

export function renderSongRoomPanel({ mode, context, queueEntries, genreName, note = '', lore = null, revealUnlocked = false, revealProgress = 0, volume = 0.82 }) {
  if (mode === 'lyrics') return renderLyrics(context.track);
  if (mode === 'credits') return renderCredits(context);
  if (mode === 'reveals') return renderReveal({ release: context.release, lore, unlocked: revealUnlocked, progress: revealProgress });
  if (mode === 'queue') return renderQueue({ queueEntries, artist: context.artist, genreName });
  if (mode === 'room') return renderRoom(context, volume);
  return renderStory(context, lore, note);
}
