import { artists, genres, onboardingArtists, onboardingGenres } from './data/catalog.js';
import { artistProgress, findReleaseContext, findTrackContext, flattenCatalog, getArtist, getGenre, listArtistsForGenre, listReleases, nextArtistFor } from './services/journey.js';
import { createStore } from './state/store.js';
import { renderJourneysView, renderLibraryView, renderProfileView } from './ui/views.js';
import { applyGenreAmbience } from './ui/ambience.js';

const playPath = '<path d="M8 5v14l11-7z"/>';
const pausePath = '<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>';
const heartPath = '<path d="M20.8 4.8a5.4 5.4 0 0 0-7.7 0L12 5.9l-1.1-1.1a5.4 5.4 0 0 0-7.7 7.7l1.1 1.1L12 21l7.7-7.4 1.1-1.1a5.4 5.4 0 0 0 0-7.7Z"/>';
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const $ = (id) => document.getElementById(id);
const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const formatTime = (value) => `${Math.floor(Math.max(0, value) / 60)}:${String(Math.floor(Math.max(0, value)) % 60).padStart(2, '0')}`;
const pad = (value) => String(value).padStart(2, '0');
const tasteGenreFallbacks = { rock: 'Rock', pop: 'Pop', afrobeats: 'Afrobeats', classical: 'Classical', folk: 'Folk', latin: 'Latin' };
const getTasteGenreLabel = (id) => genres.find((genre) => genre.id === id)?.short || tasteGenreFallbacks[id] || id;

const store = createStore({
  genreId: 'hiphop', artistId: 'kairo-vale', catalogMode: 'matching', selectedTrackId: 'k101',
  inspectorTab: 'details', playing: false, position: 43, repeatMode: 'continue', view: 'discover',
  theme: 'dark', directoryCollapsed: false
});

let playbackTimer = null;
let onboardingStep = 0;
let onboardingDraft = null;
let toastTimer = null;
let modalReturnFocus = null;

const elements = {
  appShell: $('appShell'), workspace: document.querySelector('.workspace'), directory: $('directory'), journey: $('journey'),
  genreSelect: $('genreSelect'), artistFilter: $('artistFilter'), alphabet: $('alphabet'), artistList: $('artistList'), artistCount: $('artistCount'),
  locationGenre: $('locationGenre'), locationArtist: $('locationArtist'), artistPortrait: $('artistPortrait'), artistProgressRing: $('artistProgressRing'),
  artistProgressPercent: $('artistProgressPercent'), artistPosition: $('artistPosition'), artistLetter: $('artistLetter'), artistName: $('artistName'),
  artistOrigin: $('artistOrigin'), artistYears: $('artistYears'), artistTags: $('artistTags'), artistBio: $('artistBio'), saveArtist: $('saveArtist'),
  statPosition: $('statPosition'), statReleases: $('statReleases'), statTracks: $('statTracks'), catalogSummary: $('catalogSummary'),
  matchingMode: $('matchingMode'), allMode: $('allMode'), matchingCount: $('matchingCount'), allCount: $('allCount'), releases: $('releases'),
  nowIndex: $('nowIndex'), nowCover: $('nowCover'), nowReleaseTop: $('nowReleaseTop'), nowTitle: $('nowTitle'), nowArtist: $('nowArtist'),
  saveTrack: $('saveTrack'), inspectorPanel: $('inspectorPanel'), lyricsCta: $('lyricsCta'), barCover: $('barCover'), barTitle: $('barTitle'),
  barArtist: $('barArtist'), transportPlay: $('transportPlay'), transportPlayIcon: $('transportPlayIcon'), repeatMode: $('repeatMode'),
  repeatBadge: $('repeatBadge'), transportMode: $('transportMode'), elapsed: $('elapsed'), remaining: $('remaining'), timeline: $('timeline'),
  timelineFill: $('timelineFill'), timelineKnob: $('timelineKnob'), searchOverlay: $('searchOverlay'), globalSearch: $('globalSearch'),
  searchResults: $('searchResults'), fullPlayer: $('fullPlayer'), fullCover: $('fullCover'), fullRelease: $('fullRelease'), fullTitle: $('fullTitle'),
  fullArtist: $('fullArtist'), fullTags: $('fullTags'), fullTimelineFill: $('fullTimelineFill'), fullElapsed: $('fullElapsed'),
  fullRemaining: $('fullRemaining'), fullLyricsLines: $('fullLyricsLines'), fullPlay: $('fullPlay'), fullSave: $('fullSave'),
  onboardingOverlay: $('onboardingOverlay'), onboardingProgress: $('onboardingProgress'), onboardingEyebrow: $('onboardingEyebrow'),
  onboardingTitle: $('onboardingTitle'), onboardingDescription: $('onboardingDescription'), onboardingStep: $('onboardingStep'),
  onboardingBack: $('onboardingBack'), onboardingNext: $('onboardingNext'), completionOverlay: $('completionOverlay'), completionTitle: $('completionTitle'),
  completionHeard: $('completionHeard'), completionSaved: $('completionSaved'), completionReleases: $('completionReleases'),
  nextArtistImage: $('nextArtistImage'), nextArtistName: $('nextArtistName'), nextArtistTags: $('nextArtistTags'), toast: $('toast')
};
Object.assign(elements, {
  journeyToggle: $('journeyToggle'), journeyToggleLabel: $('journeyToggleLabel'), themeToggle: $('themeToggle'), themeToggleLabel: $('themeToggleLabel'),
  nowGenreMode: $('nowGenreMode'), nowAudioMeta: $('nowAudioMeta'), fullGenreMode: $('fullGenreMode'), fullAudioMeta: $('fullAudioMeta'),
  fullQueue: $('fullQueue'), fullQueueCount: $('fullQueueCount'), fullJourney: $('fullJourney'),
  queueScrim: $('queueScrim'), queueDrawer: $('queueDrawer'), queueTitle: $('queueTitle'), queueArtist: $('queueArtist'), queueGenre: $('queueGenre'),
  queueList: $('queueList'), queueProgress: $('queueProgress'), queueCurrent: $('queueCurrent'), closeQueue: $('closeQueue')
});

const state = () => store.get();
const currentGenre = () => getGenre(state().genreId);
const currentArtist = () => getArtist(state().artistId);
const currentQueue = () => flattenCatalog(currentArtist(), state().genreId, state().catalogMode);
const currentContext = () => findTrackContext(state().selectedTrackId) || findTrackContext(currentQueue()[0]?.id);
const includes = (list, id) => Array.isArray(list) && list.includes(id);
const listeningGenreId = () => {
  const context = currentContext();
  return context?.track.genres.includes(state().genreId) ? state().genreId : (context?.track.genres[0] || state().genreId);
};
const audioMeta = (track) => [track?.bpm ? `${track.bpm} BPM` : null, track?.key || null].filter(Boolean).join(' · ') || 'PLAYBACK SIGNAL';

function syncAppearance() {
  const theme = state().theme === 'light' ? 'light' : 'dark';
  const context = currentContext();
  const genreId = listeningGenreId();
  const ambience = applyGenreAmbience(genreId);
  document.documentElement.dataset.theme = theme;
  const nextTheme = theme === 'dark' ? 'light' : 'night';
  elements.themeToggleLabel.textContent = nextTheme === 'light' ? 'Light' : 'Night';
  elements.themeToggle.setAttribute('aria-label', `Switch to ${nextTheme} appearance`);
  const genreLabel = context ? `${context.track.style}`.toUpperCase() : (getGenre(genreId)?.name || genreId).toUpperCase();
  const meta = audioMeta(context?.track).toUpperCase();
  elements.nowGenreMode.textContent = genreLabel;
  elements.nowAudioMeta.textContent = meta;
  elements.fullGenreMode.textContent = genreLabel;
  elements.fullAudioMeta.textContent = `${meta} · ${ambience.signal}`;
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.content = theme === 'dark' ? ambience.base : '#f3f0e9';
}

function syncJourneyVisibility() {
  const collapsed = Boolean(state().directoryCollapsed && state().view === 'discover');
  document.body.classList.toggle('journey-collapsed', collapsed);
  elements.journeyToggle.setAttribute('aria-expanded', String(!collapsed));
  elements.journeyToggle.setAttribute('aria-label', collapsed ? 'Show Genre Journey' : 'Hide Genre Journey');
  elements.journeyToggleLabel.textContent = collapsed ? 'Show journey' : 'Hide journey';
}

function toggleTheme() {
  store.set({ theme: state().theme === 'dark' ? 'light' : 'dark' }, { persist: true });
  syncAppearance();
  showToast(`${state().theme === 'dark' ? 'Night' : 'Light'} appearance active`);
}

function toggleJourney() {
  if (window.matchMedia('(max-width: 760px)').matches) {
    const willOpen = !elements.directory.classList.contains('open');
    elements.directory.classList.toggle('open', willOpen);
    store.set({ directoryCollapsed: !willOpen });
  } else {
    store.set({ directoryCollapsed: !state().directoryCollapsed });
    elements.directory.classList.remove('open');
  }
  syncJourneyVisibility();
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => elements.toast.classList.remove('show'), 1700);
}

function rememberModalFocus(preferredFocus = null) {
  modalReturnFocus = preferredFocus instanceof HTMLElement ? preferredFocus : (document.activeElement instanceof HTMLElement ? document.activeElement : null);
}

function focusAfterOpen(id) {
  const target = $(id);
  if (target?.isConnected) target.focus();
}

function restoreModalFocus() {
  const target = modalReturnFocus;
  modalReturnFocus = null;
  if (target?.isConnected) target.focus();
}

function toggleList(list, id) {
  const values = new Set(list || []);
  values.has(id) ? values.delete(id) : values.add(id);
  return [...values];
}

function normalizeSelection() {
  const eligible = listArtistsForGenre(state().genreId);
  if (!eligible.some((artist) => artist.id === state().artistId)) {
    store.set({ artistId: eligible[0]?.id || artists[0].id });
  }
  const queue = currentQueue();
  if (!queue.some((track) => track.id === state().selectedTrackId)) {
    store.set({ selectedTrackId: queue[0]?.id || currentArtist().releases[0].tracks[0].id, position: 0 });
  }
}

function renderGenreSelect() {
  elements.genreSelect.innerHTML = genres.map((genre) => `<option value="${genre.id}">${escapeHtml(genre.name)}</option>`).join('');
  elements.genreSelect.value = state().genreId;
}

function renderDirectory() {
  const allEligible = listArtistsForGenre(state().genreId);
  const query = elements.artistFilter.value.trim().toLowerCase();
  const eligible = allEligible.filter((artist) => artist.name.toLowerCase().includes(query));
  const availableLetters = new Set(allEligible.map((artist) => artist.sortName.charAt(0).toUpperCase()));
  const activeLetter = currentArtist().sortName.charAt(0).toUpperCase();
  elements.artistCount.textContent = `${pad(allEligible.length)} sample artists`;
  elements.alphabet.innerHTML = alphabet.map((letter) => `<button type="button" data-letter="${letter}" class="${letter === activeLetter ? 'active' : ''}" ${availableLetters.has(letter) ? '' : 'disabled'}>${letter}</button>`).join('');
  elements.artistList.innerHTML = eligible.length ? eligible.map((artist, index) => `<button class="artist-list-item ${artist.id === state().artistId ? 'active' : ''}" type="button" data-artist="${artist.id}" data-letter="${artist.sortName.charAt(0).toUpperCase()}"><img src="${artist.image}" alt=""/><span><strong>${escapeHtml(artist.name)}</strong><span>${escapeHtml(artist.tags.join(' · '))}</span></span><b>${pad(allEligible.indexOf(artist) + 1)}</b></button>`).join('') : '<p class="directory-empty">No artists match that search.</p>';

  elements.artistList.querySelectorAll('[data-artist]').forEach((button) => button.addEventListener('click', () => selectArtist(button.dataset.artist)));
  elements.alphabet.querySelectorAll('[data-letter]:not(:disabled)').forEach((button) => button.addEventListener('click', () => {
    const target = elements.artistList.querySelector(`[data-letter="${button.dataset.letter}"]`);
    if (target) target.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }));
}

function renderArtistFocus() {
  const genre = currentGenre();
  const artist = currentArtist();
  const eligible = listArtistsForGenre(state().genreId);
  const index = eligible.findIndex((item) => item.id === artist.id);
  const matching = flattenCatalog(artist, genre.id, 'matching');
  const all = flattenCatalog(artist, genre.id, 'all');
  const progress = artistProgress(artist, new Set(state().playedTracks || []), genre.id, state().catalogMode);
  const circumference = 2 * Math.PI * 98;

  elements.locationGenre.textContent = genre.name.toUpperCase();
  elements.locationArtist.textContent = artist.name.toUpperCase();
  elements.artistPortrait.src = artist.image;
  elements.artistPortrait.alt = `Abstract portrait of ${artist.name}`;
  elements.artistPosition.textContent = `ARTIST ${pad(index + 1)} / ${pad(eligible.length)}`;
  elements.artistLetter.textContent = artist.sortName.charAt(0).toUpperCase();
  elements.artistName.textContent = artist.name;
  elements.artistOrigin.textContent = artist.origin;
  elements.artistYears.textContent = artist.activeYears;
  elements.artistTags.innerHTML = artist.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('');
  elements.artistBio.textContent = artist.bio;
  elements.artistProgressPercent.textContent = `${pad(progress.percentage)}%`;
  elements.artistProgressRing.style.strokeDasharray = circumference;
  elements.artistProgressRing.style.strokeDashoffset = circumference * (1 - progress.percentage / 100);
  elements.statPosition.textContent = `${pad(index + 1)} / ${pad(eligible.length)}`;
  elements.statReleases.textContent = pad(listReleases(artist, genre.id, state().catalogMode).length);
  elements.statTracks.textContent = pad(progress.total);
  elements.matchingCount.textContent = pad(matching.length);
  elements.allCount.textContent = pad(all.length);
  elements.matchingMode.classList.toggle('active', state().catalogMode === 'matching');
  elements.allMode.classList.toggle('active', state().catalogMode === 'all');
  elements.catalogSummary.textContent = state().catalogMode === 'matching' ? `Matching ${genre.short} tracks · newest to oldest` : 'Complete demo catalog · newest to oldest';
  elements.transportMode.textContent = state().catalogMode === 'matching' ? 'MATCHING CATALOG' : 'ALL CATALOG';
  const saved = includes(state().savedArtists, artist.id);
  elements.saveArtist.classList.toggle('saved', saved);
  elements.saveArtist.innerHTML = `<span class="save-artist-symbol" aria-hidden="true">${saved ? '✓' : '＋'}</span><span class="save-artist-label">${saved ? 'Artist saved' : 'Save artist'}</span>`;
  elements.saveArtist.setAttribute('aria-label', saved ? 'Remove artist from Library' : 'Save artist to Library');
}

function trackArtistLine(track, artist) {
  return track.features.length ? `${artist.name} featuring ${track.features.join(', ')}` : artist.name;
}

function renderCatalog() {
  const artist = currentArtist();
  const releases = listReleases(artist, state().genreId, state().catalogMode);
  elements.releases.innerHTML = releases.length ? releases.map((release) => {
    const releaseSaved = includes(state().savedReleases, release.id);
    return `<section class="release-group" data-release="${release.id}">
      <header class="release-head"><img src="${release.cover}" alt="${escapeHtml(release.title)} artwork"/><div class="release-head-copy"><span>${release.type.toUpperCase()} · ${release.year}</span><strong>${escapeHtml(release.title)}</strong><small>${escapeHtml(release.label)} · ${pad(release.tracks.length)} tracks</small></div><button class="release-save ${releaseSaved ? 'saved' : ''}" type="button" data-save-release="${release.id}" aria-label="${releaseSaved ? 'Remove' : 'Save'} ${escapeHtml(release.title)}"><svg viewBox="0 0 24 24" fill="${releaseSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8">${heartPath}</svg></button></header>
      <div class="track-head"><span>#</span><span>TRACK / ALBUM</span><span>STYLE</span><span>TIME</span><span></span></div>
      <div class="release-tracks">${release.tracks.map((track, trackIndex) => {
        const selected = track.id === state().selectedTrackId;
        const saved = includes(state().savedTracks, track.id);
        return `<div class="track-row ${selected ? 'active' : ''}" role="button" tabindex="0" data-track="${track.id}" aria-label="Play ${escapeHtml(track.title)}"><span class="track-number">${pad(trackIndex + 1)}</span><span class="track-name"><strong>${escapeHtml(track.title)}${track.explicit ? ' <sup>E</sup>' : ''}</strong><small>${escapeHtml(release.title)}${track.features.length ? ` · feat. ${escapeHtml(track.features.join(', '))}` : ''}</small></span><span class="track-style">${escapeHtml(track.style)}</span><span class="track-duration">${track.duration}</span><button class="track-save ${saved ? 'saved' : ''}" type="button" data-save-track="${track.id}" aria-label="${saved ? 'Remove' : 'Save'} ${escapeHtml(track.title)}"><svg viewBox="0 0 24 24" fill="${saved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8">${heartPath}</svg></button></div>`;
      }).join('')}</div>
    </section>`;
  }).join('') : '<p class="catalog-empty">No albums or EPs match this genre yet. Switch to All catalog.</p>';

  elements.releases.querySelectorAll('[data-track]').forEach((row) => {
    row.addEventListener('click', (event) => {
      const saveButton = event.target.closest('[data-save-track]');
      if (saveButton) { event.stopPropagation(); toggleTrackSave(saveButton.dataset.saveTrack); return; }
      selectTrack(row.dataset.track, true);
    });
    row.addEventListener('keydown', (event) => {
      if ((event.key === 'Enter' || event.key === ' ') && !event.target.closest('[data-save-track]')) { event.preventDefault(); selectTrack(row.dataset.track, true); }
    });
  });
  elements.releases.querySelectorAll('[data-save-release]').forEach((button) => button.addEventListener('click', () => toggleReleaseSave(button.dataset.saveRelease)));
}

function activeLyricIndex(track, position = state().position) {
  let active = 0;
  track.lyrics.forEach((line, index) => { if (position >= line.time) active = index; });
  return active;
}

function renderInspectorPanel(context) {
  const { artist, release, track } = context;
  const activeLyric = activeLyricIndex(track);
  if (state().inspectorTab === 'lyrics') {
    elements.inspectorPanel.innerHTML = `<div class="lyric-preview">${track.lyrics.slice(0, 7).map((line, index) => `<p class="${index === activeLyric ? 'active' : ''}" data-time="${line.time}">${escapeHtml(line.text)}</p>`).join('')}</div>`;
    elements.inspectorPanel.querySelectorAll('[data-time]').forEach((line) => line.addEventListener('click', () => seekTo(Number(line.dataset.time))));
    elements.lyricsCta.hidden = false;
    return;
  }
  if (state().inspectorTab === 'credits') {
    elements.inspectorPanel.innerHTML = `<div class="credit-section"><span>Written by</span><p>${escapeHtml((track.writers.length ? track.writers : [artist.name]).join(', '))}</p></div><div class="credit-section"><span>Produced by</span><p>${escapeHtml((track.producers.length ? track.producers : ['Rondo demo production']).join(', '))}</p></div><div class="credit-section"><span>Primary artist</span><p>${escapeHtml(artist.name)}</p></div><div class="credit-section"><span>Featured artists</span><p>${escapeHtml(track.features.length ? track.features.join(', ') : 'None')}</p></div><div class="credit-section"><span>ISRC</span><p>${escapeHtml(track.isrc)}</p></div>`;
    elements.lyricsCta.hidden = true;
    return;
  }
  elements.inspectorPanel.innerHTML = `<div class="inspector-tags">${track.genres.map((genreId) => `<span>${escapeHtml(getGenre(genreId).short)}</span>`).join('')}<span>${escapeHtml(track.style)}</span></div><dl class="detail-list"><div><dt>Release</dt><dd>${escapeHtml(release.title)} · ${release.year}</dd></div><div><dt>Type</dt><dd>${release.type} · Track ${release.tracks.findIndex((item) => item.id === track.id) + 1}</dd></div><div><dt>Label</dt><dd>${escapeHtml(release.label)}</dd></div><div><dt>Featured</dt><dd>${escapeHtml(track.features.length ? track.features.join(', ') : 'None')}</dd></div><div><dt>Tempo</dt><dd>${track.bpm ? `${track.bpm} BPM · ${escapeHtml(track.key || 'Key unavailable')}` : 'Not supplied'}</dd></div><div><dt>Source</dt><dd>Fictional design catalog</dd></div></dl>`;
  elements.lyricsCta.hidden = false;
}

function renderNowPlaying() {
  const context = currentContext();
  if (!context) return;
  const { artist, release, track } = context;
  const queue = currentQueue();
  const queueIndex = Math.max(0, queue.findIndex((item) => item.id === track.id));
  const saved = includes(state().savedTracks, track.id);
  elements.nowIndex.textContent = pad(queueIndex + 1);
  elements.nowCover.src = release.cover;
  elements.nowCover.alt = `${track.title} artwork`;
  elements.nowReleaseTop.textContent = `${release.title.toUpperCase()} · ${release.year}`;
  elements.nowTitle.textContent = track.title;
  elements.nowArtist.textContent = trackArtistLine(track, artist);
  elements.saveTrack.classList.toggle('saved', saved);
  elements.saveTrack.setAttribute('aria-label', `${saved ? 'Remove' : 'Save'} ${track.title}`);
  elements.saveTrack.querySelector('svg').setAttribute('fill', saved ? 'currentColor' : 'none');
  elements.barCover.src = release.cover;
  elements.barTitle.textContent = track.title;
  elements.barArtist.textContent = track.features.length ? `${artist.name} feat. ${track.features.join(', ')}` : artist.name;
  document.querySelectorAll('.inspector-tabs [data-tab]').forEach((button) => {
    const active = button.dataset.tab === state().inspectorTab;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
  renderInspectorPanel(context);
  renderFullPlayer(context);
  renderQueue();
  syncAppearance();
  updatePlayerUI();
}

function renderFullPlayer(context = currentContext()) {
  if (!context) return;
  const { artist, release, track } = context;
  const saved = includes(state().savedTracks, track.id);
  elements.fullCover.src = release.cover;
  elements.fullRelease.textContent = `${release.title.toUpperCase()} · ${release.year}`;
  elements.fullTitle.textContent = track.title;
  elements.fullArtist.textContent = trackArtistLine(track, artist);
  elements.fullTags.innerHTML = [...track.genres.map((id) => getGenre(id).short), track.style].map((tag) => `<span>${escapeHtml(tag)}</span>`).join('');
  elements.fullSave.textContent = saved ? '♥' : '♡';
  elements.fullLyricsLines.innerHTML = track.lyrics.map((line) => `<p data-time="${line.time}">${escapeHtml(line.text)}</p>`).join('');
  elements.fullLyricsLines.querySelectorAll('[data-time]').forEach((line) => line.addEventListener('click', () => seekTo(Number(line.dataset.time))));
  updateLyricHighlights();
}

function updateLyricHighlights() {
  const context = currentContext();
  if (!context) return;
  const active = activeLyricIndex(context.track);
  document.querySelectorAll('.lyric-preview [data-time], #fullLyricsLines [data-time]').forEach((line) => {
    line.classList.toggle('active', Number(line.dataset.time) === context.track.lyrics[active]?.time);
  });
}

function updatePlayerUI() {
  const context = currentContext();
  if (!context) return;
  const { track } = context;
  const ratio = Math.max(0, Math.min(1, state().position / track.durationSeconds));
  const percentage = `${ratio * 100}%`;
  elements.elapsed.textContent = formatTime(state().position);
  elements.remaining.textContent = `−${formatTime(track.durationSeconds - state().position)}`;
  elements.timelineFill.style.width = percentage;
  elements.timelineKnob.style.left = percentage;
  elements.fullTimelineFill.style.width = percentage;
  elements.fullElapsed.textContent = elements.elapsed.textContent;
  elements.fullRemaining.textContent = elements.remaining.textContent;
  elements.transportPlayIcon.innerHTML = state().playing ? pausePath : playPath;
  elements.transportPlay.setAttribute('aria-label', state().playing ? 'Pause' : 'Play');
  elements.fullPlay.textContent = state().playing ? 'Ⅱ' : '▶';
  elements.fullPlay.setAttribute('aria-label', state().playing ? 'Pause' : 'Play');
  document.body.classList.toggle('is-playing', state().playing);
  syncJourneyVisibility();
  const repeat = state().repeatMode;
  elements.repeatMode.dataset.repeat = repeat;
  elements.repeatBadge.textContent = repeat === 'track' ? '1' : repeat === 'artist' ? 'A' : '';
  elements.repeatMode.setAttribute('aria-label', repeat === 'continue' ? 'Continue mode' : `Repeat ${repeat}`);
  updateLyricHighlights();
}

function renderAll() {
  normalizeSelection();
  renderGenreSelect();
  renderDirectory();
  renderArtistFocus();
  renderCatalog();
  renderNowPlaying();
}

function selectGenre(genreId) {
  const eligible = listArtistsForGenre(genreId);
  const artist = eligible[0] || artists[0];
  store.set({ genreId, artistId: artist.id, catalogMode: 'matching', selectedTrackId: flattenCatalog(artist, genreId, 'matching')[0]?.id || artist.releases[0].tracks[0].id, position: 0, inspectorTab: 'details' });
  renderAll();
  elements.journey.scrollTo({ top: 0, behavior: 'smooth' });
  showToast(`${getGenre(genreId).short} journey loaded`);
}

function selectArtist(artistId, shouldPlay = false) {
  const artist = getArtist(artistId);
  const queue = flattenCatalog(artist, state().genreId, state().catalogMode);
  store.set({ artistId, selectedTrackId: queue[0]?.id || artist.releases[0].tracks[0].id, position: 0, inspectorTab: 'details' });
  elements.directory.classList.remove('open');
  renderAll();
  elements.journey.scrollTo({ top: 0, behavior: 'smooth' });
  if (shouldPlay) setPlaying(true);
}

function selectTrack(trackId, shouldPlay = false) {
  store.set({ selectedTrackId: trackId, position: 0 });
  renderCatalog();
  renderNowPlaying();
  if (shouldPlay) setPlaying(true);
}

function setCatalogMode(mode) {
  store.set({ catalogMode: mode });
  normalizeSelection();
  renderArtistFocus();
  renderCatalog();
  renderNowPlaying();
  showToast(mode === 'matching' ? 'Showing genre-matching songs' : 'Showing the complete demo catalog');
}

function persistPlayedTrack() {
  const trackId = state().selectedTrackId;
  if (!includes(state().playedTracks, trackId)) {
    store.set({ playedTracks: [...(state().playedTracks || []), trackId] }, { persist: true });
    renderArtistFocus();
  }
}

function setPlaying(playing) {
  clearInterval(playbackTimer);
  store.set({ playing, directoryCollapsed: playing });
  if (playing) elements.directory.classList.remove('open');
  if (playing) {
    persistPlayedTrack();
    playbackTimer = setInterval(() => {
      const context = currentContext();
      if (!context) return;
      const nextPosition = state().position + 1;
      if (nextPosition >= context.track.durationSeconds) handleTrackEnd();
      else { store.set({ position: nextPosition }); updatePlayerUI(); }
    }, 1000);
  }
  syncJourneyVisibility();
  updatePlayerUI();
}

function togglePlaying() { setPlaying(!state().playing); }

function renderQueue() {
  const context = currentContext();
  if (!context) return;
  const queue = currentQueue();
  const index = Math.max(0, queue.findIndex((track) => track.id === context.track.id));
  elements.fullQueueCount.textContent = pad(queue.length);
  elements.queueTitle.textContent = context.artist.name;
  elements.queueArtist.textContent = `${state().catalogMode === 'matching' ? 'Matching' : 'All'} catalog · albums & EPs`;
  elements.queueGenre.textContent = `${currentGenre().name.toUpperCase()} JOURNEY`;
  elements.queueCurrent.textContent = `${pad(index + 1)} / ${pad(queue.length)}`;
  elements.queueProgress.style.width = `${queue.length ? ((index + 1) / queue.length) * 100 : 0}%`;
  elements.queueList.innerHTML = queue.map((track, queueIndex) => {
    const trackContext = findTrackContext(track.id);
    const active = track.id === context.track.id;
    return `<button class="queue-item ${active ? 'active' : ''}" type="button" data-queue-track="${track.id}" ${active ? 'aria-current="true"' : ''}><span>${pad(queueIndex + 1)}</span><img src="${trackContext.release.cover}" alt=""/><span><strong>${escapeHtml(track.title)}</strong><small>${escapeHtml(trackContext.release.title)} · ${escapeHtml(track.style)}</small></span><b>${formatTime(track.durationSeconds)}</b></button>`;
  }).join('');
  elements.queueList.querySelectorAll('[data-queue-track]').forEach((button) => button.addEventListener('click', () => {
    selectTrack(button.dataset.queueTrack, true);
    renderQueue();
  }));
}

function openQueue(event) {
  rememberModalFocus(event?.currentTarget || $('queueButton'));
  renderQueue();
  elements.queueScrim.hidden = false;
  elements.queueDrawer.hidden = false;
  requestAnimationFrame(() => elements.closeQueue.focus());
}

function closeQueue() {
  elements.queueScrim.hidden = true;
  elements.queueDrawer.hidden = true;
  restoreModalFocus();
}

function openJourneyFromPlayer() {
  closeFullPlayer();
  store.set({ directoryCollapsed: false });
  syncJourneyVisibility();
  if (window.matchMedia('(max-width: 760px)').matches) elements.directory.classList.add('open');
  requestAnimationFrame(() => (window.matchMedia('(max-width: 760px)').matches ? $('closeDirectory') : elements.genreSelect).focus());
}


function seekTo(position) {
  const context = currentContext();
  if (!context) return;
  store.set({ position: Math.max(0, Math.min(context.track.durationSeconds, position)) });
  updatePlayerUI();
}

function changeTrack(direction) {
  const queue = currentQueue();
  const index = queue.findIndex((track) => track.id === state().selectedTrackId);
  const nextIndex = index + direction;
  if (nextIndex >= queue.length) { openCompletion(); return; }
  if (nextIndex < 0) { selectTrack(queue[0].id, state().playing); return; }
  selectTrack(queue[nextIndex].id, state().playing);
}

function handleTrackEnd() {
  const queue = currentQueue();
  const index = queue.findIndex((track) => track.id === state().selectedTrackId);
  if (state().repeatMode === 'track') { seekTo(0); return; }
  if (index < queue.length - 1) { selectTrack(queue[index + 1].id, true); return; }
  if (state().repeatMode === 'artist') { selectTrack(queue[0].id, true); return; }
  setPlaying(false);
  openCompletion();
}

function cycleRepeat() {
  const next = state().repeatMode === 'continue' ? 'track' : state().repeatMode === 'track' ? 'artist' : 'continue';
  store.set({ repeatMode: next });
  updatePlayerUI();
  showToast(next === 'continue' ? 'Continue after each track' : `Repeat ${next}`);
}

function toggleTrackSave(trackId = state().selectedTrackId) {
  const next = toggleList(state().savedTracks, trackId);
  store.set({ savedTracks: next }, { persist: true });
  renderCatalog();
  renderNowPlaying();
  showToast(next.includes(trackId) ? 'Track saved to Rondo' : 'Track removed from Rondo');
}

function toggleReleaseSave(releaseId) {
  const next = toggleList(state().savedReleases, releaseId);
  store.set({ savedReleases: next }, { persist: true });
  renderCatalog();
  showToast(next.includes(releaseId) ? 'Release saved to Rondo' : 'Release removed from Rondo');
}

function toggleArtistSave() {
  const artistId = state().artistId;
  const next = toggleList(state().savedArtists, artistId);
  store.set({ savedArtists: next }, { persist: true });
  renderArtistFocus();
  showToast(next.includes(artistId) ? 'Artist saved to Rondo' : 'Artist removed from Rondo');
}

function openCompletion({ preview = false } = {}) {
  rememberModalFocus();
  const artist = currentArtist();
  const progress = artistProgress(artist, new Set(state().playedTracks || []), state().genreId, state().catalogMode);
  const queueIds = new Set(currentQueue().map((track) => track.id));
  const previewTotals = preview || document.body.dataset.preview === 'completion';
  const saved = previewTotals ? Math.min(2, progress.total) : (state().savedTracks || []).filter((id) => queueIds.has(id)).length;
  const nextArtist = nextArtistFor(artist.id, state().genreId, 1);
  elements.completionTitle.textContent = `You reached the end of ${artist.name}.`;
  elements.completionHeard.textContent = pad(previewTotals ? progress.total : progress.played);
  elements.completionSaved.textContent = pad(saved);
  elements.completionReleases.textContent = pad(listReleases(artist, state().genreId, state().catalogMode).length);
  elements.nextArtistImage.src = nextArtist.image;
  elements.nextArtistName.textContent = nextArtist.name;
  elements.nextArtistTags.textContent = nextArtist.tags.join(' · ');
  elements.completionOverlay.hidden = false;
  focusAfterOpen('closeCompletion');
}

function closeCompletion() { elements.completionOverlay.hidden = true; restoreModalFocus(); }
function continueToNextArtist() { const next = nextArtistFor(state().artistId, state().genreId, 1); closeCompletion(); selectArtist(next.id, true); }
function replayArtist() { const first = currentQueue()[0]; closeCompletion(); if (first) selectTrack(first.id, true); }

function openFullPlayer(event) { rememberModalFocus(event?.currentTarget || $('openFullPlayer')); elements.fullPlayer.hidden = false; renderNowPlaying(); focusAfterOpen('closeFullPlayer'); }
function closeFullPlayer() { elements.fullPlayer.hidden = true; restoreModalFocus(); }

function renderSearchResults(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) { elements.searchResults.innerHTML = '<span>START ANYWHERE</span><p>Search across artists, albums, tracks, and genres.</p>'; return; }
  const results = [];
  genres.filter((genre) => genre.name.toLowerCase().includes(normalized)).forEach((genre) => results.push({ type: 'genre', id: genre.id, title: genre.name, subtitle: genre.description, image: 'assets/rondo-mark.svg' }));
  artists.forEach((artist) => {
    if (artist.name.toLowerCase().includes(normalized) || artist.tags.join(' ').toLowerCase().includes(normalized)) results.push({ type: 'artist', id: artist.id, title: artist.name, subtitle: artist.tags.join(' · '), image: artist.image });
    artist.releases.forEach((release) => {
      if (release.title.toLowerCase().includes(normalized)) results.push({ type: 'release', id: release.id, artistId: artist.id, title: release.title, subtitle: `${artist.name} · ${release.type} · ${release.year}`, image: release.cover });
      release.tracks.forEach((track) => { if (`${track.title} ${track.style} ${track.features.join(' ')}`.toLowerCase().includes(normalized)) results.push({ type: 'track', id: track.id, artistId: artist.id, title: track.title, subtitle: `${artist.name} · ${release.title}`, image: release.cover }); });
    });
  });
  elements.searchResults.innerHTML = results.length ? results.slice(0, 14).map((result) => `<button class="search-result" type="button" data-result-type="${result.type}" data-result-id="${result.id}" data-artist-id="${result.artistId || ''}"><img src="${result.image}" alt=""/><span><strong>${escapeHtml(result.title)}</strong><small>${escapeHtml(result.subtitle)}</small></span><span>${result.type}</span></button>`).join('') : '<span>NO RESULTS</span><p>Try another artist, album, track, or genre.</p>';
  elements.searchResults.querySelectorAll('[data-result-type]').forEach((button) => button.addEventListener('click', () => {
    const type = button.dataset.resultType;
    if (type === 'genre') selectGenre(button.dataset.resultId);
    else if (type === 'artist') {
      const artist = getArtist(button.dataset.resultId);
      const genreId = artist.genreIds.includes(state().genreId) ? state().genreId : artist.genreIds[0];
      if (genreId !== state().genreId) store.set({ genreId });
      selectArtist(artist.id);
    } else if (type === 'release') {
      const artist = getArtist(button.dataset.artistId);
      const release = artist.releases.find((item) => item.id === button.dataset.resultId);
      const track = release?.tracks[0];
      if (track) {
        const genreId = track.genres.includes(state().genreId) ? state().genreId : track.genres[0];
        store.set({ genreId, artistId: artist.id, catalogMode: 'all', selectedTrackId: track.id, position: 0 });
        renderAll();
      }
    } else {
      const context = findTrackContext(button.dataset.resultId);
      if (context) {
        const genreId = context.track.genres.includes(state().genreId) ? state().genreId : context.track.genres[0];
        store.set({ genreId, artistId: context.artist.id, catalogMode: 'all', selectedTrackId: context.track.id, position: 0 });
        renderAll();
      }
    }
    closeSearch();
  }));
}

function openSearch() { rememberModalFocus(); elements.searchOverlay.hidden = false; elements.globalSearch.value = ''; renderSearchResults(''); focusAfterOpen('globalSearch'); }
function closeSearch() { elements.searchOverlay.hidden = true; restoreModalFocus(); }

function createViewSurface() {
  const surface = document.createElement('section');
  surface.className = 'view-surface';
  surface.id = 'viewSurface';
  surface.hidden = true;
  elements.workspace.appendChild(surface);
  return surface;
}
const viewSurface = createViewSurface();

function showView(view) {
  store.set({ view });
  document.querySelectorAll('.rail-button[data-view]').forEach((button) => {
    const active = button.dataset.view === view;
    button.classList.toggle('active', active);
    active ? button.setAttribute('aria-current', 'page') : button.removeAttribute('aria-current');
  });
  const discover = view === 'discover';
  elements.directory.hidden = !discover;
  elements.journey.hidden = !discover;
  document.querySelector('.inspector').hidden = !discover;
  viewSurface.hidden = discover;
  if (discover) { renderAll(); return; }
  const profile = state().profile || {};
  if (view === 'library') {
    const savedArtists = artists.filter((artist) => includes(state().savedArtists, artist.id));
    const savedReleaseContexts = (state().savedReleases || []).map(findReleaseContext).filter(Boolean);
    const savedTrackContexts = (state().savedTracks || []).map(findTrackContext).filter(Boolean);
    viewSurface.innerHTML = renderLibraryView({ savedArtists, savedReleaseContexts, savedTrackContexts });
  } else if (view === 'journeys') {
    const genre = currentGenre();
    const artist = currentArtist();
    const progress = artistProgress(artist, new Set(state().playedTracks || []), genre.id, state().catalogMode);
    viewSurface.innerHTML = renderJourneysView({ genre, artist, progress });
  } else {
    const tasteGenres = (profile.genres || []).map(getTasteGenreLabel);
    const seedArtists = artists.filter((artist) => includes(profile.seedArtists || [], artist.id));
    viewSurface.innerHTML = renderProfileView({ profile, tasteGenres, seedArtists });
  }
  viewSurface.querySelectorAll('[data-open-artist]').forEach((button) => button.addEventListener('click', () => { showView('discover'); selectArtist(button.dataset.openArtist); }));
  viewSurface.querySelectorAll('[data-open-release]').forEach((button) => button.addEventListener('click', () => {
    const context = findReleaseContext(button.dataset.openRelease);
    const track = context?.release.tracks[0];
    if (!track) return;
    const genreId = track.genres.includes(state().genreId) ? state().genreId : track.genres[0];
    store.set({ genreId, artistId: context.artist.id, catalogMode: 'all', selectedTrackId: track.id, position: 0 });
    showView('discover');
  }));
  viewSurface.querySelectorAll('[data-open-track]').forEach((button) => button.addEventListener('click', () => { const context = findTrackContext(button.dataset.openTrack); store.set({ genreId: context.track.genres[0], artistId: context.artist.id, catalogMode: 'all', selectedTrackId: context.track.id }); showView('discover'); selectTrack(context.track.id, true); }));
  viewSurface.querySelectorAll('[data-return-discover]').forEach((button) => button.addEventListener('click', () => showView('discover')));
  viewSurface.querySelectorAll('[data-genre]').forEach((button) => button.addEventListener('click', () => { showView('discover'); selectGenre(button.dataset.genre); }));
  viewSurface.querySelectorAll('[data-edit-profile]').forEach((button) => button.addEventListener('click', openOnboarding));
}

function openOnboarding() {
  rememberModalFocus();
  const profile = state().profile || {};
  onboardingDraft = {
    displayName: profile.displayName || 'M', email: profile.email || '',
    genres: [...(profile.genres || ['hiphop', 'rnb', 'electronic'])],
    seedArtists: [...(profile.seedArtists || ['kairo-vale', 'mira-son'])],
    discovery: profile.discovery ?? 64, popularity: profile.popularity ?? 45, albumFocus: profile.albumFocus ?? 78
  };
  onboardingStep = 0;
  elements.onboardingOverlay.hidden = false;
  renderOnboardingStep();
  focusAfterOpen('draftName');
}

function closeOnboarding() { elements.onboardingOverlay.hidden = true; restoreModalFocus(); }

function renderOnboardingStep() {
  const stepData = [
    { eyebrow: 'CREATE YOUR RONDO', title: 'A profile that belongs to you.', description: 'This prototype keeps your setup locally. Production will use a secure Rondo account.' },
    { eyebrow: 'TASTE / 01', title: 'Choose the sounds you return to.', description: 'Pick at least three. These set your opening journeys and can be changed later.' },
    { eyebrow: 'TASTE / 02', title: 'Start with a few artists.', description: 'Choose artists that feel familiar. Rondo uses them as context, not as a permanent box.' },
    { eyebrow: 'TASTE / 03', title: 'Decide how far to wander.', description: 'Tune the balance between familiarity, discovery, and full-release listening.' }
  ][onboardingStep];
  elements.onboardingProgress.textContent = `${pad(onboardingStep + 1)} / 04`;
  elements.onboardingEyebrow.textContent = stepData.eyebrow;
  elements.onboardingTitle.textContent = stepData.title;
  elements.onboardingDescription.textContent = stepData.description;
  elements.onboardingBack.disabled = onboardingStep === 0;
  elements.onboardingNext.innerHTML = onboardingStep === 3 ? 'Save profile <span>→</span>' : 'Continue <span>→</span>';

  if (onboardingStep === 0) {
    elements.onboardingStep.innerHTML = `<div class="onboarding-step form-grid"><label class="form-field"><span>Display name</span><input id="draftName" value="${escapeHtml(onboardingDraft.displayName)}" placeholder="Your name" autocomplete="name" required/></label><label class="form-field"><span>Email</span><input id="draftEmail" type="email" value="${escapeHtml(onboardingDraft.email)}" placeholder="you@example.com" autocomplete="email" required/></label></div>`;
    $('draftName').addEventListener('input', (event) => { onboardingDraft.displayName = event.target.value; });
    $('draftEmail').addEventListener('input', (event) => { onboardingDraft.email = event.target.value; });
  } else if (onboardingStep === 1) {
    elements.onboardingStep.innerHTML = `<div class="onboarding-step choice-grid">${onboardingGenres.map((name) => { const id = genres.find((genre) => genre.short === name)?.id || name.toLowerCase(); return `<button class="choice-chip ${onboardingDraft.genres.includes(id) ? 'selected' : ''}" type="button" data-genre-choice="${id}">${escapeHtml(name)}</button>`; }).join('')}</div>`;
    elements.onboardingStep.querySelectorAll('[data-genre-choice]').forEach((button) => button.addEventListener('click', () => { onboardingDraft.genres = toggleList(onboardingDraft.genres, button.dataset.genreChoice); renderOnboardingStep(); }));
  } else if (onboardingStep === 2) {
    elements.onboardingStep.innerHTML = `<div class="onboarding-step seed-grid">${onboardingArtists.map((artist) => `<button class="seed-card ${onboardingDraft.seedArtists.includes(artist.id) ? 'selected' : ''}" type="button" data-seed="${artist.id}"><img src="${artist.image}" alt=""/><span><strong>${escapeHtml(artist.name)}</strong><span>${escapeHtml(artist.tags[0])}</span></span><b>${onboardingDraft.seedArtists.includes(artist.id) ? '✓' : '+'}</b></button>`).join('')}</div>`;
    elements.onboardingStep.querySelectorAll('[data-seed]').forEach((button) => button.addEventListener('click', () => { onboardingDraft.seedArtists = toggleList(onboardingDraft.seedArtists, button.dataset.seed); renderOnboardingStep(); }));
  } else {
    elements.onboardingStep.innerHTML = `<div class="onboarding-step"><label class="taste-control"><div><strong>Discovery</strong><span>Familiar ↔ Unfamiliar</span></div><input id="draftDiscovery" type="range" min="0" max="100" value="${onboardingDraft.discovery}"/></label><label class="taste-control"><div><strong>Track selection</strong><span>Popular ↔ Deep cuts</span></div><input id="draftPopularity" type="range" min="0" max="100" value="${onboardingDraft.popularity}"/></label><label class="taste-control"><div><strong>Listening shape</strong><span>Individual tracks ↔ Full releases</span></div><input id="draftAlbumFocus" type="range" min="0" max="100" value="${onboardingDraft.albumFocus}"/></label><div class="taste-summary">${onboardingDraft.genres.length} genres · ${onboardingDraft.seedArtists.length} seed artists · ${onboardingDraft.discovery}% discovery</div></div>`;
    $('draftDiscovery').addEventListener('input', (event) => { onboardingDraft.discovery = Number(event.target.value); });
    $('draftPopularity').addEventListener('input', (event) => { onboardingDraft.popularity = Number(event.target.value); });
    $('draftAlbumFocus').addEventListener('input', (event) => { onboardingDraft.albumFocus = Number(event.target.value); });
  }
}

function advanceOnboarding() {
  if (onboardingStep === 0) {
    onboardingDraft.displayName = onboardingDraft.displayName.trim();
    onboardingDraft.email = onboardingDraft.email.trim();
    if (!onboardingDraft.displayName) { showToast('Add a display name'); focusAfterOpen('draftName'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(onboardingDraft.email)) { showToast('Add a valid email address'); focusAfterOpen('draftEmail'); return; }
  }
  if (onboardingStep === 1 && onboardingDraft.genres.length < 3) { showToast('Choose at least three genres'); return; }
  if (onboardingStep === 2 && onboardingDraft.seedArtists.length < 2) { showToast('Choose at least two artists'); return; }
  if (onboardingStep < 3) { onboardingStep += 1; renderOnboardingStep(); return; }
  store.set({ profile: onboardingDraft, onboardingComplete: true }, { persist: true });
  $('profileTrigger').textContent = (onboardingDraft.displayName || 'M').charAt(0).toUpperCase();
  closeOnboarding();
  if (state().view === 'profile') showView('profile');
  showToast('Taste profile saved');
}

function bindEvents() {
  elements.genreSelect.addEventListener('change', () => selectGenre(elements.genreSelect.value));
  elements.themeToggle.addEventListener('click', toggleTheme);
  elements.journeyToggle.addEventListener('click', toggleJourney);
  elements.artistFilter.addEventListener('input', renderDirectory);
  elements.matchingMode.addEventListener('click', () => setCatalogMode('matching'));
  elements.allMode.addEventListener('click', () => setCatalogMode('all'));
  $('playArtist').addEventListener('click', () => { const first = currentQueue()[0]; if (first) selectTrack(first.id, true); });
  elements.saveArtist.addEventListener('click', toggleArtistSave);
  $('skipArtist').addEventListener('click', () => selectArtist(nextArtistFor(state().artistId, state().genreId, 1).id, state().playing));
  $('previewCompletion').addEventListener('click', openCompletion);
  elements.saveTrack.addEventListener('click', () => toggleTrackSave());
  document.querySelectorAll('.inspector-tabs [data-tab]').forEach((button) => button.addEventListener('click', () => { store.set({ inspectorTab: button.dataset.tab }); renderNowPlaying(); }));
  elements.lyricsCta.addEventListener('click', openFullPlayer);
  $('openFullPlayer').addEventListener('click', openFullPlayer);
  $('mobileTrack').addEventListener('click', openFullPlayer);
  $('closeFullPlayer').addEventListener('click', closeFullPlayer);
  elements.fullSave.addEventListener('click', () => toggleTrackSave());
  elements.transportPlay.addEventListener('click', togglePlaying);
  elements.fullPlay.addEventListener('click', togglePlaying);
  $('previousTrack').addEventListener('click', () => changeTrack(-1));
  $('nextTrack').addEventListener('click', () => changeTrack(1));
  $('fullPrevious').addEventListener('click', () => changeTrack(-1));
  $('fullNext').addEventListener('click', () => changeTrack(1));
  elements.repeatMode.addEventListener('click', cycleRepeat);
  elements.timeline.addEventListener('click', (event) => { const rect = elements.timeline.getBoundingClientRect(); const context = currentContext(); if (context) seekTo(context.track.durationSeconds * Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))); });
  $('queueButton').addEventListener('click', openQueue);
  elements.fullQueue.addEventListener('click', openQueue);
  elements.fullJourney.addEventListener('click', openJourneyFromPlayer);
  elements.closeQueue.addEventListener('click', closeQueue);
  elements.queueScrim.addEventListener('click', closeQueue);
  $('searchTrigger').addEventListener('click', openSearch);
  $('closeSearch').addEventListener('click', closeSearch);
  elements.globalSearch.addEventListener('input', () => renderSearchResults(elements.globalSearch.value));
  elements.searchOverlay.addEventListener('click', (event) => { if (event.target === elements.searchOverlay) closeSearch(); });
  $('profileTrigger').addEventListener('click', openOnboarding);
  $('mobileDirectoryButton').addEventListener('click', () => { store.set({ directoryCollapsed: false }); elements.directory.classList.add('open'); syncJourneyVisibility(); });
  $('closeDirectory').addEventListener('click', () => { elements.directory.classList.remove('open'); if (!window.matchMedia('(max-width: 760px)').matches) store.set({ directoryCollapsed: true }); syncJourneyVisibility(); });
  $('closeOnboarding').addEventListener('click', closeOnboarding);
  elements.onboardingBack.addEventListener('click', () => { if (onboardingStep > 0) { onboardingStep -= 1; renderOnboardingStep(); } });
  elements.onboardingNext.addEventListener('click', advanceOnboarding);
  $('closeCompletion').addEventListener('click', closeCompletion);
  $('continueArtist').addEventListener('click', continueToNextArtist);
  $('replayArtist').addEventListener('click', replayArtist);
  $('stopJourney').addEventListener('click', () => { closeCompletion(); setPlaying(false); showToast('Journey paused'); });
  document.querySelectorAll('.rail-button[data-view]').forEach((button) => button.addEventListener('click', () => showView(button.dataset.view)));
  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && elements.searchOverlay.hidden && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) { event.preventDefault(); openSearch(); }
    if (event.key === 'Escape') { if (!elements.queueDrawer.hidden) closeQueue(); else if (!elements.searchOverlay.hidden) closeSearch(); else if (!elements.fullPlayer.hidden) closeFullPlayer(); else if (!elements.onboardingOverlay.hidden) closeOnboarding(); else if (!elements.completionOverlay.hidden) closeCompletion(); else elements.directory.classList.remove('open'); }
    if (event.code === 'Space' && document.activeElement === document.body) { event.preventDefault(); togglePlaying(); }
  });
}

bindEvents();
renderAll();
$('profileTrigger').textContent = (state().profile?.displayName || 'M').charAt(0).toUpperCase();
const params = new URLSearchParams(window.location.search);
const previewMode = document.body.dataset.preview || (params.has('onboarding') ? 'onboarding' : params.get('screen'));
if (previewMode === 'onboarding') openOnboarding();
else if (previewMode === 'lyrics') openFullPlayer();
else if (previewMode === 'completion') openCompletion({ preview: true });
else if (previewMode === 'library') showView('library');
else if (previewMode === 'profile') showView('profile');
else if (previewMode === 'queue') { setPlaying(true); openQueue(); }
else if (previewMode === 'playing') setPlaying(true);
else if (previewMode === 'reopened') { setPlaying(true); toggleJourney(); }
else if (previewMode === 'player') { setPlaying(true); openFullPlayer(); }
else if (previewMode === 'light') { store.set({ theme: 'light' }); syncAppearance(); }
else if (previewMode?.startsWith('genre-')) selectGenre(previewMode.replace('genre-', ''));
else if (!previewMode && !state().onboardingComplete && !params.has('skip-onboarding')) openOnboarding();
syncAppearance();
syncJourneyVisibility();
