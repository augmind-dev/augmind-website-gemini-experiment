/**
 * The questions buyers ask first: the single source for /questions, the homepage subset (home: true), the FAQPage
 * JSON-LD, and /questions.md (src/pages/questions.md.ts). Edit the answers here only.
 */
export const faqsReviewed = '2026-11-22';

export const faqGroups = ['Working with us', 'AI search (GEO)'] as const;
export type FaqGroup = (typeof faqGroups)[number];

export const faqs: { id: string; g: FaqGroup; home?: boolean; q: string; a: string }[] = [
  {
    "id": "agency",
    "g": "Working with us",
    "home": true,
    "q": "How is this different from my agency?",
    "a": "When the team that runs your ads also reports on them, it is grading its own homework. We match every reported lead against your sales records first, keep confirmed sales apart from platform claims, and test any change against a holdout before budget moves. Then we make the changes ourselves, or hand them to your team or agency."
  },
  {
    "id": "readonly",
    "g": "Working with us",
    "home": true,
    "q": "Will you change anything in our accounts during Discover?",
    "a": "No. Discover is read-only. We look at your ad accounts and sales records and change nothing. Changes happen only in Implement or Run, only if you approve them in writing, and only in accounts you own."
  },
  {
    "id": "need",
    "g": "Working with us",
    "home": true,
    "q": "What do you need from us?",
    "a": "Read access to your Google and Meta ad accounts, an export or read access to your CRM, billing, or scheduling records for the last 90 days, and an hour with the person who knows how a lead becomes a sale in your business."
  },
  {
    "id": "software",
    "g": "Working with us",
    "q": "Do I need to buy new software?",
    "a": "No. We work from the ad accounts and sales systems you already have. Where tracking is broken, we fix it in those tools, in accounts you own."
  },
  {
    "id": "soon",
    "g": "Working with us",
    "q": "How soon will we know something?",
    "a": "The matching comes first, and that is where the gaps show up. If the Decision Brief recommends a holdout test, how long it runs depends on how many sales you close in a month, so we agree an end date before it starts."
  },
  {
    "id": "nothing",
    "g": "Working with us",
    "home": true,
    "q": "What if the Decision Brief says to change nothing?",
    "a": "Then that is the answer, and you can stop there. Discover is a standalone, fixed-fee step. You keep the Brief, the Roadmap, and every account and formula. Implement and Run are optional."
  },
  {
    "id": "geo",
    "g": "AI search (GEO)",
    "q": "Is this what people call generative engine optimization?",
    "a": "Yes. Generative engine optimization (GEO) and answer engine optimization (AEO) are two names for the same job: getting your business named when people ask AI assistants like ChatGPT. We say AI search (GEO). It builds on good SEO; it doesn't replace it."
  },
  {
    "id": "seo",
    "g": "AI search (GEO)",
    "q": "How is AI search different from SEO?",
    "a": "Search ranks pages on a list. AI assistants name a few businesses inside one answer, and the answer can change each time someone asks. There's no single position to check, so visibility is how often you're named across many buyer questions, asked several times each."
  },
  {
    "id": "missing",
    "g": "AI search (GEO)",
    "q": "How does a business go missing from AI answers?",
    "a": "At any of five gates. The assistant rewrites the question into searches none of your pages answer. Its search doesn't return your site. A firewall or robots.txt rule blocks its crawler from reading your pages. No passage on your site answers clearly. Or you're named but not linked. We test which gate you drop out at, then fix what's in your control."
  },
  {
    "id": "levarum",
    "g": "AI search (GEO)",
    "q": "What is Levarum, and why do you use it?",
    "a": "Levarum is a product of The IT Associates, LLC: a tool AugMind uses to measure AI search, which clients subscribe to. Its software asks AI assistants the questions your buyers ask, several times each, and reports how often you're named, how often your site is linked, and which competitors are named instead. AugMind interprets the results, fixes what it finds, and measures again with Levarum."
  },
  {
    "id": "guarantee",
    "g": "AI search (GEO)",
    "home": true,
    "q": "Can you guarantee AI will name my business?",
    "a": "No, and nobody honestly can. No one controls what an AI assistant says. A measurement is a sample, not a prediction. What we can do is fix what's in your control (whether AI crawlers can read your site, clear answers on your pages, your business listings and reviews) and measure again."
  }
];
