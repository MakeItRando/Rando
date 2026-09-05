const cover = {
  night: 'assets/covers/night-transit.svg',
  ring: 'assets/covers/continuum.svg',
  blue: 'assets/covers/blue-hour.svg',
  red: 'assets/covers/afterimage.svg'
};

const portrait = {
  asha: 'assets/artists/asha-north.svg',
  kairo: 'assets/artists/kairo-vale.svg',
  mira: 'assets/artists/mira-son.svg',
  moni: 'assets/artists/moni-gray.svg',
  nia: 'assets/artists/nia-vale.svg',
  sora: 'assets/artists/sora-k.svg'
};

const lyricSet = (lines) => lines.map((text, index) => ({ time: index * 17, text }));
const track = (id, title, duration, genres, style, options = {}) => ({
  id, title, duration, durationSeconds: options.durationSeconds || 210,
  genres, style, features: options.features || [], explicit: Boolean(options.explicit),
  lyrics: options.lyrics || lyricSet(['Instrumental passage', 'No synchronized words available']),
  writers: options.writers || [], producers: options.producers || [],
  isrc: options.isrc || `QZRND26${id.replace(/\D/g, '').padStart(6, '0').slice(-6)}`,
  bpm: options.bpm || null, key: options.key || null, version: options.version || 'Original album version',
  story: options.story || null, soundPalette: options.soundPalette || [],
  source: options.source || { label: 'Prototype context', detail: 'Fictional demo metadata · not a commercial catalog claim', status: 'demo' },
  previewUrl: options.previewUrl || null, previewDurationSeconds: options.previewDurationSeconds || null
});

export const genres = [
  { id: 'hiphop', name: 'Hip-Hop / Rap', short: 'Hip-Hop', index: '01', description: 'Rhythm, voice, region, and reinvention—heard artist by artist.' },
  { id: 'rnb', name: 'R&B / Soul', short: 'R&B', index: '02', description: 'Voice and groove across quiet storm, neo-soul, and left-field R&B.' },
  { id: 'electronic', name: 'Electronic', short: 'Electronic', index: '03', description: 'Club systems, ambient space, broken rhythm, and machines with fingerprints.' },
  { id: 'jazz', name: 'Jazz', short: 'Jazz', index: '04', description: 'A living language of improvisation, harmony, rhythm, and conversation.' }
];

export const artists = [
  {
    id: 'asha-north', name: 'Asha North', sortName: 'Asha North', image: portrait.asha,
    origin: 'London, United Kingdom', activeYears: '2018—present', genreIds: ['rnb'],
    tags: ['Alternative R&B', 'Neo-soul'],
    bio: 'Asha North writes close-mic soul around patient drums, modular textures, and carefully layered harmony.',
    releases: [
      { id: 'silver-weather', title: 'Silver Weather', type: 'Album', year: 2026, date: '2026-04-18', label: 'Kite String', cover: cover.ring, tracks: [
        track('a101', 'Continuum', '3:48', ['rnb'], 'Alternative R&B', { durationSeconds: 228, previewUrl: 'assets/audio/continuum.mp3', previewDurationSeconds: 32, source: { label: 'Rondo Originals', detail: 'Original 32-second demo recording created for this prototype', status: 'authorized' }, features: ['Daye'], bpm: 82, key: 'B minor', writers: ['Asha North', 'Daye Cole'], producers: ['Asha North', 'L. Penn'], lyrics: lyricSet(['Hold the room a little longer', 'Silver weather at the door', 'Every answer bends in silence', 'I can hear the current turn', 'Stay until the signal settles', 'Stay until we know for sure']) }),
        track('a102', 'Half Awake', '4:02', ['rnb'], 'Neo-soul', { durationSeconds: 242, writers: ['Asha North'], producers: ['L. Penn'] }),
        track('a103', 'Slow Meridian', '3:17', ['rnb'], 'Quiet storm', { durationSeconds: 197, writers: ['Asha North'], producers: ['Asha North'] })
      ]},
      { id: 'north-window-ep', title: 'North Window', type: 'EP', year: 2023, date: '2023-09-08', label: 'Kite String', cover: cover.blue, tracks: [
        track('a104', 'Rooms Between', '3:33', ['rnb'], 'Ambient soul', { durationSeconds: 213 }),
        track('a105', 'Paper Moon', '2:59', ['rnb', 'electronic'], 'Electronic soul', { durationSeconds: 179 })
      ]}
    ]
  },
  {
    id: 'kairo-vale', name: 'Kairo Vale', sortName: 'Kairo Vale', image: portrait.kairo,
    origin: 'Atlanta, United States', activeYears: '2017—present', genreIds: ['hiphop'],
    tags: ['Psychedelic trap', 'Southern hip-hop'],
    bio: 'Kairo Vale pairs low-slung Southern rhythm with widescreen synths and detailed, nocturnal writing.',
    releases: [
      { id: 'blacktop-studies', title: 'Blacktop Studies', type: 'Album', year: 2026, date: '2026-07-11', label: 'Rookhouse Records', cover: cover.night, tracks: [
        track('k101', 'Night Transit', '3:42', ['hiphop'], 'Psychedelic trap', { durationSeconds: 222, features: ['Mira Son'], explicit: true, bpm: 142, key: 'F minor', writers: ['Kairo Vale', 'Mira Son', 'J. Okoye'], producers: ['Duskline', 'M. East'], isrc: 'QZRND2600101', previewUrl: 'assets/audio/night-transit.mp3', previewDurationSeconds: 32, source: { label: 'Rondo Originals', detail: 'Original 32-second demo recording created for this prototype', status: 'authorized' }, story: { headline: 'A nocturnal bridge between psychedelic trap and alternative R&B.', body: 'Low-slung drums and glassy synth layers keep the track inside Kairo Vale’s Hip-Hop chapter, while Mira Son’s featured vocal opens the door to the neighboring R&B journey.' }, soundPalette: ['Psychedelic trap', 'Sub-bass', 'Glass synth', 'Half-time drums'], lyrics: lyricSet(['Headlights fold into the rain', 'One more exit, say my name', 'City breathing through the glass', 'We move slow, the night moves fast', 'Red line running through the dark', 'Every mile becomes a mark', 'No map left for where we are', 'Only signal, only stars']) }),
        track('k102', 'Kilometer Zero', '3:09', ['hiphop'], 'Southern hip-hop', { durationSeconds: 189, explicit: true, bpm: 138, key: 'D minor', writers: ['Kairo Vale'], producers: ['M. East'] }),
        track('k103', 'Third Exit', '2:54', ['hiphop'], 'Trap', { durationSeconds: 174, features: ['Rook'], bpm: 146, key: 'A minor' }),
        track('k104', 'Ivory Static', '4:12', ['rnb'], 'Alternative R&B', { durationSeconds: 252, features: ['Asha North'], bpm: 76, key: 'E major' })
      ]},
      { id: 'signal-memory', title: 'Signal Memory', type: 'EP', year: 2024, date: '2024-10-03', label: 'Rookhouse Records', cover: cover.red, tracks: [
        track('k105', 'Afterimage', '3:19', ['hiphop'], 'Experimental hip-hop', { durationSeconds: 199, explicit: true, bpm: 110, key: 'E minor', previewUrl: 'assets/audio/afterimage.mp3', previewDurationSeconds: 32, source: { label: 'Rondo Originals', detail: 'Original 32-second demo recording created for this prototype', status: 'authorized' } }),
        track('k106', 'Passing Lights', '4:04', ['electronic'], 'Ambient electronic', { durationSeconds: 244 }),
        track('k107', 'No Address', '3:31', ['hiphop'], 'Alternative hip-hop', { durationSeconds: 211 })
      ]},
      { id: 'southbound', title: 'Southbound', type: 'Album', year: 2021, date: '2021-05-21', label: 'Lowline', cover: cover.blue, tracks: [
        track('k108', 'Soft Shoulder', '3:27', ['hiphop'], 'Cloud rap', { durationSeconds: 207 }),
        track('k109', 'No Static', '2:46', ['hiphop'], 'Trap', { durationSeconds: 166, explicit: true }),
        track('k110', 'Morning Line', '3:58', ['rnb'], 'Alternative R&B', { durationSeconds: 238 })
      ]}
    ]
  },
  {
    id: 'mira-son', name: 'Mira Son', sortName: 'Mira Son', image: portrait.mira,
    origin: 'Seoul / Los Angeles', activeYears: '2019—present', genreIds: ['rnb', 'electronic'],
    tags: ['Alternative R&B', 'Electronic soul'],
    bio: 'Mira Son builds intimate songs from granular voice, negative space, and melodies that arrive in fragments.',
    releases: [
      { id: 'rooms-i-remember', title: 'Rooms I Remember', type: 'Album', year: 2025, date: '2025-11-07', label: 'Rookhouse Records', cover: cover.red, tracks: [
        track('m101', 'Low Light', '4:11', ['rnb'], 'Quiet storm', { durationSeconds: 251 }),
        track('m102', 'Glass Language', '3:26', ['rnb', 'electronic'], 'Electronic soul', { durationSeconds: 206 }),
        track('m103', 'Return Address', '3:02', ['rnb'], 'Alternative R&B', { durationSeconds: 182 })
      ]},
      { id: 'blue-room', title: 'Blue Room', type: 'EP', year: 2022, date: '2022-03-18', label: 'Soft Focus', cover: cover.blue, tracks: [
        track('m104', 'Blue Hour', '2:58', ['rnb', 'electronic'], 'Ambient R&B', { durationSeconds: 178 }),
        track('m105', 'Still Frame', '3:40', ['rnb'], 'Neo-soul', { durationSeconds: 220 })
      ]}
    ]
  },
  {
    id: 'moni-gray', name: 'Moni Gray', sortName: 'Moni Gray', image: portrait.moni,
    origin: 'Chicago, United States', activeYears: '2015—present', genreIds: ['hiphop', 'jazz'],
    tags: ['Jazz rap', 'Abstract hip-hop'],
    bio: 'Moni Gray treats verses like ensemble parts, trading rigid loops for live drums, brass, and open space.',
    releases: [
      { id: 'margins', title: 'Margins', type: 'Album', year: 2025, date: '2025-08-29', label: 'Parcel 12', cover: cover.ring, tracks: [
        track('g101', 'Open Circuit', '4:06', ['hiphop', 'jazz'], 'Jazz rap', { durationSeconds: 246, features: ['Theo June'], bpm: 94, key: 'G minor', previewUrl: 'assets/audio/open-circuit.mp3', previewDurationSeconds: 32, source: { label: 'Rondo Originals', detail: 'Original 32-second demo recording created for this prototype', status: 'authorized' } }),
        track('g102', 'Pencil Marks', '3:44', ['hiphop'], 'Abstract hip-hop', { durationSeconds: 224 }),
        track('g103', 'Counterweight', '5:01', ['jazz'], 'Contemporary jazz', { durationSeconds: 301 })
      ]},
      { id: 'small-hours', title: 'Small Hours', type: 'EP', year: 2022, date: '2022-01-14', label: 'Parcel 12', cover: cover.night, tracks: [
        track('g104', 'Side Street', '3:52', ['hiphop', 'jazz'], 'Jazz rap', { durationSeconds: 232 }),
        track('g105', 'Margins II', '2:49', ['hiphop'], 'Boom bap', { durationSeconds: 169 })
      ]}
    ]
  },
  {
    id: 'nia-vale', name: 'Nia Vale', sortName: 'Nia Vale', image: portrait.nia,
    origin: 'Toronto, Canada', activeYears: '2020—present', genreIds: ['hiphop', 'rnb'],
    tags: ['Alternative hip-hop', 'Neo-soul rap'],
    bio: 'Nia Vale moves between sung hooks and measured verses, using warm harmony to hold sharp observations.',
    releases: [
      { id: 'elsewhere-again', title: 'Elsewhere, Again', type: 'Album', year: 2025, date: '2025-05-16', label: 'Soft Focus', cover: cover.blue, tracks: [
        track('n101', 'Common Thread', '3:31', ['hiphop', 'rnb'], 'Neo-soul rap', { durationSeconds: 211 }),
        track('n102', 'Same Weather', '3:06', ['rnb'], 'Alternative R&B', { durationSeconds: 186 }),
        track('n103', 'Elsewhere', '4:15', ['hiphop'], 'Alternative hip-hop', { durationSeconds: 255 })
      ]},
      { id: 'close-reading', title: 'Close Reading', type: 'EP', year: 2023, date: '2023-02-03', label: 'Soft Focus', cover: cover.red, tracks: [
        track('n104', 'Underline', '2:57', ['hiphop'], 'Conscious hip-hop', { durationSeconds: 177 }),
        track('n105', 'Near Enough', '3:28', ['rnb'], 'Neo-soul', { durationSeconds: 208 })
      ]}
    ]
  },
  {
    id: 'sora-k', name: 'Sora K', sortName: 'Sora K', image: portrait.sora,
    origin: 'Tokyo, Japan', activeYears: '2016—present', genreIds: ['electronic'],
    tags: ['Ambient', 'Microhouse'],
    bio: 'Sora K works with small rhythmic shifts, field recordings, and saturated color to create patient electronic forms.',
    releases: [
      { id: 'no-fixed-address', title: 'No Fixed Address', type: 'Album', year: 2026, date: '2026-02-20', label: 'North Window', cover: cover.blue, tracks: [
        track('s101', 'Blue Hour', '2:58', ['electronic'], 'Ambient', { durationSeconds: 178, bpm: 92, key: 'C sharp minor', previewUrl: 'assets/audio/blue-hour.mp3', previewDurationSeconds: 32, source: { label: 'Rondo Originals', detail: 'Original 32-second demo recording created for this prototype', status: 'authorized' } }),
        track('s102', 'Folded Map', '5:09', ['electronic'], 'Microhouse', { durationSeconds: 309 }),
        track('s103', 'Carrier', '4:37', ['electronic'], 'Dub techno', { durationSeconds: 277 })
      ]},
      { id: 'soft-machines', title: 'Soft Machines', type: 'EP', year: 2022, date: '2022-07-01', label: 'North Window', cover: cover.ring, tracks: [
        track('s104', 'Open Circuit', '4:19', ['electronic'], 'Minimal electronic', { durationSeconds: 259 }),
        track('s105', 'Dust Index', '3:54', ['electronic'], 'Ambient techno', { durationSeconds: 234 })
      ]}
    ]
  },
  {
    id: 'theo-june', name: 'Theo June', sortName: 'Theo June', image: portrait.moni,
    origin: 'New Orleans, United States', activeYears: '2012—present', genreIds: ['jazz', 'hiphop'],
    tags: ['Spiritual jazz', 'Jazz rap'], bio: 'A saxophonist and producer connecting modal improvisation with sampled rhythm.',
    releases: [{ id: 'first-light', title: 'First Light', type: 'Album', year: 2026, date: '2026-01-23', label: 'Open Form', cover: cover.ring, tracks: [
      track('t101', 'First Light, Again', '6:18', ['jazz'], 'Spiritual jazz', { durationSeconds: 378, bpm: 78, key: 'D minor', previewUrl: 'assets/audio/first-light-again.mp3', previewDurationSeconds: 32, source: { label: 'Rondo Originals', detail: 'Original 32-second demo recording created for this prototype', status: 'authorized' } }),
      track('t102', 'Open Circuit Reprise', '4:34', ['hiphop', 'jazz'], 'Jazz rap', { durationSeconds: 274, features: ['Moni Gray'] })
    ]}]
  },
  {
    id: 'vale-lio', name: 'Vale & Lio', sortName: 'Vale & Lio', image: portrait.mira,
    origin: 'Berlin, Germany', activeYears: '2021—present', genreIds: ['electronic', 'hiphop'],
    tags: ['Experimental hip-hop', 'Industrial electronic'], bio: 'A production duo turning distorted percussion and spatial sound into tense, physical songs.',
    releases: [{ id: 'soft-collision', title: 'Soft Collision', type: 'EP', year: 2026, date: '2026-06-06', label: 'Signal House', cover: cover.red, tracks: [
      track('v101', 'Afterimage', '3:19', ['hiphop'], 'Experimental hip-hop', { durationSeconds: 199, explicit: true }),
      track('v102', 'Cut Glass', '4:39', ['electronic'], 'Industrial electronic', { durationSeconds: 279 })
    ]}]
  }
];

export const onboardingGenres = ['Hip-Hop', 'R&B', 'Electronic', 'Jazz', 'Rock', 'Pop', 'Afrobeats', 'Classical', 'Folk', 'Latin'];
export const onboardingArtists = artists.slice(0, 6).map(({ id, name, image, tags }) => ({ id, name, image, tags }));
