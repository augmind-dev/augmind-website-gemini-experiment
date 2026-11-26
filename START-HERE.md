# Start here: make the AugMind website better

**Your job:** design a better AugMind website than the one live today, with your own design system. You have full creative control of the look. Prove it is better with the same checks the live site passes.

The live site was designed and built with Claude. This is a fair contest: same content, same rules, same tests. Beat it.

## Start here

1. Read `AGENTS.md`. Its rules are not negotiable.
2. Read `DESIGN-SYSTEM.md` to see the current design system, then open the live experiment site: https://augmind-website-gemini-experiment.vercel.app
3. Read `tools/guides/colour-evaluation.md` and `tools/guides/evidence-tags.md`.
4. Run the checks in `tools/checks/README.md` once before you change anything, so you know the starting point.

## Who the site is for

AugMind checks the leads that Google and Meta report against a business's real sales records, and checks whether AI assistants name the business. Visitors are owners and marketing leads at service businesses, including healthcare practices. The one action on every page is booking a call ("Pick a time").

## What you own

- **Your own design system.** Create it in `design-system-gemini/`, with the same parts as `design-system/`: a brand book (`README.md`), `tokens.json`, and one folder per component with guidelines and a preview. Then regenerate `DESIGN-SYSTEM.md` from your tokens so it describes what you built. Keep the old `design-system/` folder for comparison.
- **The look:** colour, type, spacing, layout, motion, imagery treatment and components.
- **Page structure:** order, emphasis and how sections work, as long as all the content is still there.

## What is fixed

- Every fact, number, title, bio and promise in `src/data/`. Rewrite headings and layout freely, but invent nothing.
- Teal stays as a brand colour. Everything else about the palette is yours.
- Logos are used unchanged.
- No phone number and no email address. The form stays disconnected.
- Every page stays `noindex, nofollow`.
- WCAG 2.2 AA everywhere, AAA for text contrast (7:1, or 4.5:1 for large text). Every status shows an icon, a word and a colour.

## How to work

1. **Diagnose first.** Before designing, write down in `EXPERIMENT-LOG.md` what is weak about the current design and why. Tag each point: *Measured* if you computed it from the code or pixels, *Benchmark* if you measured it on other sites, *Source read* if you read it (with the year), *Judgement* if it is your opinion.
2. **Benchmark on full pages**, not first screens. Name the sites you compared against, and which failed to load.
3. **Design the system, then the pages.** Tokens first, then components, then pages. Change tokens in one place.
4. **Check every state**, not only the page at rest: the phone menu open, each drawer open, expanded rows, the phone sticky bar, the skip link focused, the 404 page.
5. **Run the checks before every push.** Fix anything they find. If you replace a component the checks look for, update their selectors and say so.
6. **Push small steps to `main`.** Each push redeploys the experiment site, so the owner can watch it change.

## What to hand back

1. The site, live at https://augmind-website-gemini-experiment.vercel.app
2. `design-system-gemini/`, complete, plus a regenerated `DESIGN-SYSTEM.md`.
3. `EXPERIMENT-LOG.md`, newest first:
   - the diagnosis, tagged;
   - what you changed and why;
   - check results at 320, 393, 900 and 1440 px;
   - Lighthouse scores for performance, accessibility and best practices on four pages (SEO reads low here on purpose, because every page is `noindex`);
   - what you did not check.

## How it will be judged

The owner compares your site with the live one, page by page.

1. **The rules above all hold.** One broken rule fails the round.
2. **Checks:** 0 violations, 0 contrast failures, 0 layout problems, 0 keyboard issues. The live site's baseline is exactly that, across 156 scans.
3. **Lighthouse** no lower than the live site's (100 for performance, accessibility and best practices).
4. **Design quality**, weighted as Awwwards weights it: design 40%, usability 30%, creativity 20%, content 10%.
5. **Evidence:** claims about why your design is better are tagged, and judgement is not passed off as measurement.
6. **How cleanly it could move** to the real site: tokens in one place, components that map to the existing ones.

Be bold with the design and strict with the rules.
