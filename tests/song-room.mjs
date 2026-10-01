import { existsSync } from 'node:fs';
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const baseTarget = process.env.RONDO_URL || pathToFileURL(resolve('preview-test.html')).href;
const join = (query) => `${baseTarget}${baseTarget.includes('?') ? '&' : '?'}${query}`;
const target = join('skip-onboarding=1&screen=journey');
const executablePath = process.env.CHROMIUM_PATH || '/usr/local/bin/chromium';
const launchOptions = { headless: true, args: ['--no-sandbox'] };
if (existsSync(executablePath)) launchOptions.executablePath = executablePath;
const browser = await chromium.launch(launchOptions);
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const errors = [];

// Regression guard for the 2026-09-28 "142 BPM · F MINOR · undefined" defect:
// no rendered Song Room text may ever leak a JavaScript placeholder value.
const placeholderPattern = /\b(undefined|null|NaN)\b|\[object Object\]/;
async function assertCleanSongRoom(page, label) {
  const text = await page.locator('#fullPlayer').innerText();
  const match = text.match(placeholderPattern);
  assert(!match, `${label}: Song Room rendered a placeholder value "${match?.[0]}".`);
  const meta = (await page.locator('#fullAudioMeta').textContent()).trim();
  assert(!placeholderPattern.test(meta), `${label}: transport metadata leaked a placeholder: "${meta}".`);
  assert(/(RONDO ORIGINAL|DEMO TIMELINE)$/.test(meta), `${label}: transport metadata should end with its playback source, got "${meta}".`);
}
async function assertOneActiveMode(page, scope, label) {
  const count = await page.locator(`${scope} [data-song-room-mode].active`).count();
  assert(count === 1, `${label}: exactly one Song Room mode should be active in ${scope}, found ${count}.`);
}

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(target);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.click('#openFullPlayer');
  await page.waitForFunction(() => Boolean(document.querySelector('#fullPlayer')?.dataset.vibe));
  assert(await page.locator('#fullPlayer').isVisible(), 'Song Room should open.');
  assert(await page.locator('#fullPlayer').evaluate((element) => element.classList.contains('song-room')), 'The immersive player should use the Song Room surface.');
  assert(await page.locator('html').getAttribute('data-song-palette') === 'night', 'Night Transit should apply its artwork palette.');
  assert((await page.locator('html').evaluate((element) => getComputedStyle(element).getPropertyValue('--song-accent').trim())) === '#6f9dff', 'Artwork palette should set one dominant accent.');
  assert(Boolean(await page.locator('#fullPlayer').getAttribute('data-vibe')), 'Song Room should expose a restrained track vibe.');
  const coverBackdrop = await page.locator('#fullPlayer').evaluate((element) => element.style.getPropertyValue('--song-cover'));
  assert(coverBackdrop.includes('url(') && !coverBackdrop.includes('url(\"\")'), 'Song Room backdrop should be driven by the current cover.');
  const visualRules = await page.evaluate(() => ({
    titleSize: parseFloat(getComputedStyle(document.querySelector('.song-room-title h2')).fontSize),
    orbitDisplay: getComputedStyle(document.querySelector('.song-room-art'), '::before').display,
    backdropAnimation: getComputedStyle(document.querySelector('.song-room-backdrop'), '::before').animationName
  }));
  assert(visualRules.titleSize <= 82, `Song title should stay restrained, got ${visualRules.titleSize}px.`);
  assert(visualRules.orbitDisplay === 'none', 'Decorative artwork orbits should be removed.');
  assert(['songBackdrop', 'none'].includes(visualRules.backdropAnimation), 'Only restrained cover-driven backdrop motion should remain.');
  assert((await page.locator('#songRoomPanel').textContent()).includes('About this song'), 'About mode should explain the song in plain language.');
  assert(!(await page.locator('#songRoomPanel').textContent()).includes('provenance'), 'Primary Song Room copy should avoid policy jargon.');
  await assertCleanSongRoom(page, 'Desktop About');
  await assertOneActiveMode(page, '#songRoomTabs', 'Desktop About');

  await page.click('[data-song-room-mode="credits"]');
  assert((await page.locator('#songRoomPanel').textContent()).includes('Made by'), 'Credits should use a simple human label.');
  await assertCleanSongRoom(page, 'Desktop Credits');
  await page.click('[data-song-room-mode="lyrics"]');
  assert(await page.locator('.song-room-lyric-list [data-time]').count() > 2, 'Lyrics mode should render synchronized lines.');
  await assertCleanSongRoom(page, 'Desktop Lyrics');
  await page.locator('.song-room-lyric-list [data-time]').first().click();
  assert((await page.locator('#fullElapsed').textContent()) === '0:00', 'Lyric lines should seek playback.');
  await page.click('#songRoomTabs [data-song-room-mode="reveals"]');
  await assertCleanSongRoom(page, 'Desktop Extra');
  await page.click('[data-song-room-mode="queue"]');
  assert(await page.locator('.song-room-queue-list [data-song-room-track]').count() > 1, 'Up next should show the artist sequence.');
  await assertCleanSongRoom(page, 'Desktop Queue');
  await assertOneActiveMode(page, '#songRoomTabs', 'Desktop Queue');
  await page.locator('[data-song-room-track="k105"]').click();
  assert(await page.locator('html').getAttribute('data-song-palette') === 'afterimage', 'Changing releases should update the artwork palette.');
  await assertCleanSongRoom(page, 'Desktop Queue after release change');
  await page.click('#songRoomMoment');
  const momentCount = await page.evaluate(() => JSON.parse(localStorage.getItem('rondo-prototype-v2') || '{}').savedMoments?.length || 0);
  assert(momentCount === 1, 'Saving a moment should persist it.');
  await page.click('#fullRepeat');
  assert(await page.locator('#fullRepeat').getAttribute('data-repeat') === 'track', 'Song Room repeat control should update.');
  assert(await page.locator('.song-room-control-buttons svg').count() >= 4, 'Song Room transport should use the shared SVG icon family, not text glyphs.');
  await page.click('#closeFullPlayer');
  assert(await page.locator('#fullPlayer').isHidden(), 'Song Room should close.');
  await page.close();

  const desktopRoom = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  desktopRoom.on('pageerror', (error) => errors.push(error.message));
  await desktopRoom.goto(join('screen=player'));
  assert(await desktopRoom.locator('#fullPlayer').isVisible(), 'Desktop Song Room should open from the player preview.');
  assert(await desktopRoom.locator('#fullPlayer').getAttribute('data-mode') === 'story', 'Desktop has no Room tab, so the mobile-only Room mode should open on About.');
  await assertOneActiveMode(desktopRoom, '#songRoomTabs', 'Desktop default open');
  await assertCleanSongRoom(desktopRoom, 'Desktop default open');
  await desktopRoom.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  mobile.on('pageerror', (error) => errors.push(error.message));
  await mobile.goto(join('screen=player'));
  assert(await mobile.locator('#fullPlayer').isVisible(), 'Mobile Song Room should open.');
  await mobile.click('[data-song-room-mode="room"]');
  const roomPanel = await mobile.locator('.song-room-panel').evaluate((element) => ({ pointerEvents: getComputedStyle(element).pointerEvents }));
  assert(roomPanel.pointerEvents === 'none', 'Room mode should return focus to the artwork on mobile.');
  await assertCleanSongRoom(mobile, 'Mobile Room');
  await assertOneActiveMode(mobile, '.song-room-mobile-nav', 'Mobile Room');
  await mobile.click('.song-room-mobile-nav [data-song-room-mode="story"]');
  assert((await mobile.locator('#songRoomPanel').textContent()).includes('About this song'), 'Mobile About mode should open the context sheet.');
  await assertCleanSongRoom(mobile, 'Mobile About');
  await mobile.click('.song-room-mobile-nav [data-song-room-mode="lyrics"]');
  assert(await mobile.locator('.song-room-lyric-list').isVisible(), 'Mobile Lyrics should be readable.');
  await assertCleanSongRoom(mobile, 'Mobile Lyrics');
  for (const mode of ['credits', 'reveals', 'queue']) {
    await mobile.click(`.song-room-mobile-nav [data-song-room-mode="${mode}"]`);
    await assertCleanSongRoom(mobile, `Mobile ${mode}`);
    await assertOneActiveMode(mobile, '.song-room-mobile-nav', `Mobile ${mode}`);
  }
  const compactTitle = parseFloat(await mobile.locator('.song-room-title h2').evaluate((element) => getComputedStyle(element).fontSize));
  assert(compactTitle <= 44, 'Mobile Song Room title should stay compact.');
  assert(!(await mobile.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), 'Mobile Song Room should not overflow.');
  await mobile.close();

  assert(errors.length === 0, `Song Room browser errors: ${errors.join(' | ')}`);
  console.log('Song Room test passed.');
} finally {
  await browser.close();
}
