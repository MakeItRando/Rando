import { artists, genres, onboardingArtists, onboardingGenres } from './data/catalog.js';
import { artistProgress, findTrackContext, flattenCatalog, getArtist, getGenre, listArtistsForGenre, listReleases, nextArtistFor } from './services/journey.js';
import { createStore } from './state/store.js';

const icon = {
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.8 4.8a5.4 5.4 0 0 0-7.7 0L12 5.9l-1.1-1.1a5.4 5.4 0 0 0-7.7 7.7l1.1 1.1L12 21l7.7-7.4 1.1-1.1a5.4 5.4 0 0 0 0-7.7Z"/></svg>',
  play: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 4.5v11l9-5.5z"/></svg>',
  pause: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M5 4h3.5v12H5zm6.5 0H15v12h-3.5z"/></svg>'
};

const store = createStore({
  genreId: 'hiphop', artistId: 'kairo-vale', catalogMode: 'matching', trackId: 'k101',
  isPlaying: false, currentSeconds: 43, repeatMode: 'continue', activeTab: 'details', view: 'discover',
  savedTracks: new Set(), savedReleases: new Set(), savedArtists: new Set(), playedTracks: new Set()
});

['savedTracks', 'savedReleases', 'savedArtists', 'playedTracks'].forEach((key) => {
  const current = store.get()[key];
  if (!(current instanceof Set)) store.set({ [key]: new Set(current || []) });
});

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const pad = (value) => String(value).padStart(2, '0');
const state = () => store.get();
let playbackTimer;
let onboardingStep = 0;
let onboardingDraft = { displayName: 'M', email: '', genres: ['Hip-Hop', 'R&B', 'Electronic'], artists: ['kairo-vale', 'mira-son'], discovery: 64, popularity: 42, albums: 78 };

const getContext = () => findTrackContext(state().trackId) || findTrackContext('k101');
const currentGenre = () => getGenre(state().genreId);
const currentArtist = () => getArtist(state().artistId);
const currentQueue = () => flattenCatalog(currentArtist(), state().genreId, state().catalogMode);

function cloneSet(key) { return new Set(state()[key]); }
function toggleSaved(key, id) {
  const next = cloneSet(key);
  next.has(id) ? next.delete(id) : next.add(id);
  store.set({ [key]: next }, { persist: true });
  return next.has(id);
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 1700);
}

function renderDirectory() {
  const genre = currentGenre();
  const eligible = listArtistsForGenre(genre.id);
  $('#genreSelect').innerHTML = genres.map((item) => `<option value="${item.id}" ${item.id === genre.id ? 'selected' : ''}>${item.name}</option>`).join('');
  $('#artistCount').textContent = `${pad(eligible.length)} ${eligible.length === 1 ? 'artist' : 'artists'}`;
  const filter = $('#artistFilter').value.trim().toLowerCase();
  const filtered = eligible.filter((artist) => `${artist.name} ${artist.tags.join(' ')}`.toLowerCase().includes(filter));
  const available = new Set(eligible.map((artist) => artist.sortName[0].toUpperCase()));
  $('#alphabet').innerHTML = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => `<button type="button" data-letter="${letter}" ${available.has(letter) ? '' : 'disabled'} class="${currentArtist().sortName[0] === letter ? 'active' : ''}">${letter}</button>`).join('');
  $('#artistList').innerHTML = filtered.map((artist, index) => `
    <button class="artist-item ${artist.id === state().artistId ? 'active' : ''}" type="button" data-artist="${artist.id}">
      <img src="${artist.image}" alt=""/><span><strong>${artist.name}</strong><small>${artist.tags.join(' · ')}</small></span><b>${pad(eligible.indexOf(artist) + 1)}</b>
    </button>`).join('') || '<p class="empty-message">No artists found.</p>';
}

function renderArtist() {
  const artist = currentArtist();
  const eligible = listArtistsForGenre(state().genreId);
  const position = eligible.findIndex((item) => item.id === artist.id) + 1;
  const totalTracks = artist.releases.reduce((sum, release) => sum + release.tracks.length, 0);
  const progress = artistProgress(artist, state().playedTracks, state().genreId, state().catalogMode);
  $('#artistPortrait').src = artist.image;
  $('#artistPortrait').alt = `Abstract portrait of ${artist.name}`;
  $('#artistPosition').textContent = `ARTIST ${pad(position)} / ${pad(eligible.length)}`;
  $('#artistLetter').textContent = artist.sortName[0].toUpperCase();
  $('#artistName').textContent = artist.name;
  $('#artistOrigin').textContent = artist.origin;
  $('#artistYears').textContent = artist.activeYears;
  $('#artistTags').innerHTML = artist.tags.map((tag) => `<span>${tag}</span>`).join('');
  $('#artistBio').textContent = artist.bio;
  $('#statPosition').textContent = `${pad(position)} / ${pad(eligible.length)}`;
  $('#statReleases').textContent = pad(artist.releases.length);
  $('#statTracks').textContent = pad(totalTracks);
  $('#artistProgressPercent').textContent = `${pad(progress.percentage)}%`;
  $('#artistProgressRing').style.strokeDashoffset = String(616 - 616 * progress.percentage / 100);
  $('#saveArtist').classList.toggle('saved', state().savedArtists.has(artist.id));
  $('#saveArtist').textContent = state().savedArtists.has(artist.id) ? '✓ Artist saved' : '＋ Save artist';
  $('#locationGenre').textContent = currentGenre().name.toUpperCase();
  $('#locationArtist').textContent = artist.name.toUpperCase();
}

function releaseMarkup(release) {
  const saved = state().savedReleases.has(release.id);
  return `<article class="release-block">
    <header class="release-head"><img src="${release.cover}" alt="${release.title} cover"/><div><p>${release.type.toUpperCase()} · ${release.year}</p><h3>${release.title}</h3><span>${release.label} · ${pad(release.tracks.length)} tracks</span></div><button class="release-save ${saved ? 'saved' : ''}" type="button" data-save-release="${release.id}" aria-label="${saved ? 'Remove saved release' : 'Save release'}">${icon.heart}</button></header>
    <div class="track-table"><div class="track-header"><span>#</span><span>TRACK / ALBUM</span><span>STYLE</span><span>TIME</span><span></span></div>
      ${release.tracks.map((track, index) => {
        const active = track.id === state().trackId;
        const savedTrack = state().savedTracks.has(track.id);
        return `<button class="track-row ${active ? 'active' : ''}" type="button" data-track="${track.id}"><span>${pad(index + 1)}</span><span><strong>${track.title}${track.explicit ? ' <sup>E</sup>' : ''}</strong><small>${release.title}${track.features.length ? ` · feat. ${track.features.join(', ')}` : ''}</small></span><span>${track.style}</span><span>${track.duration}</span><span class="row-heart ${savedTrack ? 'saved' : ''}" data-inline-save="${track.id}" aria-label="Save ${track.title}">${icon.heart}</span></button>`;
      }).join('')}
    </div></article>`;
}

function renderCatalog() {
  const artist = currentArtist();
  const releases = listReleases(artist, state().genreId, state().catalogMode);
  const matching = flattenCatalog(artist, state().genreId, 'matching').length;
  const all = flattenCatalog(artist, state().genreId, 'all').length;
  $('#matchingCount').textContent = pad(matching);
  $('#allCount').textContent = pad(all);
  $('#matchingMode').classList.toggle('active', state().catalogMode === 'matching');
  $('#allMode').classList.toggle('active', state().catalogMode === 'all');
  $('#catalogSummary').textContent = state().catalogMode === 'matching'
    ? `Matching ${currentGenre().short} tracks · newest to oldest`
    : `All albums & EPs · newest to oldest`;
  $('#releases').innerHTML = releases.map(releaseMarkup).join('');
  $('#transportMode').textContent = state().catalogMode === 'matching' ? 'MATCHING CATALOG' : 'ALL CATALOG';
}

function detailMarkup(context) {
  const { artist, release, track } = context;
  return `<div class="detail-tags">${track.genres.map((genreId) => `<span>${getGenre(genreId).short}</span>`).join('')}<span>${track.style}</span></div>
    <dl class="details-list"><div><dt>RELEASE</dt><dd>${release.title} · ${release.year}</dd></div><div><dt>TYPE</dt><dd>${release.type} · Track ${pad(release.tracks.findIndex((item) => item.id === track.id) + 1)}</dd></div><div><dt>LABEL</dt><dd>${release.label}</dd></div><div><dt>FEATURED</dt><dd>${track.features.length ? track.features.join(', ') : '—'}</dd></div><div><dt>TEMPO</dt><dd>${track.bpm ? `${track.bpm} BPM` : '—'} · ${track.key || '—'}</dd></div><div><dt>SOURCE</dt><dd>Fictional design catalog</dd></div></dl>`;
}

function lyricsMarkup(track) {
  return `<div class="lyric-preview">${track.lyrics.slice(0, 5).map((line, index) => `<p class="${line.time <= state().currentSeconds && (track.lyrics[index + 1]?.time || Infinity) > state().currentSeconds ? 'current' : ''}">${line.text}</p>`).join('')}</div>`;
}

function creditsMarkup(context) {
  const { track } = context;
  return `<dl class="details-list credits-list"><div><dt>WRITTEN BY</dt><dd>${track.writers.length ? track.writers.join(', ') : 'Artist and collaborators'}</dd></div><div><dt>PRODUCED BY</dt><dd>${track.producers.length ? track.producers.join(', ') : 'Artist production team'}</dd></div><div><dt>PERFORMED BY</dt><dd>${[context.artist.name, ...track.features].join(', ')}</dd></div><div><dt>ISRC</dt><dd>${track.isrc}</dd></div><div><dt>RIGHTS</dt><dd>Fictional demo recording</dd></div></dl>`;
}

function formatTime(seconds) {
  const safe = Math.max(0, Math.round(seconds));
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`;
}

function renderNowPlaying() {
  const context = getContext();
  const { artist, release, track } = context;
  const queue = currentQueue();
  const queueIndex = Math.max(0, queue.findIndex((item) => item.id === track.id));
  const featured = track.features.length ? ` featuring ${track.features.join(', ')}` : '';
  const shortFeatured = track.features.length ? ` feat. ${track.features.join(', ')}` : '';
  const progress = Math.min(1, state().currentSeconds / track.durationSeconds);
  $('#nowIndex').textContent = pad(queueIndex + 1);
  $('#nowCover').src = release.cover; $('#nowCover').alt = `${track.title} cover`;
  $('#nowReleaseTop').textContent = `${release.title.toUpperCase()} · ${release.year}`;
  $('#nowTitle').textContent = track.title; $('#nowArtist').textContent = artist.name + featured;
  $('#barCover').src = release.cover; $('#barTitle').textContent = track.title; $('#barArtist').textContent = artist.name + shortFeatured;
  $('#saveTrack').classList.toggle('saved', state().savedTracks.has(track.id));
  const panel = state().activeTab === 'details' ? detailMarkup(context) : state().activeTab === 'lyrics' ? lyricsMarkup(track) : creditsMarkup(context);
  $('#inspectorPanel').innerHTML = panel;
  $$('.inspector-tabs button').forEach((button) => { const active = button.dataset.tab === state().activeTab; button.classList.toggle('active', active); button.setAttribute('aria-selected', String(active)); });
  $('#elapsed').textContent = formatTime(state().currentSeconds);
  $('#remaining').textContent = `−${formatTime(track.durationSeconds - state().currentSeconds)}`;
  $('#timelineFill').style.width = `${progress * 100}%`; $('#timelineKnob').style.left = `${progress * 100}%`;
  $('#transportPlayIcon').innerHTML = state().isPlaying ? '<path d="M6 5h4v14H6zm8 0h4v14h-4z"/>' : '<path d="M8 5v14l11-7z"/>';
  document.body.classList.toggle('is-playing', state().isPlaying);
  $('#repeatMode').dataset.repeat = state().repeatMode;
  $('#repeatBadge').textContent = state().repeatMode === 'continue' ? '' : state().repeatMode === 'track' ? '1' : 'A';
  $('#repeatMode').setAttribute('aria-label', state().repeatMode === 'continue' ? 'Continue mode' : state().repeatMode === 'track' ? 'Repeat track' : 'Repeat artist');
  renderFullPlayer(context, progress);
}

function renderFullPlayer(context, progress) {
  const { artist, release, track } = context;
  $('#fullCover').src = release.cover; $('#fullTitle').textContent = track.title;
  $('#fullRelease').textContent = `${release.title.toUpperCase()} · ${release.year}`;
  $('#fullArtist').textContent = artist.name + (track.features.length ? ` featuring ${track.features.join(', ')}` : '');
  $('#fullTags').innerHTML = [...track.genres.map((id) => getGenre(id).short), track.style].map((tag) => `<span>${tag}</span>`).join('');
  $('#fullTimelineFill').style.width = `${progress * 100}%`;
  $('#fullElapsed').textContent = formatTime(state().currentSeconds); $('#fullRemaining').textContent = `−${formatTime(track.durationSeconds - state().currentSeconds)}`;
  $('#fullPlay').textContent = state().isPlaying ? 'Ⅱ' : '▶'; $('#fullSave').textContent = state().savedTracks.has(track.id) ? '♥' : '♡';
  $('#fullLyricsLines').innerHTML = track.lyrics.map((line, index) => `<button type="button" data-lyric-index="${index}" data-time="${line.time}" class="${line.time <= state().currentSeconds && (track.lyrics[index + 1]?.time || Infinity) > state().currentSeconds ? 'active' : ''}">${line.text}</button>`).join('');
}

function renderAll() {
  if (state().view !== 'discover') return renderView();
  $('#journey').hidden = false; $('#directory').hidden = false; $('.inspector').hidden = false; $('#viewSurface')?.remove();
  renderDirectory(); renderArtist(); renderCatalog(); renderNowPlaying();
}

function setArtist(artistId, options = {}) {
  const artist = getArtist(artistId);
  const queue = flattenCatalog(artist, state().genreId, state().catalogMode);
  const trackId = queue[0]?.id || artist.releases[0]?.tracks[0]?.id;
  store.set({ artistId, trackId, currentSeconds: 0, isPlaying: Boolean(options.play), activeTab: 'details' });
  renderAll();
  $('#directory').classList.remove('open');
  if (options.play) startTimer();
}

function setGenre(genreId) {
  const artist = listArtistsForGenre(genreId)[0];
  store.set({ genreId, artistId: artist.id, trackId: flattenCatalog(artist, genreId, 'matching')[0]?.id, catalogMode: 'matching', currentSeconds: 0, isPlaying: false });
  renderAll();
}

function setTrack(trackId, play = true) {
  const context = findTrackContext(trackId);
  if (!context) return;
  const played = cloneSet('playedTracks'); played.add(trackId);
  store.set({ trackId, artistId: context.artist.id, currentSeconds: 0, isPlaying: play, playedTracks: played }, { persist: true });
  renderAll(); if (play) startTimer();
}

function togglePlayback() {
  store.set({ isPlaying: !state().isPlaying }); renderNowPlaying();
  state().isPlaying ? startTimer() : stopTimer();
}

function startTimer() {
  stopTimer();
  if (!state().isPlaying) return;
  playbackTimer = setInterval(() => {
    const context = getContext();
    const next = state().currentSeconds + 1;
    if (next >= context.track.durationSeconds) advanceTrack(1);
    else { store.set({ currentSeconds: next }); renderNowPlaying(); }
  }, 1000);
}
function stopTimer() { clearInterval(playbackTimer); }

function advanceTrack(direction = 1) {
  if (state().repeatMode === 'track' && direction === 1) { store.set({ currentSeconds: 0 }); renderNowPlaying(); return; }
  const queue = currentQueue();
  let index = queue.findIndex((track) => track.id === state().trackId);
  if (index < 0) index = 0;
  const nextIndex = index + direction;
  if (nextIndex >= 0 && nextIndex < queue.length) { setTrack(queue[nextIndex].id, state().isPlaying); return; }
  if (direction < 0) { setTrack(queue[queue.length - 1].id, state().isPlaying); return; }
  if (state().repeatMode === 'artist') { setTrack(queue[0].id, state().isPlaying); return; }
  openCompletion(); stopTimer(); store.set({ isPlaying: false }); renderNowPlaying();
}

function cycleRepeat() {
  const sequence = ['continue', 'track', 'artist'];
  const next = sequence[(sequence.indexOf(state().repeatMode) + 1) % sequence.length];
  store.set({ repeatMode: next }); renderNowPlaying(); showToast(next === 'continue' ? 'Continue after this track' : next === 'track' ? 'Repeating this track' : 'Repeating this artist');
}

function openFullPlayer() { $('#fullPlayer').hidden = false; document.body.classList.add('modal-open'); renderNowPlaying(); }
function closeFullPlayer() { $('#fullPlayer').hidden = true; document.body.classList.remove('modal-open'); }
function openOverlay(id) { $(id).hidden = false; document.body.classList.add('modal-open'); }
function closeOverlay(id) { $(id).hidden = true; if ($('#fullPlayer').hidden && $$('.overlay:not([hidden])').length === 0) document.body.classList.remove('modal-open'); }

function openCompletion() {
  const artist = currentArtist(); const progress = artistProgress(artist, state().playedTracks, state().genreId, state().catalogMode); const next = nextArtistFor(artist.id, state().genreId);
  $('#completionTitle').textContent = `You reached the end of ${artist.name}.`;
  $('#completionHeard').textContent = pad(progress.played); $('#completionSaved').textContent = pad(flattenCatalog(artist, state().genreId, 'all').filter((track) => state().savedTracks.has(track.id)).length); $('#completionReleases').textContent = pad(artist.releases.length);
  $('#nextArtistImage').src = next.image; $('#nextArtistName').textContent = next.name; $('#nextArtistTags').textContent = next.tags.join(' · ');
  $('#continueArtist').dataset.artist = next.id;
  openOverlay('#completionOverlay');
}

function search(query) {
  const term = query.trim().toLowerCase();
  if (!term) { $('#searchResults').innerHTML = '<span>START ANYWHERE</span><p>Search across artists, albums, tracks, and genres.</p>'; return; }
  const matches = [];
  genres.forEach((genre) => { if (`${genre.name} ${genre.description}`.toLowerCase().includes(term)) matches.push({ type: 'genre', id: genre.id, title: genre.name, meta: genre.description }); });
  artists.forEach((artist) => {
    if (`${artist.name} ${artist.tags.join(' ')} ${artist.bio}`.toLowerCase().includes(term)) matches.push({ type: 'artist', id: artist.id, title: artist.name, meta: artist.tags.join(' · '), image: artist.image });
    artist.releases.forEach((release) => {
      if (`${release.title} ${release.type} ${release.label}`.toLowerCase().includes(term)) matches.push({ type: 'release', id: release.id, title: release.title, meta: `${artist.name} · ${release.type}, ${release.year}`, image: release.cover, artistId: artist.id });
      release.tracks.forEach((track) => { if (`${track.title} ${track.style} ${track.features.join(' ')}`.toLowerCase().includes(term)) matches.push({ type: 'track', id: track.id, title: track.title, meta: `${artist.name} · ${release.title}`, image: release.cover, artistId: artist.id }); });
    });
  });
  $('#searchResults').innerHTML = matches.slice(0, 8).map((result) => `<button type="button" data-result-type="${result.type}" data-result-id="${result.id}" data-result-artist="${result.artistId || ''}">${result.image ? `<img src="${result.image}" alt=""/>` : '<span class="result-mark">R</span>'}<span><strong>${result.title}</strong><small>${result.meta}</small></span><b>${result.type.toUpperCase()}</b></button>`).join('') || '<span>NO RESULTS</span><p>Try another artist, album, track, or genre.</p>';
}

function renderView() {
  $('#journey').hidden = true; $('#directory').hidden = true; $('.inspector').hidden = true;
  let surface = $('#viewSurface'); if (!surface) { surface = document.createElement('main'); surface.id = 'viewSurface'; surface.className = 'view-surface'; $('.workspace').append(surface); }
  surface.hidden = false;
  const view = state().view;
  if (view === 'library') {
    const savedTracks = artists.flatMap((artist) => artist.releases.flatMap((release) => release.tracks.filter((track) => state().savedTracks.has(track.id)).map((track) => ({ track, artist, release }))));
    surface.innerHTML = `<div class="view-header"><p class="section-index">YOUR COLLECTION</p><h1>Library</h1><p>Artists, releases, and tracks saved inside Rondo.</p></div><div class="library-stats"><div><strong>${pad(state().savedArtists.size)}</strong><span>ARTISTS</span></div><div><strong>${pad(state().savedReleases.size)}</strong><span>RELEASES</span></div><div><strong>${pad(state().savedTracks.size)}</strong><span>TRACKS</span></div></div><section class="saved-list"><h2>Saved tracks</h2>${savedTracks.length ? savedTracks.map(({ track, artist, release }) => `<button type="button" data-open-track="${track.id}"><img src="${release.cover}" alt=""/><span><strong>${track.title}</strong><small>${artist.name} · ${release.title}</small></span><b>${track.duration}</b></button>`).join('') : '<p>Nothing saved yet. Heart a track to build your library.</p>'}</section>`;
  } else if (view === 'journeys') {
    surface.innerHTML = `<div class="view-header"><p class="section-index">KEEP YOUR PLACE</p><h1>Journeys</h1><p>Resume a genre exactly where you left it.</p></div><div class="journey-cards">${genres.map((genre) => { const eligible = listArtistsForGenre(genre.id); const first = eligible[0]; return `<button type="button" data-resume-genre="${genre.id}"><span>${genre.index}</span><strong>${genre.name}</strong><p>${eligible.length} artists · alphabetical path</p><i>RESUME WITH ${first.name.toUpperCase()} →</i></button>`; }).join('')}</div>`;
  } else {
    const profile = state().profile;
    surface.innerHTML = `<div class="view-header"><p class="section-index">TASTE PROFILE</p><h1>${profile.displayName || 'Your Rondo'}</h1><p>Your required onboarding turns listening preferences into a starting point, not a permanent box.</p></div><section class="profile-grid"><div><span>GENRES</span>${profile.genres.map((id) => `<strong>${getGenre(id).name}</strong>`).join('')}</div><div><span>SEED ARTISTS</span>${profile.seedArtists.map((id) => `<strong>${getArtist(id).name}</strong>`).join('')}</div><div><span>DISCOVERY</span><strong>${profile.discovery}% adventurous</strong></div></section><button class="primary-action" id="editProfile" type="button">Edit music taste</button>`;
  }
}

function setView(view) {
  store.set({ view });
  $$('.rail-button').forEach((button) => { const active = button.dataset.view === view; button.classList.toggle('active', active); button.toggleAttribute('aria-current', active); });
  if (view === 'discover') renderAll(); else renderView();
}

const onboardingSteps = [
  () => `<div class="onboarding-fields"><label><span>DISPLAY NAME</span><input id="setupName" value="${onboardingDraft.displayName}" maxlength="24"/></label><label><span>EMAIL</span><input id="setupEmail" value="${onboardingDraft.email}" placeholder="you@example.com" type="email"/></label></div>`,
  () => `<div class="choice-grid genre-choices">${onboardingGenres.map((name) => `<button type="button" class="${onboardingDraft.genres.includes(name) ? 'selected' : ''}" data-genre-choice="${name}"><span>${String(onboardingGenres.indexOf(name) + 1).padStart(2, '0')}</span><strong>${name}</strong><i>${onboardingDraft.genres.includes(name) ? '✓' : '+'}</i></button>`).join('')}</div>`,
  () => `<div class="choice-grid artist-choices">${onboardingArtists.map((artist) => `<button type="button" class="${onboardingDraft.artists.includes(artist.id) ? 'selected' : ''}" data-artist-choice="${artist.id}"><img src="${artist.image}" alt=""/><span><strong>${artist.name}</strong><small>${artist.tags[0]}</small></span><i>${onboardingDraft.artists.includes(artist.id) ? '✓' : '+'}</i></button>`).join('')}</div>`,
  () => `<div class="taste-sliders"><label><span><strong>DISCOVERY</strong><small>Familiar <b>${onboardingDraft.discovery}%</b> Adventurous</small></span><input data-slider="discovery" type="range" min="0" max="100" value="${onboardingDraft.discovery}"/></label><label><span><strong>ARTIST POPULARITY</strong><small>Emerging <b>${onboardingDraft.popularity}%</b> Established</small></span><input data-slider="popularity" type="range" min="0" max="100" value="${onboardingDraft.popularity}"/></label><label><span><strong>ALBUM FOCUS</strong><small>Highlights <b>${onboardingDraft.albums}%</b> Deep cuts</small></span><input data-slider="albums" type="range" min="0" max="100" value="${onboardingDraft.albums}"/></label></div>`
];
const onboardingCopy = [
  ['CREATE YOUR RONDO', 'A profile that belongs to you.', 'This prototype keeps your setup locally. Production will use a secure Rondo account.'],
  ['YOUR TASTE / 01', 'Which worlds do you return to?', 'Choose at least three. This shapes your first genre journeys.'],
  ['YOUR TASTE / 02', 'Name a few starting points.', 'Choose artists you already understand. Rondo uses them as a bridge to somewhere new.'],
  ['YOUR TASTE / 03', 'How should discovery feel?', 'Set the balance. These are preferences, not hard filters.']
];
function renderOnboarding() {
  const copy = onboardingCopy[onboardingStep];
  $('#onboardingProgress').textContent = `${pad(onboardingStep + 1)} / 04`; $('#onboardingEyebrow').textContent = copy[0]; $('#onboardingTitle').textContent = copy[1]; $('#onboardingDescription').textContent = copy[2]; $('#onboardingStep').innerHTML = onboardingSteps[onboardingStep]();
  $('#onboardingBack').disabled = onboardingStep === 0; $('#onboardingNext').innerHTML = onboardingStep === 3 ? 'Create my Rondo <span>→</span>' : 'Continue <span>→</span>';
}
function openOnboarding() { onboardingStep = 0; renderOnboarding(); openOverlay('#onboardingOverlay'); }
function onboardingNext() {
  if (onboardingStep === 0) { onboardingDraft.displayName = $('#setupName').value.trim() || 'Listener'; onboardingDraft.email = $('#setupEmail').value.trim(); }
  if (onboardingStep === 1 && onboardingDraft.genres.length < 3) return showToast('Choose at least three genres');
  if (onboardingStep === 2 && onboardingDraft.artists.length < 2) return showToast('Choose at least two artists');
  if (onboardingStep < 3) { onboardingStep += 1; renderOnboarding(); return; }
  const genreMap = { 'Hip-Hop': 'hiphop', 'R&B': 'rnb', Electronic: 'electronic', Jazz: 'jazz' };
  store.set({ onboardingComplete: true, profile: { displayName: onboardingDraft.displayName, genres: onboardingDraft.genres.map((name) => genreMap[name] || name.toLowerCase()), seedArtists: onboardingDraft.artists, discovery: onboardingDraft.discovery } }, { persist: true });
  $('#profileTrigger').textContent = onboardingDraft.displayName.charAt(0).toUpperCase(); closeOverlay('#onboardingOverlay'); showToast('Your Rondo is ready');
}

function bindEvents() {
  $('#genreSelect').addEventListener('change', (event) => setGenre(event.target.value));
  $('#artistFilter').addEventListener('input', renderDirectory);
  $('#artistList').addEventListener('click', (event) => { const button = event.target.closest('[data-artist]'); if (button) setArtist(button.dataset.artist); });
  $('#alphabet').addEventListener('click', (event) => { const button = event.target.closest('[data-letter]'); if (!button) return; const artist = listArtistsForGenre(state().genreId).find((item) => item.sortName.startsWith(button.dataset.letter)); if (artist) setArtist(artist.id); });
  $('#matchingMode').addEventListener('click', () => { store.set({ catalogMode: 'matching' }); const queue = flattenCatalog(currentArtist(), state().genreId, 'matching'); if (!queue.some((track) => track.id === state().trackId)) store.set({ trackId: queue[0]?.id, currentSeconds: 0 }); renderAll(); });
  $('#allMode').addEventListener('click', () => { store.set({ catalogMode: 'all' }); renderAll(); });
  $('#releases').addEventListener('click', (event) => {
    const saveRelease = event.target.closest('[data-save-release]'); const inline = event.target.closest('[data-inline-save]'); const row = event.target.closest('[data-track]');
    if (saveRelease) { const saved = toggleSaved('savedReleases', saveRelease.dataset.saveRelease); renderCatalog(); showToast(saved ? 'Release saved' : 'Release removed'); return; }
    if (inline) { event.stopPropagation(); const saved = toggleSaved('savedTracks', inline.dataset.inlineSave); renderAll(); showToast(saved ? 'Track saved' : 'Track removed'); return; }
    if (row) setTrack(row.dataset.track);
  });
  $('#playArtist').addEventListener('click', () => setArtist(state().artistId, { play: true }));
  $('#saveArtist').addEventListener('click', () => { const saved = toggleSaved('savedArtists', state().artistId); renderArtist(); showToast(saved ? 'Artist saved' : 'Artist removed'); });
  $('#skipArtist').addEventListener('click', () => setArtist(nextArtistFor(state().artistId, state().genreId).id));
  $('#previewCompletion').addEventListener('click', openCompletion);
  $('#transportPlay').addEventListener('click', togglePlayback); $('#fullPlay').addEventListener('click', togglePlayback);
  $('#previousTrack').addEventListener('click', () => advanceTrack(-1)); $('#nextTrack').addEventListener('click', () => advanceTrack(1)); $('#fullPrevious').addEventListener('click', () => advanceTrack(-1)); $('#fullNext').addEventListener('click', () => advanceTrack(1));
  $('#repeatMode').addEventListener('click', cycleRepeat);
  $('#timeline').addEventListener('click', (event) => { const rect = event.currentTarget.getBoundingClientRect(); const seconds = getContext().track.durationSeconds * (event.clientX - rect.left) / rect.width; store.set({ currentSeconds: seconds }); renderNowPlaying(); });
  $('#saveTrack').addEventListener('click', () => { const saved = toggleSaved('savedTracks', state().trackId); renderAll(); showToast(saved ? 'Track saved to Rondo' : 'Track removed'); });
  $('#fullSave').addEventListener('click', () => { toggleSaved('savedTracks', state().trackId); renderAll(); });
  $$('.inspector-tabs button').forEach((button) => button.addEventListener('click', () => { store.set({ activeTab: button.dataset.tab }); renderNowPlaying(); }));
  $('#openFullPlayer').addEventListener('click', openFullPlayer); $('#lyricsCta').addEventListener('click', openFullPlayer); $('#mobileTrack').addEventListener('click', openFullPlayer); $('#closeFullPlayer').addEventListener('click', closeFullPlayer);
  $('#fullLyricsLines').addEventListener('click', (event) => { const line = event.target.closest('[data-time]'); if (!line) return; store.set({ currentSeconds: Number(line.dataset.time), isPlaying: true }); renderNowPlaying(); startTimer(); });
  $('#mobileDirectoryButton').addEventListener('click', () => $('#directory').classList.add('open')); $('#closeDirectory').addEventListener('click', () => $('#directory').classList.remove('open'));
  $('#searchTrigger').addEventListener('click', () => { openOverlay('#searchOverlay'); setTimeout(() => $('#globalSearch').focus(), 20); });
  $('#closeSearch').addEventListener('click', () => closeOverlay('#searchOverlay')); $('#globalSearch').addEventListener('input', (event) => search(event.target.value));
  $('#searchResults').addEventListener('click', (event) => { const button = event.target.closest('[data-result-type]'); if (!button) return; const { resultType: type, resultId: id, resultArtist: artistId } = button.dataset; closeOverlay('#searchOverlay'); if (type === 'genre') setGenre(id); else if (type === 'artist') { const artist = getArtist(id); setGenre(artist.genreIds[0]); setArtist(id); } else { const context = findTrackContext(id) || findTrackContext(getArtist(artistId).releases[0].tracks[0].id); if (context) { setGenre(context.artist.genreIds[0]); setTrack(type === 'track' ? id : context.release.tracks[0].id); } } });
  $('#profileTrigger').addEventListener('click', openOnboarding); $('#closeOnboarding').addEventListener('click', () => closeOverlay('#onboardingOverlay')); $('#onboardingNext').addEventListener('click', onboardingNext); $('#onboardingBack').addEventListener('click', () => { if (onboardingStep > 0) { onboardingStep -= 1; renderOnboarding(); } });
  $('#onboardingStep').addEventListener('click', (event) => { const genre = event.target.closest('[data-genre-choice]'); const artist = event.target.closest('[data-artist-choice]'); if (genre) { const name = genre.dataset.genreChoice; onboardingDraft.genres = onboardingDraft.genres.includes(name) ? onboardingDraft.genres.filter((item) => item !== name) : [...onboardingDraft.genres, name]; renderOnboarding(); } if (artist) { const id = artist.dataset.artistChoice; onboardingDraft.artists = onboardingDraft.artists.includes(id) ? onboardingDraft.artists.filter((item) => item !== id) : [...onboardingDraft.artists, id]; renderOnboarding(); } });
  $('#onboardingStep').addEventListener('input', (event) => { const slider = event.target.closest('[data-slider]'); if (slider) { onboardingDraft[slider.dataset.slider] = Number(slider.value); renderOnboarding(); } });
  $('#closeCompletion').addEventListener('click', () => closeOverlay('#completionOverlay')); $('#stopJourney').addEventListener('click', () => closeOverlay('#completionOverlay')); $('#replayArtist').addEventListener('click', () => { closeOverlay('#completionOverlay'); setArtist(state().artistId, { play: true }); }); $('#continueArtist').addEventListener('click', (event) => { closeOverlay('#completionOverlay'); setArtist(event.currentTarget.dataset.artist, { play: true }); });
  $$('.rail-button').forEach((button) => button.addEventListener('click', () => setView(button.dataset.view)));
  $('.wordmark').addEventListener('click', (event) => { event.preventDefault(); setView('discover'); });
  document.addEventListener('click', (event) => { const openTrack = event.target.closest('[data-open-track]'); const resume = event.target.closest('[data-resume-genre]'); if (openTrack) { setView('discover'); setTrack(openTrack.dataset.openTrack); } if (resume) { setView('discover'); setGenre(resume.dataset.resumeGenre); } if (event.target.id === 'editProfile') openOnboarding(); });
  document.addEventListener('keydown', (event) => {
    const inputActive = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
    if (event.key === '/' && !inputActive) { event.preventDefault(); $('#searchTrigger').click(); }
    if (event.code === 'Space' && !inputActive && $$('.overlay:not([hidden])').length === 0) { event.preventDefault(); togglePlayback(); }
    if (event.key === 'Escape') { if (!$('#fullPlayer').hidden) closeFullPlayer(); else $$('.overlay:not([hidden])').forEach((overlay) => closeOverlay(`#${overlay.id}`)); }
  });
}

bindEvents();
renderAll();
const params = new URLSearchParams(window.location.search);
const previewMode = document.body.dataset.preview || (params.has('onboarding') ? 'onboarding' : params.get('screen'));
if (previewMode === 'onboarding') openOnboarding();
if (previewMode === 'lyrics') openFullPlayer();
if (previewMode === 'completion') openCompletion();
