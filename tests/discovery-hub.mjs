import { existsSync } from 'node:fs';
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const ok = (value, message) => { if (!value) throw new Error(message); };
const base = process.env.RONDO_URL || pathToFileURL(resolve('preview-test.html')).href;
const target = `${base}${base.includes('?') ? '&' : '?'}skip-onboarding=1`;
const executablePath = process.env.CHROMIUM_PATH || '/usr/local/bin/chromium';
const options = { headless: true, args: ['--no-sandbox'] };
if (existsSync(executablePath)) options.executablePath = executablePath;
const browser = await chromium.launch(options);
const errors = [];
const watch = (page) => {
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
};
const hash = (page) => page.evaluate(() => location.hash);
const oneMain = (page) => page.evaluate(() => [...document.querySelectorAll('main')].filter((element) => element.offsetParent !== null).length === 1);

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  watch(page);
  await page.goto(target, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('main[data-rondo-page="discover"]').waitFor();

  ok(await page.locator('#journeyGenrePicker').count() === 0, 'Discover must not open the genre chooser.');
  ok((await page.locator('#discoverTitle').textContent()).trim() === 'Play something good.', 'Discover copy should be concise.');
  for (const title of ['Hits today', 'Made for you', 'Bangers', 'Sounds', 'Hidden gems', 'New & rising', 'Genre Journeys']) {
    ok(await page.locator(`h2:text-is("${title}")`).count() === 1, `Missing Discover section: ${title}`);
  }
  ok(!(await page.locator('#viewSurface').textContent()).includes('Find a door'), 'Rejected editorial copy returned.');
  ok(await page.locator('#genreSelect').isHidden(), 'Legacy genre dropdown should be hidden.');
  ok(await oneMain(page), 'Discover should expose one visible main.');
  ok(await hash(page) === '#/discover', 'Discover route is incorrect.');

  await page.click('.rail-button[data-view="journeys"]');
  await page.locator('#journeyGenrePicker').waitFor();
  ok(await page.locator('#appShell').evaluate((element) => element.inert), 'Journey picker background should be inert.');
  ok(await page.locator('[data-picker-genre]').count() === 4, 'Journey picker should list four genres.');
  ok(await page.evaluate(() => document.querySelector('#journeyGenrePicker').contains(document.activeElement)), 'Journey picker should receive focus.');
  ok(await hash(page) === '#/journeys', 'Journey picker route is incorrect.');

  await page.click('[data-picker-genre="rnb"]');
  ok(await page.locator('[data-picker-genre="rnb"]').getAttribute('aria-checked') === 'true', 'Genre selection lacks accessible state.');
  ok((await page.locator('[data-confirm-journey]').textContent()).includes('R&B'), 'Journey action should name R&B.');
  await page.click('[data-confirm-journey]');
  await page.locator('#journeyGenrePage[data-genre="rnb"]').waitFor();
  ok(await hash(page) === '#/journeys/rnb', 'R&B should open as a Journey subroute.');
  ok((await page.title()).includes('R&B Journey'), 'Genre page needs a useful title.');
  ok(await page.evaluate(() => document.activeElement?.id === 'journeyGenreTitle'), 'Genre heading should receive focus.');
  ok(await oneMain(page), 'Genre page should expose one visible main.');
  ok(await page.locator('.journey-artist-card').count() > 0, 'Genre page should list artists.');
  ok(await page.locator('.journey-top-songs .genre-song').count() >= 6, 'Genre page should list songs.');

  await page.fill('[data-journey-genre-search]', 'Mira');
  ok(await page.locator('[data-journey-genre-results] .genre-song').count() > 0, 'Scoped genre search failed.');
  await page.fill('[data-journey-genre-search]', '');

  await page.click('.journey-genre-actions [data-change-journey]');
  await page.click('[data-picker-genre="jazz"]');
  await page.click('[data-confirm-journey]');
  await page.locator('#journeyGenrePage[data-genre="jazz"]').waitFor();
  const switched = await page.evaluate(() => JSON.parse(localStorage.getItem('rondo-route-state-v1')));
  ok(switched.activeGenreId === 'jazz', 'Active Journey genre was not saved.');
  ok(switched.progressByGenre.rnb && switched.progressByGenre.jazz, 'Per-genre progress records were not preserved.');

  await page.goBack();
  await page.locator('#journeyGenrePage[data-genre="rnb"]').waitFor();
  ok(await hash(page) === '#/journeys/rnb', 'Back did not restore R&B.');
  await page.goForward();
  await page.locator('#journeyGenrePage[data-genre="jazz"]').waitFor();
  ok(await hash(page) === '#/journeys/jazz', 'Forward did not restore Jazz.');

  await page.click('[data-return-discover]');
  await page.locator('main[data-rondo-page="discover"]').waitFor();
  await page.fill('[data-music-search]', 'Night Transit');
  ok(await page.locator('[data-music-results] [data-play-entry="k101"]').count() === 1, 'Discover search should find Night Transit.');
  await page.click('[data-music-results] [data-play-entry="k101"]');
  await page.waitForFunction(() => document.body.classList.contains('is-playing'));
  await page.locator('#fullPlayer').waitFor();
  ok((await page.locator('#barTitle').textContent()).trim() === 'Night Transit', 'Discover direct play chose the wrong song.');
  ok(await hash(page) === '#/discover', 'Song Room should preserve Discover beneath it.');
  const duringPlayback = await page.evaluate(() => JSON.parse(localStorage.getItem('rondo-route-state-v1')));
  ok(duringPlayback.activeGenreId === 'jazz', 'Discover playback replaced the active Journey.');
  await page.keyboard.press('Escape');
  await page.locator('main[data-rondo-page="discover"]').waitFor();

  await page.click('.rail-button[data-view="journeys"]');
  await page.locator('#journeyGenrePage[data-genre="jazz"]').waitFor();
  ok(await page.locator('#journeyGenrePicker').isHidden(), 'Returning listener should resume the saved Journey.');
  await page.click('[data-resume-journey="jazz"]');
  await page.locator('#journey').waitFor();
  ok((await hash(page)).startsWith('#/journeys/jazz/artist/'), 'Guided Journey should use an artist subroute.');
  ok(await page.locator('#journeyGenreSwitch').isVisible(), 'Guided Journey needs Change genre.');

  const artistRoute = await hash(page);
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('#journey').waitFor();
  ok(await hash(page) === artistRoute, 'Journey artist route did not survive reload.');
  const session = await page.evaluate(() => JSON.parse(localStorage.getItem('rondo-prototype-v2')).session);
  ok(session?.genreId && session?.artistId, 'Playback context was not persisted.');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.click('[data-change-journey]');
  await page.locator('#journeyGenrePicker').waitFor();
  ok(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), 'Mobile Journey picker overflows.');
  const choice = await page.locator('[data-picker-genre]').first().boundingBox();
  ok(choice && choice.height >= 44, 'Mobile genre choices need 44px targets.');
  await page.keyboard.press('Escape');
  await page.locator('main[data-rondo-page="discover"]').waitFor();
  await page.setViewportSize({ width: 320, height: 700 });
  ok(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), 'Compact Discover overflows.');
  const action = await page.locator('[data-surprise-track]').boundingBox();
  ok(action && action.height >= 44, 'Compact Discover action needs a 44px target.');
  await page.close();

  ok(errors.length === 0, `Discover/Journey browser errors: ${errors.join(' | ')}`);
  console.log('Route-backed Discover and Journey regression passed.');
} finally {
  await browser.close();
}
