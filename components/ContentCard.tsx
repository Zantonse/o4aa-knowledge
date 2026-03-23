import type { ContentCardData } from '@/lib/types';

export default function ContentCard({ card }: { card: ContentCardData }) {
  return (
    <div
      className="rounded-xl p-5 mb-4"
      style={{ background: '#fff', border: '1px solid #e8e0d4' }}
    >
      <h3
        className="text-[11px] font-bold uppercase tracking-wide mb-3"
        style={{ color: '#78350f' }}
      >
        {card.heading}
      </h3>
      <div className="space-y-2">
        {card.paragraphs.map((p, i) => (
          <p key={i} className="text-[13px] leading-relaxed" style={{ color: '#44403c' }}>
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
