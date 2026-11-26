/**
 * Content shared by the pages (v11.2), lifted 1:1 from the approved static build (src/build.mjs in the review artifact).
 * Example figures are examples and say so on the page. Edit copy here, not in the components.
 */
export const SITE = 'https://www.augmind.ai';

/**
 * Booking page for the first conversation (a Google Calendar appointment schedule). While this is empty the site shows the
 * consultation form. When it holds a link, every form card becomes a "Pick a time" card that opens the booking page, and the
 * form (which needs the n8n webhook) is not shown. Partners' go-live plan, 23 Nov 2026.
 */
export const BOOKING_URL = 'https://calendar.app.google/3QvsaL483bvsAtvD8';

export type NavKey = 'how' | 'ai' | 'hc' | 'q';
export const NAV: [string, string, NavKey][] = [
  [
    "How it works",
    "/#how",
    "how"
  ],
  [
    "AI search",
    "/ai-search",
    "ai"
  ],
  [
    "Healthcare",
    "/healthcare",
    "hc"
  ],
  [
    "Questions",
    "/questions",
    "q"
  ]
];

export type Partner = { n: string; role: string; img: string; c: number; bio: string };
export const PARTNERS: Record<'tait' | 'saima' | 'tom', Partner> = {
  "tait": {
    "n": "Tait Goodwin, PMP",
    "role": "Partner · AI strategy",
    "img": "tait",
    "c": 1,
    "bio": "20 years in Deloitte and KPMG program, vendor, and risk governance. AI software strategist."
  },
  "saima": {
    "n": "Saima Anis, MD, MPH",
    "role": "Partner · Clinical privacy",
    "img": "saima-2511b",
    "c": 2,
    "bio": "Physician executive and clinical AI strategist. Shapes how AugMind handles healthcare data."
  },
  "tom": {
    "n": "Thomas Crawford",
    "role": "Partner · Client partnerships",
    "img": "tom",
    "c": 3,
    "bio": "Enterprise technology leader who has led global teams of 1,000+ people."
  }
};

/** MindSignal-X example ledger. share = share of closed sales (61/21/18 sums to 100); cshare = share of claimed leads. */
export const LEDGER_ROWS = [
  {
    "id": "g",
    "ch": "Google Search ads",
    "spend": "$6,200",
    "claim": 212,
    "sales": 31,
    "cps": "$200",
    "tag": [
      "Scale",
      "scale"
    ],
    "share": 61,
    "cshare": 53,
    "det": "31 of 212 claimed leads matched a paid invoice. Most of the rest were repeat form fills and calls that never booked."
  },
  {
    "id": "m",
    "ch": "Meta Social ads",
    "spend": "$4,100",
    "claim": 148,
    "sales": 9,
    "cps": "$456",
    "tag": [
      "Audit waste",
      "audit"
    ],
    "share": 18,
    "cshare": 37,
    "det": "9 of 148 claimed leads matched a sale. 139 failed 90-day invoice matching: duplicate form reloads and out-of-territory inquiries."
  },
  {
    "id": "l",
    "ch": "Local Map ads",
    "spend": "$1,300",
    "claim": 37,
    "sales": 11,
    "cps": "$118",
    "tag": [
      "Keep as-is",
      "keep"
    ],
    "share": 21,
    "cshare": 9,
    "det": "11 of 37 claimed leads matched a sale: the lowest cost per sale of the three."
  }
];

/** The five gates of AI search (GEO): [name, what happens, where you drop out, the fix]. */
export const GATES: [string, string, string, string][] = [
  [
    "Rewrite",
    "The assistant turns the buyer’s question into a few web searches of its own.",
    "None of your pages answer the searches it writes.",
    "Pages that answer the questions buyers actually ask, in their words."
  ],
  [
    "Search",
    "It runs those searches against the index it uses.",
    "Your site isn’t in the results it gets back.",
    "Indexing, listings, and the sources assistants lean on in your category."
  ],
  [
    "Read",
    "It opens a handful of pages to read.",
    "A firewall or robots.txt rule blocks its crawler.",
    "Let AI search crawlers such as OAI-SearchBot read your public pages."
  ],
  [
    "Write",
    "It writes a short answer from the passages it read.",
    "No passage on your site states clearly what you do, where, and for whom.",
    "Plain, quotable passages: services, service area, proof, and prices where you can."
  ],
  [
    "Cite",
    "It names some businesses and links a few sources.",
    "You’re named but not linked, or a competitor is linked instead.",
    "Consistent facts across your site and listings, so the assistant can cite you."
  ]
];
export const GATE_ART: string[] = [
  "<path d=\"M14 14h40a6 6 0 0 1 6 6v18a6 6 0 0 1-6 6H32l-12 9v-9h-6a6 6 0 0 1-6-6V20a6 6 0 0 1 6-6z\"/><path class=\"st-in\" d=\"M18 24h30M18 31h22M18 38h12\"/>",
  "<circle cx=\"28\" cy=\"28\" r=\"17\"/><path d=\"M41 41l17 17\"/><path class=\"st-in\" d=\"M20 24h14M20 31h9\"/>",
  "<path d=\"M18 8h22l12 12v40H18z\"/><path d=\"M40 8v12h12\"/><path class=\"st-in\" d=\"M25 33h20M25 41h20M25 49h12\"/>",
  "<path d=\"M44 10l13 13-29 29H15V39z\"/><path d=\"M38 16l13 13\"/><path class=\"st-in\" d=\"M12 60h44\"/>",
  "<path d=\"M30 40l-7 7a9 9 0 0 1-13-13l8-8a9 9 0 0 1 13 0\"/><path d=\"M38 28l7-7a9 9 0 0 1 13 13l-8 8a9 9 0 0 1-13 0\"/><path class=\"st-in\" d=\"M26 42l16-16\"/>"
];
export const GATE_LEFT: string[] = [
  "5 of 6 still in",
  "4 of 6 still in",
  "3 of 6 still in",
  "2 of 6 still in",
  "2 named, 1 linked"
];

/** Inked step drawings: magnifier + tick, wrench, replay. */
export const STEP_ART: string[] = [
  "<circle class=\"st-blob\" cx=\"36\" cy=\"36\" r=\"27\"/><circle cx=\"28\" cy=\"28\" r=\"17\"/><path d=\"M41 41l18 18\"/><path class=\"st-in\" d=\"M20 29l6 6 11-13\"/>",
  "<circle class=\"st-blob\" cx=\"36\" cy=\"36\" r=\"27\"/><path d=\"M46 9a13 13 0 0 0-16 16L9 46l11 11 21-21a13 13 0 0 0 16-16l-9 9-9-2-2-9z\"/><circle class=\"st-in\" cx=\"16\" cy=\"50\" r=\"2.6\"/>",
  "<circle class=\"st-blob\" cx=\"36\" cy=\"36\" r=\"27\"/><path d=\"M57 34a23 23 0 1 1-8-18\"/><path d=\"M50 5v12H38\"/><path class=\"st-in\" d=\"M27 24l15 10-15 10z\"/>"
];

export type Step = { t: string; opt?: string; p: string; li: string[]; get: string };
export const STEPS_HOME: Step[] = [
  {
    "t": "Discover",
    "opt": "Fixed fee · read-only",
    "p": "A standalone 90-day Ad & AI Revenue Audit.",
    "li": [
      "Every reported lead matched to your sales records",
      "Buyer prompts tested in AI assistants",
      "Tracking gaps found and ranked"
    ],
    "get": "A written Roadmap and Decision Brief."
  },
  {
    "t": "Implement",
    "opt": "Optional",
    "p": "We build the measurement the Brief calls for.",
    "li": [
      "Tracking and offline conversion feed",
      "AI crawler access",
      "Holdout test set up"
    ],
    "get": "Working measurement, in accounts you own."
  },
  {
    "t": "Run",
    "opt": "Optional",
    "p": "We manage what works, inside written spend limits.",
    "li": [
      "Budget moved only on confirmed sales",
      "AI search (GEO) tracked over time",
      "Monthly reconciled report"
    ],
    "get": "Spend that stays within your limits, reported against real sales."
  }
];
export const STEPS_HC: Step[] = [
  {
    "t": "Discover",
    "opt": "Fixed fee · read-only",
    "p": "A 90-day audit of campaigns against booked appointments.",
    "li": [
      "Runs on records your team approves",
      "De-identified exports where possible",
      "Pixel and tag inventory for your site"
    ],
    "get": "A Decision Brief showing which campaigns bring in patients."
  },
  {
    "t": "Implement",
    "opt": "Optional",
    "p": "Pixel-free measurement, after your reviews approve it.",
    "li": [
      "Booking counts sent without patient details",
      "Platform health settings applied",
      "Holdout test set up"
    ],
    "get": "Measurement your reviewers approved, in accounts you own."
  },
  {
    "t": "Run",
    "opt": "Optional",
    "p": "Campaign management inside written spend limits.",
    "li": [
      "Budget moved only on booked patients",
      "Monthly reconciled report",
      "Reviews repeated when anything changes"
    ],
    "get": "A monthly report of campaigns against booked patients."
  }
];
