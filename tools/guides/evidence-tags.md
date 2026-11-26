# Evidence tags

Every claim in a design or research document carries one tag. The reader should be able to tell, for each sentence, whether it is a fact about the site, a fact about other sites, something read, or an opinion.

| Tag | ID prefix | Means | Must have |
|---|---|---|---|
| Measured | M | Computed from the site's own code or pixels | The script and the data file in the repo |
| Benchmark | B | Measured on other firms' live sites | The list of sites, the date, and which failed to load |
| Source read | S | A published source that was opened and read | Publisher, title, year, address |
| Third-party data | T | An unofficial dataset | Where it came from and its limits |
| Unverified | U | From memory or a search excerpt | Nothing may rely on it |
| Judgement | J | A design opinion | The reasoning in one sentence |
| Partner | P | Something a decision-maker said or decided | Who, and when |

## The register

Keep one register, `design-system/evidence/EVIDENCE.md`, built by a script from the files in `data/`. Each entry has: ID, area, tag, the claim, the source, how it was obtained, and its limits. Documents cite entries by ID in brackets, for example `[M9, P2]`.

## Rules

- Rebuild the register from the data files; do not edit it by hand.
- When a rerun gives a different figure, the stored figure is wrong until explained.
- A source older than 24 months is used only when nothing newer exists; say so and say why.
- Count the entries by tag at the top of any page that presents the register. A document that is mostly Judgement should say so.
- When a claim turns out to be wrong, keep a visible correction; do not silently delete it.
