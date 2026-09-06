import { readFileSync, writeFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const write = (path, content) => writeFileSync(path, content);
const replaceOnce = (source, oldText, newText, label) => {
  const matches = source.split(oldText).length - 1;
  if (matches !== 1) throw new Error(`${label}: expected one match, found ${matches}`);
  return source.replace(oldText, newText);
};

const cssPath = 'styles.css';
let css = read(cssPath);
const cssMarker = '/* Final compact artist-action fit */';
if (!css.includes(cssMarker)) {
  css += `\n\n${cssMarker}\n@media (max-width: 760px) {\n  .artist-actions { width: 100%; display: grid; grid-template-columns: minmax(0, 1fr) 44px; align-items: center; gap: 6px; }\n  #playArtist { grid-column: 1; grid-row: 1; min-width: 0; width: 100%; }\n  .artist-actions .secondary-action { grid-column: 2; grid-row: 1; width: 44px; }\n  .artist-actions .text-action { grid-column: 1 / -1; grid-row: 2; justify-self: start; width: max-content; min-width: 44px; min-height: 32px; }\n  .artist-stats .artist-chapter-note { display: none; }\n}\n`;
  write(cssPath, css);
}

const experiencePath = 'tests/experience.mjs';
let experience = read(experiencePath);
experience = replaceOnce(
  experience,
  `  await page.click('#openFullPlayer');\n  assert((await page.locator('#songRoomPanel .song-room-eyebrow').innerText()).trim() === 'Inside the track', 'Song story should invite curiosity.');`,
  `  await page.click('#openFullPlayer');\n  assert(await page.locator('#fullPlayer').isVisible(), 'Expand should open Song Room.');\n  assert((await page.locator('#songRoomPanel .song-room-eyebrow').innerText()).trim() === 'Inside the track', 'Song story should invite curiosity.');`,
  'Song Room visibility assertion'
);
experience = replaceOnce(
  experience,
  `  await page.setViewportSize({ width: 390, height: 844 });\n  assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), 'Final mobile surface should not overflow horizontally.');\n  assert(errors.length === 0, \`Browser errors: \${errors.join(' | ')}\`);`,
  `  await page.setViewportSize({ width: 390, height: 844 });\n  const mobileWidth = await page.evaluate(() => innerWidth);\n  const skipBounds = await page.locator('#skipArtist').boundingBox();\n  assert(skipBounds && skipBounds.x >= 0 && skipBounds.x + skipBounds.width <= mobileWidth + 1, 'Skip artist should remain fully visible on mobile.');\n  assert(await page.locator('.artist-chapter-note').isHidden(), 'Desktop chapter note should stay out of the compact mobile header.');\n  assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), 'Final mobile Discover surface should not overflow horizontally.');\n  await page.locator('.mobile-nav-button[data-mobile-view="library"]').click();\n  await page.waitForFunction(() => document.body.dataset.view === 'library');\n  assert(await page.locator('.empty-library').isVisible(), 'Mobile Library navigation should reveal the Library surface.');\n  assert(await page.locator('.mobile-nav-button[data-mobile-view="library"]').getAttribute('aria-current') === 'page', 'Mobile Library navigation should expose current state.');\n  assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), 'Final mobile Library surface should not overflow horizontally.');\n  assert(errors.length === 0, \`Browser errors: \${errors.join(' | ')}\`);`,
  'Mobile responsive assertions'
);
write(experiencePath, experience);

write('tests/capture-final.mjs', `import { mkdirSync, existsSync } from 'node:fs';
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
  const url = \`${documentUrl}?skip-onboarding=1\${screen ? \`&screen=\${screen}\` : ''}\`;
  await page.goto(url);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await setup(page);
  await page.waitForTimeout(420);
  if (errors.length) throw new Error(\`${name}: \${errors.join(' | ')}\`);
  await page.screenshot({ path: \`.qa/\${name}.png\`, fullPage: false });
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
`);

console.log('Applied final responsive QA patch.');
