import assert from 'node:assert/strict';
import { artists, discoveryConnections, discoveryDoors, genres, releaseLore } from '../src/data/catalog.js';
import {
  artistProgress,
  findReleaseContext,
  findTrackContext,
  flattenCatalog,
  listArtistsForGenre,
  listReleases,
  nextArtistFor
} from '../src/services/journey.js';
import { renderDiscoverView, renderLibraryView, renderProfileView, renderReleaseView } from '../src/ui/views.js';

assert.equal(genres.length, 4, 'The prototype should expose four complete genre journeys.');

const artistIds = new Set();
const releaseIds = new Set();
const trackIds = new Set();
const coverPaths = new Set();

for (const artist of artists) {
  assert(!artistIds.has(artist.id), `Duplicate artist id: ${artist.id}`);
  artistIds.add(artist.id);
  const releases = listReleases(artist, artist.genreIds[0], 'all');
  const dates = releases.map((release) => release.date);
  assert.deepEqual(dates, [...dates].sort().reverse(), `${artist.name} releases should be newest first.`);

  for (const release of artist.releases) {
    assert(!releaseIds.has(release.id), `Duplicate release id: ${release.id}`);
    releaseIds.add(release.id);
    assert(releaseLore[release.id], `Release lore missing for ${release.id}.`);
    assert(releaseLore[release.id].hook && releaseLore[release.id].note && releaseLore[release.id].motif, `Release identity incomplete for ${release.id}.`);
    assert(releaseLore[release.id].artifact?.unlockSeconds >= 8 && releaseLore[release.id].artifact?.unlockSeconds <= 16, `Reveal threshold should fit the authorized demo for ${release.id}.`);
    assert(!coverPaths.has(release.cover), `Release artwork reused by ${release.id}.`);
    coverPaths.add(release.cover);
    assert.equal(findReleaseContext(release.id)?.artist.id, artist.id, `Release context failed for ${release.id}.`);
    for (const track of release.tracks) {
      assert(!trackIds.has(track.id), `Duplicate track id: ${track.id}`);
      trackIds.add(track.id);
      const context = findTrackContext(track.id);
      assert.equal(context?.artist.id, artist.id, `Track artist context failed for ${track.id}.`);
      assert.equal(context?.release.id, release.id, `Track release context failed for ${track.id}.`);
    }
  }
}

for (const genre of genres) {
  const eligible = listArtistsForGenre(genre.id);
  assert(eligible.length > 0, `${genre.name} should have at least one artist.`);
  assert.deepEqual(eligible.map((artist) => artist.sortName), eligible.map((artist) => artist.sortName).sort(), `${genre.name} artists should be alphabetical.`);
  for (const artist of eligible) {
    const matching = flattenCatalog(artist, genre.id, 'matching');
    const full = flattenCatalog(artist, genre.id, 'all');
    assert(matching.length > 0, `${artist.name} should have matching tracks for ${genre.name}.`);
    assert(full.length >= matching.length, `${artist.name} full catalog cannot be smaller than matching mode.`);
    assert(matching.every((track) => track.genres.includes(genre.id)), `${artist.name} matching mode leaked another genre.`);
    const played = new Set(matching.slice(0, 2).map((track) => track.id));
    const progress = artistProgress(artist, played, genre.id, 'matching');
    assert.equal(progress.played, Math.min(2, matching.length));
    assert.equal(progress.total, matching.length);
  }
  if (eligible.length > 1) assert.equal(nextArtistFor(eligible[0].id, genre.id, 1).id, eligible[1].id);
}

assert.equal(coverPaths.size, releaseIds.size, 'Every release should have its own cover identity.');
for (const door of discoveryDoors) {
  assert(findTrackContext(door.trackId), `Discovery door track missing: ${door.trackId}`);
  assert(findReleaseContext(door.releaseId), `Discovery door release missing: ${door.releaseId}`);
}
for (const connection of discoveryConnections) assert(connection.trackIds.every((id) => findTrackContext(id)), `Discovery signal is broken: ${connection.id}`);

const heroContext = findTrackContext(discoveryDoors[0].trackId);
const discoverMarkup = renderDiscoverView({
  hero: { ...heroContext, door: discoveryDoors[0], lore: releaseLore[heroContext.release.id] },
  chapters: [{ artist: heroContext.artist, release: heroContext.release, lore: releaseLore[heroContext.release.id] }],
  genres: genres.map((genre, index) => ({ ...genre, index: `0${index + 1}`, artistCount: listArtistsForGenre(genre.id).length })),
  connections: [], unlockedArtifacts: [], playedTracks: [], activeTrackId: '', playing: false
});
assert(discoverMarkup.includes('Find a door') && discoverMarkup.includes('Take me somewhere'), 'Dedicated Discover composition is incomplete.');
const releaseMarkup = renderReleaseView({ artist: heroContext.artist, release: heroContext.release, lore: releaseLore[heroContext.release.id], progress: 0, unlocked: false, playedTracks: [] });
assert(releaseMarkup.includes('the music is never locked') && releaseMarkup.includes('Play chapter'), 'Release chapter must keep music open and playback truthful.');

const emptyLibrary = renderLibraryView({ savedArtists: [], savedReleaseContexts: [], savedTrackContexts: [] });
assert(emptyLibrary.includes('Keep what stays.'));
assert(emptyLibrary.includes('00 releases'));

const sampleArtist = artists[0];
const sampleRelease = sampleArtist.releases[0];
const savedLibrary = renderLibraryView({
  savedArtists: [sampleArtist],
  savedReleaseContexts: [{ artist: sampleArtist, release: sampleRelease }],
  savedTrackContexts: [{ artist: sampleArtist, release: sampleRelease, track: sampleRelease.tracks[0] }]
});
assert(savedLibrary.includes('01 artists · 01 releases · 01 tracks'));
assert(savedLibrary.includes(`data-open-release="${sampleRelease.id}"`));

const profile = renderProfileView({
  profile: { displayName: '<M>', genres: ['hiphop'], seedArtists: [sampleArtist.id], discovery: 64, popularity: 45, albumFocus: 78 },
  tasteGenres: ['Hip-Hop'],
  seedArtists: [sampleArtist]
});
assert(profile.includes('&lt;M&gt;'), 'Profile text should be escaped.');
assert(profile.includes('DISCOVERY') && profile.includes('ALBUM FOCUS'));

console.log(`Rondo unit tests passed: ${artists.length} artists, ${releaseIds.size} releases, ${trackIds.size} tracks.`);
