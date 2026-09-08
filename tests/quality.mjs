import { existsSync } from 'node:fs';
import { chromium } from 'playwright';

const executablePath = process.env.CHROMIUM_PATH || '/usr/local/bin/chromium';
const launchOptions = { headless: true, args: ['--no-sandbox'] };
if (existsSync(executablePath)) launchOptions.executablePath = executablePath;
const browser = await chromium.launch(launchOptions);
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const findings = [];
const browserErrors = [];
const add = (severity, area, message) => findings.push({ severity, area, message });
page.on('console', (message) => { if (message.type() === 'error') browserErrors.push(message.text()); });
page.on('pageerror', (error) => browserErrors.push(error.message));
const base = new URL(process.env.RONDO_URL || 'http://127.0.0.1:4173/index.html');
const firstVisit = new URL(base); firstVisit.search = '';
const journey = new URL(base); journey.searchParams.set('skip-onboarding', '1'); journey.searchParams.set('screen', 'journey');

async function noOverflow(label) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  if (overflow > 1) add('high', 'responsive', `${label} has ${overflow}px horizontal overflow.`);
}

async function openPrimary(view) {
  const selector = (await page.locator(`[data-mobile-view="${view}"]`).isVisible().catch(() => false)) ? `[data-mobile-view="${view}"]` : `[data-view="${view}"]`;
  await page.locator(selector).evaluate((button) => button.click());
  await page.waitForFunction((name) => document.body.dataset.view === name, view);
  if (view === 'discover') {
    await page.locator('#discoveryChoice').waitFor({ state: 'visible' });
    await page.click('[data-choose-explore]');
  }
}

try {
  await page.goto(firstVisit.href, { waitUntil: 'networkidle' });
  if (await page.locator('#onboardingOverlay').evaluate((node) => node.hidden)) add('high', 'first-run', 'A clean first visit skips onboarding.');
  if ((await page.evaluate(() => document.activeElement?.id)) !== 'draftName') add('medium', 'first-run', 'Onboarding does not focus the first field.');
  await page.keyboard.press('Escape');

  await page.goto(journey.href, { waitUntil: 'networkidle' });
  const semantics = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map((node) => node.id);
    return {
      duplicateIds: [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))],
      unnamedButtons: [...document.querySelectorAll('button')].filter((button) => !button.getAttribute('aria-label') && !button.textContent.trim()).length,
      missingAlt: [...document.querySelectorAll('img')].filter((image) => !image.hasAttribute('alt')).length,
      fullPlayerRole: document.querySelector('#fullPlayer')?.getAttribute('role'),
      searchLabel: document.querySelector('#globalSearch')?.getAttribute('aria-label')
    };
  });
  if (semantics.duplicateIds.length) add('high', 'semantics', `Duplicate IDs: ${semantics.duplicateIds.join(', ')}`);
  if (semantics.unnamedButtons) add('high', 'semantics', `${semantics.unnamedButtons} unnamed buttons.`);
  if (semantics.missingAlt) add('medium', 'semantics', `${semantics.missingAlt} images are missing alt attributes.`);
  if (semantics.fullPlayerRole !== 'dialog') add('medium', 'semantics', 'Song Room has no dialog semantics.');
  if (!semantics.searchLabel) add('medium', 'semantics', 'Global search has no accessible label.');

  for (const viewport of [{ width: 320, height: 700 }, { width: 390, height: 844 }, { width: 768, height: 900 }, { width: 1024, height: 768 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await page.goto(journey.href, { waitUntil: 'networkidle' });
    await openPrimary('discover');
    await noOverflow(`${viewport.width}px Explore`);
    const headingSize = parseFloat(await page.locator('.music-explore h1').evaluate((element) => getComputedStyle(element).fontSize));
    if (headingSize > 78) add('medium', 'typography', `Explore heading is too large at ${viewport.width}px (${headingSize}px).`);
    for (const view of ['library', 'profile']) {
      await openPrimary(view);
      await noOverflow(`${viewport.width}px ${view}`);
    }
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(journey.href, { waitUntil: 'networkidle' });
  const genreIds = await page.locator('#genreSelect option').evaluateAll((options) => options.map((option) => option.value));
  for (const genreId of genreIds) {
    await page.selectOption('#genreSelect', genreId);
    const artistCount = await page.locator('.artist-list-item').count();
    const trackCount = await page.locator('.track-row').count();
    if (!artistCount || !trackCount) add('high', 'catalog', `${genreId} renders ${artistCount} artists and ${trackCount} tracks.`);
  }

  await page.click('#searchTrigger');
  await page.fill('#globalSearch', 'Signal Memory');
  await page.locator('[data-result-type="release"]').first().click();
  if (await page.locator('body').getAttribute('data-view') !== 'release') add('high', 'search', 'Opening Signal Memory should enter its release page.');
  await page.locator('[data-release-song-room]').first().click();
  if ((await page.evaluate(() => document.activeElement?.id)) !== 'closeFullPlayer') add('medium', 'keyboard', 'Song Room does not focus its close control.');
  const songRoom = await page.evaluate(() => ({
    titleSize: parseFloat(getComputedStyle(document.querySelector('.song-room-title h2')).fontSize),
    orbit: getComputedStyle(document.querySelector('.song-room-art'), '::before').display,
    text: document.querySelector('#songRoomPanel')?.textContent || ''
  }));
  if (songRoom.titleSize > 82) add('medium', 'song-room', `Song Room title is oversized at ${songRoom.titleSize}px.`);
  if (songRoom.orbit !== 'none') add('medium', 'song-room', 'Song Room still displays decorative orbital artwork.');
  if (!songRoom.text.includes('About this song')) add('medium', 'copy', 'Song Room does not use plain About copy.');
  await page.keyboard.press('Escape');
  if (!(await page.evaluate(() => document.activeElement?.hasAttribute('data-release-song-room')))) add('medium', 'keyboard', 'Song Room does not return focus to its opener.');

  await openPrimary('discover');
  const discoverText = await page.locator('#viewSurface').innerText();
  for (const rejected of ['Find a door, not a feed', 'CONTROLLED SERENDIPITY', 'SIGNALS BETWEEN SONGS']) {
    if (discoverText.includes(rejected)) add('medium', 'copy', `Rejected Discover copy remains: ${rejected}.`);
  }
  await page.click('.rail-button[data-view="discover"]');
  await page.locator('#discoveryChoice').waitFor({ state: 'visible' });
  await page.locator('.discovery-choice-close').focus();
  await page.keyboard.press('Shift+Tab');
  if (!(await page.evaluate(() => document.querySelector('#discoveryChoice')?.contains(document.activeElement)))) add('high', 'keyboard', 'Discover chooser does not trap focus.');
  await page.keyboard.press('Escape');

  if (browserErrors.length) add('high', 'runtime', browserErrors.join(' | '));
  const blocking = findings.filter((finding) => ['high', 'medium'].includes(finding.severity));
  console.log(JSON.stringify({ checkedAt: new Date().toISOString(), findings, metadata: { genreCount: genreIds.length, browserErrors } }, null, 2));
  if (blocking.length) process.exitCode = 1;
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await page.close();
  await browser.close();
}
