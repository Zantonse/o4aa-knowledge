import type { SectionContent } from '@/lib/types';
import ContentCard from './ContentCard';
import DiagramCard from './DiagramCard';
import NewBadge from './NewBadge';
import { SLUG_MAP } from '@/lib/sections';

export default function SectionPage({ content }: { content: SectionContent }) {
  const navItem = SLUG_MAP[content.slug];

  return (
    <div className="px-9 py-7 max-w-3xl">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: '#fef3c7', border: '1px solid #fcd34d' }}
        >
          {content.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-extrabold tracking-tight" style={{ color: '#1c1917' }}>
              {content.title}
            </h1>
            {navItem?.isNew && <NewBadge />}
          </div>
          <p className="text-sm leading-snug mb-2" style={{ color: '#78716c' }}>
            {content.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {content.tags.map(tag => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
                style={{ background: '#fef3c7', borderColor: '#fde68a', color: '#92400e' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Cards: insert diagram after first card */}
      {content.cards.map((card, i) => (
        <div key={i}>
          <ContentCard card={card} />
          {content.hasDiagram && i === 0 && <DiagramCard section={content} />}
        </div>
      ))}
    </div>
  );
}
