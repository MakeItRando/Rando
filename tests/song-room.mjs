import { existsSync } from 'node:fs';
import { chromium } from 'playwright';

const executablePath = process.env.CHROMIUM_PATH || '/usr/local/bin/chromium';
const launchOptions = { headless: true, args: ['--no-sandbox'] };
if (existsSync(executablePath)) launchOptions.executablePath = executablePath;
const browser = await chromium.launch(launchOptions);
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const base = new URL(process.env.RONDO_URL || 'http://127.0.0.1:4173/index.html');
const url = new URL(base); url.searchParams.set('skip-onboarding', '1'); url.searchParams.set('screen', 'player');

try {
  await page.goto(url.href, { waitUntil: 'networkidle' });
  await page.locator('#fullPlayer').waitFor({ state: 'visible' });
  await page.waitForFunction(() => document.querySelector('#fullPlayer')?.dataset.vibe);
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
  assert(visualRules.titleSize <= 82, 'Desktop Song Room title should stay under 82px.');
  assert(visualRules.orbitDisplay === 'none', 'Song Room should not use ornamental artwork orbits.');
  assert(visualRules.backdropAnimation !== 'none', 'Song Room should have one restrained cover-driven motion layer.');

  await page.click('[data-room-mode="about"]');
  const about = await page.locator('#songRoomPanel').textContent();
  assert(about.includes('About this song'), 'Song Room should use plain About copy.');
  assert(!about.includes('Inside the track'), 'Song Room should remove abstract story labels.');
  assert(!about.includes('provenance') && !about.includes('covenant') && !about.includes('Rights & provenance'), 'Song Room should not foreground internal provenance copy.');
  await page.click('[data-room-mode="lyrics"]');
  assert(await page.locator('[data-lyric-line]').count() > 0, 'Song Room should render synchronized lyric lines.');
  await page.evaluate(() => {
    const audio = document.querySelector('#rondoAudio');
    Object.defineProperty(audio, 'duration', { configurable: true, value: 200 });
    audio.currentTime = 80;
    audio.dispatchEvent(new Event('timeupdate'));
  });
  assert(await page.locator('[data-lyric-line].is-current').count() === 1, 'Exactly one lyric line should be current.');
  await page.locator('[data-lyric-time]').last().click();
  assert(await page.evaluate(() => document.querySelector('#rondoAudio').currentTime > 100), 'Lyric click should seek the track.');

  await page.click('[data-room-mode="queue"]');
  assert(await page.locator('.song-room-queue-row').count() >= 1, 'Song Room should render a queue.');
  await page.locator('.song-room-queue-row').last().click();
  await page.waitForFunction(() => document.documentElement.dataset.songPalette === 'ember');
  assert((await page.locator('#barTitle').textContent()).trim() === 'Afterimage', 'Queue click should start the selected track.');
  assert((await page.locator('html').evaluate((element) => getComputedStyle(element).getPropertyValue('--song-accent').trim())) === '#e07a54', 'Palette should change with artwork.');
  assert(Boolean(await page.locator('#fullPlayer').getAttribute('data-vibe')), 'Vibe should update with a queued song.');

  await page.click('[data-room-mode="lyrics"]');
  await page.click('[data-save-moment]');
  assert(await page.locator('[data-saved-moment]').count() >= 1, 'Song Room should save moments.');
  await page.click('[data-repeat-mode]');
  assert(await page.locator('[data-repeat-mode]').getAttribute('data-repeat-mode') === 'all', 'Repeat should enter all mode.');
  await page.click('[data-repeat-mode]');
  assert(await page.locator('[data-repeat-mode]').getAttribute('data-repeat-mode') === 'one', 'Repeat should enter one mode.');

  await page.setViewportSize({ width: 390, height: 844 });
  const mobile = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - innerWidth,
    titleSize: parseFloat(getComputedStyle(document.querySelector('.song-room-title h2')).fontSize)
  }));
  assert(mobile.overflow <= 1, 'Song Room must not overflow at 390px.');
  assert(mobile.titleSize <= 46, 'Mobile Song Room title should stay under 46px.');
  await page.click('.song-room-mobile-nav [data-room-mode="about"]');
  assert((await page.locator('#songRoomPanel').textContent()).includes('About this song'), 'Mobile About should work.');
  await page.click('.song-room-mobile-nav [data-room-mode="lyrics"]');
  assert((await page.locator('#songRoomPanel').textContent()).includes('Lyrics'), 'Mobile Lyrics should work.');

  assert(errors.length === 0, `Browser errors: ${errors.join(' | ')}`);
  console.log('Song Room regression passed.');
} finally {
  await page.close();
  await browser.close();
}
