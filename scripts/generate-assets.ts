import OpenAI from 'openai';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { CONTENT_MAP } from '../lib/content/index';

const client = new OpenAI({
  apiKey: process.env.LITELLM_API_KEY!,
  baseURL: `${process.env.LITELLM_API_URL ?? 'https://llm.atko.ai'}/v1`,
});
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini/gemini-2.0-flash-preview-image-generation';
const PUBLIC = join(process.cwd(), 'public');

async function generateImage(prompt: string): Promise<string> {
  const res = await client.images.generate({
    model: GEMINI_MODEL,
    prompt,
    n: 1,
    size: '1024x1024',
    response_format: 'b64_json',
  });
  const b64 = res.data?.[0]?.b64_json;
  if (!b64) throw new Error('No image returned');
  return b64;
}

async function main() {
  mkdirSync(join(PUBLIC, 'icons'), { recursive: true });
  mkdirSync(join(PUBLIC, 'diagrams'), { recursive: true });

  for (const [slug, section] of Object.entries(CONTENT_MAP)) {
    // Icon
    console.log(`Icon: ${slug}`);
    try {
      const b64 = await generateImage(
        `Simple flat icon for "${section.title}". Warm amber and cream palette. Clean minimal illustration. Square, centered on white background.`
      );
      writeFileSync(join(PUBLIC, 'icons', `${slug}.png`), Buffer.from(b64, 'base64'));
      console.log('  ✓');
    } catch (e) { console.error('  ✗', e instanceof Error ? e.message : e); }

    // Diagram
    if (section.hasDiagram) {
      console.log(`Diagram: ${slug}`);
      try {
        const b64 = await generateImage(section.diagramPrompt);
        writeFileSync(join(PUBLIC, 'diagrams', `${slug}.png`), Buffer.from(b64, 'base64'));
        console.log('  ✓');
      } catch (e) { console.error('  ✗', e instanceof Error ? e.message : e); }
    }

    await new Promise(r => setTimeout(r, 500)); // rate limit buffer
  }
  console.log('\nDone.');
}

main().catch(console.error);
