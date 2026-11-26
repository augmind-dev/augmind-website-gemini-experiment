// Builds the site's logo files from the one source: the SVG.new trace of the owner's ribbon picture
// (src/assets/brand/source/augmind-ribbon-svgnew-trace.svg, vectorization fc101185-40f0-431c-b2aa-612bc526944f,
// 17 Nov 2026). The ribbon is never redrawn: the script only drops the white page rectangle, leaves out three pale
// fringe slivers left over from the white page, and crops. The name is real Outfit outlines (owner asked
// for "AugMind" with a capital M, 18 Nov 2026), in the trace's ink colour or white.
// Run from the repo root:  node scripts/make-logo.mjs && npm run icons
import fs from 'node:fs';
const src = fs.readFileSync('src/assets/brand/source/augmind-ribbon-svgnew-trace.svg', 'utf8');
const defs = (src.match(/<(?:linear|radial)Gradient[\s\S]*?<\/(?:linear|radial)Gradient>/g) || []).join('');
const paths = src.match(/<path [^>]*?\/>/g) ?? [];
if (paths.length !== 40) throw new Error(`expected 40 paths in the trace, found ${paths.length}`);
// Path order in the trace: 0 white page; 1-28 the ribbon; 29-39 the name (32 and 39 are the letters' white insides).
const MARK = Array.from({ length: 28 }, (_, i) => i + 1);
const FRINGE = [3, 18, 20];
const fill = (p, c) => p.replace(/fill="[^"]+"/, `fill="${c}"`);
// The name: "AugMind" set in Outfit, the typeface the picture's lettering matches (see source/augmind-name-outfit.svg).
// The trace's own letters read "Augmind" and are kept in the source file only; a capital M cannot be traced into being.
const name = fs.readFileSync('src/assets/brand/source/augmind-name-outfit.svg', 'utf8').match(/<path id="name"[^>]*\/>/)?.[0];
if (!name) throw new Error('expected a self-closing <path id="name" .../> in source/augmind-name-outfit.svg');
const mark = MARK.filter(i => !FRINGE.includes(i)).map(i => paths[i]).join('');
const word = c => (c ? fill(name, c) : name);
const svg = (box, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}">${body}</svg>\n`;
const BOX = { mark: '196 251 632 284', word: '129 583 766 189', stacked: '122 247 780 530' };
// Side-by-side lockup (the header arrangement) as one file: the ribbon at full size, the name scaled so the
// capital A is 0.567 of the ribbon's height, sitting 0.26 of that height down, one third of it to the right.
const lockup = c => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1632.2 297.5"><svg x="0" y="0" width="632" height="284" viewBox="${BOX.mark}"><defs>${defs}</defs>${mark}</svg><svg x="725.7" y="73.8" width="906.5" height="223.7" viewBox="${BOX.word}">${word(c)}</svg></svg>\n`;
const out = {
  'src/assets/brand/augmind-mark.svg': svg(BOX.mark, `<defs>${defs}</defs>${mark}`),
  'src/assets/brand/augmind-word-white.svg': svg(BOX.word, word('#ffffff')),
  'src/assets/brand/augmind-word-ink.svg': svg(BOX.word, word(null)),
  'src/assets/brand/augmind-stacked-white.svg': svg(BOX.stacked, `<defs>${defs}</defs>${mark}${word('#ffffff')}`),
  'src/assets/brand/augmind-stacked-ink.svg': svg(BOX.stacked, `<defs>${defs}</defs>${mark}${word(null)}`),
  'src/assets/brand/augmind-lockup-white.svg': lockup('#ffffff'),
  'src/assets/brand/augmind-lockup-ink.svg': lockup(null),
  // Tab icon: the ribbon alone, centred in a square, no ground (it was drawn for white and holds on dark).
  'public/favicon.svg': svg('196 77 632 632', `<defs>${defs}</defs>${mark}`),
};
for (const [f, s] of Object.entries(out)) { fs.writeFileSync(f, s); console.log('wrote', f, s.length, 'bytes'); }
