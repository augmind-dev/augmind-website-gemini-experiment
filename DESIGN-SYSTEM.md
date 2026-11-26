# AugMind design system: the short version for coding agents

This file is generated from `design-system/tokens.json` and summarises `design-system/README.md`. The code is the source of truth: `src/styles/site.css` holds every value as a CSS variable, and `src/components/` holds the markup. If this file and the code disagree, the code wins.

## The look in one paragraph

Ink blue bands alternate with light sections. Headlines are heavy and tight. White cards float on the dark ground. Teal is the accent: one bright teal on dark, a deep green button on light. Two page backgrounds only (`paper`, `slate`). One button family.

## Colour tokens

Use the CSS variable, never the raw hex. The dark ground token is still named `navy`.

| Token | Value | Use |
|---|---|---|
| `--paper` | `#ffffff` | Page ground. One of the two page backgrounds; cards and the header also sit on it. |
| `--slate` | `#f4f7fa` | Second page ground, for alternate sections, the drawers and quiet fills such as FAQ plus-buttons. |
| `--mint` | `#ebf4f1` | Pale green fill. In the code for one healthcare section; the two-backgrounds rule says paper and slate only, so do not add new mint sections (open item). |
| `--navy` | `#0b1927` | Dark band ground, "ink blue": hero, AI search and healthcare bands, footer, end-of-page call box. Hue 250, darker and about 42% less colourful than the earlier navy #12304A. White text reads 17.8:1. The token keeps the name navy. |
| `--navy-2` | `#172839` | One step lighter than the ground, for panels on it. Defined in the code; not used by any component yet. |
| `--teal-bright` | `#49d9b9` | The accent on the dark ground: last line of the hero headline, pill, kickers, the large statistic, and the fill of the main button on dark (label in ink, 10.6:1). Same hue as the logo green and the button on light (175). 10.1:1 on the ground. Never on paper or slate. |
| `--teal-bright-hover` | `#95ebd4` | Hover fill of the teal button on dark. |
| `--navy-rule` | `rgba(255,255,255,.14)` | Hairline on navy grounds (footer divider, credit divider). A divider only, never text. |
| `--ink` | `#0d131d` | Headings and strong text on paper and slate. Also the skip link ground (white text 18.6:1). |
| `--ink2` | `#3a5068` | Body-weight secondary text and menu links on paper and slate. 8.3:1 on paper; 7.46:1 measured on the sticky header over navy. |
| `--ink3` | `#3e5266` | Small secondary text on paper, slate and mint. 7:1 or better on all three. |
| `--rule` | `#dce5ec` | Hairline borders and dividers on paper and slate. A divider only, never text. |
| `--rule-strong` | `#9fb3c3` | Stronger border for inputs and outlined chips on paper. |
| `--accent` | `#0a7460` | The one accent: current-page marker, ticks, small marks on paper. Not for body text; use accent-ink for text. |
| `--accent-ink` | `#065a4a` | Accent text on paper, slate and accent-soft: kickers, text links, the confirmed-sales number. Stays 5.5:1 when dimmed to 84% before the ledger animates. |
| `--accent-soft` | `#e1f3ec` | Pale green fill for positive tags and the fix note. Text on it is accent-ink. |
| `--cta-bg` | `#07604d` | Primary button ground on light grounds. White text reads 7.5:1. |
| `--cta-hover` | `#06513f` | Primary button hover ground. |
| `--blue-ink` | `#1d58c2` | Blue for the focus ring, chart line and the blue end of the text gradient. Not body text. |
| `--no` | `#961a21` | Negative status text on paper and on pale red panels ("No sale found", "Out"). 7:1 or better. Always with an icon and a word. |
| `--no-dark` | `#ff9a9a` | Negative status text on navy grounds. |
| `--ok-dark` | `#7eebcf` | Positive status text on the dark ground. 12.4:1. Lighter than the accent teal so the two differ by lightness. |
| `--focus` | `#1d58c2` | Focus ring on light grounds: 2px solid, never removed. On navy the ring is white. |
| `--grad-a` | `#067a62` | Start of the one text gradient (step numbers on paper). 5.29:1 at its weakest point; large display text only. |
| `--grad-b` | `#1d58c2` | End of the text gradient. Large display text only. |
| `--chart-a` | `#1d58c2` | Chart line and fill. 3:1 or better on paper. |
| `--chart-b` | `#0a7460` | Second chart series. Pair with a label or pattern, never colour alone. |
| `--surface` | `#ffffff` | Card ground on any band. Cards stay white inside navy bands. |
| `--fade-top` | `rgba(29,88,194,.42)` | Top of the chart area fill. |
| `--fade-none` | `rgba(29,88,194,0)` | Bottom of the chart area fill (fully clear). |

## Type

Fonts are self-hosted variable files in `public/assets`: Inter Variable, Schibsted Grotesk Variable.

**Display**

| Style | Size | Weight | Line height | Use |
|---|---|---|---|---|
| h1 | 64.8px | 800 | 1.02 | Page headline, one per page. 64.8px at 1440px wide, about 41px on a phone. The last line may take the text gradient. At weight 800 it is heavier than the headline on every comparison site measured. |
| h2 | 46px | 800 | 1.07 | Section headline. clamp(30px, 3.4vw, 46px). |
| h3 | 20px | 800 | 1.2 | Card and step titles. 20px is the base. The pages also set h3 at 16px (sort card, in Inter 600), 21px (partner names), 24px (step titles) and 28px (booking card): five sizes in all, which is an open item. |
| step-number | 40px | 800 | 0.86 | The three step numbers, in the text gradient. |

**Text**

| Style | Size | Weight | Line height | Use |
|---|---|---|---|---|
| lede | 18px | 400 | 1.55 | One paragraph under a headline, 60 characters wide at most. |
| body | 17px | 400 | 1.6 | Running text. |
| kicker | 15px | 600 | 1.4 | Short label above a section headline. Sentence case, never all capitals. |
| button | 16px | 600 | 1.2 | Button and text-link labels. 15px in the header button. |
| menu | 15px | 600 | 1.6 | Header links. 17px inside the open phone menu. |
| small | 14px | 400 | 1.5 | Trust line, footer notes, captions. Smallest running text on the site. |
| tag | 12.5px | 600 | 1.6 | Status tags only, always beside an icon. |

## Spacing

| Name | Value | Use |
|---|---|---|
| sec | `72px` | Space above and below every section. 96px from 721px wide. |
| pad | `20px` | Side gutter: max(20px, 5vw). Content is at most 1200px wide between the gutters. |
| gap-head | `40px` | Between a section heading block and its content (.sec-head margin). |
| gap-card | `20px` | Padding inside small cards and the agreement panel. |
| tap | `44px` | Smallest height for any link or button a finger taps. WCAG floor is 24px; the site holds 44px. |

## Corner radius

| Name | Value | Use |
|---|---|---|
| radius-6 | `6px` | Small chips inside cards. |
| radius-10 | `10px` | Skip link, menu button, small controls. |
| radius-12 | `12px` | Inner panels. |
| radius-14 | `14px` | Chat bubbles and list rows inside cards. |
| radius-18 | `18px` | Cards: ledger, answer card, agreement panel, call box. The main card radius. |
| radius-20 | `20px` | Large stat panel. |
| radius-pill | `999px` | Buttons, pills and tags. |

## Shadows

| Name | Value | Use |
|---|---|---|
| lift | `0 1px 2px rgba(13,19,29,.06), 0 12px 32px -12px rgba(13,19,29,.18)` | Cards that float on light grounds: ledger, sort card, answer card, booking card, sample memo, chart cards. |
| lift-on-dark | `0 24px 60px -20px rgba(0,0,0,.55)` | The same cards when they sit on the dark ground: a deeper, wider shadow. Not a CSS variable in the code; written out in three places. |

## Components

Each has guidelines in `design-system/components/<Name>/README.md` and its real markup in `preview.html` beside it.

| Component | Source |
|---|---|
| AnswerCard | `src/components/AiSearch.astro` |
| Button | `see its README` |
| ClaimChart | `src/components/ClaimChart.astro` |
| ConsultForm | `src/components/ConsultForm.astro` |
| DecisionBriefDrawer | `src/components/DecisionBriefDrawer.astro` |
| FaqRow | `src/components/FaqList.astro` |
| FiveGatesDrawer | `src/components/FiveGatesDrawer.astro` |
| Footer | `src/components/Footer.astro` |
| GuaranteeTicks | `see its README` |
| Header | `src/components/Header.astro` |
| HealthcareStrip | `src/components/HealthcareStrip.astro` |
| Ledger | `src/components/Ledger.astro` |
| LevarumCredit | `src/components/AiSearch.astro` |
| PartnerCard | `src/components/Guides.astro` |
| PhoneMenu | `see its README` |
| Pill | `see its README` |
| SortCard | `src/components/SortCard.astro` |
| StatusTag | `src/components/Ledger.astro` |
| Steps | `src/components/Steps.astro` |
| StickyCta | `src/components/StickyCta.astro` |
| TextLink | `see its README` |
| ValueTrio | `src/components/ValueTrio.astro` |

## Rules that must hold

- Text contrast: 7:1 for normal text, 4.5:1 for large text (24px, or about 19px bold). Buttons, icons and form borders: 3:1.
- Every status shows an icon, a word and a colour. Some readers are red-green colour blind.
- Tap targets at least 24px; the site's own smallest is 44px.
- No sideways scroll at 320px. Check 320, 393, 900 and 1440px.
- Logos are fixed-colour SVG files. Copy them unchanged, use the `-inverse` file on dark grounds, never recolour with a CSS filter. Levarum small lockup: at least 34px tall.
- Photos stay photos. Logos and icons are SVG.
- Teal stays in the design.
- Respect `prefers-reduced-motion`.

## Where to read more

- `design-system/README.md`: the full brand book, including writing rules.
- `design-system/COLOUR-RATIONALE.md`: why each colour is what it is, with unofficial nearest Pantone swatches.
- `design-system/tokens.json`: every token as data.
