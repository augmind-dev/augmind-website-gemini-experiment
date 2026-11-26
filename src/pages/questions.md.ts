/**
 * /questions.md: the Markdown copy of /questions for AI tools (linked from llms.txt), built from the same answers as
 * the page (src/data/faqs.ts) so the two cannot drift apart. Output is byte-identical to the v11 static build.
 */
import type { APIRoute } from 'astro';
import { faqs, faqGroups } from '../data/faqs';
import { SITE } from '../data/site';

export const GET: APIRoute = () => {
  const body = `# Questions buyers ask first (AugMind)\n\n${faqGroups
    .map((g) => `## ${g}\n\n${faqs.filter((f) => f.g === g).map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n')}`)
    .join('\n\n')}\n\nRequest a consultation: ${SITE}/#consult\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
