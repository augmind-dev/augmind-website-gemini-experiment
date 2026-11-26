# Post-processes figma/*.html after figma_pack.py.
# Figma's html_to_figma mis-sizes flex-wrap rows that sit inside a margin wrapper (wrapper = 100px, row centred off-frame).
# Fix: render each frame in Chromium at its width and freeze every flex-wrap row to what it actually renders as:
#   one line -> flex-wrap:nowrap; one child per line -> flex-direction:column (same gaps, left-aligned).
import glob, re, sys
from playwright.sync_api import sync_playwright

JS = r'''() => {
  const out = [];
  // 1. html_to_figma ignores [hidden] and display:none: drop anything not rendered, plus the off-screen honeypot.
  let gone = 0;
  for (const e of [...document.querySelectorAll('.fig-frame *')]) {
    if (!e.isConnected || e.closest('svg') && e.tagName.toLowerCase() !== 'svg') continue;
    if (getComputedStyle(e).display === 'none' || e.classList.contains('hp')) { e.remove(); gone++; }
  }
  out.push('removed:' + gone);
  // 2. A grid item with a margin gets a synthetic ":margin" wrapper in Figma that comes out 100px wide, with the item
  //    centred in it (so it spills off the left edge). Seen only on display:flex items; others import fine. Move the margin onto a real wrapper as padding instead.
  let wrapped = 0;
  const M = ['Top', 'Right', 'Bottom', 'Left'];
  for (const e of [...document.querySelectorAll('.fig-frame *')]) {
    const P = e.parentElement; if (!P || e.closest('svg')) continue;
    const pd = getComputedStyle(P).display; if (!pd.includes('grid')) continue;
    const cs = getComputedStyle(e);
    if (cs.display !== 'flex' || cs.position === 'absolute' || M.every(k => parseFloat(cs['margin' + k]) === 0)) continue;
    const w = document.createElement('div');
    w.style.display = 'flex'; w.style.flexDirection = 'column'; w.style.minWidth = '0';
    for (const k of M) w.style['padding' + k] = cs['margin' + k];
    for (const k of ['gridColumnStart', 'gridColumnEnd', 'gridRowStart', 'gridRowEnd', 'alignSelf', 'justifySelf', 'order'])
      w.style[k] = cs[k];
    e.style.margin = '0'; P.insertBefore(w, e); w.appendChild(e); wrapped++;
  }
  out.push('wrapped:' + wrapped);
  for (const e of document.querySelectorAll('.fig-frame *')) {
    const cs = getComputedStyle(e);
    if (!cs.display.includes('flex') || cs.flexWrap !== 'wrap' || cs.flexDirection !== 'row') continue;
    const kids = [...e.children].filter(c => c.getBoundingClientRect().width > 0 && getComputedStyle(c).position !== 'absolute');
    if (kids.length < 2) { e.style.flexWrap = 'nowrap'; out.push(e.className + ':nowrap'); continue; }
    const lines = [];
    for (const k of kids) {
      const r = k.getBoundingClientRect();
      const l = lines.find(l => r.top < l.b && r.bottom > l.t);
      if (l) { l.n++; l.t = Math.min(l.t, r.top); l.b = Math.max(l.b, r.bottom); } else lines.push({t: r.top, b: r.bottom, n: 1});
    }
    if (lines.length === 1) { e.style.flexWrap = 'nowrap'; out.push(e.className + ':nowrap'); }
    else if (lines.every(l => l.n === 1)) {
      e.style.flexWrap = 'nowrap'; e.style.flexDirection = 'column';
      e.style.alignItems = cs.alignItems === 'stretch' ? 'stretch' : 'flex-start';
      e.style.columnGap = '0px'; out.push(e.className + ':column');
    } else out.push(e.className + ':LEFT-AS-IS(' + lines.map(l => l.n).join('/') + ')');
  }
  return out;
}'''

files = sorted(glob.glob('/home/claude/v11/figma/*.html'))
with sync_playwright() as p:
    b = p.chromium.launch()
    for f in files:
        src = open(f).read()
        w = int(re.search(r'--fw:(\d+)px', src).group(1))
        pg = b.new_page(viewport={'width': w, 'height': 900})
        pg.goto('file://' + f); pg.wait_for_timeout(300)
        before = pg.evaluate('document.querySelector(".fig-frame").getBoundingClientRect().height')
        log = pg.evaluate(JS)
        after = pg.evaluate('document.querySelector(".fig-frame").getBoundingClientRect().height')
        frame = pg.evaluate('document.querySelector(".fig-frame").outerHTML')
        pg.close()
        src = re.sub(r'<div class="fig-frame".*</div></body>', lambda m: frame + '</body>', src, count=1, flags=re.S)
        open(f, 'w').write(src)
        print(f.split('/')[-1], f'h {before:.0f}->{after:.0f}', log)
