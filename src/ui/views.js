const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[character]);

const pad = (value) => String(value).padStart(2, '0');
const percentage = (value, fallback) => Math.min(100, Math.max(0, Number(value ?? fallback) || 0));
const formatTime = (value) => `${Math.floor(Math.max(0, value) / 60)}:${String(Math.floor(Math.max(0, value)) % 60).padStart(2, '0')}`;

function viewHeader(eyebrow, title, summary) {
  return `<header class="view-surface-head"><div><p class="section-index">${escapeHtml(eyebrow)}</p><h1>${escapeHtml(title)}</h1></div><p>${escapeHtml(summary)}</p></header>`;
}

function playbackLabel({ active, playing, heard, noun = 'song' }) {
  if (active && playing) return `Pause ${noun}`;
  if (active && heard) return `Resume ${noun}`;
  return `Play ${noun}`;
}

export function renderDiscoverView({ hero, chapters, genres, connections, unlockedArtifacts = [], playedTracks = [], activeTrackId = '', playing = false }) {
  const unlocked = new Set(unlockedArtifacts);
  const heard = new Set(playedTracks);
  const heroLabel = playbackLabel({ active: activeTrackId === hero.track.id, playing, heard: heard.has(hero.track.id), noun: 'this door' });
  const chapterMarkup = chapters.map(({ artist, release, lore }, index) => {
    const revealOpen = unlocked.has(release.id);
    return `<button class="discover-chapter" type="button" data-open-release="${escapeHtml(release.id)}" style="--chapter-order:${index}">
      <span class="discover-chapter-art"><img src="${escapeHtml(release.cover)}" alt=""/><i>${pad(index + 1)}</i></span>
      <span class="discover-chapter-copy"><small>${escapeHtml(lore.index)}</small><strong>${escapeHtml(release.title)}</strong><span>${escapeHtml(artist.name)} · ${release.year}</span><em>${escapeHtml(lore.hook)}</em></span>
      <span class="discover-chapter-status">${revealOpen ? 'REVEAL OPEN' : `${pad(release.tracks.length)} TRACKS`} <b>↗</b></span>
    </button>`;
  }).join('');
  const genreMarkup = genres.map((genre, index) => `<button class="discover-scene" type="button" data-genre="${escapeHtml(genre.id)}" style="--scene-index:${index}"><span>${escapeHtml(genre.index)}</span><strong>${escapeHtml(genre.name)}</strong><p>${escapeHtml(genre.description)}</p><small>${pad(genre.artistCount)} artists · Enter journey <b>→</b></small></button>`).join('');
  const connectionMarkup = connections.map(({ connection, left, right }) => `<article class="discover-connection"><button type="button" data-discover-track="${escapeHtml(left.track.id)}" aria-label="Play ${escapeHtml(left.track.title)}"><img src="${escapeHtml(left.release.cover)}" alt=""/></button><i aria-hidden="true"></i><button type="button" data-discover-track="${escapeHtml(right.track.id)}" aria-label="Play ${escapeHtml(right.track.title)}"><img src="${escapeHtml(right.release.cover)}" alt=""/></button><div><span>${escapeHtml(connection.label)}</span><h3>${escapeHtml(connection.title)}</h3><p>${escapeHtml(connection.body)}</p></div></article>`).join('');
  const revealCount = chapters.filter(({ release }) => unlocked.has(release.id)).length;
  const nextReveal = chapters.find(({ release }) => !unlocked.has(release.id)) || chapters[0];

  return `<div class="discover-page">
    <header class="discover-heading"><div><p class="section-index">DISCOVER / RONDO EDITION 01</p><h1>Find a door,<br/>not a feed.</h1></div><p>One strong entrance. A few paths worth following. No infinite wall of almost-interesting songs.</p></header>
    <section class="discover-hero" aria-labelledby="discoverHeroTitle">
      <div class="discover-hero-signal"><span>${escapeHtml(hero.door.eyebrow)}</span><b>01</b></div>
      <div class="discover-hero-copy"><p>${escapeHtml(hero.artist.name)} · ${escapeHtml(hero.release.title)} · ${hero.release.year}</p><h2 id="discoverHeroTitle">${escapeHtml(hero.track.title)}</h2><blockquote>${escapeHtml(hero.door.hook)}</blockquote><div class="discover-hero-actions"><button class="primary-action discover-play" type="button" data-discover-play="${escapeHtml(hero.track.id)}" aria-pressed="${activeTrackId === hero.track.id && playing}">${escapeHtml(heroLabel)} <span>▶</span></button><button class="secondary-action" type="button" data-open-release="${escapeHtml(hero.release.id)}">Open the chapter <span>↗</span></button></div></div>
      <button class="discover-hero-art" type="button" data-open-release="${escapeHtml(hero.release.id)}" aria-label="Open ${escapeHtml(hero.release.title)} chapter"><span></span><img src="${escapeHtml(hero.release.cover)}" alt="${escapeHtml(hero.release.title)} cover"/><i>${escapeHtml(hero.lore.motif)}</i></button>
      <div class="discover-hero-note"><span>WHY THIS DOOR</span><p>${escapeHtml(hero.lore.note)}</p></div>
    </section>

    <section class="discover-section discover-chapters" aria-labelledby="newChaptersTitle"><header><div><span>NEW CHAPTERS</span><h2 id="newChaptersTitle">Records with a world around them.</h2></div><p>Artwork, sequence, context, and one reveal earned by listening.</p></header><div>${chapterMarkup}</div></section>

    <section class="discover-detour"><div><span>CONTROLLED SERENDIPITY</span><h2>Take me somewhere.</h2><p>Rondo chooses one playable door outside the obvious next step. No autoplay maze.</p></div><button type="button" data-surprise-me><span aria-hidden="true">↝</span><strong>Leave the route</strong><small>ONE SONG · NO PREVIEW LIST</small></button></section>

    <section class="discover-section discover-scenes" aria-labelledby="scenesTitle"><header><div><span>FOLLOW A SCENE</span><h2 id="scenesTitle">Genre is a route—not the lobby.</h2></div><p>The original artist-by-artist journeys live here.</p></header><div>${genreMarkup}</div></section>

    <section class="discover-section discover-connections" aria-labelledby="connectionsTitle"><header><div><span>SIGNALS BETWEEN SONGS</span><h2 id="connectionsTitle">Hear the doors between worlds.</h2></div><p>Features, shared players, and recurring ideas become listening paths.</p></header><div>${connectionMarkup}</div></section>

    <section class="discover-reveals"><div class="discover-reveal-count"><span>${pad(revealCount)}</span><small>REVEALS OPEN</small></div><div><span>LISTENING LEAVES A TRACE</span><h2>${revealCount ? 'The world is beginning to answer.' : 'Nothing important is locked.'}</h2><p>${revealCount ? 'Return to an opened release chapter to read what surfaced.' : escapeHtml(nextReveal.lore.artifact.prompt)}</p></div><button type="button" data-open-release="${escapeHtml(nextReveal.release.id)}">${revealCount ? 'View a reveal' : 'Enter the next chapter'} <span>↗</span></button></section>
  </div>`;
}

export function renderReleaseView({ artist, release, lore, isSaved = false, unlocked = false, progress = 0, selectedTrackId = '', playing = false, playedTracks = [] }) {
  const heard = new Set(playedTracks);
  const threshold = lore.artifact.unlockSeconds;
  const progressPercent = Math.min(100, Math.round((Math.min(progress, threshold) / threshold) * 100));
  const releaseActive = release.tracks.some((track) => track.id === selectedTrackId);
  const releaseLabel = playbackLabel({ active: releaseActive, playing, heard: release.tracks.some((track) => heard.has(track.id)), noun: 'chapter' });
  const trackMarkup = release.tracks.map((track, index) => {
    const active = selectedTrackId === track.id;
    const label = playbackLabel({ active, playing, heard: heard.has(track.id), noun: track.title });
    return `<div class="release-page-track ${active ? 'active' : ''}" data-release-page-track="${escapeHtml(track.id)}"><button type="button" data-release-track="${escapeHtml(track.id)}" aria-label="${escapeHtml(label)}" aria-pressed="${active && playing}"><span>${pad(index + 1)}</span><span><strong>${escapeHtml(track.title)}${track.explicit ? ' <sup>E</sup>' : ''}</strong><small>${escapeHtml(track.style)}${track.features.length ? ` · feat. ${escapeHtml(track.features.join(', '))}` : ''}</small></span><time>${escapeHtml(track.duration)}</time><b>${active && playing ? 'Ⅱ' : '▶'}</b></button><button type="button" data-release-song-room="${escapeHtml(track.id)}" aria-label="Open ${escapeHtml(track.title)} Song Room">↗</button></div>`;
  }).join('');
  const revealMarkup = unlocked
    ? `<div class="release-artifact open"><span>REVEAL OPENED</span><h3>${escapeHtml(lore.artifact.title)}</h3><p>${escapeHtml(lore.artifact.body)}</p><small>Opened by listening · kept with this release</small></div>`
    : `<div class="release-artifact locked"><span>REVEAL / ${pad(progressPercent)}%</span><h3>${escapeHtml(lore.artifact.title)}</h3><p>${escapeHtml(lore.artifact.prompt)}</p><div class="release-artifact-progress" aria-label="${progressPercent}% toward reveal"><i style="width:${progressPercent}%"></i></div><small>${Math.max(0, threshold - Math.floor(progress))} listening seconds remain · the music is never locked</small></div>`;

  return `<article class="release-page" style="--release-cover:url('${escapeHtml(release.cover)}')">
    <button class="release-page-back" type="button" data-return-discover>← Back to Discover</button>
    <header class="release-page-hero"><div class="release-page-art"><span aria-hidden="true"></span><img src="${escapeHtml(release.cover)}" alt="${escapeHtml(release.title)} cover"/><small>${escapeHtml(lore.index)}</small></div><div class="release-page-copy"><p>${escapeHtml(release.type.toUpperCase())} · ${release.year} · ${pad(release.tracks.length)} TRACKS</p><h1>${escapeHtml(release.title)}</h1><h2>${escapeHtml(lore.hook)}</h2><p>${escapeHtml(lore.note)}</p><div class="release-page-actions"><button class="primary-action" type="button" data-play-release="${escapeHtml(release.id)}" aria-pressed="${releaseActive && playing}">${escapeHtml(releaseLabel)} <span>▶</span></button><button class="secondary-action ${isSaved ? 'saved' : ''}" type="button" data-save-release="${escapeHtml(release.id)}">${isSaved ? 'Release saved' : 'Save release'}</button></div><dl><div><dt>Artist</dt><dd>${escapeHtml(artist.name)}</dd></div><div><dt>Label</dt><dd>${escapeHtml(release.label)}</dd></div><div><dt>Motif</dt><dd>${escapeHtml(lore.motif)}</dd></div></dl></div></header>
    <section class="release-page-body"><div class="release-sequence"><header><span>THE SEQUENCE</span><h2>Listen in order—or enter anywhere.</h2></header><div>${trackMarkup}</div></div><aside>${revealMarkup}<div class="release-liner"><span>LINER NOTE</span><blockquote>“${escapeHtml(lore.hook)}”</blockquote><p>Fictional Rondo Edition context. Production credits and stories will only come from artists or authorized sources.</p></div></aside></section>
  </article>`;
}

export function renderLibraryView({ savedArtists, savedReleaseContexts, savedTrackContexts, savedMomentContexts = [], songNoteContexts = [] }) {
  const hasItems = savedArtists.length + savedReleaseContexts.length + savedTrackContexts.length + savedMomentContexts.length + songNoteContexts.length > 0;
  const cards = [
    ...savedArtists.map((artist) => `<article class="view-card"><img src="${artist.image}" alt=""/><span>SAVED ARTIST</span><h3>${escapeHtml(artist.name)}</h3><p>${escapeHtml(artist.tags.join(' · '))}</p><button type="button" data-open-artist="${artist.id}">Open artist</button></article>`),
    ...savedReleaseContexts.map(({ artist, release }) => `<article class="view-card"><img src="${release.cover}" alt=""/><span>SAVED ${escapeHtml(release.type.toUpperCase())}</span><h3>${escapeHtml(release.title)}</h3><p>${escapeHtml(artist.name)} · ${release.year}</p><button type="button" data-open-release="${release.id}">Open chapter</button></article>`),
    ...savedTrackContexts.map(({ artist, release, track }) => `<article class="view-card"><img src="${release.cover}" alt=""/><span>SAVED TRACK</span><h3>${escapeHtml(track.title)}</h3><p>${escapeHtml(artist.name)} · ${escapeHtml(release.title)}</p><button type="button" data-open-track="${track.id}">Play track</button></article>`),
    ...savedMomentContexts.map(({ artist, release, track, moment }) => `<article class="view-card view-card-moment"><img src="${release.cover}" alt=""/><span>SAVED MOMENT · ${formatTime(moment.position)}</span><h3>${escapeHtml(track.title)}</h3><p>${escapeHtml(artist.name)} · ${escapeHtml(release.title)}</p><button type="button" data-open-moment="${track.id}" data-position="${moment.position}">Open moment</button></article>`),
    ...songNoteContexts.map(({ artist, release, track, note }) => `<article class="view-card view-card-note"><img src="${release.cover}" alt=""/><span>PRIVATE SONG NOTE</span><h3>${escapeHtml(track.title)}</h3><p>“${escapeHtml(note)}”</p><button type="button" data-open-note="${track.id}">Open Song Room</button></article>`)
  ].join('');
  const empty = `<section class="empty-library"><div class="empty-library-orbit" aria-hidden="true"></div><div class="empty-library-copy"><span>EMPTY LIBRARY</span><h2>Keep what stays.</h2><p>Artists, releases, tracks, moments, notes, and opened reveals—together.</p><button class="primary-action" type="button" data-return-discover>Start discovering</button></div><ol class="empty-library-features"><li><span>01</span><div><strong>Artists</strong><p>Return to the whole chapter.</p></div></li><li><span>02</span><div><strong>Albums & EPs</strong><p>Keep the record intact.</p></div></li><li><span>03</span><div><strong>Moments & reveals</strong><p>Save the second. Remember what surfaced.</p></div></li></ol></section>`;
  return `${viewHeader('YOUR RONDO', 'Library', `${pad(savedArtists.length)} artists · ${pad(savedReleaseContexts.length)} releases · ${pad(savedTrackContexts.length)} tracks · ${pad(savedMomentContexts.length)} moments · ${pad(songNoteContexts.length)} notes`)}<div class="view-grid${hasItems ? '' : ' view-grid-empty'}">${hasItems ? cards : empty}</div>`;
}

export function renderJourneysView({ genre, artist, progress }) {
  return `${viewHeader('LISTENING PROGRESS', 'Journeys', 'Resume where you stopped')}<div class="view-grid"><article class="view-card"><img src="${artist.image}" alt=""/><span>${escapeHtml(genre.name.toUpperCase())}</span><h3>${escapeHtml(artist.name)}</h3><p>${progress.played} of ${progress.total} matching tracks heard · ${progress.percentage}% complete</p><button type="button" data-open-journey>Resume journey</button></article></div>`;
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
  return `${viewHeader('RONDO ACCOUNT', 'Profile', 'Taste profile · editable anytime')}<section class="profile-summary"><div class="profile-avatar-large">${escapeHtml(displayName.charAt(0).toUpperCase())}</div><div class="profile-details"><h2>${escapeHtml(displayName)}</h2><p>Your choices shape discovery. Artist order stays steady.</p><p class="profile-account">${escapeHtml(accountNote)}</p><div class="profile-tags">${tasteGenres.map((genre) => `<span>${escapeHtml(genre)}</span>`).join('')}</div><button class="primary-action" type="button" data-edit-profile>Edit taste profile</button></div></section><section class="profile-metrics" aria-label="Taste controls">${metrics.map((metric) => `<article class="profile-metric"><span>${metric.label}</span><strong>${pad(metric.value)}%</strong><p>${escapeHtml(metric.description)}</p><div class="metric-track" aria-hidden="true"><i style="width:${metric.value}%"></i></div></article>`).join('')}</section><section class="profile-seeds"><header><div><span>STARTING POINTS</span><h3>Seed artists</h3></div><p>${pad(seedArtists.length)} selected</p></header><div class="profile-seed-list">${seedMarkup}</div></section>`;
}
