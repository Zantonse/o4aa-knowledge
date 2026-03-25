import type { ContentCardData } from '@/lib/types';

export default function ContentCard({ card }: { card: ContentCardData }) {
  return (
    <div
      className="rounded-xl p-5 mb-4"
      style={{ background: '#ffffff', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
    >
      <h3
        className="text-[11px] font-bold uppercase tracking-wide mb-3"
        style={{ color: '#00297A' }}
      >
        {card.heading}
      </h3>
      <div className="space-y-2">
        {card.paragraphs.map((p, i) => (
          <p key={i} className="text-[13px] leading-relaxed" style={{ color: '#334155' }}>
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
