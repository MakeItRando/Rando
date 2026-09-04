import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'preview.html');
const bundle = resolve(root, '.preview/app.bundle.js');
mkdirSync(dirname(bundle), { recursive: true });
const esbuild = [process.env.ESBUILD_BIN, resolve(root, 'node_modules/.bin/esbuild'), resolve(root, '../../node_modules/.bin/esbuild')]
  .find((candidate) => candidate && existsSync(candidate));
if (!esbuild) throw new Error('esbuild is required. Run npm install before building previews.');
execFileSync(esbuild, [resolve(root, 'src/app.js'), '--bundle', '--format=iife', '--target=es2020', `--outfile=${bundle}`], { stdio: 'inherit' });

const css = [readFileSync(resolve(root, 'styles.css'), 'utf8'), readFileSync(resolve(root, 'listening.css'), 'utf8')].join('\n');
let js = readFileSync(bundle, 'utf8');
let html = readFileSync(resolve(root, 'index.html'), 'utf8');
const assets = new Set(`${html}\n${js}`.match(/assets\/[A-Za-z0-9_./-]+\.svg/g) || []);
for (const asset of assets) {
  const file = resolve(root, asset);
  if (!existsSync(file)) continue;
  const data = `data:image/svg+xml;base64,${Buffer.from(readFileSync(file)).toString('base64')}`;
  html = html.replaceAll(asset, data);
  js = js.replaceAll(asset, data);
}
html = html.replace(/\s*<link rel="stylesheet" href="styles\.css" \/>/, `\n  <style>${css}</style>`);
html = html.replace(/\s*<link rel="stylesheet" href="listening\.css" \/>/, '');
html = html.replace(/\s*<script type="module" src="app\.js"><\/script>/, '');
html = html.replace('</body>', `<script>${js}</script>\n</body>`);
const withMode = (mode) => html.replace('<body>', `<body data-preview="${mode}">`);
writeFileSync(output, withMode('discover'));
writeFileSync(resolve(root, 'preview-test.html'), html);
for (const mode of ['onboarding', 'lyrics', 'completion', 'library', 'profile', 'queue', 'playing', 'reopened', 'player', 'light', 'genre-rnb', 'genre-electronic', 'genre-jazz']) {
  writeFileSync(resolve(root, `preview-${mode}.html`), withMode(mode));
}
console.log(output);
