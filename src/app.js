import { artists, discoveryConnections, discoveryDoors, genres, onboardingArtists, onboardingGenres, releaseLore } from './data/catalog.js';
import { artistProgress, findReleaseContext, findTrackContext, flattenCatalog, getArtist, getGenre, listArtistsForGenre, listReleases, nextArtistFor } from './services/journey.js';
import { createAudioEngine } from './services/audio.js';
import { createStore } from './state/store.js';
import { renderDiscoverView, renderLibraryView, renderProfileView, renderReleaseView } from './ui/views.js';
import { applyGenreAmbience } from './ui/ambience.js';
import { applyArtworkPalette, renderSongRoomPanel, songRoomModes } from './ui/songRoom.js';

const playPath = '<path d="M8 5v14l11-7z"/>';
const pausePath = '<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>';
const heartPath = '<path d="M20.8 4.8a5.4 5.4 0 0 0-7.7 0L12 5.9l-1.1-1.1a5.4 5.4 0 0 0-7.7 7.7l1.1 1.1L12 21l7.7-7.4 1.1-1.1a5.4 5.4 0 0 0 0-7.7Z"/>';
const plusPath = '<path d="M10 4v12M4 10h12"/>';
const checkPath = '<path d="m4 10 3.6 3.6L16 5.8"/>';
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const $ = (id) => document.getElementById(id);
const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const formatTime = (value) => `${Math.floor(Math.max(0, value) / 60)}:${String(Math.floor(Math.max(0, value)) % 60).padStart(2, '0')}`;
const pad = (value) => String(value).padStart(2, '0');
const tasteGenreFallbacks = { rock: 'Rock', pop: 'Pop', afrobeats: 'Afrobeats', classical: 'Classical', folk: 'Folk', latin: 'Latin' };
const getTasteGenreLabel = (id) => genres.find((genre) => genre.id === id)?.short || tasteGenreFallbacks[id] || id;

const store = createStore({
  genreId: 'hiphop', artistId: 'kairo-vale', catalogMode: 'matching', selectedTrackId: 'k101',
  inspectorTab: 'details', playing: false, position: 0, repeatMode: 'continue', view: 'discover',
  theme: 'dark', directoryCollapsed: false, songRoomMode: 'story', activeReleaseId: 'blacktop-studies'
});

let playbackTimer = null;
let onboardingStep = 0;
let onboardingDraft = null;
let toastTimer = null;
let modalReturnFocus = null;
let activeArtistSessionId = null;
let mediaSessionTrackId = null;
let waveformFrame = null;
let activeReleaseSessionId = null;
let lastAudibleVolume = store.get().volume > 0 ? store.get().volume : 0.82;
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

const audioEngine = createAudioEngine({
  onTime(position) {
    const context = currentContext();
    if (!context?.track.previewUrl || !state().playing) return;
    store.set({ position });
    recordReleaseProgress(context, position);
    updatePlayerUI();
  },
  onEnded() { if (state().playing) handleTrackEnd(); },
  onError() { if (state().playing) { startSimulatedPlayback(); showToast('Audio unavailable — demo timeline continues'); } }
});

const elements = {
  appShell: $('appShell'), workspace: document.querySelector('.workspace'), directory: $('directory'), journey: $('journey'),
  genreSelect: $('genreSelect'), artistFilter: $('artistFilter'), alphabet: $('alphabet'), artistList: $('artistList'), artistCount: $('artistCount'),
  topbar: document.querySelector('.topbar'), locationSection: $('locationSection'), locationGenre: $('locationGenre'), locationArtist: $('locationArtist'), artistPortrait: $('artistPortrait'), artistProgressRing: $('artistProgressRing'),
  artistProgressPercent: $('artistProgressPercent'), artistPosition: $('artistPosition'), artistLetter: $('artistLetter'), artistName: $('artistName'),
  artistOrigin: $('artistOrigin'), artistYears: $('artistYears'), artistTags: $('artistTags'), artistBio: $('artistBio'), saveArtist: $('saveArtist'), playArtist: $('playArtist'),
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
  nextArtistImage: $('nextArtistImage'), nextArtistName: $('nextArtistName'), nextArtistTags: $('nextArtistTags'), toast: $('toast'),
  inspector: document.querySelector('.inspector'), transport: document.querySelector('.transport'), mobilePrimaryNav: $('mobilePrimaryNav'), directoryScrim: $('directoryScrim')
};
Object.assign(elements, {
  journeyToggle: $('journeyToggle'), journeyToggleLabel: $('journeyToggleLabel'), themeToggle: $('themeToggle'), themeToggleLabel: $('themeToggleLabel'),
  nowGenreMode: $('nowGenreMode'), nowAudioMeta: $('nowAudioMeta'), fullGenreMode: $('fullGenreMode'), fullAudioMeta: $('fullAudioMeta'),
  fullQueue: $('fullQueue'), fullQueueCount: $('fullQueueCount'), fullJourney: $('fullJourney'), fullRepeat: $('fullRepeat'), fullTimeline: $('fullTimeline'),
  songRoomPanel: $('songRoomPanel'), songRoomTabs: $('songRoomTabs'), songRoomActiveLyric: $('songRoomActiveLyric'), songRoomPreviousLyric: $('songRoomPreviousLyric'),
  songRoomJourneyProgress: $('songRoomJourneyProgress'), songRoomJourneyPercent: $('songRoomJourneyPercent'), songRoomJourneyText: $('songRoomJourneyText'), songRoomJourneyMeta: $('songRoomJourneyMeta'),
  songRoomModeLabel: $('songRoomModeLabel'), songRoomMoment: $('songRoomMoment'), songRoomTimelineKnob: $('songRoomTimelineKnob'), songRoomMiniCover: $('songRoomMiniCover'), songRoomMiniTitle: $('songRoomMiniTitle'), songRoomMiniArtist: $('songRoomMiniArtist'),
  queueScrim: $('queueScrim'), queueDrawer: $('queueDrawer'), queueTitle: $('queueTitle'), queueArtist: $('queueArtist'), queueGenre: $('queueGenre'),
  queueList: $('queueList'), queueProgress: $('queueProgress'), queueCurrent: $('queueCurrent'), closeQueue: $('closeQueue'), volumeControl: $('volumeControl'),
  mobileDirectoryButton: $('mobileDirectoryButton'), volumeMute: $('volumeMute'), volumeValue: $('volumeValue'), mainSoundMeter: $('mainSoundMeter'),
  fullVolumeControl: $('fullVolumeControl'), fullVolumeMute: $('fullVolumeMute'), fullVolumeValue: $('fullVolumeValue'), fullSoundMeter: $('fullSoundMeter'),
  songRoomWave: document.querySelector('.song-room-wave'), revealStatusDot: $('revealStatusDot')
});

const state = () => store.get();
audioEngine.setVolume(state().volume);
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
const playbackDuration = (track) => track?.previewUrl && track?.previewDurationSeconds ? track.previewDurationSeconds : track?.durationSeconds || 0;
const playbackSource = (track) => track?.previewUrl ? 'RONDO ORIGINAL' : 'DEMO TIMELINE';

function syncAppearance() {
  const theme = state().theme === 'light' ? 'light' : 'dark';
  const context = currentContext();
  const genreId = listeningGenreId();
  const ambience = applyGenreAmbience(genreId);
  const songPalette = applyArtworkPalette(context?.release);
  document.documentElement.dataset.theme = theme;
  const nextTheme = theme === 'dark' ? 'light' : 'night';
  elements.themeToggleLabel.textContent = nextTheme === 'light' ? 'Light' : 'Night';
  elements.themeToggle.setAttribute('aria-label', `Switch to ${nextTheme} appearance`);
  const genreLabel = context ? `${context.track.style}`.toUpperCase() : (getGenre(genreId)?.name || genreId).toUpperCase();
  const meta = audioMeta(context?.track).toUpperCase();
  elements.nowGenreMode.textContent = genreLabel;
  elements.nowAudioMeta.textContent = meta;
  elements.fullGenreMode.textContent = genreLabel;
  elements.fullAudioMeta.textContent = `${meta} · ${playbackSource(context?.track)}`;
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.content = theme === 'dark' ? songPalette.base : '#f3f0e9';
}

function syncLocation() {
  const view = state().view;
  if (view === 'discover') {
    elements.locationSection.textContent = 'DISCOVER';
    elements.locationGenre.textContent = 'RONDO EDITION / 01';
    elements.locationArtist.textContent = 'LISTENING DOORS';
    return;
  }
  if (view === 'release') {
    const context = findReleaseContext(state().activeReleaseId);
    elements.locationSection.textContent = 'DISCOVER';
    elements.locationGenre.textContent = 'RELEASE CHAPTER';
    elements.locationArtist.textContent = (context?.release.title || 'CHAPTER').toUpperCase();
    return;
  }
  if (view === 'library') {
    const savedCount = (state().savedArtists?.length || 0) + (state().savedReleases?.length || 0) + (state().savedTracks?.length || 0);
    elements.locationSection.textContent = 'LIBRARY';
    elements.locationGenre.textContent = `${pad(savedCount)} SAVES`;
    elements.locationArtist.textContent = 'YOUR COLLECTION';
    return;
  }
  if (view === 'journeys') {
    elements.locationSection.textContent = 'JOURNEYS';
    elements.locationGenre.textContent = currentGenre().name.toUpperCase();
    elements.locationArtist.textContent = currentArtist().name.toUpperCase();
    return;
  }
  elements.locationSection.textContent = 'PROFILE';
  elements.locationGenre.textContent = 'TASTE SETTINGS';
  elements.locationArtist.textContent = (state().profile?.displayName || 'LOCAL PROFILE').toUpperCase();
}

function syncJourneyVisibility() {
  const isMobile = window.matchMedia('(max-width: 760px)').matches;
  if (!isMobile) elements.directory.classList.remove('open');
  const journeys = state().view === 'journeys';
  const collapsed = Boolean(state().directoryCollapsed && journeys);
  const mobileOpen = journeys && isMobile && elements.directory.classList.contains('open');
  const directoryVisible = journeys && (isMobile ? mobileOpen : !collapsed);
  document.body.classList.toggle('journey-collapsed', collapsed);
  document.body.classList.toggle('mobile-directory-open', mobileOpen);
  elements.directory.hidden = !journeys;
  elements.mobileDirectoryButton.hidden = !journeys;
  elements.journeyToggle.hidden = !journeys;
  elements.journeyToggle.setAttribute('aria-expanded', String(!collapsed));
  elements.journeyToggle.setAttribute('aria-label', collapsed ? 'Show Genre Journey' : 'Hide Genre Journey');
  elements.journeyToggleLabel.textContent = collapsed ? 'Show journey' : 'Hide journey';
  elements.directory.inert = !directoryVisible;
  elements.directory.setAttribute('aria-hidden', String(!directoryVisible));
  elements.mobileDirectoryButton.setAttribute('aria-expanded', String(journeys && (isMobile ? mobileOpen : !collapsed)));
  elements.directoryScrim.hidden = !mobileOpen;
  [elements.topbar, elements.journey, elements.inspector, elements.transport, elements.mobilePrimaryNav, $('viewSurface')]
    .filter(Boolean)
    .forEach((element) => { element.inert = mobileOpen; });
}

function openMobileDirectory() {
  if (state().view !== 'journeys' || topModal()) return;
  store.set({ directoryCollapsed: false });
  elements.directory.classList.add('open');
  syncJourneyVisibility();
  $('closeDirectory').focus();
}

function closeMobileDirectory({ restoreFocus = true } = {}) {
  const wasOpen = elements.directory.classList.contains('open');
  elements.directory.classList.remove('open');
  if (!window.matchMedia('(max-width: 760px)').matches) store.set({ directoryCollapsed: true });
  syncJourneyVisibility();
  if (restoreFocus && wasOpen && window.matchMedia('(max-width: 760px)').matches) elements.mobileDirectoryButton.focus();
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

function syncMeter(meter, value) {
  if (!meter) return;
  const activeCount = Math.ceil(value * meter.querySelectorAll('i').length);
  meter.querySelectorAll('i').forEach((bar, index) => bar.classList.toggle('active', index < activeCount));
}

function syncVolumeUI() {
  const volume = Math.max(0, Math.min(1, Number(state().volume) || 0));
  const value = Math.round(volume * 100);
  [elements.volumeControl, elements.fullVolumeControl, ...document.querySelectorAll('[data-room-volume]')].filter(Boolean).forEach((input) => {
    input.value = String(value);
    input.style.setProperty('--volume', `${value}%`);
  });
  [elements.volumeValue, elements.fullVolumeValue, ...document.querySelectorAll('.song-room-room-volume output')].filter(Boolean).forEach((output) => { output.textContent = String(value); });
  [elements.volumeMute, elements.fullVolumeMute, ...document.querySelectorAll('[data-room-mute]')].filter(Boolean).forEach((button) => {
    button.classList.toggle('muted', value === 0);
    button.setAttribute('aria-label', value === 0 ? `Unmute, previous volume ${Math.round(lastAudibleVolume * 100)}%` : `Mute, volume ${value}%`);
  });
  syncMeter(elements.mainSoundMeter, volume);
  syncMeter(elements.fullSoundMeter, volume);
  document.querySelectorAll('.song-room-room-volume .sound-meter').forEach((meter) => syncMeter(meter, volume));
  document.documentElement.style.setProperty('--volume-level', String(volume));
}

function setVolume(value, { persist = true } = {}) {
  const volume = Math.max(0, Math.min(1, Number(value) || 0));
  if (volume > 0.005) lastAudibleVolume = volume;
  audioEngine.setVolume(volume);
  store.set({ volume }, { persist });
  syncVolumeUI();
}

function toggleMute() {
  const next = state().volume > 0.005 ? 0 : Math.max(0.08, lastAudibleVolume || 0.82);
  setVolume(next);
  showToast(next ? `Sound restored · ${Math.round(next * 100)}%` : 'Sound muted');
}

function motionLevels(count, timestamp) {
  const position = state().position;
  return Array.from({ length: count }, (_, index) => {
    const a = Math.sin(timestamp / 188 + index * 1.47 + position * .37);
    const b = Math.sin(timestamp / 413 + index * .63 - position * .21);
    return Math.max(.07, Math.min(1, .36 + a * .23 + b * .16 + ((index * 7) % 5) * .035));
  });
}

function paintWaveform(levels, mode, ratio = 0) {
  const bars = [...document.querySelectorAll('.song-room-wave i')];
  bars.forEach((bar, index) => {
    const level = levels[index] ?? .12;
    bar.style.setProperty('--level', `${Math.round(7 + level * 31)}px`);
    bar.classList.toggle('passed', bars.length > 1 && index / (bars.length - 1) <= ratio);
  });
  const micro = [...document.querySelectorAll('.micro-spectrum i')];
  micro.forEach((bar, index) => { bar.style.height = `${Math.round(5 + (levels[(index * 2) % levels.length] || .1) * 16)}px`; });
  const compact = [...document.querySelectorAll('.level-bars i')];
  compact.forEach((bar, index) => { bar.style.height = `${Math.round(4 + (levels[(index * 5) % levels.length] || .1) * 13)}px`; });
  if (elements.songRoomWave) {
    elements.songRoomWave.dataset.signalMode = mode;
    const labels = { audio: 'Live waveform from authorized audio', motion: 'Playback-driven motion; audio spectrum unavailable', paused: 'Waveform paused', reduced: 'Static waveform; reduced motion enabled' };
    elements.songRoomWave.setAttribute('aria-label', labels[mode] || labels.motion);
  }
  document.body.dataset.signalMode = mode;
}

function updateWaveformFrame(timestamp) {
  waveformFrame = null;
  if (!state().playing || reducedMotionQuery.matches) return;
  const context = currentContext();
  const bars = document.querySelectorAll('.song-room-wave i');
  const duration = playbackDuration(context?.track);
  const ratio = duration ? Math.max(0, Math.min(1, state().position / duration)) : 0;
  const liveLevels = audioEngine.getLevels(bars.length);
  paintWaveform(liveLevels || motionLevels(bars.length, timestamp), liveLevels ? 'audio' : 'motion', ratio);
  waveformFrame = requestAnimationFrame(updateWaveformFrame);
}

function syncWaveformPlayback(ratio = 0) {
  const bars = [...document.querySelectorAll('.song-room-wave i')];
  bars.forEach((bar, index) => bar.classList.toggle('passed', bars.length > 1 && index / (bars.length - 1) <= ratio));
  if (reducedMotionQuery.matches) {
    if (waveformFrame) cancelAnimationFrame(waveformFrame);
    waveformFrame = null;
    const levels = bars.map((bar, index) => .15 + ((index * 7) % 9) / 15);
    paintWaveform(levels, 'reduced', ratio);
    return;
  }
  if (state().playing) {
    if (!waveformFrame) waveformFrame = requestAnimationFrame(updateWaveformFrame);
    return;
  }
  if (waveformFrame) cancelAnimationFrame(waveformFrame);
  waveformFrame = null;
  const levels = bars.map((bar, index) => .08 + ((index * 5) % 7) / 18);
  paintWaveform(levels, 'paused', ratio);
}

function recordReleaseProgress(context, position) {
  const lore = releaseLore[context?.release.id];
  if (!lore || !state().playing) return;
  const second = Math.max(0, Math.floor(position));
  const previous = Math.floor(Number(state().releaseProgress?.[context.release.id]) || 0);
  if (second <= previous) return;
  const releaseProgress = { ...(state().releaseProgress || {}), [context.release.id]: second };
  const unlocked = new Set(state().unlockedArtifacts || []);
  const justOpened = second >= lore.artifact.unlockSeconds && !unlocked.has(context.release.id);
  if (justOpened) unlocked.add(context.release.id);
  store.set({ releaseProgress, unlockedArtifacts: [...unlocked] }, { persist: true });
  if (!elements.fullPlayer.hidden && state().songRoomMode === 'reveals') renderFullPlayer(context);
  if (justOpened) {
    renderActiveSurface();
    showToast(`Reveal opened · ${lore.artifact.title}`);
  }
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

function syncModalState() {
  const active = topModal();
  elements.appShell.inert = Boolean(active);
  document.body.classList.toggle('modal-open', Boolean(active));
  [elements.queueDrawer, elements.searchOverlay, elements.fullPlayer, elements.onboardingOverlay, elements.completionOverlay]
    .filter(Boolean)
    .forEach((surface) => { surface.inert = Boolean(active && surface !== active); });
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
  elements.artistCount.textContent = `${pad(allEligible.length)} artists`;
  elements.alphabet.innerHTML = alphabet.map((letter) => `<button type="button" data-letter="${letter}" class="${letter === activeLetter ? 'active' : ''}" ${availableLetters.has(letter) ? '' : 'disabled'}>${letter}</button>`).join('');
  elements.artistList.innerHTML = eligible.length ? eligible.map((artist, index) => `<button class="artist-list-item ${artist.id === state().artistId ? 'active' : ''}" type="button" data-artist="${artist.id}" data-letter="${artist.sortName.charAt(0).toUpperCase()}"><img src="${artist.image}" alt=""/><span><strong>${escapeHtml(artist.name)}</strong><span>${escapeHtml(artist.tags.join(' · '))}</span></span><b>${pad(allEligible.indexOf(artist) + 1)}</b></button>`).join('') : '<p class="directory-empty">No artists match that search.</p>';

  elements.artistList.querySelectorAll('[data-artist]').forEach((button) => button.addEventListener('click', () => selectArtist(button.dataset.artist)));
  elements.alphabet.querySelectorAll('[data-letter]:not(:disabled)').forEach((button) => button.addEventListener('click', () => {
    const target = elements.artistList.querySelector(`[data-letter="${button.dataset.letter}"]`);
    if (target) target.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }));
}

// Final listening controls
function syncArtistPlaybackAction() {
  const artist = currentArtist();
  const currentSession = activeArtistSessionId === artist.id;
  const playing = Boolean(state().playing && currentSession);
  const playbackState = playing ? 'pause' : currentSession ? 'resume' : 'play';
  const label = playbackState === 'pause' ? 'Pause artist' : playbackState === 'resume' ? 'Resume artist' : 'Play artist';
  if (elements.playArtist.dataset.playbackState !== playbackState || elements.playArtist.dataset.artistId !== artist.id) {
    elements.playArtist.dataset.playbackState = playbackState;
    elements.playArtist.dataset.artistId = artist.id;
    elements.playArtist.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${playing ? pausePath : playPath}</svg><span>${label}</span>`;
  }
  elements.playArtist.classList.toggle('playing', playing);
  elements.playArtist.setAttribute('aria-pressed', String(playing));
  elements.playArtist.setAttribute('aria-label', `${label} · ${artist.name}`);
}

function syncCatalogPlaybackControls() {
  document.querySelectorAll('.track-row').forEach((row) => {
    const button = row.querySelector('[data-play-track]');
    const number = row.querySelector('.track-number');
    if (!button || !number) return;
    if (!number.dataset.index) number.dataset.index = number.textContent.trim();
    const selected = row.dataset.track === state().selectedTrackId;
    const playing = selected && state().playing;
    const label = playing ? 'Pause' : selected && activeArtistSessionId === state().artistId ? 'Resume' : 'Play';
    const title = row.querySelector('.track-name strong')?.textContent.trim() || 'track';
    row.dataset.playbackState = playing ? 'playing' : selected ? 'selected' : 'idle';
    button.setAttribute('aria-label', `${label} ${title}`);
    button.setAttribute('aria-pressed', String(playing));
    number.innerHTML = playing
      ? '<span class="track-equalizer" aria-hidden="true"><i></i><i></i><i></i></span>'
      : selected
        ? `<svg class="track-state-icon" viewBox="0 0 24 24" aria-hidden="true">${playPath}</svg>`
        : escapeHtml(number.dataset.index);
  });
}

function syncMediaSession(context = currentContext()) {
  if (!context || !('mediaSession' in navigator)) return;
  const { artist, release, track } = context;
  try {
    if (mediaSessionTrackId !== track.id && 'MediaMetadata' in window) {
      mediaSessionTrackId = track.id;
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: trackArtistLine(track, artist),
        album: release.title,
        artwork: [{ src: new URL(release.cover, window.location.href).href, type: 'image/svg+xml' }]
      });
    }
    navigator.mediaSession.playbackState = state().playing ? 'playing' : 'paused';
    if (navigator.mediaSession.setPositionState) {
      const duration = Math.max(1, playbackDuration(track));
      navigator.mediaSession.setPositionState({ duration, position: Math.min(duration, Math.max(0, state().position)), playbackRate: 1 });
    }
  } catch {
    // Media Session support varies; core playback remains unaffected.
  }
}

function bindMediaSession() {
  if (!('mediaSession' in navigator)) return;
  const handlers = {
    play: () => setPlaying(true),
    pause: () => setPlaying(false),
    previoustrack: () => changeTrack(-1),
    nexttrack: () => changeTrack(1),
    seekbackward: (details = {}) => seekTo(state().position - (details.seekOffset || 10)),
    seekforward: (details = {}) => seekTo(state().position + (details.seekOffset || 10)),
    seekto: (details = {}) => { if (Number.isFinite(details.seekTime)) seekTo(details.seekTime); },
    stop: () => setPlaying(false)
  };
  Object.entries(handlers).forEach(([action, handler]) => {
    try { navigator.mediaSession.setActionHandler(action, handler); } catch { /* Unsupported action. */ }
  });
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
  elements.saveArtist.innerHTML = `<span class="save-artist-symbol" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8">${saved ? checkPath : plusPath}</svg></span><span class="save-artist-label">${saved ? 'Artist saved' : 'Save artist'}</span>`;
  elements.saveArtist.setAttribute('aria-label', saved ? 'Remove artist from Library' : 'Save artist to Library');
  syncArtistPlaybackAction();
  syncLocation();
}

function trackArtistLine(track, artist) {
  return track.features.length ? `${artist.name} featuring ${track.features.join(', ')}` : artist.name;
}

function renderCatalog() {
  const artist = currentArtist();
  const releases = listReleases(artist, state().genreId, state().catalogMode);
  elements.releases.innerHTML = releases.length ? releases.map((release, releaseIndex) => {
    const releaseSaved = includes(state().savedReleases, release.id);
    const lore = releaseLore[release.id];
    const releaseActive = release.tracks.some((track) => track.id === state().selectedTrackId);
    const heard = release.tracks.some((track) => includes(state().playedTracks, track.id));
    const playbackLabel = releaseActive && state().playing ? 'Pause chapter' : releaseActive && heard ? 'Resume chapter' : 'Play chapter';
    return `<section class="release-group" data-release="${release.id}">
      <header class="release-head release-chapter-head"><button class="release-cover-button" type="button" data-open-release-chapter="${release.id}" aria-label="Open ${escapeHtml(release.title)} chapter"><img src="${release.cover}" alt="${escapeHtml(release.title)} artwork"/><i>${pad(releaseIndex + 1)}</i></button><div class="release-head-copy"><span>${escapeHtml(lore?.index || `${release.type.toUpperCase()} / ${pad(releaseIndex + 1)}`)}</span><strong>${escapeHtml(release.title)}</strong><small>${escapeHtml(lore?.hook || `${release.label} · ${pad(release.tracks.length)} tracks`)}</small><em>${escapeHtml(lore?.motif || `${release.type} · ${release.year}`)}</em></div><div class="release-head-actions"><button type="button" data-play-release-inline="${release.id}">${playbackLabel}</button><button type="button" data-open-release-chapter="${release.id}">Open chapter ↗</button><button class="release-save ${releaseSaved ? 'saved' : ''}" type="button" data-save-release="${release.id}" aria-label="${releaseSaved ? 'Remove' : 'Save'} ${escapeHtml(release.title)}"><svg viewBox="0 0 24 24" fill="${releaseSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8">${heartPath}</svg></button></div></header>
      <div class="track-head"><span>#</span><span>TRACK / ALBUM</span><span>STYLE</span><span>TIME</span><span></span></div>
      <div class="release-tracks">${release.tracks.map((track, trackIndex) => {
        const selected = track.id === state().selectedTrackId;
        const saved = includes(state().savedTracks, track.id);
        return `<div class="track-row ${selected ? 'active' : ''}" data-track="${track.id}"><button class="track-play" type="button" data-play-track="${track.id}" aria-label="Play ${escapeHtml(track.title)}" ${selected ? 'aria-current="true"' : ''}><span class="track-number">${pad(trackIndex + 1)}</span><span class="track-name"><strong>${escapeHtml(track.title)}${track.explicit ? ' <sup>E</sup>' : ''}</strong><small>${escapeHtml(release.title)}${track.features.length ? ` · feat. ${escapeHtml(track.features.join(', '))}` : ''}</small></span><span class="track-style">${escapeHtml(track.style)}</span><span class="track-duration">${track.duration}</span></button><button class="track-save ${saved ? 'saved' : ''}" type="button" data-save-track="${track.id}" aria-label="${saved ? 'Remove' : 'Save'} ${escapeHtml(track.title)}"><svg viewBox="0 0 24 24" fill="${saved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8">${heartPath}</svg></button></div>`;
      }).join('')}</div>
    </section>`;
  }).join('') : '<p class="catalog-empty">No albums or EPs match this genre yet. Switch to All catalog.</p>';

  elements.releases.querySelectorAll('[data-track]').forEach((row) => {
    row.addEventListener('click', (event) => {
      const saveButton = event.target.closest('[data-save-track]');
      if (saveButton) { event.stopPropagation(); toggleTrackSave(saveButton.dataset.saveTrack); return; }
      if (row.dataset.track === state().selectedTrackId) { togglePlaying(); return; }
      activeReleaseSessionId = findTrackContext(row.dataset.track)?.release.id || null;
      selectTrack(row.dataset.track, true);
    });
  });
  elements.releases.querySelectorAll('[data-save-release]').forEach((button) => button.addEventListener('click', () => toggleReleaseSave(button.dataset.saveRelease)));
  elements.releases.querySelectorAll('[data-open-release-chapter]').forEach((button) => button.addEventListener('click', () => openReleaseChapter(button.dataset.openReleaseChapter)));
  elements.releases.querySelectorAll('[data-play-release-inline]').forEach((button) => button.addEventListener('click', () => playRelease(button.dataset.playReleaseInline)));
  syncCatalogPlaybackControls();
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

function songRoomLabel(mode) {
  return ({ room: 'Song Room', lyrics: 'Lyrics', story: 'Song story', credits: 'Credits', reveals: 'Listening reveal', queue: 'Up next' })[mode] || 'Song Room';
}

function setSongRoomMode(mode) {
  const nextMode = songRoomModes.includes(mode) ? mode : 'story';
  store.set({ songRoomMode: nextMode });
  renderFullPlayer();
}

function updateMomentUI(context = currentContext()) {
  if (!context || !elements.songRoomMoment) return;
  const position = Math.round(state().position);
  const saved = (state().savedMoments || []).some((moment) => moment.trackId === context.track.id && Math.abs(moment.position - position) <= 2);
  elements.songRoomMoment.classList.toggle('saved', saved);
  elements.songRoomMoment.textContent = saved ? `Moment saved · ${formatTime(position)}` : `Save this moment · ${formatTime(position)}`;
  elements.songRoomMoment.setAttribute('aria-pressed', String(saved));
}

function toggleSavedMoment() {
  const context = currentContext();
  if (!context) return;
  const position = Math.round(state().position);
  const moments = [...(state().savedMoments || [])];
  const existing = moments.findIndex((moment) => moment.trackId === context.track.id && Math.abs(moment.position - position) <= 2);
  if (existing >= 0) moments.splice(existing, 1);
  else moments.push({ id: `${context.track.id}:${position}`, trackId: context.track.id, position, createdAt: new Date().toISOString() });
  store.set({ savedMoments: moments }, { persist: true });
  updateMomentUI(context);
  showToast(existing >= 0 ? 'Saved moment removed' : `Moment saved at ${formatTime(position)}`);
}

function saveSongNote() {
  const context = currentContext();
  const input = $('songRoomPrivateNote');
  if (!context || !input) return;
  const note = input.value.trim().slice(0, 280);
  const songNotes = { ...(state().songNotes || {}) };
  if (note) songNotes[context.track.id] = note;
  else delete songNotes[context.track.id];
  store.set({ songNotes }, { persist: true });
  showToast(note ? 'Private song note saved' : 'Private song note removed');
}

function bindSongRoomPanel() {
  elements.songRoomPanel.querySelectorAll('[data-time]').forEach((line) => line.addEventListener('click', () => seekTo(Number(line.dataset.time))));
  elements.songRoomPanel.querySelectorAll('[data-song-room-track]').forEach((button) => button.addEventListener('click', () => {
    activeReleaseSessionId = findTrackContext(button.dataset.songRoomTrack)?.release.id || null;
    selectTrack(button.dataset.songRoomTrack, state().playing);
    setSongRoomMode('queue');
  }));
  elements.songRoomPanel.querySelector('[data-save-song-note]')?.addEventListener('click', saveSongNote);
  elements.songRoomPanel.querySelector('[data-open-release-from-room]')?.addEventListener('click', (event) => {
    const releaseId = event.currentTarget.dataset.openReleaseFromRoom;
    closeFullPlayer({ restoreFocus: false });
    openReleaseChapter(releaseId);
  });
  elements.songRoomPanel.querySelector('[data-room-volume]')?.addEventListener('input', (event) => setVolume(Number(event.currentTarget.value) / 100));
  elements.songRoomPanel.querySelector('[data-room-mute]')?.addEventListener('click', toggleMute);
  syncVolumeUI();
}

function renderFullPlayer(context = currentContext()) {
  if (!context) return;
  const { artist, release, track } = context;
  const queue = currentQueue();
  const queueIndex = Math.max(0, queue.findIndex((item) => item.id === track.id));
  const mode = songRoomModes.includes(state().songRoomMode) ? state().songRoomMode : 'story';
  const saved = includes(state().savedTracks, track.id);
  const palette = applyArtworkPalette(release);
  elements.fullPlayer.dataset.mode = mode;
  elements.fullCover.src = release.cover;
  elements.fullCover.alt = `${track.title} artwork`;
  elements.fullRelease.textContent = `${release.title.toUpperCase()} · ${release.year}`;
  elements.fullTitle.textContent = track.title;
  elements.fullArtist.innerHTML = `<b>${escapeHtml(artist.name)}</b>${track.features.length ? ` featuring ${escapeHtml(track.features.join(', '))}` : ''}`;
  elements.fullTags.innerHTML = [...track.genres.map((id) => getGenre(id).short), track.style].map((tag) => `<span>${escapeHtml(tag)}</span>`).join('');
  elements.fullSave.textContent = saved ? '♥' : '♡';
  elements.fullSave.setAttribute('aria-label', `${saved ? 'Remove' : 'Save'} ${track.title}`);
  elements.fullQueueCount.textContent = pad(queue.length);
  elements.songRoomMiniCover.src = release.cover;
  elements.songRoomMiniTitle.textContent = track.title;
  elements.songRoomMiniArtist.textContent = track.features.length ? `${artist.name} feat. ${track.features.join(', ')}` : artist.name;
  elements.songRoomJourneyText.textContent = `${artist.name} chapter`;
  elements.songRoomJourneyMeta.textContent = `${currentGenre().short} journey · ${pad(queueIndex + 1)} of ${pad(queue.length)}`;
  const journeyPercent = queue.length ? ((queueIndex + 1) / queue.length) * 100 : 0;
  elements.songRoomJourneyProgress.style.setProperty('--song-room-progress', `${journeyPercent}%`);
  elements.songRoomJourneyPercent.textContent = String(Math.round(journeyPercent));
  elements.songRoomModeLabel.textContent = songRoomLabel(mode);
  elements.fullAudioMeta.textContent = `${audioMeta(track).toUpperCase()} · ${palette.signal} · ${playbackSource(track)}`;
  elements.fullPlayer.dataset.playbackSource = track.previewUrl ? 'audio' : 'simulated';
  const lore = releaseLore[release.id] || null;
  const revealProgress = Number(state().releaseProgress?.[release.id]) || 0;
  const revealUnlocked = includes(state().unlockedArtifacts, release.id);
  elements.revealStatusDot?.classList.toggle('open', revealUnlocked);
  elements.fullLyricsLines.innerHTML = track.lyrics.map((line) => `<p data-time="${line.time}">${escapeHtml(line.text)}</p>`).join('');
  const queueEntries = queue.map((item) => ({ track: item, release: findTrackContext(item.id).release, active: item.id === track.id }));
  elements.songRoomPanel.innerHTML = renderSongRoomPanel({ mode, context, queueEntries, genreName: currentGenre().name, note: state().songNotes?.[track.id] || '', lore, revealUnlocked, revealProgress, volume: state().volume });
  document.querySelectorAll('[data-song-room-mode]').forEach((button) => {
    const active = button.dataset.songRoomMode === mode;
    button.classList.toggle('active', active);
    if (button.getAttribute('role') === 'tab') button.setAttribute('aria-selected', String(active));
    if (button.closest('.song-room-mobile-nav')) {
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    }
  });
  bindSongRoomPanel();
  updateLyricHighlights();
  updateMomentUI(context);
  syncVolumeUI();
}

function updateLyricHighlights() {
  const context = currentContext();
  if (!context) return;
  const activeIndex = activeLyricIndex(context.track);
  const activeLine = context.track.lyrics[activeIndex];
  const previousLine = context.track.lyrics[Math.max(0, activeIndex - 1)];
  document.querySelectorAll('.lyric-preview [data-time], #fullLyricsLines [data-time], .song-room-lyric-list [data-time]').forEach((line) => {
    line.classList.toggle('active', Number(line.dataset.time) === activeLine?.time);
  });
  elements.songRoomActiveLyric.textContent = activeLine?.text || 'No synchronized words available';
  elements.songRoomPreviousLyric.textContent = previousLine?.time === activeLine?.time ? '' : previousLine?.text || '';
  updateMomentUI(context);
}

function updatePlayerUI() {
  const context = currentContext();
  if (!context) return;
  const { track } = context;
  const duration = playbackDuration(track);
  const ratio = duration ? Math.max(0, Math.min(1, state().position / duration)) : 0;
  const percentage = `${ratio * 100}%`;
  elements.elapsed.textContent = formatTime(state().position);
  elements.remaining.textContent = `−${formatTime(duration - state().position)}`;
  elements.timelineFill.style.width = percentage;
  elements.timelineKnob.style.left = percentage;
  elements.fullTimelineFill.style.width = percentage;
  elements.songRoomTimelineKnob.style.left = percentage;
  elements.fullElapsed.textContent = elements.elapsed.textContent;
  elements.fullRemaining.textContent = elements.remaining.textContent;
  elements.timeline.setAttribute('aria-valuemin', '0');
  elements.timeline.setAttribute('aria-valuemax', String(Math.round(duration)));
  elements.timeline.setAttribute('aria-valuenow', String(Math.round(state().position)));
  elements.timeline.setAttribute('aria-valuetext', `${formatTime(state().position)} of ${formatTime(duration)}`);
  elements.fullTimeline.setAttribute('aria-valuemin', '0');
  elements.fullTimeline.setAttribute('aria-valuemax', String(Math.round(duration)));
  elements.fullTimeline.setAttribute('aria-valuenow', String(Math.round(state().position)));
  elements.fullTimeline.setAttribute('aria-valuetext', `${formatTime(state().position)} of ${formatTime(duration)}`);
  elements.transportPlayIcon.innerHTML = state().playing ? pausePath : playPath;
  elements.transportPlay.setAttribute('aria-label', state().playing ? 'Pause' : 'Play');
  elements.fullPlay.textContent = state().playing ? 'Ⅱ' : '▶';
  elements.fullPlay.setAttribute('aria-label', state().playing ? 'Pause' : 'Play');
  document.body.classList.toggle('is-playing', state().playing);
  syncArtistPlaybackAction();
  syncCatalogPlaybackControls();
  syncMediaSession(context);
  syncJourneyVisibility();
  syncWaveformPlayback(ratio);
  syncSurfacePlaybackControls();
  syncVolumeUI();
  const repeat = state().repeatMode;
  elements.repeatMode.dataset.repeat = repeat;
  elements.repeatBadge.textContent = repeat === 'track' ? '1' : repeat === 'artist' ? 'A' : '';
  elements.repeatMode.setAttribute('aria-label', repeat === 'continue' ? 'Continue mode' : `Repeat ${repeat}`);
  elements.fullRepeat.dataset.repeat = repeat;
  elements.fullRepeat.setAttribute('aria-label', repeat === 'continue' ? 'Continue mode' : `Repeat ${repeat}`);
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
  const continuePlaying = state().playing;
  if (!continuePlaying) activeArtistSessionId = null;
  audioEngine.pause();
  const eligible = listArtistsForGenre(genreId);
  const artist = eligible[0] || artists[0];
  store.set({ genreId, artistId: artist.id, catalogMode: 'matching', selectedTrackId: flattenCatalog(artist, genreId, 'matching')[0]?.id || artist.releases[0].tracks[0].id, position: 0, inspectorTab: 'details' });
  renderAll();
  elements.journey.scrollTo({ top: 0, behavior: 'smooth' });
  showToast(`${getGenre(genreId).short} journey loaded`);
  if (continuePlaying) setPlaying(true);
}

function selectArtist(artistId, shouldPlay = false) {
  const continuePlaying = shouldPlay || state().playing;
  if (!continuePlaying) activeArtistSessionId = null;
  audioEngine.pause();
  const artist = getArtist(artistId);
  const queue = flattenCatalog(artist, state().genreId, state().catalogMode);
  store.set({ artistId, selectedTrackId: queue[0]?.id || artist.releases[0].tracks[0].id, position: 0, inspectorTab: 'details' });
  elements.directory.classList.remove('open');
  renderAll();
  elements.journey.scrollTo({ top: 0, behavior: 'smooth' });
  if (continuePlaying) setPlaying(true);
}

function selectTrack(trackId, shouldPlay = false) {
  const continuePlaying = shouldPlay || state().playing;
  audioEngine.pause();
  store.set({ selectedTrackId: trackId, position: 0 });
  renderCatalog();
  renderNowPlaying();
  if (continuePlaying) setPlaying(true);
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

function startSimulatedPlayback() {
  clearInterval(playbackTimer);
  playbackTimer = setInterval(() => {
    const context = currentContext();
    if (!context || !state().playing) return;
    const nextPosition = state().position + 1;
    if (nextPosition >= playbackDuration(context.track)) handleTrackEnd();
    else { store.set({ position: nextPosition }); recordReleaseProgress(context, nextPosition); updatePlayerUI(); }
  }, 1000);
}

function setPlaying(playing) {
  clearInterval(playbackTimer);
  const context = currentContext();
  if (!context) return;
  if (!playing) {
    audioEngine.pause();
    store.set({ playing: false });
    document.body.dataset.playbackSource = context.track.previewUrl ? 'audio' : 'simulated';
    syncJourneyVisibility();
    updatePlayerUI();
    return;
  }
  const duration = playbackDuration(context.track);
  const nextPosition = state().position >= duration - .1 ? 0 : state().position;
  activeArtistSessionId = state().artistId;
  store.set({ playing: true, directoryCollapsed: true, position: nextPosition });
  elements.directory.classList.remove('open');
  persistPlayedTrack();
  document.body.dataset.playbackSource = context.track.previewUrl ? 'audio' : 'simulated';
  if (context.track.previewUrl) {
    audioEngine.play(context.track, nextPosition).catch(() => {
      if (!state().playing) return;
      startSimulatedPlayback();
      showToast('Audio unavailable — demo timeline continues');
    });
  } else {
    audioEngine.stop();
    startSimulatedPlayback();
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
  if (topModal()) return;
  rememberModalFocus(event?.currentTarget || $('queueButton'));
  renderQueue();
  elements.queueScrim.hidden = false;
  elements.queueDrawer.hidden = false;
  syncModalState();
  requestAnimationFrame(() => elements.closeQueue.focus());
}

function closeQueue({ restoreFocus = true } = {}) {
  elements.queueScrim.hidden = true;
  elements.queueDrawer.hidden = true;
  syncModalState();
  if (restoreFocus) restoreModalFocus();
}

function openJourneyFromPlayer() {
  closeFullPlayer();
  showView('journeys');
  store.set({ directoryCollapsed: false });
  if (window.matchMedia('(max-width: 760px)').matches) elements.directory.classList.add('open');
  syncJourneyVisibility();
  requestAnimationFrame(() => (window.matchMedia('(max-width: 760px)').matches ? $('closeDirectory') : elements.genreSelect).focus());
}

function seekTo(position) {
  const context = currentContext();
  if (!context) return;
  const nextPosition = Math.max(0, Math.min(playbackDuration(context.track), position));
  store.set({ position: nextPosition });
  if (context.track.previewUrl) audioEngine.seek(nextPosition);
  updatePlayerUI();
}

function seekFromPointer(event, element) {
  const rect = element.getBoundingClientRect();
  const context = currentContext();
  if (!context || !rect.width) return;
  seekTo(playbackDuration(context.track) * Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)));
}

function handleTimelineKeydown(event) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  const context = currentContext();
  if (!context) return;
  const duration = playbackDuration(context.track);
  const nextPosition = event.key === 'Home'
    ? 0
    : event.key === 'End'
      ? duration
      : state().position + (event.key === 'ArrowRight' ? 5 : -5);
  event.preventDefault();
  seekTo(nextPosition);
}

function changeTrack(direction) {
  const queue = currentQueue();
  if (!queue.length) return;
  const index = queue.findIndex((track) => track.id === state().selectedTrackId);
  if (direction < 0 && state().position > 3) { seekTo(0); return; }
  const nextIndex = index + direction;
  if (nextIndex >= queue.length) { openCompletion(); return; }
  if (nextIndex < 0) { selectTrack(queue[0].id, state().playing); return; }
  selectTrack(queue[nextIndex].id, state().playing);
}

function handleTrackEnd() {
  const queue = currentQueue();
  const index = queue.findIndex((track) => track.id === state().selectedTrackId);
  if (state().repeatMode === 'track') { seekTo(0); setPlaying(true); return; }
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
  if (state().view !== 'journeys') renderActiveSurface();
  showToast(next.includes(releaseId) ? 'Release saved to Rondo' : 'Release removed from Rondo');
}

function toggleArtistSave() {
  const artistId = state().artistId;
  const next = toggleList(state().savedArtists, artistId);
  store.set({ savedArtists: next }, { persist: true });
  renderArtistFocus();
  showToast(next.includes(artistId) ? 'Artist saved to Rondo' : 'Artist removed from Rondo');
}

function openCompletion(options = {}) {
  const preview = Boolean(options?.preview);
  const trigger = options?.currentTarget instanceof HTMLElement ? options.currentTarget : null;
  const active = topModal();
  if (active && active !== elements.fullPlayer && active !== elements.queueDrawer) return;
  const preservedReturnFocus = !elements.fullPlayer.hidden ? modalReturnFocus : null;
  if (!elements.queueDrawer.hidden) closeQueue({ restoreFocus: false });
  if (!elements.fullPlayer.hidden) closeFullPlayer({ restoreFocus: false });
  if (state().playing) setPlaying(false);
  rememberModalFocus(preservedReturnFocus || trigger);
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
  syncModalState();
  focusAfterOpen('closeCompletion');
}

function closeCompletion({ restoreFocus = true } = {}) { elements.completionOverlay.hidden = true; syncModalState(); if (restoreFocus) restoreModalFocus(); }
function continueToNextArtist() { const next = nextArtistFor(state().artistId, state().genreId, 1); closeCompletion(); selectArtist(next.id, true); }
function replayArtist() { const first = currentQueue()[0]; closeCompletion(); if (first) selectTrack(first.id, true); }

function focusableWithin(container) {
  return [...container.querySelectorAll('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')].filter((element) => element.getClientRects().length && !element.closest('[hidden]'));
}

function trapModalFocus(event, container) {
  const focusable = focusableWithin(container);
  if (!focusable.length) return false;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!container.contains(document.activeElement)) { event.preventDefault(); (event.shiftKey ? last : first).focus(); return true; }
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); return true; }
  if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); return true; }
  return false;
}

function topModal() {
  return [elements.queueDrawer, elements.completionOverlay, elements.onboardingOverlay, elements.searchOverlay, elements.fullPlayer].find((element) => element && !element.hidden) || null;
}

function openFullPlayer(event, mode = state().songRoomMode || 'story') {
  if (topModal()) return;
  rememberModalFocus(event?.currentTarget || $('openFullPlayer'));
  store.set({ songRoomMode: songRoomModes.includes(mode) ? mode : 'story' });
  elements.fullPlayer.hidden = false;
  renderNowPlaying();
  syncModalState();
  focusAfterOpen('closeFullPlayer');
}
function closeFullPlayer({ restoreFocus = true } = {}) { elements.fullPlayer.hidden = true; syncModalState(); if (restoreFocus) restoreModalFocus(); }

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
    closeSearch();
    if (type === 'genre') { showView('journeys'); selectGenre(button.dataset.resultId); }
    else if (type === 'artist') {
      const artist = getArtist(button.dataset.resultId);
      const genreId = artist.genreIds.includes(state().genreId) ? state().genreId : artist.genreIds[0];
      if (genreId !== state().genreId) store.set({ genreId });
      showView('journeys');
      selectArtist(artist.id);
    } else if (type === 'release') {
      openReleaseChapter(button.dataset.resultId);
    } else {
      const context = findTrackContext(button.dataset.resultId);
      if (context) {
        switchListeningContext(context, { play: false });
        showView('journeys');
      }
    }
  }));
}

function openSearch(event) {
  if (topModal()) return;
  rememberModalFocus(event?.currentTarget || null);
  elements.searchOverlay.hidden = false;
  elements.globalSearch.value = '';
  renderSearchResults('');
  syncModalState();
  focusAfterOpen('globalSearch');
}
function closeSearch({ restoreFocus = true } = {}) { elements.searchOverlay.hidden = true; syncModalState(); if (restoreFocus) restoreModalFocus(); }

function createViewSurface() {
  const surface = document.createElement('section');
  surface.className = 'view-surface';
  surface.id = 'viewSurface';
  surface.hidden = true;
  elements.workspace.appendChild(surface);
  return surface;
}
const viewSurface = createViewSurface();

function featuredReleaseContexts() {
  return ['blacktop-studies', 'silver-weather', 'margins', 'no-fixed-address', 'rooms-i-remember']
    .map(findReleaseContext).filter(Boolean).map((context) => ({ ...context, lore: releaseLore[context.release.id] }));
}

function discoverHeroContext() {
  const activeDoor = state().playing ? discoveryDoors.find((door) => door.trackId === state().selectedTrackId) : null;
  const unheardDoor = discoveryDoors.find((door) => !includes(state().playedTracks, door.trackId));
  const door = activeDoor || unheardDoor || discoveryDoors[0];
  const context = findTrackContext(door.trackId) || findTrackContext('k101');
  return { ...context, door, lore: releaseLore[context.release.id] };
}

function renderActiveSurface() {
  if (!viewSurface || state().view === 'journeys') return;
  const profile = state().profile || {};
  viewSurface.className = `view-surface view-surface-${state().view}`;
  if (state().view === 'discover') {
    const hero = discoverHeroContext();
    const chapters = featuredReleaseContexts();
    const sceneGenres = genres.map((genre, index) => ({ ...genre, index: `0${index + 1}`, artistCount: listArtistsForGenre(genre.id).length }));
    const connections = discoveryConnections.map((connection) => ({ connection, left: findTrackContext(connection.trackIds[0]), right: findTrackContext(connection.trackIds[1]) })).filter((item) => item.left && item.right);
    viewSurface.innerHTML = renderDiscoverView({ hero, chapters, genres: sceneGenres, connections, unlockedArtifacts: state().unlockedArtifacts, playedTracks: state().playedTracks, activeTrackId: state().selectedTrackId, playing: state().playing });
  } else if (state().view === 'release') {
    const context = findReleaseContext(state().activeReleaseId) || currentContext();
    const lore = releaseLore[context.release.id];
    viewSurface.innerHTML = renderReleaseView({ ...context, lore, isSaved: includes(state().savedReleases, context.release.id), unlocked: includes(state().unlockedArtifacts, context.release.id), progress: Number(state().releaseProgress?.[context.release.id]) || 0, selectedTrackId: state().selectedTrackId, playing: state().playing, playedTracks: state().playedTracks });
  } else if (state().view === 'library') {
    const savedArtists = artists.filter((artist) => includes(state().savedArtists, artist.id));
    const savedReleaseContexts = (state().savedReleases || []).map(findReleaseContext).filter(Boolean);
    const savedTrackContexts = (state().savedTracks || []).map(findTrackContext).filter(Boolean);
    const savedMomentContexts = (state().savedMoments || []).map((moment) => { const context = findTrackContext(moment.trackId); return context ? { ...context, moment } : null; }).filter(Boolean);
    const songNoteContexts = Object.entries(state().songNotes || {}).map(([trackId, note]) => { const context = findTrackContext(trackId); return context && note ? { ...context, note } : null; }).filter(Boolean);
    viewSurface.innerHTML = renderLibraryView({ savedArtists, savedReleaseContexts, savedTrackContexts, savedMomentContexts, songNoteContexts });
  } else {
    const tasteGenres = (profile.genres || []).map(getTasteGenreLabel);
    const seedArtists = artists.filter((artist) => includes(profile.seedArtists || [], artist.id));
    viewSurface.innerHTML = renderProfileView({ profile, tasteGenres, seedArtists });
  }
  bindViewSurfaceEvents();
  syncSurfacePlaybackControls();
  syncLocation();
}

function switchListeningContext(context, { play = false, position = 0 } = {}) {
  if (!context) return;
  audioEngine.pause();
  clearInterval(playbackTimer);
  const genreId = context.track.genres.includes(state().genreId) ? state().genreId : context.track.genres[0];
  store.set({ genreId, artistId: context.artist.id, catalogMode: 'all', selectedTrackId: context.track.id, position, playing: false, inspectorTab: 'details' });
  renderAll();
  if (play) setPlaying(true);
}

function playSurfaceTrack(trackId) {
  const context = findTrackContext(trackId);
  if (!context) return;
  if (state().selectedTrackId === trackId) { activeReleaseSessionId = context.release.id; togglePlaying(); return; }
  activeReleaseSessionId = context.release.id;
  switchListeningContext(context, { play: true });
  showToast(`Now entering · ${context.track.title}`);
}

function playRelease(releaseId) {
  const context = findReleaseContext(releaseId);
  if (!context) return;
  const selectedInRelease = context.release.tracks.some((track) => track.id === state().selectedTrackId);
  if (selectedInRelease && activeReleaseSessionId === releaseId) { togglePlaying(); return; }
  const track = context.release.tracks.find((item) => item.previewUrl) || context.release.tracks[0];
  activeReleaseSessionId = releaseId;
  switchListeningContext({ ...context, track }, { play: true });
  showToast(`${context.release.title} chapter started`);
}

function openReleaseChapter(releaseId) {
  if (!findReleaseContext(releaseId)) return;
  store.set({ activeReleaseId: releaseId });
  showView('release');
  requestAnimationFrame(() => viewSurface.querySelector('.release-page-back')?.focus({ preventScroll: true }));
}

function surpriseMe() {
  const pool = artists.flatMap((artist) => artist.releases.flatMap((release) => release.tracks.map((track) => ({ artist, release, track })))).filter(({ track }) => track.previewUrl);
  if (!pool.length) return;
  const unheard = pool.filter(({ track }) => !includes(state().playedTracks, track.id) && track.id !== state().selectedTrackId);
  const candidates = unheard.length ? unheard : pool.filter(({ track }) => track.id !== state().selectedTrackId);
  const currentIndex = Math.max(0, pool.findIndex(({ track }) => track.id === state().selectedTrackId));
  const context = candidates[(currentIndex + (state().playedTracks?.length || 0)) % candidates.length] || pool[0];
  activeReleaseSessionId = context.release.id;
  switchListeningContext(context, { play: true });
  openFullPlayer(undefined, 'room');
  showToast(`Somewhere else · ${context.track.title}`);
}

function syncSurfacePlaybackControls() {
  const context = currentContext();
  if (!context) return;
  const heard = includes(state().playedTracks, context.track.id);
  viewSurface?.querySelectorAll('[data-discover-play]').forEach((button) => {
    const active = button.dataset.discoverPlay === context.track.id;
    const label = active && state().playing ? 'Pause this door' : active && heard ? 'Resume this door' : 'Play this door';
    button.innerHTML = `${label} <span>${active && state().playing ? 'Ⅱ' : '▶'}</span>`;
    button.setAttribute('aria-pressed', String(active && state().playing));
  });
  document.querySelectorAll('[data-play-release], [data-play-release-inline]').forEach((button) => {
    const releaseId = button.dataset.playRelease || button.dataset.playReleaseInline;
    const releaseContext = findReleaseContext(releaseId);
    const active = releaseContext?.release.tracks.some((track) => track.id === context.track.id);
    const releaseHeard = releaseContext?.release.tracks.some((track) => includes(state().playedTracks, track.id));
    const label = active && state().playing ? 'Pause chapter' : active && releaseHeard ? 'Resume chapter' : 'Play chapter';
    if (button.dataset.playRelease) button.innerHTML = `${label} <span>${active && state().playing ? 'Ⅱ' : '▶'}</span>`;
    else button.textContent = label;
    button.setAttribute('aria-pressed', String(Boolean(active && state().playing)));
  });
  viewSurface?.querySelectorAll('[data-release-page-track]').forEach((row) => {
    const trackId = row.dataset.releasePageTrack;
    const active = trackId === context.track.id;
    row.classList.toggle('active', active);
    const playButton = row.querySelector('[data-release-track]');
    const icon = playButton?.querySelector('b');
    if (playButton) playButton.setAttribute('aria-pressed', String(active && state().playing));
    if (icon) icon.textContent = active && state().playing ? 'Ⅱ' : '▶';
  });
}

function bindViewSurfaceEvents() {
  viewSurface.querySelectorAll('[data-open-artist]').forEach((button) => button.addEventListener('click', () => { showView('journeys'); selectArtist(button.dataset.openArtist); }));
  viewSurface.querySelectorAll('[data-open-release]').forEach((button) => button.addEventListener('click', () => openReleaseChapter(button.dataset.openRelease)));
  viewSurface.querySelectorAll('[data-open-track]').forEach((button) => button.addEventListener('click', () => playSurfaceTrack(button.dataset.openTrack)));
  viewSurface.querySelectorAll('[data-open-moment], [data-open-note]').forEach((button) => button.addEventListener('click', () => {
    const trackId = button.dataset.openMoment || button.dataset.openNote;
    const context = findTrackContext(trackId);
    if (!context) return;
    switchListeningContext(context, { play: false, position: Number(button.dataset.position || 0) });
    openFullPlayer(undefined, button.dataset.openNote ? 'story' : 'room');
  }));
  viewSurface.querySelectorAll('[data-return-discover]').forEach((button) => button.addEventListener('click', () => showView('discover')));
  viewSurface.querySelectorAll('[data-genre]').forEach((button) => button.addEventListener('click', () => { showView('journeys'); selectGenre(button.dataset.genre); }));
  viewSurface.querySelectorAll('[data-discover-play], [data-discover-track]').forEach((button) => button.addEventListener('click', () => playSurfaceTrack(button.dataset.discoverPlay || button.dataset.discoverTrack)));
  viewSurface.querySelector('[data-surprise-me]')?.addEventListener('click', surpriseMe);
  viewSurface.querySelectorAll('[data-play-release]').forEach((button) => button.addEventListener('click', () => playRelease(button.dataset.playRelease)));
  viewSurface.querySelectorAll('[data-release-track]').forEach((button) => button.addEventListener('click', () => playSurfaceTrack(button.dataset.releaseTrack)));
  viewSurface.querySelectorAll('[data-release-song-room]').forEach((button) => button.addEventListener('click', (event) => {
    const context = findTrackContext(button.dataset.releaseSongRoom);
    if (!context) return;
    switchListeningContext(context, { play: false });
    openFullPlayer(event, 'story');
  }));
  viewSurface.querySelectorAll('[data-save-release]').forEach((button) => button.addEventListener('click', () => toggleReleaseSave(button.dataset.saveRelease)));
  viewSurface.querySelectorAll('[data-edit-profile]').forEach((button) => button.addEventListener('click', openOnboarding));
}

function showView(view) {
  if (!['discover', 'library', 'journeys', 'profile', 'release'].includes(view)) return;
  if (view !== 'journeys' && elements.directory.classList.contains('open')) closeMobileDirectory({ restoreFocus: false });
  store.set({ view });
  document.body.dataset.view = view;
  elements.appShell.dataset.view = view;
  const navigationView = view === 'release' ? 'discover' : view;
  document.querySelectorAll('.rail-button[data-view], .mobile-nav-button[data-mobile-view]').forEach((button) => {
    const active = (button.dataset.view || button.dataset.mobileView) === navigationView;
    button.classList.toggle('active', active);
    active ? button.setAttribute('aria-current', 'page') : button.removeAttribute('aria-current');
  });
  const journeys = view === 'journeys';
  elements.journey.hidden = !journeys;
  elements.inspector.hidden = !journeys;
  viewSurface.hidden = journeys;
  renderAll();
  syncJourneyVisibility();
  if (!journeys) {
    renderActiveSurface();
    viewSurface.scrollTo({ top: 0, behavior: 'instant' });
  }
  syncLocation();
}

function openOnboarding(event) {
  if (topModal()) return;
  rememberModalFocus(event?.currentTarget || null);
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
  syncModalState();
  focusAfterOpen('draftName');
}

function closeOnboarding({ restoreFocus = true } = {}) { elements.onboardingOverlay.hidden = true; syncModalState(); if (restoreFocus) restoreModalFocus(); }

function renderOnboardingStep({ focusSelector = null } = {}) {
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
    elements.onboardingStep.innerHTML = `<div class="onboarding-step choice-grid">${onboardingGenres.map((name) => { const id = genres.find((genre) => genre.short === name)?.id || name.toLowerCase(); const selected = onboardingDraft.genres.includes(id); return `<button class="choice-chip ${selected ? 'selected' : ''}" type="button" data-genre-choice="${id}" aria-pressed="${selected}">${escapeHtml(name)}</button>`; }).join('')}</div>`;
    elements.onboardingStep.querySelectorAll('[data-genre-choice]').forEach((button) => button.addEventListener('click', () => { const selector = `[data-genre-choice="${button.dataset.genreChoice}"]`; onboardingDraft.genres = toggleList(onboardingDraft.genres, button.dataset.genreChoice); renderOnboardingStep({ focusSelector: selector }); }));
  } else if (onboardingStep === 2) {
    elements.onboardingStep.innerHTML = `<div class="onboarding-step seed-grid">${onboardingArtists.map((artist) => { const selected = onboardingDraft.seedArtists.includes(artist.id); return `<button class="seed-card ${selected ? 'selected' : ''}" type="button" data-seed="${artist.id}" aria-pressed="${selected}"><img src="${artist.image}" alt=""/><span><strong>${escapeHtml(artist.name)}</strong><span>${escapeHtml(artist.tags[0])}</span></span><b>${selected ? '✓' : '+'}</b></button>`; }).join('')}</div>`;
    elements.onboardingStep.querySelectorAll('[data-seed]').forEach((button) => button.addEventListener('click', () => { const selector = `[data-seed="${button.dataset.seed}"]`; onboardingDraft.seedArtists = toggleList(onboardingDraft.seedArtists, button.dataset.seed); renderOnboardingStep({ focusSelector: selector }); }));
  } else {
    elements.onboardingStep.innerHTML = `<div class="onboarding-step"><label class="taste-control"><div><strong>Discovery</strong><span>Familiar ↔ Unfamiliar</span></div><input id="draftDiscovery" type="range" min="0" max="100" value="${onboardingDraft.discovery}"/></label><label class="taste-control"><div><strong>Track selection</strong><span>Popular ↔ Deep cuts</span></div><input id="draftPopularity" type="range" min="0" max="100" value="${onboardingDraft.popularity}"/></label><label class="taste-control"><div><strong>Listening shape</strong><span>Individual tracks ↔ Full releases</span></div><input id="draftAlbumFocus" type="range" min="0" max="100" value="${onboardingDraft.albumFocus}"/></label><div class="taste-summary">${onboardingDraft.genres.length} genres · ${onboardingDraft.seedArtists.length} seed artists · ${onboardingDraft.discovery}% discovery</div></div>`;
    $('draftDiscovery').addEventListener('input', (event) => { onboardingDraft.discovery = Number(event.target.value); });
    $('draftPopularity').addEventListener('input', (event) => { onboardingDraft.popularity = Number(event.target.value); });
    $('draftAlbumFocus').addEventListener('input', (event) => { onboardingDraft.albumFocus = Number(event.target.value); });
  }
  if (focusSelector) elements.onboardingStep.querySelector(focusSelector)?.focus();
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
  if (onboardingStep < 3) {
    onboardingStep += 1;
    renderOnboardingStep();
    focusableWithin(elements.onboardingStep)[0]?.focus();
    return;
  }
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
  elements.playArtist.addEventListener('click', () => {
    if (activeArtistSessionId === state().artistId) { togglePlaying(); return; }
    const first = currentQueue()[0];
    if (first) selectTrack(first.id, true);
  });
  elements.saveArtist.addEventListener('click', toggleArtistSave);
  $('skipArtist').addEventListener('click', () => selectArtist(nextArtistFor(state().artistId, state().genreId, 1).id, state().playing));
  $('previewCompletion')?.addEventListener('click', openCompletion);
  elements.saveTrack.addEventListener('click', () => toggleTrackSave());
  document.querySelectorAll('.inspector-tabs [data-tab]').forEach((button) => button.addEventListener('click', () => { store.set({ inspectorTab: button.dataset.tab }); renderNowPlaying(); }));
  elements.lyricsCta.addEventListener('click', (event) => openFullPlayer(event, 'lyrics'));
  $('openFullPlayer').addEventListener('click', (event) => openFullPlayer(event, 'story'));
  $('mobileTrack').addEventListener('click', (event) => openFullPlayer(event, 'room'));
  $('closeFullPlayer').addEventListener('click', closeFullPlayer);
  elements.fullSave.addEventListener('click', () => toggleTrackSave());
  elements.transportPlay.addEventListener('click', togglePlaying);
  syncVolumeUI();
  elements.volumeControl.addEventListener('input', () => setVolume(Number(elements.volumeControl.value) / 100));
  elements.fullVolumeControl.addEventListener('input', () => setVolume(Number(elements.fullVolumeControl.value) / 100));
  elements.volumeMute.addEventListener('click', toggleMute);
  elements.fullVolumeMute.addEventListener('click', toggleMute);
  elements.fullPlay.addEventListener('click', togglePlaying);
  $('previousTrack').addEventListener('click', () => changeTrack(-1));
  $('nextTrack').addEventListener('click', () => changeTrack(1));
  $('fullPrevious').addEventListener('click', () => changeTrack(-1));
  $('fullNext').addEventListener('click', () => changeTrack(1));
  elements.repeatMode.addEventListener('click', cycleRepeat);
  elements.timeline.addEventListener('click', (event) => seekFromPointer(event, elements.timeline));
  elements.timeline.addEventListener('keydown', handleTimelineKeydown);
  $('queueButton').addEventListener('click', openQueue);
  document.querySelectorAll('[data-song-room-mode]').forEach((button) => {
    button.addEventListener('click', () => setSongRoomMode(button.dataset.songRoomMode));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      const peers = [...button.parentElement.querySelectorAll('[data-song-room-mode]')];
      const current = peers.indexOf(button);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? peers.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + peers.length) % peers.length;
      event.preventDefault();
      setSongRoomMode(peers[next].dataset.songRoomMode);
      peers[next].focus();
    });
  });
  elements.fullRepeat.addEventListener('click', cycleRepeat);
  elements.songRoomMoment.addEventListener('click', toggleSavedMoment);
  elements.fullTimeline.addEventListener('click', (event) => seekFromPointer(event, elements.fullTimeline));
  elements.fullTimeline.addEventListener('keydown', handleTimelineKeydown);
  elements.fullJourney.addEventListener('click', openJourneyFromPlayer);
  elements.closeQueue.addEventListener('click', closeQueue);
  elements.queueScrim.addEventListener('click', closeQueue);
  $('searchTrigger').addEventListener('click', openSearch);
  $('closeSearch').addEventListener('click', closeSearch);
  elements.globalSearch.addEventListener('input', () => renderSearchResults(elements.globalSearch.value));
  elements.searchOverlay.addEventListener('click', (event) => { if (event.target === elements.searchOverlay) closeSearch(); });
  $('profileTrigger').addEventListener('click', openOnboarding);
  elements.mobileDirectoryButton.addEventListener('click', openMobileDirectory);
  elements.directoryScrim.addEventListener('click', closeMobileDirectory);
  $('closeDirectory').addEventListener('click', closeMobileDirectory);
  $('closeOnboarding').addEventListener('click', closeOnboarding);
  elements.onboardingBack.addEventListener('click', () => { if (onboardingStep > 0) { onboardingStep -= 1; renderOnboardingStep(); focusableWithin(elements.onboardingStep)[0]?.focus(); } });
  elements.onboardingNext.addEventListener('click', advanceOnboarding);
  $('closeCompletion').addEventListener('click', closeCompletion);
  $('continueArtist').addEventListener('click', continueToNextArtist);
  $('replayArtist').addEventListener('click', replayArtist);
  $('stopJourney').addEventListener('click', () => { closeCompletion(); activeArtistSessionId = null; setPlaying(false); syncArtistPlaybackAction(); showToast('Journey stopped'); });
  document.querySelectorAll('.rail-button[data-view], .mobile-nav-button[data-mobile-view]').forEach((button) => button.addEventListener('click', () => showView(button.dataset.view || button.dataset.mobileView)));
  document.querySelectorAll('.rail-logo, .wordmark').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); showView('discover'); }));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      const focusLayer = topModal() || (elements.directory.classList.contains('open') && window.matchMedia('(max-width: 760px)').matches ? elements.directory : null);
      if (focusLayer && trapModalFocus(event, focusLayer)) return;
    }
    if (event.key === '/' && !topModal() && elements.searchOverlay.hidden && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) { event.preventDefault(); openSearch(); }
    if (event.key === 'Escape') {
      const modal = topModal();
      if (modal === elements.queueDrawer) closeQueue();
      else if (modal === elements.completionOverlay) closeCompletion();
      else if (modal === elements.onboardingOverlay) closeOnboarding();
      else if (modal === elements.searchOverlay) closeSearch();
      else if (modal === elements.fullPlayer) closeFullPlayer();
      else if (elements.directory.classList.contains('open')) closeMobileDirectory();
    }
    const activeElement = document.activeElement;
    const interactive = activeElement?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(activeElement?.tagName);
    const modal = topModal();
    if (event.code === 'Space' && !interactive && (!modal || modal === elements.fullPlayer)) { event.preventDefault(); togglePlaying(); }
  });
  window.addEventListener('resize', syncJourneyVisibility);
  reducedMotionQuery.addEventListener?.('change', () => syncWaveformPlayback());
}

bindEvents();
bindMediaSession();
showView('discover');
$('profileTrigger').textContent = (state().profile?.displayName || 'M').charAt(0).toUpperCase();
const params = new URLSearchParams(window.location.search);
const previewMode = document.body.dataset.preview || (params.has('onboarding') ? 'onboarding' : params.get('screen'));
if (previewMode === 'onboarding') openOnboarding();
else if (previewMode === 'lyrics') openFullPlayer(undefined, 'lyrics');
else if (previewMode === 'completion') openCompletion({ preview: true });
else if (previewMode === 'library') showView('library');
else if (previewMode === 'profile') showView('profile');
else if (previewMode === 'queue') { setPlaying(true); openQueue(); }
else if (previewMode === 'playing') setPlaying(true);
else if (previewMode === 'journey') showView('journeys');
else if (previewMode === 'release') openReleaseChapter('blacktop-studies');
else if (previewMode === 'reveal') { store.set({ releaseProgress: { ...(state().releaseProgress || {}), 'blacktop-studies': 12 }, unlockedArtifacts: [...new Set([...(state().unlockedArtifacts || []), 'blacktop-studies'])] }); openReleaseChapter('blacktop-studies'); }
else if (previewMode === 'reopened') { setPlaying(true); toggleJourney(); }
else if (previewMode === 'player') { setPlaying(true); openFullPlayer(undefined, 'room'); }
else if (previewMode === 'light') { store.set({ theme: 'light' }); syncAppearance(); }
else if (previewMode?.startsWith('genre-')) { showView('journeys'); selectGenre(previewMode.replace('genre-', '')); }
else if (!previewMode && !state().onboardingComplete && !params.has('skip-onboarding')) openOnboarding();
syncAppearance();
syncVolumeUI();
syncWaveformPlayback();
syncJourneyVisibility();
syncModalState();
