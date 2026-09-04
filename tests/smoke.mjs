import { existsSync } from 'node:fs';
import { chromium } from 'playwright';

const executablePath = process.env.CHROMIUM_PATH || '/usr/local/bin/chromium';
const launchOptions = { headless: true, args: ['--no-sandbox'] };
if (existsSync(executablePath)) launchOptions.executablePath = executablePath;
const browser = await chromium.launch(launchOptions);
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
page.on('pageerror', (error) => errors.push(error.message));

const configuredUrl = process.env.RONDO_URL || 'http://127.0.0.1:4173/index.html';
const url = new URL(configuredUrl);
url.searchParams.set('skip-onboarding', '1');

const expectText = async (selector, value) => {
  const text = (await page.locator(selector).first().innerText()).trim();
  if (!text.includes(value)) throw new Error(`${selector} expected ${value}, got ${text}`);
};

try {
  await page.goto(url.href, { waitUntil: 'networkidle' });
  await expectText('#artistName', 'Kairo Vale');
  if (await page.locator('.track-row').count() !== 7) throw new Error('Matching catalog should contain seven Kairo tracks');

  await page.click('#saveArtist');
  await page.locator('[data-save-release]').first().click();
  await page.click('#allMode');
  if (await page.locator('.track-row').count() !== 10) throw new Error('All catalog should contain ten Kairo tracks');
  await page.click('#matchingMode');

  await page.click('[data-artist="moni-gray"]');
  await expectText('#artistName', 'Moni Gray');
  await page.locator('.track-row').first().click();
  await expectText('#nowTitle', 'Open Circuit');
  if (!(await page.locator('body').evaluate((body) => body.classList.contains('is-playing')))) throw new Error('Track selection should start playback');

  await page.click('#saveTrack');
  if (!(await page.locator('#saveTrack').evaluate((button) => button.classList.contains('saved')))) throw new Error('Track save did not update');

  await page.click('[data-tab="lyrics"]');
  if (await page.locator('.lyric-preview p').count() < 2) throw new Error('Lyrics tab did not render');
  await page.click('#lyricsCta');
  if (await page.locator('#fullPlayer').evaluate((node) => node.hidden)) throw new Error('Full player did not open');
  await page.click('#closeFullPlayer');

  await page.keyboard.press('/');
  await page.fill('#globalSearch', 'Asha');
  await page.locator('[data-result-type="artist"]').first().click();
  await expectText('#artistName', 'Asha North');
  await expectText('#locationGenre', 'R&B / SOUL');

  await page.click('#profileTrigger');
  await page.fill('#draftName', '');
  await page.fill('#draftEmail', 'not-an-email');
  await page.click('#onboardingNext');
  await page.waitForTimeout(40);
  await expectText('#onboardingProgress', '01 / 04');
  if ((await page.evaluate(() => document.activeElement?.id)) !== 'draftName') throw new Error('Invalid name should return focus to the display-name field');
  await page.fill('#draftName', 'Smoke Test');
  await page.click('#onboardingNext');
  await page.waitForTimeout(40);
  if ((await page.evaluate(() => document.activeElement?.id)) !== 'draftEmail') throw new Error('Invalid email should return focus to the email field');
  await page.fill('#draftEmail', 'smoke@example.com');
  await page.click('#onboardingNext');
  await expectText('#onboardingProgress', '02 / 04');
  await page.click('#closeOnboarding');

  await page.click('#previewCompletion');
  if (await page.locator('#completionOverlay').evaluate((node) => node.hidden)) throw new Error('Completion dialog did not open');
  await page.click('#continueArtist');
  await expectText('#artistName', 'Mira Son');

  await page.click('[data-view="library"]');
  await expectText('#viewSurface h1', 'Library');
  await expectText('#viewSurface', '01 artists · 01 releases · 01 tracks');
  if (await page.locator('[data-open-release="blacktop-studies"]').count() !== 1) throw new Error('Saved release is missing from Library');
  await page.click('[data-open-release="blacktop-studies"]');
  await expectText('#artistName', 'Kairo Vale');
  await expectText('#barTitle', 'Night Transit');

  await page.click('[data-view="library"]');
  await page.locator('[data-open-track]').first().click();
  await expectText('#nowTitle', 'Open Circuit');
  await page.click('[data-view="profile"]');
  if (await page.locator('.profile-metric').count() !== 3) throw new Error('Profile should render three taste controls');
  if (await page.locator('.profile-seed').count() < 2) throw new Error('Profile should render saved seed artists');
  await page.click('[data-view="discover"]');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle' });
  await page.click('#mobileDirectoryButton');
  if (!(await page.locator('#directory').evaluate((node) => node.classList.contains('open')))) throw new Error('Mobile artist directory did not open');
  await page.click('#closeDirectory');
  await page.click('#mobileTrack');
  if (await page.locator('#fullPlayer').evaluate((node) => node.hidden)) throw new Error('Mobile full player did not open');
  await page.keyboard.press('Escape');

  const overflow = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: window.innerWidth }));
  if (overflow.width > overflow.viewport) throw new Error(`Mobile horizontal overflow: ${overflow.width} > ${overflow.viewport}`);
  if (errors.length) throw new Error(`Browser errors: ${errors.join(' | ')}`);
  console.log('Rondo interaction smoke test passed');
} finally {
  await page.close();
  await browser.close();
}
