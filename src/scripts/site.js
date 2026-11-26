// AugMind v11.2 — the site's behaviour layer (bundled by Astro). Everything works without it except the
// drawers: with no script the forms post to /scheduling and every animated piece shows finished.
import { actions, isInputError } from 'astro:actions';

(() => {
  const d = document, $ = (s, r = d) => r.querySelector(s), $$ = (s, r = d) => [...r.querySelectorAll(s)];
  d.documentElement.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- v11.2 motion (ported from the v10 site). Everything below shows finished under reduced motion. ----------
  const IO = 'IntersectionObserver' in window;
  // Run fn once el is on screen (at once under reduced motion or without IntersectionObserver).
  // The threshold is capped so an element taller than the screen (400% zoom, small landscape phones) can still count as
  // seen: otherwise its hidden-until-played content would stay hidden for good.
  const whenSeen = (el, fn, threshold = .3) => {
    if (!el) return;
    if (reduce || !IO) { fn(); return; }
    const h = el.getBoundingClientRect().height || 1, th = Math.min(threshold, Math.max(.05, (innerHeight * .8) / h));
    new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { o.disconnect(); fn(); } }), { threshold: th }).observe(el);
  };
  // Count the number in el up from 0, keeping its prefix, suffix and thousands separators; ends on the original text.
  const countUp = (el, ms = 900) => {
    if (!el || reduce) return;
    const txt = el.textContent, m = txt.match(/^(\D*)([\d,]+)([\s\S]*)$/); if (!m) return;
    const to = +m[2].replace(/,/g, ''), comma = m[2].includes(','), t0 = performance.now();
    const fmt = n => m[1] + (comma ? n.toLocaleString('en-US') : String(n)) + m[3];
    el.textContent = fmt(0);
    const step = now => { const p = Math.min(1, (now - t0) / ms); if (p < 1) { el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - p, 3)))); requestAnimationFrame(step); } else el.textContent = txt; };
    requestAnimationFrame(step);
  };
  // The hero intro (html.intro, set in <head>) plays when a visitor arrives from outside the site; the ledger waits for it.
  const intro = d.documentElement.classList.contains('intro');
  const t0 = performance.now(), introWait = () => intro ? Math.max(150, 1000 - (performance.now() - t0)) : 150;

  // Ledger: totals count up, then each channel is checked in turn: bars sweep, share counts up, the tag stamps in.
  const ledger = $('.ledger');
  if (ledger) {
    const rows = $$('.lg-row', ledger), geo = $('.lg-geo', ledger);
    whenSeen(ledger, () => {
      if (reduce) { ledger.classList.add('is-play'); rows.forEach(r => r.classList.add('is-on')); geo?.classList.add('is-on'); return; }
      setTimeout(() => {
        ledger.classList.add('is-play');
        $$('.lg-kpi b', ledger).forEach(b => countUp(b, 1100));
        rows.forEach((r, i) => setTimeout(() => { r.classList.add('is-on'); countUp($('.lg-pct', r), 800); }, 250 + i * 480));
        setTimeout(() => geo?.classList.add('is-on'), 250 + rows.length * 480 + 150);
      }, introWait());
    }, .35);
  }

  // Truth gap: the three example leads are traced one at a time and stamped.
  const trace = $('.trace');
  whenSeen(trace, () => trace.classList.add('is-in'), .3);

  // AI answer: the question is sent, the assistant types, three businesses pop in, then "isn't named" lands.
  const chat = $('.chat');
  whenSeen(chat, () => {
    if (reduce) { chat.classList.add('is-q', 'is-a', 'is-done'); return; }
    const a = $('.a', chat), dots = $('.typing', chat);
    if (dots && a) dots.style.top = a.offsetTop + 'px';
    chat.classList.add('is-q');
    setTimeout(() => chat.classList.add('is-typing'), 550);
    setTimeout(() => { chat.classList.remove('is-typing'); chat.classList.add('is-a'); }, 1750);
    setTimeout(() => chat.classList.add('is-done'), 1750 + 3 * 280 + 650);
  }, .45);

  // Steps: the inked drawings draw their accent stroke in.
  $$('.steps').forEach(s => whenSeen(s, () => s.classList.add('is-in'), .25));

  // Levarum credit: drops in with a dot burst. The logo is a toy, as on the v10 site: pull it and it stretches away
  // with resistance, then snaps back with a spin and a jiggle; it lags a little behind the scroll. Off under reduced motion.
  const credit = $('.credit');
  whenSeen(credit, () => credit.classList.add('is-in'), .6);
  if (!reduce) $$('[data-lev-spring]').forEach(el => {
    let x = 0, y = 0, a = 0, vx = 0, vy = 0, va = 0, tx = 0, ty = 0, ta = 0, drag = null, moved = 0, raf = 0, last = 0, seen = false;
    const K = .12, D = .18, KA = .012, DA = .17, MAX = 44, soft = v => MAX * Math.tanh(v / (MAX * 1.6));
    const tick = t => {
      const dt = Math.min(32, last ? t - last : 16) / 16; last = t;
      if (drag) { x += (tx - x) * .35 * dt; y += (ty - y) * .35 * dt; a += (tx * .5 - a) * .3 * dt; vx = vy = va = 0; }
      else { vx += (-K * x - D * vx) * dt; vy += (-K * y - D * vy) * dt; va += (KA * (ta - a) - DA * va) * dt; x += vx * dt; y += vy * dt; a += va * dt; }
      el.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) rotate(${a.toFixed(2)}deg)`;
      if (drag || Math.abs(x) + Math.abs(y) + Math.abs(vx) + Math.abs(vy) + Math.abs(ta - a) + Math.abs(va) > .08) raf = requestAnimationFrame(tick);
      else { x = y = a = ta = vx = vy = va = 0; el.style.transform = ''; raf = 0; last = 0; }
    };
    const go = () => { if (!raf) raf = requestAnimationFrame(tick); };
    let lastY = scrollY;
    addEventListener('scroll', () => {
      const dy = scrollY - lastY; lastY = scrollY;
      const r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
      vy += Math.max(-3, Math.min(3, -dy * .08)); go();
    }, { passive: true });
    if (IO) new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting && !seen) { seen = true; setTimeout(() => { vy -= 7; go(); }, 1300); o.disconnect(); } }), { threshold: .6 }).observe(el);
    el.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, id: e.pointerId }; moved = 0; tx = x; ty = y; try { el.setPointerCapture(e.pointerId); } catch (_) { /* old browsers */ } go(); });
    el.addEventListener('pointermove', e => { if (!drag || e.pointerId !== drag.id) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; moved = Math.max(moved, Math.abs(dx) + Math.abs(dy)); tx = soft(dx); ty = soft(dy); });
    const up = e => {
      if (!drag || e.pointerId !== drag.id) return;
      drag = null; vx += (tx - x) * .2; vy += (ty - y) * .2; a = a % 360; ta = tx < 0 ? -360 : 360; go();
      const lc = el.closest('.lc'); if (lc) { lc.classList.remove('is-pop'); void lc.offsetWidth; lc.classList.add('is-pop'); }
    };
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => el.addEventListener(t, up));
  });

  // 5-gate drawer: plays each time it opens. Each gate plays as it scrolls into view, at least 550ms apart, and the six
  // example businesses at the top drop out as the gates play. "Ask again" scrolls back up and plays it again.
  const gates = $('[data-gates]');
  if (gates) {
    const dlg = gates.closest('dialog'), items = $$('.gate', gates), field = $$('.field-d i', dlg), again = $('[data-gates-again]', dlg);
    let queue = [], timer = 0, obs = null;
    const sync = () => {
      const n = items.filter(g => g.classList.contains('is-in')).length;
      field.forEach((f, k) => { f.classList.toggle('is-out', k >= 6 - Math.min(n, 4)); f.classList.toggle('is-named', n >= 5 && k < 2); f.classList.toggle('is-linked', n >= 5 && k === 0); });
    };
    const show = g => { g.classList.add('is-in'); sync(); };
    const pump = () => { if (timer || !queue.length) return; show(queue.shift()); timer = setTimeout(() => { timer = 0; pump(); }, 550); };
    const arm = () => {
      if (reduce || !IO) { items.forEach(show); return; }
      obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { obs.unobserve(e.target); queue.push(e.target); pump(); } }), { threshold: .25 });
      items.forEach(g => obs.observe(g));
    };
    const reset = () => {
      obs?.disconnect(); queue = []; clearTimeout(timer); timer = 0;
      gates.classList.add('is-reset'); items.forEach(g => g.classList.remove('is-in')); sync(); void gates.offsetWidth;
      requestAnimationFrame(() => requestAnimationFrame(() => gates.classList.remove('is-reset')));
    };
    const play = wait => { reset(); setTimeout(arm, wait); };
    new MutationObserver(() => { if (dlg.open) play(350); }).observe(dlg, { attributes: true, attributeFilter: ['open'] });
    if (dlg.open) play(350);
    again?.addEventListener('click', () => {
      reset();
      const body = $('.dw-b', dlg), top = body.scrollTop + $('.field', dlg).getBoundingClientRect().top - body.getBoundingClientRect().top - 16;
      body.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' });
      setTimeout(arm, reduce ? 0 : 600);
    });
  }

  // Ledger rows expand to show the reconciliation behind each channel.
  $$('.lg-btn').forEach(b => b.addEventListener('click', () => {
    const open = b.getAttribute('aria-expanded') === 'true';
    b.setAttribute('aria-expanded', String(!open));
    $('#' + b.getAttribute('aria-controls')).hidden = open;
  }));

  // Sticky phone CTA: shows once the hero button has scrolled away, hides while a form is on screen.
  const stk = $('.stk'), heroCta = $('[data-hero-cta]'), forms = $$('[data-form-zone]');
  if (stk && 'IntersectionObserver' in window) {
    let pastHero = false, formVisible = false;
    const set = () => { const on = pastHero && !formVisible; stk.classList.toggle('is-on', on); stk.inert = !on; };
    if (heroCta) new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting && e.boundingClientRect.top < 0; set(); }).observe(heroCta);
    else {   // pages with no hero button (/ai-search, /questions): show the bar once the visitor has scrolled a little
      const check = () => { const past = scrollY > innerHeight * .6; if (past !== pastHero) { pastHero = past; set(); } };
      addEventListener('scroll', check, { passive: true }); check();
    }
    const seen = new Set();
    const fo = new IntersectionObserver(es => { es.forEach(e => e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)); formVisible = seen.size > 0; set(); });
    forms.forEach(f => fo.observe(f));
    stk.inert = true;
  }

  // Drawers: native <dialog> gives focus trapping, Esc to close and focus return.
  $$('[data-open]').forEach(b => b.addEventListener('click', e => {
    const dlg = $('#' + b.dataset.open); if (!dlg) return;
    e.preventDefault(); dlg.showModal(); dlg.querySelector('.dw-b').scrollTop = 0;
    history.replaceState(null, '', '#' + b.dataset.open);
  }));
  $$('dialog.dw').forEach(dlg => {
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', () => { if (location.hash === '#' + dlg.id) history.replaceState(null, '', location.pathname + location.search); });
    $$('[data-close]', dlg).forEach(x => x.addEventListener('click', () => dlg.close()));
  });
  if (location.hash.length > 1) {   // look the id up directly: a hash like #2026 or #utm=1&x=2 is not a valid selector and would throw
    let id = location.hash.slice(1);
    try { id = decodeURIComponent(id); } catch (_) { /* keep the raw text */ }
    const dlg = d.getElementById(id);
    if (dlg instanceof HTMLDialogElement) dlg.showModal();
  }

  // Forms: name and email required; honeypot; plain-word errors; sent in place through the consult Action
  // (src/actions/index.ts -> n8n); the confirmation takes focus. A failed send keeps what was typed and says so.
  const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const setErr = (inp, msg) => {
    const err = $('#' + inp.getAttribute('aria-describedby').split(' ')[0]);
    inp.setAttribute('aria-invalid', msg ? 'true' : 'false'); err.textContent = msg;
  };
  $$('form[data-am]').forEach(f => f.addEventListener('submit', async e => {
    e.preventDefault();
    const fail = $('[data-fail]', f); if (fail) fail.textContent = '';
    if ($('.hp input', f)?.value) return;            // bot filled the trap
    let first = null;
    $$('[data-req]', f).forEach(inp => {
      let msg = '';
      if (!inp.value.trim()) msg = inp.dataset.req;
      else if (inp.type === 'email' && !emailOk(inp.value.trim())) msg = 'Enter an email address like name@company.com.';
      setErr(inp, msg);
      if (msg && !first) first = inp;
    });
    if (first) {
      // Say how many fields need attention in the alert, so a screen reader hears more than the one that gets focus.
      const bad = $$('[data-req][aria-invalid="true"]', f);
      if (fail && bad.length > 1) fail.textContent = bad.length + ' fields need attention.';
      first.focus(); return;
    }
    const btn = $('button[type="submit"]', f), label = btn.textContent;
    // aria-disabled rather than disabled: a disabled button drops keyboard focus to the top of the page if the send fails.
    if (btn.getAttribute('aria-disabled') === 'true') return;
    btn.setAttribute('aria-disabled', 'true'); btn.textContent = 'Sending…';
    let result = null;
    try { result = await actions.consult(new FormData(f)); } catch (_) { result = null; }
    if (result && result.error && isInputError(result.error)) {
      // The server disagreed with a field the browser accepted: show it in the same place.
      Object.keys(result.error.fields).forEach(k => {
        const inp = $(`[name="${k}"][data-req]`, f);
        if (inp) { setErr(inp, k === 'email' ? 'Enter an email address like name@company.com.' : inp.dataset.req); if (!first) first = inp; }
      });
    }
    if (!result || result.error) {
      btn.removeAttribute('aria-disabled'); btn.textContent = label;
      if (first) { first.focus(); return; }
      const tpl = $('#' + f.dataset.done.replace(/-done$/, '-fail'));
      if (fail && tpl) fail.textContent = tpl.content.textContent;
      return;
    }
    const name = ($('[name="name"]', f)?.value || '').trim().split(' ')[0];
    const tpl = $('#' + f.dataset.done).content.cloneNode(true);
    const who = $('[data-name]', tpl); if (who) who.textContent = name ? ', ' + name : '';
    const box = d.createElement('div'); box.className = 'done'; box.tabIndex = -1; box.setAttribute('role', 'status'); box.append(tpl);
    $('.fsub', f.closest('.fcard'))?.setAttribute('hidden', '');   // "two required fields" is stale once the request is sent
    f.replaceWith(box); box.focus();
  }));
})();
