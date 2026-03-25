'use client';

import type { ContentCardData } from '@/lib/types';

// Detect paragraphs that start with a label pattern like:
// "Step 1:", "Layer 1 —", "Priority 1 —", "okta-cross-app:", "HIPAA:", etc.
const LABEL_PATTERN = /^([A-Za-z0-9][A-Za-z0-9 /().+-]{0,40}?(?::|—))\s*/;

function splitLabel(text: string): { label: string; rest: string } | null {
  const match = text.match(LABEL_PATTERN);
  if (!match) return null;
  const label = match[1].trim();
  const rest = text.slice(match[0].length);
  if (rest.length < 20) return null;
  return { label, rest };
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
        style={{
          borderBottom: '1px solid #F1F5F9',
          background: '#FAFCFF',
        }}
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
          const isFirst = i === 0;

          return (
            <div
              key={i}
              style={{
                marginTop: i > 0 ? '16px' : 0,
                paddingTop: i > 0 ? '16px' : 0,
                borderTop: i > 0 ? '1px solid #F1F5F9' : 'none',
              }}
            >
              {parsed ? (
                <div>
                  <span
                    className="inline-block mb-1.5"
                    style={{
                      color: '#0F172A',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '11.5px',
                      fontWeight: 600,
                      background: '#F1F5F9',
                      padding: '2px 8px',
                      borderRadius: '5px',
                      border: '1px solid #E2E8F0',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {parsed.label}
                  </span>
                  <p
                    className="text-[14px] leading-[1.8]"
                    style={{ color: '#334155', marginTop: '4px' }}
                  >
                    {parsed.rest}
                  </p>
                </div>
              ) : (
                <p
                  className="leading-[1.8]"
                  style={{
                    fontSize: isFirst ? '14.5px' : '14px',
                    color: isFirst ? '#1E293B' : '#334155',
                    fontWeight: isFirst ? 450 : 400,
                    letterSpacing: '-0.005em',
                  }}
                >
                  {p}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
