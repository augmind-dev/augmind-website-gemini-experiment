// Reads result-<width>.json files written by scan.cjs and prints one summary object. usage: node summarise.cjs <dir> <label>
const fs = require('fs'), path = require('path'); const dir = process.argv[2], label = process.argv[3] || dir;
const out = { label, widths: {}, totals: { scans: 0, violations: 0, contrastMeasured: 0, contrastFailures: 0, sidewaysScroll: 0, smallTapTargets: 0, textSpacingProblems: 0, drawersAndMenuChecked: 0, drawersAndMenuFailed: 0 }, violationList: [], headerOverDarkMin: null };
for (const w of [320, 393, 900, 1440]) { const f = path.join(dir, `result-${w}.json`); if (!fs.existsSync(f)) continue; const r = JSON.parse(fs.readFileSync(f, 'utf8'));
  const bad = r.drawers.filter(d => !(d.opened && d.closedByEsc && d.focusReturned)); const h = r.pixel.filter(p => /header/.test(p.label)).map(p => p.min);
  out.widths[w] = { scans: r.scans, violations: r.violations.length, contrastMeasured: r.pixel.length, contrastFailures: r.pixelFails.length, sidewaysScroll: r.hscroll.length, smallTapTargets: r.tap.length, textSpacingProblems: r.spacing.length, drawersAndMenuChecked: r.drawers.length, drawersAndMenuFailed: bad.length };
  for (const k of Object.keys(out.totals)) out.totals[k] += out.widths[w][k];
  for (const v of r.violations) out.violationList.push({ width: w, where: v.label, rule: v.id, count: v.n, example: v.nodes[0] && v.nodes[0].t });
  if (h.length) out.headerOverDarkMin = Math.min(out.headerOverDarkMin ?? 99, ...h); }
console.log(JSON.stringify(out, null, 1));
