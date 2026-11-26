> **Experiment copy.** This repo is a public sandbox copy of the AugMind website, taken on 26 Nov 2026. Nothing here is the live site. Every page is `noindex`. The consultation form is not connected. Work that should go live must be moved to the real repo and approved by the owner.

# AugMind website: experiment copy

Coding agents: read `AGENTS.md` first, then `DESIGN-SYSTEM.md`.

The augmind.ai site: Astro 7, static pages plus one on-demand page (`/scheduling`) and one server Action (the consultation form), hosted on Vercel with `@astrojs/vercel`.

## Run it

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # astro check, then build to dist/ (static pages in dist/client); must report 0 errors
```

Node 22.12 or later. The form needs `CONSULT_WEBHOOK_URL` and `CONSULT_WEBHOOK_KEY`; without them it shows its failure message.

## Where things live

| Path | What it is |
|---|---|
| `src/pages/index.astro`, `healthcare.astro`, `questions.astro`, `404.astro` | The pages. Copy that repeats lives in `src/data/`. |
| `src/pages/scheduling.astro` | The form on its own page, and the no-script landing for every form (field errors, failure message, confirmation). |
| `src/pages/privacy-policy.md`, `terms-of-use.md` | Legal pages, rendered by `src/layouts/Legal.astro`. |
| `src/pages/questions.md.ts` | `/questions.md`, built from `src/data/faqs.ts`. |
| `src/layouts/Base.astro` | Head, header, footer, phone sticky CTA. `noindex` unless `VERCEL_ENV=production`. |
| `src/components/` | One component per block of the page. |
| `src/data/site.ts`, `src/data/faqs.ts` | Shared copy and figures: partners, ledger, steps, gates, FAQs. |
| `src/styles/site.css` | All styles. Mobile first, min-width layers only (481, 721, 861, 1000px). |
| `src/scripts/site.js` | All behaviour: motion, drawers, ledger rows, sticky CTA, form sending. |
| `src/actions/index.ts` | `consult` Action: validates and POSTs to the n8n workflow with the `x-augmind-key` header. |
| `public/index.md`, `llms.txt`, `*.md` | Markdown copies for AI readers. Update `index.md` when homepage copy changes. |
| `scripts/qa/` | The QA checks (axe, tap targets, 320px scroll, banned words) and the motion recorder. |
| `vercel.json` | Clean URLs, 301s for retired URLs, Markdown headers. Deploys are off for the working branch. |
