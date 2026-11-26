// AugMind sub-brand wordmarks: SpendEdge (restored by owner decision, v11, 22 Nov 2026) and MindSignal-X.
// Type: Outfit Regular outlines, the same face and weight as the AugMind name, in the logo's ink (#323B40) or white.
// One inked element each, in the ribbon's teal-to-blue (#029A7B -> #2F74E9), drawn as a filled brush shape whose
// width wavers a little, like the lead lineup's drawings. No filters, so every renderer shows the same thing.
// Run: node make-marks.js  (writes ./out/*.svg)
const ot = require('opentype.js');
const fs = require('fs');
fs.mkdirSync('out', { recursive: true });
const font = ot.loadSync('node_modules/@fontsource/outfit/files/outfit-latin-400-normal.woff');

const FS = 196, CAP = 136, BASE = 200;           // cap height 136 units, like the AugMind name
// claim grey: 3.34:1 on white, 3.88:1 on navy (graphics need 3:1), and visibly weaker than the records stroke
const C = {
  ink: { text: '#323B40', claim: '#7C8F9F', a: '#029A7B', b: '#2F74E9' },
  white: { text: '#FFFFFF', claim: '#5B7183', a: '#3CCFA9', b: '#6EA2FF' },
  black: { text: '#000000', claim: '#000000', a: '#000000', b: '#000000' },      // one ink, for print and stamps
  knockout: { text: '#FFFFFF', claim: '#FFFFFF', a: '#FFFFFF', b: '#FFFFFF' },   // one ink, reversed
};

// small seeded random, so every build draws the same strokes
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

// A brush stroke along a polyline: filled outline, width w with gentle waver, round ends.
function brush(pts, w, seed, waver = 0.18) {
  const r = rng(seed);
  const pass = [];                                   // resample every ~3 units
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    const n = Math.max(2, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 3));
    for (let k = 0; k < n; k++) pass.push([x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n]);
  }
  pass.push(pts[pts.length - 1]);
  // smooth width noise: a few control values interpolated
  const ctrl = Array.from({ length: 7 }, () => 1 + (r() * 2 - 1) * waver);
  const W0 = Array.isArray(w) ? w[0] : w, W1 = Array.isArray(w) ? w[1] : w; w = (W0 + W1) / 2;
  const wAt = t => { const f = t * (ctrl.length - 1), i = Math.min(ctrl.length - 2, Math.floor(f)), u = f - i; return (W0 + (W1 - W0) * t) * (ctrl[i] * (1 - u) + ctrl[i + 1] * u); };
  const L = [], R = [];
  pass.forEach((p, i) => {
    const a = pass[Math.max(0, i - 1)], b = pass[Math.min(pass.length - 1, i + 1)];
    let nx = -(b[1] - a[1]), ny = b[0] - a[0]; const m = Math.hypot(nx, ny) || 1; nx /= m; ny /= m;
    const t = i / (pass.length - 1), h = wAt(t) / 2;
    const j = () => (r() - 0.5) * w * 0.01;             // a hair of edge roughness (more reads as digital noise)
    L.push([p[0] + nx * h + j(), p[1] + ny * h + j()]); R.push([p[0] - nx * h + j(), p[1] - ny * h + j()]);
  });
  // round end: half circle from one edge to the other, bulging along the stroke's direction (dir)
  const cap = (c, from, dir, h) => { const a0 = Math.atan2(from[1] - c[1], from[0] - c[0]); const mid = Math.atan2(dir[1], dir[0]);
    const d = a => Math.abs(Math.atan2(Math.sin(a - mid), Math.cos(a - mid))); const sg = d(a0 + Math.PI / 2) < d(a0 - Math.PI / 2) ? 1 : -1;
    const out = []; for (let k = 1; k < 8; k++) { const a = a0 + sg * Math.PI * k / 8; out.push([c[0] + Math.cos(a) * h, c[1] + Math.sin(a) * h]); } return out; };
  const end = pass[pass.length - 1], start = pass[0], n1 = pass[pass.length - 2], s1 = pass[1];
  const ring = [...L, ...cap(end, L[L.length - 1], [end[0] - n1[0], end[1] - n1[1]], wAt(1) / 2), ...R.reverse(), ...cap(start, R[R.length - 1], [start[0] - s1[0], start[1] - s1[1]], wAt(0) / 2)];
  return 'M' + ring.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L') + 'Z';
}
const textPath = (s, x) => { const p = font.getPath(s, x, BASE, FS); return { d: p.toPathData(2), w: font.getAdvanceWidth(s, FS), bb: p.getBoundingBox() }; };
const grad = (id, c, x1, y1, x2, y2) => `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${c.a}"/><stop offset="1" stop-color="${c.b}"/></linearGradient>`;
const svg = (vb, body, title) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>\n`;

// ---------- MindSignal-X: the X is two strokes. Thin dashed grey: what the platforms claim. Bold gradient: what your records show.
// Wordmark: four dashes. Icon (opts.icon): three heavier dashes and a heavier stroke, so it survives at 16-20px.
function msx(c, id, opts = {}) {
  const t = textPath('MindSignal-', 0);
  const icon = !!opts.icon, dw = icon ? 20 : 13, rw = icon ? [28, 34] : [18, 24];
  const top = BASE - CAP, x0 = t.w + 24, xw = CAP * 0.86, x1 = x0 + xw, o = 2;   // overshoot like a letter's, not more
  const pin = rw[1] / 2 * 0.7;                                                      // pull ends in so round caps land on the cap box
  // claim stroke (top-right to bottom-left), broken into dashes
  const A = [x1 + o - dw / 2 * .7, top - o + dw / 2 * .7], B = [x0 - o + dw / 2 * .7, BASE + o - dw / 2 * .7], dashes = [];
  const seg = icon ? [[0, .27], [.4, .6], [.73, 1]] : [[0, .2], [.3, .48], [.58, .76], [.86, 1]];
  seg.forEach(([s0, e], i) => dashes.push(brush([[A[0] + (B[0] - A[0]) * s0, A[1] + (B[1] - A[1]) * s0], [A[0] + (B[0] - A[0]) * e, A[1] + (B[1] - A[1]) * e]], dw, 40 + i, .1)));
  // records stroke (top-left to bottom-right), bold, tapering in, with a slight hand-drawn bow
  const rec = brush([[x0 - o + pin, top - o + pin], [x0 + xw * .35, top + CAP * .33], [x0 + xw * .66, top + CAP * .68], [x1 + o - pin, BASE + o - pin]], rw, 7);
  const W = x1 + o + 8, body =
    `<defs>${grad(id, c, x0, top, x1, BASE)}</defs>` +
    `<path fill="${c.text}" d="${t.d}"/>` +
    `<path fill="${c.claim}" d="${dashes.join('')}"/>` +
    `<path fill="url(#${id})" d="${rec}"/>`;
  const bot = Math.max(t.bb.y2, BASE + o) + 10;
  return { svg: svg(`-4 ${top - o - 10} ${W + 4} ${(bot - (top - o - 10)).toFixed(1)}`, body, 'MindSignal-X'), xbox: [x0 - 14, top - 14, xw + 28, CAP + 28], parts: { dashes, rec, x0, x1, top } };
}

// ---------- SpendEdge (LeadTally from 21 to 22 Nov 2026): an inked underline that ends in a check tick, the way a confirmed line on a statement gets
// ticked off. The flick of the tick is the edge.
function spend(c, id, name = 'SpendEdge') {
  const t = textPath(name, 0);
  const y = Math.max(t.bb.y2, BASE) + 22, end = t.w;
  // a tick has a short arm and a long one: the short arm drops well below the line, the long one rises to cap height
  const g = 14;                                    // room between the last letter and the tick
  const pts = [[4, y], [end * .5, y - 1], [end + g + 4, y + 3], [end + g + 20, y + 30], [end + g + 40, y - 6], [end + g + 72, y - 125]];
  const mark = brush(pts, [12, 22], 21, .14);
  const top = Math.min(BASE - CAP, y - 125 - 12) - 14, right = end + g + 72 + 16;
  const body = `<defs>${grad(id, c, 0, y, right, y - 125)}</defs><path fill="${c.text}" d="${t.d}"/><path fill="url(#${id})" d="${mark}"/>`;
  return svg(`-6 ${top} ${right + 6} ${(y + 30 + 18 - top).toFixed(1)}`, body, name);
}

for (const v of ['ink', 'white', 'black', 'knockout']) {
  fs.writeFileSync(`out/mindsignal-x-${v}.svg`, msx(C[v], `msx-${v}`).svg);
  fs.writeFileSync(`out/spendedge-${v}.svg`, spend(C[v], `se-${v}`));
}
// The X on its own, for app and tab icons: heavier strokes, three dashes, on a navy tile so it never reads as a bare "close".
{
  const m = msx(C.white, 'x', { icon: true }), [bx, by, bw, bh] = m.xbox, s = Math.max(bw, bh) + 36, cx = bx + bw / 2 - s / 2, cy = by + bh / 2 - s / 2;
  const tile = `<rect x="${cx.toFixed(1)}" y="${cy.toFixed(1)}" width="${s.toFixed(1)}" height="${s.toFixed(1)}" rx="${(s * .22).toFixed(1)}" fill="#070B12"/>`;
  fs.writeFileSync('out/mindsignal-x-icon.svg', svg(`${cx.toFixed(1)} ${cy.toFixed(1)} ${s.toFixed(1)} ${s.toFixed(1)}`,
    `<defs>${grad('xi', C.white, m.parts.x0, m.parts.top, m.parts.x1, BASE)}</defs>${tile}<path fill="${C.white.claim === '#5B7183' ? '#7F97AC' : C.white.claim}" d="${m.parts.dashes.join('')}"/><path fill="url(#xi)" d="${m.parts.rec}"/>`, 'MindSignal-X'));
}
console.log(fs.readdirSync('out'));
