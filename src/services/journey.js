import { artists, genres } from '../data/catalog.js';

export const getGenre = (genreId) => genres.find((genre) => genre.id === genreId) || genres[0];
export const getArtist = (artistId) => artists.find((artist) => artist.id === artistId) || artists[0];

export function listArtistsForGenre(genreId) {
  return artists
    .filter((artist) => artist.genreIds.includes(genreId))
    .sort((a, b) => a.sortName.localeCompare(b.sortName));
}

export function listReleases(artist, genreId, catalogMode = 'matching') {
  return [...artist.releases]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((release) => ({
      ...release,
      tracks: catalogMode === 'all'
        ? release.tracks
        : release.tracks.filter((track) => track.genres.includes(genreId))
    }))
    .filter((release) => release.tracks.length > 0);
}

export function flattenCatalog(artist, genreId, catalogMode = 'matching') {
  return listReleases(artist, genreId, catalogMode).flatMap((release) =>
    release.tracks.map((track) => ({ ...track, release }))
  );
}

export function findTrackContext(trackId) {
  for (const artist of artists) {
    for (const release of artist.releases) {
      const track = release.tracks.find((item) => item.id === trackId);
      if (track) return { artist, release, track };
    }
  }
  return null;
}

export function findReleaseContext(releaseId) {
  for (const artist of artists) {
    const release = artist.releases.find((item) => item.id === releaseId);
    if (release) return { artist, release };
  }
  return null;
}

export function nextArtistFor(artistId, genreId, direction = 1) {
  const eligible = listArtistsForGenre(genreId);
  const index = Math.max(0, eligible.findIndex((artist) => artist.id === artistId));
  return eligible[(index + direction + eligible.length) % eligible.length];
}

export function artistProgress(artist, playedTrackIds, genreId, catalogMode) {
  const tracks = flattenCatalog(artist, genreId, catalogMode);
  const played = tracks.filter((track) => playedTrackIds.has(track.id)).length;
  return { played, total: tracks.length, percentage: tracks.length ? Math.round((played / tracks.length) * 100) : 0 };
}

export function alphaGroups(items) {
  return items.reduce((groups, artist) => {
    const letter = artist.sortName.charAt(0).toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(artist);
    return groups;
  }, {});
}
