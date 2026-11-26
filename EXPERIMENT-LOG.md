# Experiment log

## 2026-11-26 — Astro and Node maintenance

- Upgraded Astro to 7.4.13 and @astrojs/sitemap to 3.7.6. Regenerated the npm lockfile and set the Node range to `>=22.23.4 <23` to match the experiment’s Vercel Node 22.x setting.
- Built the baseline and upgrade with Node 22.23.4. The upgrade reported 0 errors, 0 warnings, and the same 3 existing hints. Static build output matched the baseline byte for byte.
- Ran 156 local scans at 320, 393, 900, and 1440 px. All accessibility, contrast, layout, tap-target, spacing, menu, drawer, and keyboard checks passed.
- Local Lighthouse scored 100 for performance, accessibility, and best practices on the home, AI search, healthcare, and questions pages.
- Checks did not submit consultation requests.
