# Evaluating colour

Use this when the decider reacts to a look ("unsophisticated", "too corporate") and wants a better one. The aim is to separate what can be measured from what is taste, and to give the decider a clear before and after.

## Measure the site as it is

1. **Each colour** in OKLCH: lightness, chroma (colourfulness), hue. Verify the maths against a known library.
2. **Contrast** of every text and ground pairing against the target (7:1 normal text, 4.5:1 large text, 3:1 for buttons, icons and borders).
3. **Area.** The share of each colour family across full pages at phone and desktop width, from screenshots.
4. **Colour-blind separation.** Simulate red-green colour blindness (Machado 2009, in linear RGB) and compute the difference between colours that carry different meanings.
5. **Text on gradients.** Measure from pixels; scans cannot decide these.

## Measure other sites

1. Pick about ten comparison sites the decider respects or competes with.
2. Measure the same things on their full pages. Record which failed to load.
3. Report medians and where this site sits. Expect the benchmark to contradict first impressions.

## Propose

1. Keep the colours people said they care about. Change one property at a time where possible (for example keep the hue, cut the chroma).
2. Derive scales (ground, panel, accent, hover) with stated steps, and check contrast for every pairing.
3. Show: before and after at phone and desktop width; the same pair under colour-blind simulation; the contrast table.
4. Say plainly: what is measured, and what is judgement. "Looks more sophisticated" is judgement.

## Naming and print

- Give each colour a plain name and keep token names stable. A token may keep an old name when its value changes; say so in the rules file.
- Map to print references only with the unofficial label, the source table and the colour difference.
