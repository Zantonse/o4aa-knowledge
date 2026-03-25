import type { ContentCardData } from '@/lib/types';

// Detect paragraphs that start with a label pattern like:
// "Step 1:", "Layer 1 —", "Priority 1 —", "okta-cross-app:", "HIPAA:", etc.
const LABEL_PATTERN = /^([A-Za-z0-9][A-Za-z0-9 /().+-]{0,40}?(?::|—))\s*/;

function splitLabel(text: string): { label: string; rest: string } | null {
  const match = text.match(LABEL_PATTERN);
  if (!match) return null;
  const label = match[1].trim();
  const rest = text.slice(match[0].length);
  // Only treat as a label if what follows is substantial (not a one-word false match)
  if (rest.length < 20) return null;
  return { label, rest };
}

export default function ContentCard({ card, index }: { card: ContentCardData; index?: number }) {
  return (
    <div
      className="rounded-xl mb-5 overflow-hidden"
      style={{
        background: '#ffffff',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
      }}
    >
      {/* Card heading with left accent stripe */}
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
          className="text-[12.5px] font-semibold uppercase tracking-wide"
          style={{ color: '#00297A', letterSpacing: '0.05em' }}
        >
          {card.heading}
        </h3>
      </div>

      {/* Card body */}
      <div className="px-6 py-5">
        {card.paragraphs.map((p, i) => {
          const parsed = splitLabel(p);

          return (
            <div
              key={i}
              className={i > 0 ? 'mt-4' : ''}
              style={{
                paddingTop: i > 0 ? '12px' : 0,
                borderTop: i > 0 ? '1px solid #F8FAFC' : 'none',
              }}
            >
              {parsed ? (
                <p
                  className="text-[14px] leading-[1.75]"
                  style={{ color: '#334155' }}
                >
                  <span
                    className="font-semibold inline-block mr-1.5"
                    style={{
                      color: '#0F172A',
                      fontFamily: "'JetBrains Mono', 'DM Sans', monospace",
                      fontSize: '12.5px',
                      background: '#F1F5F9',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      border: '1px solid #E2E8F0',
                      verticalAlign: 'baseline',
                    }}
                  >
                    {parsed.label}
                  </span>
                  {' '}{parsed.rest}
                </p>
              ) : (
                <p
                  className={`leading-[1.75] ${i === 0 ? 'text-[14.5px]' : 'text-[14px]'}`}
                  style={{
                    color: i === 0 ? '#1E293B' : '#334155',
                    ...(i === 0 ? { fontWeight: 450 } : {}),
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
