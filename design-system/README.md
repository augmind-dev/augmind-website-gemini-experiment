# AugMind website design system

It describes the **live look** of the AugMind website as of 26 Nov 2026: ink blue bands alternating with light sections, with teal as the accent. The short version for coding agents is `DESIGN-SYSTEM.md` in the repository root.

> **The look.** The dark ground is ink blue `#0B1927`, the accent on dark is one bright teal `#49D9B9`, the main button on dark is teal, and the warning tag has an outline.

| File | What it is |
|---|---|
| `README.md` | This brand book: the rules for writing, colour, type, spacing and logos |
| `COLOUR-RATIONALE.md` | Every colour and design choice, the reason, Pantone's guidance and the nearest Pantone swatch (unofficial) |
| `tokens.json` | Every colour, type style, spacing step, radius and shadow, each with a usage note |
| `components/<Name>/README.md` | When to use each component and what you provide |
| `components/<Name>/preview.html` | The component's real markup; open the file in a browser from a checkout of the repo |

The code is the source of truth: `src/styles/site.css` for every value and `src/components/` for markup. Fonts and logos are in `public/assets`; portraits in `public/team`.

---

AugMind checks the leads Google and Meta report against a business's real sales records, and checks whether AI assistants name the business. This system is the augmind.ai website as built on 26 Nov 2026: ink blue bands alternating with light sections, heavy tight headlines, white cards that float on the dark ground, a teal accent and a teal button family. Use it for any page, deck or graphic that should look like the site.

## How to read this document

IDs in brackets, such as [P8] or [M16], refer to an evidence register kept in the main AugMind repository. It is not part of this copy. A rule with only a J tag is a design judgement, not a measured finding.

## Content fundamentals

- **Lead with the answer.** Short plain sentences. "Know what your ad spend really earns." [J11]
- **Speak as "we" to "you".** "We match every lead Google and Meta claim against your actual sales records." [J11]
- **Sentence case everywhere.** No all-capital labels. No exclamation marks. No emoji. [J11, M19]
- **Never state a number, title, bio or promise that is not approved.** Figures on the site are examples; label them: "Example figures, not a client", "Sample · fictional company · example figures", "Fictional businesses". [M20]
- **Never promise results.** AI answers change from one ask to the next, so nobody can guarantee a business is named. [J11]
- **No phone number and no email address** on any page. Contact goes through the booking page ("Pick a time"). [P8, M19]
- **Levarum** is "a tool AugMind uses to measure AI search, which clients subscribe to". The ownership line sits beside its logo every time: "Levarum is made by The IT Associates, LLC, which AugMind partner Tait Goodwin owns." See `LevarumCredit`. [P12, S18]
- **The three steps** are always Discover, Implement, Run, in that order. [J11]
- **Partners** are listed Tom, Tait, Saima. Use their titles and bio lines exactly as approved. See `PartnerCard`. [P9, P10, M18]
- **Third-party statistics** need a source someone opened. If unconfirmed, leave them out. [P12]

## Visual foundations

### Colour

- One look: **alternating ink blue and light**. The dark ground token is still named `navy`. [P6, P16] The hero, the AI search band, the healthcare band and the footer sit on `navy`. Sections between them sit on `paper` or `slate`. Those are the only two light page grounds. [P6, M21, B3]
- Text on light grounds is `ink` (headings) and `ink2` or `ink3` (body and small text). Text on `navy` is white, with `teal-bright` for kickers and emphasis.
- `accent-ink` is the accent for text: kickers and text links on light grounds. `accent` is for marks only: ticks and the current-page underline.
- One button family, teal: `cta-bg` with white text on light grounds, `teal-bright` with an `ink` label on the dark ground. See `Button`. [M22, J4]
- Cards stay white (`surface`) on every ground, navy included. Only floating cards take a shadow.
- One text gradient, `grad-a` to `grad-b`, on the three step numbers. The hero headline's last line is one solid `teal-bright`; there is no fade on the dark ground. Display sizes only. [M5]
- Negative status is `no` on light grounds and `no-dark` on navy. Positive is `accent-ink` and `ok-dark`.

### Accessibility

- Standard: WCAG 2.2 AA, with AAA text contrast: 7:1 for text, 4.5:1 for large text (24px, or 18.66px bold). Each colour token's note names the grounds it reads on. [P7, S1, M9, M28]
- **Every status shows an icon, a word and a colour.** Some readers are red-green colour blind. The warning tag also has an outline. Teal turns grey under simulated green-blindness, so never let meaning rest on teal against red. See `StatusTag`. [P7, P4, S2, M7, M8]
- The focus ring is 2px solid `focus` on light grounds and white on navy. Never remove it. [M28]
- Tap targets are 44px tall (`tap`). Nothing scrolls sideways at 320px. [M16, S3, M28]
- Anything that animates in must be readable before it plays. Dim to 84% at most, never lower.
- Motion sits inside `prefers-reduced-motion: no-preference`. With reduce, results simply appear.

### Type

- **Schibsted Grotesk** at 800 for headlines, card titles and step numbers. **Inter** for everything else at 400 and 600. Both are variable fonts, in `public/assets`. [M15, M25, S14]
- Headlines are tight: `h1` at -0.042em, `h2` at -0.035em, with `text-wrap: balance`. At weight 800 the headline is heavier than on any comparison site measured.
- `h3` is 20px by default and is set at four other sizes in places (16, 21, 24 and 28px).
- Running text is `body` at 17px; a `lede` under a headline is 18px and at most 60 characters wide. Nothing smaller than `small` (14px) except `tag`.

### Shape, spacing, depth

- Buttons, pills and tags are full pills (`radius-pill`). Cards are `radius-18`. Small controls are `radius-10`.
- Sections are `sec` apart: 72px, or 96px from 721px wide. Content is at most 1200px wide inside the `pad` gutter.
- Two shadows: `lift` for cards on light grounds and `lift-on-dark` for the same cards on navy. Borders are 1px `rule`.
- Layout changes at 721px: below it the header links fold into the `PhoneMenu` and a sticky button bar appears at the bottom of the screen once the hero button scrolls away.

### Imagery

- Photos stay photos: partner portraits are cut-outs on pale circles. No stock photos, no 3D.
- Step drawings are hand-inked, single-colour line art drawn in code.
- Charts use `chart-a` and `chart-b` with direct labels.

## Iconography

No icon set. Icons are small inline SVG strokes in `currentColor`, about 2px wide with round ends: the tick, the plus on FAQ rows, the three bars and cross of the phone menu, the arrow, triangle and bars on status tags, the cross on the "not named" line. Arrows in link labels are the text glyphs → and ↓. No emoji.

## Logos and assets

- **AugMind**: `augmind-logo-ink.svg` on light grounds, `augmind-logo-white.svg` on navy. 32px tall in the header, 42px in the footer. [M17]
- **Levarum**: Levarum's own small lockup, at least 34px tall; the `-inverse` file on navy. [M17, S18, U6]
- **MindSignal-X**: the name on the example ledger only.
- All logos are fixed-colour files. Copy them unchanged, never recolour with a CSS filter, never redraw.

## Using the system

Load `src/styles/site.css`, the site's own stylesheet, which carries its class names (`.btn`, `.link`, `.pill`, `.tag`, `.hd`, `.nav`, `.chat`, `.guides`, `.gov`, `.ft`, `.band-navy`, `.bg-slate`). There is no JavaScript bundle; previews are static renditions of the site's markup. The phone menu's few lines of script are in its preview and in the site's `src/scripts/site.js`.

## Open items

- The `h3` level is used at five sizes. A tidy scale would have two or three.
- The pale green and pale red tag fills look the same to a red-green colour-blind reader (measured difference 2.0). The warning tag now carries an outline so its shape differs; the icons and words tell them apart as before. [M7, J5]
- The Levarum sample block on the AI search page uses Levarum's own colours and typefaces inside its frame. That is deliberate; nothing outside the block may use them.
- Levarum's own guide says its logo is never rotated; the site lets a visitor pull it and it springs back, which the AugMind × Levarum system allows. Not resolved.

- The button is deep green on light grounds and bright teal on the dark ground: one family, two fills. The site rule says "one primary button style"; whether this counts is for the partners.
- One healthcare section sits on `mint`, a third light ground. The rule says two.
- The AugMind × Levarum system words the credit "Proprietary AI engine by"; the site says "AI search measured with". The site wording is used here.
- The dark look (`dark.css`) is kept in the code but not loaded, and is not part of this system.

## What this folder leaves out

- `--pad` and `--lift` keep their full CSS values in the stylesheet (`max(20px, 5vw)` is not a plain length), so `tokens.json` records their base values and says so. [M14]
- Levarum's own typefaces (Newsreader, Figtree, IBM Plex Mono) are used only inside the Levarum sample block and are not part of this system. [S18]
- The large Levarum lockup and the three `lv-*` marks are Levarum's files and are documented in Levarum's own design system. [S18]
- Every source component has a card except `InkDefs`, which only holds the shared drawing filter. [M24]
- Radius and three spacing token names (`radius-*`, `gap-head`, `gap-card`, `tap`) were named here; the code uses the bare values. [J9, M23]
