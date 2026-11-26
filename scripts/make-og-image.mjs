// Renders the link-preview image (public/og-image.png, 1200x630) from scripts/og-image.html with Playwright.
// Light look, v7 (18 Nov 2026). Needs Playwright with Chromium installed (not a site dependency).
// Run from the repo root:  node scripts/make-og-image.mjs
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.resolve('scripts/og-image.html')).href);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/og-image.png' });
await browser.close();
console.log('wrote public/og-image.png');
