'use client';

import type { ContentCardData } from '@/lib/types';

// Detect paragraphs that start with a label pattern like:
// "Step 1:", "Layer 1 —", "okta-cross-app:", "HIPAA:", etc.
const LABEL_PATTERN = /^([A-Za-z0-9][A-Za-z0-9 /().+-]{0,40}?(?::|—))\s*/;

function splitLabel(text: string): { label: string; rest: string } | null {
  const match = text.match(LABEL_PATTERN);
  if (!match) return null;
  const label = match[1].trim();
  const rest = text.slice(match[0].length);
  if (rest.length < 20) return null;
  return { label, rest };
}

// Split long paragraphs into 2-3 sentence visual blocks
function splitIntoBlocks(text: string): string[] {
  const sentences = text.split(/(?<=[.!?])\s+(?=[A-Z"'])/);
  if (sentences.length <= 3) return [text];
  const blocks: string[] = [];
  let current: string[] = [];
  for (const sentence of sentences) {
    current.push(sentence);
    if (current.length >= 2 && (current.length >= 3 || current.join(' ').length > 200)) {
      blocks.push(current.join(' '));
      current = [];
    }
  }
  if (current.length > 0) blocks.push(current.join(' '));
  return blocks;
}

// Special paragraph types detected by prefix:
// >> = callout/quote (blue left border)
// ?? = discovery question (question icon)
// !! = key insight/highlight (light blue background)
// TT = talk track (green left border)
type ParagraphType = 'normal' | 'callout' | 'question' | 'highlight' | 'talkttrack';

function detectType(text: string): { type: ParagraphType; content: string } {
  if (text.startsWith('>> ')) return { type: 'callout', content: text.slice(3) };
  if (text.startsWith('?? ')) return { type: 'question', content: text.slice(3) };
  if (text.startsWith('!! ')) return { type: 'highlight', content: text.slice(3) };
  if (text.startsWith('TT ')) return { type: 'talkttrack', content: text.slice(3) };
  return { type: 'normal', content: text };
}

function RichParagraph({ text, isFirst }: { text: string; isFirst: boolean }) {
  const { type, content } = detectType(text);

  if (type === 'callout') {
    return (
      <div
        className="rounded-lg my-3"
        style={{
          borderLeft: '3px solid #00297A',
          background: '#F0F4FF',
          padding: '14px 18px',
        }}
      >
        <p className="text-[14px] leading-[1.8]" style={{ color: '#1E293B', fontWeight: 450 }}>
          {content}
        </p>
      </div>
    );
  }

  if (type === 'question') {
    return (
      <div
        className="flex gap-3 rounded-lg my-3"
        style={{
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
          padding: '12px 16px',
        }}
      >
        <span className="text-[18px] flex-shrink-0 mt-0.5">?</span>
        <p className="text-[14px] leading-[1.8] italic" style={{ color: '#92400E' }}>
          {content}
        </p>
      </div>
    );
  }

  if (type === 'highlight') {
    return (
      <div
        className="rounded-lg my-3"
        style={{
          background: '#EFF6FF',
          border: '1px solid #DBEAFE',
          padding: '14px 18px',
        }}
      >
        <p className="text-[14px] leading-[1.8] font-medium" style={{ color: '#1E40AF' }}>
          {content}
        </p>
      </div>
    );
  }

  if (type === 'talkttrack') {
    return (
      <div
        className="rounded-lg my-3"
        style={{
          borderLeft: '3px solid #059669',
          background: '#F0FDF4',
          padding: '14px 18px',
        }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="text-[9px] font-bold uppercase px-2 py-0.5 rounded"
            style={{
              background: '#DCFCE7',
              color: '#166534',
              border: '1px solid #BBF7D0',
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '0.06em',
            }}
          >
            Talk Track
          </span>
        </div>
        <p className="text-[14px] leading-[1.8]" style={{ color: '#1E293B' }}>
          {content}
        </p>
      </div>
    );
  }

  // Normal paragraph — split into visual blocks
  const blocks = splitIntoBlocks(content);
  return (
    <div>
      {blocks.map((block, bi) => (
        <p
          key={bi}
          className="leading-[1.85]"
          style={{
            fontSize: isFirst && bi === 0 ? '14.5px' : '14px',
            color: isFirst && bi === 0 ? '#1E293B' : '#334155',
            fontWeight: isFirst && bi === 0 ? 450 : 400,
            letterSpacing: '-0.005em',
            marginTop: bi > 0 ? '10px' : 0,
          }}
        >
          {block}
        </p>
      ))}
    </div>
  );
}

export default function ContentCard({ card, index }: { card: ContentCardData; index?: number }) {
  return (
    <div
      className="rounded-xl mb-5 overflow-hidden transition-shadow duration-200"
      style={{
        background: '#ffffff',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)'; }}
    >
      {/* Card heading */}
      <div
        className="px-6 py-3.5 flex items-center gap-3"
        style={{ borderBottom: '1px solid #F1F5F9', background: '#FAFCFF' }}
      >
        {typeof index === 'number' && (
          <span
            className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold"
            style={{ background: '#EFF6FF', color: '#1E40AF', border: '1px solid #DBEAFE' }}
          >
            {index + 1}
          </span>
        )}
        <h3
          className="text-[12.5px] font-semibold uppercase"
          style={{ color: '#00297A', letterSpacing: '0.05em' }}
        >
          {card.heading}
        </h3>
      </div>

      {/* Card body */}
      <div className="px-6 py-5">
        {card.paragraphs.map((p, i) => {
          const parsed = splitLabel(p);
          const { type } = detectType(p);
          const isSpecial = type !== 'normal';

          return (
            <div
              key={i}
              style={{
                marginTop: i > 0 && !isSpecial ? '20px' : i > 0 ? '4px' : 0,
                paddingTop: i > 0 && !isSpecial ? '20px' : 0,
                borderTop: i > 0 && !isSpecial ? '1px solid #F1F5F9' : 'none',
              }}
            >
              {isSpecial ? (
                <RichParagraph text={p} isFirst={i === 0} />
              ) : parsed ? (
                <div>
                  <span
                    className="inline-block mb-2"
                    style={{
                      color: '#0F172A',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '11.5px',
                      fontWeight: 600,
                      background: '#F1F5F9',
                      padding: '3px 10px',
                      borderRadius: '5px',
                      border: '1px solid #E2E8F0',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {parsed.label}
                  </span>
                  {splitIntoBlocks(parsed.rest).map((block, bi) => (
                    <p
                      key={bi}
                      className="text-[14px] leading-[1.85]"
                      style={{ color: '#334155', marginTop: bi === 0 ? '6px' : '10px' }}
                    >
                      {block}
                    </p>
                  ))}
                </div>
              ) : (
                <RichParagraph text={p} isFirst={i === 0} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
