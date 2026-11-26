/** Inline SVG icons (v11). Rendered with set:html; every icon is decorative (aria-hidden). */
export const I = {
  tick: '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrow: '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h9M8.5 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chev: '<svg class="chev" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 3.5L10.5 8 6 12.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  x: '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  xc: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="currentColor"/><path d="M6.8 6.8l6.4 6.4M13.2 6.8l-6.4 6.4" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>',
  plus: '<svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 1v10M1 6h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  shield: '<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M9 1.8l6 2.3v4.6c0 3.7-2.6 6.4-6 7.5-3.4-1.1-6-3.8-6-7.5V4.1l6-2.3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M6.2 9.2l2 2 3.8-4.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  ok: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  review: '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.8"/><path d="M8 4.8v3.6M8 11h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  up: '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 13V3.5M4 7.5l4-4 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  alert: '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 2.2l6.2 11H1.8L8 2.2z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M8 6.6v3M8 11.6h.01" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
  equal: '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 6h9M3.5 10h9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
} as const;

/** The round tick used in check lists. */
export const tick = `<span class="tick">${I.tick}</span>`;

/** Hand-inked drawings (v10 site, restored in v11.2). `st-in` strokes draw themselves in; see site.css. */
export const inkArt = (cls: string, art: string) =>
  `<svg class="${cls}" viewBox="0 0 68 68" aria-hidden="true" focusable="false"><g filter="url(#ink-rough)">${art}</g></svg>`;
