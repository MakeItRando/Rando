import { existsSync } from 'node:fs';
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const assert = (condition, message) => { if (!condition) throw new Error(message); };
const baseTarget = process.env.RONDO_URL || pathToFileURL(resolve('preview-test.html')).href;
const target = `${baseTarget}${baseTarget.includes('?') ? '&' : '?'}skip-onboarding=1&screen=journey`;
const executablePath = process.env.CHROMIUM_PATH || '/usr/local/bin/chromium';
const launchOptions = { headless: true, args: ['--no-sandbox'] };
if (existsSync(executablePath)) launchOptions.executablePath = executablePath;
const browser = await chromium.launch(launchOptions);
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
  assert(await page.locator('#previewCompletion').count() === 0, 'Prototype-only completion control should not ship in the user surface.');
  assert(!(await page.locator('#artistCount').innerText()).includes('sample'), 'Artist count should not explain the preview twice.');
  assert((await page.locator('#elapsed').innerText()).trim() === '0:00', 'The player should begin at an honest zero position.');

  await artistAction.click();
  await page.waitForFunction(() => document.body.classList.contains('is-playing'));
  assert((await artistAction.innerText()).trim() === 'Pause artist', 'Artist action should become Pause artist while playing.');
  assert(await artistAction.getAttribute('aria-pressed') === 'true', 'Playing artist action should expose pressed state.');
  assert(await page.locator('.track-row.active .track-equalizer').count() === 1, 'The active catalog track should show a live signal.');
  assert((await page.locator('.track-row.active .track-play').getAttribute('aria-label')).startsWith('Pause '), 'The active track control should become Pause.');

  await artistAction.click();
  await page.waitForFunction(() => !document.body.classList.contains('is-playing'));
  assert((await artistAction.innerText()).trim() === 'Resume artist', 'Paused artist action should become Resume artist.');
  await artistAction.click();
  await page.waitForFunction(() => document.body.classList.contains('is-playing'));
  await page.locator('.track-row.active .track-play').click();
  await page.waitForFunction(() => !document.body.classList.contains('is-playing'));
  assert((await page.locator('.track-row.active .track-play').getAttribute('aria-label')).startsWith('Resume '), 'Active track should resume instead of restarting.');
  await page.locator('.track-row.active .track-play').click();

  const titleBeforePrevious = (await page.locator('#barTitle').innerText()).trim();
  const timeline = page.locator('#timeline');
  const box = await timeline.boundingBox();
  await page.mouse.click(box.x + box.width * .7, box.y + box.height / 2);
  assert(Number(await timeline.getAttribute('aria-valuenow')) > 3, 'Timeline setup should move beyond the restart threshold.');
  await page.click('#previousTrack');
  assert((await page.locator('#barTitle').innerText()).trim() === titleBeforePrevious, 'Previous after three seconds should keep the current track.');
  assert(Number(await timeline.getAttribute('aria-valuenow')) <= 1, 'Previous after three seconds should restart the current track.');

  await page.evaluate(() => { document.body.tabIndex = -1; document.body.focus(); });
  const wasPlaying = await page.locator('body').evaluate((body) => body.classList.contains('is-playing'));
  await page.keyboard.press('Space');
  assert(await page.locator('body').evaluate((body, expected) => body.classList.contains('is-playing') === expected, !wasPlaying), 'Space should toggle playback away from editable controls.');

  await page.click('.rail-button[data-view="library"]');
  assert((await page.locator('.empty-library-copy h2').innerText()).trim() === 'Keep what stays.', 'Empty Library should use concise copy.');
  assert(!(await page.locator('.empty-library-copy').innerText()).includes('never interrupts'), 'Empty Library should not overexplain the save model.');
  await page.click('.rail-button[data-view="discover"]');
  await page.locator('#discoveryChoice').waitFor({ state: 'visible' });
  await page.click('[data-choose-explore]');
  assert(await page.locator('.music-explore').isVisible(), 'Discover should open the new Explore destination.');
  await page.click('#mobileTrack');
  assert(await page.locator('#fullPlayer').isVisible(), 'Expand should open Song Room.');
  await page.locator('.song-room-tabs [data-song-room-mode="story"]').click();
  assert((await page.locator('#songRoomPanel .song-room-eyebrow').textContent()).trim() === 'About this song', 'Song context should use plain language.');
  await page.keyboard.press('Escape');

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileWidth = await page.evaluate(() => innerWidth);
  assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), 'Mobile Explore should not overflow horizontally.');
  await page.locator('.mobile-nav-button[data-mobile-view="journeys"]').click();
  const skipBounds = await page.locator('#skipArtist').boundingBox();
  assert(skipBounds && skipBounds.x >= 0 && skipBounds.x + skipBounds.width <= mobileWidth + 1, 'Skip artist should remain fully visible on mobile.');
  assert(await page.locator('.artist-chapter-note').isHidden(), 'Desktop chapter note should stay out of the compact mobile header.');
  await page.locator('.mobile-nav-button[data-mobile-view="library"]').click();
  await page.waitForFunction(() => document.body.dataset.view === 'library');
  assert(await page.locator('.empty-library').isVisible(), 'Mobile Library navigation should reveal the Library surface.');
  assert(await page.locator('.mobile-nav-button[data-mobile-view="library"]').getAttribute('aria-current') === 'page', 'Mobile Library navigation should expose current state.');
  assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), 'Mobile Library should not overflow horizontally.');
  assert(errors.length === 0, `Browser errors: ${errors.join(' | ')}`);
  console.log('Rondo final experience regression passed.');
} catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
} finally {
  await page.close();
  await browser.close();
}
