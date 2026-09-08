import { existsSync } from 'node:fs';
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const assert = (condition, message) => { if (!condition) throw new Error(message); };
const base = process.env.RONDO_URL || pathToFileURL(resolve('preview-test.html')).href;
const target = `${base}${base.includes('?') ? '&' : '?'}skip-onboarding=1&screen=journey`;
const executablePath = process.env.CHROMIUM_PATH || '/usr/local/bin/chromium';
const options = { headless: true, args: ['--no-sandbox'] };
if (existsSync(executablePath)) options.executablePath = executablePath;
const browser = await chromium.launch(options);
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });

try {
  await page.goto(target);
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  const artistAction = page.locator('#playArtist');
  assert((await artistAction.innerText()).trim() === 'Play artist', 'Artist action should begin as Play artist.');
  assert(await artistAction.getAttribute('aria-pressed') === 'false', 'Idle artist action should not be pressed.');
  assert(await page.locator('#previewCompletion').count() === 0, 'Prototype-only completion control should not ship.');
  assert((await page.locator('#elapsed').innerText()).trim() === '0:00', 'Player should begin at zero.');

  await artistAction.click();
  await page.waitForFunction(() => document.body.classList.contains('is-playing'));
  assert((await artistAction.innerText()).trim() === 'Pause artist', 'Artist action should become Pause artist.');
  assert(await artistAction.getAttribute('aria-pressed') === 'true', 'Playing action should expose pressed state.');
  assert(await page.locator('.track-row.active .track-equalizer').count() === 1, 'Active catalog track needs a live signal.');
  await artistAction.click();
  await page.waitForFunction(() => !document.body.classList.contains('is-playing'));
  assert((await artistAction.innerText()).trim() === 'Resume artist', 'Paused artist action should become Resume artist.');
  await artistAction.click();
  await page.waitForFunction(() => document.body.classList.contains('is-playing'));

  const title = (await page.locator('#barTitle').innerText()).trim();
  const timeline = page.locator('#timeline');
  const box = await timeline.boundingBox();
  await page.mouse.click(box.x + box.width * .7, box.y + box.height / 2);
  assert(Number(await timeline.getAttribute('aria-valuenow')) > 3, 'Timeline setup should move beyond restart threshold.');
  await page.click('#previousTrack');
  assert((await page.locator('#barTitle').innerText()).trim() === title, 'Previous after three seconds should keep the track.');
  assert(Number(await timeline.getAttribute('aria-valuenow')) <= 1, 'Previous should restart the current track.');

  await page.click('.rail-button[data-view="library"]');
  assert((await page.locator('.empty-library-copy h2').innerText()).trim() === 'Keep what stays.', 'Library copy should stay concise.');
  await page.click('.rail-button[data-view="discover"]');
  await page.locator('main[data-rondo-page="discover"]').waitFor();
  assert(await page.locator('#journeyGenrePicker').isHidden(), 'Discover should not open a genre picker.');
  assert(await page.locator('.music-featured').isVisible(), 'Discover should open its music home directly.');
  await page.click('#mobileTrack');
  assert(await page.locator('#fullPlayer').isVisible(), 'Expand should open Song Room over Discover.');
  await page.locator('.song-room-tabs [data-song-room-mode="story"]').click();
  assert((await page.locator('#songRoomPanel .song-room-eyebrow').textContent()).trim() === 'About this song', 'Song context should use plain language.');
  await page.keyboard.press('Escape');

  await page.setViewportSize({ width: 390, height: 844 });
  assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), 'Mobile Discover should not overflow.');
  await page.click('[data-mobile-view="journeys"]');
  await page.locator('#journeyGenrePage').waitFor();
  assert(await page.locator('#mobileDirectoryButton').isHidden(), 'Genre home should hide the artist-directory trigger.');
  await page.click('[data-resume-journey]').first();
  await page.locator('#journey').waitFor();
  const width = await page.evaluate(() => innerWidth);
  const skip = await page.locator('#skipArtist').boundingBox();
  assert(skip && skip.x >= 0 && skip.x + skip.width <= width + 1, 'Skip artist should remain fully visible.');
  assert(await page.locator('#mobileDirectoryButton').isVisible(), 'Guided Journey should own the artist directory.');
  await page.click('[data-mobile-view="library"]');
  await page.waitForFunction(() => document.body.dataset.view === 'library');
  assert(await page.locator('.empty-library').isVisible(), 'Mobile Library navigation should work.');
  assert(await page.locator('[data-mobile-view="library"]').getAttribute('aria-current') === 'page', 'Mobile Library should expose current state.');
  assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), 'Mobile Library should not overflow.');
  assert(errors.length === 0, `Browser errors: ${errors.join(' | ')}`);
  console.log('Rondo final experience regression passed.');
} catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
} finally {
  await page.close();
  await browser.close();
}
