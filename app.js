const covers = {
  night: 'assets/covers/night-transit.svg',
  ring: 'assets/covers/continuum.svg',
  blue: 'assets/covers/blue-hour.svg',
  red: 'assets/covers/afterimage.svg'
};

const genreCatalog = {
  hiphop: {
    index: '01', top: 'HIP', bottom: 'HOP', full: 'HIP-HOP / RAP', short: 'Hip-Hop', initial: 'H',
    description: 'Not one sound. A family tree shaped by region, rhythm, production, and voice.',
    filters: [
      { key: 'all', label: 'All styles' }, { key: 'trap', label: 'Trap' },
      { key: 'alternative', label: 'Alternative' }, { key: 'drill', label: 'Drill' },
      { key: 'jazz', label: 'Jazz rap' }, { key: 'experimental', label: 'Experimental' }
    ],
    tracks: [
      { id: '001', title: 'Night Transit', artist: 'Kairo Vale', features: ['Mira Son'], album: 'Blacktop Studies', year: '2026', duration: '3:42', seconds: 222, genre: 'Hip-Hop/Rap', styles: ['Psychedelic trap', 'Southern hip-hop'], group: 'trap', explicit: true, cover: covers.night, label: 'Rookhouse Records', bpm: 142, key: 'F minor', writers: ['Kairo Vale', 'Mira Son', 'J. Okoye'], producers: ['Duskline', 'M. East'], isrc: 'QZRND2600101' },
      { id: '002', title: 'Blue Hour', artist: 'Sora K', features: [], album: 'No Fixed Address', year: '2026', duration: '2:58', seconds: 178, genre: 'Hip-Hop/Rap', styles: ['Cloud rap', 'Ambient trap'], group: 'trap', explicit: false, cover: covers.blue, label: 'North Window', bpm: 128, key: 'C minor', writers: ['Sora K', 'Elian Moss'], producers: ['Elian Moss'], isrc: 'QZRND2600102' },
      { id: '003', title: 'Open Circuit', artist: 'Moni Gray', features: ['Theo June'], album: 'Margins', year: '2025', duration: '4:06', seconds: 246, genre: 'Hip-Hop/Rap', styles: ['Jazz rap', 'Abstract hip-hop'], group: 'jazz', explicit: false, cover: covers.ring, label: 'Parcel 12', bpm: 91, key: 'D minor', writers: ['Moni Gray', 'Theo June'], producers: ['Rin Okada', 'Moni Gray'], isrc: 'QZRND2500103' },
      { id: '004', title: 'Afterimage', artist: 'Vale & Lio', features: [], album: 'Soft Collision', year: '2026', duration: '3:19', seconds: 199, genre: 'Hip-Hop/Rap', styles: ['Experimental hip-hop', 'Industrial rap'], group: 'experimental', explicit: true, cover: covers.red, label: 'Signal House', bpm: 136, key: 'G minor', writers: ['N. Vale', 'Lio Mercer'], producers: ['Vale & Lio'], isrc: 'QZRND2600104' },
      { id: '005', title: 'No Static', artist: 'June Aster', features: ['Rook'], album: 'Southbound', year: '2026', duration: '2:46', seconds: 166, genre: 'Hip-Hop/Rap', styles: ['UK drill', 'Grime'], group: 'drill', explicit: true, cover: covers.night, label: 'Lowline', bpm: 144, key: 'A♭ minor', writers: ['June Aster', 'Rook'], producers: ['Kestrel'], isrc: 'QZRND2600105' },
      { id: '006', title: 'Common Thread', artist: 'Nia Vale', features: [], album: 'Elsewhere, Again', year: '2025', duration: '3:31', seconds: 211, genre: 'Hip-Hop/Rap', styles: ['Alternative hip-hop', 'Neo-soul rap'], group: 'alternative', explicit: false, cover: covers.blue, label: 'Soft Focus', bpm: 98, key: 'E minor', writers: ['Nia Vale'], producers: ['Ari North', 'Nia Vale'], isrc: 'QZRND2500106' }
    ]
  },
  rnb: {
    index: '02', top: 'R&B', bottom: 'SOUL', full: 'R&B / SOUL', short: 'R&B', initial: 'R',
    description: 'A continuum of voice, groove, intimacy, and experimentation—from quiet storm to left-field soul.',
    filters: [
      { key: 'all', label: 'All styles' }, { key: 'alternative', label: 'Alternative R&B' },
      { key: 'neo', label: 'Neo-soul' }, { key: 'quiet', label: 'Quiet storm' }, { key: 'electronic', label: 'Electronic soul' }
    ],
    tracks: [
      { id: '101', title: 'Continuum', artist: 'Asha North', features: ['Daye'], album: 'Silver Weather', year: '2026', duration: '3:48', seconds: 228, genre: 'R&B/Soul', styles: ['Alternative R&B', 'Neo-soul'], group: 'alternative', explicit: false, cover: covers.ring, label: 'Kite String', bpm: 82, key: 'B minor', writers: ['Asha North', 'Daye Cole'], producers: ['Asha North', 'L. Penn'], isrc: 'QZRND2601101' },
      { id: '102', title: 'Low Light', artist: 'Mira Son', features: [], album: 'Rooms I Remember', year: '2025', duration: '4:11', seconds: 251, genre: 'R&B/Soul', styles: ['Quiet storm', 'Contemporary soul'], group: 'quiet', explicit: false, cover: covers.red, label: 'Rookhouse Records', bpm: 72, key: 'D major', writers: ['Mira Son'], producers: ['Duskline'], isrc: 'QZRND2501102' },
      { id: '103', title: 'Soft Focus', artist: 'Inez Rowe', features: ['Malik Moss'], album: 'Soft Focus', year: '2026', duration: '3:25', seconds: 205, genre: 'R&B/Soul', styles: ['Neo-soul', 'Jazz soul'], group: 'neo', explicit: false, cover: covers.blue, label: 'Window Seat', bpm: 88, key: 'E♭ major', writers: ['Inez Rowe', 'Malik Moss'], producers: ['Inez Rowe'], isrc: 'QZRND2601103' },
      { id: '104', title: 'Second Skin', artist: 'Nilo Grey', features: [], album: 'Current', year: '2026', duration: '3:06', seconds: 186, genre: 'R&B/Soul', styles: ['Electronic soul', 'Future R&B'], group: 'electronic', explicit: true, cover: covers.night, label: 'Current Works', bpm: 104, key: 'F♯ minor', writers: ['Nilo Grey', 'M. Aran'], producers: ['M. Aran'], isrc: 'QZRND2601104' }
    ]
  },
  electronic: {
    index: '03', top: 'ELEC', bottom: 'TRONIC', full: 'ELECTRONIC', short: 'Electronic', initial: 'E',
    description: 'Machines with fingerprints: club systems, ambient space, broken rhythm, and new forms in motion.',
    filters: [
      { key: 'all', label: 'All styles' }, { key: 'house', label: 'House' },
      { key: 'techno', label: 'Techno' }, { key: 'ambient', label: 'Ambient' }, { key: 'breaks', label: 'Breaks' }
    ],
    tracks: [
      { id: '201', title: 'Open Channel', artist: 'Mote', features: [], album: 'Carrier Signal', year: '2026', duration: '5:12', seconds: 312, genre: 'Electronic', styles: ['Minimal house', 'Microhouse'], group: 'house', explicit: false, cover: covers.ring, label: 'Phase Index', bpm: 124, key: 'A minor', writers: ['Mote'], producers: ['Mote'], isrc: 'QZRND2602201' },
      { id: '202', title: 'Red Shift', artist: 'Orra', features: ['Venn'], album: 'No Horizon', year: '2025', duration: '6:04', seconds: 364, genre: 'Electronic', styles: ['Hypnotic techno', 'Dub techno'], group: 'techno', explicit: false, cover: covers.red, label: 'Phase Index', bpm: 132, key: 'C minor', writers: ['Orra', 'Venn'], producers: ['Orra'], isrc: 'QZRND2502202' },
      { id: '203', title: 'Long Field', artist: 'Eli Moss', features: [], album: 'Long Field', year: '2026', duration: '7:21', seconds: 441, genre: 'Electronic', styles: ['Ambient', 'Drone'], group: 'ambient', explicit: false, cover: covers.blue, label: 'North Window', bpm: 68, key: 'D major', writers: ['Eli Moss'], producers: ['Eli Moss'], isrc: 'QZRND2602203' },
      { id: '204', title: 'Cut Glass', artist: 'Parcel', features: [], album: 'Fault Line', year: '2026', duration: '4:39', seconds: 279, genre: 'Electronic', styles: ['UK bass', 'Breakbeat'], group: 'breaks', explicit: false, cover: covers.night, label: 'Lowline', bpm: 138, key: 'G minor', writers: ['Parcel'], producers: ['Parcel'], isrc: 'QZRND2602204' }
    ]
  },
  jazz: {
    index: '04', top: 'JAZZ', bottom: 'NOW', full: 'JAZZ', short: 'Jazz', initial: 'J',
    description: 'A living language of improvisation, swing, harmony, and conversation—never fixed in one decade.',
    filters: [
      { key: 'all', label: 'All styles' }, { key: 'spiritual', label: 'Spiritual jazz' },
      { key: 'fusion', label: 'Fusion' }, { key: 'bebop', label: 'Post-bop' }, { key: 'vocal', label: 'Vocal jazz' }
    ],
    tracks: [
      { id: '301', title: 'First Light, Again', artist: 'Theo June Quartet', features: [], album: 'First Light', year: '2026', duration: '6:18', seconds: 378, genre: 'Jazz', styles: ['Spiritual jazz', 'Modal jazz'], group: 'spiritual', explicit: false, cover: covers.blue, label: 'Parcel 12', bpm: 108, key: 'D Dorian', writers: ['Theo June'], producers: ['Rin Okada'], isrc: 'QZRND2603301' },
      { id: '302', title: 'Chrome Orchard', artist: 'Rin Okada', features: ['Mote'], album: 'New Grammar', year: '2025', duration: '5:42', seconds: 342, genre: 'Jazz', styles: ['Jazz fusion', 'Nu jazz'], group: 'fusion', explicit: false, cover: covers.ring, label: 'Open Form', bpm: 116, key: 'E minor', writers: ['Rin Okada', 'Mote'], producers: ['Rin Okada'], isrc: 'QZRND2503302' },
      { id: '303', title: 'Side Street', artist: 'Mara Bell Trio', features: [], album: 'Side Street', year: '2026', duration: '4:57', seconds: 297, genre: 'Jazz', styles: ['Post-bop', 'Contemporary jazz'], group: 'bebop', explicit: false, cover: covers.night, label: 'Open Form', bpm: 156, key: 'B♭ major', writers: ['Mara Bell'], producers: ['Theo June'], isrc: 'QZRND2603303' },
      { id: '304', title: 'Almost Home', artist: 'Lena Rowe', features: [], album: 'The Nearness', year: '2026', duration: '3:54', seconds: 234, genre: 'Jazz', styles: ['Vocal jazz', 'Torch song'], group: 'vocal', explicit: false, cover: covers.red, label: 'Soft Focus', bpm: 76, key: 'F major', writers: ['Lena Rowe'], producers: ['Mara Bell'], isrc: 'QZRND2603304' }
    ]
  },
  rock: {
    index: '05', top: 'ROCK', bottom: 'ROLL', full: 'ROCK', short: 'Rock', initial: 'R',
    description: 'Guitars are only the beginning: noise, melody, rhythm, distortion, and scenes built from the ground up.',
    filters: [
      { key: 'all', label: 'All styles' }, { key: 'indie', label: 'Indie rock' },
      { key: 'postpunk', label: 'Post-punk' }, { key: 'psych', label: 'Psychedelic' }, { key: 'noise', label: 'Noise rock' }
    ],
    tracks: [
      { id: '401', title: 'Concrete Bloom', artist: 'Static Field', features: [], album: 'Concrete Bloom', year: '2026', duration: '3:37', seconds: 217, genre: 'Rock', styles: ['Indie rock', 'Dream pop'], group: 'indie', explicit: false, cover: covers.blue, label: 'South Window', bpm: 118, key: 'A major', writers: ['Static Field'], producers: ['L. Penn'], isrc: 'QZRND2604401' },
      { id: '402', title: 'Exit Pattern', artist: 'The Measures', features: [], album: 'Exit Pattern', year: '2025', duration: '3:11', seconds: 191, genre: 'Rock', styles: ['Post-punk', 'Art rock'], group: 'postpunk', explicit: false, cover: covers.night, label: 'Lowline', bpm: 146, key: 'E minor', writers: ['The Measures'], producers: ['The Measures', 'M. East'], isrc: 'QZRND2504402' },
      { id: '403', title: 'Sun Engine', artist: 'Morrow Vale', features: ['Nia Aster'], album: 'Sun Engine', year: '2026', duration: '5:08', seconds: 308, genre: 'Rock', styles: ['Psychedelic rock', 'Space rock'], group: 'psych', explicit: false, cover: covers.ring, label: 'Rookhouse Records', bpm: 96, key: 'G major', writers: ['Morrow Vale', 'Nia Aster'], producers: ['Duskline'], isrc: 'QZRND2604403' },
      { id: '404', title: 'Red Weather', artist: 'Soft Collision', features: [], album: 'Red Weather', year: '2026', duration: '4:02', seconds: 242, genre: 'Rock', styles: ['Noise rock', 'Post-hardcore'], group: 'noise', explicit: true, cover: covers.red, label: 'Signal House', bpm: 152, key: 'C♯ minor', writers: ['Soft Collision'], producers: ['Vale & Lio'], isrc: 'QZRND2604404' }
    ]
  }
};

const heartPath = '<path d="M20.8 4.8a5.4 5.4 0 0 0-7.7 0L12 5.9l-1.1-1.1a5.4 5.4 0 0 0-7.7 7.7l1.1 1.1L12 21l7.7-7.4 1.1-1.1a5.4 5.4 0 0 0 0-7.7Z"/>';
const playPath = '<path d="M8 5v14l11-7z"/>';
const pausePath = '<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>';
const $ = (id) => document.getElementById(id);
const elements = {
  select: $('genreSelect'), breadcrumb: $('breadcrumbGenre'), genreIndex: $('genreIndex'), top: $('genreTop'), bottom: $('genreBottom'),
  description: $('genreDescription'), inside: $('insideGenre'), orbitInitial: $('orbitInitial'), mapCount: $('mapCount'), sectionNote: $('sectionNote'),
  filterRow: $('filterRow'), rows: $('trackRows'), nowNumber: $('nowNumber'), nowCover: $('nowCover'), coverIndex: $('coverIndex'), nowAlbumTop: $('nowAlbumTop'),
  nowTitle: $('nowTitle'), nowArtist: $('nowArtist'), featureWrap: $('featureWrap'), nowFeature: $('nowFeature'), mainHeart: $('mainHeart'), styleTags: $('styleTags'),
  metaRelease: $('metaRelease'), metaLabel: $('metaLabel'), metaTempo: $('metaTempo'), writers: $('writers'), producers: $('producers'), isrc: $('isrc'),
  creditsButton: $('creditsButton'), creditsDrawer: $('creditsDrawer'), mainPlay: $('mainPlay'), previous: $('previousButton'), next: $('nextButton'),
  barCover: $('barCover'), barTitle: $('barTitle'), barArtist: $('barArtist'), barPlay: $('barPlay'), barPrevious: $('barPrevious'), barNext: $('barNext'),
  shuffle: $('shuffleButton'), loop: $('loopButton'), elapsed: $('elapsed'), remaining: $('remaining'), timeline: $('timeline'), timelineFill: $('timelineFill'),
  timelineKnob: $('timelineKnob'), playSpectrum: $('playSpectrum'), searchButton: $('searchButton'), searchOverlay: $('searchOverlay'), closeSearch: $('closeSearch'),
  searchInput: $('searchInput'), toast: $('toast')
};
const state = { genreKey: 'hiphop', filter: 'all', selectedIndex: 0, playing: false, progress: 43, loop: 'off', saved: new Set(), timer: null };

function escapeHtml(value = '') { return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]); }
function currentGenre() { return genreCatalog[state.genreKey]; }
function currentTrack() { return currentGenre().tracks[state.selectedIndex]; }
function artistCredit(track) { return track.features.length ? `${track.artist} feat. ${track.features.join(', ')}` : track.artist; }
function formatTime(value) { const seconds = Math.max(0, Math.round(value)); return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`; }
function showToast(message) { elements.toast.textContent = message; elements.toast.classList.add('show'); clearTimeout(showToast.timeout); showToast.timeout = setTimeout(() => elements.toast.classList.remove('show'), 1800); }

function renderFilters() {
  const genre = currentGenre();
  elements.filterRow.innerHTML = genre.filters.map((filter) => {
    const count = filter.key === 'all' ? genre.tracks.length : genre.tracks.filter((track) => track.group === filter.key).length;
    return `<button class="filter-chip ${state.filter === filter.key ? 'active' : ''}" type="button" data-filter="${filter.key}" aria-pressed="${state.filter === filter.key}">${escapeHtml(filter.label)} <span>${String(count).padStart(2, '0')}</span></button>`;
  }).join('');
  elements.filterRow.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => setFilter(button.dataset.filter)));
  const orbitNodes = document.querySelectorAll('.orbit-node');
  orbitNodes.forEach((node, index) => {
    const filter = genre.filters[index] || genre.filters[0];
    node.dataset.filter = filter.key;
    node.querySelector('span').textContent = filter.label.replace('Alternative R&B', 'ALT').replace('All styles', 'ALL').toUpperCase();
    node.classList.toggle('active', state.filter === filter.key);
  });
}
function visibleTracks() { return currentGenre().tracks.map((track, index) => ({ track, index })).filter(({ track }) => state.filter === 'all' || track.group === state.filter); }
function renderRows() {
  const rows = visibleTracks();
  if (!rows.length) { elements.rows.innerHTML = '<p class="empty-filter">No sample track is assigned to this style yet.</p>'; return; }
  elements.rows.innerHTML = rows.map(({ track, index }) => {
    const saved = state.saved.has(`${state.genreKey}:${track.id}`);
    return `<div class="track-row ${index === state.selectedIndex ? 'active' : ''}" role="row" tabindex="0" data-index="${index}" aria-label="Select ${escapeHtml(track.title)} by ${escapeHtml(track.artist)}">
      <div class="track-cell-main" role="cell"><span class="track-number">${String(index + 1).padStart(2, '0')}</span><img class="row-cover" src="${track.cover}" alt="" /><span class="track-copy"><strong class="track-title">${escapeHtml(track.title)}${track.explicit ? ' <sup>E</sup>' : ''}</strong><span class="track-artist">${escapeHtml(track.artist)}${track.features.length ? ` <span class="track-feature">feat. ${escapeHtml(track.features.join(', '))}</span>` : ''}</span></span></div>
      <div class="track-style" role="cell"><strong>${escapeHtml(track.styles[0])}</strong>${escapeHtml(track.styles[1] || track.genre)}</div>
      <div class="track-release" role="cell">${escapeHtml(track.album)} · ${track.year}</div>
      <div class="track-end" role="cell"><span class="track-time">${track.duration}</span><button class="row-heart ${saved ? 'saved' : ''}" type="button" data-heart="${index}" aria-label="${saved ? 'Remove' : 'Save'} ${escapeHtml(track.title)}" aria-pressed="${saved}"><svg viewBox="0 0 24 24" fill="${saved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" aria-hidden="true">${heartPath}</svg></button></div>
    </div>`;
  }).join('');
  elements.rows.querySelectorAll('.track-row').forEach((row) => {
    row.addEventListener('click', (event) => { const heart = event.target.closest('[data-heart]'); if (heart) { event.stopPropagation(); toggleSaved(Number(heart.dataset.heart)); return; } selectTrack(Number(row.dataset.index)); });
    row.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectTrack(Number(row.dataset.index)); } });
  });
}
function selectTrack(index, shouldPlay = false) {
  const tracks = currentGenre().tracks;
  state.selectedIndex = (index + tracks.length) % tracks.length;
  state.progress = 0;
  const track = currentTrack();
  elements.nowNumber.textContent = String(state.selectedIndex + 1).padStart(2, '0'); elements.nowCover.src = track.cover; elements.nowCover.alt = `${track.title} cover artwork`;
  elements.coverIndex.textContent = `R / ${track.id}`; elements.nowAlbumTop.textContent = track.album.toUpperCase(); elements.nowTitle.textContent = track.title;
  elements.nowArtist.textContent = track.artist; elements.nowFeature.textContent = track.features.join(', '); elements.featureWrap.style.display = track.features.length ? '' : 'none';
  elements.styleTags.innerHTML = track.styles.map((style) => `<span>${escapeHtml(style)}</span>`).join(''); elements.metaRelease.textContent = `${track.album} · ${track.year}`;
  elements.metaLabel.textContent = track.label; elements.metaTempo.textContent = `${track.bpm} BPM · ${track.key}`; elements.writers.textContent = track.writers.join(', ');
  elements.producers.textContent = track.producers.join(', '); elements.isrc.textContent = track.isrc; elements.barCover.src = track.cover; elements.barTitle.textContent = track.title;
  elements.barArtist.textContent = artistCredit(track); elements.mainHeart.setAttribute('aria-label', `Save ${track.title}`); elements.creditsDrawer.hidden = true;
  elements.creditsButton.querySelector('span').textContent = '+'; updateSavedUI(); updateTimeline(); renderRows(); if (shouldPlay) setPlaying(true);
}
function setGenre(key) {
  state.genreKey = key; state.filter = 'all'; state.selectedIndex = 0; state.progress = 0;
  const genre = currentGenre();
  elements.breadcrumb.textContent = genre.full; elements.genreIndex.textContent = `GENRE ${genre.index} / 18`; elements.top.textContent = genre.top; elements.bottom.textContent = genre.bottom;
  elements.description.textContent = genre.description; elements.inside.textContent = genre.short; elements.orbitInitial.textContent = genre.initial; elements.mapCount.textContent = String(genre.tracks.length).padStart(2, '0');
  elements.sectionNote.innerHTML = `${genre.tracks.length} artists. ${genre.filters.length - 1} different edges.<br/>One track from each voice.`;
  renderFilters(); selectTrack(0, state.playing); showToast(`${genre.short} spectrum loaded`);
}
function setFilter(filter) { state.filter = filter; renderFilters(); renderRows(); const visible = visibleTracks(); if (visible.length && !visible.some(({ index }) => index === state.selectedIndex)) selectTrack(visible[0].index, state.playing); }
function updateSavedUI() {
  const key = `${state.genreKey}:${currentTrack().id}`; const saved = state.saved.has(key);
  elements.mainHeart.classList.toggle('saved', saved); elements.mainHeart.setAttribute('aria-pressed', String(saved)); elements.mainHeart.setAttribute('aria-label', `${saved ? 'Remove' : 'Save'} ${currentTrack().title}`);
  const svg = elements.mainHeart.querySelector('svg'); if (svg) svg.setAttribute('fill', saved ? 'currentColor' : 'none');
}
function toggleSaved(index = state.selectedIndex) {
  const track = currentGenre().tracks[index]; const key = `${state.genreKey}:${track.id}`;
  if (state.saved.has(key)) { state.saved.delete(key); showToast('Removed from your library'); } else { state.saved.add(key); showToast('Saved to your library'); }
  updateSavedUI(); renderRows();
}
function setPlaying(playing) {
  state.playing = playing; document.body.classList.toggle('is-playing', playing);
  [elements.mainPlay, elements.barPlay].forEach((button) => button.setAttribute('aria-label', playing ? 'Pause' : 'Play'));
  document.querySelectorAll('.main-play-icon, .bar-play-icon').forEach((icon) => { icon.innerHTML = playing ? pausePath : playPath; });
  clearInterval(state.timer);
  if (playing) state.timer = setInterval(() => {
    const track = currentTrack(); state.progress += 0.5;
    if (state.progress >= track.seconds) {
      if (state.loop === 'one') state.progress = 0;
      else if (state.selectedIndex < currentGenre().tracks.length - 1 || state.loop === 'all') selectTrack(state.selectedIndex + 1, true);
      else setPlaying(false);
    }
    updateTimeline();
  }, 500);
}
function togglePlaying() { setPlaying(!state.playing); }
function updateTimeline() { const track = currentTrack(); const ratio = Math.min(1, state.progress / track.seconds); const percentage = `${ratio * 100}%`; elements.timelineFill.style.width = percentage; elements.timelineKnob.style.left = percentage; elements.elapsed.textContent = formatTime(state.progress); elements.remaining.textContent = `−${formatTime(track.seconds - state.progress)}`; }
function changeTrack(delta) { selectTrack(state.selectedIndex + delta, state.playing); }
function cycleLoop() { state.loop = state.loop === 'off' ? 'all' : state.loop === 'all' ? 'one' : 'off'; elements.loop.dataset.mode = state.loop; elements.loop.classList.toggle('active', state.loop !== 'off'); elements.loop.setAttribute('aria-label', `Loop ${state.loop}`); showToast(`Loop ${state.loop}`); }
function openSearch() { elements.searchOverlay.hidden = false; requestAnimationFrame(() => elements.searchInput.focus()); }
function closeSearch() { elements.searchOverlay.hidden = true; elements.searchInput.value = ''; }
function bindEvents() {
  elements.select.addEventListener('change', () => setGenre(elements.select.value)); elements.mainHeart.addEventListener('click', () => toggleSaved());
  elements.mainPlay.addEventListener('click', togglePlaying); elements.barPlay.addEventListener('click', togglePlaying); elements.previous.addEventListener('click', () => changeTrack(-1));
  elements.barPrevious.addEventListener('click', () => changeTrack(-1)); elements.next.addEventListener('click', () => changeTrack(1)); elements.barNext.addEventListener('click', () => changeTrack(1));
  elements.playSpectrum.addEventListener('click', () => setPlaying(true));
  elements.shuffle.addEventListener('click', () => { elements.shuffle.classList.toggle('active'); const next = Math.floor(Math.random() * currentGenre().tracks.length); selectTrack(next === state.selectedIndex ? next + 1 : next, state.playing); showToast('Spectrum shuffled'); });
  elements.loop.addEventListener('click', cycleLoop);
  elements.timeline.addEventListener('click', (event) => { const rect = elements.timeline.getBoundingClientRect(); state.progress = currentTrack().seconds * Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)); updateTimeline(); });
  elements.creditsButton.addEventListener('click', () => { elements.creditsDrawer.hidden = !elements.creditsDrawer.hidden; elements.creditsButton.querySelector('span').textContent = elements.creditsDrawer.hidden ? '+' : '−'; });
  $('lineageButton').addEventListener('click', () => showToast('Lineage view is planned for the next design pass'));
  elements.searchButton.addEventListener('click', openSearch); elements.closeSearch.addEventListener('click', closeSearch); elements.searchOverlay.addEventListener('click', (event) => { if (event.target === elements.searchOverlay) closeSearch(); });
  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && elements.searchOverlay.hidden && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) { event.preventDefault(); openSearch(); }
    if (event.key === 'Escape' && !elements.searchOverlay.hidden) closeSearch();
    if (event.code === 'Space' && document.activeElement === document.body) { event.preventDefault(); togglePlaying(); }
  });
  document.querySelectorAll('.orbit-node').forEach((node) => node.addEventListener('click', () => setFilter(node.dataset.filter)));
  document.querySelectorAll('.rail-link').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('.rail-link').forEach((item) => { item.classList.remove('active'); item.removeAttribute('aria-current'); });
    button.classList.add('active'); button.setAttribute('aria-current', 'page'); if (button.dataset.view !== 'discover') showToast(`${button.querySelector('span').textContent} is part of the next product screen set`);
  }));
}
bindEvents(); renderFilters(); selectTrack(0); state.progress = 43; updateTimeline();
