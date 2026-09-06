import { mkdirSync, existsSync } from 'node:fs';
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const executablePath = process.env.CHROMIUM_PATH || '/usr/local/bin/chromium';
const options = { headless: true, args: ['--no-sandbox'] };
if (existsSync(executablePath)) options.executablePath = executablePath;
const browser = await chromium.launch(options);
const base = `${pathToFileURL(resolve('preview-test.html')).href}?skip-onboarding=1`;
mkdirSync('.qa', { recursive: true });

async function capture(name, viewport, setup) {
  const page = await browser.newPage({ viewport });
  await page.goto(base);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await setup(page);
  await page.waitForTimeout(420);
  await page.screenshot({ path: `.qa/${name}.png`, fullPage: false });
  await page.close();
}

await capture('desktop-discover', { width: 1440, height: 960 }, async (page) => {
  await page.click('#playArtist');
});
await capture('mobile-discover', { width: 390, height: 844 }, async (page) => {
  await page.click('#playArtist');
});
await capture('desktop-song-room', { width: 1440, height: 960 }, async (page) => {
  await page.click('#playArtist');
  await page.click('#openFullPlayer');
});
await capture('mobile-library', { width: 390, height: 844 }, async (page) => {
  await page.click('[data-mobile-view="library"]');
});

await browser.close();
console.log('Final QA captures written.');
