import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { CONTENT_MAP } from '@/lib/content/index';

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: { section?: string };
  try {
    body = await req.json() as typeof body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { section } = body;
  if (!section) return NextResponse.json({ error: 'section is required' }, { status: 400 });

  const content = CONTENT_MAP[section];
  if (!content) return NextResponse.json({ error: `Unknown section: ${section}` }, { status: 404 });
  if (!content.hasDiagram) return NextResponse.json({ error: 'Section has no diagram' }, { status: 400 });

  const client = new OpenAI({
    apiKey: process.env.LITELLM_API_KEY,
    baseURL: `${process.env.LITELLM_API_URL ?? 'https://llm.atko.ai'}/v1`,
  });

  try {
    const response = await client.images.generate({
      model: process.env.GEMINI_MODEL ?? 'gemini/gemini-2.0-flash-preview-image-generation',
      prompt: content.diagramPrompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
    });

    const b64 = response.data?.[0]?.b64_json;
    if (!b64) return NextResponse.json({ error: 'No image returned' }, { status: 500 });

    return NextResponse.json({ imageDataUrl: `data:image/png;base64,${b64}` });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Image generation failed';
    console.error('[generate-diagram]', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
