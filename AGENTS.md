# Rules for coding agents in this repository

This repository is an **experiment copy** of the AugMind website. It is a sandbox. Nothing here is the live site.

- The real site lives in a different repository and at a different address. Do not ask for access to it.
- A push to `main` here redeploys the experiment site only: https://augmind-site-gemini.vercel.app
- The owner decides what, if anything, moves from here to the real site.

## Read these first

1. `DESIGN-SYSTEM.md`: every colour, type style, spacing step and component, in one file.
2. `design-system/README.md`: the full brand book, including how the site writes.
3. `src/styles/site.css`: all styles, with every value as a CSS variable.
4. `src/data/site.ts` and `src/data/faqs.ts`: all shared copy, figures and people.

## What you are free to change

Layout, visual design, motion, components and page structure. Be bold; that is the point of the experiment.

## What must stay true

1. **Never indexable.** Every page keeps `noindex, nofollow` (see `src/layouts/Base.astro`). Do not remove it.
2. **No invented facts.** Do not add or change any number, statistic, title, bio, client name or promise. All such content comes from `src/data/`. If a design needs a figure, use one already there or label the new one clearly as an example.
3. **No phone number and no email address** anywhere on the site.
4. **Levarum wording stays as written**, with the ownership line beside its logo.
5. **Teal stays.** It is a brand colour. You may change how it is used, not remove it.
6. **Logos are not edited.** Copy logo files unchanged; use the `-inverse` file on dark grounds; never recolour them with a CSS filter.
7. **Accessibility:** WCAG 2.2 AA, and AAA for text contrast (7:1, or 4.5:1 for large text). Every status shows an icon, a word and a colour, because some readers are red-green colour blind. Keyboard users must reach every control, and menus and drawers must close with Escape and return focus.
8. **Do not connect the form** or add any secret, key, analytics or third-party script.

## How to work

- Stack: Astro with the Vercel adapter, Node 22.12 or later.
- `npm install`, then `npm run dev` (http://localhost:4321). `npm run build` runs the type check and the build; it must finish with 0 errors before you push.
- If you change a token or a component, update `design-system/` and `DESIGN-SYSTEM.md` to match.
- Keep a short log of what you changed and why in `EXPERIMENT-LOG.md` at the repository root, newest first. Say what you checked and what you did not check.

## How the result will be judged

The experiment is compared with the current live site on:

1. The build passes and the rules above still hold.
2. Accessibility, contrast, layout and keyboard checks pass at 320, 393, 900 and 1440 px, with menus and drawers open.
3. Lighthouse scores are no lower than the live site's (100 for performance, accessibility, best practices and SEO on the pages measured; SEO will read lower here because this copy is never indexed).
4. Design quality, weighted as Awwwards weights it: design 40%, usability 30%, creativity 20%, content 10%.
5. How cleanly the changes could be moved to the real repository.
