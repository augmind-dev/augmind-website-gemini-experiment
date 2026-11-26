// Keyboard walk-through: Tab through every page at 393 and 1440; each stop must be visible, show a focus ring, and not sit under the sticky bars.
const { chromium } = require('playwright');
const PAGES = (process.env.PAGES || '/,/no-such-page').split(',').map(s => s.trim()).filter(Boolean); // comma-separated paths; include one that does not exist
(async () => {
  const b = await chromium.launch(); let bad = 0;
  for (const W of [393, 1440]) for (const p of PAGES) {
    const pg = await b.newPage({ viewport: { width: W, height: 800 } });
    if (process.env.SHARE) await pg.goto(process.env.SHARE);
    await pg.goto((p === '/scheduling' ? (process.env.SCHED_BASE || process.env.BASE || 'http://localhost:4321') : (process.env.BASE || 'http://localhost:8812')) + p); await pg.waitForTimeout(1500);
    await pg.evaluate(() => document.querySelectorAll('astro-dev-toolbar').forEach(e => e.remove())); await pg.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    const expected = await pg.evaluate(() => [...document.querySelectorAll('a[href],button,summary,input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(e => !e.closest('dialog') && !e.disabled && e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden').length);
    const stops = [], issues = [];
    for (let i = 0; i < 200; i++) {
      await pg.keyboard.press('Tab'); await pg.waitForTimeout(i === 0 ? 400 : 200);
      const s = await pg.evaluate(() => {
        const e = document.activeElement; if (!e || e === document.body) return null;
        const cs = getComputedStyle(e), r = e.getBoundingClientRect();
        const ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2) || cs.boxShadow !== 'none';
        const stk = document.querySelector('.stk.is-on'), sr = stk && getComputedStyle(stk).display !== 'none' ? stk.getBoundingClientRect() : null;
        const hd = document.querySelector('.hd'), hr = getComputedStyle(hd).position === 'sticky' ? hd.getBoundingClientRect() : null;
        const inView = r.bottom > 0 && r.top < innerHeight && r.width > 0;
        const under = (sr && !e.closest('.stk') && r.top >= sr.top - 1) || (hr && !hd.contains(e) && !e.classList.contains('skip') && r.bottom <= hr.bottom + 1);
        return { d: `${e.tagName}.${String(e.className).slice(0, 20)} "${(e.innerText || e.getAttribute('aria-label') || '').trim().slice(0, 28)}"`, ring, inView, under: !!under, outline: cs.outlineColor };
      });
      if (!s) break;
      if (stops.length && s.d === stops[0].d && i > 2) break;   // wrapped round
      stops.push(s);
      if (!s.ring) issues.push('no focus ring: ' + s.d);
      if (!s.inView) issues.push('off screen: ' + s.d);
      if (s.under) issues.push('hidden under a sticky bar: ' + s.d);
    }
    const first = stops[0]?.d || '';
    if (!/skip/i.test(first)) issues.push('first stop is not the skip link: ' + first);
    // skip link: Enter, then the next Tab must land inside <main>
    await pg.evaluate(() => { scrollTo(0, 0); document.querySelector('.skip').focus(); }); await pg.keyboard.press('Enter'); await pg.waitForTimeout(300); await pg.keyboard.press('Tab');
    const inMain = await pg.evaluate(() => !!document.activeElement.closest('main,#main'));
    const mainHasStops = await pg.evaluate(() => !!document.querySelector('#main a[href], #main button, #main summary'));
    if (mainHasStops && !inMain) issues.push('skip link does not move focus into main');
    bad += issues.length;
    console.log(`${W} ${p}: ${stops.length} stops (expected ${expected})` + (stops.length !== expected && stops.length !== expected + 1 ? '  COUNT DIFFERS' : '') + (issues.length ? '\n   ' + [...new Set(issues)].join('\n   ') : '  ok'));
    await pg.close();
  }
  await b.close(); console.log('issues:', bad); require('fs').writeFileSync(process.env.KEYS_OUT || 'keyboard.json', JSON.stringify({ issues: bad }));
})();
