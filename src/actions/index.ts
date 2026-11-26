/**
 * Consultation requests from the forms on /, /healthcare and /scheduling (v11.2).
 *
 * The form posts here (an Astro Action, no client JavaScript). The server forwards the
 * request to the n8n workflow "AugMind — Website consultation requests", which saves it to the
 * n8n data table "AugMind website requests". No email is sent. The webhook URL and its shared
 * key live only in Vercel (CONSULT_WEBHOOK_URL, CONSULT_WEBHOOK_KEY, both sensitive); n8n
 * ignores requests without the key, and the browser never sees either.
 */
import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';
import { BOOKING_URL } from '../data/site';
import { CONSULT_WEBHOOK_URL, CONSULT_WEBHOOK_KEY, VERCEL_ENV } from 'astro:env/server';

export const server = {
  consult: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string({ error: 'Please tell us your name.' }).trim().min(1, 'Please tell us your name.').max(120),
      // Trim first: phone keyboards and autofill often add a trailing space.
      email: z.string({ error: 'Please enter an email address we can reply to.' }).trim()
        .pipe(z.email({ error: 'Please enter an email address we can reply to.' }).max(200)),
      company: z.string().trim().max(160).optional(),
      format: z.enum(['Video', 'In person']).default('Video'),
      // Optional qualifying questions (fit criteria from Offering 001): a CRM, the ad platforms, 90 days of data.
      crm: z.enum(['Yes', 'No', 'Not sure']).optional(),
      platforms: z.array(z.enum(['Google Ads', 'Meta Ads', 'Other ads', 'None yet'])).optional(),
      export90: z.enum(['Yes', 'No', 'Not sure']).optional(),
      message: z.string().trim().max(4000).optional(),
      // Which form sent it (v11: the homepage, /healthcare or /scheduling). Rides along in the message for n8n.
      page: z.enum(['Home', 'Healthcare', 'Scheduling', 'AI search']).optional(),
      // Honeypot: hidden from people, often filled by bots. Named so browser and
      // password-manager autofill won't recognise it (a field called "website" gets filled).
      am_trap: z.string().optional(),
    }),
    handler: async (input) => {
      if (BOOKING_URL) throw new ActionError({ code: 'BAD_REQUEST', message: 'The form is closed. Please book a time instead.' });
      if (input.am_trap) {
        // Quietly drop bot submissions, but leave a trace in case a real person tripped it.
        console.warn('[consult] honeypot filled; request dropped');   // no personal details in the log
        return { ok: true };
      }

      if (!CONSULT_WEBHOOK_URL || !CONSULT_WEBHOOK_KEY) {
        throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: 'Consultation form is not connected.' });
      }

      const qualifiers = [
        input.crm && `CRM: ${input.crm}`,
        input.platforms?.length && `Ad platforms: ${input.platforms.join(', ')}`,
        input.export90 && `Can export 90 days: ${input.export90}`,
        input.page && `Form: ${input.page}`,
      ].filter(Boolean).join(' | ');

      const res = await fetch(CONSULT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-augmind-key': CONSULT_WEBHOOK_KEY },
        body: JSON.stringify({
          name: input.name,
          email: input.email,
          company: input.company ?? '',
          format: input.format,
          // n8n stores `message` today; the qualifying answers ride along in it until its table has their own columns.
          message: [input.message ?? '', qualifiers].filter(Boolean).join('\n\n'),
          crm: input.crm ?? '',
          ad_platforms: (input.platforms ?? []).join(', '),
          can_export_90_days: input.export90 ?? '',
          submitted: new Date().toISOString(),
          site: VERCEL_ENV ?? 'development',
        }),
        signal: AbortSignal.timeout(8000),
      }).catch((e: unknown) => {
        // Network failure or the 8s timeout. Never log the URL or key.
        console.error('[consult] webhook request failed', { error: e instanceof Error ? `${e.name}: ${e.message}` : String(e) });
        return null;
      });

      if (res && !res.ok) {
        console.error('[consult] webhook rejected request', { status: res.status });   // not the response body: it can echo the request
      }
      if (!res || !res.ok) {
        throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: 'Could not save the request.' });
      }
      return { ok: true };
    },
  }),
};
