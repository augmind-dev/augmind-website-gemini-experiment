# Checks

The same checks the live AugMind site passes. Run them before every push that changes what visitors see.

## Set up once

```sh
cd tools/checks
npm install
npx playwright install chromium
```

## Run against a local build

```sh
# from the repository root
npm run build

# in tools/checks, in one terminal
npm run serve                     # serves dist/client at http://localhost:8812

# in tools/checks, in a second terminal (repository root): npx astro dev --port 4321
# /scheduling is rendered on demand, so the static server cannot serve it

PAGES=/,/ai-search,/healthcare,/questions,/privacy-policy,/terms-of-use,/scheduling,/no-such-page
for W in 320 393 900 1440; do
  PAGES=$PAGES BASE=http://localhost:8812 SCHED_BASE=http://localhost:4321 node scan.cjs $W out
done
PAGES=$PAGES BASE=http://localhost:8812 SCHED_BASE=http://localhost:4321 KEYS_OUT=out/keyboard.json node keys.cjs
node summarise.cjs out "local build"
```

## Run against the deployed experiment site

Set `BASE=https://augmind-website-gemini-experiment.vercel.app` and leave `SCHED_BASE` unset.

## What a pass means

- 0 accessibility violations (axe-core with WCAG A, AA and AAA rules) on every page at 320, 393, 900 and 1440 px.
- Each page is checked in several states: as loaded, after animations, with every row expanded, with the phone sticky bar showing, with the skip link focused, with the phone menu open, and with each drawer open.
- 0 contrast failures, including text measured from pixels where axe cannot decide.
- No sideways scroll, no tap target under 24 px, nothing clipped under WCAG text spacing.
- `out/keyboard.json` lists 0 issues: menus and drawers open, close with Escape and return focus.

## If you change the components

The scripts find the menu button, drawers, sticky bar and skip link by their class names, near the top of `scan.cjs` and `keys.cjs`. If you rename or replace those components, update the selectors there and say so in `EXPERIMENT-LOG.md`. A check that cannot find a component is not a pass.

## The live site's baseline (26 Nov 2026)

156 scans, 0 violations, 0 contrast failures, 0 layout problems, 0 keyboard issues. Lighthouse 100 for performance, accessibility, best practices and SEO on four pages.
