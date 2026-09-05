import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const baseTarget = process.env.RONDO_URL || pathToFileURL(resolve('preview-test.html')).href;
const target = `${baseTarget}${baseTarget.includes('?') ? '&' : '?'}skip-onboarding=1`;
const executablePath = process.env.CHROMIUM_PATH || '/usr/local/bin/chromium';
const browser = await chromium.launch({ headless: true, executablePath });
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const errors = [];

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(target);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.click('#openFullPlayer');
  assert(await page.locator('#fullPlayer').isVisible(), 'Song Room should open.');
  assert(await page.locator('#fullPlayer').evaluate((el) => el.classList.contains('song-room')), 'The immersive player should use the Song Room surface.');
  assert(await page.locator('html').getAttribute('data-song-palette') === 'night', 'Night Transit should apply its artwork palette.');
  assert((await page.locator('html').evaluate((el) => getComputedStyle(el).getPropertyValue('--song-accent').trim())) === '#6f9dff', 'Artwork palette should set one dominant accent.');
  assert((await page.locator('#songRoomPanel').textContent()).includes('Why this song is here'), 'Story mode should explain why the song is present.');
  await page.click('[data-song-room-mode="credits"]');
  assert((await page.locator('#songRoomPanel').textContent()).includes('Everyone behind the recording'), 'Credits mode should render roles.');
  await page.click('[data-song-room-mode="lyrics"]');
  assert(await page.locator('.song-room-lyric-list [data-time]').count() > 2, 'Lyrics mode should render synchronized lines.');
  await page.locator('.song-room-lyric-list [data-time]').first().click();
  assert((await page.locator('#fullElapsed').textContent()) === '0:00', 'Lyric lines should seek playback.');
  await page.click('[data-song-room-mode="queue"]');
  assert(await page.locator('.song-room-queue-list [data-song-room-track]').count() > 1, 'Queue mode should show the artist chapter.');
  await page.locator('[data-song-room-track="k105"]').click();
  assert(await page.locator('html').getAttribute('data-song-palette') === 'afterimage', 'Changing releases should update the artwork palette.');
  await page.click('#songRoomMoment');
  const momentCount = await page.evaluate(() => JSON.parse(localStorage.getItem('rondo-prototype-v2') || '{}').savedMoments?.length || 0);
  assert(momentCount === 1, 'Saving a moment should persist it.');
  await page.click('#fullRepeat');
  assert(await page.locator('#fullRepeat').getAttribute('data-repeat') === 'track', 'Song Room repeat control should update.');
  await page.click('#closeFullPlayer');
  assert(await page.locator('#fullPlayer').isHidden(), 'Song Room should close.');
  await page.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  mobile.on('pageerror', (error) => errors.push(error.message));
  await mobile.goto(`${baseTarget}${baseTarget.includes('?') ? '&' : '?'}screen=player`);
  assert(await mobile.locator('#fullPlayer').isVisible(), 'Mobile Song Room should open.');
  await mobile.click('[data-song-room-mode="room"]');
  const roomPanel = await mobile.locator('.song-room-panel').evaluate((el) => ({ opacity: getComputedStyle(el).opacity, pointerEvents: getComputedStyle(el).pointerEvents }));
  assert(roomPanel.pointerEvents === 'none', 'Room mode should return focus to the artwork on mobile.');
  await mobile.click('.song-room-mobile-nav [data-song-room-mode="story"]');
  assert((await mobile.locator('#songRoomPanel').textContent()).includes('Why this song is here'), 'Mobile Story mode should open the context sheet.');
  await mobile.click('.song-room-mobile-nav [data-song-room-mode="lyrics"]');
  assert(await mobile.locator('.song-room-lyric-list').isVisible(), 'Mobile Lyrics mode should be readable.');
  await mobile.close();
  assert(errors.length === 0, `Song Room browser errors: ${errors.join(' | ')}`);
  console.log('Song Room test passed.');
} finally {
  await browser.close();
}
