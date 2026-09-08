import { artists, genres } from '../data/catalog.js';

const entries = artists.flatMap((artist) => artist.releases.flatMap((release) => release.tracks.map((track) => ({ artist, release, track }))));
const byId = new Map(entries.map((entry) => [entry.track.id, entry]));
const popularIds = ['k101', 'a101', 'g101', 's101', 'm102', 'n101', 't101', 'k105'];
const hiddenIds = ['g104', 'n104', 'a105', 's105', 'm104', 'k107', 'v102', 't102'];
let currentScreen = 'explore';
let selectedGenre = 'hiphop';
let chooserReturnFocus = null;
let initialPromptShown = false;
let renderQueued = false;

function ensureStyles() {
  const active = getComputedStyle(document.documentElement).getPropertyValue('--rondo-human-pass').trim();
  if (active === '1' || document.querySelector('link[data-rondo-human-pass]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'experience.css';
  link.dataset.rondoHumanPass = '';
  document.head.append(link);
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function genreFor(id) {
  return genres.find((genre) => genre.id === id) || genres[0];
}

function entriesForGenre(id) {
  return entries.filter(({ track }) => track.genres.includes(id));
}

function artwork(entry) {
  return `<span class="music-card-art"><img src="${escapeHtml(entry.release.cover)}" alt=""/><i aria-hidden="true">▶</i></span>`;
}

function songCard(entry) {
  return `<button class="music-card" type="button" data-explore-track="${escapeHtml(entry.track.id)}" aria-label="Play ${escapeHtml(entry.track.title)} by ${escapeHtml(entry.artist.name)}">${artwork(entry)}<span class="music-card-copy"><strong>${escapeHtml(entry.track.title)}</strong><span>${escapeHtml(entry.artist.name)}</span><small>${escapeHtml(entry.track.style)}</small></span></button>`;
}

function songRow(entry, index) {
  return `<button class="genre-song" type="button" data-explore-track="${escapeHtml(entry.track.id)}"><span class="genre-song-number">${String(index + 1).padStart(2, '0')}</span><img src="${escapeHtml(entry.release.cover)}" alt=""/><span class="genre-song-name"><strong>${escapeHtml(entry.track.title)}</strong><small>${escapeHtml(entry.artist.name)} · ${escapeHtml(entry.release.title)}</small></span><span class="genre-song-style">${escapeHtml(entry.track.style)}</span><time>${escapeHtml(entry.track.duration)}</time><b aria-hidden="true">▶</b></button>`;
}

function renderExplore() {
  currentScreen = 'explore';
  const surface = document.getElementById('viewSurface');
  if (!surface || document.body.dataset.view !== 'discover') return;
  const popular = popularIds.map((id) => byId.get(id)).filter(Boolean);
  const hidden = hiddenIds.map((id) => byId.get(id)).filter(Boolean);
  const genreSections = genres.map((genre) => {
    const songs = entriesForGenre(genre.id).slice(0, 5);
    return `<section class="music-section music-genre-row"><header><div><span>${escapeHtml(genre.short)}</span><h2>${escapeHtml(genre.name)}</h2></div><button type="button" data-explore-genre="${escapeHtml(genre.id)}">See playlist</button></header><div class="music-card-strip">${songs.map(songCard).join('')}</div></section>`;
  }).join('');
  surface.className = 'view-surface view-surface-discover discovery-surface';
  surface.innerHTML = `<main class="music-explore" data-rondo-discovery data-discovery-screen="explore">
    <header class="music-explore-head"><div><span>Discover</span><h1 class="discover-heading">Find your next song.</h1><p>Popular picks, hidden gems, and every genre in one place.</p></div><button class="music-picker-button" type="button" data-open-discovery-picker>Choose how to listen</button></header>
    <label class="music-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4 4"/></svg><span class="sr-only">Search music</span><input type="search" data-music-search placeholder="Search songs, artists, or albums" autocomplete="off"/></label>
    <section class="music-search-results" data-music-results hidden></section>
    <section class="music-section music-featured"><header><div><span>Start here</span><h2>Popular now</h2></div></header><div class="music-card-grid">${popular.map(songCard).join('')}</div></section>
    <section class="music-section music-hidden"><header><div><span>Worth finding</span><h2>Hidden gems</h2></div></header><div class="music-card-grid">${hidden.map(songCard).join('')}</div></section>
    <div class="music-genre-sections">${genreSections}</div>
  </main>`;
  document.body.dataset.discoveryScreen = 'explore';
}

function renderGenre(id) {
  const genre = genreFor(id);
  selectedGenre = genre.id;
  currentScreen = 'genre';
  const surface = document.getElementById('viewSurface');
  if (!surface || document.body.dataset.view !== 'discover') return;
  const songs = entriesForGenre(genre.id);
  const lead = songs.find(({ track }) => track.previewUrl) || songs[0];
  const releases = [...new Map(songs.map((entry) => [entry.release.id, entry])).values()].slice(0, 6);
  surface.className = 'view-surface view-surface-discover discovery-surface';
  surface.innerHTML = `<main class="genre-playlist" data-rondo-discovery data-discovery-screen="genre" data-genre="${escapeHtml(genre.id)}">
    <header class="genre-playlist-head"><button type="button" data-open-discovery-picker>← Discover</button><div><span>${escapeHtml(genre.short)}</span><h1>${escapeHtml(genre.short)} mix</h1><p>${songs.length} songs from across Rondo.</p></div><button class="genre-play" type="button" data-explore-track="${escapeHtml(lead?.track.id || '')}">Play mix <span>▶</span></button></header>
    <label class="music-search genre-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4 4"/></svg><span class="sr-only">Search this playlist</span><input type="search" data-genre-search placeholder="Search this playlist" autocomplete="off"/></label>
    <section class="genre-song-list" data-genre-song-list>${songs.map(songRow).join('')}</section>
    <section class="music-section genre-releases"><header><div><span>Albums and EPs</span><h2>More ${escapeHtml(genre.short)}</h2></div></header><div class="music-card-grid">${releases.map(songCard).join('')}</div></section>
  </main>`;
  document.body.dataset.discoveryScreen = 'genre';
}

function renderSearchResults(query, scope = entries) {
  const value = query.trim().toLowerCase();
  const target = document.querySelector('[data-music-results]');
  if (!target) return;
  if (!value) {
    target.hidden = true;
    target.innerHTML = '';
    return;
  }
  const matches = scope.filter(({ artist, release, track }) => [track.title, artist.name, release.title, track.style, ...track.genres].join(' ').toLowerCase().includes(value)).slice(0, 12);
  target.hidden = false;
  target.innerHTML = `<header><span>Search results</span><b>${matches.length}</b></header>${matches.length ? `<div>${matches.map(songRow).join('')}</div>` : '<p>No songs found.</p>'}`;
}

function renderChooser() {
  const existing = document.getElementById('discoveryChoice');
  if (existing) return existing;
  const overlay = document.createElement('div');
  overlay.id = 'discoveryChoice';
  overlay.className = 'discovery-choice-overlay';
  overlay.hidden = true;
  overlay.innerHTML = `<section class="discovery-choice" role="dialog" aria-modal="true" aria-labelledby="discoveryChoiceTitle"><button class="discovery-choice-close" type="button" data-close-discovery aria-label="Close">×</button><p>Discover</p><h2 id="discoveryChoiceTitle">What do you want to hear?</h2><div class="discovery-choice-grid"><div class="discovery-option discovery-option-genre"><span>Pick a genre</span><h3>Start with a playlist</h3><p>Choose a sound and press play.</p><div class="discovery-genre-chips" role="radiogroup" aria-label="Choose a genre">${genres.map((genre) => `<button type="button" role="radio" aria-checked="${genre.id === selectedGenre}" class="${genre.id === selectedGenre ? 'active' : ''}" data-choice-genre="${escapeHtml(genre.id)}">${escapeHtml(genre.short)}</button>`).join('')}</div><button class="discovery-listen" type="button" data-listen-genre>Listen to ${escapeHtml(genreFor(selectedGenre).short)}</button></div><button class="discovery-option discovery-option-explore" type="button" data-choose-explore><span>Explore</span><h3>Browse everything</h3><p>Popular songs, underrated picks, and music from every genre.</p><b>Open Explore →</b></button></div></section>`;
  document.body.append(overlay);
  return overlay;
}

function appModalVisible() {
  return ['searchOverlay', 'fullPlayer', 'queueDrawer', 'onboardingOverlay', 'completionOverlay'].some((id) => {
    const element = document.getElementById(id);
    return element && !element.hidden;
  });
}

function syncChoice() {
  const overlay = renderChooser();
  overlay.querySelectorAll('[data-choice-genre]').forEach((button) => {
    const active = button.dataset.choiceGenre === selectedGenre;
    button.classList.toggle('active', active);
    button.setAttribute('aria-checked', String(active));
  });
  overlay.querySelector('[data-listen-genre]').textContent = `Listen to ${genreFor(selectedGenre).short}`;
}

function openChooser(returnFocus = document.activeElement) {
  if (appModalVisible()) return;
  const overlay = renderChooser();
  chooserReturnFocus = returnFocus instanceof HTMLElement ? returnFocus : null;
  syncChoice();
  overlay.hidden = false;
  document.getElementById('appShell')?.setAttribute('inert', '');
  document.body.classList.add('modal-open', 'discovery-choice-open');
  requestAnimationFrame(() => overlay.querySelector('[data-choice-genre].active')?.focus());
}

function closeChooser({ restoreFocus = true } = {}) {
  const overlay = renderChooser();
  if (overlay.hidden) return;
  overlay.hidden = true;
  document.getElementById('appShell')?.removeAttribute('inert');
  document.body.classList.remove('modal-open', 'discovery-choice-open');
  if (restoreFocus && chooserReturnFocus?.isConnected) chooserReturnFocus.focus();
  chooserReturnFocus = null;
}

const wait = (duration = 70) => new Promise((resolve) => setTimeout(resolve, duration));

async function playEntry(entry) {
  if (!entry) return;
  closeChooser({ restoreFocus: false });
  const journeyButton = document.querySelector('.rail-button[data-view="journeys"]') || document.querySelector('.mobile-nav-button[data-mobile-view="journeys"]');
  journeyButton?.click();
  await wait();
  const select = document.getElementById('genreSelect');
  const genreId = entry.track.genres.find((id) => genres.some((genre) => genre.id === id)) || entry.artist.genreIds[0];
  if (select && genreId) {
    select.value = genreId;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await wait();
  }
  document.querySelector(`[data-artist="${CSS.escape(entry.artist.id)}"]`)?.click();
  await wait();
  document.getElementById('allMode')?.click();
  await wait();
  const row = [...document.querySelectorAll('.track-row')].find((item) => item.textContent.includes(entry.track.title));
  const playButton = row?.querySelector('.track-play') || row?.querySelector('button');
  playButton?.click();
  await wait(120);
  document.getElementById('mobileTrack')?.click();
}

function simpleVibe(entry) {
  const text = `${entry?.track.style || ''} ${entry?.track.genres?.join(' ') || ''}`.toLowerCase();
  const bpm = Number(entry?.track.bpm) || 100;
  if (/ambient|quiet|soul|neo-soul/.test(text)) return 'soft';
  if (/jazz|boom bap/.test(text)) return 'warm';
  if (/electronic|techno|industrial|microhouse/.test(text)) return 'electric';
  if (bpm >= 132 || /trap|rap|hip-hop/.test(text)) return 'drive';
  return 'steady';
}

function syncSongRoomVibe() {
  const room = document.getElementById('fullPlayer');
  const cover = document.getElementById('fullCover');
  if (!room || !cover) return;
  const title = document.getElementById('fullTitle')?.textContent?.trim();
  const artist = document.getElementById('fullArtist')?.textContent?.trim();
  const entry = entries.find((item) => item.track.title === title && (!artist || artist.includes(item.artist.name))) || entries.find((item) => item.track.title === title);
  room.dataset.vibe = simpleVibe(entry);
  room.style.setProperty('--song-cover', `url("${cover.getAttribute('src') || ''}")`);
  room.style.setProperty('--song-tempo', String(Math.max(0.7, Math.min(1.35, (Number(entry?.track.bpm) || 100) / 100))));
  const storyTab = room.querySelector('[role="tab"][data-song-room-mode="story"]');
  if (storyTab && storyTab.textContent !== 'About') storyTab.textContent = 'About';
  const revealTab = room.querySelector('[role="tab"][data-song-room-mode="reveals"]');
  if (revealTab?.firstChild && revealTab.firstChild.nodeValue !== 'Extra ') revealTab.firstChild.nodeValue = 'Extra ';
  room.querySelectorAll('.song-room-mobile-nav [data-song-room-mode="story"]').forEach((button) => { if (button.textContent !== 'About') button.textContent = 'About'; });
  room.querySelectorAll('.song-room-mobile-nav [data-song-room-mode="reveals"]').forEach((button) => { if (button.textContent !== 'Extra') button.textContent = 'Extra'; });
  const modeLabel = document.getElementById('songRoomModeLabel');
  const nextLabel = ({ story: 'About', lyrics: 'Lyrics', credits: 'Credits', reveals: 'Extra', queue: 'Up next', room: 'Now playing' })[room.dataset.mode] || 'About';
  if (modeLabel && modeLabel.textContent !== nextLabel) modeLabel.textContent = nextLabel;
}

function ensureDiscoverySurface() {
  if (document.body.dataset.view !== 'discover') return;
  const surface = document.getElementById('viewSurface');
  if (!surface || surface.querySelector('[data-rondo-discovery]')) return;
  currentScreen === 'genre' ? renderGenre(selectedGenre) : renderExplore();
}

function scheduleSync() {
  const choice = document.getElementById('discoveryChoice');
  if (document.body.dataset.view !== 'discover' && choice && !choice.hidden) closeChooser({ restoreFocus: false });
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => {
    renderQueued = false;
    ensureDiscoverySurface();
    syncSongRoomVibe();
    const onboarding = document.getElementById('onboardingOverlay');
    if (!initialPromptShown && document.body.dataset.view === 'discover' && (!onboarding || onboarding.hidden) && !appModalVisible()) {
      initialPromptShown = true;
      openChooser(document.querySelector('.rail-button[data-view="discover"]'));
    }
  });
}

ensureStyles();
renderChooser();

const observer = new MutationObserver(scheduleSync);
observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-view', 'data-mode', 'src', 'hidden'] });

document.addEventListener('click', (event) => {
  const leavingNav = event.target.closest('.rail-button[data-view]:not([data-view="discover"]), .mobile-nav-button[data-mobile-view]:not([data-mobile-view="discover"])');
  if (leavingNav) closeChooser({ restoreFocus: false });
  const discoverNav = event.target.closest('.rail-button[data-view="discover"], .mobile-nav-button[data-mobile-view="discover"], .rail-logo, .wordmark, [data-return-discover]');
  if (discoverNav) {
    setTimeout(() => {
      ensureDiscoverySurface();
      openChooser(discoverNav);
    }, 0);
  }
}, true);

document.addEventListener('click', (event) => {
  const target = event.target;
  if (target.id === 'discoveryChoice') {
    closeChooser();
    return;
  }
  const genreChoice = target.closest('[data-choice-genre]');
  if (genreChoice) {
    selectedGenre = genreChoice.dataset.choiceGenre;
    syncChoice();
    return;
  }
  if (target.closest('[data-listen-genre]')) {
    closeChooser({ restoreFocus: false });
    renderGenre(selectedGenre);
    return;
  }
  if (target.closest('[data-choose-explore]')) {
    closeChooser({ restoreFocus: false });
    renderExplore();
    document.getElementById('viewSurface')?.scrollTo({ top: 0 });
    return;
  }
  if (target.closest('[data-close-discovery]')) {
    closeChooser();
    return;
  }
  if (target.closest('[data-open-discovery-picker]')) {
    openChooser(target.closest('button'));
    return;
  }
  const genre = target.closest('[data-explore-genre]');
  if (genre) {
    renderGenre(genre.dataset.exploreGenre);
    document.getElementById('viewSurface')?.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const track = target.closest('[data-explore-track]');
  if (track) playEntry(byId.get(track.dataset.exploreTrack));
});

document.addEventListener('input', (event) => {
  if (event.target.matches('[data-music-search]')) renderSearchResults(event.target.value);
  if (event.target.matches('[data-genre-search]')) {
    const query = event.target.value.trim().toLowerCase();
    const list = document.querySelector('[data-genre-song-list]');
    const songs = entriesForGenre(selectedGenre).filter(({ artist, release, track }) => [track.title, artist.name, release.title, track.style].join(' ').toLowerCase().includes(query));
    if (list) list.innerHTML = songs.length ? songs.map(songRow).join('') : '<p class="genre-empty">No songs found.</p>';
  }
});

document.addEventListener('keydown', (event) => {
  const overlay = document.getElementById('discoveryChoice');
  if (!overlay || overlay.hidden) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    closeChooser();
    return;
  }
  if (event.key !== 'Tab') return;
  const focusable = [...overlay.querySelectorAll('button:not(:disabled), input:not(:disabled)')].filter((element) => element.offsetParent !== null);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});

scheduleSync();
