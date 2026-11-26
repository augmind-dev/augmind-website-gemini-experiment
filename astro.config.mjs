// @ts-check
import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// Pages that send noindex stay out of the sitemap. (/healthcare was removed from this list on 23 Nov 2026.)
const NOINDEX = new Set(['/404']);

export default defineConfig({
  site: 'https://www.augmind.ai', // canonical URLs + sitemap
  trailingSlash: 'ignore',
  build: { format: 'file', inlineStylesheets: 'always' }, // small site: no render-blocking CSS requests // /scheduling.html served at /scheduling, no trailing slash
  // Prefetch only links that opt in (data-astro-prefetch), on hover/focus.
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  // Static by default; only /scheduling renders on demand (it handles the consultation form).
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) => !NOINDEX.has(new URL(page).pathname.replace(/\/$/, '')),
      // Keep sitemap URLs identical to canonicals and internal links (no trailing slash).
      serialize: (item) => ({ ...item, url: item.url.replace(/(?<!\.ai)\/$/, '') }),
    }),
  ],
  env: {
    schema: {
      // Set by Vercel at build time. Only 'production' makes the site indexable (see SeoHead).
      VERCEL_ENV: envField.enum({ context: 'server', access: 'public', values: ['production', 'preview', 'development'], optional: true }),
      // n8n webhook for consultation requests and its shared key (server only, never sent to the browser).
      CONSULT_WEBHOOK_URL: envField.string({ context: 'server', access: 'secret', optional: true, url: true }),
      CONSULT_WEBHOOK_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
