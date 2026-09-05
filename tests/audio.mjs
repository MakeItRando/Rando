import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const baseTarget = process.env.RONDO_URL || pathToFileURL(resolve('preview-test.html')).href;
const target = `${baseTarget}${baseTarget.includes('?') ? '&' : '?'}skip-onboarding=1`;
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || '/usr/local/bin/chromium' });
const assert = (condition, message) => { if (!condition) throw new Error(message); };
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(target);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  assert(await page.locator('#rondoAudio').count() === 1, 'Provider-neutral audio element should exist.');
  await page.click('#openFullPlayer');
  assert(await page.locator('#fullPlayer').getAttribute('data-playback-source') === 'audio', 'Night Transit should expose an authorized audio source.');
  await page.click('#fullPlay');
  await page.waitForTimeout(1000);
  const audio = await page.locator('#rondoAudio').evaluate((element) => ({ paused: element.paused, currentTime: element.currentTime, duration: element.duration, src: element.currentSrc }));
  assert(audio.src.includes('night-transit.mp3'), 'Night Transit should load its Rondo original recording.');
  assert(!audio.paused && audio.currentTime > 0, 'The audio recording should actually play.');
  assert(audio.duration > 31 && audio.duration < 33, 'The demo recording should report its real duration.');
  await page.click('#fullPlay');
  assert(await page.locator('#rondoAudio').evaluate((element) => element.paused), 'Pause should stop real audio.');
  assert(errors.length === 0, `Audio browser errors: ${errors.join(' | ')}`);
  await page.close();
  console.log('Authorized audio test passed.');
} finally {
  await browser.close();
}
