import { mkdirSync, existsSync } from 'node:fs';
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const executablePath = process.env.CHROMIUM_PATH || '/usr/local/bin/chromium';
const options = { headless: true, args: ['--no-sandbox'] };
if (existsSync(executablePath)) options.executablePath = executablePath;
const browser = await chromium.launch(options);
const documentUrl = pathToFileURL(resolve('preview-test.html')).href;
mkdirSync('.qa', { recursive: true });

async function capture(name, viewport, setup = async () => {}, { screen = '', reducedMotion = 'no-preference' } = {}) {
  const context = await browser.newContext({ viewport, reducedMotion });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  const url = `${documentUrl}?skip-onboarding=1${screen ? `&screen=${screen}` : ''}`;
  await page.goto(url);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await setup(page);
  await page.waitForTimeout(420);
  if (errors.length) throw new Error(`${name}: ${errors.join(' | ')}`);
  await page.screenshot({ path: `.qa/${name}.png`, fullPage: false });
  await context.close();
}

await capture('desktop-discover', { width: 1440, height: 960 }, async (page) => {
  await page.click('#playArtist');
  await page.waitForFunction(() => document.body.classList.contains('is-playing'));
});
await capture('mobile-discover', { width: 390, height: 844 }, async (page) => {
  await page.click('#playArtist');
  await page.waitForFunction(() => document.body.classList.contains('is-playing'));
});
await capture('compact-resume', { width: 320, height: 700 }, async (page) => {
  await page.click('#playArtist');
  await page.click('#playArtist');
  await page.waitForFunction(() => document.querySelector('#playArtist')?.dataset.playbackState === 'resume');
});
await capture('desktop-song-room', { width: 1440, height: 960 }, async (page) => {
  await page.locator('#fullPlayer').waitFor({ state: 'visible' });
}, { screen: 'player' });
await capture('mobile-song-room', { width: 390, height: 844 }, async (page) => {
  await page.locator('#fullPlayer').waitFor({ state: 'visible' });
}, { screen: 'player' });
await capture('mobile-library', { width: 390, height: 844 }, async (page) => {
  await page.waitForFunction(() => document.body.dataset.view === 'library');
  await page.locator('.empty-library').waitFor({ state: 'visible' });
}, { screen: 'library' });
await capture('desktop-light', { width: 1280, height: 820 }, async (page) => {
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'light');
}, { screen: 'light' });
await capture('mobile-reduced-motion', { width: 390, height: 844 }, async (page) => {
  await page.click('#playArtist');
  await page.waitForFunction(() => document.body.classList.contains('is-playing'));
  const animationName = await page.locator('.track-equalizer i').first().evaluate((element) => getComputedStyle(element).animationName);
  if (animationName !== 'none') throw new Error('Reduced Motion equalizer should not animate.');
}, { reducedMotion: 'reduce' });

await browser.close();
console.log('Eight final QA captures written.');
