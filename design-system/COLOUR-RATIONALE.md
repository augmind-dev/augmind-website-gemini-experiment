# Colour and design choices, with the reason for each

26 Nov 2026. Every colour in the AugMind website design system, what it is for, why it was chosen, and the Pantone guidance it follows. Quotations are Pantone's own words from pages opened today.

> **Evidence.** The last column lists entries in an evidence register kept in the main AugMind repository (not part of this copy): M is measured, B benchmark, S a source read, T third-party data, J judgement, P a decision by the owners.

> **Status.** These are the live colours since 26 Nov 2026. The "Previous value" column shows the earlier navy look.

## How to read the hue column

Hue is the colour's angle on the colour wheel. The logo blue is at 261° and the logo green at 173°. Colours a few degrees apart are the same family. Colours about 180° apart are opposites.

## Dark ground (live since 26 Nov 2026)

| Token | Value | Previous value | Hue | Job | Why this colour | Pantone guidance | Nearest Pantone (unofficial) | Measured contrast | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| `navy` | `#0B1927` | `#12304A` | 250° | Ground for the hero, both bands and the footer | The logo blue (261°) taken much darker and greyer, to 250°. Still blue, but it reads as ink, not as corporate navy. | Monochromatic: "different shades, tones and tints of a single color, creating a cohesive and visually soothing effect." | 296 C, difference 2.4 | white 17.8:1 | M6, M9, P1, J3, T1 |
| `teal` | `#49D9B9` | mint #7EEBCF fading to pale blue #9CC2FF | 175° | The accent on the dark ground: headline emphasis, pill, kickers, the large statistic, and the fill of the main button on dark | A fuller teal at 175°, the same hue as the logo green (173°) and the button. A step darker than the old mint and about 19% more colourful, so it reads as teal, not pastel. The pale blue is gone. | Analogous: "three or more colors that are next to each other on the color wheel, creating a harmonious and cohesive look." Blue ground, teal accent and green button are neighbours. | 333 C, difference 1.8 | 10.1:1 on the ground | M5, M9, P2, S6, J2, J4, T1 |
| `on-navy` | `#C9D7E3` | same | 244° | Paragraph text on the dark ground | A soft blue-grey white, unchanged. Pure white is kept for headlines, so paragraphs sit one step back. | Color of the Year 2026, Cloud Dancer: a white that is "supporting rather than shouting, presenting a contrast in color that allows others to shine." | 643 C, difference 0.8 | 12.1:1 on the ground | M9, S8, T1 |
| `(white)` | `#FFFFFF` | same | neutral | Headlines and links on the dark ground; cards that float on it | The strongest contrast goes to the words that matter most. Cards stay white on every ground. | None needed: white on near-black is a contrast of light and dark, not a hue choice. | 663 C, difference 7.0 | 17.8:1 on the ground | M9, T1 |
| `ok-dark` | `#7EEBCF` | same | 175° | Positive status on the dark ground | The lighter teal tint, kept for a good result so it differs from the headline accent by lightness. | Monochromatic: "different shades, tones and tints of a single color, creating a cohesive and visually soothing effect." A tint of the teal. | 3375 C, difference 3.1 | 12.4:1 on the ground | M9, S6, T1 |
| `no-dark` | `#FF9A9A` | same | 20° | Negative status on the dark ground | A light red, always with an icon and a word, because some readers are red-green colour blind. | None. Pantone's pages name three harmonies and this is not one of them. A status colour is chosen for meaning, not harmony. | 177 C, difference 5.9 | 8.7:1 on the ground | M9, P7, S2, T1 |

## Light grounds (unchanged)

| Token | Value | Hue | Job | Why this colour | Pantone guidance | Nearest Pantone (unofficial) | Measured contrast | Evidence |
|---|---|---|---|---|---|---|---|---|
| `paper` | `#FFFFFF` | neutral | Main page ground | Pure white, so the logo files, photos and white cards need no adjusting. | None needed. | 663 C, difference 7.0 | ground | B3, P6, T1 |
| `slate` | `#F4F7FA` | 248° | Second page ground, for alternate sections | White with a trace of the blue (248°). It separates sections without adding a colour. | Monochromatic: "different shades, tones and tints of a single color, creating a cohesive and visually soothing effect." A tint of the blue. | 656 C, difference 4.8 | ground | B3, P6, T1 |
| `ink` | `#0D131D` | 260° | Headings and strong text on light grounds | A near-black with a trace of blue (260°), not a pure black, so text belongs to the same family as the dark ground. | Monochromatic: "different shades, tones and tints of a single color, creating a cohesive and visually soothing effect." A shade of the blue. | 532 C, difference 4.6 | 18.6:1 on paper | M14, S6, T1 |
| `ink2 / ink3` | `#3A5068` | 251° | Body and small text on light grounds; menu links | Greyed mid-blues (251°). Softer than ink for long reading, still above 7:1. | Monochromatic: "different shades, tones and tints of a single color, creating a cohesive and visually soothing effect." Tones of the blue. | 3025 C, difference 7.4 | 8.3:1 and 8.1:1 on paper | M9, S6, T1 |
| `rule / rule-strong` | `#DCE5EC` | 241° | Hairlines and input borders | Pale tints of the blue. Dividers only, never text. | Monochromatic: "different shades, tones and tints of a single color, creating a cohesive and visually soothing effect." Tints of the blue. | 656 C, difference 0.8 | not text | S6, T1 |
| `cta-bg` | `#07604D` | 173° | The primary button | A deep shade of the logo green (173° against the logo's 173°). The button is the only large area of green on a light page, so it is easy to find. | Monochromatic: "different shades, tones and tints of a single color, creating a cohesive and visually soothing effect." A shade of the logo green. | 336 C, difference 2.3 | white text 7.5:1 | M9, M22, S6, T1 |
| `accent / accent-ink` | `#0A7460` | 175° | Kickers, text links, ticks, the current-page marker on light grounds | The same green in two depths: the darker one for text, the brighter one for small marks. | Monochromatic: "different shades, tones and tints of a single color, creating a cohesive and visually soothing effect." Shades of the logo green. | 3295 C, difference 1.4 | accent-ink 8.2:1 on paper | M9, S6, T1 |
| `accent-soft` | `#E1F3EC` | 171° | Pale fill behind positive tags | A very light tint of the same green, with accent-ink text on it. | Monochromatic: "different shades, tones and tints of a single color, creating a cohesive and visually soothing effect." A tint of the logo green. | 621 C, difference 4.2 | accent-ink 7.1:1 on it | M7, S6, T1 |
| `blue-ink / focus / chart-a` | `#1D58C2` | 261° | Focus ring, chart line | The logo blue itself, kept for things that must be noticed but are not actions. | The brand colour, not a derived one. | 2935 C, difference 2.4 | 6.5:1 on paper (marks need 3:1) | M14, S3, T1 |
| `grad-a to grad-b` | `#067A62` | 172° | The three step numbers | The logo ribbon's own green-to-blue (172° to 261°), the one place a fade remains. It quotes the logo, at display size only. | None. Pantone's pages name three harmonies and this is not one of them. The two logo colours are about a quarter-turn apart: wider than analogous, far short of complementary. The pairing comes from the logo. | 335 C, difference 1.3 | weakest point 5.3:1 (large text needs 4.5:1) | M14, S6, T1 |
| `no` | `#961A21` | 24° | Negative status on light grounds | A dark red, always with an icon and a word. | None. Pantone's pages name three harmonies and this is not one of them. Chosen for meaning. | 704 C, difference 3.5 | 8.5:1 on paper | M14, P7, S2, T1 |
| `mint` | `#EBF4F1` | 174° | One healthcare section | A third light ground left in the code. The rule says two grounds. Open item for the partners. | None; it is an exception to remove or approve. | 621 C, difference 6.1 | ground | M21, T1 |

## Design choices

| Choice | Why | Guidance it follows | Evidence |
|---|---|---|---|
| One dark ground and one light ground, alternating | A page reads in bands: dark for the claim, light for the detail. Two values of one blue family, not two colours. | Monochromatic: "different shades, tones and tints of a single color, creating a cohesive and visually soothing effect." | P6, M21 |
| One accent family: teal | Teal on dark, the deeper green-teal for buttons and links on light. One hue in several depths, so the brand colour is unmistakable. | Monochromatic: "different shades, tones and tints of a single color, creating a cohesive and visually soothing effect." | P2, M5, J4 |
| No fade in the headline | The old fade put two pale tints side by side. One solid colour is calmer and easier to read. | Cloud Dancer press release, 2025: "a conscious statement of simplification". | P1, M4, J2 |
| Soft white for paragraphs, pure white for headlines | Two levels of emphasis from value alone. | Color of the Year 2026, Cloud Dancer: a white that is "supporting rather than shouting, presenting a contrast in color that allows others to shine." | M9, S8 |
| Green means an action or a good result | On light pages the button; on dark pages only a positive status. | Not a Pantone topic. This is a meaning rule. | J4 |
| Every status has an icon, a word and a colour | Some readers are red-green colour blind. Colour alone is never the signal. | Not a Pantone topic. WCAG 2.2 (W3C, December 2024), criterion 1.4.1. | P7, P4, S2, M7 |
| Text contrast of 7:1, large text 4.5:1 | The site holds the stricter AAA level. Every pair above was measured. | Not a Pantone topic. WCAG 2.2 (W3C, December 2024), criterion 1.4.6. | P7, S1, M9, M10 |
| Logos are never recoloured | The AugMind and Levarum files are fixed-colour and used as supplied. | Pantone, every colour page: on-screen colours "are computer simulations" and "may not match PANTONE-identified color standards". | S18, S7, M17 |

## Sources

- **Pantone colour pages** (pantone.com/color-finder). Opened and read on 26 Nov 2026; 2026 copyright, no other date. Source of the three harmony definitions quoted above.
- **Pantone, Color of the Year 2026 press release**, 4 Dec 2025. Opened and read. Source of the Cloud Dancer quotation.
- **Pantone numbers: third-party data, not Pantone's.** Nearest swatches were computed (CIEDE2000 colour difference) against the open table `color_library` 0.0.2 by Radu Dragan (MIT licence), as shipped in the npm package `chromonym` 3.18.2 (published 23 Nov 2026): 907 Pantone Coated colours, described by its author as "open-source approximations, not official Pantone-licensed measurements". Cross-checked against `pantoner` 1.1.2 (2014; older than 24 months, used only as a check): the two agree on all 900 colours they share. A third table, `pantone-colors` 1.0.3 (2023), differs noticeably (average difference 3.7) and was not used.
- **Hue angles and contrast figures:** measured on 26 Nov 2026 from the colour values (hue in OKLCH; contrast by the WCAG 2 formula).

## What is not verified

- The Pantone numbers are screen approximations from third-party tables. Nobody has compared them with a physical Pantone guide. Do that before any print, signage or merchandise.
- "Difference" is the CIEDE2000 distance to the nearest swatch: under 1 is invisible, 2 to 3 is close, above 5 is a different colour. Several text greys have no close Pantone swatch; that is normal for screen-only colours.
