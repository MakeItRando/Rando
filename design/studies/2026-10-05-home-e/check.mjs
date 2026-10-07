// Interaction check for Home study E rev 4. Run from a folder with playwright installed:
//   CHROMIUM=$(which chromium) node design/studies/2026-10-05-home-e/check.mjs
// Fails (exit 1) on any runtime error or broken rule.
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
const U = new URL('./home.html', import.meta.url).href;
const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const errs = [], fail = m => errs.push(m);
const pg = async vp => { const p = await b.newPage({ viewport: vp }); p.on('pageerror', e => fail('runtime: ' + e.message)); await p.goto(U); await p.waitForTimeout(800); return p; };
let p = await pg({ width: 1440, height: 900 });
await p.click('#wv', { position: { x: 215, y: 12 } });
if (Math.abs(await p.evaluate(() => st.t / cur().d) - .5) > .05) fail('scrubber click should seek to ~50%');
await p.click('#digGo'); await p.waitForTimeout(400);
if (!(await p.evaluate(() => DG.open && !st.on))) fail('Dig must open and pause main playback');
for (const k of ['ArrowRight', 'ArrowLeft', 'ArrowRight']) { await p.keyboard.press(k); await p.waitForTimeout(400); }
if (JSON.stringify(await p.evaluate(() => SRC.dug.q)) !== '["dg0","dg2"]') fail('Keep must add to Dug in order');
await p.click('#toastBtn'); await p.waitForTimeout(300);
if (JSON.stringify(await p.evaluate(() => [SRC.dug.q, DG.i])) !== '[["dg0"],2]') fail('Undo must revert the last decision');
for (let j = 0; j < 8; j++) { await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(320); }
if (!(await p.evaluate(() => DG.i === 10 && !!document.getElementById('dgPlayDug')))) fail('stack must end after 10 with Play Dug');
await p.click('#dgPlayDug'); await p.waitForTimeout(400);
if (JSON.stringify(await p.evaluate(() => [st.src, st.on, SRC.dug.q.length])) !== '["dug",true,1]') fail('Play Dug must play the Dug source');
await p.evaluate(() => { st.i = SRC.dug.q.length - 1; st.t = cur().d - .3; }); await p.waitForTimeout(700);
if (await p.evaluate(() => st.on)) fail('natural end of a source must stop, not expand');
await p.close();
p = await pg({ width: 390, height: 844 });
const over = await p.evaluate(() => [...document.querySelectorAll('.tb *, .bar *, .tabs *')].filter(e => { const r = e.getBoundingClientRect(); return r.width && r.right > innerWidth + 1 && getComputedStyle(e).display !== 'none'; }).length);
if (over) fail(over + ' phone chrome elements overflow at 390px');
await p.click('.tabs [data-tab=Dig]'); await p.waitForTimeout(400);
if (!(await p.evaluate(() => DG.open && document.querySelector('.tabs .on').dataset.tab === 'Dig'))) fail('Dig tab must open Dig');
await p.close(); await b.close();
console.log(errs.length ? 'FAIL\n' + errs.join('\n') : 'PASS: scrubber, Dig flow, Undo, end-of-stack, Play Dug, source end stops, phone chrome, Dig tab');
process.exit(errs.length ? 1 : 0);
