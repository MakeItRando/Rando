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

console.log('Applied final responsive QA patch.');
