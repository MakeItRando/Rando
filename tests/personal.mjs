import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const base = process.env.RONDO_URL || pathToFileURL(resolve('preview-test.html')).href;
const target = `${base}${base.includes('?') ? '&' : '?'}skip-onboarding=1`;
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || '/usr/local/bin/chromium' });
const assert = (condition, message) => { if (!condition) throw new Error(message); };
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(target); await page.evaluate(() => localStorage.clear()); await page.reload();
  await page.click('#openFullPlayer');
  await page.click('[data-song-room-mode="story"]');
  await page.fill('#songRoomPrivateNote', 'That glass synth at the opening feels like a night drive.');
  await page.click('[data-save-song-note]');
  await page.click('#songRoomMoment');
  await page.locator('#volumeControl').evaluate((input) => { input.value = '37'; input.dispatchEvent(new Event('input', { bubbles: true })); });
  assert(await page.locator('#rondoAudio').evaluate((audio) => Math.abs(audio.volume - .37) < .01), 'Volume should control the real audio engine.');
  await page.focus('#closeFullPlayer'); await page.keyboard.press('Shift+Tab');
  assert(await page.evaluate(() => document.querySelector('#fullPlayer').contains(document.activeElement)), 'Song Room focus should wrap inside the dialog.');
  await page.click('#closeFullPlayer');
  await page.click('.rail-button[data-view="library"]');
  assert(await page.locator('[data-open-moment="k101"]').count() === 1, 'Saved moment should appear in Library.');
  assert(await page.locator('[data-open-note="k101"]').count() === 1, 'Private song note should appear in Library.');
  assert((await page.locator('.view-card-note p').textContent()).includes('night drive'), 'Library should preserve the note text.');
  await page.reload();
  await page.click('.rail-button[data-view="library"]');
  assert(await page.locator('[data-open-note="k101"]').count() === 1, 'Private song note should persist after reload.');
  assert(await page.locator('#volumeControl').inputValue() === '37', 'Volume preference should persist.');
  await page.click('[data-open-moment="k101"]');
  assert(!(await page.locator('#fullPlayer').getAttribute('hidden')), 'Opening a saved moment should return to Song Room.');
  assert(Number(await page.locator('#fullTimeline').getAttribute('aria-valuenow')) >= 5, 'Saved moment should restore its timestamp.');
  await page.close(); console.log('Personal listening regression passed.');
} finally { await browser.close(); }
