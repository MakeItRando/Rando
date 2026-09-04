const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[character]);

const pad = (value) => String(value).padStart(2, '0');
const percentage = (value, fallback) => Math.min(100, Math.max(0, Number(value ?? fallback) || 0));

function viewHeader(eyebrow, title, summary) {
  return `<header class="view-surface-head"><div><p class="section-index">${escapeHtml(eyebrow)}</p><h1>${escapeHtml(title)}</h1></div><p>${escapeHtml(summary)}</p></header>`;
}

export function renderLibraryView({ savedArtists, savedReleaseContexts, savedTrackContexts }) {
  const hasItems = savedArtists.length + savedReleaseContexts.length + savedTrackContexts.length > 0;
  const cards = [
    ...savedArtists.map((artist) => `<article class="view-card"><img src="${artist.image}" alt=""/><span>SAVED ARTIST</span><h3>${escapeHtml(artist.name)}</h3><p>${escapeHtml(artist.tags.join(' · '))}</p><button type="button" data-open-artist="${artist.id}">Open artist</button></article>`),
    ...savedReleaseContexts.map(({ artist, release }) => `<article class="view-card"><img src="${release.cover}" alt=""/><span>SAVED ${escapeHtml(release.type.toUpperCase())}</span><h3>${escapeHtml(release.title)}</h3><p>${escapeHtml(artist.name)} · ${release.year}</p><button type="button" data-open-release="${release.id}">Open release</button></article>`),
    ...savedTrackContexts.map(({ artist, release, track }) => `<article class="view-card"><img src="${release.cover}" alt=""/><span>SAVED TRACK</span><h3>${escapeHtml(track.title)}</h3><p>${escapeHtml(artist.name)} · ${escapeHtml(release.title)}</p><button type="button" data-open-track="${track.id}">Play track</button></article>`)
  ].join('');
  const empty = `<section class="empty-library"><div class="empty-library-orbit" aria-hidden="true"></div><div class="empty-library-copy"><span>EMPTY LIBRARY</span><h2>Keep the music that stays with you.</h2><p>Save complete artist chapters, individual albums and EPs, or the tracks you want to hear again. Your progress remains separate, so a save never interrupts the journey.</p><button class="primary-action" type="button" data-return-discover>Start discovering</button></div><ol class="empty-library-features"><li><span>01</span><div><strong>Artists</strong><p>Return to a full catalog chapter.</p></div></li><li><span>02</span><div><strong>Albums & EPs</strong><p>Keep a release without losing its context.</p></div></li><li><span>03</span><div><strong>Tracks</strong><p>Collect exact songs, credits, and details.</p></div></li></ol></section>`;
  return `${viewHeader('YOUR RONDO', 'Library', `${pad(savedArtists.length)} artists · ${pad(savedReleaseContexts.length)} releases · ${pad(savedTrackContexts.length)} tracks`)}<div class="view-grid${hasItems ? '' : ' view-grid-empty'}">${hasItems ? cards : empty}</div>`;
}

export function renderJourneysView({ genre, artist, progress }) {
  return `${viewHeader('LISTENING PROGRESS', 'Journeys', 'Resume where you stopped')}<div class="view-grid"><article class="view-card"><img src="${artist.image}" alt=""/><span>${escapeHtml(genre.name.toUpperCase())}</span><h3>${escapeHtml(artist.name)}</h3><p>${progress.played} of ${progress.total} matching tracks heard · ${progress.percentage}% complete</p><button type="button" data-return-discover>Resume journey</button></article><article class="view-card"><span>NEXT JOURNEY</span><h3>R&B / Soul</h3><p>Continue with Asha North and albums ordered newest to oldest.</p><button type="button" data-genre="rnb">Open R&B</button></article></div>`;
}

export function renderProfileView({ profile, tasteGenres, seedArtists }) {
  const discovery = percentage(profile.discovery, 64);
  const popularity = percentage(profile.popularity, 45);
  const albumFocus = percentage(profile.albumFocus, 78);
  const displayName = profile.displayName || 'M';
  const accountNote = profile.email || 'Account details stay local in this prototype.';
  const metrics = [
    { label: 'DISCOVERY', value: discovery, description: discovery >= 60 ? 'Leans toward unfamiliar artists.' : 'Leans toward familiar starting points.' },
    { label: 'POPULARITY MIX', value: popularity, description: popularity >= 60 ? 'More established names in the mix.' : 'Balances emerging and established artists.' },
    { label: 'ALBUM FOCUS', value: albumFocus, description: albumFocus >= 60 ? 'Prioritizes complete release context.' : 'Moves more quickly between tracks.' }
  ];
  const seedMarkup = seedArtists.length
    ? seedArtists.map((artist) => `<article class="profile-seed"><img src="${artist.image}" alt=""/><div><span>SEED ARTIST</span><strong>${escapeHtml(artist.name)}</strong><small>${escapeHtml(artist.tags.join(' · '))}</small></div></article>`).join('')
    : '<p class="profile-seed-empty">Choose at least two artists to shape your starting points.</p>';
  return `${viewHeader('RONDO ACCOUNT', 'Profile', 'Taste profile · editable anytime')}<section class="profile-summary"><div class="profile-avatar-large">${escapeHtml(displayName.charAt(0).toUpperCase())}</div><div class="profile-details"><h2>${escapeHtml(displayName)}</h2><p>Your explicit choices shape starting points and highlights. Alphabetical artist order remains stable.</p><p class="profile-account">${escapeHtml(accountNote)}</p><div class="profile-tags">${tasteGenres.map((genre) => `<span>${escapeHtml(genre)}</span>`).join('')}</div><button class="primary-action" type="button" data-edit-profile>Edit taste profile</button></div></section><section class="profile-metrics" aria-label="Taste controls">${metrics.map((metric) => `<article class="profile-metric"><span>${metric.label}</span><strong>${pad(metric.value)}%</strong><p>${escapeHtml(metric.description)}</p><div class="metric-track" aria-hidden="true"><i style="width:${metric.value}%"></i></div></article>`).join('')}</section><section class="profile-seeds"><header><div><span>STARTING POINTS</span><h3>Seed artists</h3></div><p>${pad(seedArtists.length)} selected</p></header><div class="profile-seed-list">${seedMarkup}</div></section>`;
}
