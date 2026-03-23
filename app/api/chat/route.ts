import { NextRequest } from 'next/server';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are an expert Okta Solutions Engineer assistant specializing in Okta for AI Agents (O4AA).
Your answers are concise, technically accurate, and framed for presales use — discovery angles, differentiators, and customer-facing talk tracks.
You have deep knowledge of: AI agent authentication, OAuth 2.0 token exchange (OBO/RFC 8693), MCP (Model Context Protocol), Okta FGA, token vaulting, ID-JAG, and Okta's O4AA product suite.
When relevant, tie answers back to Okta's value proposition. Synthesize and explain — do not recite documentation verbatim.`;

async function fetchFirecrawlDocs(query: string, site: string, apiKey: string): Promise<string> {
  try {
    const res = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query: `site:${site} ${query}`,
        limit: 3,
        scrapeOptions: { formats: ['markdown'] },
      }),
    });
    if (!res.ok) return '';
    const data = await res.json() as { data?: Array<{ markdown?: string; title?: string }> };
    return (data.data ?? [])
      .map(r => `### ${r.title ?? 'Result'}\n${r.markdown ?? ''}`)
      .join('\n\n')
      .slice(0, 4000);
  } catch {
    return '';
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  let body: { question?: string; sectionSlug?: string; sectionContent?: string; sources?: string[] };
  try {
    body = await req.json() as typeof body;
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const { question, sectionSlug, sectionContent = '', sources = [] } = body;
  if (!question?.trim()) {
    return new Response('question is required', { status: 400 });
  }

  let contextBlocks = '';
  if (sectionContent) {
    contextBlocks += `\n\n## Active Section: ${sectionSlug ?? 'unknown'}\n${sectionContent}`;
  }

  const firecrawlKey = process.env.FIRECRAWL_API_KEY ?? '';
  if (firecrawlKey) {
    const [devDocs, helpDocs] = await Promise.all([
      sources.includes('dev-docs')
        ? fetchFirecrawlDocs(question, 'developer.okta.com', firecrawlKey)
        : Promise.resolve(''),
      sources.includes('help-docs')
        ? fetchFirecrawlDocs(question, 'help.okta.com', firecrawlKey)
        : Promise.resolve(''),
    ]);
    if (devDocs) contextBlocks += `\n\n## Okta Developer Docs\n${devDocs}`;
    if (helpDocs) contextBlocks += `\n\n## Okta Help Docs\n${helpDocs}`;
  }

  const client = new OpenAI({
    apiKey: process.env.LITELLM_API_KEY,
    baseURL: `${process.env.LITELLM_API_URL ?? 'https://llm.atko.ai'}/v1`,
  });

  const stream = await client.chat.completions.create({
    model: process.env.CLAUDE_MODEL ?? 'claude-4-6-sonnet',
    max_tokens: 1024,
    stream: true,
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT + (contextBlocks ? `\n\n# Reference Context${contextBlocks}` : ''),
      },
      { role: 'user', content: question },
    ],
  });

  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? '';
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
