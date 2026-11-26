// usage: node scan.cjs <width> <outdir>
// Per page: axe (A, AA, AAA) in states initial / settled / expanded+sticky / skip-link / each drawer;
// pixel contrast for anything axe cannot decide; sideways scroll; tap targets; text spacing; drawer Escape + focus return.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const { PNG } = require('pngjs');
const axeSrc = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const W = +process.argv[2], OUT = process.argv[3];
// BASE: the site to scan. SCHED_BASE: where /scheduling is served (it is rendered on demand, so a static copy of the build cannot serve it).
// SHARE: optional Vercel share link, opened first so a protected preview lets the browser in.
const STATIC = process.env.BASE || 'http://localhost:8812', DEV = process.env.SCHED_BASE || STATIC, SHARE = process.env.SHARE;
const PAGES = (process.env.PAGES || '/,/no-such-page').split(',').map(s => s.trim()).filter(Boolean); // comma-separated paths; include one that does not exist
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'wcag2aaa'];
fs.mkdirSync(OUT, { recursive: true });
const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
const cr = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
const res = { width: W, scans: 0, violations: [], pixel: [], pixelFails: [], hscroll: [], tap: [], spacing: [], drawers: [], sticky: [], notes: [] };

async function axe(pg, label, ctxSel) {
  await pg.evaluate(() => document.querySelectorAll('astro-dev-toolbar').forEach(e => e.remove()));
  if (!(await pg.evaluate(() => !!window.axe))) await pg.addScriptTag({ content: axeSrc });
  const r = await pg.evaluate(async ([tags, sel]) => {
    const r = await axe.run(sel ? document.querySelector(sel) : document, { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations', 'incomplete'] });
    const m = a => a.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ t: n.target.join(' '), s: (n.any[0] || n.all[0] || n.none[0] || {}).message || '' })) }));
    return { v: m(r.violations), i: m(r.incomplete) };
  }, [TAGS, ctxSel || null]);
  res.scans++;
  for (const v of r.v) res.violations.push({ label, id: v.id, n: v.nodes.length, nodes: v.nodes.slice(0, 6) });
  for (const i of r.i) {
    if (!/color-contrast/.test(i.id)) { res.notes.push({ label, incomplete: i.id, n: i.nodes.length, nodes: i.nodes.slice(0, 3) }); continue; }
    if (i.id !== 'color-contrast-enhanced') continue;
    for (const n of i.nodes) await pixel(pg, label, n.t);
  }
}

// Hide the text, screenshot what is behind it, then compare the text colour with every pixel.
async function pixel(pg, label, sel) {
  let h; try { h = await pg.$(sel); } catch { h = null; }
  if (!h) { res.notes.push({ label, pixelSkip: sel }); return; }
  const info = await h.evaluate(el => {
    el.scrollIntoView({ block: 'center', behavior: 'instant' });
    const cs = getComputedStyle(el); let op = 1; for (let e = el; e; e = e.parentElement) op *= +getComputedStyle(e).opacity;
    const px = parseFloat(cs.fontSize), wt = +cs.fontWeight;
    const m = cs.color.match(/[\d.]+/g).map(Number);
    return { rgb: m.slice(0, 3), a: (m[3] ?? 1) * op, large: px >= 24 || (px >= 18.66 && wt >= 700), px, wt, text: (el.innerText || '').trim().slice(0, 50) };
  });
  if (!info.text) return;
  await pg.waitForTimeout(80);
  const st = await pg.addStyleTag({ content: '*{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important;caret-color:transparent!important} svg text{fill:transparent!important}' });
  let buf; try { buf = await h.screenshot({ timeout: 4000 }); } catch { buf = null; }
  await st.evaluate(e => e.remove());
  if (!buf) { res.notes.push({ label, pixelSkip: sel, why: 'not visible' }); return; }
  const png = PNG.sync.read(buf); let min = 99;
  for (let i = 0; i < png.data.length; i += 4) {
    const bg = [png.data[i], png.data[i + 1], png.data[i + 2]];
    const fg = info.rgb.map((c, k) => c * info.a + bg[k] * (1 - info.a));
    const c = cr(fg, bg); if (c < min) min = c;
  }
  const need = info.large ? 4.5 : 7;
  const rec = { label, sel, text: info.text, min: +min.toFixed(2), need, px: info.px, wt: info.wt };
  res.pixel.push(rec); if (min < need) res.pixelFails.push(rec);
}

async function pixelFixed(pg, label, sel) {   // like pixel() but without scrolling the page
  const h = await pg.$(sel); const info = await h.evaluate(el => { const cs = getComputedStyle(el); const m = cs.color.match(/[\d.]+/g).map(Number); const r = el.getBoundingClientRect(); return { rgb: m.slice(0, 3), a: m[3] ?? 1, px: parseFloat(cs.fontSize), wt: +cs.fontWeight, text: el.innerText.trim(), clip: { x: r.x, y: r.y, width: r.width, height: r.height } }; });
  const st = await pg.addStyleTag({ content: '.hd *{color:transparent!important}.nav a::after{visibility:hidden}' });
  const png = PNG.sync.read(await pg.screenshot({ clip: info.clip })); await st.evaluate(e => e.remove());
  let min = 99; for (let i = 0; i < png.data.length; i += 4) { const bg = [png.data[i], png.data[i + 1], png.data[i + 2]]; const c = cr(info.rgb, bg); if (c < min) min = c; }
  const rec = { label, sel, text: info.text, min: +min.toFixed(2), need: 7, px: info.px, wt: info.wt };
  res.pixel.push(rec); if (min < 7) res.pixelFails.push(rec);
}
async function settle(pg) {
  const H = await pg.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 500) { await pg.evaluate(y => scrollTo(0, y), y); await pg.waitForTimeout(350); }
  await pg.waitForTimeout(3500); await pg.evaluate(() => scrollTo(0, 0)); await pg.waitForTimeout(600);
}

(async () => {
  const b = await chromium.launch();
  for (const p of PAGES) {
    const name = p === '/' ? 'home' : p.slice(1);
    const url = (p === '/scheduling' ? DEV : STATIC) + p;
    const L = s => `${name}@${W}:${s}`;
    const ctx = await b.newContext({ viewport: { width: W, height: W < 500 ? 800 : 900 }, deviceScaleFactor: 1 });
    const pg = await ctx.newPage();
    if (SHARE) await pg.goto(SHARE, { waitUntil: 'load' });
    await pg.goto(url, { waitUntil: 'load' }); await pg.addStyleTag({ content: 'html{scroll-behavior:auto!important}' }); await pg.waitForTimeout(6000);
    await axe(pg, L('initial'));                       // before animations play: dimmed elements
    await settle(pg);
    await axe(pg, L('settled'));
    await pg.screenshot({ path: path.join(OUT, `${name}-${W}.png`), fullPage: true });
    // sticky header over each dark band: measure the menu text against the real pixels behind it
    if (await pg.evaluate(() => getComputedStyle(document.querySelector('.hd')).position === 'sticky')) {
      const tops = await pg.evaluate(() => [...document.querySelectorAll('.hero,.band-navy,.bg-navy,.ft,.stat-n,.endcta,.chat,img')].filter(e => !e.closest('dialog,.hd')).map(e => Math.round(e.getBoundingClientRect().top + scrollY + Math.min(30, e.getBoundingClientRect().height / 2))).filter(y => y > 100));
      for (const y of [...new Set(tops)]) {
        await pg.evaluate(y => scrollTo(0, y), y); await pg.waitForTimeout(120);
        for (const sel of ['.nav a:not([aria-current])', '.nav a[aria-current]']) if (await pg.$(sel)) await pixelFixed(pg, L('header-over-y' + y), sel);
      }
      await pg.evaluate(() => scrollTo(0, 0));
    }
    // sideways scroll
    const hs = await pg.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
    if (hs.sw > hs.cw) res.hscroll.push({ label: L('settled'), ...hs });
    // tap targets under 24px (inline links in running text are exempt under 2.5.8)
    const small = await pg.evaluate(() => [...document.querySelectorAll('a[href],button,summary,input,select,textarea,[role=button],[tabindex]:not([tabindex="-1"])')].filter(e => {
      if (e.closest('dialog:not([open])')) return false;
      const r = e.getBoundingClientRect(); if (!r.width || !r.height) return false;
      const cs = getComputedStyle(e); if (cs.visibility === 'hidden') return false;
      const inline = cs.display === 'inline' && e.parentElement && [...e.parentElement.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      return !inline && (r.width < 24 || r.height < 24);
    }).map(e => { const r = e.getBoundingClientRect(); return `${e.tagName}.${e.className} "${(e.innerText || e.getAttribute('aria-label') || '').slice(0, 30)}" ${Math.round(r.width)}x${Math.round(r.height)}`; }));
    if (small.length) res.tap.push({ label: L('settled'), small });
    // expanded rows + sticky bar on phones
    await pg.evaluate(() => { document.querySelectorAll('details').forEach(d => { if (!d.closest('dialog')) d.open = true; }); scrollTo(0, Math.round(document.documentElement.scrollHeight * .45)); });
    await pg.waitForTimeout(700);
    const stk = await pg.evaluate(() => { const s = document.querySelector('.stk'); return s ? { on: s.classList.contains('is-on'), display: getComputedStyle(s).display } : null; });
    res.sticky.push({ label: L('expanded'), stk });
    await axe(pg, L('expanded'));
    await pg.screenshot({ path: path.join(OUT, `${name}-${W}-expanded-view.png`) });
    const hs2 = await pg.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
    if (hs2.sw > hs2.cw) res.hscroll.push({ label: L('expanded'), ...hs2 });
    // skip link shown
    await pg.evaluate(() => { scrollTo(0, 0); document.querySelector('.skip')?.focus(); }); await pg.waitForTimeout(300);
    const skipTop = await pg.evaluate(() => { const s = document.querySelector('.skip'); return s ? s.getBoundingClientRect().top : null; });
    if (skipTop === null || skipTop < 0) res.notes.push({ label: L('skip'), skipNotShown: skipTop });
    await axe(pg, L('skip'));
    { const c = await pg.evaluate(() => { const s = document.querySelector('.skip'), cs = getComputedStyle(s); const n = v => v.match(/[\d.]+/g).slice(0, 3).map(Number); return { fg: n(cs.color), bg: n(cs.backgroundColor), on: document.activeElement === s }; }); const rec = { label: L('skip'), sel: '.skip', text: 'Skip to content (computed colours)', min: +cr(c.fg, c.bg).toFixed(2), need: 7, focused: c.on }; res.pixel.push(rec); if (rec.min < 7 || !c.on) res.pixelFails.push(rec); }
    await pg.screenshot({ path: path.join(OUT, `${name}-${W}-skip.png`), clip: { x: 0, y: 0, width: W, height: 120 } });
    await pg.evaluate(() => document.activeElement.blur());
    // phone menu open: scan it, then Escape must close it and hand focus back
    if (await pg.evaluate(() => { const n = document.querySelector('.nav-btn'); return !!n && getComputedStyle(n).display !== 'none'; })) {
      await pg.evaluate(() => scrollTo(0, 0)); await pg.focus('.nav-btn'); await pg.keyboard.press('Enter'); await pg.waitForTimeout(400);
      const opened = await pg.evaluate(() => document.querySelector('.nav-btn').getAttribute('aria-expanded') === 'true' && getComputedStyle(document.querySelector('.nav')).display !== 'none');
      await axe(pg, L('menu-open'));
      await pg.screenshot({ path: path.join(OUT, `${name}-${W}-menu.png`), clip: { x: 0, y: 0, width: W, height: 420 } });
      const mh = await pg.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      if (mh.sw > mh.cw) res.hscroll.push({ label: L('menu-open'), ...mh });
      await pg.keyboard.press('Tab'); const firstLink = await pg.evaluate(() => !!document.activeElement.closest('.nav'));
      await pg.keyboard.press('Escape'); await pg.waitForTimeout(200);
      const after = await pg.evaluate(() => ({ closed: document.querySelector('.nav-btn').getAttribute('aria-expanded') === 'false', back: document.activeElement.classList.contains('nav-btn') }));
      res.drawers.push({ label: L('menu'), opened: opened && firstLink, closedByEsc: after.closed, focusReturned: after.back });
    }
    // drawers
    const ids = await pg.evaluate(() => [...new Set([...document.querySelectorAll('[data-open]')].map(e => e.dataset.open))]);
    for (const id of ids) {
      const opener = pg.locator(`[data-open="${id}"]`).first();
      await opener.scrollIntoViewIfNeeded(); await opener.focus(); await pg.keyboard.press('Enter'); await pg.waitForTimeout(900);
      const open = await pg.evaluate(id => document.getElementById(id).open, id);
      const body = `#${id} .dw-b`;
      const dh = await pg.evaluate(s => document.querySelector(s)?.scrollHeight || 0, body);
      for (let y = 0; y < dh; y += 300) { await pg.evaluate(([s, y]) => document.querySelector(s).scrollTo(0, y), [body, y]); await pg.waitForTimeout(450); }
      await pg.waitForTimeout(1500); await pg.evaluate(s => document.querySelector(s)?.scrollTo(0, 0), body); await pg.waitForTimeout(300);
      await pg.evaluate(id => document.querySelectorAll(`#${id} details`).forEach(d => d.open = true), id);
      await axe(pg, L('drawer-' + id));
      await pg.screenshot({ path: path.join(OUT, `${name}-${W}-drawer-${id}.png`) });
      const dhs = await pg.evaluate(s => { const e = document.querySelector(s); return e ? { sw: e.scrollWidth, cw: e.clientWidth } : null; }, body);
      if (dhs && dhs.sw > dhs.cw) res.hscroll.push({ label: L('drawer-' + id), ...dhs });
      await pg.keyboard.press('Escape'); await pg.waitForTimeout(500);
      const after = await pg.evaluate(id => ({ open: document.getElementById(id).open, back: document.activeElement?.dataset?.open === id }), id);
      res.drawers.push({ label: L(id), opened: open, closedByEsc: !after.open, focusReturned: after.back });
    }
    // text spacing (WCAG 1.4.12)
    await pg.addStyleTag({ content: '*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}' });
    await pg.waitForTimeout(400);
    const sp = await pg.evaluate(() => {
      const de = document.documentElement, out = { sw: de.scrollWidth, cw: de.clientWidth, clipped: [] };
      for (const e of document.querySelectorAll('body *')) {
        if (e.closest('dialog:not([open])') || e.closest('svg') || e.closest('astro-dev-toolbar')) continue;
        const cs = getComputedStyle(e); if (!/hidden|clip/.test(cs.overflowX + cs.overflowY)) continue;
        if (!(e.innerText || '').trim()) continue; const r = e.getBoundingClientRect(); if (!r.width || !r.height || r.width < 3) continue;
        if (e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 1) out.clipped.push(`${e.tagName}.${e.className} ${e.scrollWidth}x${e.scrollHeight} in ${e.clientWidth}x${e.clientHeight}`);
      }
      return out;
    });
    if (sp.sw > sp.cw || sp.clipped.length) res.spacing.push({ label: L('spacing'), ...sp });
    await pg.screenshot({ path: path.join(OUT, `${name}-${W}-spacing.png`), fullPage: true });
    await ctx.close();
  }
  await b.close();
  fs.writeFileSync(path.join(OUT, `result-${W}.json`), JSON.stringify(res, null, 1));
  console.log(W, 'scans', res.scans, 'violations', res.violations.length, 'pixelMeasured', res.pixel.length, 'pixelFails', res.pixelFails.length, 'hscroll', res.hscroll.length, 'tap', res.tap.length, 'spacing', res.spacing.length, 'notes', res.notes.length);
})();
